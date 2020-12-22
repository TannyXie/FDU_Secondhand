//my.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {
      nickName: '',
      picId: '', 
    },
    authorized:false,
    loaded:0,
    isHide:false,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
    wx.cloud.callFunction({
      name: 'getUserById',
      data:{
      },
      success: function(res) {
        console.log(res)
          if (res.result.statusMsg=='can not get userid') {
            console.log('用户没有授权')
            that.setData({
              isHide: true
          });
          } 
      }
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
    var that=this;
    wx.cloud.callFunction({
      name: 'getUserById',
      data:{
      },
      success(res) {
        if(res.result.data){
        console.log('成功获取用户信息', res.result.data);
        var nickName = 'userInfo.nickName';
        var picId='userInfo.picId';
        that.setData({
          [nickName]: res.result.data.name,
          [picId]: res.result.data.picId,
          loaded:1,
          authorized:res.result.data.authorized,
        });
        }
        //console.log(that.data.userInfo)
      },
      fail: console.error,
    })
  }
  ,

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

  },

 bindGetUserInfo: function(e) {
  if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      //调用addUser,只有新用户能成功入user库
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo,
        })
      } 
      if (that.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          console.log(res)
          var tmp=res.userInfo
          console.log(tmp)
          var nickName = 'userInfo.nickName';
          var picId='userInfo.picId';
          that.setData({
            [nickName]: tmp.nickName,
            [picId]: tmp.avatarUrl,
          });
        }
    
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfos
            that.setData({
              userInfo: res.userInfo,
            })
            console.log('在没有 open-type=getUserInfo 版本的兼容处理')
          }
        })
      }
      wx.cloud.callFunction({
        name: 'addUser',
        data:{
          name:that.data.userInfo.nickName,
          picId:that.data.userInfo.picId,
          gender:0,
        },
        success(res) {
          console.log('成功添加用户', res);
          that.onShow();
        },
        fail: console.error,
      })
      that.setData({
          isHide: false
      });
  } else {
      //用户按了拒绝按钮
      wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
              // 用户没有授权成功，不需要改变 isHide 的值
              if (res.confirm) {
                  console.log('用户点击了“返回授权”');
              }
          }
      });
  }
},
cartTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'myCart/myCart'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
addressTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({
      url:'addressAdmin/addressAdmin'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能修改',
    icon:'none',
    duration: 3000,
  })
}
},
postTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'myPost/myPost'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
sellTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'mySell/mySell'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
buyTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'myBuy/myBuy'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
modifyTap(e){
  var that=this;
  wx.navigateTo({
      url:'modifyUser/modifyUser'
  })
},
mailTap(e){
  var that=this;
  if(that.data.authorized==false)
  {
    wx.navigateTo({

      url:'mailCheck/mailCheck'
  })
}
else
{
  wx.showToast({
    title: '已认证',
    icon:'success',
    duration: 3000,
  })
}
},
uploadPic(e)
{
  var that=this;
  var nickName = that.data.userInfo.nickName;
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      wx.showLoading({
        title: '上传中',
      })
      wx.getFileSystemManager().readFile({
        filePath: res.tempFilePaths[0],
        success: (res) => {
          console.log(res)
          wx.cloud.callFunction({
            name: 'updateUserInfo',
            data: {
              file: res.data,
              name: nickName
            },
            success: function(res) {
              //console.log(res.result)
              if (res.result.statusCode==200)
              {
                console.log(res)
                wx.showToast({
                  icon: 'none',
                  title: '上传成功',
                })
                that.onShow();//刷新头像
                console.log('刷新成功')
              }
              else
              {
                console.error('[上传文件] 失败')
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
              }
            },
            fail: console.error,
            complete: () => {
              wx.hideLoading()
            }
          })
        }
      })
    },
    fail: console.error
  })
}
}
)
