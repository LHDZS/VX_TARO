export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/records/index',
    'pages/statistics/index',
    'pages/feeding/index',
    'pages/login/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#999",
    backgroundColor: "#fafafa",
    selectedColor: "#333",
    borderStyle: "white",
    list: [{
      "text": "首页",
      "pagePath": "pages/index/index",
      "iconPath": "static/images/tab_home_normal@2x.png",
      "selectedIconPath": "static/images/tab_home_selected@2x.png"
    },{
      "text": "记录",
      "pagePath": "pages/records/index",
      "iconPath": "static/images/tab_workbench_normal@2x.png",
      "selectedIconPath": "static/images/tab_workbench_selected@2x.png"
    }],
    position: "bottom"
  },
  networkTimeout: {
    "request": 10000,
    "downloadFile": 10000
  },
})
