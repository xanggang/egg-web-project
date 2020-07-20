import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path'
import self from '../self.json'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1573204100433_1786';

  // 中间件
  config.middleware = [];

  // 安全校验
  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      enable: false,
    },
    xframe: {
      enable: true,
      value: 'ALLOW-FROM',
    },
  };

  config.view = {
    root: path.join(appInfo.baseDir, 'app/view'),
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    // @ts-ignore
    host: self.mysql.address,
    password: 'xanggang',
    port: 9006,
    database: 'newtest',
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
  }

  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [
          'connection', 'auth'
        ],
        packetMiddleware: [],
      },
    },
  };

  // @ts-ignore
  config.qiniu = self.qiniu

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };


  config.jwt = {
    // @ts-ignore
    secret: self.secret
  };


  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
