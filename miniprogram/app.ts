// app.ts
import { useLogin } from './utils/index';
import { getCurrentPage } from './miniprogram_npm/tdesign-miniprogram/common/utils';
import Message from 'tdesign-miniprogram/message/index';

App<IAppOption>({
  globalData: {},
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
    const token = wx.getStorageSync('token');
    if(token) return;
    await this.login();
  },
});