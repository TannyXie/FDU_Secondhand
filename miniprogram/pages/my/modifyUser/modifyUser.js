Page({
  data:{
    nickName:'',
    avatarUrl:'',
    profileId:'',
  },
  onLoad(){
    var that = this;
    wx.cloud.callFunction({
      name: 'getUserById',
      data:{
        userId:"fakeuserid1",
      },
      success(res) {
        console.log('成功获取用户信息', res.result.data);
        that.setData({
          nickName: res.result.data.name,
          avatarUrl: res.result.data.avatarUrl,
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
      avatarUrl:e.detail.avatarUrl
    })
  },
  uploadPic(e)
  {
    var that=this;
    const value = e;
    console.log(value)
    var nickName=that.data.nickName;
    console.log(nickName)
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
              name: 'modifyByUserId',
              data: {
                file: res.data,
                name: nickName,
                userId:"fakeuserid1",
              },
              success: function(res) {
                console.log(res.result)
                if (res.result.statusCode==200)
                {
                  console.log('[上传文件] 成功：', res.result.data.profileId)
                  wx.showToast({
                    icon: 'none',
                    title: '上传成功'+ res.result.data.profileId,
                  })
                  that.onLoad();
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
  formSubmit(e){
    wx.showToast({
      icon: 'none',
      title: '保存成功',
      duration:5000
    })      
    wx.navigateBack();
  }
})