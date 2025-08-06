import Taro from "@tarojs/taro";
import {useEffect, useLayoutEffect, useState} from "react";
import {Picker, Text, View} from "@tarojs/components";
import {Button, Icon, NoticeBar} from "@antmjs/vantui";
import './index.scss'
import {province} from "../../utils/province";
import {myRequest} from "../../utils/request";
import {getValueByKey, setKeyAndValue} from "../../utils/storage";
import {getOilApi, getOilChangeApi} from "../../utils/api";

function Oil() {


  const [oilData, setOilData] = useState({})
  const [changNotice, setChangeNotice] = useState("")
  const [provinceName, setProvinceName] = useState(getValueByKey('oli') !== '' ? getValueByKey('oli') : '海南')


  useEffect(() => {
    try {
      getOilPrice()

    } catch (error) {
      return Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [provinceName])
  //useLayoutEffect则是在DOM结构更新后、渲染前执行，相当于有一个防抖效果
  useLayoutEffect(() => {
    getOilChange()

  }, [])

  async function getOilPrice() {


    let res = await myRequest(getOilApi(), {province: provinceName})
    if (res.code === 200) {
      setOilData(res.data)
      await Taro.hideLoading();
    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
  }

  // 价格变动公告
  async function getOilChange() {

    let res = await myRequest(getOilChangeApi())
    if (res.code === 200) {
      setChangeNotice(res.data.content)
    } else {
      setChangeNotice('')
    }
  }


  // 省份切换事件
  async function onChange(event) {
    const {detail: {value}} = event

    setProvinceName(province[value])
    await setKeyAndValue('oli', province[value])

  }

  return (
    <View className='container'>
      <View className='header'>
        <Text className='title'>油价信息查询</Text>
        <Text className='subtitle'>实时更新各地油价</Text>
      </View>

      <View className='province-selector'>
        <View className='selector-label'>
          <Icon name='location-o' className='icon' />
          <Text>选择省份</Text>
        </View>
        <View className='selector-content'>
          <Picker mode='selector' range={province} onChange={onChange}>
            <Button plain type='primary' className='select-btn' size='small'>
              {provinceName}
              <Icon className='select-btn-icon' name='arrow-down' />
            </Button>
          </Picker>
        </View>
      </View>

      {Object.keys(oilData).length === 0 ? '' : (
        <>
          <View className='oil-info'>
            {changNotice !== '' ?
              <View className='notice'>
                <NoticeBar leftIcon='volume-o' text={changNotice} wrapable scrollable={false} />
              </View> : ''}

            <View className='oil-item'>
              <View className='oil-type'>
                <Icon name='fire-o' className='icon' />
                <Text>92# 汽油</Text>
              </View>
              <Text className='oil-price'>{oilData.oil92}</Text>
            </View>

            <View className='oil-item'>
              <View className='oil-type'>
                <Icon name='fire-o' className='icon' />
                <Text>95# 汽油</Text>
              </View>
              <Text className='oil-price'>{oilData.oil95}</Text>
            </View>

            <View className='oil-item'>
              <View className='oil-type'>
                <Icon name='fire-o' className='icon' />
                <Text>98# 汽油</Text>
              </View>
              <Text className='oil-price'>{oilData.oil98}</Text>
            </View>

            <View className='oil-item'>
              <View className='oil-type'>
                <Icon name='fire-o' className='icon' />
                <Text>0# 柴油</Text>
              </View>
              <Text className='oil-price diesel'>{oilData.oil0}</Text>
            </View>
          </View>

          <View className='update-time-container'>
            <View className='update-time-content'>
              <Icon name='clock-o' className='update-icon' />
              <Text className='update-text'>更新时间：{oilData.updatetime}</Text>
            </View>
          </View>
        </>
      )}

      <View className='footer'>
        <Text>数据来源：官方发布</Text>
      </View>
    </View>
  );
}

export default Oil;
