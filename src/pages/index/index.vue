<template>
  <view class="index">
    <view class="me" v-if="cookie == ''">
      体验完整功能请先登录
      <AtButton class="login" type='primary' @Click="onLogin" size='small'>点击登录</AtButton>
    </view>
    <view class="header">
      <taroPicker :index="SeasonNum" :value="Season" @onChange="onChangeSeason" :array="seasonArray"></taroPicker>
    </view>
    <view class="bar-chart">
      <view class="title">
        <view class="h2">入棚羽数（累计）</view>
        <view class="span" @tap="seeMore('日常统计','0')">查看更多</view>
      </view>
      <EChart ref="canvas1" style="width: 100%;height: 30vh;" canvas-id="bar-canvas1" />
        <!-- <taroEmpty v-if="getIndexNum1 == 0"></taroEmpty> -->
      <view class="title">
        <view class="h2">死淘率(%)</view>
      </view>
      <EChart ref="canvas2" style="width: 100%;height: 30vh;" canvas-id="bar-canvas2" />
      <!-- <taroEmpty v-if="getIndexNum2 == 0"></taroEmpty> -->
    </view>
    
    <view class="bar-chart">
      <view class="title">
        <view class="h2 flex">训放阶段
          <taroPicker :index="CloseNum" @onChange="onChangeClose" :array="CloseArray"></taroPicker>
        </view>
        <view class="span" @tap="seeMore('训放统计',CloseNum)">查看更多</view>
      </view>
      <EChart  ref="canvas3" style="width: 100%;height: 40vh;" canvas-id="bar-canvas3" />
      <!-- <taroEmpty v-if="getTrainNum == 0"></taroEmpty> -->
    </view>
    <view class="bar-chart">
      <view class="title">
        <view class="h2 flex">比赛阶段
          <taroPicker :index="GameNum" @onChange="onChangeGame" :array="GameArray"></taroPicker>
        </view>
        <view class="span" @tap="seeMore('比赛统计',GameNum)">查看更多</view>
      </view>
      <EChart ref="canvas4" style="width: 100%;height: 40vh;" canvas-id="bar-canvas4" />
      <!-- <taroEmpty v-if="getGameNum == 0"></taroEmpty> -->
    </view>
  </view> 
</template>

<script setup>
import Taro from "@tarojs/taro";
import "./index.less";
import { EChart } from "echarts4taro3";
import { onMounted, ref  } from "vue";
import taroEmpty from "../../components/taro_empty.vue";
import taroPicker from "../../components/taro_picker.vue";
import { getAction,postAction } from '../../api/index'
import { getIndexDaily, getGameStage, getTrainStage, getSeasonList } from '../../api/api'

let cookie = ref('')

const seeMore = (title,num) => {
  console.log(cookie.value,'点击更多')
  if (!cookie.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }
  Taro.navigateTo({ url: '/pages/statistics/index?title=' + title + '&season=' + Season.value + '&SelectValue=' + num })
}

const onLogin = () => {
  Taro.navigateTo({ url: '/pages/login/index' })
}

const getFeedingInitAxios = ref(null);
const getIndexNum1 = ref(0)
const getIndexNum2 = ref(0)
const getTrainStageAxios = ref(null);
const getTrainNum = ref(0)
const getGameStageAxios = ref(null);
const getGameNum = ref(0)

const seasonArray = ref([])
const SeasonId = ref(-1)
const Season = ref('')
const SeasonIds = ref([])
const SeasonNum = ref('0')

const onChangeSeason = (e) => {
  SeasonNum.value = e
  SeasonId.value = SeasonIds.value[e].id
  Season.value = SeasonIds.value[e].season
  getFeedingInitAxios.value()
  getTrainStageAxios.value()
  getGameStageAxios.value()
}

const CloseArray = ref([])
const CloseNum = ref('0')

for (let i = 1; i < 16; i++) {
  CloseArray.value.push('第' + i + '站');
}

const onChangeClose = (e) => {
  CloseNum.value = e
  getTrainStageAxios.value()
}

const GameArray = ref(
  ['收费站','资格赛','第一关','第二关','第三关','加站一','加站二']
)
const GameNum = ref('0')

const onChangeGame = (e) => {
  GameNum.value = e
  getGameStageAxios.value()
}

const canvas1 = ref(null);
const canvas2 = ref(null);
const canvas3 = ref(null);
const canvas4 = ref(null);

const getSeasonListAxios = async () => {
  await getAction(getSeasonList).then((res) => {
    if (!res.data || res.data.length == 0) return
    console.log(res,'赛季请求')
    seasonArray.value = res.data.map((item) => {
      return item.season
    })
    SeasonIds.value = res.data
    SeasonId.value = res.data[0].id
    Season.value = res.data[0].season
    SeasonNum.value = '0'
  })
}

Taro.eventCenter.on(Taro.getCurrentInstance().router.onShow, () => {
  const totalRpData = ref([])
  const ColorArray = ref(['#9A93FA','#F57D7F','#F5753C','#A693AF','#5FCCBF'])
  const seasonNames = ref([])
  const totalStPerData = ref([])

  const echartComponentInstance1 = canvas1.value;
  let option1 = {}
  const echartComponentInstance2 = canvas2.value;
  let option2 = {}
  getFeedingInitAxios.value = async () => {
    await getAction(getIndexDaily, {
      season: Season.value
    }).then((res) => {
      getIndexNum1.value = 0
      getIndexNum2.value = 0
      console.log(res,'获取记录')
      if (!res.data) {
        return
       }
      seasonNames.value = res.data.map((item) => {
        return item.shedName
      })

      totalRpData.value = res.data.map((item) => {
        if (item.totalRp) {
          getIndexNum1.value += 1
        }
        return {
          itemStyle: {
            color: ColorArray.value[res.data.indexOf(item)]
          },
          value: item.totalRp
        }
      })
      console.log(totalRpData.value,'totalRpData')
      totalStPerData.value = res.data.map((item) => {
        if (item.totalStPer) {
          getIndexNum2.value += 1
        }
        return {
          itemStyle: {
            color: ColorArray.value[res.data.indexOf(item)]
          },
          value: item.totalStPer
        }
      })

      console.log(totalStPerData.value,'totalStPerData')
      option1 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            textShadowColor: 'transparent',
            textShadowBlur: 10
          }
        },
        legend: {},
        grid: {
          left: '22%',
          right: '16%',
          top: '6%',
          bottom: '6%'
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'category',
          data: seasonNames.value,
          show: true
        },
        series: [
          {
            type: 'bar',
            data: totalRpData.value,
            label: {
              show: true,
              position: 'right',
              formatter: '{@c}'
            }
          }
        ]
      };
      
      echartComponentInstance1.refresh(option1);

      option2 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            textShadowColor: 'transparent',
            textShadowBlur: 10
          }
        },
        legend: {},
        grid: {
          left: '22%',
          right: '16%',
          top: '6%',
          bottom: '6%'
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'category',
          data: seasonNames.value,
          show: true
        },
        series: [
          {
            type: 'bar',
            data: totalStPerData.value,
            label: {
              show: true,
              position: 'right',
              formatter: '{@c}'
            }
          }
        ]
      };

      echartComponentInstance2.refresh(option2);
    })
  }


  const seasonGameNames = ref([])
  const flyTimeData = ref([])
  const storagePerData = ref([])
  const echartComponentInstance3 = canvas3.value;
  let option3 = {}
  getTrainStageAxios.value = () => {
    getAction(getTrainStage, {
      season: Season.value,
      stops: CloseNum.value
    }).then((res) => {
      console.log(res,'获取训飞记录')
      getTrainNum.value = 0
      if (!res.data) {
        return
      }
      seasonGameNames.value = res.data.map((item) => {
        return item.shedName
      })
      seasonGameNames.value.unshift('type')

      flyTimeData.value = res.data.map((item) => {
        if (item.flyTime) {
          getTrainNum.value += 1
        }
        return item.flyTime
      })
      flyTimeData.value.unshift('加飞时长(分)')

      storagePerData.value = res.data.map((item) => {
        if (item.storagePer) {
          getTrainNum.value += 1
        }
        return item.storagePer
      })
      storagePerData.value.unshift('存棚率%')

      option3 = {
        color: ["#003366", "#006699", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: 'axis',
          textStyle: {
            textShadowColor: 'transparent',
            textShadowBlur: 10
          }
        },
        dataset: {
          source: [
            seasonGameNames.value,
            flyTimeData.value,
            storagePerData.value,
          ]
        },
        legend: {
          show: true,
          top: "88%"
        },
        grid: {
          left: '0%',
          right: '0%',
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false
          }
        },
        yAxis: {
          show: false
        },
        series: [{
          type: "bar",
          seriesLayoutBy: "row",
          label: {
              show: true, // 显示文字
              position: 'top', // 在顶部显示
              // 可以通过 formatter 自定义显示的文本
              formatter: '{@加飞时长(分)}' // {c} 表示数据值
          }
        }, {
          type: "bar",
          seriesLayoutBy: "row",
          label: {
              show: true, // 显示文字
              position: 'top', // 在顶部显示
              // 可以通过 formatter 自定义显示的文本
              formatter: '{@存棚率%}' // {c} 表示数据值
          }
        }],
        color: ["#1C83F9", "#FB8599", "#4cabce", "#e5323e"]
      };

      echartComponentInstance3.refresh(option3);
    })
  }


  const seasonGameGameNames = ref([])
  const backPerData = ref([])
  const storagePerGameData = ref([])
  const echartComponentInstance4 = canvas4.value;
  let option4 = {}
  getGameStageAxios.value = () => {
    getAction(getGameStage, {
      season: Season.value,
      levels: GameNum.value
    }).then((res) => {
      console.log(res,'获取训飞记录')
      getGameNum.value = 0
      if (!res.data) {
        return
      }
      seasonGameGameNames.value = res.data.map((item) => {
        return item.shedName
      })

      backPerData.value = res.data.map((item) => {
        if (item.backPer) {
          getGameNum.value += 1
        }
        return item.backPer
      })


      storagePerGameData.value = res.data.map((item) => {
        if (item.storagePer) {
          getGameNum.value += 1
        }
        return item.storagePer
      })

      option4 = {
        tooltip: {
          trigger: 'axis',
          textStyle: {
            textShadowColor: 'transparent',
            textShadowBlur: 10
          }
        },
        legend: {
          data: ['归巢率%', '存棚率%'],
          top: "88%"
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: seasonGameGameNames.value
        },
        yAxis: {
          // show: false,
          type: 'value',
          // 设置最小值
          min: 0,
          // 设置最大值
          max: 100,
        },
        series: [
          {
            name: '归巢率%',
            type: 'line',
            smooth: true,
            data: backPerData.value,
            label: {
              show: true, // 显示文字
              position: 'top', // 在顶部显示
              // 可以通过 formatter 自定义显示的文本
              formatter: '{@归巢率%}' // {c} 表示数据值
            }
          },
          {
            name: '存棚率%',
            type: 'line',
            smooth: true,
            data: storagePerGameData.value,
            label: {
              show: true, // 显示文字
              position: 'top', // 在顶部显示
              // 可以通过 formatter 自定义显示的文本
              formatter: '{@存棚率%}' // {c} 表示数据值
            }
          }
        ],
        color: ["#FB8B0B", "#9DDFC7", "#4cabce", "#e5323e"]
      };

      echartComponentInstance4.refresh(option4);
    })
  }

  const avatarUrl = ref('')

  getSeasonListAxios().then(() => {
    cookie.value = Taro.getStorageSync('cookie')
    if (cookie.value) {
      getFeedingInitAxios.value()
      getTrainStageAxios.value()
      getGameStageAxios.value()
    }
  })

});

onMounted(() => {
  Taro.getUpdateManager().onUpdateReady(function() {
    Taro.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          Taro.applyUpdate()
        }
      }
    })
  })
})

// Taro.eventCenter.on(Taro.getCurrentInstance().router.onTabItemTap, () => {
//   console.log('tabItemTap')
// })
// Taro.eventCenter.on(Taro.getCurrentInstance().router.onShow, () => {
//   getFeedingShedsAxios()
//   getFeedingRecordsAxios()
// })

</script>


