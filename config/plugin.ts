import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: true,
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  httpProxy: {
    enable: true,
    package: 'egg-http-proxy2',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  jwt: {
    enable: true,
    package: "egg-jwt"
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
};

export default plugin;
