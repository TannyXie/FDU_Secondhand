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
    hotData:[],
    currentSortType: 'default',
    currentSortOrder: 'desc',
    salesSortOrder:'desc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'getNumsTop6',
      data:{
      },
      success(res) {
        console.log('成功', res.result.data.list);
        that.setData({
          hotData: res.result.data.list,
        });
      },
    })
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
  clearHistory: function () {
    wx.clearStorageSync('getSearch')
    this.setData({
      getSearch: []
    })

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
    var sortorder = 'desc';
    if(this.data.currentSortType == 'price'){
      sortorder = this.data.currentSortOrder;
    }
    else if(this.data.currentSortType == 'nums'){
      sortorder = this.data.salesSortOrder;
    }
    wx.cloud.callFunction({
      name: 'search',
      data:{
        intro: this.data.keyword,
        sortType: this.data.currentSortType,
        sortOrder: sortorder
      },
      success(res) {
        console.log('search成功', res.result.data.list);
        that.setData({
          showitem: true,
          goodsList: res.result.data.list,
        });
      },
    })
  
    // utils.myRequest({
    //   url: url,
    //   data: this.data.keyword,
    //   methods: 'GET',
    //   success: function(res){
    //     that.setData({
    //       showitem: true,
    //       goodsList: res.data.goods
    //     })
    //   },
    //   fail: function() {
    //     that.setData({
    //       showitem: false
    //     })
    //   }
    // });
  
  },

  bindConfirm:function(e){
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
  },

  historySearch(e){
    this.setData({
      keyword: e.currentTarget.dataset.search,
      goodsList: []
    });
    this.getGoodsList();  
  },

  // 上新推荐改变事件
  gotoDetails(e) {
    var url = e.currentTarget.dataset.coverimg;
    var title = e.currentTarget.dataset.title;
    //wx.navigateTo({
    //  url: '/pages/details/details?url=' + url + '&title=' + title,
    //})
    wx.navigateTo({
      url: '/pages/details/index?key=' + goodId
    })
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
        case 'salesSort':
            let _SortOrder = 'asc';
            if (this.data.salesSortOrder == 'asc') {
                _SortOrder = 'desc';
            }
            this.setData({
                'currentSortType': 'nums',
                'currentSortOrder': 'asc',
                'salesSortOrder': _SortOrder
            });
            this.getGoodsList();
            break;
        case 'priceSort':
            let tmpSortOrder = 'asc';
            if (this.data.currentSortOrder == 'asc') {
                tmpSortOrder = 'desc';
            }
            this.setData({
                'currentSortType': 'price',
                'currentSortOrder': tmpSortOrder,
                'salesSortOrder': 'asc'
            });
            this.getGoodsList();
            break;
        default:
            //综合排序
            this.setData({
                'currentSortType': 'default',
                'currentSortOrder': 'desc',
                'salesSortOrder': 'desc'
            });
            this.getGoodsList();
    }
}
})