import assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/chatMessage.test.ts', () => {
  it('POST /api/chat-message/getPage 查询聊天消息', async () => {
    const result = await app.httpRequest()
      .post('/api/chat-message/getPage')
      .send({
      })

    console.log(result);
  });

});
