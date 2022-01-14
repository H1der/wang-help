import {View} from "@tarojs/components";
import {AtGrid, AtCard} from 'taro-ui'
import Taro from "@tarojs/taro";
import './index.scss'

function Index() {
  const list = [{
    image: 'https://oss.2hider.com/travel.png',
    value: '防疫出行政策',
    url: '/pages/travel/index'
  },
    {
      image: 'https://oss.2hider.com/garbage.png',
      value: '垃圾分类',
      url:'/pages/garbage/index'
    },
    {
      image: 'https://oss.2hider.com/oil.png',
      value: '油价查询',
      url:'/pages/oil/index',
    },
    {
      image: 'https://oss.2hider.com/express.png',
      value: '快递查询',
      url:'/pages/express/index'
    },
    {
      image: 'https://oss.2hider.com/relationship.png',
      value: '亲戚计算器',
      url:'/pages/relationship/index'
    },
  ]


  function handleAtGridClick(item) {
    return Taro.navigateTo({
        url: item.url
      })
  }

  return (
    <View className='index'>
      <AtCard title='常用工具' className='common-tools' thumb='https://oss.2hider.com/tools.png'>
        <AtGrid data={list} className='test'  onClick={handleAtGridClick} />
      </AtCard>

    </View>
  );
}

export default Index;
