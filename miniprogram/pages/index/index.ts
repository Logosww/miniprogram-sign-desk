// index.ts
import { useGetUserPicList, useDeleteSign } from '../../utils/api';

import type { SignItem } from '../../utils/api';

Page({
  data: {
    isLogin: false,
    isLoading: true,
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    signItems: [] as SignItem[],
    addedItemCount: 0,
    pageStyle: '',
    showConfirm: false,
    toDelItemIndex: 0,
    showImageViewer: false,
    imageToView: [] as string[]
  },

  async fetchPagingSignItemsData(page: number, size = 12, offset?: number) {
    const { data: paginnSignItemsData } = await useGetUserPicList({
      offset: offset ?? this.data.addedItemCount,
      page,
      size,
    });
    const { items } = paginnSignItemsData;
    const signItems = this.data.signItems.concat(items);
    this.setData({ signItems });
  },

  toAddSign() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/add-sign/add-sign',
      events: {
        onReceiveSignItem(item: SignItem) {
          const { signItems } = _this.data;
          signItems.unshift(item);
          _this.setData({ signItems });
          _this.data.addedItemCount++;
        }
      }
    })
  },

  handleDelete(e: { detail: number }) {
    const { detail: index } = e;
    this.setData({ showConfirm: true, toDelItemIndex: index });
  },

  async doDelete() {
    const index = this.data.toDelItemIndex;
    const { picUrl } = this.data.signItems[index];
    wx.showLoading({ title: '删除中' });
    const { code } = await useDeleteSign(picUrl);
    this.setData({ showConfirm: false });
    if(code) {
      const { signItems } = this.data;
      signItems.splice(index, 1);
      this.setData({ signItems });
    }
    wx.hideLoading();
  },

  handleCancelDialog() {
    this.setData({ showConfirm: false });
  },

  handleViewImage(e: { detail: string }) {
    const { detail: src } = e;
    this.setData({ imageToView: [src], showImageViewer: true });
  },

  handleCloseImageViewer() {
    this.setData({ showImageViewer: false });
  },
  
  onLoad() {
    const app = getApp();
    const { lineBarHeight } = app.globalData;
    this.setData({ pageStyle: `--linebar-height: ${lineBarHeight}px;` });
  },

  async onShow() {
    const tabbar = this.getTabBar();
    tabbar.setData({ value: 'index' });

    if(!this.data.isLoading) return;
    await this.fetchPagingSignItemsData(1);
    setTimeout(() => this.setData({ isLoading: false }), 2000);
    // this.setData({ isLoading: false });
  }
}) 
