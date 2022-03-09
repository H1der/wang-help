import {View} from "@tarojs/components";
import {AtCard, AtGrid} from 'taro-ui'
import Taro from "@tarojs/taro";
import './index.scss'
import {aboutList, commonList, lifeList} from "../../utils/pageList"

function Index() {



  function handleAtGridClick(item) {
    return Taro.navigateTo({
      url: item.url
    })
  }


  return (
    <View className='index'>
      <AtCard title='常用工具' className='common-tools' thumb='https://oss.2hider.com/tools.png'>
        <AtGrid data={commonList} onClick={handleAtGridClick} />
      </AtCard>
      <AtCard title='生活服务' className='common-tools' thumb='https://oss.2hider.com/wang-help/life.png'>
        <AtGrid data={lifeList} onClick={handleAtGridClick} />
      </AtCard>
      <AtCard title='项目说明' className='common-tools' thumb='https://oss.2hider.com/wang-help/help.png'>
        <AtGrid data={aboutList} onClick={handleAtGridClick} />
      </AtCard>

    </View>
  );
}

export default Index;
