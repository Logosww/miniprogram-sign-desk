// pages/bind-sign/bind-sign.ts
import { useBindSign, useGetSignItem } from '../../utils/api';

import type { SignItem } from '../../utils/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupVisible: false,
    viewerVisible: false,
    signId: 0,
    signItem: undefined as unknown as SignItem,
    images: [] as string[]
  },

  onVisibleChange(e: { detail: { visible: boolean } }) {
    this.setData({
      popupVisible: e.detail.visible,
    });
  },

  async handleLogin() {
    wx.showLoading({ title: '登录中' });
    await getApp()['login']();
    wx.hideLoading();
    this.setData({ popupVisible: false });
  },

  async handleBind() {
    try {
      const { signId } = this.data;
      await useBindSign(signId);
    } catch {
      return this.setData({ popupVisible: true });
    }
    if(getCurrentPages().length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/index/index' });
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },
  handleViewOpen() {
    this.setData({ viewerVisible: true });
  },
  handleViewerClose() {
    this.setData({ viewerVisible: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(query: { scene: string }) {
    const token = wx.getStorageSync('token');
    if(!token) this.setData({ popupVisible: true });
    const signId = parseInt(decodeURIComponent(query.scene));
    const { data: signItem } = await useGetSignItem(signId);
    this.setData({ signId, signItem, images: [ signItem.picUrl ] });
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