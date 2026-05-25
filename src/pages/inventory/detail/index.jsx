import React, { useState } from 'react'
import { Text, View } from '@tarojs/components'
import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { Button, Dialog, Field, Toast } from '@antmjs/vantui'
import { myRequest } from '../../../utils/request'
import { getInventoryItemsApi } from '../../../utils/api'
import './index.scss'

const PAGE_SIZE = 20

function formatRecordType(type) {
  return type === 'out' ? '出库' : '入库'
}

function InventoryDetailPage() {
  const [openid] = useState(Taro.getStorageSync('openid'))
  const [itemId, setItemId] = useState(0)
  const [item, setItem] = useState(null)
  const [records, setRecords] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [adjustVisible, setAdjustVisible] = useState(false)
  const [adjustType, setAdjustType] = useState('in')
  const [adjustQuantity, setAdjustQuantity] = useState('')
  const [adjustRemark, setAdjustRemark] = useState('')
  const [deleteVisible, setDeleteVisible] = useState(false)

  const ToastView = Toast.createOnlyToast()

  useLoad(async (options) => {
    const id = Number(options.id)
    if (!openid) {
      Taro.showToast({ title: '请先登录后再使用', icon: 'none' })
      return
    }
    if (!id) {
      Taro.showToast({ title: '物品不存在', icon: 'none' })
      return
    }
    setItemId(id)
    await Promise.all([fetchItem(id), fetchRecords(id, 1, false)])
  })

  useReachBottom(async () => {
    if (!hasMore || loadingMore || !itemId) {
      return
    }
    await fetchRecords(itemId, page + 1, true)
  })

  async function fetchItem(id = itemId) {
    const res = await myRequest(`${getInventoryItemsApi()}/${id}`, { openid }, 'GET')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '加载失败', icon: 'none' })
      return
    }
    setItem(res.data)
  }

  async function fetchRecords(id = itemId, nextPage = 1, append = false) {
    if (append) {
      setLoadingMore(true)
    }
    try {
      const res = await myRequest(`${getInventoryItemsApi()}/${id}/records`, {
        openid,
        page: nextPage,
        pageSize: PAGE_SIZE,
      }, 'GET')
      if (res.code !== 200) {
        Taro.showToast({ title: res.msg || '加载流水失败', icon: 'none' })
        return
      }
      const data = res.data || {}
      const list = Array.isArray(data.list) ? data.list : []
      setRecords((prev) => (append ? [...prev, ...list] : list))
      setPage(Number(data.page) || nextPage)
      setHasMore(Boolean(data.hasMore))
    } finally {
      if (append) {
        setLoadingMore(false)
      }
    }
  }

  function openAdjust(type) {
    setAdjustType(type)
    setAdjustQuantity('')
    setAdjustRemark('')
    setAdjustVisible(true)
  }

  async function submitAdjust() {
    const quantity = Number(adjustQuantity)
    if (!quantity || Number.isNaN(quantity) || quantity <= 0) {
      Taro.showToast({ title: '请输入调整数量', icon: 'none' })
      return false
    }
    const res = await myRequest(`${getInventoryItemsApi()}/${itemId}/adjust`, {
      openid,
      type: adjustType,
      changeQuantity: quantity,
      remark: adjustRemark.trim() || null,
    }, 'POST')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '调整失败', icon: 'none' })
      return false
    }
    setAdjustVisible(false)
    await Promise.all([fetchItem(), fetchRecords(itemId, 1, false)])
    return true
  }

  async function deleteItem() {
    const res = await myRequest(`${getInventoryItemsApi()}/${itemId}`, { openid }, 'DELETE')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '删除失败', icon: 'none' })
      return false
    }
    Taro.showToast({ title: '删除成功', icon: 'success' })
    setDeleteVisible(false)
    Taro.navigateBack()
    return true
  }

  if (!item) {
    return <View className='inventory-detail-page'><View className='empty'>加载中...</View><ToastView /></View>
  }

  return (
    <View className='inventory-detail-page'>
      <View className={`summary-card ${item.lowStock ? 'summary-card--low' : ''}`}>
        <View className='summary-head'>
          <Text className='item-name'>{item.name}</Text>
          {item.lowStock ? <Text className='low-text'>低库存</Text> : null}
        </View>
        <View className='quantity-row'>
          <Text className='quantity'>{item.quantity}</Text>
          <Text className='unit'>{item.unit}</Text>
        </View>
        <View className='meta-line'>{item.categoryName} / {item.subCategoryName}</View>
        {item.groupName ? <View className='meta-line'>分组：{item.groupName}</View> : null}
        <View className='meta-line'>预警值：{item.lowStockThreshold}</View>
        {item.remark ? <View className='remark'>备注：{item.remark}</View> : null}
      </View>

      <View className='actions'>
        <Button type='primary' onClick={() => openAdjust('in')}>入库</Button>
        <Button type='warning' onClick={() => openAdjust('out')}>出库</Button>
        <Button type='danger' onClick={() => setDeleteVisible(true)}>删除</Button>
      </View>

      <View className='record-title'>库存流水</View>
      {records.length === 0 && <View className='empty'>暂无流水</View>}
      {records.map((record) => (
        <View className='record-card' key={record.id}>
          <View className='record-top'>
            <Text className={record.type === 'out' ? 'record-type record-type--out' : 'record-type'}>{formatRecordType(record.type)}</Text>
            <Text className='record-time'>{record.created_at}</Text>
          </View>
          <View className='record-quantity'>
            {record.beforeQuantity} -&gt; {record.afterQuantity}
            <Text className='record-change'> {record.type === 'out' ? '-' : '+'}{record.changeQuantity}</Text>
          </View>
          {record.remark ? <View className='record-remark'>{record.remark}</View> : null}
        </View>
      ))}
      {records.length > 0 && <View className='footer'>{loadingMore ? '正在加载...' : hasMore ? '上拉加载更多' : '没有更多了'}</View>}

      <Dialog
        id='inventory-adjust-dialog'
        title={adjustType === 'out' ? '出库' : '入库'}
        show={adjustVisible}
        showCancelButton
        onClose={() => setAdjustVisible(false)}
        onConfirm={submitAdjust}
      >
        <Field label='数量' type='digit' value={adjustQuantity} placeholder='请输入数量' onChange={(event) => setAdjustQuantity(event.detail)} />
        <Field label='备注' value={adjustRemark} placeholder='选填' onChange={(event) => setAdjustRemark(event.detail)} />
      </Dialog>

      <Dialog
        id='inventory-delete-dialog'
        message='确定删除这个物品及其库存流水吗？'
        show={deleteVisible}
        showCancelButton
        onClose={() => setDeleteVisible(false)}
        onConfirm={deleteItem}
      />
      <ToastView />
    </View>
  )
}

export default InventoryDetailPage
