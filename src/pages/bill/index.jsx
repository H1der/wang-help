import React, {useEffect} from 'react'
import {Text, View} from "@tarojs/components";
import Taro, {useLoad} from "@tarojs/taro";
import {Button, Checkbox, Col, DatetimePicker, Dialog, Divider, Field, Popup, Row, Toast} from "@antmjs/vantui";
import './index.scss'
import {myRequest} from "../../utils/request";
import {BillsCreate, BillsEdit, getBillsPopularProducts, getWeatherOpenid, UserRegister} from "../../utils/api";

function Bill() {
  const [dateShow, setDateShow] = React.useState(false) // 日期选择框是否展示
  const [date, setDate] = React.useState(Date.now()) // 日期
  const [openid,] = React.useState(Taro.getStorageSync('openid'))

// 浮点数乘法精度处理函数
  const floatMultiply = (a, b) => {
    const aStr = a.toString();
    const bStr = b.toString();
    const aDecimal = aStr.includes('.') ? aStr.split('.')[1].length : 0;
    const bDecimal = bStr.includes('.') ? bStr.split('.')[1].length : 0;
    const decimal = aDecimal + bDecimal;
    return (Number(aStr.replace('.', '')) * Number(bStr.replace('.', ''))) / Math.pow(10, decimal);
  };

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
  const [customerId, setCustomerId] = React.useState(0) // 日期
  const [customerShow, setCustomerShow] = React.useState(false) // 日期选择框是否展示
  const [popularProducts, setPopularProducts] = React.useState([]) // 近期商品数据
  const [popularProductsShow, setPopularProductsShow] = React.useState(false) // 近期商品弹窗展示
  const [selectedProducts, setSelectedProducts] = React.useState({}) // 选中的商品
  const [clearShow, setClearShow] = React.useState(false)
  const [total, setTotal] = React.useState(0) // 总价
  const [action, setAction] = React.useState('add') // 操作类型
  // 定义一个对象数组，用于存储商品信息
  const [goodsList, setGoodsList] = React.useState([
    {
      name: '',
      num: 0,
      price: 0,
      total: 0,
    },
  ])

  useEffect(() => {
    let number = goodsList.reduce((subTotal, item) => {
      return subTotal + item.total
    }, 0);
    setTotal(parseFloat(number.toFixed(2)))
  },[goodsList])

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
          }, 'POST').then(openid => {
            // 获取用户信息
            Taro.getUserInfo({
              success: function (info) {
                // console.log(info)
                // 发送注册请求
                myRequest(UserRegister(), {
                  openid: openid,
                  ...info.userInfo
                }, 'POST').then(registerRes => {
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

  useLoad(() => {
  // 页面加载时执行
      const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel();

      // 监听从父页面传递的数据
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        setGoodsList(data.data)
        setDate(data.date)
        setCustomer(data.customerName)
        setAction('edit')
        // 在这里处理接收到的数组数据
      });

      return () => {
        // 页面卸载时执行，可以在这里取消事件监听等清理工作
      };
    }, {deps: []

  })

  // 更新商品item的值
  const handleItemChange = (index, property, value) => {
    setGoodsList(prevGoodsList => {
      const updatedGoodsList = [...prevGoodsList];
      updatedGoodsList[index][property] = value;
      // 如果修改的是数量或者单价，需要更新总价
      if (property === 'num' || property === 'price') {
        updatedGoodsList[index].total = floatMultiply(updatedGoodsList[index].num, updatedGoodsList[index].price);
      }
      return updatedGoodsList;
    });
  };

  const submit = () => {
    // 如果商品名称为空，不传递数据
    let goodsFilter = goodsList.filter(item => item.name !== '');
    // console.log(goodsFilter.length)
    if (goodsFilter.length === 0) {
      return Toast_.show('商品表格空白！');
    }

    myRequest(action==='add'?BillsCreate():BillsEdit(), {
      openid,
      customerName: customer,
      customerId,
      billDetail: goodsList,
      date: formatDate(date),
      total: total
    }, 'POST').then(r => {
      console.log(r)
        if (r.code === 200) {
          Taro.navigateTo({
            url: '/pages/bill/edit/index',
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage',
                {
                  data: goodsList,
                  date: formatDate(date),
                  total: total
                });
            }
          })
        } else {
          Toast_.show(r.msg);
        }
      }
    )


  }

  return (
    <View className='container'>
      <View className='filter'>
        <Row>
          <Col span='8' className='dark'>
            <Button>交易日期</Button>
          </Col>
          <Col span='8' className='dark'>
            <Button className='text-blue' onClick={() => {
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
            <Button className='text-blue' onClick={() => {
              // setCustomerShow(true)
              // 跳转到客户列表页面，选择客户，返回客户名称
              Taro.navigateTo({
                url: '/pages/bill/customer/index',
                success: function (res) {
                  // 接收子页面传递的数据
                  res.eventChannel.on('acceptDataFromChild', function (data) {
                    setCustomer(data.name)
                    setCustomerId(data.id)
                    // 获取近期商品数据
                    myRequest(getBillsPopularProducts(), {
                      customerId: data.id
                    }, 'GET').then(r => {
                      if (r.code === 200) {
                        setPopularProducts(r.data)
                        setPopularProductsShow(true)
                      }
                    })
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
                  type='digit'
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
                  type='digit'
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
          <Button type='primary'>商品库</Button>
          {/*<Button type='warning' icon='delete-o' onClick={*/}
          {/*  () => {*/}
          {/*    setClearShow(true)*/}
          {/*  }*/}
          {/*}*/}
          {/*>清空</Button>*/}
          <Button type='info' onClick={
            () => {
              Taro.navigateTo({
                url: '/pages/bill/ledger/index'
              })
            }
          }
          >账本</Button>
          <Text className='total-text'>￥{total}</Text>
        </View>

        <Button type='primary' square block onClick={() => submit()}>确定</Button>


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

      {/* 近期商品弹窗 */}
      <Popup
        show={popularProductsShow}
        position='bottom'
        onClose={() => setPopularProductsShow(false)}
        round
      >
        <View className='popup-content'>
          <View className='popup-header'>
            <Text className='popup-title'>近期商品</Text>
          </View>
          <View className='popup-body'>
            {popularProducts.map((product, index) => (
              <View className='product-item' key={index}>
                <Checkbox
                  value={selectedProducts[index] || false}
                  onChange={(e) => {
                    setSelectedProducts(prev => ({
                      ...prev,
                      [index]: e.detail,
                    }));
                  }}
                >
                  <View className='product-info'>
                    <Text className='product-name'>{product.name}</Text>
                    <Text className='product-price'>¥{product.price}</Text>
                  </View>
                </Checkbox>
              </View>
            ))}
          </View>
          <View className='popup-footer'>
            <Button
              type='primary'
              block
              onClick={() => {
                // 将选中的商品添加到商品列表
                const selectedItems = popularProducts.filter((_, index) => selectedProducts[index]);
                if (selectedItems.length > 0) {
                  setGoodsList(prevGoodsList => {
                    const updatedGoodsList = [...prevGoodsList];
                    // 移除最后一项如果是空的
                    const lastItem = updatedGoodsList[updatedGoodsList.length - 1];
                    if (lastItem.name === '' && lastItem.num === 0 && lastItem.price === 0) {
                      updatedGoodsList.pop();
                    }

                    // 添加选中的商品
                    selectedItems.forEach(item => {
                      updatedGoodsList.push({
                        name: item.name,
                        num: 0,
                        price: item.price,
                        total: 0
                      });
                    });

                    // 添加一个新的空行
                    updatedGoodsList.push({
                      name: '',
                      num: 0,
                      price: 0,
                      total: 0,
                    });

                    return updatedGoodsList;
                  });
                }
                setPopularProductsShow(false);
                setSelectedProducts({});
              }}
            >
              确定
            </Button>
          </View>
        </View>
      </Popup>

      <Toast_ />
    </View>
  );
}

export default Bill;
