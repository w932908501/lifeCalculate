Page({
  data: {
    years: [],
    value: [0],
    currentYear: new Date().getFullYear()
  },

  onLoad() {
    const years = []
    for (let i = this.data.currentYear; i >= 1900; i--) {
      years.push(String(i))
    }
    this.setData({ years })
  },

  bindChange(e) {
    this.setData({
      value: e.detail.value
    })
  },

  confirmSelect() {
    const selectedYear = this.data.years[this.data.value[0]]
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('selectYear', selectedYear)
    wx.navigateBack()
  },

  cancelSelect() {
    wx.navigateBack()
  }
}) 