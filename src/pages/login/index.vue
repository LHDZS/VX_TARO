<template>
  <view class="login">
    <view class="header">
      <image class="logo" src="https://img.xgyun.com/production/CEC54D6F-B3CA-4A54-B9FD-7E1202DD27DA/d11706834e8a3e26.png"></image>
      <view class="h2">邢小信教练</view>
    </view>
    <button class="but" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号一键登录</button>
  </view>
</template>

<script setup>
import Taro from "@tarojs/taro"
import { onMounted, ref } from 'vue'
import './index.less'
import taroPicker from "../../components/taro_picker.vue"
import taroEmpty from "../../components/taro_empty.vue"
import { getAction,postAction } from '../../api/index'
import { getLogin } from '../../api/api'

const getPhoneNumber = (e) => {
  console.log(e) // 回调信息（成功失败都会返回）
  console.log(e.detail.code)  // 动态令牌
  console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
  console.log(e.detail.errno)  // 错误码（失败时返回）
  if (!e.detail.code) return
  postAction(getLogin, {code: e.detail.code}).then((res) => {
    console.log(res,'登录成功')
    Taro.setStorage({
      key:"USER_INFO",
      data: res.data,
    })
    if (res.success) {
      Taro.switchTab({ url: '/pages/index/index'})
    }
  })
}

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
    return
  })

  // if (Taro.getStorageSync('USER_INFO')) {
  //   Taro.switchTab({ url: '/pages/index/index'})
  // }
  
})

// wx.updateWeChatApp({
//   success: function(res) {
//     // 更新成功的处理逻辑
//   },
//   fail: function(err) {
//     // 更新失败的处理逻辑
//   },
//   complete: function() {
//     // 更新结束的处理逻辑（无论成功或失败都会执行）
//   }
// });

</script>