// index.ts
import Message from 'tdesign-miniprogram/message/index';
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
    hasNext: false,
    currentPage: 0,
    addedItemCount: 0,
    pageStyle: '',
    showConfirm: false,
    toDelItemIndex: 0,
    showImageViewer: false,
    imageToView: [] as string[],
    isFetchingMore: false
  },

  async fetchPagingSignItemsData(page: number, size = 12, offset?: number) {
    const { data: pagingSignItemsData } = await useGetUserPicList({
      offset: offset ?? this.data.addedItemCount,
      page,
      size,
    });
    const { records: items } = pagingSignItemsData;
    const signItems = this.data.signItems.concat(items);
    this.setData({ 
      signItems,
      hasNext: pagingSignItemsData.hasNext,
      currentPage: pagingSignItemsData.currentPage
    });
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
      const { signItems, addedItemCount } = this.data;
      let offset = addedItemCount ? addedItemCount - 1 : addedItemCount;
      signItems.splice(index, 1);
      this.setData({ signItems, addedItemCount: offset });
    }
    wx.hideLoading();
    return Message.success({
      context: this,
      offset: [20, 32],
      duration: 4000,
      content: '删除成功'
    });
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

  async handlePullDownRefresh() {
    this.data.signItems = [];
    await this.fetchPagingSignItemsData(1);
    setTimeout(() => this.setData({ isLoading: true, baseRefresh: { value: false } }), 1000);
    setTimeout(() => this.setData({ isLoading: false }), 1500);
  },

  async handleScrollToLower() {
    this.setData({ isFetchingMore: true });
    if(!this.data.hasNext) return setTimeout(() => {
      this.setData({ isFetchingMore: false });
      wx.showToast({ title: '没有更多了', icon: 'none' });
    }, 1500);
    await this.fetchPagingSignItemsData(this.data.currentPage++, undefined, this.data.addedItemCount);
    return this.setData({ isFetchingMore: false });
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
