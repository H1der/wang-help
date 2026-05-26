import React, { useState } from 'react'
import { Picker, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Dialog, Field, Icon, Popup, Search, Switch, Toast } from '@antmjs/vantui'
import { myRequest } from '../../utils/request'
import {
  getInventoryCategoriesApi,
  getInventoryGroupsApi,
  getInventoryItemsApi,
  getInventoryOverviewApi,
  getInventorySubCategoriesApi,
} from '../../utils/api'
import {
  buildCategoryForm,
  buildCategoryPayload,
  buildInventoryOpenidUrl,
  buildSubCategoryForm,
  buildSubCategoryPayload,
  getCategoryActionItems,
  getCategoryDialogTitle,
  getSubCategoryActionItems,
  getSubCategoryDialogTitle,
  translateInventoryError,
} from './categoryActions'
import './index.scss'

const cardColors = ['#73b600', '#269987', '#2f73b7', '#8e24aa', '#55a64a', '#1f33d6']

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

function emptyDeleteTarget() {
  return { visible: false, type: '', id: 0, name: '' }
}

function IconAction({ action, onClick }) {
  return (
    <View
      className={`icon-action icon-action--${action.tone}`}
      hoverClass='icon-action--hover'
      aria-label={action.label}
      onClick={onClick}
    >
      <Icon name={action.icon} size='34' />
    </View>
  )
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
  const [categoryForm, setCategoryForm] = useState(buildCategoryForm())
  const [subCategoryDialogVisible, setSubCategoryDialogVisible] = useState(false)
  const [subCategoryForm, setSubCategoryForm] = useState(buildSubCategoryForm())
  const [itemDialogVisible, setItemDialogVisible] = useState(false)
  const [itemForm, setItemForm] = useState(emptyItemForm())
  const [groupDialogVisible, setGroupDialogVisible] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(emptyDeleteTarget())

  const ToastView = Toast.createOnlyToast()

  useDidShow(async () => {
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
    setCategoryForm(buildCategoryForm())
    setCategoryDialogVisible(true)
  }

  function openEditCategory(category) {
    setCategoryForm(buildCategoryForm(category))
    setCategoryDialogVisible(true)
  }

  async function saveCategory() {
    const name = categoryForm.name.trim()
    if (!name) {
      Taro.showToast({ title: '请输入大分类名称', icon: 'none' })
      return false
    }
    const url = categoryForm.id ? `${getInventoryCategoriesApi()}/${categoryForm.id}` : getInventoryCategoriesApi()
    const method = categoryForm.id ? 'PUT' : 'POST'
    const res = await myRequest(url, buildCategoryPayload(openid, categoryForm), method)
    if (res.code !== 200) {
      Taro.showToast({ title: translateInventoryError(res.msg || '保存失败'), icon: 'none' })
      return false
    }
    setCategoryDialogVisible(false)
    await fetchOverview()
    return true
  }

  function openCreateSubCategory(categoryId) {
    setSubCategoryForm(buildSubCategoryForm(categoryId))
    setSubCategoryDialogVisible(true)
  }

  function openEditSubCategory(categoryId, subCategory) {
    setSubCategoryForm(buildSubCategoryForm(categoryId, subCategory))
    setSubCategoryDialogVisible(true)
  }

  async function saveSubCategory() {
    const name = subCategoryForm.name.trim()
    if (!name) {
      Taro.showToast({ title: '请输入小分类名称', icon: 'none' })
      return false
    }
    const url = subCategoryForm.id ? `${getInventorySubCategoriesApi()}/${subCategoryForm.id}` : getInventorySubCategoriesApi()
    const method = subCategoryForm.id ? 'PUT' : 'POST'
    const res = await myRequest(url, buildSubCategoryPayload(openid, subCategoryForm), method)
    if (res.code !== 200) {
      Taro.showToast({ title: translateInventoryError(res.msg || '保存失败'), icon: 'none' })
      return false
    }
    setSubCategoryDialogVisible(false)
    await fetchOverview()
    return true
  }

  function openDeleteCategory(category) {
    setDeleteTarget({ visible: true, type: 'category', id: category.id, name: category.name })
  }

  function openDeleteSubCategory(subCategory) {
    setDeleteTarget({ visible: true, type: 'subCategory', id: subCategory.id, name: subCategory.name })
  }

  function handleCategoryAction(actionKey, category) {
    const handlers = {
      edit: () => openEditCategory(category),
      delete: () => openDeleteCategory(category),
      subCategory: () => openCreateSubCategory(category.id),
    }
    handlers[actionKey]?.()
  }

  function handleSubCategoryAction(actionKey, categoryId, subCategory) {
    const handlers = {
      edit: () => openEditSubCategory(categoryId, subCategory),
      delete: () => openDeleteSubCategory(subCategory),
      item: () => openCreateItem(categoryId, subCategory.id),
    }
    handlers[actionKey]?.()
  }

  async function confirmDeleteTarget() {
    if (!deleteTarget.id) {
      return false
    }
    const baseApi = deleteTarget.type === 'category' ? getInventoryCategoriesApi() : getInventorySubCategoriesApi()
    const res = await myRequest(buildInventoryOpenidUrl(`${baseApi}/${deleteTarget.id}`, openid), {}, 'DELETE')
    if (res.code !== 200) {
      Taro.showToast({ title: translateInventoryError(res.msg || '删除失败'), icon: 'none' })
      return false
    }
    Taro.showToast({ title: '删除成功', icon: 'success' })
    setDeleteTarget(emptyDeleteTarget())
    await fetchOverview()
    return true
  }

  function openCreateItem(categoryId, subCategoryId) {
    setItemForm(emptyItemForm(categoryId, subCategoryId))
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
  const categoryActionItems = getCategoryActionItems()
  const subCategoryActionItems = getSubCategoryActionItems()

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
              {categoryActionItems.map((action) => (
                <IconAction
                  action={action}
                  key={action.key}
                  onClick={() => handleCategoryAction(action.key, category)}
                />
              ))}
            </View>
          </View>
          {(category.subCategories || []).map((subCategory) => (
            <View className='sub-section' key={subCategory.id}>
              <View className='sub-head'>
                <View className='sub-info'>
                  <Text className='sub-name'>{subCategory.name}</Text>
                  <Text className='sub-meta'>{subCategory.itemCount}种 共{subCategory.totalQuantity}</Text>
                </View>
                <View className='sub-actions'>
                  {subCategoryActionItems.map((action) => (
                    <IconAction
                      action={action}
                      key={action.key}
                      onClick={() => handleSubCategoryAction(action.key, category.id, subCategory)}
                    />
                  ))}
                </View>
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
        title={getCategoryDialogTitle(categoryForm)}
        show={categoryDialogVisible}
        showCancelButton
        onClose={() => setCategoryDialogVisible(false)}
        onConfirm={saveCategory}
      >
        <Field value={categoryForm.name} placeholder='例如：纸尿裤' onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.detail }))} />
      </Dialog>

      <Dialog
        id='inventory-sub-category-dialog'
        title={getSubCategoryDialogTitle(subCategoryForm)}
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

      <Dialog
        id='inventory-delete-category-dialog'
        title='确认删除'
        message={`确定删除${deleteTarget.type === 'category' ? '大分类' : '小分类'}「${deleteTarget.name}」吗？`}
        show={deleteTarget.visible}
        showCancelButton
        onClose={() => setDeleteTarget(emptyDeleteTarget())}
        onConfirm={confirmDeleteTarget}
      />

      <Popup show={false} />
      <ToastView />
    </View>
  )
}

export default InventoryPage
