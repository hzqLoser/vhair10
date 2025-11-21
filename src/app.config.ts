
export default {
  // 确保 H5 默认跳转到首页
  entryPagePath: 'pages/home/index',
  pages: [
    'pages/home/index',
    'pages/square/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/tryOnEntry/index',
    'pages/tryOnLoading/index',
    'pages/tryOnResult/index',
    'pages/hairstyleDetail/index',
    'pages/chat/index',
    'pages/history/index',
    'pages/storeRanking/index',
    'pages/storeSelect/index',
    'pages/savedHairstyles/index',
    'pages/savedStores/index',
    'pages/help/index',
    'pages/profileEdit/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'HairMatch AI',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  tabBar: {
    color: '#8e8fa8',
    selectedColor: '#9F8BFF',
    backgroundColor: '#f6f3ff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '发型',
        iconPath: 'assets/tabbar/home.svg',
        selectedIconPath: 'assets/tabbar/home-active.svg',
      },
      {
        pagePath: 'pages/square/index',
        text: '广场',
        iconPath: 'assets/tabbar/square.svg',
        selectedIconPath: 'assets/tabbar/square-active.svg',
      },
      {
        pagePath: 'pages/message/index',
        text: '消息',
        iconPath: 'assets/tabbar/message.svg',
        selectedIconPath: 'assets/tabbar/message-active.svg',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/tabbar/profile.svg',
        selectedIconPath: 'assets/tabbar/profile-active.svg',
      }
    ]
  }
}
