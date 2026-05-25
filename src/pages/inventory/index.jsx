import React, { useState } from 'react'
import { Picker, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Button, Dialog, Field, Popup, Search, Switch, Toast } from '@antmjs/vantui'
import { myRequest } from '../../utils/request'
import {
  getInventoryCategoriesApi,
  getInventoryGroupsApi,
  getInventoryItemsApi,
  getInventoryOverviewApi,
  getInventorySubCategoriesApi,
} from '../../utils/api'
import './index.scss'

const cardColors = ['#73b600', '#269987', '#2f73b7', '#8e24aa', '#55a64a', '#1f33d6']

function emptyCategoryForm() {
  return { name: '' }
}

function emptySubCategoryForm(categoryId = 0) {
  return { categoryId, name: '' }
}

function emptyItemForm(categoryId = 0, subCategoryId = 0) {
  return {
    categoryId,
    subCategoryId,
    groupId: 0,
    name: '',
    quantity: '',
    unit: '包',
    lowStockThreshold: '',
    remark: '',
  }
}

function asNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return 0
  }
  const number = Number(value)
  return Number.isNaN(number) ? NaN : number
}

function InventoryPage() {
  const [openid] = useState(Taro.getStorageSync('openid'))
  const [overview, setOverview] = useState([])
  const [groups, setGroups] = useState([])
  const [keyword, setKeyword] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [groupId, setGroupId] = useState(0)
  const [loading, setLoading] = useState(false)

  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false)
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm())
  const [subCategoryDialogVisible, setSubCategoryDialogVisible] = useState(false)
  const [subCategoryForm, setSubCategoryForm] = useState(emptySubCategoryForm())
  const [itemDialogVisible, setItemDialogVisible] = useState(false)
  const [itemForm, setItemForm] = useState(emptyItemForm())
  const [groupDialogVisible, setGroupDialogVisible] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  const ToastView = Toast.createOnlyToast()

  useLoad(async () => {
    if (!openid) {
      Taro.showToast({ title: '请先登录后再使用', icon: 'none' })
      return
    }
    await Promise.all([fetchOverview(), fetchGroups()])
  })

  async function fetchOverview(next = {}) {
    if (!openid) {
      return
    }
    setLoading(true)
    const params = {
      openid,
      keyword: next.keyword !== undefined ? next.keyword : keyword,
      lowStockOnly: next.lowStockOnly !== undefined ? next.lowStockOnly : lowStockOnly,
    }
    const nextGroupId = next.groupId !== undefined ? next.groupId : groupId
    if (nextGroupId) {
      params.groupId = nextGroupId
    }
    try {
      const res = await myRequest(getInventoryOverviewApi(), params, 'GET')
      if (res.code !== 200) {
        Taro.showToast({ title: res.msg || '加载失败', icon: 'none' })
        return
      }
      setOverview(Array.isArray(res.data) ? res.data : [])
    } finally {
      setLoading(false)
    }
  }

  async function fetchGroups() {
    const res = await myRequest(getInventoryGroupsApi(), { openid }, 'GET')
    if (res.code === 200) {
      setGroups(Array.isArray(res.data) ? res.data : [])
    }
  }

  function openCreateCategory() {
    setCategoryForm(emptyCategoryForm())
    setCategoryDialogVisible(true)
  }

  async function saveCategory() {
    const name = categoryForm.name.trim()
    if (!name) {
      Taro.showToast({ title: '请输入大分类名称', icon: 'none' })
      return false
    }
    const res = await myRequest(getInventoryCategoriesApi(), { openid, name }, 'POST')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '保存失败', icon: 'none' })
      return false
    }
    setCategoryDialogVisible(false)
    await fetchOverview()
    return true
  }

  function openCreateSubCategory(categoryId) {
    setSubCategoryForm(emptySubCategoryForm(categoryId))
    setSubCategoryDialogVisible(true)
  }

  async function saveSubCategory() {
    const name = subCategoryForm.name.trim()
    if (!name) {
      Taro.showToast({ title: '请输入小分类名称', icon: 'none' })
      return false
    }
    const res = await myRequest(getInventorySubCategoriesApi(), {
      openid,
      categoryId: subCategoryForm.categoryId,
      name,
    }, 'POST')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '保存失败', icon: 'none' })
      return false
    }
    setSubCategoryDialogVisible(false)
    await fetchOverview()
    return true
  }

  function firstSubCategoryId(category) {
    if (!category.subCategories || category.subCategories.length === 0) {
      return 0
    }
    return category.subCategories[0].id
  }

  function openCreateItem(category) {
    const subCategoryId = firstSubCategoryId(category)
    if (!subCategoryId) {
      Taro.showToast({ title: '请先创建小分类', icon: 'none' })
      openCreateSubCategory(category.id)
      return
    }
    setItemForm(emptyItemForm(category.id, subCategoryId))
    setItemDialogVisible(true)
  }

  async function saveItem() {
    const name = itemForm.name.trim()
    const unit = itemForm.unit.trim()
    const quantity = asNumber(itemForm.quantity)
    const lowStockThreshold = asNumber(itemForm.lowStockThreshold)
    if (!name) {
      Taro.showToast({ title: '请输入物品名称', icon: 'none' })
      return false
    }
    if (!unit) {
      Taro.showToast({ title: '请输入单位', icon: 'none' })
      return false
    }
    if (Number.isNaN(quantity) || quantity < 0 || Number.isNaN(lowStockThreshold) || lowStockThreshold < 0) {
      Taro.showToast({ title: '请输入合法数量', icon: 'none' })
      return false
    }
    const payload = {
      openid,
      categoryId: itemForm.categoryId,
      subCategoryId: itemForm.subCategoryId,
      groupId: itemForm.groupId ? Number(itemForm.groupId) : null,
      name,
      quantity,
      unit,
      lowStockThreshold,
      remark: itemForm.remark.trim() || null,
    }
    const res = await myRequest(getInventoryItemsApi(), payload, 'POST')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '保存失败', icon: 'none' })
      return false
    }
    setItemDialogVisible(false)
    await fetchOverview()
    return true
  }

  async function saveGroup() {
    const name = newGroupName.trim()
    if (!name) {
      Taro.showToast({ title: '请输入分组名称', icon: 'none' })
      return false
    }
    const res = await myRequest(getInventoryGroupsApi(), { openid, name }, 'POST')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '保存失败', icon: 'none' })
      return false
    }
    setGroupDialogVisible(false)
    setNewGroupName('')
    await fetchGroups()
    return true
  }

  function goDetail(item) {
    Taro.navigateTo({ url: `/pages/inventory/detail/index?id=${item.id}` })
  }

  async function handleKeywordSearch(value) {
    setKeyword(value)
    await fetchOverview({ keyword: value })
  }

  async function toggleLowStock(value) {
    setLowStockOnly(value)
    await fetchOverview({ lowStockOnly: value })
  }

  async function handleGroupFilterChange(event) {
    const options = [{ id: 0, name: '全部分组' }, ...groups]
    const selected = options[Number(event.detail.value)] || options[0]
    setGroupId(selected.id)
    await fetchOverview({ groupId: selected.id })
  }

  const groupFilterOptions = [{ id: 0, name: '全部分组' }, ...groups]
  const selectedGroupFilterIndex = Math.max(groupFilterOptions.findIndex((item) => item.id === groupId), 0)
  const selectedGroupFilterName = groupFilterOptions[selectedGroupFilterIndex]?.name || '全部分组'
  const currentCategory = overview.find((category) => category.id === itemForm.categoryId)
  const subCategoryOptions = currentCategory?.subCategories || []
  const selectedSubCategoryIndex = Math.max(subCategoryOptions.findIndex((item) => item.id === itemForm.subCategoryId), 0)
  const selectedSubCategoryName = subCategoryOptions[selectedSubCategoryIndex]?.name || '请选择小分类'
  const itemGroupOptions = [{ id: 0, name: '不分组' }, ...groups]
  const selectedItemGroupIndex = Math.max(itemGroupOptions.findIndex((item) => item.id === itemForm.groupId), 0)
  const selectedItemGroupName = itemGroupOptions[selectedItemGroupIndex]?.name || '不分组'

  const hasData = overview.length > 0

  return (
    <View className='inventory-page'>
      <View className='inventory-title'>我的存量</View>
      <Search
        value={keyword}
        placeholder='请输入搜索内容'
        onChange={(event) => setKeyword(event.detail)}
        onSearch={(event) => handleKeywordSearch(event.detail)}
        onClear={() => handleKeywordSearch('')}
      />
      <View className='inventory-filter'>
        <View className='filter-switch'>
          <Text>只看低库存</Text>
          <Switch size='24px' checked={lowStockOnly} onChange={(event) => toggleLowStock(event.detail)} />
        </View>
        <Picker
          mode='selector'
          range={groupFilterOptions.map((item) => item.name)}
          value={selectedGroupFilterIndex}
          onChange={handleGroupFilterChange}
        >
          <View className='group-filter'>{selectedGroupFilterName}</View>
        </Picker>
        <Button size='small' type='primary' onClick={openCreateCategory}>新增大分类</Button>
      </View>

      {!hasData && <View className='empty'>{loading ? '加载中...' : '暂无物品，先创建大分类吧'}</View>}

      {overview.map((category) => (
        <View className='category-section' key={category.id}>
          <View className='category-head'>
            <View>
              <Text className='category-name'>{category.name}</Text>
              <Text className='category-meta'>{category.itemCount}类物品 共计{category.totalQuantity}</Text>
            </View>
            <View className='category-actions'>
              <Button size='small' onClick={() => openCreateSubCategory(category.id)}>小分类</Button>
              <Button size='small' type='primary' onClick={() => openCreateItem(category)}>物品</Button>
            </View>
          </View>
          {(category.subCategories || []).map((subCategory) => (
            <View className='sub-section' key={subCategory.id}>
              <View className='sub-head'>
                <Text className='sub-name'>{subCategory.name}</Text>
                <Text className='sub-meta'>{subCategory.itemCount}种 共{subCategory.totalQuantity}</Text>
              </View>
              <View className='item-grid'>
                {(subCategory.items || []).map((item, index) => (
                  <View
                    className={`item-card ${item.lowStock ? 'item-card--low' : ''}`}
                    key={item.id}
                    style={{ background: cardColors[index % cardColors.length] }}
                    onClick={() => goDetail(item)}
                  >
                    {item.lowStock && <Text className='low-badge'>低</Text>}
                    <Text className='item-name'>{item.name}</Text>
                    <View className='item-quantity'>
                      <Text>{item.quantity}</Text>
                      <Text className='item-unit'>{item.unit}</Text>
                    </View>
                    {item.groupName ? <Text className='item-group'>{item.groupName}</Text> : null}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}

      <Dialog
        id='inventory-category-dialog'
        title='新增大分类'
        show={categoryDialogVisible}
        showCancelButton
        onClose={() => setCategoryDialogVisible(false)}
        onConfirm={saveCategory}
      >
        <Field value={categoryForm.name} placeholder='例如：纸尿裤' onChange={(event) => setCategoryForm({ name: event.detail })} />
      </Dialog>

      <Dialog
        id='inventory-sub-category-dialog'
        title='新增小分类'
        show={subCategoryDialogVisible}
        showCancelButton
        onClose={() => setSubCategoryDialogVisible(false)}
        onConfirm={saveSubCategory}
      >
        <Field value={subCategoryForm.name} placeholder='例如：NB码' onChange={(event) => setSubCategoryForm((prev) => ({ ...prev, name: event.detail }))} />
      </Dialog>

      <Dialog
        id='inventory-item-dialog'
        title='新增物品'
        show={itemDialogVisible}
        showCancelButton
        onClose={() => setItemDialogVisible(false)}
        onConfirm={saveItem}
      >
        <View className='item-editor'>
          <Picker
            mode='selector'
            range={subCategoryOptions.map((item) => item.name)}
            value={selectedSubCategoryIndex}
            onChange={(event) => {
              const selected = subCategoryOptions[Number(event.detail.value)]
              if (selected) {
                setItemForm((prev) => ({ ...prev, subCategoryId: selected.id }))
              }
            }}
          >
            <Field label='小分类' readonly value={selectedSubCategoryName} />
          </Picker>
          <Field label='名称' value={itemForm.name} placeholder='例如：山茶花 NB' onChange={(event) => setItemForm((prev) => ({ ...prev, name: event.detail }))} />
          <Field label='数量' type='digit' value={itemForm.quantity} placeholder='0' onChange={(event) => setItemForm((prev) => ({ ...prev, quantity: event.detail }))} />
          <Field label='单位' value={itemForm.unit} placeholder='包' onChange={(event) => setItemForm((prev) => ({ ...prev, unit: event.detail }))} />
          <Field label='预警值' type='digit' value={itemForm.lowStockThreshold} placeholder='0' onChange={(event) => setItemForm((prev) => ({ ...prev, lowStockThreshold: event.detail }))} />
          <Field label='备注' value={itemForm.remark} placeholder='选填' onChange={(event) => setItemForm((prev) => ({ ...prev, remark: event.detail }))} />
          <Picker
            mode='selector'
            range={itemGroupOptions.map((item) => item.name)}
            value={selectedItemGroupIndex}
            onChange={(event) => {
              const selected = itemGroupOptions[Number(event.detail.value)] || itemGroupOptions[0]
              setItemForm((prev) => ({ ...prev, groupId: selected.id }))
            }}
          >
            <Field label='分组' readonly value={selectedItemGroupName} />
          </Picker>
          <View className='group-row'>
            <Button size='small' onClick={() => setGroupDialogVisible(true)}>新建分组</Button>
          </View>
        </View>
      </Dialog>

      <Dialog
        id='inventory-group-dialog'
        title='新建分组'
        show={groupDialogVisible}
        showCancelButton
        onClose={() => setGroupDialogVisible(false)}
        onConfirm={saveGroup}
      >
        <Field value={newGroupName} placeholder='例如：卧室' onChange={(event) => setNewGroupName(event.detail)} />
      </Dialog>

      <Popup show={false} />
      <ToastView />
    </View>
  )
}

export default InventoryPage
