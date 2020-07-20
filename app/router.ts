import { Application } from 'egg';
import { getRouter } from './decorator/router'

export default async (app: Application) => {

  const { router, controller, io } = app
  getRouter(app, {
    prefix: '/api', // 全局的前缀， 只影响到装饰器写的接口
  })

  router.get('/', controller.index.index)

  io.of('/').route('sendMsg', io.controller.nsp.sendMsg);
  io.of('/').route('sendPrivateMsg', io.controller.nsp.privateMsg);
  io.of('/').route('getOnline', io.controller.nsp.getOnline);

};
