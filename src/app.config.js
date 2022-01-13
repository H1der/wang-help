export default {
  pages: [
    'pages/index/index',
    'pages/travel/index', // 出行防疫政策
    'pages/express/index',// 快递查询
    'pages/garbage/index', // 垃圾分类
    'pages/relationship/index', // 亲戚计算器
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示" // 高速公路行驶持续后台定位
    }
  }
}
