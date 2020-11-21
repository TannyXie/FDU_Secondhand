//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    goodId: '',
    goodsList: [],
    //commentList: [],
    seller: '',
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
        console.log('成功', res.result.data);
        that.setData({
          goodId: key,
          goodsList: [res.result.data],
          //commentList: res.result.data.commentList,
          seller: '卖家',
        });
      },
    })
  },
  /*
  onLoad: function (options) {
    var that = this;
    var url = 'https://mobile.ximalaya.com/mobile/discovery/v3/recommend/hotAndGuess?code=43_310000_3100&device=android&version=5.4.45';

    // 调用自己封装的工具函数，在utils中
    utils.myRequest({
      url: url,
      methods: 'GET',
      success: function (result) {
        that.setData({
          showitem: true,
          guess: result.data.paidArea.list,
          xiaoshuocontent: result.data.hotRecommends.list[0].list,
          xiangshengcontent: result.data.hotRecommends.list[2].list,
          lishicontent: result.data.hotRecommends.list[3].list
        })
      },
      fail: function () {
        that.setData({
          showitem: false
        })
      }
    });
  },*/


  // 宫格导航改变事件
  goToBangDan: function () {
    wx.navigateTo({
      url: '/pages/classification/classification',
    })
  },

  // 收藏
  setFavor(e) {
    var that = this;
    const id = that.data.goodId;
    console.log(id);
    wx.cloud.callFunction({
      name: 'setFavorite',
      data: {
        goodId: id
      },
      success(res) {
        console.log('成功', res);
        wx.showToast({
          title: '收藏成功',
          duration: 2000,
        })
      },
    })
  },
})