
export default {
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
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#858585',
    selectedColor: '#FF3D81',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '发型',
      },
      {
        pagePath: 'pages/square/index',
        text: '广场',
      },
      {
        pagePath: 'pages/message/index',
        text: '消息',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
      }
    ]
  }
}