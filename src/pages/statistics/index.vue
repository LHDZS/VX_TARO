<template>
  <view class="statistics">
    <view class="header" v-if="type">
      <view class="tabs">
        <view class="item" v-for="(item,key) in DetailData" :key="key">
          <view class="h2">{{ item.shedName }}</view>
          <view class="content">
            <view class="list">
              <view class="name">累计入棚</view>
              <view class="text" style="color:#2D8CF0" >{{ item.totalRp }}</view>
            </view>
            <view class="list">
              <view class="name">累计死淘</view>
              <view class="text" style="color:#F53F3F" >{{ item.totalSt }}</view>
            </view>
            <view class="list">
              <view class="name">累计治愈</view>
              <view class="text" style="color:#67C23A" >{{ item.totalZy }}</view>
            </view>
            <view class="list">
              <view class="name">累计病鸽</view>
              <view class="text" style="color:#E6A23C" >{{ item.totalBg }}</view>
            </view>
            <view class="list">
              <view class="name">平均采食量</view>
              <view class="text" style="color:#2D8CF0" >{{ item.lastAverageCsl }}</view>
            </view>
            <view class="list">
              <view class="name">死淘率(%)</view>
              <view class="text" style="color:#F53F3F" >{{ item.totalStPer }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="header">
      <taroPicker :index="SelectValue" @onChange="onChange" :array="pickerArray"></taroPicker>
    </view>
    <view class="table">
      <view class="thead">
        <view class="item" v-for="(item,key) in columns" :key="key">{{ item }}</view>
      </view>
      <view class="tbody" :style="'height:' + tbodyHeight">
        <view class="items" v-for="(list,index) in columnsData" :key="index">
          <view class="item" v-for="(item,key) in columnsKey" :key="key">{{ list[item] }}</view>
        </view>
      </view>
    </view>
    <AtPagination
      v-if="title == '日常统计'"
      :total="total"
      :pageSize="pageSize"
      :current="current"
      @PageChange="onPageChange"
    >
    </AtPagination>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import './index.less'
import taroEmpty from "../../components/taro_empty.vue";
import taroPicker from "../../components/taro_picker.vue";
import { getAction,postAction } from '../../api/index'
import { getGameStatistic, getTrainStatistic, getDailyStatistic, getDailyheads, getDailyTotal } from '../../api/api'

const $instance = Taro.getCurrentInstance()

const title = $instance.router.params.title
const season = $instance.router.params.season
let SelectValue = $instance.router.params.SelectValue

wx.setNavigationBarTitle({
  title: title,
})

const tabObj = ref({
  '日常统计': {
    tabHeight: 'calc(100vh - 830rpx)',
    columns: ['日期', '铂金队', '钻石队', '青年队', '大春棚', '小春棚'],
    pickerArray: ['入棚羽数','病鸽羽数','治愈羽数','平均采食量','死淘羽数'],
    columnsKey: ['text','value','value','value','value','value']
  },
  '比赛统计': {
    tabHeight: 'calc(100vh - 430rpx)',
    columns: ['公棚', '未上笼', '集鸽数', '归巢率', '存棚率'],
    pickerArray: ['收费站','资格赛','第一关','第二关','第三关','加站赛一','加站赛二'],
    columnsKey: ['shedName','notUpCageNum','collectNum','backPer','storagePer']
  },
  '训放统计': {
    tabHeight: 'calc(100vh - 430rpx)',
    columns: ['公棚', '扫描数', '存棚率(%)', '加飞时长(分)'],
    pickerArray: [],
    columnsKey: ['shedName','scanNum','storagePer','flyTime']
  }
})

for (let i = 1; i < 16; i++) {
  tabObj.value['训放统计'].pickerArray.push('第' + i + '站');
}

const type = ref(false)

type.value = title == '日常统计'
const tbodyHeight = ref('calc(100vh - 830rpx)')

const form = ref({
  id: 0
})

const listData = ref([
  {
    text: '累计入棚',
    value: '198630',
    color: '#2D8CF0'
  },
  {
    text: '累计死淘',
    value: '320',
    color: '#F53F3F'
  },
  {
    text: '累计治愈',
    value: '1365',
    color: '#67C23A'
  },
  {
    text: '累计病鸽',
    value: '128765',
    color: '#E6A23C'
  },
  {
    text: '平均采食量',
    value: '128g',
    color: '#2D8CF0'
  },
  {
    text: '死淘率',
    value: '12%',
    color: '#F53F3F'
  },
])

const pickerArray = ref(['入棚羽数','死淘率','累计病鸽','累计治愈','平均采食量','累计死淘数'])

const onChange = (e) => {
  SelectValue = e
  if (title == '日常统计') {
    getFeedingStatisticAxios()
  } else if (title == '训放统计') {
    getTrainStatisticAxios()
  } else if (title == '比赛统计') {
    getGameStatisticAxios()
  }
}

const columns = ref(['日期', '铂金队', '钻石队', '青年队', '大春棚', '小春棚'])


const DetailData = ref([])
const columnsData = ref([])
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)


const onPageChange = (e) => {
  console.log(e.current)
  current.value = e.current
  getFeedingStatisticAxios()
}

const columnsKey = ref([])

tbodyHeight.value = tabObj.value[title].tabHeight
pickerArray.value = tabObj.value[title].pickerArray
columns.value = tabObj.value[title].columns
columnsKey.value = tabObj.value[title].columnsKey

const getGameStatisticAxios = async () => {
  await getAction(getGameStatistic,{
    season: season,
    levels: SelectValue
  }).then((res) => {
    if (!res.data) return
    columnsData.value = res.data
  })
}

const getTrainStatisticAxios = async () => {
  await getAction(getTrainStatistic,{
    season: season,
    stops: SelectValue
  }).then((res) => {
    if (!res.data) return
    columnsData.value = res.data
  })
}

const getFeedingStatisticAxios = async () => {
  await getAction(getDailyStatistic,{
    season: season,
    type: SelectValue,
    current: current.value,
    pageSize: pageSize.value
  }).then((res) => {
    if (!res.data) return
    total.value = res.data.total
    columnsData.value = res.data.list
  })
}

const getFeedingShedsAxios = async () => {
  await getAction(getDailyheads,{
    season: season
  }).then((res) => {
    if (!res.data) return
    columns.value = res.data.headName
    columnsKey.value = res.data.headKey
  })
}

const getDailyTotalAxios = async () => {
  await getAction(getDailyTotal,{
    season: season
  }).then((res) => {
    if (!res.data) return
    DetailData.value = res.data
  })
}


if (title == '日常统计') {
  console.log('触发日常统计接口') 
  getFeedingShedsAxios()
  getDailyTotalAxios()
  getFeedingStatisticAxios()
} else if (title == '训放统计') {
  console.log('触发训放统计接口')
  getTrainStatisticAxios()
} else if (title == '比赛统计') {
  console.log('触发比赛统计接口')
  getGameStatisticAxios()
  console.log(columnsKey.value)
}

</script>