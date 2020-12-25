// miniprogram/pages/my/myBuy/myBuy.js
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
          name: 'getOrdersByBuyerId',
          data: {
          },
          success(res) {
            console.log('成功拿到订单', res);
            that.setData({
              totalNum: res.result.data.length,
            });
            let goods = [];
            const names = res.result.data;
            console.log(names)
            if (names.length == 0) {
              that.setData({
                loaded: 1
              })
            } else {
              for (let j = 0; j < names.length; j++) {
                const i = j;
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
                      item['orderId'] = names[i]._id
                      item['finishTime'] = names[i].finishTime
                      wx.cloud.callFunction({
                        name: 'getUserById',
                        data: {
                          userId: item.sellerId
                        },
                        success(res) {
                          if (res.result.statusCode != 200) {
                            console.log('拿不到卖家信息', res)
                            item['sellerName'] = '未知'
                          }
                          else {
                            console.log('成功拿到卖家信息', res.result.data)
                            item['sellerName'] = res.result.data.name
                          }
                          goods.push(item);
                          goods.sort(function (a, b) {
                            return b.time - a.time
                          })
                          that.setData({
                            goodsList: goods,
                            loaded: 1
                          })
                          console.log('展示数据', goods)
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

  buyerCheckout(e) {
    let that = this
    const orderId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name: 'checkOrderAsBuyer',
      data: {
        orderId: orderId
      },
      success(res) {
        console.log('成功签收', res)
        wx.showToast({
          title: '签收成功',
          duration: 2000,
          icon: 'none',
        })
        let newList = that.data.goodsList
        newList[index].buyerCheck = true
        that.setData({
          goodsList: newList
        })

      }
    })
  },

  gotoFenlei(e) {
    var text = e.currentTarget.dataset.text;
    let str = JSON.stringify(text)
    wx.navigateTo({
      url: '/pages/category/category?str=' + str,
    })
  },
  toUser(e) {
    var userId = e.currentTarget.dataset.sellerid;
    wx.navigateTo({
      url: '/pages/userPage/userPage?sellerId=' + userId
    })
  }
})