import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {Cell, CellGroup, Grid, GridItem} from "@antmjs/vantui";
import './index.scss'
import {aboutList, commonList, lifeList} from "../../utils/pageList";

function Index() {


  function handleAtGridClick(item) {
    return Taro.navigateTo({
      url: item.url
    })
  }


  return (
    <View className='index'>
      <CellGroup title='常用工具'>
        <Cell>
          <Grid columnNum='3'>
            {commonList.map((item,key) => {
              return (<GridItem key={key} icon={item.image} text={item.value}
                onClick={()=>handleAtGridClick(item)}
              />)
            })}
          </Grid>
        </Cell>
      </CellGroup>
      <CellGroup title='生活服务'>
        <Cell>
          <Grid columnNum='3'>
            {lifeList.map((item,key) => {
              return (<GridItem key={key} icon={item.image} text={item.value}
                onClick={()=>handleAtGridClick(item)}
              />)
            })}
          </Grid>
        </Cell>
      </CellGroup>
      <CellGroup title='项目说明'>
        <Cell>
          <Grid columnNum='3'>
            {aboutList.map((item,key) => {
              return (<GridItem key={key} icon={item.image} text={item.value}
                onClick={()=>handleAtGridClick(item)}
              />)
            })}
          </Grid>
        </Cell>
      </CellGroup>
    </View>
  );
}

export default Index;
