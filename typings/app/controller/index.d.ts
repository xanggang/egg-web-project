// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount from '../../../app/controller/account';
import ExportChatMessage from '../../../app/controller/chatMessage';
import ExportFile from '../../../app/controller/file';
import ExportIndex from '../../../app/controller/index';

declare module 'egg' {
  interface IController {
    account: ExportAccount;
    chatMessage: ExportChatMessage;
    file: ExportFile;
    index: ExportIndex;
  }
}
