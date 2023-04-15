// my-empty/my-empty.ts
interface EmptyTypeMap {
  image: string;
  description: string;
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'empty'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    typeMap: {
      empty: {
        image: '/asset/image/empty.png',
        description: '暂无数据'
      },
      developing: {
        image: '/asset/image/developing.png',
        description: '开发中'
      }
    } as Record<string, EmptyTypeMap>
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
