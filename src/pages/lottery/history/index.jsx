import Taro from "@tarojs/taro";
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from "@tarojs/components";
import {AtTabs, AtTabsPane} from "taro-ui";
import './index.scss'
import {myRequest} from "../../../utils/request";
import api from "../../../utils/api";

function Index() {
  const [current, setCurrent] = useState(0)
  const lotteryTypeList = [{title: '七星彩', lotteryGameCode: 'qxc', lotteryGameNum: '04'},
    {title: '超级大乐透', lotteryGameCode: "dlt", lotteryGameNum: "85"},
    {title: '排列3', lotteryGameCode: 'pls', lotteryGameNum: '35'},
    {title: '排列5', lotteryGameCode: 'plw', lotteryGameNum: '350133'}]
  const [lotteryList, setLotteryList] = useState([])
  useEffect(() => {
    try {
      // 返回 lotteryGameCode 相同的数组下标
      const {params} = Taro.getCurrentInstance().router
      const isCurrent = lotteryTypeList.findIndex(item => {
        return item.lotteryGameCode === params.lotteryGameCode
      })
      setCurrent(isCurrent)
      return getHistory(params.num)
    } catch (error) {
      return Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [])
  useEffect(() => {
    try {
      console.log(lotteryTypeList[current])
      return getHistory(lotteryTypeList[current].lotteryGameNum)
    } catch (error) {
      return Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [current])

  function handleClick(value) {
    setCurrent(value)
  }


  async function getHistory(num) {
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(api.getLotteryHistory(), {num})
    if (res.code === 200) {
      const {data} = res
      setLotteryList(data)
      await Taro.hideLoading();
    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
  }

  return (
    <View className='container-history'>
      <AtTabs
        className='tabs'
        current={current}
        scroll
        tabList={lotteryTypeList}
        onClick={handleClick}
        animated
      >

        {lotteryTypeList.map((week, index) => {
          return (<AtTabsPane current={current} index={index} key={index}>
            <ScrollView
              scrollY
              className='list'
              // scrollIntoView={viewId}
              enableBackToTop
              scrollWithAnimation
            >
              {lotteryList.map((lottery) => {
                return (<View className='match-item'>
                  <View className='info'>
                    <Text>{`${lottery.lotteryDrawNum}期    `}</Text>
                    <Text>{`${lottery.lotteryDrawDate}   ${lottery.lotteryDrawDay}`}</Text>
                  </View>
                  <View className={lotteryTypeList[current].lotteryGameCode}>
                    {lottery.lotteryDrawResult.split(' ').map((text, key) => {
                      return (
                        <Text className='ball' key={key}>{text}</Text>
                      )
                    })}
                  </View>

                </View>)
              })}
            </ScrollView>
          </AtTabsPane>)
        })}
      </AtTabs>


    </View>
  );
}

export default Index;
