import React from "react";
import {Cell, CellGroup} from "@antmjs/vantui";
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import SearchBar from "../../components/Search";
import {getAbbrApi} from "../../utils/api";
import {myRequest} from "../../utils/request";
import {setHistoryStorage} from "../../utils/storage";
import SearchHistory from "../../components/SearchHistory";
import './index.scss'


function Garbage() {

  const [typeData, setTypeData] = React.useState([])


  async function onActionClick(keyword) {
    if (keyword === '') {
      return
    }
    await Taro.showLoading({
      title: 'Loading...',
    });

    let res = await myRequest(getAbbrApi(), {keyword})
    if (res.code === 200) {
      setTypeData(res.data.explain_arr);
      await Taro.hideLoading();
      setHistoryStorage('abbr', keyword, 5)
    } else {

      await Taro.showToast({
        title: res.msg,
        icon: 'error',
        duration: 1000
      })
    }
  }


  return (
    <View className='container'>
      <SearchBar placeholderData='yyds' getSearchKeyword={onActionClick} />
      <View className='search-result'>

        {typeData.length > 0 ? (<CellGroup>
          {typeData.map((data, index) => {
            return (
              <Cell
                key={index}
                title={data}
              />

            )
          })}

        </CellGroup>) : (<SearchHistory keyName='abbr' getSearchKeyword={onActionClick} />)}

      </View>
    </View>

  );
}

export default Garbage;
