import {useState} from "react";
import {Picker, View} from "@tarojs/components"
import {AtButton} from "taro-ui";
import city from "../../utils/city";


function Cascade(props) {

  const { getCityId,selectCity } = props;
  const [province] = useState(city.provinceInfoArr());
  const [cities, setCities] = useState(city.citiesArr(1));
  const [dataSource, setDataSource] = useState([province, city.citiesArr(1)]);
  const [selectorChecked, setSelectorChecked] = useState(selectCity.name!==''?selectCity.name:'请选择');


  function onChange(event) {
    const {detail: {value}} = event
    const cityItem = cities[value[1]]
    setSelectorChecked(cityItem.name)
    getCityId(cityItem)
  }

  function onColumnChange(event) {
    // console.log(event)
    const {detail} = event
    // 如果是第一列进行拖动
    if (detail.column === 0) {
      const {value} = detail
      // 根据province_id获取所下属城市
      const {province_id} = province[value];
      setCities(city.citiesArr(province_id))
      setDataSource([province, city.citiesArr(province_id)])

    }

  }

  return (
          <Picker mode='multiSelector' range={dataSource} rangeKey='name' onChange={onChange}
            onColumnChange={onColumnChange}
          >
            <AtButton chevron-down type='secondary'>{selectorChecked}<View className='at-icon at-icon-chevron-down' /></AtButton>
          </Picker>
  );
}

export default Cascade;
