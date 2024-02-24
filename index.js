'use strict';

const { getColorFromURL } = require('./src/color-thief');
const logger = require('hexo-log').default();
const fs = require('hexo-fs');
const frontMatter = require('hexo-front-matter');

hexo.extend.filter.register('before_post_render', async function (data) {
  const config = hexo.config.imageColor || hexo.theme.config.imageColor
  const postColor = data.main_color;

  // 存在自定义文章主色调 或 没有文章封面 或 配置没有开启时跳出
  if (!data.cover || !(config && config.enable)) return;

  try {
    // 获取文章封面图片路径
    const imageUrl = data.cover;
    // 异步获取图片主色调
    const dominantColor = await getColorFromURL(imageUrl);
    // 将颜色转换为HEX格式
    const ImgColorHex = colorHex(`rgb(${dominantColor})`);
    let adjustedColor = ImgColorHex;

    // 图片亮度调整
    if (getContrastYIQ(ImgColorHex) === "light") {
      adjustedColor = LightenDarkenColor(ImgColorHex, -40);
    }
    // 新获取的颜色和原来相同时跳出
    if (adjustedColor === postColor) return;

    // 默认输出日志信息
    if (!(config && config.log === false)) {
      logger.info(`文章《${data.title}》的主色调：${adjustedColor}`);
    }
    // 将主题色添加到文章数据中    
    data.main_color = adjustedColor;

    // 只有在处理.md文件时更新Front Matter和源文件
    if (/\.md$/.test(data.source)) {
      // 解析原始Front Matter
      const parsedPost = frontMatter.parse(data.raw);

      // 添加新的主色调属性
      parsedPost.main_color = adjustedColor;

      // 重新生成包含新主色调的Front Matter的Markdown内容
      const processedPostStr = frontMatter.stringify(parsedPost);
      const updatedContent = '---\n' + processedPostStr;

      // 更新源文件
      await fs.writeFile(data.full_source, updatedContent, 'utf-8');
    }
  } catch (error) {
    logger.error(`提取文章《${data.title}》封面图像的主题颜色时出错: ${error}`);
  }

  return data;
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

// Determine whether a color is light or dark
const getContrastYIQ = hexcolor => {
  const colorRgb = color => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  };

  const colorrgb = colorRgb(hexcolor);
  const colors = colorrgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  const [_, red, green, blue] = colors;

  const brightness = (red * 299 + green * 587 + blue * 114) / 255000;

  return brightness >= 0.5 ? "light" : "dark";
};

// Lighten or darken a color
const LightenDarkenColor = (col, amt) => {
  const usePound = col.startsWith("#");

  if (usePound) {
    col = col.slice(1);
  }

  let num = parseInt(col, 16);

  const processColor = (colorValue, amount) => {
    colorValue += amount;
    return colorValue > 255 ? 255 : colorValue < 0 ? 0 : colorValue;
  };

  const r = processColor(num >> 16, amt);
  const b = processColor((num >> 8) & 0x00ff, amt);
  const g = processColor(num & 0x0000ff, amt);

  return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
};
