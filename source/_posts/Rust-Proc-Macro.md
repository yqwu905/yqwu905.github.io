---
layout: post
title: 用Rust写一个派生宏
date: 2025-02-05 10:19:52
tags: ['Rust']
---

Rust的宏能力相当强大, 也相当复杂, 最近学习了一下派生宏, 在此做一个记录和分享.  
本文中所有的代码都已上传到[github](https://github.com/yqwu905/regex_capture).  

## Rust的宏系统

Rust的宏系统包含以下类型:

### 声明宏

声明宏根据定义的匹配规则, 来将输入的表达式转换为对应的表达式, 可以理解成一个对句法生效的`match`.  
声明宏的用法相对比较简单, 例如如下的代码中, `test_macro`宏匹配了1和2, 并将其转换成对应的`println!`调用.

```Rust
macro_rules! test_macro {
    (1) => { println!("Hello macro 1!")};
    (2) => { println!("Hello macro 2!")};
}

fn main() {
    test_macro!(1);
    test_macro!(2);
}
```

上述代码的运行结果为:

```plaintext
Hello macro 1!
Hello macro 2!
```

### 过程宏

过程宏在**编译时**运行对Rust代码进行操作的代码, 它在消费掉一些Rust代码的同时, 产生一些新的Rust代码; 从这个角度上, 可以将过程宏看成从Rust的一个AST到另一个AST的函数.  
和声明宏不同, 过程宏**必须**在crate类型为`proc_macro`的crate中定义, 这意味着过程宏必须被作为一个单独的lib来编写和使用.  

```cargo
[lib]
proc-macro = true
```

过程宏分为3种类型:

- 类函数宏: 类函数宏使用时类似于正常的函数, 可以在任何地方调用.
- 派生宏: 派生宏用于结构体/枚举/联合体, 为其自动生成新的代码(而非**修改**).
- 属性宏: 属性宏可以应用于任何Rust元素, 和派生宏不同, 属性宏可以修改应用的元素的代码.

## 写个派生宏

### 需求描述

Rust有非常好用的`serde`库来序列化/反序列化结构体, 但是对于纯文本格式的解析, 则没有一个很好的解决方案. 因此我希望实现一个能够快速自动化生成解析函数的过程宏, 满足以下需求:

- 实现一个名为`regex_capture`的派生宏, 应用于结构体时, 会为其实现`FromStr` trait.
- 该派生宏需要提供一个正则表达式, 通过用正则表达式匹配文本, 实现纯文本解析.
- 该派生宏需要支持为不同字段指定特定的转换函数, 以适配不同类型的字段.
- 综上, 该派生宏实现后使用时类似:

```rust
#[derive(RegexCapture)]
#[converter(regex = r"name=(?P<name>.+?), age=(?P<age>\d+), gender=(?P<gender>male|female)")]
struct Person {
    name: String,
    age: u32,
    #[converter(func = gender_parser)]
    gender: Gender,
}
```

### 属性提取

首先, 我们需要提取结构体中的属性, 即`#[converter(....)]`这样的语法, 我们注意到, `regex`属性每个结构体只需要一个, 因此它应当属于整个结构体; 而`func`属性可以针对每个字段进行指定, 因此它应当属于字段.
我们先认识一下派生宏的大致结构, 派生宏中只有一个公开的函数, 可以是任意名称; `#[proc_macro_derive(RegexCapture, attributes(converter))]`表示这是一个派生宏, 宏名称为`RegexCapture`, 并有一个名为`converter`的属性.
`my_derive`函数是过程宏的主体, 它接收`RegexCapture`宏应用的结构体的AST作为输入, 类型为`TokenStream`; 并将新生成的代码作为输出, 类型也为`TokenStream`

```rust
#[proc_macro_derive(RegexCapture, attributes(converter))]
pub fn my_derive(_input: TokenStream) -> TokenStream {
}
```

接下来, 我们首先来提取`regex`属性:

```rust
let input = parse_macro_input!(_input as DeriveInput);

// parse regex attribute #[converter(regex = "")]
let mut regex = String::new();
for attr in input.attrs {
    if attr.path().is_ident("converter") {
        attr.parse_nested_meta(|meta| {
            if meta.path.is_ident("regex") {
                let value = meta.value()?;
                let regex_lit: LitStr = value.parse()?;
                regex = regex_lit.value();
                return Ok(());
            };
            Err(meta.error("No regex found"))
        })
        .unwrap();
    }
}
```

我们来逐行看下上述的代码, 首先:

```rust
let input = parse_macro_input!(_input as DeriveInput);
```

这一行将输入的`TokenStream`解析成派生宏使用的结构, `DeriveInput`类型对应于派生宏.

```rust
for attr in input.attrs {
```

这个for循环遍历输入的所有属性, 注意这里的`input`对应的是整个结构体, 因此这里能够遍历到结构体的属性, 找到`#[converter(regex = "...")]`, 而不是每个字段的属性; 如何遍历字段的属性我们稍后再说.

```rust
if attr.path().is_ident("converter") {
```

这个if语句判断属性名称是否为`converter`, `path()`方法能获取到属性中对应于`converter`的这一部分, `is_ident`用于判断identifier是否相等.

```rust
attr.parse_nested_meta(|meta| {
    if meta.path.is_ident("regex") {
        let value = meta.value()?;
        let regex_lit: LitStr = value.parse()?;
        regex = regex_lit.value();
        return Ok(());
    };
    Err(meta.error("No regex found"))
})
.unwrap();
```

这段代码匹配`regex = "..."`, `parse_nested_meta`将这一部分以`ParseNestedMeta`类型传递给里面的函数, `meta.path`获取等号左边的表达式, 并判断是否为`regex`; `meta.value()`获取等号右侧的表达式, `value.parse()`将其转换为对应的类型; 由于等号右边是一个字符串, 因此我们将其转换为`LitStr`类型, 并将其赋值给`regex`变量保存起来. 如果属性并非`regex = "..."`, 则panic.

### 结构体字段提取

```rust
let mut fields_token: Vec<TokenStream2> = Vec::new();
// 尝试将输入的AST转换为结构体, 如果转换成功, 则获取其中的fields, 否则则panic
if let Data::Struct(DataStruct {
    fields: Fields::Named(ref fields),
    ..
}) = input.data
{
    // 遍历结构体所有有名字段
    for f in fields.named.iter() {
        // 尝试获取结构体字段的名称
        if let Some(field_name) = f.ident.clone() {
            // 先声明为无需转换函数的字段
            let mut field = StructField::Raw(field_name.to_string());
            // 遍历字段的所有属性
            for attr in f.attrs.clone() {
                // 检查属性是否为converter
                if attr.path().is_ident("converter") {
                    // 解析func=xxx部分
                    let _ = attr.parse_nested_meta(|meta| {
                        // 判断等号左边是否为func
                        if meta.path.is_ident("func") {
                            // 获取等号右边的表达式
                            let value = meta.value()?;
                            // 由于等号右边为标识符(函数), 因此将其转换为Ident类型
                            let s: Ident = value.parse()?;
                            // 该字段配置了converter(func = xxx), 因此为需要转换函数的字段, 并把配置的转换函数保存下来
                            field = StructField::Func(field_name.to_string(), s.to_string());
                            Ok(())
                        } else {
                            // 未配置func=xxx, 返回Err, 外部不处理返回值
                            Err(meta.error("Unsupported attribute"))
                        }
                    });
                }
            }
            // 正则匹配语句, reg_cap为正则匹配的结果, name中填充字段名; 这条语句能够从正则匹配的结果中获取到和字段同名的正则捕获的内容
            let reg_cap_get = format!(
                "reg_cap.name(\"{}\").ok_or(\"Failed to matched regex group {}\")?.as_str()",
                field_name, field_name
            );
            let field_token: TokenStream2 = match field {
                // 未指定转换函数的字段, 直接通过parse方法来转换
                StructField::Raw(ref field) => format!("{}: {}.parse()?,", field, reg_cap_get)
                    .parse()
                    .unwrap(),
                // 指定了转换函数的字段, 调用转换函数来转换
                StructField::Func(ref field, ref func) => {
                    format!("{}: {}({})?,", field, func, reg_cap_get)
                        .parse()
                        .unwrap()
                }
            };
            // 将对应字段的解析代码保存起来
            fields_token.push(field_token);
        }
    }
} else {
    panic!("RegexCapture macro can only be use with struct!");
}
```
