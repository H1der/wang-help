import React from 'react'
import {Text, View} from "@tarojs/components";
import {AtTimeline} from 'taro-ui'
import Taro from "@tarojs/taro";
import './index.scss'
import findExpressCompanyByCode from "../../utils/express";
import Search from "../../components/Search/Search";
import api from '../../utils/api'
import {myRequest} from "../../utils/request";

function Express() {
  /**
   * 定义快递state
   * expressNum:快递单号
   * expressLine:快递物流信息时间线
   * expressName:快递公司名称
   */
    // const [expressNum, setExpressNum] = React.useState('')
  const [expressLine, setExpressLine] = React.useState([])
  const [expressName, setExpressName] = React.useState('')
  const [expressState, setExpressState] = React.useState('')


  async function onActionClick(keyword) {
    if (keyword === '') {
      await Taro.showToast({
        title: '请输入快递单号',
        icon: 'error',
        duration: 1000
      })
      return
    }
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(api.getExpress(), {number: keyword})
    // console.log(res.code)
    if (res.code === 200) {
      const {data} = res
      let expressCompany = findExpressCompanyByCode(data.com);
      setExpressName(expressCompany.name);
      const stateObj = ['', '正常', '派送中', '已签收', '退回', '其他问题']
      setExpressState(stateObj[data.state])
      const {info} = data;
      setExpressLine(info);
      await Taro.hideLoading();
    } else {
      // console.log(res)
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
    // return
    // let res = await Taro.request({
    //   method: 'GET',
    //   url: api.getExpress() + keyword,
    //   // data: {
    //   //   number: expressNum
    //   // }
    // })
    // console.log(res)
    // if (res.statusCode === 200) {
    //   const {data} = res.data;
    //   // 根据 快递公司code 获取快递公司信息
    //   let expressCompany = findExpressCompanyByCode(data.com);
    //   setExpressName(expressCompany.name);
    //
    //   // setExpressState(data.state);
    //   const stateObj = ['', '正常', '派送中', '已签收', '退回', '其他问题']
    //   setExpressState(stateObj[data.state])
    //   const {info} = data;
    //   setExpressLine(info);
    //   await Taro.hideLoading();
    // } else {
    //   await Taro.showToast({
    //     title: '内部网络错误',
    //     icon: 'error',
    //     duration: 1000
    //   })
    // }
  }

  return (
    <View className='container'>
      <Search getSearchKeyword={onActionClick} />
      <View className='search-result'>
        <View className='express-info'>
          <Text className='express-name'>{expressName}</Text>
          <Text className='express-state'>{expressState}</Text>
        </View>
        <AtTimeline
          items={expressLine}
        >
        </AtTimeline>
      </View>
    </View>
  );
}

export default Express;
