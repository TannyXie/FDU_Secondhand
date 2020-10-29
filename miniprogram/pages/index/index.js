//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    navList: [{
        icon: '/images/nav-icon/书.png',
        text: '二手书籍'
      },
      {
        icon: '/images/nav-icon/数码家电.png',
        text: '数码家电'
      },
      {
        icon: '/images/nav-icon/生活用品.png',
        text: '生活用品'
      },
      {
        icon: '/images/nav-icon/护肤美妆.png',
        text: '护肤美妆'
      },
      {
        icon: '/images/nav-icon/更多.png',
        text: '更多'
      },
    ],
    goodsList: [],
    swiperCurrent: 0,
  },

  /**
   * 生命周期函数 —— 监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'latest8',
      data:{
      },
      success(res) {
        console.log('成功', res.result.data);
        that.setData({
          goodsList: res.result.data,
        });
      },
    })
  },
  // 宫格导航改变事件
  gotoFenlei(e) {
    var text=e.currentTarget.dataset.text;
    let str = JSON.stringify(text)
    console.log('goto: '+ str);
    wx.navigateTo({
      url: '/pages/category/category?str=' + str,
    })
  },
  // 上新推荐改变事件
  gotoDetails(e) {
    var url = e.currentTarget.dataset.coverimg;
    var title = e.currentTarget.dataset.title;
    //wx.navigateTo({
    //  url: '/pages/details/details?url=' + url + '&title=' + title,
    //})
    wx.navigateTo({
      url: '/pages/details/index'
    })
  }
})
