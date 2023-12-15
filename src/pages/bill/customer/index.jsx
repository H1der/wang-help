import React from 'react';
import Taro, {useLoad} from "@tarojs/taro";
import {View} from "@tarojs/components";
import {Button, Cell, CellGroup, Dialog, Divider, Field, Radio, RadioGroup, Search} from "@antmjs/vantui";
import './index.scss';
import {myRequest} from "../../../utils/request";
import {Customer, CustomerCreate, CustomerList} from "../../../utils/api";

function Index() {
  const [addShow, setAddShow] = React.useState(false)
  const [deleteShow, setDeleteShow] = React.useState(false)
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState('1')
  const [customerList, setCustomerList] = React.useState([])
  const [customerId, setCustomerId] = React.useState(0)
  const [openid,] = React.useState(Taro.getStorageSync('openid'))


  useLoad(() => {
      getCustomerList()
    }
  )


  const getCustomerList = () => {
    myRequest(CustomerList(), {}, 'GET').then(res => {
        if (res.code === 200) {
          setCustomerList(res.data)
        }
      }
    )
  }

  const addConfirm = () => {
    if (name === '') {
      return Taro.showToast({
        title: '请输入客户名称',
        icon: 'none'
      })
    }
    myRequest(CustomerCreate(), {name, type, openid}, 'POST').then(res => {
      if (res.code === 200) {
        Taro.showToast({
          title: '添加成功',
        });
        setAddShow(false);
        getCustomerList()

      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    // console.log(name, type)
  }


  const deleteCustomer = () => {
    myRequest(`${Customer()}/${customerId}/${openid}`, {}, 'DELETE').then(res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '删除成功',
          });
          setDeleteShow(false);
          getCustomerList()
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    )

  }

  const editCustomer = () => {
    myRequest(`${Customer()}/${customerId}`, {name, type, openid}, 'PUT').then(res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '编辑成功',
          });
          setDeleteShow(false);
          getCustomerList()
          setName('')

        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    )

  }

  const goBack = (customer) => {
    // 返回父页面，携带参数 customer
    const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromChild', customer);
    Taro.navigateBack()
  };


  return (
    <View className='container'>
      <Search placeholder='搜索' />
      <Button type='primary' block onClick={() => {
        setCustomerId(0)
        setType('1')
        setName('')
        setAddShow(true)
      }}
      >添加客户</Button>
      <Divider />
      {customerList.map((item, index) => (
        <CellGroup key={index}>
          <Cell title={<Button block size='small'  onClick={
            () => {
              goBack(item)
            }
          }
          >
            {item.name}
          </Button>}   value={
            <>
              <Button type='primary' size='small' onClick={() => {
                setName(item.name)
                setType(item.type.toString())
                setCustomerId(item.id)
                setAddShow(true)
              }}
              >修改</Button>
              <Button type='danger' size='small' onClick={() => {
                setCustomerId(item.id)
                setDeleteShow(true)
              }}
              >删除</Button>
            </>
          }
          />

        </CellGroup>
      ))}
      <Dialog
        id='add'
        title={customerId === 0 ? '添加客户' : '编辑客户'}
        showCancelButton
        show={addShow}
        onClose={() => setAddShow(false)}
        onConfirm={() => {
          customerId === 0 ? addConfirm() : editCustomer()
        }}
      >
        <CellGroup title='客户名称'>
          <Field
            value={name}
            placeholder='请输入客户名称'
            border={false}
            onChange={(e) => setName(e.detail)}
          />
        </CellGroup>
        <CellGroup title='客户类型' style={{marginBottom: '20px'}}>
          <RadioGroup value={type} style={{paddingLeft: '10px'}} onChange={(e) => {
            setType(e.detail)
          }}
          >
            <Radio name='1' style={{marginBottom: '10px'}}>出货（统计收入额）</Radio>
            <Radio name='2'>进货（统计支出额）</Radio>
          </RadioGroup>
        </CellGroup>
      </Dialog>
      <Dialog
        id='delete'
        message='确定删除该客户吗？'
        showCancelButton
        show={deleteShow}
        onConfirm={() => deleteCustomer()}
        onClose={() => setDeleteShow(false)}
      >
      </Dialog>
    </View>
  );
}

export default Index;
