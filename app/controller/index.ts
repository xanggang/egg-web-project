import { Controller } from 'egg';

class HomeController extends Controller {

  public async index() {
    let title = "我是首页1"; //向模板传入数据
    this.ctx.logger.error('我是首页1')
    const headers = {
      'Content-Type': 'text/html',
    };
    this.ctx.set(headers);
    await this.ctx.render('index', {
      title: title
    })
  }

  public async update() {
    const ctx = this.ctx;
    const user = await ctx.service.user.list();
    ctx.status = 201;
    ctx.body = user;
  }

}

export default HomeController
