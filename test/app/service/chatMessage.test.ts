import {app} from 'egg-mock/bootstrap';
import assert from 'assert';
import {IUser} from "../../../app/model/account";

const userId = 1001
const message = +new Date()

describe('存储聊天消息', () => {
  it('新增消息', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    const user = {
      id: userId,
      userName: 'userName',
    }
    const data = await ctx.service.chatMessage.pushMessage(user as IUser, message)
    console.log('新增完成， 新增id=' + data.dataValues.id)
    assert(!isNaN(data.dataValues.id))
  });

  it('分页查询, 通过id', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    const data = await ctx.service.chatMessage.getAllMessageByUserId({
      userId: userId,
    })
    assert(!!data)
  });

  it('分页查询, 不设置id', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    const data = await ctx.service.chatMessage.getAllMessageByUserId({
      limit: 5,
      order: "desc"
    })

    assert(!!data)
  });

});