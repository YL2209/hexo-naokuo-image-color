'use strict';

const node_fetch = require("node-fetch");
const logger = require('hexo-log').default();
const fs = require('hexo-fs');
const frontMatter = require('hexo-front-matter');

hexo.extend.filter.register('before_post_render', async function (Posts) {
  const config = hexo.config.imageColor || hexo.theme.config.imageColor

  // 存在自定义文章主色调 或 没有文章封面 或 配置没有开启时跳出
  if (!Posts.cover || Posts.main_color || !config.enable) return;

  try {
    // 获取图片主色调API
    const color_API = config.api_url;
    // 获取文章封面图片路径
    const imageUrl = Posts.cover;
    // 获取图片主色调链接拼接
    const dominantColor = color_API + imageUrl;
    let adjustedColor;

    // 发起一个 GET 请求
    await fetch(dominantColor)
      .then(response => {
        // 检查响应状态码是否正常
        if (!response.ok) return;

        // 如果需要JSON格式的数据，则解析响应体
        return response.json();
      })
      .then(data => {
        // 将颜色转换为HEX格式
        const ImgColorHex = colorHex(data.RGB);
        adjustedColor = ImgColorHex;

        // 默认输出日志信息
        if (!config.log == true) {
          logger.info(`文章《${Posts.title}》的主色调：${adjustedColor}`);
        }

        // 将主题色添加到文章数据中    
        Posts.main_color = adjustedColor;

        // 只有在处理.md文件时更新Front Matter和源文件
        if (/\.md$/.test(Posts.source)) {
          // 解析原始Front Matter
          const parsedPost = frontMatter.parse(Posts.raw);

          // 添加新的主色调属性
          parsedPost.main_color = adjustedColor;

          // 重新生成包含新主色调的Front Matter的Markdown内容
          const processedPostStr = frontMatter.stringify(parsedPost);
          const updatedContent = '---\n' + processedPostStr;

          // 更新源文件
          fs.writeFile(Posts.full_source, updatedContent, 'utf-8');
        }
      })
      .catch(error => {
        logger.error(`提取文章《${Posts.title}》封面图像的主题颜色时出错: ${error}`);
      });
  } catch (error) {
    logger.error(`提取文章《${Posts.title}》封面图像的主题颜色时出错: ${error}`);
  }

  return Posts;
});

//RGB颜色转化为16进制颜色
const colorHex = str => {
  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  if (/^(rgb|RGB)/.test(str)) {
    const aColor = str.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    return aColor.reduce((acc, val) => {
      const hex = Number(val).toString(16).padStart(2, "0");
      return acc + hex;
    }, "#");
  }

  if (hexRegex.test(str)) {
    if (str.length === 4) {
      return Array.from(str.slice(1)).reduce((acc, val) => acc + val + val, "#");
    }
    return str;
  }

  return str;
};