import React, { useMemo, useState } from 'react'
import { Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Button, DatetimePicker, Popup } from '@antmjs/vantui'
import Echarts from 'taro-react-echarts'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { myRequest } from '../../../utils/request'
import { getBloodGlucoseListApi } from '../../../utils/api'
import './index.scss'

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const TEXT = {
  beforeBreakfast: '早餐前',
  afterBreakfast2h: '早餐后2小时',
  afterLunch2h: '午餐后2小时',
  afterDinner2h: '晚餐后2小时',
  loginFirst: '请先登录后再使用',
  loadFailed: '加载图表失败',
  mixedUnit: '混合单位',
  glucose: '血糖',
  earliest: '最早',
  latest: '最新',
  rangePrefix: '统计范围：',
  allRecords: '全部记录',
  chartTitle: '血糖变化图表',
  totalRecords: '记录总数：',
  unitPrefix: '单位：',
  loading: '正在加载图表...',
  empty: '暂无可展示的血糖记录',
  query: '查询',
  recent7Days: '近7天',
  back: '返回',
}

const SERIES_LIST = [
  { key: 'before_breakfast', name: TEXT.beforeBreakfast, color: '#e76f51' },
  { key: 'after_breakfast_2h', name: TEXT.afterBreakfast2h, color: '#f4a261' },
  { key: 'after_lunch_2h', name: TEXT.afterLunch2h, color: '#2a9d8f' },
  { key: 'after_dinner_2h', name: TEXT.afterDinner2h, color: '#264653' },
]

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

function formatMonthDay(dateText) {
  if (!dateText) {
    return ''
  }

  const date = new Date(dateText)
  if (Number.isNaN(date.getTime())) {
    return `${dateText}`.slice(5, 10)
  }

  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${month}-${day}`
}

function getRecent7DaysRange() {
  const endDate = formatDate(Date.now())
  const startDate = formatDate(Date.now() - 6 * ONE_DAY_MS)
  return { startDate, endDate }
}

function asNullableNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const next = Number(value)
  return Number.isNaN(next) ? null : next
}

function sortByDate(list) {
  return [...list].sort((a, b) => `${a.measure_date}`.localeCompare(`${b.measure_date}`))
}

function parseRecordList(data) {
  if (Array.isArray(data)) {
    return data
  }
  if (Array.isArray(data?.list)) {
    return data.list
  }
  return []
}

function BloodGlucoseReportPage() {
  const [openid] = useState(Taro.getStorageSync('openid'))
  const [records, setRecords] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [datePickerValue, setDatePickerValue] = useState(Date.now())
  const [datePickerTarget, setDatePickerTarget] = useState('start_date')

  useLoad(async (options) => {
    const defaultRange = getRecent7DaysRange()
    const nextStartDate = options?.startDate || defaultRange.startDate
    const nextEndDate = options?.endDate || defaultRange.endDate

    setStartDate(nextStartDate)
    setEndDate(nextEndDate)

    await fetchRecords({ start: nextStartDate, end: nextEndDate })
  })

  function closeDatePicker() {
    setDatePickerVisible(false)
  }

  function openDatePicker(target, currentDateText) {
    setDatePickerTarget(target)
    setDatePickerValue(currentDateText ? new Date(currentDateText).getTime() : Date.now())
    setDatePickerVisible(true)
  }

  function handleDateConfirm() {
    const nextDate = formatDate(datePickerValue)
    if (datePickerTarget === 'start_date') {
      setStartDate(nextDate)
    } else {
      setEndDate(nextDate)
    }
    closeDatePicker()
  }

  async function fetchRecords({ start = startDate, end = endDate } = {}) {
    if (!openid) {
      Taro.showToast({ title: TEXT.loginFirst, icon: 'none' })
      setRecords([])
      return
    }

    if (start && end && start > end) {
      Taro.showToast({ title: '开始日期不能大于结束日期', icon: 'none' })
      return
    }

    setLoading(true)

    const params = { openid }
    if (start) {
      params.startDate = start
    }
    if (end) {
      params.endDate = end
    }

    try {
      const res = await myRequest(getBloodGlucoseListApi(), params, 'GET')
      if (res.code !== 200) {
        Taro.showToast({ title: res.msg || TEXT.loadFailed, icon: 'none' })
        setRecords([])
        return
      }

      const nextRecords = sortByDate(parseRecordList(res.data))
      setRecords(nextRecords)
    } finally {
      setLoading(false)
    }
  }

  async function handleQuery() {
    await fetchRecords({ start: startDate, end: endDate })
  }

  async function resetToRecent7Days() {
    const defaultRange = getRecent7DaysRange()
    setStartDate(defaultRange.startDate)
    setEndDate(defaultRange.endDate)
    await fetchRecords({ start: defaultRange.startDate, end: defaultRange.endDate })
  }

  const unitLabel = useMemo(() => {
    const units = Array.from(new Set(records.map((item) => item.unit).filter(Boolean)))
    if (units.length === 0) {
      return 'mmol/L'
    }
    if (units.length === 1) {
      return units[0]
    }
    return TEXT.mixedUnit
  }, [records])

  const xAxisDates = useMemo(() => records.map((item) => item.measure_date || ''), [records])
  const xAxisLabels = useMemo(() => xAxisDates.map((dateText) => formatMonthDay(dateText)), [xAxisDates])

  const chartOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter(params) {
          const lines = Array.isArray(params) ? params : [params]
          const dataIndex = lines[0]?.dataIndex || 0
          const header = xAxisDates[dataIndex] || xAxisLabels[dataIndex] || ''
          const content = lines.map((item) => `${item.marker}${item.seriesName}: ${item.value ?? '--'}`)
          return [header, ...content].join('<br/>')
        },
      },
      legend: {
        top: 8,
        left: 44,
        right: 12,
        icon: 'roundRect',
        itemWidth: 16,
        itemHeight: 10,
        itemGap: 10,
      },
      grid: {
        left: '10%',
        right: '6%',
        top: 98,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisLabels,
        axisLabel: {
          color: '#5f6980',
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        name: unitLabel === TEXT.mixedUnit ? TEXT.glucose : `${TEXT.glucose} (${unitLabel})`,
        nameLocation: 'middle',
        nameGap: 48,
        nameTextStyle: {
          color: '#5f6980',
          fontSize: 10,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#dce4f3',
          },
        },
        axisLabel: {
          color: '#5f6980',
          fontSize: 10,
        },
      },
      series: SERIES_LIST.map((series) => ({
        name: series.name,
        type: 'line',
        smooth: true,
        connectNulls: false,
        showSymbol: records.length <= 20,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: series.color,
          width: 2,
        },
        itemStyle: {
          color: series.color,
        },
        data: records.map((item) => asNullableNumber(item[series.key])),
      })),
    }
  }, [records, unitLabel, xAxisDates, xAxisLabels])

  const rangeText = startDate || endDate
    ? `${TEXT.rangePrefix}${startDate || TEXT.earliest} - ${endDate || TEXT.latest}`
    : `${TEXT.rangePrefix}${TEXT.allRecords}`

  return (
    <View className='blood-glucose-report-page'>
      <View className='report-header'>
        <Text className='title'>{TEXT.chartTitle}</Text>
        <Text className='range'>{rangeText}</Text>
      </View>

      <View className='filter-row'>
        <View className='date-tag' onClick={() => openDatePicker('start_date', startDate)}>
          <Text>{startDate || '开始日期'}</Text>
        </View>
        <Text className='dash'>-</Text>
        <View className='date-tag' onClick={() => openDatePicker('end_date', endDate)}>
          <Text>{endDate || '结束日期'}</Text>
        </View>
      </View>

      <View className='toolbar'>
        <Button className='toolbar-btn toolbar-btn--query' size='small' onClick={handleQuery}>
          {TEXT.query}
        </Button>
        <Button className='toolbar-btn toolbar-btn--reset' size='small' onClick={resetToRecent7Days}>
          {TEXT.recent7Days}
        </Button>
      </View>

      <View className='tip-box'>
        <Text>{TEXT.totalRecords}{records.length}</Text>
        <Text>{TEXT.unitPrefix}{unitLabel}</Text>
      </View>

      {records.length === 0 ? (
        <View className='empty-box'>
          <Text>{loading ? TEXT.loading : TEXT.empty}</Text>
        </View>
      ) : (
        <View className='chart-card'>
          <Echarts echarts={echarts} option={chartOption} className='blood-glucose-chart' style={{ height: 360 }} isPage={false} />
        </View>
      )}

      {/* <View className='actions'>
        <Button className='action-btn' size='small' type='primary' onClick={() => Taro.navigateBack()}>
          {TEXT.back}
        </Button>
      </View> */}

      <Popup show={datePickerVisible} position='bottom' zIndex={3000} onClose={closeDatePicker}>
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
    </View>
  )
}

export default BloodGlucoseReportPage
