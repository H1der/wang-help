import {View} from "@tarojs/components";
import {AtGrid, AtCard} from 'taro-ui'
import Taro from "@tarojs/taro";
import './index.scss'

function Index() {


  // 支付宝快递查询功能需要相关许可证

  let list = []
  if (process.env.TARO_ENV === 'alipay') {
    list = [{
      image: 'https://oss.2hider.com/travel.png',
      value: '防疫出行政策',
      url: '/pages/travel/index'
    },
      {
        image: 'https://oss.2hider.com/garbage.png',
        value: '垃圾分类',
        url: '/pages/garbage/index'
      },
      {
        image: 'https://oss.2hider.com/oil.png',
        value: '油价查询',
        url: '/pages/oil/index',
      },
      {
        image: 'https://oss.2hider.com/relationship.png',
        value: '亲戚计算器',
        url: '/pages/relationship/index'
      },{
        image: 'https://oss.2hider.com/wang-help/lpl2022.png',
        value: '2022 LPL赛程',
        url: '/pages/lpl/index'
      },
    ]
  } else {
    list = [{
      image: 'https://oss.2hider.com/travel.png',
      value: '防疫出行政策',
      url: '/pages/travel/index'
    },
      {
        image: 'https://oss.2hider.com/garbage.png',
        value: '垃圾分类',
        url: '/pages/garbage/index'
      },
      {
        image: 'https://oss.2hider.com/oil.png',
        value: '油价查询',
        url: '/pages/oil/index',
      },
      {
        image: 'https://oss.2hider.com/express.png',
        value: '快递查询',
        url: '/pages/express/index'
      },
      {
        image: 'https://oss.2hider.com/relationship.png',
        value: '亲戚计算器',
        url: '/pages/relationship/index'
      },{
        image: 'https://oss.2hider.com/wang-help/lpl2022.png',
        value: '2022 LPL赛程',
        url: '/pages/lpl/index'
      },
    ]
  }


  function handleAtGridClick(item) {
    return Taro.navigateTo({
      url: item.url
    })
  }


  return (
    <View className='index'>
      <AtCard title='常用工具' className='common-tools' thumb='https://oss.2hider.com/tools.png'>
        <AtGrid data={list} className='test' onClick={handleAtGridClick} />
        {/*<Index />*/}
      </AtCard>

    </View>
  );
}

export default Index;
