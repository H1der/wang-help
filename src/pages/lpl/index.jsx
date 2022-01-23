import {useEffect, useState} from 'react';
import {AtTabs, AtTabsPane} from "taro-ui";
import {ScrollView, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import './index.scss'
import Match from "../../components/Match";
import {myRequest} from "../../utils/request";
import api from "../../utils/api";

function Index() {
  const [current, setCurrent] = useState(0)
  const [weekList, setWeekList] = useState([])
  const [roundList, setRoundList] = useState([])
  const [viewId, setViewId] = useState('')
  useEffect(() => {
    try {
      return getWeek()
    } catch (error) {
      return Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [])

  // 处理 tabs 点击事件
  function handleClick(value) {

    setCurrent(value)
    return getRound(weekList[value])
  }

  async function getWeek() {
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(api.getLplWeek())
    if (res.code === 200) {
      const {data} = res
      // 返回 isNowWeek 为1的数组下标
      const isNowWeekKey = data.findIndex(item => {
        return item.isNowWeek === 1
      })
      setWeekList(data)
      // 设置 Current 为 isNowWeekKey
      setCurrent(isNowWeekKey)
      // 根据 下标元素查询赛程
      await getRound(data[isNowWeekKey])
      await Taro.hideLoading();
    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
  }

  async function getRound(week) {
    await Taro.showLoading({
      title: 'Loading...',
    });


    let res = await myRequest(api.getLplRound(), {week: week.id})
    if (res.code === 200) {
      const {data} = res
      setRoundList(res.data)
      await Taro.hideLoading();

      // 查找 状态为正在比赛或者未开始的赛程
      const scrollId = data.find(item => {
        return item.status === '1' || item.status === '0'
      })
      data.indexOf(scrollId) !== 0 ? setViewId(`match-${scrollId.matchID}`) : setViewId(`match-${data[0].matchID}`)
      // console.log(data.indexOf(scrollId) === 0)
      //
      // // console.log(scrollId);
      //
      // await Taro.pageScrollTo({
      //   selector: data.indexOf(scrollId) !== 0 ? `#match-${scrollId.matchID}` : '',
      //   duration: 300,
      // })

    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
  }


  return (
    <View className='container'>
      <AtTabs
        className='tabs'
        current={current}
        scroll
        tabList={weekList}
        onClick={handleClick}
        animated
      >

        {weekList.map((week, index) => {
          return (<AtTabsPane current={current} index={index} key={index}>
            <ScrollView
              scrollY
              className='list'
              scrollIntoView={viewId}
              enableBackToTop
              scrollWithAnimation
            >
            {roundList.map((round) => {
              return (<Match round={round} />)
            })}
            </ScrollView>
          </AtTabsPane>)
        })}
      </AtTabs>
    </View>
  );
}

export default Index;
