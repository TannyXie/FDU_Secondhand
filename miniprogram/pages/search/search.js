// pages/search/search.js
const app = getApp()
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    getSearch:[],
    keyword:'',
    goodsList: [],
    showitem: false,
    hotData:[
      {intro:"数分",icon:"icon-jiantouUp",color:"text-orange"},
      {intro:"airpods",icon:"icon-jiantouUp",color:"text-red"},
      {intro:"卸妆水",icon:"icon-jiantouDown",color:"text-green"},
      {intro:"编译课本",icon:"icon-jiantouUp",color:"text-red"},
      {intro:"薯片",icon:"icon-jiantouDown",color:"text-green"},
      {intro:"毛概",icon:"icon-jiantouUp",color:"text-red"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow:function(){
    var getSearch = wx.getStorageSync('searchData');
    this.setData({
      getSearch:getSearch,
      inputValue:''
    })
    console.log('search is onshow')
  },

  onHide:function(){
    console.log('search is onHide')
    wx.redirectTo({
        url: '../search/search'
    })
  },

  goBack: function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindInput:function(e){
    this.setData({
      inputValue:e.detail.value
    })
    console.log('bindInput'+this.data.inputValue)
  },

  bindChange:function(e){
    console.log('bindChange')
  },

  getGoodsList: function () {
    let that = this;
    let url = 'https://mobile.ximalaya.com/mobile/discovery/v3/recommend/hotAndGuess?code=43_310000_3100&device=android&version=5.4.45';
    utils.myRequest({
      url: url,
      data: this.data.keyword,
      methods: 'GET',
      success: function(res){
        that.setData({
          showitem: true,
          goodsList: res.data.goods
        })
      },
      fail: function() {
        that.setData({
          showitem: false
        })
      }
    });
  },

  bindConfirm:function(e){
    let data;
    let localStorageValue = [];
    if(this.data.inputValue != ''){
      //调用API从本地缓存中获取数据
      var searchData = wx.getStorageSync('searchData') || []
      searchData.push(this.data.inputValue)
      wx.setStorageSync('searchData', searchData)
      
      this.setData({
        keyword: this.data.inputValue,
        goodsList: []
      });
      this.getGoodsList();

    }else{
      console.log('未输入任何字符')
    }
  }
})