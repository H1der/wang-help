import Taro from "@tarojs/taro";
import {useEffect, useLayoutEffect, useState} from "react";
import {Picker, Text, View} from "@tarojs/components";
import {Button, Cell, Col, Icon, NoticeBar, Row} from "@antmjs/vantui";
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
      <View className='province'>
        <Row gutter='10'>
          <Col span='8'>&nbsp;</Col>
          <Col span='8'> <Text className=' select-province'>选择省份：</Text></Col>
          <Col span='8'> <Picker mode='selector' range={province} onChange={onChange}>
            <Button plain type='primary' className=' select-btn' size='small'>{provinceName}
              <Icon className='select-btn-icon' name='arrow-down' />
            </Button>
          </Picker>
          </Col>
        </Row>
      </View>
      {Object.keys(oilData).length === 0 ? '' : (
        <View className='info'>
          {changNotice !== '' ? <NoticeBar leftIcon='volume-o' text={changNotice} wrapable scrollable={false} /> : ''}

          <Cell size='large' title='92# 汽油：' value={oilData.oil92} />
          <Cell size='large' title='95# 汽油：' value={oilData.oil95} />
          <Cell size='large' title='98# 汽油：' value={oilData.oil98} />
          <Cell size='large' title=' 0# 柴油：' value={oilData.oil0} />
          <Cell size='large' title='更新时间：' value={oilData.updatetime} />
        </View>)}

    </View>
  );
}

export default Oil;
