import {useEffect, useState} from 'react';
import {ScrollView, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {Tab, Tabs, Toast} from "@antmjs/vantui";
import './index.scss'
import Match from "../../components/Match";
import {myRequest} from "../../utils/request";
import {getLplRoundApi, getLplWeekApi} from "../../utils/api";

function Index() {
  const [current, setCurrent] = useState(0)
  const [weekList, setWeekList] = useState([])
  const [roundList, setRoundList] = useState([])
  const [viewId, setViewId] = useState('')
  useEffect(() => {
    try {
      getWeek()
    } catch (error) {
      return Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [])

  // 处理 tabs 点击事件
  function handleClick(value) {
    setCurrent(value.index)
    return getRound(weekList[value.index])
  }

  async function getWeek() {
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(getLplWeekApi())
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


    let res = await myRequest(getLplRoundApi(), {week: week.id})
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

      // console.log(scrollId);
      //
      await Taro.pageScrollTo({
        selector: data.indexOf(scrollId) !== 0 ? `#match-${scrollId.matchID}` : '',
        duration: 300,
      })

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
      <Tabs className='tabs' sticky autoHeight lineWidth='42' lineHeight='8' titleInactiveColor='#FFFFFF' titleActiveColor='#FFD700' color='#FFD700' active={current} animated onChange={({detail}) =>
        handleClick(detail)}
      >
          {weekList.map((week, index) => {
            return (
              <Tab title={week.title} key={index}>
                      <ScrollView
                        scrollY
                        className='list'
                        scrollIntoView={viewId}
                        enableBackToTop
                        scrollWithAnimation
                      >
                        {roundList.map((round, subIndex) => {
                          return (<Match round={round} index={subIndex} key={subIndex} />)
                        })}
                </ScrollView>
              </Tab>
            )
          })}
      </Tabs>
      {/*<AtTabs*/}
      {/*  className='tabs'*/}
      {/*  current={current}*/}
      {/*  scroll*/}
      {/*  tabList={weekList}*/}
      {/*  onClick={handleClick}*/}
      {/*  animated*/}
      {/*>*/}

      {/*  {weekList.map((week, index) => {*/}
      {/*    return (<AtTabsPane current={current} index={index} key={index}>*/}
      {/*      <ScrollView*/}
      {/*        scrollY*/}
      {/*        className='list'*/}
      {/*        scrollIntoView={viewId}*/}
      {/*        enableBackToTop*/}
      {/*        scrollWithAnimation*/}
      {/*      >*/}
      {/*        {roundList.map((round, subIndex) => {*/}
      {/*          return (<Match round={round} index={subIndex} key={subIndex} />)*/}
      {/*        })}*/}
      {/*      </ScrollView>*/}
      {/*    </AtTabsPane>)*/}
      {/*  })}*/}
      {/*</AtTabs>*/}
    </View>
  );
}

export default Index;
