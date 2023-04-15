// pages/add-sign/add-sign.ts
import Message from 'tdesign-miniprogram/message/index';
import { uploadFile, nanoid, useAddSign } from '../../utils/index';

import type { SignItem } from '../../utils/index';

interface ImageContext {
  name: string;
  type: string;
  url: string;
  size: number;
  width: number;
  height: number;
  progress: number
};

interface UploadFile extends ImageContext {
  status: 'loading' | 'reload' | 'failed' | 'done';
  percent?: number;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gridConfig: { column: 3, width: 210, height: 210 },
    fileList: [] as unknown as UploadFile[],
    key: '',
    returnSignItem: undefined as unknown as SignItem,
    isUploaded: false,
    isConfirmed: false
  },

  handleAdd(e: any) {
    const { files } = e.detail;
    this.doUpload(files[0] as ImageContext);
  },

  async doUpload(file: ImageContext) {
    this.setData({ fileList: [ { ...file, status: 'loading' } ] });
    const key = `sign_images/${nanoid()}.png`;
    const { statusCode } = await uploadFile(
      key, 
      file.url,
      (progressData) => {
        const { percent } = progressData;
        this.setData({ ['fileList[0].percent']: Math.round(percent * 100) });
      }
    );
    if(statusCode === 200) this.setData({ 
      key,
      isUploaded: true,
      ['fileList[0].status']: 'done'
    });
    else {
      this.setData({ ['fileList[0].status']: 'reload' });
      Message.error({
        context: this,
        offset: [20, 32],
        duration: 4000,
        content: '上传失败'
      });
    }
  },

  handleClick(file: ImageContext) {
    const { status } = this.data.fileList[0];
    if(status !== 'reload') return;
    this.doUpload(file);
  },

  handleRemove() {
    this.setData({
      fileList: [],
      isUploaded: false
    });
  },

  async handleConfirm() {
    const { data: signItem } = await useAddSign(this.data.key, '浙江传媒学院钱塘校区');
    this.setData({ isConfirmed: true, returnSignItem: signItem });
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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
    if(!this.data.isConfirmed) return;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('onReceiveSignItem', this.data.returnSignItem);
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