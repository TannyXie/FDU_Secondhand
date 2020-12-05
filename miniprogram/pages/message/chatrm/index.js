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
    speakee: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      speakee: options.sellerId
    })
  }, 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.data.setInter = setInterval(
      function(){
        console.log('here');
        var result = '';
        wx.cloud.callFunction({
          name: 'getMessages',
          data: {
            thisUserId: 'fakeuser1',
            anotherUserId: 'fakeuser2'
          },
          success(res) {
            console.log(res);
            if(res.result.statusMsg=='wrong code')
            {
              wx.showModal({
                title: '消息提示',
                content: '添加消息失败',
              })
            }
            else{
              that.setData({
                messages: res.result.data
              })
            }
          },
        })
      },500
    )
  },

  renewMess(e){
    wx.cloud.callFunction({
      name: 'getMessages',
      data: {
        receiver: '',
        content: this.data.inputMessage
      },
      success(res) {
        console.log(res);
        if(res.result.statusMsg=='wrong code')
        {
          wx.showModal({
            title: '消息提示',
            content: '添加消息失败',
          })
        }
        else{
        }
      },
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    if(e.target.id=="sub"){

    }
  },

  textChange(e){
    this.setData({
      inputMessage : e.detail.value,
    });
  },

  inputRenew(e){
    var history = this.data.histMess;
    history.push({
      message: this.data.inputMessage,
      response: 'this is a response'
    });
    var i = this.data.i;
    console.log('the inputMessage is '+this.data.inputMessage);
    wx.cloud.callFunction({
      name: 'addMessage',
      data: {
        senderId: 'fakeuser1',
        receiverId: 'fakeuser2',
        content: this.data.inputMessage
      },
      success(res) {
        console.log(res);
        if(res.result.statusMsg=='wrong code')
        {
          wx.showModal({
            title: '消息提示', 
            content: '添加消息失败',
          })
        }
      },
    })
    this.setData({
      inputMessage : '',
      i : i+1,
      histMess : history
    });
  },
})
/*

    <view class="input-box2">
      {{item.content}}
    </view>

*/