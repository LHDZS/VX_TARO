<template>
  <view class="feeding">
    <view class="header">
      <view class="item">
        <view>赛季：</view><taroPicker :index="SeasonNum" :value="season" :array="seasonArray" @onChange="onChangeSeasonId" :disabled="details.id"></taroPicker>
      </view>
      <view class="item">
        <view>日期：</view><taroPicker :index="DateTime" :value="recordDate" :array="dateArray" @onChange="onChangeDate" :disabled="details.id"></taroPicker>
      </view>
    </view>
    <view class="weather">
      <view class="time">
        <!-- 更新时间：10-12 10:53:32 -->
      </view>
      <view class="temperature">
        <view class="air">{{ weatherData.temperature || '---'}}°</view>
        {{ weatherData.weather || '-'}}
      </view>
      <view className="temperature">
        最高{{ weatherData.max || '-'}}° &nbsp;&nbsp;&nbsp;&nbsp;最低{{ weatherData.min || '-'}}°
      </view>
      <view class="climate">
        <view class="item"> 
          <view class="text">{{ weatherData.windpower || '-'}}</view>
          {{ weatherData.winddirection || '-'}}
        </view>
        <view class="item">
          <view class="text">{{ weatherData.humidity || '-'}}%</view>
          相对湿度
        </view>
      </view>
    </view>
    <AtTabs :current="current" scroll :tabList="tabList" @Click="handleClick">
      <AtTabsPane :current="current" :index="0" >
        <View class="tabs_item">
          <view class="content">
            <view class="list">
              <AtInput
                name='todaySickObserveNum'
                :disabled="jurisdiction()"
                title='今日病鸽'
                type='number'
                placeholder='观察棚'
                :value="dailyRecord.todaySickObserveNum"
                @Change="inputChange($event, 'todaySickObserveNum')"
              />
              羽
              <AtInput
                name='todaySickShedNum'
                :disabled="jurisdiction()"
                style="width: 40%;"
                title=''
                type='number'
                placeholder='棚上'
                :value="dailyRecord.todaySickShedNum"
                @Change="inputChange($event, 'todaySickShedNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='totalBg'
                disabled
                title='累计病鸽'
                type='number'
                placeholder='请输入累计羽数'
                :value="dailyRecord.totalBg"
                @Change="inputChange($event, 'totalBg')"
              />
              羽
            </view>
            <view class="list">
              <view class="title" :style="jurisdiction() ? 'color:#ccc !important' : ''">病因分析</view>
              <view class="taro_picker">
                <view class="picker" @tap="onTap">
                  <view class="picker-text" :style="jurisdiction() ? 'color:#ccc !important' : ''">
                    <view class="value" v-if="checkedListLabel.length != 0">{{ checkedListLabel.join('，') }}</view>
                    <view v-else>请选择</view>
                  </view>
                  <AtIcon v-if="type" value='chevron-down' size='16' ></AtIcon>
                  <AtIcon v-else value='chevron-up' size='16' ></AtIcon>
                </view>
              </view>
            </view>
            <view class="list" v-if="checkedListLabel.indexOf('其他') != -1">
              <AtInput
                name='otherSickReason'
                :disabled="jurisdiction()"
                title='其他'
                type='text'
                placeholder='请输入其他病因'
                :value="dailyRecord.otherSickReason"
                @Change="inputChange($event, 'otherSickReason')"
              />
            </view>
            <view class="list">
              <view class="title" :style="jurisdiction() ? 'color:#ccc !important' : ''">今日治愈</view>
              <view class="taro_picker">
                <view class="picker" @tap="onCureTap">
                  <view class="picker-text" :style="jurisdiction() ? 'color:#ccc !important' : ''">
                    <view class="value" v-if="dailyRecord.todayZyNum">{{ dailyRecord.todayZyNum }}</view>
                    <view v-else>请选择</view>
                  </view>
                  <AtIcon v-if="type1" value='chevron-down' size='16' ></AtIcon>
                  <AtIcon v-else value='chevron-up' size='16' ></AtIcon>
                </view>
              </view>
            </view>
            <view class="list">
              <AtInput
                name='totalZy'
                disabled
                title='累计治愈'
                type='number'
                placeholder='请输入累计治愈'
                :value="dailyRecord.totalZy"
                @Change="inputChange($event, 'totalZy')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='todayStNum'
                :disabled="jurisdiction()"
                title='今日死淘'
                type='number'
                placeholder='请输入今日死淘'
                :value="dailyRecord.todayStNum"
                @Change="inputChange($event, 'todayStNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='totalSt'
                disabled
                title='累计死淘'
                type='number'
                placeholder='请输入累计死淘'
                :value="dailyRecord.totalSt"
                @Change="inputChange($event, 'totalSt')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='totalStPer'
                disabled
                title='总死淘率%'
                type='text'
                placeholder='请输入总死淘率'
                :value="dailyRecord.totalStPer"
                @Change="inputChange($event, 'totalStPer')"
              />
              %
            </view>
            <view class="list">
              <AtInput
                name='totalCslObserve'
                :disabled="jurisdiction()"
                title='总采食量'
                type='digit'
                placeholder='观察棚'
                :value="dailyRecord.totalCslObserve"
                @Change="inputChange($event, 'totalCslObserve')"
              />
              g
              <AtInput
                name='totalCslShed'
                :disabled="jurisdiction()"
                style="width: 40%;"
                title=''
                type='digit'
                placeholder='棚上'
                :value="dailyRecord.totalCslShed"
                @Change="inputChange($event, 'totalCslShed')"
              />
              g
            </view>
            <view class="list">
              <AtInput
                name='averageCslObserve'
                :disabled="jurisdiction()"
                title='平均采食量'
                type='digit'
                placeholder='观察棚'
                :value="dailyRecord.averageCslObserve"
                @Change="inputChange($event, 'averageCslObserve')"
              />
              g
              <AtInput
                name='averageCslShed'
                :disabled="jurisdiction()"
                style="width: 40%;"
                title=''
                type='digit'
                placeholder='棚上'
                :value="dailyRecord.averageCslShed"
                @Change="inputChange($event, 'averageCslShed')"
              />
              g
            </view>
            <view class="list">
              <AtInput
                name='waterObserve'
                :disabled="jurisdiction()"
                title='饮用水'
                type='text'
                placeholder='观察棚'
                :value="dailyRecord.waterObserve"
                @Change="inputChange($event, 'waterObserve')"
              />
            </view>
            <view class="list">
              <AtInput
                name='waterShed'
                :disabled="jurisdiction()"
                title='饮用水'
                type='text'
                placeholder='棚上'
                :value="dailyRecord.waterShed"
                @Change="inputChange($event, 'waterShed')"
              />
            </view>
            <view class="list">
              <view class="title">备注</view>
              <AtTextarea
                :disabled="jurisdiction()"
                style="flex: 1;margin-top: 30rpx"
                :value="dailyRecord.remark"
                @Change="inputChange($event, 'remark')"
                :maxLength="100"
                placeholder='请输入备注'
              />
            </view>
          </view>
          <button :disabled="jurisdiction()" class="but" @tap="Submit">提交</button>
        </View>
      </AtTabsPane>
      <AtTabsPane :current="current" :index="1" >
        <View class="tabs_item">
          <view class="content">
            <view class="list">
              <AtInput
                name='todayRpNum'
                :disabled="jurisdiction()"
                title='今日入棚'
                type='number'
                placeholder='请输入羽数'
                :value="enterShedRecord.todayRpNum"
                @Change="inputChange($event, 'todayRpNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='totalRp'
                disabled
                title='累计入棚'
                type='number'
                placeholder='请输入羽数'
                :value="enterShedRecord.totalRp"
                @Change="inputChange($event, 'totalRp')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='todayKj'
                :disabled="jurisdiction()"
                title='今日开家'
                type='text'
                placeholder='请输入开家'
                :value="enterShedRecord.todayKj"
                @Change="inputChange($event, 'todayKj')"
              />
            </view>
            <view class="list">
              <AtInput
                name='totalKj'
                :disabled="jurisdiction()"
                title='累计开家'
                type='text'
                placeholder='请输入累计开家'
                :value="enterShedRecord.totalKj"
                @Change="inputChange($event, 'totalKj')"
              />
            </view>
            <view class="list">
              <view class="title">备注</view>
              <AtTextarea
                :disabled="jurisdiction()"
                style="flex: 1;margin-top: 30rpx"
                :value="enterShedRecord.remark"
                @Change="inputChange($event, 'remark')"
                :maxLength="100"
                placeholder='请输入备注'
              />
            </view>
          </view>
          <button :disabled="jurisdiction()" class="but" @tap="Submit">提交</button>
        </View>
      </AtTabsPane>
      <AtTabsPane :current="current" :index="2" >
        <View class="tabs_item">
          <view class="content">
            <view class="list">
              <AtInput
                name='scanNum'
                :disabled="jurisdiction()"
                title='扫描羽数'
                type='number'
                placeholder='请输入扫描羽数'
                :value="homeFlyRecord.scanNum"
                @Change="inputChange($event, 'scanNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='flyTime'
                :disabled="jurisdiction()"
                title='家飞时长'
                type='digit'
                placeholder='请输入家飞时长'
                :value="homeFlyRecord.flyTime"
                @Change="inputChange($event, 'flyTime')"
              />
              分
            </view>
            <view class="list">
              <AtInput
                name='storagePer'
                disabled
                title='存棚率%'
                type='text'
                placeholder=''
                :value="homeFlyRecord.storagePer"
                @Change="inputChange($event, 'storagePer')"
              />
              %
            </view>
            <view class="list">
              <view class="title">备注</view>
              <AtTextarea
                :disabled="jurisdiction()"
                style="flex: 1;margin-top: 30rpx"
                :value="homeFlyRecord.remark"
                @Change="inputChange($event, 'remark')"
                :maxLength="100"
                placeholder='请输入备注'
              />
            </view>
          </view>
          <button :disabled="jurisdiction()" class="but" @tap="Submit">提交</button>
        </View>
      </AtTabsPane>
      <AtTabsPane :current="current" :index="3" >
        <View class="tabs_item">
          <view class="content">
            <view class="list">
              <view class="title" :style="jurisdiction() ? 'color:#ccc !important' : ''">训放站次：</view>
              <taroPicker :disabled="jurisdiction()" :index="trainFlyRecord.stops" @onChange="onChangeForm($event,'stops')" :array="trainArray"></taroPicker>
            </view>
            <view class="list">
              <AtInput
                name='distance'
                :disabled="jurisdiction()"
                style="width: calc(100% - 130rpx);"
                title='训放公里'
                type='digit'
                placeholder='请输入训放公里'
                :value="trainFlyRecord.distance"
                @Change="inputChange($event, 'distance')"
              />
              公里
            </view>
            <view class="list">
              <AtInput
                name='scanNum'
                :disabled="jurisdiction()"
                title='扫描羽数'
                type='number'
                placeholder='请输入扫描羽数'
                :value="trainFlyRecord.scanNum"
                @Change="inputChange($event, 'scanNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='flyTime'
                :disabled="jurisdiction()"
                title='家飞时长'
                type='digit'
                placeholder='请输入家飞时长'
                :value="trainFlyRecord.flyTime"
                @Change="inputChange($event, 'flyTime')"
              />
              分
            </view>
            <view class="list">
              <AtInput
                name='storagePer'
                disabled
                title='存棚率%'
                type='text'
                placeholder=''
                :value="trainFlyRecord.storagePer"
                @Change="inputChange($event, 'storagePer')"
              />
              %
            </view>
            <view class="list">
              <view class="title">备注</view>
              <AtTextarea
                :disabled="jurisdiction()"
                style="flex: 1;margin-top: 30rpx"
                :value="trainFlyRecord.remark"
                @Change="inputChange($event, 'remark')"
                :maxLength="100"
                placeholder='请输入备注'
              />
            </view>
          </view>
          <button :disabled="jurisdiction()" class="but" @tap="Submit">提交</button>
        </View>
      </AtTabsPane>
      <AtTabsPane :current="current" :index="4" >
        <View class="tabs_item">
          <view class="content">
            <view class="list">
              <view class="title" :style="jurisdiction() ? 'color:#ccc !important' : ''">比赛关次：</view>
              <taroPicker :disabled="jurisdiction()" :index="gameRecord.levels" @onChange="onChangeForm($event,'levels')" :array="gameArray"></taroPicker>
            </view>
            <view class="list">
              <AtInput
                name='lostNum'
                :disabled="jurisdiction()"
                title='未上笼数'
                type='number'
                placeholder='家飞丢失'
                :value="gameRecord.lostNum"
                @Change="inputChange($event, 'lostNum')"
              />
              羽
              <AtInput
                name='hurtNum'
                :disabled="jurisdiction()"
                style="width: 40%;"
                title=''
                type='number'
                placeholder='撞伤'
                :value="gameRecord.hurtNum"
                @Change="inputChange($event, 'hurtNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='collectNum'
                :disabled="jurisdiction()"
                title='集鸽羽数'
                type='number'
                placeholder='请输入集鸽羽数'
                :value="gameRecord.collectNum"
                @Change="inputChange($event, 'collectNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='backNum'
                :disabled="jurisdiction()"
                title='归巢羽数'
                type='number'
                placeholder='请输入归巢羽数'
                :value="gameRecord.backNum"
                @Change="inputChange($event, 'backNum')"
              />
              羽
            </view>
            <view class="list">
              <AtInput
                name='backPer'
                disabled
                title='归巢率%'
                type='text'
                placeholder='请输入归巢率'
                :value="gameRecord.backPer"
                @Change="inputChange($event, 'backPer')"
              />
              %
            </view>
            <view class="list">
              <AtInput
                name='speed'
                :disabled="jurisdiction()"
                style="width: calc(100% - 130rpx);"
                title='平均分速'
                type='digit'
                placeholder='请输入平均分速'
                :value="gameRecord.speed"
                @Change="inputChange($event, 'speed')"
              />
              米/分
            </view>
            <view class="list">
              <AtInput
                name='storagePer'
                disabled
                title='存棚率%'
                type='text'
                placeholder='请输入存棚率'
                :value="gameRecord.storagePer"
                @Change="inputChange($event, 'storagePer')"
              />
              %
            </view>
            <view class="list">
              <view class="title">备注</view>
              <AtTextarea
                :disabled="jurisdiction()"
                style="flex: 1;margin-top: 30rpx"
                :value="gameRecord.remark"
                @Change="inputChange($event, 'remark')"
                :maxLength="100"
                placeholder='请输入备注'
              />
            </view>
          </view>
          <button :disabled="jurisdiction()" class="but" @tap="Submit">提交</button>
        </View>
      </AtTabsPane>
    </AtTabs>
    <AtFloatLayout v-if="etiologyType" isOpened title="病因" @Close="handleClose">
      <AtCheckbox
        :options="checkboxOption"
        :selectedList="checkedList"
        @Change="handleChange"
      />
    </AtFloatLayout>
    <AtFloatLayout v-if="cureType" isOpened title="今日治愈" @Close="handleCloseZy">
      <view class="atLayout">
        <view class="list" v-for="(item,key) in layoutList" :key="key">
          <taroPicker @onChange="onIllnessChange($event,key)" :index="item.value" :array="illnessArray"></taroPicker>
          <AtInput
            v-if="item['value'] == '8'"
            name='desc'
            style="width: 35%"
            title=''
            type='text'
            placeholder='请输入病因'
            :value="item['desc']"
            @Change="illnessChange($event, key, 'desc')"
          />
          <AtInput
            name='num'
            style="width: 25%"
            title=''
            type='number'
            placeholder='羽'
            :value="item['num']"
            @Change="illnessChange($event, key, 'num')"
          />
          <AtIcon v-if="layoutList.length == key + 1" value='add-circle' size='20' color='#AAB2C0' @tap="addCircle(key)"></AtIcon>
          <AtIcon v-else value='subtract-circle' size='20' color='#AAB2C0' @tap="subtractCircle(key)"></AtIcon>
        </view>
      </view>
    </AtFloatLayout>
  </view>
</template>

<script setup>
import Taro from "@tarojs/taro"
import { ref } from 'vue'
import './index.less'
import taroPicker from "../../components/taro_picker.vue"
import taroEmpty from "../../components/taro_empty.vue"
import { getAction,postAction } from '../../api/index'
import { getFetch,getSeasonList,postFeedingCreate,postFeedingModify, getFeedingInit, getFeedingDetails } from '../../api/api'

const totalRp = ref(0)
const totalBg = ref(0)
const totalZy = ref(0)
const totalSt = ref(0)
const totalStPer = ref(0)

const $instance = Taro.getCurrentInstance()

const formattedDate = ((value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const weatherData = ref({})

const getFetchAxios = (value) => {
  getAction(getFetch, {date: value}).then((res) => {
    console.log(res,'天气请求')
    if (res.data) {
      weatherData.value = res.data
    } else {
      weatherData.value = {}
    }
  })
}



const dateArray = ref([])
const DateTime = ref('0')
const recordDate = ref(formattedDate(new Date()))

const getLastSevenDays = () => {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  dateArray.value = dates;
};

getLastSevenDays()

const onChangeDate = (key) => {
  DateTime.value = key
  console.log(dateArray.value[key],'天气')
  getFetchAxios(formattedDate(dateArray.value[key]))
  recordDate.value = formattedDate(dateArray.value[key])
}


// 赛季
const seasonArray = ref([])
const SeasonIds = ref([])

const SeasonNum = ref('0')
const season = ref('')
const SeasonId = ref('')

const onChangeSeasonId = (key) => {
  SeasonNum.value = key
  SeasonId.value = SeasonIds.value[key].id
  season.value = SeasonIds.value[key].season
  if (details.id) {
    getFeedingDetailsAxios()
  } else {
    getFeedingInitAxios()
  }
}

const trainArray = ref([])

for (let i = 1; i < 16; i++) {
  trainArray.value.push('第' + i + '站');
}

const gameArray = ref(['收费站','资格赛','第一关','第二关','第三关','加站一','加站二'])


const array = ref(
  ['2025', '2024', '2023', '2022']
)
const tabList = [{ title: '日常记录' }, { title: '入棚记录' }, { title: '家飞记录' }, { title: '训放记录' }, { title: '比赛记录' }]

const current = ref(0)

const handleClick = (value) => {
  console.log(value)
  current.value = value
}


const dailyRecord = ref({})
const enterShedRecord = ref({})
const homeFlyRecord = ref({})
const trainFlyRecord = ref({})
const gameRecord = ref({})
const form = ref({})

const inputChange = (value,text) => {
  console.log(value,text,current.value)
  if (current.value == 0) {
    if (text == 'todaySickShedNum') {
      dailyRecord.value.totalBg = Number(totalBg.value) + (dailyRecord.value.todaySickObserveNum ? Number(dailyRecord.value.todaySickObserveNum) : 0)
      dailyRecord.value.totalBg += value ? Number(value) : 0
    }
    if (text == 'todaySickObserveNum') {
      dailyRecord.value.totalBg = Number(totalBg.value) + (dailyRecord.value.todaySickShedNum ? Number(dailyRecord.value.todaySickShedNum) : 0)
      dailyRecord.value.totalBg += value ? Number(value) : 0
    }
    if (text == 'todayStNum') {
      dailyRecord.value.totalSt = Number(totalSt.value)
      dailyRecord.value.totalSt += value ? Number(value) : 0
      dailyRecord.value.totalSt = (dailyRecord.value.totalSt).toString()
      if (Number(enterShedRecord.value.totalRp)) {
        dailyRecord.value.totalStPer = (Number(dailyRecord.value.totalSt) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
    }
    dailyRecord.value[text] = value
  } else if (current.value == 1) {
    if (text == 'todayRpNum') {
      enterShedRecord.value.totalRp = Number(totalRp.value)
      enterShedRecord.value.totalRp += value ? Number(value) : 0
      enterShedRecord.value.totalRp = (enterShedRecord.value.totalRp).toString()
      if (!enterShedRecord.value.totalRp) return
      if (Number(dailyRecord.value.totalSt)) {
        dailyRecord.value.totalStPer = (Number(dailyRecord.value.totalSt) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
      if(Number(homeFlyRecord.value.scanNum)) {
        homeFlyRecord.value.storagePer = (Number(homeFlyRecord.value.scanNum) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
      if (Number(trainFlyRecord.value.scanNum)) {
        trainFlyRecord.value.storagePer = (Number(trainFlyRecord.value.scanNum) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
      if (Number(gameRecord.value.backNum)) {
        gameRecord.value.storagePer = (Number(gameRecord.value.backNum) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
    }
    enterShedRecord.value[text] = value
  } else if (current.value == 2) {
    homeFlyRecord.value[text] = value
    if (text == 'scanNum') {
      if (Number(enterShedRecord.value.totalRp)) {
        homeFlyRecord.value.storagePer = (Number(homeFlyRecord.value.scanNum) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
    }
  } else if (current.value == 3) {
    trainFlyRecord.value[text] = value
    if (text == 'scanNum') {
      if (Number(enterShedRecord.value.totalRp)) {
        trainFlyRecord.value.storagePer = (Number(trainFlyRecord.value.scanNum) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
    }
  } else {
    gameRecord.value[text] = value
    if (text == 'backNum') {
      if (Number(enterShedRecord.value.totalRp)) {
        gameRecord.value.storagePer = (Number(gameRecord.value.backNum) / Number(enterShedRecord.value.totalRp) * 100).toFixed(1)
      }
    }
    if (text == 'backNum' || text == 'collectNum') {
      if (Number(gameRecord.value.collectNum) && Number(gameRecord.value.backNum)) {
        gameRecord.value.backPer = (Number(gameRecord.value.backNum) / Number(gameRecord.value.collectNum) * 100).toFixed(1)
      }
    }
  }
}

let details = $instance.router.params.obj ? JSON.parse($instance.router.params.obj) : {}

console.log(details,'详情')

const USER_INFO = Taro.getStorageSync('USER_INFO')
const Edit_Permission = ref(false)

const jurisdiction = () => {
  // console.log(details.shedId && USER_INFO.shedId !== details.shedId,'是否有权限')
  if (details.shedId && USER_INFO.shedId !== details.shedId) {
    return true
  } else {
    return false
  }
}
console.log(jurisdiction(),'是否有权限')
// 提交保存
const postFeedingCreateAxios = () => {
  postAction(postFeedingCreate, {
    seasonId: SeasonId.value,
    season: season.value,
    recordDate: recordDate.value,
    weather: weatherData.value,
    dailyRecord: dailyRecord.value,
    enterShedRecord: enterShedRecord.value,
    homeFlyRecord: homeFlyRecord.value,
    trainFlyRecord: trainFlyRecord.value,
    gameRecord: gameRecord.value,
  }).then((res) => {
    console.log(res,'提交')
    if (res.data) {
      details = res.data
      Taro.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      Taro.showToast({
        title: res.message,
        icon:'none',
        duration: 2000
      })
    }
  })
}

// 编辑保存
const postFeedingModifyAxios = () => {
  postAction(postFeedingModify, {
    id: details.id,
    ver: details.ver,
    dailyRecord: dailyRecord.value,
    enterShedRecord: enterShedRecord.value,
    homeFlyRecord: homeFlyRecord.value,
    trainFlyRecord: trainFlyRecord.value,
    gameRecord: gameRecord.value,
  }).then((res) => {
    console.log(res,'提交')
    if (res.data) {
      details.ver = res.data
      Taro.showToast({
        title: '保存成功',
        icon:'success',
        duration: 2000
      })
    } else {
      Taro.showToast({
        title: res.message,
        icon:'none',
        duration: 2000
      })
    }
  })
}

const Submit = (e) => {
  if (!season.value) {
    Taro.showToast({
      title: '请选择赛季',
      icon:'none',
      duration: 2000
    })
    return
  }
  console.log(e)
  console.log(form.value)
  console.log(dailyRecord.value)
  if (details.id) {
    Taro.showModal({
      title: '提示',
      content: '是否要覆盖原数据',
      success: (res) => {
        if (res.confirm) {
          postFeedingModifyAxios()
        }
      }
    })
  } else {
    postFeedingCreateAxios()
  }
}

const onChangeForm = (e,text) => {
  if (text == 'stops') {
    trainFlyRecord.value.stops = e
  } else {
    gameRecord.value.levels = e
  }
}

const etiologyType = ref(false)
const type = ref(true)
const cureType = ref(false)
const type1 = ref(true)

const onTap = (e) => {
  if (jurisdiction()) return
  etiologyType.value = true
  type.value = false
}

const handleClose = (e) => {
  etiologyType.value = false
  type.value = true
  dailyRecord.value['sickReasonAnalysis'] = checkedList.value
}

const checkedList = ref([])
const checkedListLabel = ref([])
const checkboxOption = ref([{
    value: '0',
    label: '疫苗反应'
  },{
    value: '1',
    label: '呼吸道'
  },{
    value: '2',
    label: '肠道'
  },{
    value: '3',
    label: '毛滴虫'
  },{
    value: '4',
    label: '血条'
  },{
    value: '5',
    label: '撞伤'
  },{
    value: '6',
    label: '单眼伤风'
  },{
    value: '7',
    label: '腺病毒'
  },{
    value: '8',
    label: '其他'
  }
])

const getLabelByValue = (value) => {
  const option = checkboxOption.value.find(option => option.value === value.toString());
  return option ? option.label : null;
};

const getCheckedListLabel = (array) => {
  checkedListLabel.value = []
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    let name = getLabelByValue(element)
    if (name) {
      checkedListLabel.value.push(name)
    }
  }
  
}

const handleChange = (array) => {
  checkedList.value = array
  getCheckedListLabel(array)

}

getCheckedListLabel(checkedList.value)

const illnessArray = ref([
  '疫苗反应', '呼吸道', '肠道', '毛滴虫', '血条', '撞伤', '单眼伤风', '腺病毒', '其他'
])
const layoutList = ref([{}])

const onCureTap = (e) => {
  if (jurisdiction()) return
  cureType.value = true
  type1.value = false
}

const onIllnessChange = (e,key) => {
  console.log(e,key)
  layoutList.value[key]['value'] = e
}

const illnessChange = (value,key,text) => {
  layoutList.value[key][text] = value
}

const addCircle = () => {
  layoutList.value.push({})
}
const subtractCircle = (key) => {
  layoutList.value.splice(key,1)
}

const handleCloseZy = (e) => {
  cureType.value = false
  type1.value = true
  console.log(layoutList.value,'查看')
  let cure = 0
  for (let index = 0; index < layoutList.value.length; index++) {
    const element = layoutList.value[index];
    cure += Number(element.num)
  }
  dailyRecord.value.todayZyNum = cure
  dailyRecord.value['todayHealRecords'] = layoutList.value
  dailyRecord.value.totalZy = Number(totalZy.value)
  dailyRecord.value.totalZy += cure ? Number(cure) : 0
  dailyRecord.value.totalZy = dailyRecord.value.totalZy.toString()
}

// 获取详情
const getFeedingDetailsAxios = () => {
  getAction(getFeedingDetails, {
    id: details.id
  }).then((res) => {
    console.log(res,'详情')
    if (res.data) {
      details.ver = res.data.ver
      details.id = res.data.id
      SeasonId.value = res.data.seasonId
      season.value = res.data.season
      console.log(season.value,'SeasonNum.value')
      recordDate.value = res.data.recordDate
      weatherData.value = res.data.weather
      // dailyRecord.value = res.data.dailyRecord
      totalRp.value = res.data.enterShedRecord.totalRp!== null? res.data.enterShedRecord.totalRp : 0
      totalBg.value = res.data.dailyRecord.totalBg!== null? res.data.dailyRecord.totalBg : 0
      totalZy.value = res.data.dailyRecord.totalZy!== null? res.data.dailyRecord.totalZy : 0
      totalSt.value = res.data.dailyRecord.totalSt!== null? res.data.dailyRecord.totalSt : 0
      totalStPer.value = res.data.dailyRecord.totalStPer!== null? res.data.dailyRecord.totalStPer : 0
      for (const key in res.data.dailyRecord) {
        if (key == 'sickReasonAnalysis' || key == 'todayHealRecords') {
          dailyRecord.value[key] = res.data.dailyRecord[key] || []
        } else if ( key === 'totalBg' ) {
          let totalBg = res.data.dailyRecord.totalBg? Number(res.data.dailyRecord.totalBg) : 0
          let todaySickObserveNum = res.data.dailyRecord.todaySickObserveNum? Number(res.data.dailyRecord.todaySickObserveNum) : 0
          let todaySickShedNum = res.data.dailyRecord.todaySickShedNum? Number(res.data.dailyRecord.todaySickShedNum) : 0
          dailyRecord.value['totalBg'] = (totalBg + todaySickObserveNum + todaySickShedNum).toString()
        } else if ( key == 'totalZy' ) {
          let totalZy = res.data.dailyRecord.totalZy? Number(res.data.dailyRecord.totalZy) : 0
          let todayZyNum = res.data.dailyRecord.todayZyNum? Number(res.data.dailyRecord.todayZyNum) : 0
          dailyRecord.value['totalZy'] = (totalZy + todayZyNum).toString()
        } else if (key == 'totalSt') {
          let totalSt = res.data.dailyRecord.totalSt? Number(res.data.dailyRecord.totalSt) : 0
          let todayStNum = res.data.dailyRecord.todayStNum? Number(res.data.dailyRecord.todayStNum) : 0
          dailyRecord.value['totalSt'] = (totalSt + todayStNum).toString()
        } else {
          dailyRecord.value[key] = res.data.dailyRecord[key] === null ? '' : String(res.data.dailyRecord[key])
        }
      }
      // enterShedRecord.value = res.data.enterShedRecord
      for (const key in res.data.enterShedRecord) {
        if (key=='totalRp') {
          let totalRp = res.data.enterShedRecord.totalRp ? Number(res.data.enterShedRecord.totalRp) : 0
          let todayRpNum = res.data.enterShedRecord.todayRpNum ? Number(res.data.enterShedRecord.todayRpNum) : 0
          enterShedRecord.value['totalRp'] = (totalRp + todayRpNum).toString()
        } else {
          enterShedRecord.value[key] = res.data.enterShedRecord[key] === null ? '' : String(res.data.enterShedRecord[key])
        }
      }
      // homeFlyRecord.value = res.data.homeFlyRecord
      for (const key in res.data.homeFlyRecord) {
        homeFlyRecord.value[key] = res.data.homeFlyRecord[key] === null ? '' : String(res.data.homeFlyRecord[key])
      }
      // trainFlyRecord.value = res.data.trainFlyRecord
      for (const key in res.data.trainFlyRecord) {
        trainFlyRecord.value[key] = res.data.trainFlyRecord[key] === null ? '' : String(res.data.trainFlyRecord[key])
      }
      // gameRecord.value = res.data.gameRecord
      for (const key in res.data.gameRecord) {
        gameRecord.value[key] = res.data.gameRecord[key] === null ? '' : String(res.data.gameRecord[key])
      }
      checkedList.value = res.data.dailyRecord.sickReasonAnalysis || []
      getCheckedListLabel(checkedList.value)
      layoutList.value = res.data.dailyRecord.todayHealRecords || [{}]
    }
  })
}

// 初始化
const getFeedingInitAxios = () => {
  getAction(getFeedingInit, {
    seasonId: SeasonId.value
  }).then((res) => {
    console.log(res,'初始化')
    // dailyRecord.value = {}
    // enterShedRecord.value = {}
    // homeFlyRecord.value = {}
    // trainFlyRecord.value = {}
    // gameRecord.value = {}
    if (res.data) {
      Edit_Permission.value = false
      totalRp.value = res.data.totalRp!== null? res.data.totalRp : 0
      totalBg.value = res.data.totalBg!== null? res.data.totalBg : 0
      totalZy.value = res.data.totalZy!== null? res.data.totalZy : 0
      totalSt.value = res.data.totalSt!== null? res.data.totalSt : 0
      totalStPer.value = res.data.totalStPer!== null? res.data.totalStPer : 0
      enterShedRecord.value['totalRp'] = res.data.totalRp !== null ? res.data.totalRp.toString() : '0'
      dailyRecord.value['totalBg'] = res.data.totalBg !== null ? res.data.totalBg.toString() : '0'
      dailyRecord.value['totalZy'] = res.data.totalZy !== null ? res.data.totalZy.toString() : '0'
      dailyRecord.value['totalSt'] = res.data.totalSt !== null ? res.data.totalSt.toString() : '0'
      dailyRecord.value['totalStPer'] = res.data.totalStPer !== null ? res.data.totalStPer.toString() : '0'
    } else {
      Edit_Permission.value = true
      totalRp.value = 0
      totalBg.value = 0
      totalZy.value = 0
      totalSt.value = 0
      totalStPer.value = 0
      enterShedRecord.value['totalRp'] = '0'
      dailyRecord.value['totalBg'] = '0'
      dailyRecord.value['totalZy'] = '0'
      dailyRecord.value['totalSt'] = '0'
      dailyRecord.value['totalStPer'] = '0'
    }

    let totalBg1 = 0 + totalBg.value
    let totalSt1 = 0 + totalSt.value
    let totalZy1 = 0 + totalZy.value
    let totalRp1 = 0 + totalRp.value
    let totalStPer1 = 0 + totalStPer.value
    if (dailyRecord.value.todaySickObserveNum) {
      totalBg1 += Number(dailyRecord.value.todaySickObserveNum)
      dailyRecord.value['totalBg'] = totalBg1.toString()
    }
    if (dailyRecord.value.todaySickShedNum) {
      totalBg1 += Number(dailyRecord.value.todaySickShedNum)
      dailyRecord.value['totalBg'] = totalBg1.toString()
    }
    if (dailyRecord.value.todayStNum) {
      totalSt1 += Number(dailyRecord.value.todayStNum)
      dailyRecord.value['totalSt'] = totalSt1.toString()
    }
    if (dailyRecord.value.todayZyNum) {
      totalZy1 += Number(dailyRecord.value.todayZyNum)
      dailyRecord.value['totalZy'] = totalZy1.toString()
    }
    
    if (enterShedRecord.value.todayRpNum) {
      totalRp1 += Number(enterShedRecord.value.todayRpNum)
      enterShedRecord.value['totalRp'] = totalRp1.toString()
    }
    if (totalRp.value > 0) {
      totalStPer1 = (totalSt1 / totalRp1 * 100).toFixed(1)
      dailyRecord.value['totalStPer'] = totalStPer1.toString()
    }

  })
}

const getSeasonListAxios = () => {
  getAction(getSeasonList).then((res) => {
    console.log(res,'赛季请求')
    seasonArray.value = res.data.map((item) => {
      return item.season
    })
    SeasonIds.value = res.data
    SeasonId.value = res.data[0].id
    season.value = res.data[0].season
    getFeedingInitAxios()
  })
}


if (details.id) {
  getFeedingDetailsAxios()
} else {
  getFetchAxios(formattedDate(new Date()))
  getSeasonListAxios()
}


</script>