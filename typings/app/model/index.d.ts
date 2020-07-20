// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount from '../../../app/model/account';
import ExportChatMessage from '../../../app/model/chatMessage';

declare module 'egg' {
  interface IModel {
    Account: ReturnType<typeof ExportAccount>;
    ChatMessage: ReturnType<typeof ExportChatMessage>;
  }
}
