import React from "react";
import {Cell, CellGroup, Icon, Popup} from "@nutui/nutui-react-taro";
import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import Search from "../../components/Search";
import './index.scss'
import api from "../../utils/api";
import {myRequest} from "../../utils/request";
import {setHistoryStorage} from "../../utils/storage";
import SearchHistory from "../../components/SearchHistory";


function Garbage() {

  const [typeData, setTypeData] = React.useState([])
  const [isOpened, setIsOpened] = React.useState(false)
  const [description, setDescription] = React.useState({})


  async function onActionClick(keyword) {
    if (keyword === '') {
      return
    }
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(api.getGarbage(), {keyword})
    if (res.code === 200) {
      setTypeData(res.data);
      await Taro.hideLoading();
      setHistoryStorage('garbage', keyword, 5)
    } else {

      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
  }


  // 垃圾分类对象
  const rubbishType = [
    {
      type: '1',
      name: '可回收垃圾',
      thumb: 'https://oss.2hider.com/rubbishtype1.png'
    },
    {
      type: '2',
      name: '有害垃圾',
      thumb: 'https://oss.2hider.com/rubbishtype2.png'
    },
    {
      type: '3',
      name: '厨余垃圾(湿)',
      thumb: 'https://oss.2hider.com/rubbishtype3.png'
    },
    {
      type: '4',
      name: '其他垃圾(干)',
      thumb: 'https://oss.2hider.com/rubbishtype4.png'
    }
  ];

  function handleListItemClick(data) {
    setIsOpened(true)
    setDescription({...data})
  }


  return (
    <View className='container'>
      <Search getSearchKeyword={onActionClick} />
      <View className='search-result'>

        {typeData.length > 0 ? (<CellGroup >
          {typeData.map((data, index) => {
            rubbishType.find(type => {
                if (type.type === data.type) return data = {typeName: type.name, thumb: type.thumb, ...data}
              }
            )

            return (
                <Cell
                  size='large'
                  key={index}
                  title={data.name}
                  desc={data.typeName}
                  onClick={() => handleListItemClick(data)}
                  isLink
                  iconSlot={
                    <img
                      className='nut-icon'
                      alt=''
                      src={data.thumb}
                    />
                  }
                />

            )
          })}

        </CellGroup>) : (<SearchHistory keyName='garbage' getSearchKeyword={onActionClick} />)}

        <Popup visible={isOpened} closeable  style={{ height: '40%' }} position='bottom' onClose={() => { setIsOpened(false)}} >
          <View>
            {/*<AtIcon value='help' size='18' color='#A6E0DE' />*/}
            <Icon size='18' name='ask' color='#A6E0DE' />
            <Text className='explain-title' style={{marginLeft: '10px'}}>{description.typeName}是什么？</Text>
            <Text className='explain-info'>{description.explain}</Text>
          </View>
          <View>
            <View className='explain-title'>有什么常见的{description.typeName}？</View>
            <Text className='explain-info'>{description.contain}</Text>
          </View>
          <View>
            <Text className='explain-title'>小提示</Text>
            <Text className='explain-info'>{description.tip}</Text>
          </View>
        </Popup>
      </View>
    </View>

  );
}

export default Garbage;
