Page({
  data: {
    birthYear: '',
    progressPercent: 0,
    progressPercentText: '0.00',
    currentAge: 0,
    lifeExpectancy: 78.6,
    yearArray: [],
    yearIndex: 0
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

    const birthYear = wx.getStorageSync('birthYear')
    if (birthYear) {
      this.setData({ birthYear })
      this.calculateProgress(birthYear)
    }
  },

  bindYearChange(e) {
    const selectedYear = this.data.yearArray[e.detail.value]
    this.setData({ birthYear: selectedYear })
    wx.setStorageSync('birthYear', selectedYear)
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
  },

  async generateShareImage() {
    try {
      const canvas = await new Promise((resolve) => {
        const query = wx.createSelectorQuery()
        query.select('#shareCanvas')
          .fields({ node: true, size: true })
          .exec((res) => resolve(res[0].node))
      })
      
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = 500 * dpr
      canvas.height = 400 * dpr
      ctx.scale(dpr, dpr)

      // 绘制背景
      ctx.fillStyle = '#f7f7f7'
      ctx.fillRect(0, 0, 500, 400)

      // 绘制标题
      ctx.fillStyle = '#333333'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('人生进度条', 250, 80)

      // 如果有进度数据，绘制进度信息
      if (this.data.birthYear) {
        if (this.data.currentAge <= 78) {
          // 绘制进度条背景
          ctx.fillStyle = '#e5e5e5'
          this.drawRoundedRect(ctx, 50, 150, 400, 30, 15)
          ctx.fill()

          // 绘制进度条
          ctx.fillStyle = '#07c160'
          const progressWidth = 400 * (this.data.progressPercent / 100)
          this.drawRoundedRect(ctx, 50, 150, progressWidth, 30, 15)
          ctx.fill()

          // 绘制进度文字
          ctx.fillStyle = '#666666'
          ctx.font = '16px sans-serif'
          ctx.fillText(
            `我已度过 ${this.data.currentAge} 年，占人均预期寿命的 ${this.data.progressPercentText}%`,
            250,
            220
          )
        } else {
          // 超过78岁的文字提示
          ctx.fillStyle = '#666666'
          ctx.font = '18px sans-serif'
          ctx.fillText('我已经超出了人均预期寿命', 250, 180)
        }
      }

      // 绘制底部文字
      ctx.fillStyle = '#07c160'
      ctx.font = '16px sans-serif'
      ctx.fillText('人生只有一次，勇敢的生活吧！', 250, 300)

      // 生成图片
      return await new Promise((resolve) => {
        wx.canvasToTempFilePath({
          canvas,
          success: (res) => resolve(res.tempFilePath),
          fail: (error) => {
            console.error('生成分享图片失败', error)
            resolve(null)
          }
        })
      })
    } catch (error) {
      console.error('生成分享图片失败', error)
      return null
    }
  },

  // 添加绘制圆角矩形的辅助方法
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.arcTo(x + width, y, x + width, y + radius, radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
    ctx.lineTo(x + radius, y + height)
    ctx.arcTo(x, y + height, x, y + height - radius, radius)
    ctx.lineTo(x, y + radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.closePath()
  },

  async onShareAppMessage() {
    const shareImage = await this.generateShareImage()
    let shareText = ''
    
    if (this.data.birthYear) {
      if (this.data.currentAge <= 78) {
        shareText = `我已度过${this.data.currentAge}年，占人均预期寿命的${this.data.progressPercentText}%`
      } else {
        shareText = '我已经超出了人均预期寿命'
      }
    } else {
      shareText = '快来看看你的人生进度吧'
    }
    
    return {
      title: shareText,
      path: '/pages/my-progress/my-progress',
      imageUrl: shareImage || '/assets/share-img.png'
    }
  },

  async onShareTimeline() {
    const shareImage = await this.generateShareImage()
    let shareText = ''
    
    if (this.data.birthYear) {
      if (this.data.currentAge <= 78) {
        shareText = `我已度过${this.data.currentAge}年，占人均预期寿命的${this.data.progressPercentText}%`
      } else {
        shareText = '我已经超出了人均预期寿命'
      }
    } else {
      shareText = '快来看看你的人生进度吧'
    }
    
    return {
      title: shareText,
      query: '',
      imageUrl: shareImage || '/assets/share-img.png'
    }
  }
}) 