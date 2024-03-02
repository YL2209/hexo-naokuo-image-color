## 文章图片主色调获取

### 安装

```bash
npm i hexo-naokuo-image-color@beta --save
```

### 用法

- [anzhiyu主题](https://github.com/anzhiyu-c/hexo-theme-anzhiyu) 安装后打开对应配置直接使用
```YAML
# 主色调相关配置
mainTone:
  enable: true # true or false 文章是否启用获取图片主色调
  mode: api # cdn/api/both/local cdn模式为图片url+imageAve参数获取主色调，api模式为请求API获取主色调，both模式会先请求cdn参数，无法获取的情况下将请求API获取，可以在文章内配置main_color: '#3e5658'，使用十六进制颜色，则不会请求both/cdn/api获取主色调，而是直接使用配置的颜色
  # 项目地址：https://github.com/anzhiyu-c/img2color-go
  api: # mode为api时可填写
  cover_change: true # 整篇文章跟随cover修改主色调
```
- `_config.anzhiyu.yml` 或 `_config.yml`

```YAML
imageColor:
  enable: true
  api_url: https://img2color-go.vercel.app/api?img= # 主色调提取API接口链接，项目：https://github.com/yife68/img2color-go
  # log: false # 是否开启日志，默认打开
```
 
### 引用

- 部分代码来自[hexo-theme-anzhiyu](https://github.com/anzhiyu-c/hexo-theme-anzhiyu)