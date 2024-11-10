Page({
  data: {
    birthYear: '',
    progressPercent: 0,
    progressPercentText: '0.00',
    currentAge: 0,
    lifeExpectancy: 78.6,
    yearArray: [],
    yearIndex: 0,
    taName: ''
  },

  onLoad() {
    // 生成年份数组
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i)
    }
    
    this.setData({ 
      yearArray: years,
      isReady: true 
    })

    // 读取存储的数据
    const birthYear = wx.getStorageSync('otherBirthYear')
    const taName = wx.getStorageSync('taName')
    
    if (birthYear || taName) {
      this.setData({ 
        birthYear,
        taName
      })
      if (birthYear) {
        this.calculateProgress(birthYear)
      }
    }
  },

  handleNameInput(e) {
    const taName = e.detail.value
    this.setData({ taName })
    wx.setStorageSync('taName', taName)
  },

  bindYearChange(e) {
    const selectedYear = this.data.yearArray[e.detail.value]
    this.setData({ birthYear: selectedYear })
    wx.setStorageSync('otherBirthYear', selectedYear)
    this.calculateProgress(selectedYear)
  },

  calculateProgress(birthYear) {
    try {
      const currentYear = new Date().getFullYear()
      const age = currentYear - birthYear
      const percent = (age / this.data.lifeExpectancy) * 100
      const finalPercent = percent > 100 ? 100 : percent

      this.setData({
        currentAge: age,
        progressPercent: parseFloat(finalPercent.toFixed(2)),
        progressPercentText: finalPercent.toFixed(2)
      })
    } catch (error) {
      wx.showToast({
        title: '计算进度失败',
        icon: 'none'
      })
    }
  }
}) 