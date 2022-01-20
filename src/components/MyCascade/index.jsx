import {useState} from 'react';
import {View} from "@tarojs/components";
import {AtList, AtListItem, AtModal, AtModalContent, AtTabs, AtTabsPane} from "taro-ui";
import city from "../../utils/city";
import './index.scss'

function MyCascade(props) {
  const {getCityId, show,modalState} = props;
  const tabList = [{title: '省'}, {title: '市'}]

  // 当前选中的是哪个标签栏
  const [current, setCurrent] = useState(0)
  // 省份列表
  const [province] = useState(city.provinceInfoArr());
  // 城市列表
  const [cities, setCities] = useState(city.citiesArr(1));

  function handleClick(value) {
    setCurrent(value)
  }

  // 选中省份后，将所下属的城市设置到城市列表状态里，再将所选标签栏切换到市
  function handleProvinceItemClick(province_id) {
    setCities(city.citiesArr(province_id))
    setCurrent(1)
  }

  function handleCityItemClick(cityObj) {
    getCityId(cityObj)
  }

  function modalClose() {
    modalState(false)
  }

  return (
    <View className='container'>
      <AtModal isOpened={show} onClose={modalClose}>
        <AtModalContent>
          <AtTabs current={current} tabList={tabList} onClick={handleClick}>
            <AtTabsPane current={current} index={0}>
              <AtList>
                {province.map((item) => {
                  return (<AtListItem onClick={() => handleProvinceItemClick(item.province_id)} title={item.name}
                    key={item.province_id}
                  />)
                })}
              </AtList>
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <AtList>
                {cities.map((item) => {
                  return (<AtListItem onClick={() => handleCityItemClick(item)} title={item.name} key={item.city_id} />)
                })}
              </AtList>
            </AtTabsPane>
          </AtTabs>
        </AtModalContent>
      </AtModal>
    </View>
  );
}

export default MyCascade;
