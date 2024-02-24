## 文章图片主色调获取

### 安装

```bash
npm i hexo-naokuo-image-color --save
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
  enable: true # true or false 文章是否启用获取图片主色调
  # log: false
```
 
### 引用库

- [color-thief-node](https://github.com/zicodeng/color-thief-node)
- [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas)
- 部分代码来自[hexo-theme-anzhiyu](https://github.com/anzhiyu-c/hexo-theme-anzhiyu)