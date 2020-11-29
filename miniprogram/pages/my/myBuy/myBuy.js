// miniprogram/pages/my/myBuy/myBuy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalNum: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'getOrdersByBuyerId',
      data:{
        userId: 'fakeuserid1'
      },
      success(res) {
        console.log(res);
        console.log('成功');
        that.setData({
          totalNum: res.result.data.length,
        });
        let goods = [];
        const names = res.result.data;
        for (let i = 0; i < names.length; i++) {
          const id = names[i].goodId;
          wx.cloud.callFunction({
            name: 'getGoodById',
            data: {
              goodId: id
            },
            success(newres) {
              goods.push(newres.result.data);
              if (goods.length == names.length) {
                that.setData({
                  goodsList: goods
                })
                console.log(goods)
              }
            }
          })
        }
      },
    })
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

  gotoDetails(e) {
    //var url = e.currentTarget.dataset.coverimg;
    //var title = e.currentTarget.dataset.title;
    var goodId = e.currentTarget.dataset.id;
    console.log(goodId)
    //wx.navigateTo({
    //  url: '/pages/details/details?url=' + url + '&title=' + title,
    //})
    wx.navigateTo({
      url: '/pages/details/index?key=' + goodId
    })
  }
})