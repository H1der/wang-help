import React, {useEffect} from 'react'
import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {Button, Col, DatetimePicker, Dialog, Divider, Field, Popup, Row, Toast} from "@antmjs/vantui";
import './index.scss'
import {myRequest} from "../../utils/request";
import {getWeatherOpenid, UserRegister} from "../../utils/api";

function Bill() {
  const [dateShow, setDateShow] = React.useState(false) // 日期选择框是否展示
  const [date, setDate] = React.useState(Date.now()) // 日期

  const onInput = React.useCallback(
    function (event) {
      setDate(event.detail)
    },
    [date],
  )

  const formatDate = React.useCallback((d) => {
    const res = new Date(d)
    return d
      ? `${res.getFullYear()}-${res.getMonth() + 1}-${res.getDate()}`
      : ''
  }, [])
  const [customer, setCustomer] = React.useState('请选择客户') // 日期
  const [customerShow, setCustomerShow] = React.useState(false) // 日期选择框是否展示
  const [clearShow, setClearShow] = React.useState(false)
  // 定义一个对象数组，用于存储商品信息
  const [goodsList, setGoodsList] = React.useState([
    {
      name: '',
      num: 0,
      price: 0,
      total: 0,
    },
  ])

  const Toast_ = Toast.createOnlyToast()





  useEffect(() => {
    // openid 是否存在
    if (Taro.getStorageSync('openid')) {
      return
    }

    Taro.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          myRequest(getWeatherOpenid(), {
            code: res.code
          },'POST').then(openid => {
            // 获取用户信息
            Taro.getUserInfo({
              success: function (info) {
                // console.log(info)
                // 发送注册请求
                myRequest(UserRegister(), {
                  openid: openid,
                  ...info.userInfo
                },'POST').then(registerRes => {
                  // console.log(registerRes)
                  if (registerRes.code === 200) {
                    // 把 openid 存储到本地
                    Taro.setStorageSync('openid', openid)
                  }
                })

              }
            })

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }, [])

  // 更新商品item的值
  const handleItemChange = (index, property, value) => {
    setGoodsList(prevGoodsList => {
      const updatedGoodsList = [...prevGoodsList];
      updatedGoodsList[index][property] = value;
      // 如果修改的是数量或者单价，需要更新总价
      if (property === 'num' || property === 'price') {
        updatedGoodsList[index].total = Math.round(updatedGoodsList[index].num * updatedGoodsList[index].price)
      }
      return updatedGoodsList;
    });
  };

  return (
    <View className='container'>
      <View className='filter'>
        <Row>
          <Col span='8' className='dark'>
            <Button>交易日期</Button>
          </Col>
          <Col span='8' className='light'>
            <Button onClick={() => {
              setDateShow(true)
            }}
            >{formatDate(date)}</Button>
          </Col>
          <Col span='8' className='btn-group'>
            <Button type='primary' size='mini' onClick={() => {
              setDate(formatDate(Date.now()))
            }}
            >今天</Button>
            <Button type='primary' size='mini' onClick={() => {
              setDate(new Date(new Date().getTime() - (24 * 60 * 60 * 1000)))
            }
            }
            >昨天</Button>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span='8' className='dark'>
            <Button>交易客户</Button>
          </Col>
          <Col span='16' className='light'>
            <Button onClick={() => {
              // setCustomerShow(true)
              // 跳转到客户列表页面，选择客户，返回客户名称
              Taro.navigateTo({
                url: '/pages/bill/customer/index',
                success: function (res) {
                  // 接收子页面传递的数据
                  res.eventChannel.on('acceptDataFromChild', function (data) {
                    setCustomer(data.name)
                  })
                }
              })
            }}
            >{customer}</Button>
          </Col>
        </Row>
      </View>

      <View className='table'>
        <Row className='title-index'>
          <Col span='7' className='title'>
            {`商品名称(${goodsList.length})`}
          </Col>
          <Col span='4' className='title'>
            数量
          </Col>
          <Col span='4' className='title'>
            单价
          </Col>
          <Col span='5' className='title'>
            结算
          </Col>
          <Col span='4' className='title'>
            移除
          </Col>
        </Row>
        {/* 商品列表 */
          goodsList.map((item, index) => {
            return (<Row className='title-index' key={index}>
              <Col span='7' className='info'>
                <Field
                  value={item.name}
                  type='text'
                  onChange={(e) => handleItemChange(index, 'name', e.detail)}
                />
              </Col>
              <Col span='4' className='info'>
                <Field
                  value={item.num}
                  type='number'
                  onFocus={(e) => {
                    if (e.detail == 0) {
                      handleItemChange(index, 'num', '')
                    }
                  }}
                  onBlur={(e) => {
                    if (e.detail == '') handleItemChange(index, 'num', 0);
                  }}

                  onChange={(e) => handleItemChange(index, 'num', e.detail)}
                />
              </Col>
              <Col span='4' className='info'>
                <Field
                  value={item.price}
                  type='number'
                  onFocus={(e) => {
                    if (e.detail == 0) handleItemChange(index, 'price', '');
                  }}
                  onBlur={(e) => {
                    if (e.detail == '') handleItemChange(index, 'price', 0);
                  }}
                  onChange={(e) => handleItemChange(index, 'price', e.detail)}

                />
              </Col>
              <Col span='5' className='info'>
                <Text>{item.total}</Text>
              </Col>
              <Col span='4' className='info'>
                <Button icon='cross' type='default' size='small' onClick={
                  () => {
                    setGoodsList(prevGoodsList => {
                      const updatedGoodsList = [...prevGoodsList];
                      // 如果只有一条数据，不做任何操作
                      if (updatedGoodsList.length === 1) {
                        return updatedGoodsList;
                      }
                      updatedGoodsList.splice(index, 1);
                      return updatedGoodsList;
                    });
                  }
                }
                />
              </Col>
            </Row>)
          })}

        <View className='btn-group'>
          <Button type='primary' icon='add-o' onClick={
            () => {
              setGoodsList(prevGoodsList => {
                const updatedGoodsList = [...prevGoodsList];
                updatedGoodsList.push({
                  name: '',
                  num: 0,
                  price: 0,
                  total: 0,
                });
                return updatedGoodsList;
              });
            }
          }
          >添加</Button>
          <Button type='primary' >商品库</Button>
          <Button type='warning' icon='delete-o' onClick={
            () => {
              setClearShow(true)
            }
          }
          >清空</Button>
          <Text className='total-text'>￥{
            goodsList.reduce((total, item) => {
              return total + item.total
            }, 0)
          }</Text>
        </View>

        <Button type='primary'  square block onClick={()=>{
          // 如果商品名称为空，不传递数据
          let goodsFilter = goodsList.filter(item => item.name !== '');
          // console.log(goodsFilter.length)
          if (goodsFilter.length === 0) {
             return  Toast_.show('商品表格空白！');
          }
          Taro.navigateTo({
          url: '/pages/bill/edit/index',
          success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage',
                { data: goodsList,
                  date: formatDate(date),
                  total: goodsList.reduce((total, item) => {
                      return total + item.total
                    }
                    , 0)
                });
            }
        })}}
        >确定</Button>


      </View>
      <Popup show={dateShow} position='bottom' onClose={() => setDateShow(false)}>
        <DatetimePicker
          type='date'
          minDate={new Date(2020, 1, 1).getTime()}
          value={date}
          onInput={onInput}
          onCancel={() => {
            setDateShow(false)
          }}
          onConfirm={() => {
            setDateShow(false)
          }}
        />
      </Popup>

      <Dialog
        id='customerDialog'
        title='选择客户'
        showCancelButton
        show={customerShow}
        onClose={() => setCustomerShow(false)}
      >
      </Dialog>

      <Dialog
        id='customerDialog'
        title='提示'
        message='确定要清空商品列表吗？'
        showCancelButton
        show={clearShow}
        onClose={() => setClearShow(false)}
        onConfirm={() => {
          setClearShow(false)
          setGoodsList([
            {
              name: '',
              num: 0,
              price: 0,
              total: 0,
            },
          ])
        }}
      >
      </Dialog>

      <Toast_ />
    </View>
  );
}

export default Bill;
