import Taro from "@tarojs/taro";
import React from "react";
import {AtButton, AtDivider, AtIcon} from "taro-ui";
import {View} from "@tarojs/components"
import Cascade from "../../components/Cascade/Cascade";
import './index.scss'
import {TravelSearchResult} from "../../components/TravelSearchResult/TravelSearchResult";


function Travel() {


  // 初始状态
  const [from, setFrom] = React.useState({
    province_id: 12,
    city_id: 10128,
    name: "三亚"
  })
  const [to, setTo] = React.useState({
    province_id: 0,
    city_id: 0,
    name: ""
  })

  // 数据返回出发城市
  const [fromInfo, setFromInfo] = React.useState({})
  // 数据返回到达城市
  const [toInfo, setToInfo] = React.useState({})
  // 是否展示结果
  const [showResult, setShowResult] = React.useState(false)


  function getFromCityId(fromObj) {
    setFrom(fromObj)
  }

  function getToCityId(toObj) {
    setTo(toObj)
  }

  async function searchTravel() {
    if (from.city_id===0 || to.city_id ===0) {
      return  await Taro.showToast({
        title: '城市为空!',
        icon: 'error',
        duration: 1000
      })
    }

    await Taro.showLoading({
      title: 'Loading...',
    });
    let res = await Taro.request({
      method: 'GET',
      url: ``,
    })
    console.log(res)
    if (res.statusCode === 200) {
      const {data: {from_info, to_info}} = res.data;
      setFromInfo(from_info)
      setToInfo(to_info)
      setShowResult(true)
      await Taro.hideLoading();
    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
      setShowResult(false)
    }
  }


  return (
    <View className='container'>

      <View className='travel'>
        <View className='at-row'>
          <View className='travel-from at-col at-col-4'>
            <Cascade getCityId={getFromCityId} selectCity={from} />
          </View>
          <View className='at-col at-col-2'>
            <AtIcon value='arrow-right' size='52' color='#F7F7F7' />
          </View>
          <View className='travel-to at-col at-col-4'>
            <Cascade getCityId={getToCityId} selectCity={to} />
          </View>
          <View className='search at-col at-col-2'>
            <AtButton circle type='secondary' size='small' onClick={searchTravel}><View
              className='at-icon at-icon-search'
            /></AtButton>
          </View>
        </View>
      </View>
      {showResult ? (<View className='search-result'>
        <TravelSearchResult info={fromInfo} type={1} />
        <AtDivider height='30' />
        <TravelSearchResult info={toInfo} type={0} />
      </View>) : ''}
    </View>
  );
}

export default Travel;
