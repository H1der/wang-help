import React, {useState} from 'react';
import {View} from "@tarojs/components";
import {AtFloatLayout, AtList, AtListItem, AtTabs, AtTabsPane} from "taro-ui";
import city from "../../utils/city";

function MyCascade(props) {
  const { getCityId,show } = props;
  const tabList = [{title: '省'}, {title: '市'}]
  const [current, setCurrent] = useState(0)
  const [province] = useState(city.provinceInfoArr());
  const [cities, setCities] = useState(city.citiesArr(1));

  function handleClick(value) {
    setCurrent(value)
  }

  function handleProvinceItemClick(province_id) {
    setCities(city.citiesArr(province_id))
    setCurrent(1)
  }

  function handleCityItemClick(cityObj) {
    getCityId(cityObj)
  }

  return (
    <View className='container'>
      <AtFloatLayout isOpened={show}>
        <AtTabs current={current} tabList={tabList} onClick={handleClick}>
          <AtTabsPane current={current} index={0}>
            <AtList>
              {province.map((item)=>{
                return (<AtListItem onClick={() => handleProvinceItemClick(item.province_id)} title={item.name} key={item.province_id} />)
              })}
            </AtList>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <AtList>
              {cities.map((item)=>{
                  return (<AtListItem onClick={() => handleCityItemClick(item)} title={item.name} key={item.city_id} />)
                })}
            </AtList>
          </AtTabsPane>
        </AtTabs>

      </AtFloatLayout>
    </View>
  );
}

export default MyCascade;
