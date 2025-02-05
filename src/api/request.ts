import Taro from '@tarojs/taro'
// import { encryptData } from './encrypt' // 请求数据加密，可选

// console.log('NODE_ENV', process.env.NODE_ENV)
// console.log('TARO_APP_PROXY', process.env.TARO_APP_PROXY)
const baseUrl = 'https://xxx.xingxiaoxin.com/api'
let loadingNum = 0

interface RequestParams {
  url: string
  method: 'OPTIONS'|'GET'|'HEAD'|'POST'|'PUT'|'PATCH'|'DELETE'|'TRACE'|'CONNECT'
  data: any
  header?: any
  timeout?: number
  loadingTitle?: string
  [key: string]: any
}



export function request (params: RequestParams) {
  const { url, method, data, header = {}, args: { timeout = 6000, loadingTitle = '', toastDuration = 1500 } } = params
  if (loadingNum === 0) {
    Taro.showLoading({
      title: loadingTitle,
      mask: true
    })
  }
  loadingNum++
  // const a = Taro.getStorageSync('cookie')
  header['cookie'] = Taro.getStorageSync('cookie')
  
  return new Promise(resolve =>{
    Taro.request({
      data: data, method,
      url: baseUrl + url,
    //   method: method,
      timeout: timeout,
      header: {
        'content-type': 'application/json;charset=UTF-8,text/plain,*/*',
        ...header
      },
      success: (res) => { // 接口调用成功的回调函数
        console.log(loadingNum,'loadingNum看看==================================================================')
        loadingNum--
        if (loadingNum <= 0) {
          Taro.hideLoading()
        }
        console.log('success', res)
        if (res.data.code === 'A0200' || res.data.code === 'A0231') {
          showError(res.data.msg, toastDuration)
          Taro.clearStorageSync()
          // 未登录
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/index/index'})
            Taro.hideLoading()
          }, 500)
          return
        }
        
        if (res.data.code === '00000') { // 具体参考接口响应的数据结构定义
          if (res.header['Set-Cookie'] && res.header['Set-Cookie'].indexOf('satoken') > -1) {
            Taro.setStorage({
              key:"cookie",
              data: res.header['Set-Cookie'],
            })
          }
          if (Array.isArray(res.data)) {
            resolve(res.data)
          } else {
            resolve({...res.data, success: true })
          }
        } else {
          console.log('message', res.data.msg)
          Taro.hideLoading()
          resolve({ message: res.data.msg, success: false })
          showError(res.data.msg, toastDuration)
        }
      },
      fail: (res) => {
        loadingNum = 0
        Taro.hideLoading()
        console.log('fail', res)
        resolve({ msg: res, success: false })
        showError('请求失败', toastDuration)
      },
      complete: (res: any) => { // 接口调用结束的回调函数（调用成功、失败都会执行）
        console.log('complete', res)
      }
    }).catch(e => {
      loadingNum = 0
      Taro.hideLoading()
      console.log('catch err', e)
      resolve({ msg: e.errMsg, success: false })
      showError(e.errMsg, toastDuration)
    })
  })
}
function showError (msg: string, duration = 1500) {
  Taro.showToast({
    title: msg,
    icon: 'none', // 'error' 'success' 'loading' 'none'
    duration: duration
  })
}
