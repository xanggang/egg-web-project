import { EggAppConfig, PowerPartial } from 'egg';
import pack from '../package.json'

export default () => {
  const config: PowerPartial<EggAppConfig> = {};


  return config;
};
