// index.ts
Page({
  data: {
    isLogin: false
  },
  
  onShow() {
    const tabbar = this.getTabBar();
    tabbar.setData({ value: 'index' });
  }
}) 
