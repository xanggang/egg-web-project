### 
一个ts+egg+vue的前后端同构项目脚手架， 已经接入mysql、socket.io。 留作备份， 万一哪天还行用上呢

### 文件目录
```
|-- app egg核心目录
    |-- controller 控制器， 所有的接口都在这里
    |-- decorator 装饰器
        |-- router 路由装饰器
    |-- extend 
        |-- context 封装的方法
    |-- middleware 
        |-- auth 权限检验中间件
    |-- public 编译后web文件会放在这里
    |-- service
    |-- view web的index.html模板
|-- config egg配置文件
|-- logs 本地日志
|-- run 本地运行日志
|-- test 单元测试
|-- typings 脚手架自动生成的ts声明文件
|-- web 前端根目录文件
|-- .autod.conf.js egg的配置
|-- tsconfig.json
|-- .browserslistrc web的配置， 这个值会被 @babel/preset-env 和 Autoprefixer
    用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。
|-- babel.config.js web的babel配置
|-- vue.config.js vue webpack配置
```

### package.json命令说明
web: 本地启动web项目
dev: 本期启动node服务
build: 线上构建命令
start: 线上启动命令， 自带pm2 相关功能， 不需要使用pm2启动， --workers=1 限制单线程运行
stop: 停止服务
tsc: 线上运行最好的直接运行js文件， 这个命令将ts文件编译成js文件
clean: 清楚js文件
test-local： 单元测试
### 路由装饰器
提供了常用的请求方法的装饰器。
使用方法： 
``` 
// router
import { getRouter } from './decorator/router'
export default async (app: Application) => {
  const { router, controller } = app
  getRouter(app, {
    prefix: '/api', // 全局的前缀， 只影响到装饰器写的接口
  })
};

// controller

import { Prefix, Get, Post } from '../decorator/router'
import auth from '../middleware/auth'
import jaeger from '../middleware/jaeger'

@Prefix('/user) // 该控制器的前缀
class AuthorityController extends Controller {

  @Post('/login'， [jaeger, auth]) // 请求方式和地址  完整路径： /api/user/login
  public async login() {
    const bean = new SysUserBean(this.ctx.request.body)
    this.ctx.handleAuthorityDuboo(
      await this.app.dubboClinent.service.IUserServiceProvider.login(bean)
    )
  }
  
}
```


### 和web页面的集成
本脚手架建议使用vue-cli搭建的前端web项目， 其他项目需要按照以下规则配置webpack
```
  outputDir: './app/public',
  assetsDir: './static',
  publicPath: isDev ? '/' : './public',
  indexPath: '../view/index.html',
```

为了方便开发和维护（其实也不方便）， 将node和web端的依赖继承到一起了， 公用一个node_modules文件夹。
带来的好处是install更快，也减少了项目体积， 缺点就是在package里面的依赖会更乱。

web页面和全部文件都放在根目录下的web文件夹。 
开发的时候需要分别启动node项目和web项目， 并且需要配置代理到node的端口

### 静态文件
web的静态文件依赖默认放在`web/public`下， html模板在`web/public/index.html`， 在build时会拷贝至`app/public`目录。
部署时web相关文件通过 `www.aa.com/public`来访问。 
而通过webpack编译的文件会放在`app/public/static`目录。
在web开发的时候如果使用绝对路径， 则需要添加process.env.BASE_URL
在`web/public/index.html`中引入的依赖也需要添加BASE_URL

```
    <img :src="publicPath + '/ttxt.jpg'" alt="">
    data() {
      return {
        publicPath: process.env.BASE_URL
      }
    }
    
```
相关的配置在`vue.config.js`

#### 更新记录
##### 2020-2-18 添加egg-http-proxy2插件用来实现http代理

在`config/plugin.ts`下添加了名为`egg-http-proxy2`的插件， 应为在本项目中没有nginx， 在必要情况下需要在前端页面使用反向代理的时候
可以开启这个插件。 分别在`config.local` `config.default`添加对应的配置。

