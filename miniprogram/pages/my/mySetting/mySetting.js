// miniprogram/pages/my/mySetting/mySetting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonLoading: false,
    button2Loading: false,
    studentId: '',
    passWord:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var studentId = that.data.studentId;
    var passWord = that.data.passWord;
    wx.getStorage({  //异步获取缓存值studentId
      key: 'studentId',
      success: function (res) {
        that.setData({
          studentId: res.data
        })

      }
    })
    wx.getStorage({  //异步获取缓存值studentId
      key: 'passWord',
      success: function (res) {
        that.setData({
          passWord: res.data
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ipnutStudentId: function (e) {
    var num = e.detail.value;
    var reg = /^([A-Za-z0-9_\-\.])+\@fudan.edu.cn$/;
    if (reg.test(num)) {
      this.setData({
        studentId: num
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '邮箱有误',
      })
    }

  },
  inputPassWord: function (e) {
    var num = e.detail.value;
    this.setData({
      passWord: num
    })
      this.setData({
        passWord: num
      })

    
  },
  bindSubmit: function () {
    var that = this;
    this.setData({
      buttonLoading: true
    })
    var that = this;
    var studentId = that.data.studentId;
    //调用云函数，去获取后端返回的状态


  },
  verifySubmit: function () {
    var that = this;
    this.setData({
      button2Loading: true
    })
    var that = this;
    var passWord = that.data.passWord;
    //检查验证码是否正确（超时处理*）


  },
})