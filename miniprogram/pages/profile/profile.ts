// pages/profile/profile.ts
import Message from 'tdesign-miniprogram/message/index';
import { nanoid, uploadFile, useUpdateUserInfo } from '../../utils/index';

import type { UserInfo } from '../../utils/index';

const system = wx.getSystemInfoSync();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false
  } as UserInfo & { isEdit: boolean },

  async editAvatar(e: { detail: { avatarUrl: string } }) {
    let imagePath: string;
    const { detail: { avatarUrl: tempFilePath } } = e;
    
    if(system.platform === 'ios' || system.platform === 'android') {
      imagePath = await new Promise((resolve, reject) => {
        wx.cropImage({
          src: tempFilePath,
          cropScale: '1:1',
          success(res) {
            const { tempFilePath } = res;
            resolve(
              tempFilePath.startsWith('wxfile://')
              ? tempFilePath
              : tempFilePath
            );
          },
          fail(err) {
            console.log(err);
            reject(err);
          }
        })
      });
    } else imagePath = tempFilePath;

    const key = `avatar_images/${nanoid()}.png`;
    const { statusCode } = await uploadFile(key, imagePath);
    if(statusCode !== 200) return wx.showToast({
      title: '上传失败',
      icon: 'error',
      duration: 2000
    });

    const { data } = await useUpdateUserInfo({ avatar: key });
    if(!data) return wx.showToast({
      title: '上传失败',
      icon: 'error',
      duration: 2000
    });;

    this.setData({ avatar: imagePath });
    this.getOpenerEventChannel().emit('onReceiveUserInfo', { avatar: imagePath });
    wx.showToast({
      title: '上传成功',
      icon: 'success',
      duration: 2000
    });
  },

  async saveProfile() {
    const { data } = await useUpdateUserInfo({
      nickname: this.data.nickname,
      introduction: this.data.introduction
    });
    if(data !== true) return Message.error({
      context: this,
      offset: [20, 32],
      duration: 4000,
      content: '保存失败'
    });
    this.data.isEdit = true;
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    setTimeout(() => {
      wx.hideToast();
      wx.navigateBack();
    }, 1000);
  },

  toBindPhone() {
    let _this = this;
    wx.navigateTo({
      url: `/pages/bind-phone/bind-phone?phone=${this.data.phone}`,
      events: {
        onReceivePhone(phone: string) {
          _this.setData({ phone });
        }
      }
    }); 
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(userInfo: unknown) {
    this.setData({
      ...userInfo as UserInfo,
    });
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
    if(!this.data.isEdit) return;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('onReceiveUserInfo', {
      ...this.data,
      isEdit: undefined
    });
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