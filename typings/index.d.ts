import 'egg';

declare module 'egg' {
  // interface dubboClinent {
  //   service: {
  //     IUserServiceProvider: IUserServiceProviderWrapper
  //   }
  // }
  interface Application {
    jwt: {
      sign: any,
      verify: any
    }
    io: any
  }
}
