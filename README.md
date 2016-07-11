

koa自动加载路由 不区分http请求方法

## Installation

```sh
$ npm install koa-resource-router
```

## Use with koa

```js
var app = require('koa')();
var koaResourceRouter = require('koa-resource-router');
app.use(koaResourceRouter(app, {
    root: './app/controller',
    suffix: '.js',
    action: 'index'
}));

exports.index = function*(ctx, next){
	console.log(ctx);
	console.log(ctx.query);
	console.log(ctx.params);
}

```
作者官网:
http://www.wemallshop.com