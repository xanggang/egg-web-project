import { Controller } from 'egg';
import { Get, Prefix, Post } from '../decorator/router'
import qiniu from 'qiniu'
import moment from 'moment'


@Prefix('/file')
class AccountController extends Controller {

  @Get('/uploadToken')
  async getUploadToken() {
    const config = this.app.config.qiniu
    let fileType = this.ctx.query.fileType
    if (!fileType) {
      this.ctx.error('文件名不能为空')
      return
    }
    let mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    let fileName = +(new Date())
    let key = `images/${moment().format('YYYY-MM-DD')}/${fileName}.${fileType}`
    let options = {
      scope: `${config.bucket}:${key}`
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    this.ctx.success({
      key,
      token: uploadToken
    })
  }
}

export default AccountController
