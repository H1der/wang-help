import Taro from "@tarojs/taro";

export function getHistoryStorage(key) {
  return Taro.getStorageSync(key)
}

export function removeHistoryStorage(key) {
  return Taro.removeStorageSync(key)
}

// set
export function setHistoryStorage(key, data, length) {
  const storage = Taro.getStorageSync(key)

  // 判断历史数组长度是否小于指定长度,和元素书否已经存在
  if (storage.length < length) {
    // 判断是否已经存在
    if (!storage.includes(data)) {
      // console.log('数组小于5并且数据不存在')
      Taro.setStorageSync(key, [data, ...storage]);
    }else {
      // 如果已经存在
      // console.log('数组小于5并且数据存在')
      let noDataArr = storage.filter((item)=>{
        return item!==data
      })
      // console.log(noDataArr)
      Taro.setStorageSync(key, [data, ...noDataArr]);

    }
  }else {
    // 判断是否已经存在
    if (!storage.includes(data)) {
      // console.log('数组大于5并且数据不存在')
      let newDataArr = storage.filter((item,index)=>{
        return index!==length-1
      })
      Taro.setStorageSync(key, [data, ...newDataArr]);
    }else{
      // console.log('数组大于5并且数据存在')
      // 如果已经存在
      let noDataArr = storage.filter((item)=>{
        return item!==data
      })
      console.log(noDataArr)
      Taro.setStorageSync(key, [data, ...noDataArr]);
    }
  }
    // return storage




}
// 地址
export function getValueByKey(key) {
  return Taro.getStorageSync(key)
}

export async function setKeyAndValue(key,value) {
  return Taro.setStorageSync(key, value);
}
