import {Application} from 'egg';
import moment from 'moment'

export interface IMessage {
  id: number
  userName: string
  nick: string
  passWord: string
  avatarUrl: string
  deleted: number
}

export default (app): any => {
  const { INTEGER, STRING, TEXT, DATE } = app.Sequelize;

  const ChatMessage = app.model.define('chatMessage', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userName: STRING(15),
    userId: INTEGER,
    message: TEXT,
    deleted: INTEGER
  },{
    timestamps: true,
    raw: true
  });

  return ChatMessage;
};
