import {View} from "@tarojs/components";
import {AtGrid, AtCard} from 'taro-ui'
import Taro from "@tarojs/taro";
import './index.scss'

function Index() {
  const list = [{
    image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
    value: '防疫出行政策',
    url: '/pages/travel/index'
  },
    {
      image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
      value: '垃圾分类',
      url:'/pages/garbage/index'
    },
    {
      image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
      value: '油价查询'
    },
    {
      image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
      value: '快递查询',
      url:'/pages/express/index'
    },
    {
      image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
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
      <AtCard>
        <AtGrid data={list} className='test'  onClick={handleAtGridClick} />
      </AtCard>

    </View>
  );
}

export default Index;
