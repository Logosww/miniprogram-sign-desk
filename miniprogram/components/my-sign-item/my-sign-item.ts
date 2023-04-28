// components/my-gallery-item.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: undefined
    },
    index: {
      type: Number,
      value: undefined
    }
  },

  options: {
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的初始数据
   */
  data: {
    skeleton: [
      { width: '20%', borderRadius: '8rpx' },
      [
        { width: '210rpx', height: '210rpx', borderRadius: '24rpx' },
        { width: '210rpx', height: '210rpx', borderRadius: '24rpx' },
        { width: '210rpx', height: '210rpx', borderRadius: '24rpx' }
      ],
      { width: '35%', borderRadius: '8rpx' }
    ],
    isImageLoaded: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelete() {
      this.triggerEvent('delete', this.properties.index);
    },
    handleViewImage() {
      this.triggerEvent('view-image', this.properties.item.picUrl);
    },
    handleLoaded() {
      this.setData({ isImageLoaded: true });
    }
  }
})
