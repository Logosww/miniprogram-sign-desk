/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo
  },
  login: () => Promise<boolean>,
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}