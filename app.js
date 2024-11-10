// app.js
App({
  onLaunch() {
    // 延迟初始化
    setTimeout(() => {
      this.initApp()
    }, 100)
  },

  initApp() {
    // 初始化操作
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
      }
    })
  },

  globalData: {
    systemInfo: null
  }
})
