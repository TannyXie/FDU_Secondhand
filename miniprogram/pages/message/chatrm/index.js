// pages/message/chatrm/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    i:0,
    inputMessage : '',
    histMess : [
    ],
    Mess : [],
    timer : '',
    messages: '',
    sellerId: '',
    setInter: '',
    touchStart: 0,
    touchEnd: 0,
    ifshow: false,
    delId: '',
    key: '',
    thisnickName: '',
    thatnickName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      sellerId: options.sellerId
    })
    console.log('成功获取卖家Id',options.sellerId);
    wx.cloud.callFunction({
      name: 'getUserById',
      data:{},
      success(res){
        console.log('成功获取当前用户昵称',res)
        that.setData({
          thisnickName: res.result.data.name,
        })
      },
      fail: console.error
    })
    wx.cloud.callFunction({
      name: 'getUserById',
      data: {
        userId : that.data.sellerId
      },
      success(res){
        console.log('成功获取对话方的昵称',res)
        that.setData({
          thatnickName: res.result.data.name
        })
      },
      fail: console.error
    })
    that.data.setInter = setInterval(
      function() {
        var result = '';
        wx.cloud.callFunction({
          name: 'getMessages',
          data: {
            anotherUserId: that.data.sellerId
          },
          success(res) {
            if(res.result.statusMsg=='wrong code')
            {
              wx.showModal({
                title: '消息提示',
                content: '添加消息失败',
              })
            }
            else{
              console.log('成功更新信息',res);
              var messages = res.result.data
              var i = 0
              for(;i<messages.length;++i){
                if(messages[i].senderId === that.data.sellerId)
                  messages[i].senderId = that.data.thatnickName
                else
                  messages[i].senderId = that.data.thisnickName
              }
              that.setData({
                messages: messages
              })
            }
          },
        })
      },500
    )
  }, 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  renewMess(e){
    var result = '';
    var that = this;
    wx.cloud.callFunction({
      name: 'getMessages',
      data: {
//        thisUserId: 'fakeuser1',
        anotherUserId: that.data.sellerId
      },
      success(res) {
        if(res.result.statusMsg=='wrong code')
        {
          wx.showModal({
            title: '消息提示',
            content: '添加消息失败',
          })
        }
        else{
          console.log('成功更新信息',res);
          that.setData({
            messages: res.result.data,
//            ifshow: false,
          })
        }
      },
    });
    this.notShow();
  },

  notShow: function(){
    this.setData({
      ifshow: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.setInter);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.setInter);
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

  },

  onClick: function(){

  },

  formSubmit(e){
  },

  textChange(e){
    this.setData({
      inputMessage : e.detail.value,
    });
  },

  touchStart: function(e){
    var that = this;
    this.setData({
      touchStart : e.timeStamp
    })
  },

  touchEnd: function(e){
    var that = this;
    this.setData({
      touchEnd : e.timeStamp
    })
  },

  longtapDelete:function(e){
    var that = this;
    that.setData({
      ifshow: true,
      delId: e.currentTarget.dataset.index
    })
  },

  inputRenew(e){
    /* 
      清空聊天框，更新数据库添加发送的信息
    */
   var that = this;
    var history = this.data.histMess;
    history.push({
      message: this.data.inputMessage,
      response: 'this is a response'
    });
    var i = this.data.i;
    console.log('the inputMessage is '+that.data.inputMessage);
    wx.cloud.callFunction({
      name: 'addMessage',
      data: {
//        senderId: 'fakeuserid1',
        receiverId: that.data.sellerId,
//        receiverId: 'fakeuserid3',
        content: that.data.inputMessage
      },
      success(res) {
        console.log('成功添加新信息',res);
        if(res.result.statusMsg=='wrong code')
        {
          wx.showModal({
            title: '消息提示', 
            content: '添加消息失败',
          })
        }
      },
      fail: console.error
    })
    this.setData({
      inputMessage : '',
      i : i+1,
      histMess : history
    });
  },
})