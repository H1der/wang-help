import React, {useEffect, useState} from 'react';
import {AtCard, AtIcon} from "taro-ui";
import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {myRequest} from "../../utils/request";
import './index.scss'
import api from "../../utils/api";

function Index() {
  const [lotteryList, setLotteryList] = useState([])
  useEffect(() => {
    try {
      return getLottery()
    } catch (error) {
      return Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [])


  async function getLottery() {
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(api.getLottery())
    if (res.code === 200) {
      setLotteryList(res.data)
      console.log(res.data)
      await Taro.hideLoading();
    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
  }

  function handleAtGridClick(num,lotteryGameCode) {
    return Taro.navigateTo({
      url: `/pages/lottery/history/index?num=${num}&lotteryGameCode=${lotteryGameCode}`
    })
  }
  return (

    <View  className='container'>

      {lotteryList.map(lottery=> {
        return (
          <AtCard
            onClick={()=>handleAtGridClick(lottery.lotteryGameNum,lottery.lotteryGameCode)}
            className={lottery.lotteryGameCode}
            note={lottery.lotteryDrawDate + '   ' + lottery.lotteryDrawDay}
            extra={lottery.lotteryDrawNum + '期'}
            title={lottery.lotteryGameName}
          >
            <>
              <AtIcon className='detail' value='chevron-right' size='25' color='#999' />
            {/*字符串转数组循环*/}
            {lottery.lotteryDrawResult.split(' ').map((text,index)=>{
              return(
                <Text className='ball' key={index}>{text}</Text>
              )
            })}

            </>
          </AtCard>
        )
      })}

    </View>
  );
}

export default Index;
