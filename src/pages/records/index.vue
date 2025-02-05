<template>
  <view class="records">
    <view class="header">
      <taroPicker :index="SeasonNum" @onChange="onChange" :array="seasonArray"></taroPicker>
      <AtCalendar :currentDate="currentDate" @DayClick="onDayClick" :style="'height:' + AtHeight"/>
      <AtIcon value='subtract' color="#D9D9D9" @click="dianji"></AtIcon>
    </view>
    <view class="list" :style="'height:' + listHeight">
      <scroll-view
        :scroll-y="true"
        style="height: 100%;"
        @scrolltolower="loadMore"
      >
        <view v-if="RecordsData.length != 0">
          <AtListItem v-for="(item,key) in RecordsData" :key="key" hasBorder :title="'所属公棚：' + item.shedName" :note="'记录日期：' + item.recordDate" arrow='right' @click="onEdit(item)" />
        </view>
        <taroEmpty v-else></taroEmpty>
      </scroll-view>
      <view class="add" @tap="onAdd"><AtIcon value='add' color="#fff" size="18"></AtIcon></view>
    </view>

  </view>
</template>

<script setup>
import Taro from "@tarojs/taro";
import { onMounted, ref } from 'vue'
import './index.less'
import taroPicker from "../../components/taro_picker.vue";
import taroEmpty from "../../components/taro_empty.vue";
import { getAction,postAction } from '../../api/index'
import { getFeedingRecords, getFeedingSheds } from '../../api/api'
import { formattedDate } from '../../../utils/tool'

const seasonArray = ref([])

const SeasonId = ref(-1)
const SeasonIds = ref([])
const SeasonNum = ref('0')

const currentDate = ref('')

const page = ref(1)
const size = ref(10)
const total = ref(0)

const RecordsData = ref([])

const getFeedingShedsAxios = () => {
  getAction(getFeedingSheds).then((res) => {
    console.log(res,'公棚请求')
    seasonArray.value = res.data.map((item) => {
      return item.shedName
    })
    SeasonIds.value = res.data
    seasonArray.value.unshift('全部')
    SeasonIds.value.unshift({shedId: -1,shedName: '全部'})
  })
}


const onChange = (key) => {
  SeasonNum.value = key
  SeasonId.value = SeasonIds.value[key].shedId
  page.value = 1
  RecordsData.value = []
  getFeedingRecordsAxios()
}

const AtHeight = ref('290rpx !important;')

const listHeight = ref('calc(100vh - 340rpx)')

const dianji = () => {
  console.log('点我展开')
  if (AtHeight.value == 'auto') {
    AtHeight.value = '290rpx !important;'
    listHeight.value = 'calc(100vh - 340rpx)'
  } else {
    AtHeight.value = 'auto'
    listHeight.value = '49vh'
  }
}

const onDayClick = (e) => {
  console.log(e,'日期')
  currentDate.value = e.value
  page.value = 1
  RecordsData.value = []
  getFeedingRecordsAxios()
}

const loadMore = (e) => {
  console.log(e,'触底了')
  if (page.value * size.value < total.value) {
    page.value++
    getFeedingRecordsAxios()
  }
}

const onAdd = () => {
  console.log('点我添加')
  Taro.navigateTo({ url: '/pages/feeding/index'})  
}

const onEdit = (item) => {
  console.log('点我编辑')
  Taro.navigateTo({ url: '/pages/feeding/index?obj=' + JSON.stringify(item) })
}

const getFeedingRecordsAxios = () => {
  getAction(getFeedingRecords, {
    page: page.value,
    size: size.value,
    shedId: SeasonId.value,
    date: currentDate.value
  }).then((res) => {
    console.log(res,'获取记录')
    Taro.stopPullDownRefresh()
    if (!res.data) return
    RecordsData.value = res.data.list
    total.value = res.data.total
  })
}


Taro.eventCenter.on(Taro.getCurrentInstance().router.onShow, () => {
  getFeedingShedsAxios()
  getFeedingRecordsAxios()
})

Taro.usePullDownRefresh(() => {
  console.log('下拉刷新')
  page.value = 1
  size.value = 10
  total.value = 0
  currentDate.value = ''
  SeasonId.value = -1
  SeasonNum.value = '0'
  RecordsData.value = []
  AtHeight.value = '290rpx!important;'
  listHeight.value = 'calc(100vh - 340rpx)'


  getFeedingShedsAxios()
  getFeedingRecordsAxios()
})



</script>