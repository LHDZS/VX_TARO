
import { createApp } from 'vue'
import Taro from "@tarojs/taro"
import './app.less'
import * as echarts from "echarts4taro3/lib/assets/echarts"; // 这里用了内置的，也可以用自定义的 echarts.js
import { EChart ,loadEcharts } from "echarts4taro3";
// page.js
import { createUI  } from 'taro-ui-vue3';
import 'taro-ui-vue3/dist/style/index.scss';

const App = createApp({
  onShow (options) {
    console.log('App onShow.')
  },
  created() {
    // 初始化
    loadEcharts(echarts);
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

const tuv3 = createUI();
App.use(tuv3)

export default App
