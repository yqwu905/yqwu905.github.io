# Ocean Blue - Hexo 主题

> 简洁、优雅、现代的蓝色主题

## 特性

- 🎨 **现代设计**: 采用现代扁平化设计，界面简洁优雅
- 🌊 **海洋蓝主色调**: 以蓝色为主的配色方案，给人清新舒适的感觉
- 📱 **响应式布局**: 完美适配桌面、平板、手机等各种设备
- ⚡ **性能优化**: 轻量级设计，快速加载
- 🛠️ **高度可定制**: 丰富的配置选项，满足不同需求
- 🌍 **多语言支持**: 支持中文、英文等多种语言
- 🔍 **搜索功能**: 内置搜索功能（可选）
- 💬 **评论系统**: 支持多种评论系统
- 📊 **统计分析**: 支持 Google Analytics、百度统计等

## 安装

### 1. 下载主题

```bash
cd your-hexo-site
git clone https://github.com/your-username/hexo-theme-ocean-blue.git themes/ocean-blue
```

### 2. 应用主题

修改站点配置文件 `_config.yml`：

```yaml
theme: ocean-blue
```

### 3. 安装依赖

```bash
npm install hexo-renderer-sass --save
```

## 配置

### 主题配置

复制主题配置文件并根据需要修改：

```bash
cp themes/ocean-blue/_config.yml themes/ocean-blue/_config.yml.backup
```

### 基本配置

```yaml
# 导航菜单
menu:
  首页: /
  归档: /archives/
  分类: /categories/
  标签: /tags/
  关于: /about/

# 主题颜色
theme_color: "#2196F3"
accent_color: "#03A9F4"

# 侧边栏
layout:
  sidebar: true
  sidebar_position: right

# 文章设置
article:
  excerpt_link: "阅读全文"
  show_meta: true
  show_tags: true
  show_categories: true
```

### 社交链接

```yaml
social:
  github: "https://github.com/your-username"
  twitter: "https://twitter.com/your-username"
  facebook: "https://facebook.com/your-username"
```

### 评论系统

```yaml
comments:
  enable: true
  provider: disqus
  disqus_shortname: "your-disqus-shortname"
```

### 统计分析

```yaml
analytics:
  google: "your-google-analytics-id"
  baidu: "your-baidu-analytics-id"
```

## 自定义

### 自定义 CSS

在主题配置文件中添加自定义样式：

```yaml
custom_css: |
  .custom-class {
    color: #your-color;
  }
```

### 自定义 JavaScript

```yaml
custom_js: |
  console.log('Custom JavaScript');
```

## 页面模板

### 创建关于页面

```bash
hexo new page about
```

编辑 `source/about/index.md`：

```markdown
---
title: 关于
date: 2023-01-01
layout: page
---

这里是关于页面的内容。
```

### 创建分类页面

```bash
hexo new page categories
```

编辑 `source/categories/index.md`：

```markdown
---
title: 分类
date: 2023-01-01
type: "categories"
layout: page
---
```

### 创建标签页面

```bash
hexo new page tags
```

编辑 `source/tags/index.md`：

```markdown
---
title: 标签
date: 2023-01-01
type: "tags"
layout: page
---
```

## 写作

### Front Matter

```markdown
---
title: 文章标题
date: 2023-01-01 12:00:00
categories:
  - 分类名
tags:
  - 标签1
  - 标签2
excerpt: 文章摘要
---

文章内容...
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- IE 11+

## 更新日志

### v1.0.0
- 初始版本发布
- 基础布局和样式
- 响应式设计
- 多语言支持

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 支持

如果你喜欢这个主题，请给个 ⭐️ Star！

---

**Ocean Blue** - 让你的博客如海洋般深邃美丽