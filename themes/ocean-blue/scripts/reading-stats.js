hexo.extend.helper.register('wordCount', function(content) {
  if (!content) return 0;
  
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = cleanContent
    .replace(/[\u4e00-\u9fff]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  
  return chineseChars + englishWords;
});

hexo.extend.helper.register('readingTime', function(content, wordsPerMinute = 200) {
  if (!content) return 0;
  
  const wordCount = hexo.extend.helper.get('wordCount').call(this, content);
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return minutes;
});

hexo.extend.helper.register('formatReadingTime', function(content, wordsPerMinute = 200) {
  const minutes = hexo.extend.helper.get('readingTime').call(this, content, wordsPerMinute);
  
  if (minutes < 1) {
    return '< 1 分钟';
  } else if (minutes === 1) {
    return '1 分钟';
  } else {
    return `${minutes} 分钟`;
  }
});