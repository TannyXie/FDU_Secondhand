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
    goodsList: [],
    showitem: 'none', //none: 刚开始和收藏，post：正发布，sold：已卖出
    sellerId: ''
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
      }
    });
    wx.cloud.callFunction({
      name: 'getDateLatest8',
      data:{
      },
      success(res) {
        console.log(res)
        console.log('latest8成功', res.result.data.list);
        that.setData({
          goodsList: res.result.data.list,
        });
      },
    });
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
  bindGetUserInfo: function(e) {
    var that = this;
    var nickName = that.data.userInfo.nickName;
    var avatarUrl = that.data.userInfo.avatarUrl;
    
    if (e.detail.userInfo) {
       //用户按了允许授权按钮
       var userInfo = e.detail.userInfo;
      that.setData({
        nickName: userInfo.nickName
      })
      that.setData({
        avatarUrl : userInfo.avatarUrl
      })
      try {//同步设置nickName
        wx.setStorageSync('nickName', userInfo.nickName)
      } catch (e) {
      }
      
      wx.setStorage({
        key: 'avatarUrl',
        data: userInfo.avatarUrl,
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '请授权登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
              delta: 1
            })
          } else {
            console.log('用户点击取消')
            wx.navigateBack({
              delta: 1
            })
          }
          
        }
      })
    }
  },
  bindClear: function (e) {
    var that = this;
    var nickName = 'userInfo.nickName';
    var avatarUrl = 'userInfo.avatarUrl';
   
    try {//同步设置nickName
      wx.setStorageSync('nickName', '')
    } catch (e) {
    }
    wx.setStorage({
      key: 'avatarUrl',
      data: '',
    })
    that.setData({
      [nickName]: '个人信息',
      [avatarUrl]: ''
    })
    wx.showModal({
      title: '提示',
      content: '退出账号成功',
      success: function(){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
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
