import { Controller } from 'egg';
import { Get, Prefix, Post } from '../decorator/router'
import auth from '../middleware/auth'

function omit(obj, fields) {
  let shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i++) {
    let key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

@Prefix('/account')
class AccountController extends Controller {

  @Get('/check')
  public async checkUserName() {
    const userName = this.ctx.query.userName
    const user = await this.ctx.service.account.findByUserName(userName)
    if (!user) {
      this.ctx.success(true)
      return
    }

    this.ctx.success(false)

  }

  @Post('/create')
  public async createAccount() {
    const validator = this.ctx.validator({
      userName: { type: 'string', required: true, max: 15 },
      nick: { type: 'string', max: 15, required: false },
      avatarUrl: { type: 'string', required: false },
      passWord: { type: 'password', required: true, max: 15, min: 6 },
    })
    if (validator) {
      this.ctx.error(validator, '参数校验错误')
      return
    }


    const body = this.ctx.request.body

    const { userName } = body
    const user = await this.ctx.service.account.findByUserName(userName)
    if (user) {
      this.ctx.error(null, '用户名已存在')
      return
    }

    const cuser = await this.ctx.service.account.create(body)
    this.ctx.success(omit(cuser.dataValues, ['passWord', 'deleted']))
  }

  @Post('/login')
  public async login() {
    const validator = this.ctx.validator({
      userName: { type: 'string', required: true, max: 15 },
      passWord: { type: 'password', required: true, max: 15, min: 6 },
    })

    if (validator) {
      this.ctx.error(validator, '参数校验错误')
      return
    }

    const body = this.ctx.request.body
    const { userName, passWord } = body
    const user = await this.ctx.service.account.findByUserName(userName)
    if (!user) {
      this.ctx.error('用户不存在或密码错误!')
      return
    }
    const isMatch = await this.ctx.service.account.checkPassword(passWord, user.passWord)
    if (!isMatch) {
      this.ctx.error('用户不存在或密码错误！')
      return
    }

    const _user = omit(user, ['passWord', 'deleted'])

    const token = await this.service.account.getToken(_user)
    _user.token = token
    this.ctx.success(_user)
  }

  @Post('login-out')
  public async loginOut() {
    const validator = this.ctx.validator({
      userName: { type: 'string', required: true, max: 15 }
    })

    if (validator) {
      this.ctx.error(validator, '参数校验错误')
      return
    }



  }

  @Get('/test', [auth])
  public async testToken() {
    console.log(this.ctx.user);
  }

}

export default AccountController
