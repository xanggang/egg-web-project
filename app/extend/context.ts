import { Context } from 'egg';

export interface IResponseData {
  data?: any;
  message?: string;
}



export default {
  success(this: Context, response: any, message = 'success') {
    this.status = 200
    this.body = {
      data: response,
      message: message
    }
  },
  error(this: Context, response: any, message = 'failure') {
    this.status = 500
    this.body = {
      data: response,
      message: message
    }
  },
  validator(this: Context, rules: any, data = this.body) {
    try {
      this.validate(rules);
    } catch (err) {
      return err.errors
    }
  }
}
