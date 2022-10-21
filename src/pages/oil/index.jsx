import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import {Picker, Text, View} from "@tarojs/components";
import {AtButton, AtList, AtListItem} from "taro-ui";
import './index.scss'
import {province} from "../../utils/province";
import api from "../../utils/api";
import {myRequest} from "../../utils/request";
import {getValueByKey, setKeyAndValue} from "../../utils/storage";

function Oil() {


  const [oilData, setOilData] = useState({})
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

  async function getOilPrice() {


    let res = await myRequest(api.getOil(), {province: provinceName})
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


  // 省份切换事件
  async function onChange(event) {
    const {detail: {value}} = event

    setProvinceName(province[value])
    await setKeyAndValue('oli', province[value])

  }

  return (
    <View className='container'>
      <View className='province at-row'>
        <Text className='at-col' />
        <Text className='at-col select-province'>选择省份：</Text>
        <Picker mode='selector' range={province} onChange={onChange}>
          <AtButton type='secondary' className='at-col select-btn' size='small'>{provinceName}<View
            className='at-icon at-icon-chevron-down'
          /></AtButton>
        </Picker>

      </View>
      {Object.keys(oilData).length === 0 ? '' : (<View className='info'>
        <AtList>
          <AtListItem title={'92# 汽油：' + oilData.oil92} />
          <AtListItem title={'95# 汽油：' + oilData.oil95} />
          <AtListItem title={'98# 汽油：' + oilData.oil98} />
          <AtListItem title={' 0# 柴油：' + oilData.oil0} />
          <AtListItem title={'更新时间：' + oilData.updatetime} />
        </AtList>
      </View>)}

    </View>
  );
}

export default Oil;
