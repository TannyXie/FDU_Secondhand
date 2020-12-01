//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    goodId: '',
    comment: '',
    goodsList: [],
    commentsList: [],
    cmLen: 0,
    seller: '卖家',
    swiperCurrent: 0,
  },

  /**
   * 生命周期函数 —— 监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const key = options.key;
    wx.cloud.callFunction({
      name: 'getGoodById',
      data: {
        goodId: key
      },
      success(res) {
        console.log('成功加载商品', res.result.data);
        let newList = res.result.data
        wx.cloud.callFunction({
          name: 'getUrlsByPicIds',
          data: {
            picIdList: [newList.coverMiddle]
          },
          success(newres) {
            console.log('成功加载图片', newres)
            newList.coverMiddle = newres.result.data.urlList[0]
            wx.cloud.callFunction({
              name: 'getUserById',
              data: {
                userId: newList.sellerId
              },
              success(newres2) {
                console.log('成功加载用户名', newres2)
                newList.sellerId = newres2.result.data.name
                that.setData({
                  goodId: key,
                  goodsList: [newList],
                  seller: newres2.result.data.name,
                });
              }
            })
          }
        })
      },
    }),
      wx.cloud.callFunction({
        name: 'getCommentsByGoodId',
        data: {
          goodId: key,
        },
        success(res) {
          console.log('成功获取留言', res)
          const comments = res.result.data
          const l = comments.length
          for (let i = 0; i < l; i++) {
            const t = comments[i].time
            const date = new Date(t + 8 * 3600 * 1000)
            const new_t = date.toJSON().substr(0, 19)
              .replace('T', ' ').replace(/-/g, '.')
            comments[i].time = new_t
          }
          that.setData({
            commentsList: comments,
            cmLen: l
          })
        }
      })
    wx.cloud.callFunction({
      name: 'addHistory',
      data: {
        goodId: key,
        userId: 'fakeuserid1',
      },
      success(res) {
        console.log('成功加入历史记录', res);
      },
    })
  },

  // 收藏
  setFavor(e) {
    var that = this;
    const id = that.data.goodId;
    wx.cloud.callFunction({
      name: 'setFavorite',
      data: {
        goodId: id,
        userId: 'fakeuserid1'
      },
      success(res) {
        console.log('成功收藏', res);
        wx.showToast({
          title: '收藏成功',
          duration: 2000,
        })
      },
    })
  },

  // 加购
  addCart(e) {
    var that = this;
    const id = that.data.goodId;
    wx.cloud.callFunction({
      name: 'addCart',
      data: {
        goodId: id,
        userId: 'fakeuserid1'
      },
      success(res) {
        console.log('成功加购', res);
        wx.showToast({
          title: '加购成功',
          duration: 2000,
        })
      },
    })
  },

  // 结算
  addOrder(e) {
    var that = this;
    const id = that.data.goodId;
    wx.cloud.callFunction({
      name: 'addOrder',
      data: {
        goodId: id,
        userId: "fakeuserid1"
      },
      success(res) {
        console.log('成功结算', res);
        wx.showToast({
          title: '结算成功',
          duration: 2000,
        })
      },
    })
  },

  descInput: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },

  // 发布留言
  doPost: function () {
    var that = this;
    const id = that.data.goodId
    const c = that.data.comment
    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        userId: 'fakeuserid1',
        goodId: id,
        content: c
      },
      success: function (res) {
        console.log('成功发布留言：', res)
        wx.showToast({
          title: '发布成功',
          duration: 2000,
          success: function() {
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/details/index?key=' + id
              })
            }, 1000)
          }
        });
      },
    })
  },

  // 跳转个人页
  jumpTo: function() {
    const that = this
    const sellerId = that.data.goodsList[0].sellerId
    wx.navigateTo({
      url: '/pages/userPage/userPage?sellerId=' + sellerId
    })
  }
})