// components/popbox/popbox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showmess:{
      type: Boolean,
      ifshow: false,
      observer: function(newVal,oldVal){
        var that = this;
        that.setData({
          isShowConfirm : true
        })
      }
    },
    idmess:{
      type: String,
      delId: '',
      observer: function(newVal,oldVal,changedPath){
        var that = this;
        that.setData({
          delId : newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //data
    isShowConfirm:false,
    delId: 'hi',
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
    confirmAcceptance(){
      console.log('inaccept');
      var that = this;
      var delIdStr = this.properties.delId;
      that.setData({
        isShowConfirm: false,
      })
      console.log(this.properties.delId);
      console.log(typeof(delIdStr));
      wx.cloud.callFunction({
        name: 'delMessage',
        data: {
          messageId: that.properties.delId,
        },
        success(res) {
          console.log(res);
          if(res.result.statusMsg=='wrong code')
          {
            console.log('fail');
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
      this.triggerEvent('renewMess', {});
    },
    tapDelete(){
      wx.cloud.callFunction({
        name: 'delMessages',
        data: {
          messageID: this.properties.delId,
        },
        success(res) {
          console.log(res);
          if(res.result.statusCode==200)
          {
            wx.showModal({
              title: '消息提示',
              content: '添加消息失败',
            })
          }
          else{
            console.log('delete succeed');
            console.log(this.properties.delId);
          }
        },
      })
    },
  },
})

/*
      <view class='toast-main'>
        <view class='toast-input'>
          <input type='password' placeholder='输入支付密码' bindinput='setValue' data-name='stuEidtName'></input>
        </view>
      </view>
*/