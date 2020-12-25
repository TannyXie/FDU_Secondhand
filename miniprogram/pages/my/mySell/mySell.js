// miniprogram/pages/my/mySell/mySell.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalNum: 0,
    loaded: 0,
    isauth: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'getUserById',
      data: {

      },
      success(res) {
        if (res.result.statusMsg == 'can not get userid') {
          console.log('用户没有授权')
          that.setData({
            isauth: false
          });
          return;
        }
        wx.cloud.callFunction({
          name: 'getOrdersBySellerId',
          data: {
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
              for (let j = 0; j < names.length; j++) {
                const i = j
                const id = names[i].goodId;
                wx.cloud.callFunction({
                  name: 'getGoodById',
                  data: {
                    goodId: id
                  },
                  success(newres) {
                    if (newres.result.statusCode != 200) {
                      console.log("商品拿不到", newres)
                    }
                    else {
                      const item = newres.result.data
                      item['buyerCheck'] = names[i].buyerCheck
                      item['sellerCheck'] = names[i].sellerCheck
                      item['time'] = names[i].createTime
                      item['finishTime'] = names[i].finishTime
                      item['orderId'] = names[i]._id
                      item['buyerId'] = names[i].userId
                      wx.cloud.callFunction({
                        name: 'getUserById',
                        data: {
                          userId: names[i].userId
                        },
                        success(res) {
                          if (res.result.statusCode != 200) {
                            console.log('拿不到买家信息', res)
                            item['buyerName'] = '未知'
                          }
                          else {
                            console.log('成功拿到买家信息', res.result.data)
                            item['buyerName'] = res.result.data.name
                          }
                          goods.push(item);
                          goods.sort(function (a, b) {
                            return b.time - a.time
                          })
                          that.setData({
                            goodsList: goods,
                            loaded: 1,
                          })
                          console.log('展示的数据', goods)

                        }
                      })
                    }
                  }
                })
              }
            }
          },
        })
      }
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
    const index = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name: 'checkOrderAsSeller',
      data: {
        orderId: orderId
      },
      success(res) {
        console.log('成功收款', res)
        wx.showToast({
          title: '收款成功',
          duration: 2000,
          icon: 'none',
        })
        let newList = that.data.goodsList
        newList[index].sellerCheck = true
        that.setData({
          goodsList: newList
        })
      }
    })
  },

  gotoFenlei(e) {
    var text = e.currentTarget.dataset.text;
    let str = JSON.stringify(text)
    console.log('goto: ' + str);
    wx.navigateTo({
      url: '/pages/category/category?str=' + str,
    })
  },
  toUser(e) {
    var userId = e.currentTarget.dataset.buyerid;
    wx.navigateTo({
      url: '/pages/userPage/userPage?sellerId=' + userId
    })
  }
})