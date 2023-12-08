import React from 'react'
import {View} from "@tarojs/components";
import {Button, Col, DatetimePicker, Dialog, Divider, Field, Popup, Row} from "@antmjs/vantui";
import './index.scss'

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
  const [value, setValue] = React.useState(0)

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
          <Col span='8' className='dark'>
            <Button type='primary' size='small' onClick={() => {
              setDate(formatDate(Date.now()))
            }}
            >今天</Button>
            <Button type='primary' size='small' onClick={() => {
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
              setCustomerShow(true)
            }}
            >{customer}</Button>
          </Col>
        </Row>
      </View>


      <View className='table'>
        <Row className='title-index'>
          <Col span='7' className='title'>
            商品（1）
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
        <Row className='title-index'>
          <Col span='7' className='info'>

          </Col>
          <Col span='4' className='info'>
            <Field
              value={value}
              type='number'
              onChange={(e) => setValue(e.detail)}
            />
          </Col>
          <Col span='4' className='info'>
0
          </Col>
          <Col span='5' className='info'>

          </Col>
          <Col span='4' className='info'>
            <Button icon='cross' type='default' size='small' />
          </Col>
        </Row>
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
    </View>
  );
}

export default Bill;
