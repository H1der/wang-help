import {View} from "@tarojs/components";
import {AtButton, AtCard, AtGrid} from 'taro-ui'
import Taro from "@tarojs/taro";
import './index.scss'
import Banner from "../../components/Banner";
import {aboutList, commonList, lifeList} from "../../utils/pageList"

function Index() {



  function handleAtGridClick(item) {
    return Taro.navigateTo({
      url: item.url
    })
  }


  return (
    <View className='index'>
      <Banner />
      <AtCard title='新春快乐' className='common-tools' thumb='https://oss.2hider.com/wang-help/newyear/cai.png'>
        <AtGrid data={commonList} onClick={handleAtGridClick} />
      </AtCard>
      <AtCard title='生活服务' className='common-tools' thumb='https://oss.2hider.com/wang-help/newyear/shen.png'>
        <AtGrid data={lifeList} onClick={handleAtGridClick} />
      </AtCard>
      <AtCard title='项目说明' className='common-tools' thumb='https://oss.2hider.com/wang-help/newyear/dao.png'>
        <AtGrid data={aboutList} onClick={handleAtGridClick} />
      </AtCard>

    </View>
  );
}

export default Index;
