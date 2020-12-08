// miniprogram/pages/my/mySell/mySell.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalNum: 0,
    loaded: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'getOrdersBySellerId',
      data:{
        userId: 'fakeuserid1'
      },
      success(res) {
        console.log('成功拿到订单', res);
        that.setData({
          totalNum: res.result.data.length,
        });
        let goods = [];
        const names = res.result.data;
        if (names.length == 0) {
          that.setData({
            loaded: 1,
          })
        } else {
          for (let i = 0; i < names.length; i++) {
            const id = names[i].goodId;
            wx.cloud.callFunction({
              name: 'getGoodById',
              data: {
                goodId: id
              },
              success(newres) {
                const item = newres.result.data
                item['buyerCheck'] = names[i].buyerCheck
                item['sellerCheck'] = names[i].sellerCheck
                item['time'] = names[i].createTime
                item['orderId'] = names[i]._id
                goods.push(item);
                if (goods.length == names.length) {
                  goods.sort(function(a, b) {
                    return a.time - b.time
                  })
                  that.setData({
                    goodsList: goods,
                    loaded: 1,
                  })
                  console.log('展示的数据', goods)
                }
              }
            })
          }
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
  },

  sellerCheckout(e) {
    const orderId = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'checkOrderAsSeller',
      data: {
        sellerId: 'fakeuserid1',
        orderId: orderId
      },
      success(res) {
        console.log('成功收款', res)
        wx.showToast({
          title: '收款成功',
          duration: 2000,
          success: function() {
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/my/mySell/mySell'
              })
            }, 1000)
          }
        })

      }
    })
  }
})