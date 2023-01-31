let pages = []
if (process.env.TARO_ENV === 'alipay') {
  pages = [
    'pages/index/index',
    'pages/garbage/index', // 垃圾分类
    'pages/relationship/index', // 亲戚计算器
    'pages/oil/index', // 油价查询
    'pages/lpl/index', // lpl赛程
    // 'pages/photo/index', // 证件照换底色
    'pages/about/index', // 证件照换底色
    // 'pages/lottery/index', // 彩票
    // 'pages/lottery/history/index', // 彩票开奖历史
  ]
}else{
  pages = [
    'pages/index/index',
    // 'pages/travel/index', // 出行防疫政策
    'pages/express/index',// 快递查询
    'pages/garbage/index', // 垃圾分类
    'pages/relationship/index', // 亲戚计算器
    'pages/oil/index', // 油价查询
    'pages/lpl/index', // lpl赛程
    // 'pages/photo/index', // 证件照换底色
    'pages/about/index', // 关于
    // 'pages/lottery/index', // 彩票
    // 'pages/lottery/history/index', // 彩票开奖历史
  ]
}

export default {


  pages,

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示" // 描述
    }
  }
}
