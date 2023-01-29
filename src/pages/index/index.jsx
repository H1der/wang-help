import {View} from "@tarojs/components";
import {Divider, Grid, GridItem,Icon} from '@nutui/nutui-react-taro';
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
      <Divider contentPosition='left'>常用工具</Divider>
      <Grid columnNum={3}>
        {commonList.map((item,key) => {
          return (<GridItem key={key} icon={
            <Icon size='40' name={item.image} />
          } text={item.value}
            onClick={()=>handleAtGridClick(item)}
          />)
        })}
      </Grid>
      <Divider contentPosition='left'>生活服务</Divider>
      <Grid columnNum={3}>
        {lifeList.map((item,key) => {
          return (<GridItem key={key} icon={
            <Icon size='40' name={item.image} />
          } text={item.value}
            onClick={()=>handleAtGridClick(item)}

          />)
        })}
      </Grid>
      <Divider contentPosition='left'>项目说明</Divider>
      <Grid columnNum={3}>
        {aboutList.map((item,key) => {
          return (<GridItem key={key} icon={
            <Icon size='40' name={item.image} />
          } text={item.value}
            onClick={()=>handleAtGridClick(item)}

          />)
        })}
      </Grid>

    </View>
  );
}

export default Index;
