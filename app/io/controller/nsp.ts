import { Controller } from 'egg';

export default class NspController extends Controller {
  public async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    nsp.emit('router', {msg: '这里是路由exchange返回', clientId: client, message: '收到的message为' + message.my});
  }

  public async newmsg() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;
    nsp.emit('router', {msg: '这里是newmsg路由返回', clientId: client, message: '收到的message为' + message.my});
  }

  public async getLoginUser() {

  }

  public async sendMsg() {
    const { ctx, app } = this;
    const socket = ctx.socket;
    const nsp = app.io.of('/');
    const user = socket.user
    const message = ctx.args[0] || {};
    const client = socket.id;
    const msg = ctx.helper.parseMsg('broadcast', message, { client }, user);

    nsp.emit('broadcast', msg);
  }

  // 发送私聊消息
  public async privateMsg() {
    const { ctx, app } = this;
    const socket = ctx.socket;
    const nsp = app.io.of('/');
    const data = ctx.args[0] || {};

    nsp.emit(data.socketId, {
      status: 'privateMsg',
      user: socket.user,
      msg: data.message
    });
  }

  // 获取在线用户
  public  async getOnline() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    console.log('// 获取在线用户');
    nsp.adapter.clients((err, clients) => {
      if (err) throw err;
      const userList = clients.map(client => {
        const _client = app.io.sockets.sockets[client];
        return _client.user;
      });
      nsp.emit('online', userList)
    });
  }
}
