Page({
  data:{
    nickName:null,
    picId:null,
    file:null,
    loaded:0,
    buttonLoading: false,
  },
  onLoad(){
    var that = this;
    wx.cloud.callFunction({
      name: 'getUserById',
      data:{
      },
      success(res) {
        console.log('成功获取用户信息', res.result.data);
        that.setData({
          nickName: res.result.data.name,
          picId: res.result.data.picId,
          loaded:1,
        });
      },
      fail: console.error,
    })
  },
  NameInput(e)
  {
    this.setData
    ({
      nickName:e.detail.value
    })
  },
  profileInput(e)
  {
    this.setData
    ({
      picId:e.detail.picId
    })
  },
  uploadPic(e)
  {
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        let fPathOrg = res.tempFilePaths[0]
        let fPathPressed = fPathOrg
        wx.compressImage({
          src: fPathOrg, // 图片路径
          quality: 20, // 压缩质量
          success: (res) => {
            fPathPressed = res.tempFilePath
            console.log('压缩成功'+fPathPressed)
            wx.getFileSystemManager().readFile({
              filePath: fPathPressed,
              success: (res) => {
                console.log(res)
                that.setData({
                  file:res.data,
                })
                wx.showToast({
                  icon: 'none',
                  title: '上传成功',
                })
              }
            })
          },
          fail: console.error
        })
      },
      fail: console.error
    })
  },

  formSubmit(e){
    var that =this;
    var nickName=that.data.nickName;
    var file=that.data.file;
    that.setData({
      buttonLoading: true
    })
    console.log("用户点击保存")
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        file: file,
        name: nickName
      },
      success: function(res) {
        //console.log(res.result)
        if (res.result.statusCode==200)
        {
          console.log(res)
          console.log("保存成功")
          console.log("重新载入用户信息")
          that.onLoad();//刷新头像
          that.setData({
            buttonLoading: false,
          })
          wx.showToast({
            icon: 'none',
            title: '保存成功',
            duration:5000,
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