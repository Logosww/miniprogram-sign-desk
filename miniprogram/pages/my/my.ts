// pages/my/my.ts
import { useGetUserInfo } from '../../utils/index';

import type { UserInfo } from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarSize: '96px',
    backgroundImage: '',
    userInfo: {} as UserInfo,
    isLogin: false
  },

  async login() {
    const isLogin: boolean = await getApp()['login']();
    if(!isLogin) return;
    const { data: userInfo } = await useGetUserInfo();
    this.setData({ userInfo });
  },

  navigateToPage(e: {
    target: {
      dataset: { url: string }
    }
  }) {
    const { url } = e.target.dataset;
    const isToProfile = url === '/pages/profile/profile';
    if(isToProfile && !this.data.userInfo.nickname) return;
    
    const resolvedUrl = 
      isToProfile
      ? `${url}?${
          Object.entries(this.data.userInfo)
          .map(([key, value]) => `${key}=${value}`).join('&')
        }`
      : url;
    let _this = this;
    wx.navigateTo({
      url: resolvedUrl,
      events: 
        isToProfile
        ? {
          onReceiveUserInfo(userInfo: Partial<UserInfo>) {
            _this.setData({ userInfo: userInfo as UserInfo });
          }
        }
        : undefined
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const backgroundIndex = Math.floor(Math.random() * 3);
    const backgroundImage = `/asset/image/my-background-${backgroundIndex}.jpg`;
    this.setData({ backgroundImage });
    const { data: userInfo } = await useGetUserInfo();
    this.setData({ userInfo, isLogin: true });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const tabbar = this.getTabBar();
    tabbar.setData({ value: 'my' });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})