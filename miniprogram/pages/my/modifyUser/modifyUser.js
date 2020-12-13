Page({
  data:{
    nickName:'',
    picId:'',
    file:'',
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
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          success: (res) => {
            console.log(res)
            that.setData({
              file:res.data,
            })
            wx.showToast({
              icon: 'none',
              title: '上传成功',
            })
            that.onLoad();//刷新头像
            console.log('刷新成功')
          }
        })
      },
      fail: console.error
    })
  },
  formSubmit(e){
    var that =this;
    var nickName=that.data.nickName;
    var file=that.data.file;
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
            wx.showToast({
              icon: 'none',
              title: '保存成功',
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
    
    
    wx.showToast({
      icon: 'none',
      title: '保存成功',
      duration:5000
    })      
    wx.navigateBack();
  }
})