import React, { useState } from 'react'
import { Picker, Text, View } from '@tarojs/components'
import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { Button, DatetimePicker, Dialog, Field, Popup } from '@antmjs/vantui'
import { myRequest } from '../../utils/request'
import { getBloodGlucoseApi, getBloodGlucoseListApi } from '../../utils/api'
import './index.scss'

const DATE_FORMAT = 'yyyy-mm-dd'
const UNIT_OPTIONS = ['mmol/L', 'mg/dL']
const PAGE_SIZE = 20

function formatDate(dateLike) {
  const date = typeof dateLike === 'number' ? new Date(dateLike) : new Date(dateLike)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function todayDate() {
  return formatDate(Date.now())
}

function asInputValue(value) {
  return value === undefined || value === null ? '' : `${value}`
}

function asNullableNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }
  const next = Number(value)
  return Number.isNaN(next) ? null : next
}

function emptyForm() {
  return {
    measure_date: todayDate(),
    before_breakfast: '',
    after_breakfast_2h: '',
    after_lunch_2h: '',
    after_dinner_2h: '',
    unit: 'mmol/L',
    remark: '',
  }
}

function formatRecordValue(value) {
  if (value === null || value === undefined || value === '') {
    return '--'
  }
  return value
}

function convertToMmol(value, unit) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const nextValue = Number(value)
  if (Number.isNaN(nextValue)) {
    return null
  }

  if ((unit || 'mmol/L').toLowerCase() === 'mg/dl') {
    return nextValue / 18
  }

  return nextValue
}

function getMetricValueClass(value, metricField, unit) {
  const mmolValue = convertToMmol(value, unit)
  if (mmolValue === null) {
    return 'metric-value'
  }

  if (metricField === 'before_breakfast') {
    if (mmolValue < 3.9) {
      return 'metric-value metric-value--low'
    }
    if (mmolValue > 6.1) {
      return 'metric-value metric-value--high'
    }
    return 'metric-value'
  }

  if (mmolValue < 3.9) {
    return 'metric-value metric-value--low'
  }
  if (mmolValue >= 7.8) {
    return 'metric-value metric-value--high'
  }

  return 'metric-value'
}

function parseListPayload(data) {
  if (Array.isArray(data)) {
    return {
      list: data,
      page: 1,
      pageSize: PAGE_SIZE,
      total: data.length,
      hasMore: data.length >= PAGE_SIZE,
    }
  }

  const list = Array.isArray(data?.list) ? data.list : []
  const page = Number(data?.page)
  const pageSize = Number(data?.pageSize)
  const total = Number(data?.total)

  const nextPage = Number.isFinite(page) && page > 0 ? page : 1
  const nextPageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : PAGE_SIZE
  const nextTotal = Number.isFinite(total) && total >= 0 ? total : list.length
  const hasMore = typeof data?.hasMore === 'boolean'
    ? data.hasMore
    : nextPage * nextPageSize < nextTotal

  return {
    list,
    page: nextPage,
    pageSize: nextPageSize,
    total: nextTotal,
    hasMore,
  }
}

function BloodGlucosePage() {
  const [openid,] = React.useState(Taro.getStorageSync('openid'))
  const [records, setRecords] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)

  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [datePickerValue, setDatePickerValue] = useState(Date.now())
  const [datePickerTarget, setDatePickerTarget] = useState('start_date')
  const [resumeEditorAfterDatePicker, setResumeEditorAfterDatePicker] = useState(false)

  const [editorVisible, setEditorVisible] = useState(false)
  const [editingId, setEditingId] = useState(0)
  const [form, setForm] = useState(emptyForm())

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(0)

  useLoad(async () => {
    if (!openid) {
      Taro.showToast({ title: '请先登录后再使用', icon: 'none' })
      setRecords([])
      setCurrentPage(1)
      setHasMore(false)
      return
    }
    await fetchRecords({ page: 1 })
  })

  useReachBottom(async () => {
    if (!openid || editorVisible || datePickerVisible || deleteDialogVisible) {
      return
    }
    if (!hasMore || listLoading || loadMoreLoading) {
      return
    }

    await fetchRecords({ page: currentPage + 1, append: true })
  })

  async function fetchRecords({
    start = startDate,
    end = endDate,
    page = 1,
    append = false,
  } = {}) {
    if (!openid) {
      setRecords([])
      setCurrentPage(1)
      setHasMore(false)
      return
    }

    if (append && loadMoreLoading) {
      return
    }
    if (!append && listLoading) {
      return
    }

    if (append) {
      setLoadMoreLoading(true)
    } else {
      setListLoading(true)
    }

    const params = {
      openid,
      page,
      pageSize: PAGE_SIZE,
    }
    if (start) {
      params.startDate = start
    }
    if (end) {
      params.endDate = end
    }

    try {
      const res = await myRequest(getBloodGlucoseListApi(), params, 'GET')
      if (res.code !== 200) {
        Taro.showToast({ title: res.msg || '加载记录失败', icon: 'none' })
        return
      }

      const pagePayload = parseListPayload(res.data)
      setRecords((prev) => (append ? [...prev, ...pagePayload.list] : pagePayload.list))
      setCurrentPage(pagePayload.page)
      setHasMore(Boolean(pagePayload.hasMore))
    } finally {
      if (append) {
        setLoadMoreLoading(false)
      } else {
        setListLoading(false)
      }
    }
  }

  function closeDatePicker() {
    setDatePickerVisible(false)
    if (resumeEditorAfterDatePicker) {
      setEditorVisible(true)
      setResumeEditorAfterDatePicker(false)
    }
  }

  function handleDateOpen(target, dateText) {
    if (target === 'measure_date' && editorVisible) {
      setResumeEditorAfterDatePicker(true)
      setEditorVisible(false)
    } else {
      setResumeEditorAfterDatePicker(false)
    }

    setDatePickerTarget(target)
    setDatePickerValue(dateText ? new Date(dateText).getTime() : Date.now())
    setDatePickerVisible(true)
  }

  function handleDateConfirm() {
    const nextDate = formatDate(datePickerValue)
    if (datePickerTarget === 'start_date') {
      setStartDate(nextDate)
    } else if (datePickerTarget === 'end_date') {
      setEndDate(nextDate)
    } else {
      setForm((prev) => ({ ...prev, measure_date: nextDate }))
    }
    closeDatePicker()
  }

  function changeFormField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function openCreateDialog() {
    if (!openid) {
      Taro.showToast({ title: '请先登录后再使用', icon: 'none' })
      return
    }

    setEditingId(0)
    setForm(emptyForm())
    setEditorVisible(true)
  }

  function openEditDialog(record) {
    setEditingId(record.id)
    setForm({
      measure_date: record.measure_date || todayDate(),
      before_breakfast: asInputValue(record.before_breakfast),
      after_breakfast_2h: asInputValue(record.after_breakfast_2h),
      after_lunch_2h: asInputValue(record.after_lunch_2h),
      after_dinner_2h: asInputValue(record.after_dinner_2h),
      unit: record.unit || 'mmol/L',
      remark: asInputValue(record.remark),
    })
    setEditorVisible(true)
  }

  function validateForm() {
    if (!openid) {
      Taro.showToast({ title: '请先登录后再使用', icon: 'none' })
      return false
    }

    if (!form.measure_date) {
      Taro.showToast({ title: '请选择日期', icon: 'none' })
      return false
    }

    const numberFields = ['before_breakfast', 'after_breakfast_2h', 'after_lunch_2h', 'after_dinner_2h']
    for (let i = 0; i < numberFields.length; i += 1) {
      const field = numberFields[i]
      if (form[field] !== '' && Number.isNaN(Number(form[field]))) {
        Taro.showToast({ title: '请输入合法数字', icon: 'none' })
        return false
      }
    }

    return true
  }

  async function submitForm() {
    if (!validateForm()) {
      return
    }

    const payload = {
      openid,
      measure_date: form.measure_date,
      before_breakfast: asNullableNumber(form.before_breakfast),
      after_breakfast_2h: asNullableNumber(form.after_breakfast_2h),
      after_lunch_2h: asNullableNumber(form.after_lunch_2h),
      after_dinner_2h: asNullableNumber(form.after_dinner_2h),
      unit: (form.unit || 'mmol/L').trim() || 'mmol/L',
      remark: form.remark ? form.remark.trim() : null,
    }

    const isEdit = editingId > 0
    const url = isEdit ? `${getBloodGlucoseApi()}/${editingId}` : `${getBloodGlucoseApi()}/create`
    const method = isEdit ? 'PUT' : 'POST'

    const res = await myRequest(url, payload, method)
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '保存失败', icon: 'none' })
      return
    }

    Taro.showToast({ title: isEdit ? '更新成功' : '创建成功', icon: 'success' })
    setEditorVisible(false)
    await fetchRecords({ page: 1 })
  }

  function askDelete(id) {
    setDeleteId(id)
    setDeleteDialogVisible(true)
  }

  async function confirmDelete() {
    if (!deleteId) {
      return
    }

    const res = await myRequest(`${getBloodGlucoseApi()}/${deleteId}`, { openid }, 'DELETE')
    if (res.code !== 200) {
      Taro.showToast({ title: res.msg || '删除失败', icon: 'none' })
      return
    }

    Taro.showToast({ title: '删除成功', icon: 'success' })
    setDeleteDialogVisible(false)
    setDeleteId(0)
    await fetchRecords({ page: 1 })
  }

  async function resetFilters() {
    setStartDate('')
    setEndDate('')
    await fetchRecords({ start: '', end: '', page: 1 })
  }

  function openReportPage() {
    if (!openid) {
      Taro.showToast({ title: '请先登录后再使用', icon: 'none' })
      return
    }

    const query = []
    if (startDate) {
      query.push(`startDate=${encodeURIComponent(startDate)}`)
    }
    if (endDate) {
      query.push(`endDate=${encodeURIComponent(endDate)}`)
    }

    const url = query.length > 0
      ? `/pages/bloodGlucose/report/index?${query.join('&')}`
      : '/pages/bloodGlucose/report/index'

    Taro.navigateTo({ url })
  }

  return (
    <View className='blood-glucose-page'>
      <View className='filter-row'>
        <View className='date-tag' onClick={() => handleDateOpen('start_date', startDate)}>
          <Text>{startDate || '开始日期'}</Text>
        </View>
        <Text className='dash'>-</Text>
        <View className='date-tag' onClick={() => handleDateOpen('end_date', endDate)}>
          <Text>{endDate || '结束日期'}</Text>
        </View>
      </View>

      <View className='toolbar action-toolbar'>
        <Button className='action-btn action-btn--create' size='small' onClick={openCreateDialog}>
          新增
        </Button>
        <Button className='action-btn action-btn--query' size='small' onClick={() => fetchRecords({ page: 1 })}>
          查询
        </Button>
        <Button className='action-btn action-btn--reset' size='small' onClick={resetFilters}>
          重置
        </Button>
        <Button className='action-btn action-btn--report' size='small' onClick={openReportPage}>
          图表
        </Button>
      </View>

      <View className='record-list'>
        {records.length === 0 && <View className='empty'>{listLoading ? '加载中...' : '暂无记录'}</View>}

        {records.map((item) => (
          <View className='record-card' key={item.id}>
            <View className='record-head'>
              <Text className='date'>{item.measure_date}</Text>
              <Text className='unit'>{item.unit || 'mmol/L'}</Text>
            </View>

            <View className='metric'>
              <Text>早餐前</Text>
              <Text className={getMetricValueClass(item.before_breakfast, 'before_breakfast', item.unit)}>{formatRecordValue(item.before_breakfast)}</Text>
            </View>
            <View className='metric'>
              <Text>早餐后2小时</Text>
              <Text className={getMetricValueClass(item.after_breakfast_2h, 'after_breakfast_2h', item.unit)}>{formatRecordValue(item.after_breakfast_2h)}</Text>
            </View>
            <View className='metric'>
              <Text>午餐后2小时</Text>
              <Text className={getMetricValueClass(item.after_lunch_2h, 'after_lunch_2h', item.unit)}>{formatRecordValue(item.after_lunch_2h)}</Text>
            </View>
            <View className='metric'>
              <Text>晚餐后2小时</Text>
              <Text className={getMetricValueClass(item.after_dinner_2h, 'after_dinner_2h', item.unit)}>{formatRecordValue(item.after_dinner_2h)}</Text>
            </View>

            {item.remark ? <View className='remark'>备注：{item.remark}</View> : null}

            <View className='card-actions'>
              <Button size='small' type='primary' onClick={() => openEditDialog(item)}>
                编辑
              </Button>
              <Button size='small' type='danger' onClick={() => askDelete(item.id)}>
                删除
              </Button>
            </View>
          </View>
        ))}

        {records.length > 0 && (
          <View className='list-footer'>
            {loadMoreLoading ? '正在加载更多...' : hasMore ? '上拉加载更多' : '没有更多了'}
          </View>
        )}
      </View>

      <Popup
        show={datePickerVisible}
        position='bottom'
        zIndex={3000}
        onClose={closeDatePicker}
      >
        <DatetimePicker
          type='date'
          minDate={new Date(2020, 0, 1).getTime()}
          maxDate={new Date(2035, 11, 31).getTime()}
          value={datePickerValue}
          onInput={(event) => setDatePickerValue(event.detail)}
          onCancel={closeDatePicker}
          onConfirm={handleDateConfirm}
        />
      </Popup>

      <Dialog
        id='blood-glucose-editor'
        title={editingId > 0 ? '编辑记录' : '新增记录'}
        show={editorVisible}
        showCancelButton
        onClose={() => setEditorVisible(false)}
        onConfirm={submitForm}
      >
        <View className='editor-content'>
          <Field
            label='测量日期'
            readonly
            value={form.measure_date}
            placeholder={DATE_FORMAT}
            onClickInput={() => handleDateOpen('measure_date', form.measure_date)}
          />
          <Field
            label='早餐前血糖'
            type='digit'
            value={form.before_breakfast}
            placeholder='选填'
            onChange={(event) => changeFormField('before_breakfast', event.detail)}
          />
          <Field
            label='早餐后2小时血糖'
            type='digit'
            value={form.after_breakfast_2h}
            placeholder='选填'
            onChange={(event) => changeFormField('after_breakfast_2h', event.detail)}
          />
          <Field
            label='午餐后2小时血糖'
            type='digit'
            value={form.after_lunch_2h}
            placeholder='选填'
            onChange={(event) => changeFormField('after_lunch_2h', event.detail)}
          />
          <Field
            label='晚餐后2小时血糖'
            type='digit'
            value={form.after_dinner_2h}
            placeholder='选填'
            onChange={(event) => changeFormField('after_dinner_2h', event.detail)}
          />
          <Picker
            mode='selector'
            range={UNIT_OPTIONS}
            value={Math.max(UNIT_OPTIONS.indexOf(form.unit), 0)}
            onChange={(event) => {
              const selectedIndex = Number(event.detail.value)
              changeFormField('unit', UNIT_OPTIONS[selectedIndex] || 'mmol/L')
            }}
          >
            <Field
              label='单位'
              readonly
              value={form.unit || 'mmol/L'}
              placeholder='请选择单位'
            />
          </Picker>
          <Field
            label='备注'
            value={form.remark}
            placeholder='选填'
            onChange={(event) => changeFormField('remark', event.detail)}
          />
        </View>
      </Dialog>

      <Dialog
        id='blood-glucose-delete'
        message='确定删除这条记录吗？'
        show={deleteDialogVisible}
        showCancelButton
        onClose={() => setDeleteDialogVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  )
}

export default BloodGlucosePage
