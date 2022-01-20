import {useState} from 'react';
import {AtTabs, AtTabsPane} from "taro-ui";
import {View} from "@tarojs/components";
import './index.scss'
import Match from "../../components/Match";

function Index() {
  const [current, setCurrent] = useState(1)

  function handleClick(value) {
    setCurrent(value)
  }

  const weekList = [{
    "id": "2013",
    "title": "第一周",
    "name_en": "WEEK1",
    "is_now_week": "0"
  },
    {
      "id": "2014",
      "title": "第二周",
      "name_en": "WEEK2",
      "is_now_week": "1"
    },
    {
      "id": "2015",
      "title": "第三周",
      "name_en": "WEEK3",
      "is_now_week": "0"
    },
    {
      "id": "2016",
      "title": "第四周",
      "name_en": "WEEK4",
      "is_now_week": "0"
    },
    {
      "id": "2017",
      "title": "第五周",
      "name_en": "WEEK5",
      "is_now_week": "0"
    },
    {
      "id": "2018",
      "title": "第六周",
      "name_en": "WEEK6",
      "is_now_week": "0"
    },
    {
      "id": "2019",
      "title": "第七周",
      "name_en": "WEEK7",
      "is_now_week": "0"
    },
    {
      "id": "2020",
      "title": "第八周",
      "name_en": "WEEK8",
      "is_now_week": "0"
    },
    {
      "id": "2021",
      "title": "第九周",
      "name_en": "WEEK9",
      "is_now_week": "0"
    }]

  return (
    <View className='container'>
      <AtTabs
        current={current}
        scroll
        tabList={weekList}
        onClick={handleClick}
      >
        {weekList.map((week,index)=>{
          return (<AtTabsPane current={current} index={index}>
            <Match />
          </AtTabsPane>)
        })}


      </AtTabs>
    </View>
  );
}

export default Index;
