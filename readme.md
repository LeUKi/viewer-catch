# viewer-catch

一个站点流量与赞的统计平台。基于 Koa 和 MongoDB。

## 背景

我的静态博客没有动态网站的访客统计功能，又觉得国内的统计平台不好用，所以还得自己来。

## 它能做什么

- [x] 统计任意站点任意页面的访问量和点赞数

- [x] 支持统计 PV 与 UV

- [x] 支持标准引入与简单引入

- [x] 预留查询接口

- [x] 支持在任何页面中客制化展示数据

- [x] 任何人都能依靠此项目快速上线自己的平台

## 使用

### 标准引入

标准引入支持点赞数、 PV 与 UV 统计和客制化展示数据。[Demo (codePen)](https://codepen.io/leuki/pen/LYjdbYm)

#### 前置准备

head 标签中添加以下这段代码，当然也可以替换成你架设的服务域名：

```html
<script defer src="https://viewer-catch.herokuapp.com/client.js">
```

#### 数据展示

虽然不是必要的，但如果你不需要，建议你使用`简单引入`。

标准引入提供了 8 个 CSS 类名、2 个元素属性：

- 控制类：

  - `.VCC` 关键类
  - `.VCC_visibility`  当数据类替换完成后，该类元素的 `style.visibility` 将赋为 `visible`。
  - `.VCC_path`  当数据类替换完成后，当且 `location.pathname` 与该类元素的 `pathif` 属性值相等或 `pathifnot` 属性值不等时，其 `style.visibility` 将赋为 `visible`。

- 数据类：

  页面渲染完成后，数据类元素内容将替换为对应数据。

  - `.VCC_uv` 页面UV
  - `.VCC_pv` 页面PV
  - `.VCC_like` 页面点赞数
  - `.VCC_uv_sum` 站点总UV
  - `.VCC_pv_sum` 站点总PV
  - `.VCC_like_sum` 站点总点赞数

以下都是可行的写法：

```html
<style>.VCC_visibility{visibility: hidden;}</style>
<div class='VCC'>
  <div> 页面UV:<span class='VCC_uv'>正在获取</span> </div>
  <div> 页面PV:<span class='VCC_pv VCC_visibility'></span> </div>
  <div class='VCC_visibility'> 页面点赞数:<span class='VCC_like'></span> </div>
</div>
<div class='VCC VCC_visibility VCC_uv_sum'></div>
<div class='VCC VCC_path VCC_pv_sum' pathifnot='/'></div>
<div class='VCC VCC_path VCC_like_sum' pathifnot='/'></div>

```

### 简单引入

简单引入仅支持 PV 统计，且无法在页面中展示数据。

head 标签中添加以下这段代码，同样可以替换成你架设的服务域名：

```html
<script sync src="https://viewer-catch.herokuapp.com/simpleCatch?d=xxx.com&p=/path">
```

因标准请求头限制，必须传参使用。

- d:Doname 站点域名 必填

- p:Path 页面路径 选填 以 `/` 开头 缺省为 `"/"`

### 自己动手

详见 API 文档：

[https://viewer-catch.herokuapp.com/apis](https://viewer-catch.herokuapp.com/apis)（域名可替换）

## 服务架设

### 手动架设

修改服务端配置文件：

```bash
//VCconfig.js
const Config = {
    dbUrl: `${process.env.DBURL}`,//MongoDB Connection String
    dbName: `${process.env.DBNAME}`,//Collection Name
    serviceURL: `${process.env.SERVICEURL||"http://localhost"}`,//服务端URL
    servicePort: `${process.env.PORT||80}`,//服务端端口
    truePort: '',//真实服务端口 一般不用填
}
```

### Heroku 架设

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://dashboard.heroku.com/new?template=https://github.com/LeUKi/viewer-catch)

但如果你使用 Heroku 等平台，修改环境变量即可。你可以参考这篇文章：[利用 MongoDB Atlas 与 Heroku 架设 Free 的后台服务](https://lafish.fun/freedom-service/)。

## 证书

MIT © 2021 [Lafish](http://lafish.fun/)