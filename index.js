'use strict';

const { getColorFromURL} = require('./src/color-thief');

hexo.extend.filter.register('before_post_render', async function (data) {
  const { cover } = data;

  if (cover) {
    try {

      // 获取文章封面图片路径
      const imageUrl = cover;

      // 获取图片主色调
      const dominantColor = await getColorFromURL(imageUrl);

      // 将颜色转换为HEX格式
      const hexColor = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);

      // 将主题色添加到文章数据中
      // console.log(hexColor);
      data.main_color = hexColor;
    } catch (error) {
      console.error(`Error fetching theme color from image: ${error}`);
    }
  }

  return data;
});

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}