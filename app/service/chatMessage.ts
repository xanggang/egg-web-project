import {Service} from 'egg';
import { IMessage } from '../model/chatMessage'
import { IUser } from "../model/account";
import { Op }  from "sequelize";
import moment from "moment";

export interface ISearchPar {
  userId?: number,
  page?: number, // 第几页
  limit?: number, // 每页多少数据
  startTime?: string, //
  endTime?: string
  order?: 'desc' | 'asc' | undefined
}

export default class ChatMessageService extends Service {

  // 插入消息
  public async pushMessage(user: IUser, message) {
    return this.ctx.model.ChatMessage.create({
      userId: user.id,
      userName: user.userName,
      message: message,
      deleted: 0
    });
  }

  // 查询全部消息， 分页接口
  public async getAllMessageByUserId(par: ISearchPar) {
    const {
      userId,
      page = 1,
      limit = 10,
      startTime,
      endTime,
      order = 'desc'
    } = par
    let query: any = {
      where: {
        deleted: {
          [Op.ne]: 1
        },
      },
      order: [[ 'created_at',  order], [ 'id', 'desc' ]],
      offset: (page - 1) * limit,
      limit: limit,
      raw: true
    }
    if (userId) {
      query.where.userId = userId
    }

    if (startTime || endTime) {
      query.where.createdAt = {
        [Op.lt]: startTime
          ? +new Date(startTime)
          : +new Date('2020-01-01 00:00:00'),
        [Op.gt]: endTime
          ? +new Date(endTime)
          : +new Date(),
      }
    }
    return this.ctx.model.ChatMessage.findAndCountAll(query)
  }

}