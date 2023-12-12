import React, {useEffect} from 'react';
import Taro from "@tarojs/taro";
import {Radio, RadioGroup, View} from "@tarojs/components";
import {Button, Cell, CellGroup, Dialog, Divider, Field, Search} from "@antmjs/vantui";
import './index.scss';
import {myRequest} from "../../../utils/request";
import {CustomerCreate, CustomerList} from "../../../utils/api";

function Index() {
  const [addShow, setAddShow] = React.useState(false)
  const [deleteShow, setDeleteShow] = React.useState(false)
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState('1')
  const [customerList, setCustomerList] = React.useState([])

  useEffect(() => {
    getCustomerList()
  }, [])

  const getCustomerList = () => {
    myRequest(CustomerList(),{},'GET').then(res=>{
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
    // 从本地存储获取openid
    const openid = Taro.getStorageSync('openid')
    myRequest(CustomerCreate(),{name,type,openid},'POST').then(res=>{
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


  return (
    <View className='container'>
      <Search placeholder='搜索' />
      <Button type='primary' block onClick={()=>setAddShow(true)}>添加客户</Button>
      <Divider />
      {customerList.map((item,index) => (
          <CellGroup key={index}>
            <Cell title={item.name} value={
              <Button type='primary' onClick={()=>{
                console.log(item)
              }}
              >删除</Button>
            }
            />
          </CellGroup>
      ))}
      <Dialog
        id='add'
        title='添加客户'
        showCancelButton
        show={addShow}
        onClose={() => setAddShow(false)}
        onConfirm={()=> addConfirm()}
      >
        <CellGroup title='客户名称'>
          <Field
            value={name}
            placeholder='请输入客户名称'
            border={false}
            onChange={(e) => setName(e.detail)}
          />
        </CellGroup>
        <CellGroup title='客户类型' style={{marginBottom:'20px'}}>
          <RadioGroup style={{paddingLeft:'10px'}}
            direction='horizontal'
            value={type}
            onChange={(e) => setType(e.detail)}
          >
            <Radio name='1' checked={type==='1'} style={{marginBottom:'10px'}}>出货（统计收入额）</Radio>
            <Radio name='2' checked={type==='2'}>进货（统计支出额）</Radio>
          </RadioGroup>
        </CellGroup>
      </Dialog>
      <Dialog
        id='delete'
        message='确定删除该客户吗？'
        showCancelButton
        show={deleteShow}
        onClose={() => setDeleteShow(false)}
      >
      </Dialog>
    </View>
  );
}

export default Index;
