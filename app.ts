
import { EggApplication } from 'egg'

export default async (app: EggApplication) => {
  app.coreLogger.info('dubbo was ready');
};
