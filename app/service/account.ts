import {Service} from 'egg';
import { IUser } from '../model/account'
import bcrypt from 'bcrypt-nodejs'

export default class UserService extends Service {

  async findByUserName (userName) {
    let user = await this.ctx.model.Account.findOne({ where: { userName }, raw: true });
    return user;
  }

  async findById(id) {
    return await this.ctx.model.Account.findByPk(id)
  }

  async create(user: IUser) {
    const token = this.service.account.passwordBcrypt(user.passWord)
    return this.ctx.model.Account.create({
      userName: user.userName,
      nick: user.nick,
      passWord: token,
      avatarUrl: user.avatarUrl,
      deleted: 0
    });
  }

  async findAll() {
    let user = await this.ctx.model.Account.findAll();
    return user;
  }

  async getToken(userInfo) {
    const token = this.app.jwt.sign({ user: userInfo }, this.app.config.jwt.secret);
    return token
  }

  async checkPassword(hsPassword, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(hsPassword, password, (err, isMatch) => {
        if (!err) {
          resolve(isMatch)
        } else {
          reject(err)
        }
      })
    })
  }

  passwordBcrypt (password) {
    let salt = bcrypt.genSaltSync(10)
    let token = bcrypt.hashSync(password, salt)
    return token
  }

  decryptToken(token) {
    try {
      const { user } = this.app.jwt.verify(token, this.app.config.jwt.secret);
      return [null, user]
    } catch (e) {
      return [e, null]
    }
  }
}

