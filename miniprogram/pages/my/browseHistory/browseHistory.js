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
        userId: 'fakeuserid1',
      },
      success(res) {
        console.log('成功', res.result.data);
        if(res.result.data.length)
        {
          res.result.data.sort(function(a, b){return a.time - b.time});
        }
        var m =new Array();
        for(var i=0;i<res.result.data.length;i++)
        {
          m[i]=res.result.data[i].data;
        }
        console.log(m)
      
        that.setData({
          goodsList: m,
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
deleteHistory(e) {
  //调用云函数，在后端把所有记录删掉
  wx.cloud.callFunction({
    name: 'delHistory',
    data:{
      userId: 'fakeuserid1',
    },
    success(res) {
      console.log('成功清空历史');
      wx.showToast({
        title: '清空成功',
        duration: 2000,
      })
    },
  })
  this.setData({
    hasList:false,
  });
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