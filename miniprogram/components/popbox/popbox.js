// components/popbox/popbox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:String,
      inputMessage:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //data
    isShowConfirm:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setValue: function (e) {
      this.setData({
        walletPsd: e.detail.value
      })
    },
    cancel: function () {
      var that = this
      that.setData({
        isShowConfirm: false,
      })
    },
    confirmAcceptance:function(){
      var that = this
      that.setData({
        isShowConfirm: false,
      })
    },
  },

  tapDelete: function(e){
    wx.cloud.callFunction({
      name: 'delMessages',
      data: {
        messageID: 'fakeuser1',
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
          console.log('delete succeed');
        }
      },
    })
  },
   


})
