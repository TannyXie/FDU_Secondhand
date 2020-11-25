// miniprogram/pages/my/browseHistory/browseHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [
  ],
    hasList:false,
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
    var that = this
    wx.cloud.callFunction({
      name: 'getHistoryByUserId',
      data:{
      },
      success(res) {
        console.log('成功', res);
        that.setData({
          goodsList: res.result.data.reverse(),
        });
        if(res.result.data)
        {
          if(res.result.data.length){
          that.setData({
            hasList: true,
          });
        }
        }
      },
    })
  },
  gotoDetails(e) {
    const index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    console.log(index)
    var goodId = goodsList[index]._id
    console.log(goodId)
    wx.navigateTo({
      url: '/pages/details/index?key=' + goodId
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

  }
})