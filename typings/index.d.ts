/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    version: string;
    lineBarHeight?: number;
  },
  login: () => Promise<boolean>,
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}