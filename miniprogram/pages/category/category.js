// pages/category/category.js
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{
      icon: '/images/nav-icon/书.png',
      events: 'goToFenlei',
      text: '二手书籍'
    },
    {
      icon: '/images/nav-icon/数码家电.png',
      events: 'goToFenlei',
      text: '数码家电'
    },
    {
      icon: '/images/nav-icon/生活用品.png',
      events: 'goToFenlei',
      text: '生活用品'
    },
    {
      icon: '/images/nav-icon/护肤美妆.png',
      events: 'goToFenlei',
      text: '护肤美妆'
    },
    {
      icon: '/images/nav-icon/更多.png',
      events: 'goToFenlei',
      text: '学习用品'
    },
    {
      icon: '/images/nav-icon/更多.png',
      events: 'goToFenlei',
      text: '服装鞋子'
    },
    {
      icon: '/images/nav-icon/更多.png',
      events: 'goToFenlei',
      text: '食品药品'
    },
    {
      icon: '/images/nav-icon/更多.png',
      events: 'goToFenlei',
      text: '其他'
    },
    ],
    loading: 1,
    goodsList: [],
    currentCategory: {},
    name: '',
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    let str = JSON.parse(options.str);
    console.log('name: ' + str);
    that.setData({
      name: str
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    this.getGoodsList();
  },

  getGoodsList: function () {
    var that = this;
    if (this.data.name){
      wx.cloud.callFunction({
        name: 'searchByTag',
        data:{
          tag: this.data.name,
        },
        success(res) {
          console.log('成功', res.result.data.list);
          that.setData({
            loading: 0,
            goodsList: res.result.data.list,
          });
        },
      })
    }
    else{
      console.log('全部');
    }
  },

  switchCate: function(e) {
    let text = e.currentTarget.dataset.text;
    console.log(text);
    let name = this.data.name;
    if (text == name) {
        return false;
    } else {
        this.setData({
            list: [],
            allPage: 1,
            allCount: 0,
            size: 8,
            loading: 0
        })
        if (text) {
          wx.setStorageSync('categoryId', text)
        } else {
          text = '';
          this.setData({
              currentCategory: {} 
          })
        }
        wx.setStorageSync('categoryId', text)
        this.setData({
            name: text,
            loading: 1,
        })
        this.getGoodsList();
    }
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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

  }
})