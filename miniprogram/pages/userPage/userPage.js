//my.js
var app = getApp()
var StudentId = './addressAdmin/addressAdmin.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {
      nickName: '',
      avatarUrl: '', 
    },
    userName: '',
    userAvatar: '',
    soldList: [],
    unsoldList: [],
    showitem: '', //post：正发布，sold：已卖出
    sellerId: '',
    soldnum: 0,
    favonum: 0,
    unsoldnum: 0,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const sellerId = options.sellerId;
    this.setData({
      sellerId: sellerId
    });
    console.log('当前卖家：', sellerId);
    wx.cloud.callFunction({
      name: 'getUserById',
      data: {
        userId: this.data.sellerId
      },
      success(res){
        console.log('结果', res)
        console.log('当前用户名', res.result.data);
        that.setData({
          userName: res.result.data.name,
          userAvatar: res.result.data.picId
        });
      }
    });
    wx.cloud.callFunction({
      name: 'getReleaseByUserId',
      data:{
        userId: this.data.sellerId,
      },
      success(res) {
        console.log('成功获得未卖出', res.result.data.unsold.list);
        console.log('成功获得已卖出', res.result.data.sold.list);
        that.setData({
          unsoldList: res.result.data.unsold.list,
          soldList: res.result.data.sold.list,
        });
      },
    });
    wx.cloud.callFunction({
      name: 'userAnalyze',
      data:{
        userId: this.data.sellerId,
      },
      success(res) {
        console.log('个人主页', res.result.data);
        if (res.result.data){
          that.setData({
            unsoldnum: res.result.data.unsold,
            soldnum: res.result.data.sold,
            favonum: res.result.data.nums
          });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var studentId = that.data.name;
    console.log(studentId)
    var nickName = 'userInfo.nickName';
    var avatarUrl = 'userInfo.avatarUrl';
    //get缓存值用户名字，并设置
    try {
      var value = wx.getStorageSync('nickName')
      console.log(value);
      if (value) {
        that.setData({
          [nickName]: value
        })
      }
    } catch (e) {
      // Do something when catch error
    }

   //get缓存值用户头像，并设置
   wx.getStorage({
     key: 'avatarUrl',
     success: function(res) {  
       that.setData({
        [avatarUrl]: res.data
       })
     },
   })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  onPullDownRefresh(){
    wx.setNavigationBarTitle({
      title: '我的信息'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
  },

  // 显示发布内容
  showPost(e) {
    this.setData({
      showitem: 'post'
    });
  },

  // 显示卖出内容
  showSold(e){
    this.setData({
      showitem: 'sold'
    });
    
  },

  // 隐藏内容
  showFavo(e){
    this.setData({
      showitem: ''
    });
  },

  // 去聊天室
  gotoChat(e){
    console.log("即将聊天的卖家:", this.data.sellerId)
    wx.navigateTo({
      url: '/pages/message/chatrm/index?sellerId=' + this.data.sellerId,
    })
  },

  // 上新推荐改变事件
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
