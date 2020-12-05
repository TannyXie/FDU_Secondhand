//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name:"",
    description:"",
    tag:"",
    price:"",
    question:"",
    answer:"",
    picId:"",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  nameInput: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  descInput: function(e){
    this.setData({
      description: e.detail.value
    })
  },
  tagInput: function(e){
    this.setData({
      tag: e.detail.value
    })
  },
  priceInput: function(e){
    this.setData({
      price: e.detail.value
    })
  },

   // 上传图片
   doUpload: function () {
     var that = this;
    // 选择图片
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
              name: 'uploadPicture',
              data: {
                file: res.data,
                name: "imagePost",
              },
              success: function(res) {
                console.log(res.result)
                if (res.result.statusCode==200)
                {
                  console.log('[上传文件] 成功：', res)
                  that.setData({ picId: res.result.data.picId })
                  wx.showToast({
                    icon: 'none',
                    title: '上传成功'+ that.data.picId,
                  })
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
  },
   // 发布商品
   doPost: function () {
     var that=this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addGood',
      // 传给云函数的参数
      data: {
        coverMiddle: that.data.picId,
        desc: that.data.description,
        intro: that.data.name,
        price: Number(that.data.price),
        tag: that.data.tag,
      },
      success: function(res) {
        if (res.result.statusCode==200)
        {
          console.log('[发布商品] 成功：', res)
          wx.showToast({
            icon: 'none',
            title: '['+that.data.name+']'+'发布成功',
          })
        }
        else
        {
          console.error('[发布商品] 失败', res)
          wx.showToast({
            icon: 'none',
            title: '['+that.data.name+']'+'发布失败',
          })
        }
      },
      fail: console.error,
    })
   
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
