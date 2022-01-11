import React from "react";
import {AtFloatLayout, AtIcon, AtList, AtListItem} from "taro-ui";
import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import Search from "../../components/Search/Search";
import './index.scss'
import api from "../../utils/api";



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
    let res = await Taro.request({
      method: 'GET',
      url: api.getGarbage() + keyword,
    })
    if (res.statusCode === 200) {
      const {data} = res.data;

      setTypeData(data);
      await Taro.hideLoading();
    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
    // console.log(keyword)
  }

  // 垃圾分类对象
  const rubbishType = [
    {
      type: '1',
      name: '可回收垃圾',
      thumb: 'http://oss.2hider.com/rubbishtype1.png'
    },
    {
      type: '2',
      name: '有害垃圾',
      thumb: 'http://oss.2hider.com/rubbishtype2.png'
    },
    {
      type: '3',
      name: '厨余垃圾(湿)',
      thumb: 'http://oss.2hider.com/rubbishtype3.png'
    },
    {
      type: '4',
      name: '其他垃圾(干)',
      thumb: 'http://oss.2hider.com/rubbishtype4.png'
    }
  ]

  function handleListItemClick(data) {
    setIsOpened(true)
    setDescription({...data})
  }


  return (
    <View className='container'>
      <View className='search-result'>
        <Search getSearchKeyword={onActionClick} />
        <AtList>
          {typeData.map((data, index) => {
            rubbishType.find(type => {
                if (type.type === data.type) return data = {typeName: type.name, thumb: type.thumb, ...data}
              }
            )


            return (
              <AtListItem
                onClick={() => handleListItemClick(data)}
                key={index}
                title={data.name}
                note={data.typeName}
                arrow='right'
                thumb={data.thumb}
              />
            )
          })}

        </AtList>
        <AtFloatLayout isOpened={isOpened} onClose={()=>setIsOpened(false)} title='                '>
          <View>
            <AtIcon value='help' size='18' color='#A6E0DE' />
            <Text className='explain-title' style={{marginLeft:'10px'}} >{description.typeName}是什么？</Text>
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

        </AtFloatLayout>
      </View>
    </View>

  );
}

export default Garbage;
