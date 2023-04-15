// app.ts
import { useLogin } from './utils/index';
import { getCurrentPage } from './miniprogram_npm/tdesign-miniprogram/common/utils';
import Message from 'tdesign-miniprogram/message/index';

App<IAppOption>({
  globalData: {
    version: '0.0.5',
  },
  login() {
    wx.showToast({ title: '正在登录', icon: 'loading' });
    return new Promise(resolve => {
      wx.login({
        success: async res => {
          const { code } = res;
          const { data: token } = await useLogin(code);
          const context = getCurrentPage();
          if(token) {
            wx.setStorageSync('token', token);
            wx.hideToast();
            Message.success({
              context,
              offset: [20, 32],
              content: '登录成功',
              duration: 4000
            });
            context.setData({ isLogin: true });
            return resolve(true);
          }
          else Message.error({
            context,
            offset: [20, 32],
            content: '登录失败',
            duration: 4000
          });
          return resolve(false);
        },
      });
    });
  },
  async onLaunch() {
    const res = wx.getSystemInfoSync();
    let isAppleAndHasLine = false, lineBarHeight = 0;
    if (res.model.toLowerCase().includes("iphone")) {
        const regex = /\d+/g;
        const matches = res.model.match(regex);
        if (matches && matches.length > 0) isAppleAndHasLine = parseInt(matches[0]) > 8
        else isAppleAndHasLine = res.model.toLowerCase().includes('x');
        lineBarHeight = isAppleAndHasLine ? res.screenHeight - res.safeArea.bottom : 0;
    }
    this.globalData.lineBarHeight = isAppleAndHasLine ? lineBarHeight : 0;

    const token = wx.getStorageSync('token');
    if(token) return;
    await this.login();
  },
});