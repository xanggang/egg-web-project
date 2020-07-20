import { Controller } from 'egg';
import { Get, Prefix, Post } from '../decorator/router'
import auth from '../middleware/auth'

@Prefix('/chatMessage')
class ChatMessageController extends Controller {

  @Post('/getPage')
  public async getPage() {
    this.ctx.logger.error('getPage')
    const  {
      userId,
      page,
      limit,
      startTime,
      endTime,
      order
    } = this.ctx.request.body

    const data = await this.ctx.service.chatMessage.getAllMessageByUserId({
      userId,
      page,
      limit,
      startTime,
      endTime,
      order
    })

    this.ctx.success(data)
  }
}