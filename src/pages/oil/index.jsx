import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import {Picker, Text, View} from "@tarojs/components";
import {Button, Cell, Col, Icon, Row} from "@nutui/nutui-react-taro";
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
      <View className='province'>
        <Row gutter='10'>
          <Col span='8'><Text /></Col>
          <Col span='8'> <Text className=' select-province'>选择省份：</Text></Col>
          <Col span='8'> <Picker mode='selector' range={province} onChange={onChange}>
            <Button plain type='primary' className=' select-btn' size='small'>{provinceName}
              <Icon className='select-btn-icon' name='rect-down' />
            </Button>
          </Picker>
          </Col>
        </Row>
      </View>
      {Object.keys(oilData).length === 0 ? '' : (
        <View className='info'>
          <Cell size='large' title='92# 汽油：' desc={oilData.oil92} />
          <Cell size='large' title='95# 汽油：' desc={oilData.oil95} />
          <Cell size='large' title='98# 汽油：' desc={oilData.oil98} />
          <Cell size='large' title=' 0# 柴油：' desc={oilData.oil0} />
          <Cell size='large' title='更新时间：' desc={oilData.updatetime} />
        </View>)}

    </View>
  );
}

export default Oil;
