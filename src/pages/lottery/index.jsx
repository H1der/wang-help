import React, {useEffect, useState} from 'react';
import {AtList, AtListItem} from "taro-ui";
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {myRequest} from "../../utils/request";
import api from "../../utils/api";

function Index() {
  const [lotteryList, setLotteryList] = useState([])
  useEffect(() => {
    try {
      return getWeek()
    } catch (error) {
      return Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [])


  async function getWeek() {
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(api.getLottery())
    if (res.code === 200) {
      const {data} = res
      setLotteryList(data)
      console.log(data)
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
    <View>
      <AtList>
      {lotteryList.map(lottery => {
        return (

          <>
            <AtListItem title={lottery.dlt.typeName +'  '+ lottery.dlt.term + '期'} note={lottery.dlt.numberCode.join(' ')} arrow='right' />
            <AtListItem title={lottery.pls.typeName +'  '+ lottery.pls.term + '期'} note={lottery.pls.numberCode.join(' ')} arrow='right' />
            <AtListItem title={lottery.plw.typeName +'  '+ lottery.plw.term + '期'} note={lottery.plw.numberCode.join(' ')} arrow='right' />
            <AtListItem title={lottery.qxc.typeName +'  '+ lottery.qxc.term + '期'} note={lottery.qxc.numberCode.join(' ')} arrow='right' />
          </>
        )
      })}
      </AtList>
    </View>
  );
}

export default Index;
