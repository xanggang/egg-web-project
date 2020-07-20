import {Application} from 'egg';

export interface IUser {
  id: number
  userName: string
  nick: string
  passWord: string
  avatarUrl: string
  deleted: number
}

export default (app): any => {
  const { INTEGER, BIGINT, CHAR, STRING, VARCHAR} = app.Sequelize;

  const User = app.model.define('account', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userName: STRING(15),
    nick: STRING(15),
    avatarUrl: STRING(255),
    passWord: STRING(255),
    deleted: INTEGER
  },{
    timestamps: false,
    raw: true
  });

  return User;
};
