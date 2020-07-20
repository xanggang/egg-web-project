import { Context } from 'egg';

export default function robotMiddleware() {

  return async (ctx: Context, next: any) => {
    const { app, socket } = ctx;
    const nsp = app.io.of('/');

    await next();

    // 获取用户列表
    nsp.adapter.clients((err, clients) => {
      if (err) throw err;
      const userList = clients.map(client => {
        const _client = app.io.sockets.sockets[client];
        return _client.user;
      });
      // ctx.logger.error(clients, '--------')
      // nsp.emit('online', userList)
    });
  };
}
