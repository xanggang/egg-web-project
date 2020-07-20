import assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/account.test.ts', () => {
  it('GET /api/account/check 检查用户名', async () => {
    const result = await app.httpRequest()
      .get('/api/account/check')
      .query({
        userName: 'bar',
      })
  });

  it('POST /api/account/create 创建用户', async () => {
    const result = await app.httpRequest()
      .post('/api/account/create')
      .send({
        userName: 'bar',
        nick: 'nick',
        avatarUrl: 'aaa',
        passWord: '1234567'
      })
  });
});
