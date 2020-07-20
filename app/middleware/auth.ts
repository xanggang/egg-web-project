
export default async function auth(ctx, next) {
  const token = ctx.header.authorization
  if (!token) {
    ctx.status = 401
    ctx.body = {
      data: null,
      message: '登录已失效，请重新登录'
    }
    return
  }
  const [err, user] = ctx.service.account.decryptToken(token)
  if (err) {
    ctx.status = 401
    ctx.body = {
      data: err,
      message: '登录已失效，请重新登录'
    }
  }
  ctx.user = user
  await next()
};
