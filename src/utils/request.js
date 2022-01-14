import Taro from "@tarojs/taro";

export function myRequest(url, data = {}, method = 'GET') {
  return new Promise(function(resolve, reject) {
    Taro.request({
      url: url,
      data: data,
      method: method,
      success: function(res) {
          resolve(res.data)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}
