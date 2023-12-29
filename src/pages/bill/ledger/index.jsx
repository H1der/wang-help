import React from 'react';
import {View} from "@tarojs/components";
import {Button, Cell, CellGroup, Collapse, CollapseItem, Table} from "@antmjs/vantui";
import Taro, {useLoad} from "@tarojs/taro";
import './index.scss';
import {myRequest} from "../../../utils/request";
import {BillsDateList, BillsMonthList, getBills, getBillsBillsList} from "../../../utils/api";

function Index() {
  const [month, setMonth] = React.useState([])
  const [monthList, setMonthList] = React.useState([])
  const [monthIndex, setMonthIndex] = React.useState(0)
  const [openid,] = React.useState(Taro.getStorageSync('openid'))


  useLoad(() => {
      getMonthList()
    }
  )

  /**
   * 表格数据-表头
   * @type {[{dataIndex: string, title: string},{dataIndex: string, title: string},{dataIndex: string, title: string},{dataIndex: string, title: string}]}
   */
  const columns = [
    {
      title: '商品',
      dataIndex: 'name',
      width: 80,
    },
    {
      title: '数量',
      dataIndex: 'num',
      width: 80,

    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 80,

    },
    {
      title: '总额',
      dataIndex: 'total',
      width: 80,

    }
  ]

  /**
   * 获取账单月份列表
   * @returns {Promise<void>}
   */
  const getMonthList = async () => {
    await Taro.showLoading()
    let res = await myRequest(BillsMonthList(), {openid}, 'GET')
    // console.log(res)
    if (res.code === 200) {
      // 设置月份列表，循环设置key值
      setMonthList(res.data)
      // setMonth(month.push(res.data[0].month))
    }
    Taro.hideLoading()
  }

  /**
   * 获取账单日期列表
   * @param monthSrt
   * @returns {Promise<void>}
   */
  const getDateList = async (monthSrt) => {
    await Taro.showLoading()
    let res = await myRequest(BillsDateList(), {openid, month: monthSrt}, 'GET')
    // console.log(res)
    if (res.code === 200) {
      // 查找monthList中month为monthSrt的的数组下标
      let index = monthList.findIndex(item => item.month === monthSrt)
      // 修改monthList中month为monthSrt的的数组下标的  dateList 属性
      setMonthList(monthList.map((item, i) =>
        i === index ? {...item, dateList: res.data} : item
      ))
      setMonthIndex(index)
      // setDate(date.push(res.data[0]))
    }
    Taro.hideLoading()
  }

  // 获取商品信息
  const getGoodsList = async (dateStr) => {
    await Taro.showLoading()
    let res = await myRequest(getBillsBillsList(), {openid, date: dateStr}, 'GET');
    // console.log(res)
    if (res.code === 200) {
      // 将 monthList 中 monthIndex 下标的 dateList中date为dateStr的的数组下标的billDetail属性修改为res.data
      setMonthList(monthList.map((item, i) =>
        i === monthIndex ? {
          ...item, dateList: item.dateList.map((subItem, subIndex) =>
            subIndex === item.dateList.findIndex(dateItem => dateItem.date === dateStr) ? {
              ...subItem, bills: res.data
            } : subItem
          )
        } : item
      ))


    }
    Taro.hideLoading()
  }
  return (

    <View className='container'>
      <Collapse value={month} onOpen={(e) => getDateList(e.detail)} onChange={(e) => setMonth(e.detail)}>
        {/*月份列表*/}
        {monthList.map((item, index) => {
          return (<CollapseItem title={`${item.month}（￥${item.total}）`} name={item.month} key={index}>
            <View className='container'>
              <Collapse value={month} onOpen={(e) => getGoodsList(e.detail)} onChange={(e) => setMonth(e.detail)}>
                {/*日期列表*/}
                {item.dateList && item.dateList.map((subItem, subIndex) => {
                  return (
                    <CollapseItem title={`${subItem.date}（￥${subItem.result}）`} name={subItem.date} key={subIndex}>
                      {/*商品列表*/}
                      {subItem.bills && subItem.bills.map(goodsItem => {
                        return (
                          <CellGroup title={
                            <>
                              {`${goodsItem.customerName}（￥${goodsItem.total}）`}
                              <Button size='mini' type='info' onClick={
                                () => {
                                  Taro.navigateTo({
                                    url: '/pages/bill/edit/index',
                                    success: function (res) {
                                      // 通过eventChannel向被打开页面传送数据
                                      res.eventChannel.emit('acceptDataFromOpenerPage',
                                        {
                                          data: goodsItem.billDetail,
                                          date: goodsItem.date,
                                          total: subItem.bills && subItem.bills.reduce((total, totalItem) => {
                                              return total + totalItem.total
                                            }
                                            , 0)
                                        });
                                    }
                                  })
                                }
                              }
                              >详情</Button>
                              <Button size='mini' type='primary' onClick={
                                () => {
                                  Taro.navigateTo({
                                    url: '/pages/bill/index',
                                    success: function (res) {
                                      // 通过eventChannel向被打开页面传送数据
                                      res.eventChannel.emit('acceptDataFromOpenerPage',
                                        {
                                          data: goodsItem.billDetail,
                                          date: goodsItem.date,
                                          customerName: goodsItem.customerName,
                                        });
                                    }
                                  })
                                }
                              }
                              >修改</Button>
                              <Button size='mini' type='danger' onClick={
                                () => {
                                  Taro.showModal({
                                    title: '提示',
                                    content: '是否删除？',
                                    success: function (res) {
                                      if (res.confirm) {
                                        // 执行删除操作
                                        myRequest(`${getBills()}/${goodsItem.id}/${openid}`, {}, 'DELETE').then(result => {
                                            if (result.code === 200) {
                                              Taro.showToast({
                                                title: '删除成功',
                                              });
                                              // 刷新页面
                                              getDateList(subItem.date)
                                            } else {
                                              Taro.showToast({
                                                title: res.msg,
                                                icon: 'none'
                                              })
                                            }
                                          }
                                        )
                                        Taro.showToast({
                                          title: '删除成功',
                                          icon: 'success',
                                          duration: 2000
                                        })
                                      }
                                    }
                                  })
                                }
                              }
                              >删除</Button>

                            </>

                          }
                          >
                            <Cell>
                              <Table
                                columns={columns}
                                dataSource={goodsItem.billDetail}
                                rowKey={goodsItem.id}

                              />
                            </Cell>
                          </CellGroup>)
                      })}
                    </CollapseItem>)
                })
                }
              </Collapse>
            </View>
          </CollapseItem>)
        })
        }


      </Collapse>
    </View>
  );
}

export default Index;
