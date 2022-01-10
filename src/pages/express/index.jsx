import React from 'react'
import {Text, View} from "@tarojs/components";
import {AtSearchBar, AtTimeline} from 'taro-ui'
import Taro from "@tarojs/taro";
import './index.scss'
import findExpressCompanyByCode from "../../utils/express";


function Express() {
  /**
   * 定义快递state
   * expressNum:快递单号
   * expressLine:快递物流信息时间线
   * expressName:快递公司名称
   */
  const [expressNum, setExpressNum] = React.useState('')
  const [expressLine, setExpressLine] = React.useState([])
  const [expressName, setExpressName] = React.useState('')

  //
  // const [ loading, setLoading ] = React.useState(false)


  function handleSearchBarChange(searchValue) {
    setExpressNum(searchValue)
  }


  async function onActionClick() {
    if (expressNum === '') {
      console.log('11111')
      await Taro.showToast({
        title: '请输入快递单号',
        icon:'error',
        duration: 1000
      })
      return
    }
    await Taro.showLoading({
      title: 'Loading...',
    });
    let res = await Taro.request({
      method: 'POST',
      url: 'https://v2.alapi.cn/api/kd', //仅为示例，并非真实的接口地址
      data: {
        token: '',
        number: expressNum
      }
    })
    // console.log(res)
    if (res.statusCode === 200) {
      const {data} = res.data
      // 根据 快递公司code 获取快递公司信息
      let expressCompany = findExpressCompanyByCode(data.com);
      setExpressName(expressCompany.name)
      const {info} = data
      let dataList = info.map((i) => {
        return {
          title: i.content,
          content: [i.time]
        }
      })
      // console.log(dataList)
      setExpressLine(dataList)
      await Taro.hideLoading()
    }
  }


  return (
    <View className='index'>
      <AtSearchBar value={expressNum} onChange={handleSearchBarChange} actionName='查询' onActionClick={onActionClick}/>
      <View className='search-result'>
        <View className='express-info'>
          <Text className='express-name'>{expressName}</Text>
          {/*<Text className='express-num'>{expressNum}</Text>*/}
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
