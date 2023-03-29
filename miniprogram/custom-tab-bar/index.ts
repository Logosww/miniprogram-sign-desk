Component({
  data: {
    value: undefined as unknown as string,
    tabList: [
      { value: 'index', label: '首页', icon: 'home' },
      { value: 'my', label: '我的', icon: 'user' },
    ],
  },

  methods: {
    onChange(e: { detail: { value: string } }) {
      const { value } = e.detail;
      wx.switchTab({ url: `../${value}/${value}` });
    },
  },
});
