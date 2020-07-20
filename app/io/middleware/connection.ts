import { Context } from 'egg';
import { getRandomName } from '../../../utils/util'
/**
 * 加入聊天室逻辑重构
 * 需求： 一个浏览器只允许加入一次， 第二次会覆盖掉上一次的登陆，
 * 不考虑localhost和127。0。0。1的这种情况
 * 唯一识别id改成socketId
 * **/

export default function connectionMiddleware() {
  return async (ctx: Context, next: any) => {
    const { app, socket } = ctx;

    const nsp = app.io.of('/');
    const id = socket.id;
    const query = socket.handshake.query;
    const token = query.token
    const socketId = query.socketId // 如果浏览器已经登陆过， 则会携带socketId

    // 如果携带socketId， 则视为改浏览器已经进入过聊天室， 则踢出原来的登陆
    if (socketId && socketId !== 'null') {
      nsp.emit(socketId, {msg: '该账号已在其他设备登录， 正在退出房间', status: 'error'});
      app.io.sockets.sockets[socketId] && app.io.sockets.sockets[socketId].disconnect()
    }

    // 匿名登陆用户
    const anonymous = () => {
      ctx.logger.info('未登录账号， 以匿名状态登录')
      let user = {
        userName: getRandomName(5),
        type: 'noLogin',
        socketId: id
      }
      socket.emit(id, {msg: user, status: 'setUser'});
      socket.user = user
    }

    // 没有token 以匿名登录
    if (!token || token === 'null') {
      socket.emit(id, {msg: '未登录账号， 以匿名状态登录', status: 'success'});
      anonymous()
    } else {
      // 校验token失败
      const [err, user] = ctx.service.account.decryptToken(token)
      user.socketId = id
      if (err) {
        ctx.logger.error(err)
        socket.emit(id, {msg: 'token 校验异常， 请重新登陆', status: 'error'});
        socket.emit(id, {msg: 'token 校验异常， 请重新登陆', status: 'loginOut'});
        ctx.socket.disconnect();
        return await next();
      }

      if (!user) {
        ctx.logger.info('token失效');
        socket.emit(id, {msg: 'token失效， 请重新登录， 当前以匿名登录', status: 'error'});
        anonymous()
      } else {
        ctx.logger.info('接入成功')
        socket.emit(id, {msg: '登录成功', status: 'success'});
        socket.emit(id, {msg: user, status: 'setUser'});
        socket.user = user
      }
    }

    nsp.emit('sysBroadcast', `${socket.user.userName}进入聊天室`)

    // 获取用户列表
    // nsp.clients((err, clients) => {
    //   if (err) throw err;
    //   const userList = clients.map(client => {
    //     const _client = app.io.sockets.sockets[client];
    //     return _client.user;
    //   });
    //   nsp.emit('online', userList)
    //   // todo 刚进来的用户收不到nsp.emit的消息
    //   socket.emit(id, {msg: userList, status: 'setOnline'});
    // });

    nsp.once('connection', () => {
      nsp.clients((err, clients) => {
        if (err) throw err;
        const userList = clients.map(client => {
          const _client = app.io.sockets.sockets[client];
          return _client.user;
        });
        nsp.emit('online', userList)
      });
    });

    await next();
  };
}
