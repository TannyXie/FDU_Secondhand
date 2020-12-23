const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    messageList: [
      /*
    {
      userId: '',
      nickName: "阚海滨",
      message: "你的作业没交",
      profile: '/pages/details/user-unlogin.png'
    }
    */
    ],
    nickNamecount: 0,
    messagecount: 0,
    picUrlcount: 0,
    swiperCurrent: 0,
    gotouserId: [],
    output: '',

  },

  /**
   * 生命周期函数 —— 监听页面加载
   */
  onShow: function (options) {
    
    var that = this;

    //获取聊天列表

    wx.cloud.callFunction({
      name: 'getFriends',
      data: {},
      success(res) {
        console.log('成功获取朋友',res);
        var receivedId = res.result.data.userIdList;
        var i = 0;
        var tempList = [];
        for(;i<receivedId.length;++i){
          tempList.push({'userId': receivedId[i]});
        }
        that.setData({
          messageList: tempList
        });
        i = 0;
        for (;i<receivedId.length; ++i){
          var person = receivedId[i];
          wx.cloud.callFunction({
            name: 'getUserById',
            data:{
              userId: person
            },
            success(res) {
              console.log('成功获取用户信息', res.result.data);
              var count = that.data.nickNamecount;
              var personInfo = that.data.messageList[count];
              var messageList = that.data.messageList;
              personInfo['nickName'] = res.result.data.name;
              personInfo['picId'] = res.result.data.picId;
              messageList[count] = personInfo;
              count++;
              that.setData({
                nickNamecount: count,
                messageList: messageList,
              })
              console.log(that.data);
              wx.cloud.callFunction({
                name: 'getUrlsByPicIds',
                data: {
                  picIdList: [that.data.messageList[that.data.nickNamecount-1].picId]
                },
                success(res) {
                  console.log('成功加载评论头像',res);
                  var count = that.data.picUrlcount;
                  var personInfo = that.data.messageList[count];
                  messageList = that.data.messageList;
                  personInfo['profile'] = res.result.data.urlList[0];
                  messageList[count] = personInfo;
                  
                  count ++;
                  that.setData({
                    picUrlcount: count,
                    messageList: messageList
                  })
                  console.log(that.data);
                  //console.log('person is ',receivedId[urllen]);
                  wx.cloud.callFunction({
                    name: 'getMessages',
                    data: {
                      anotherUserId: messageList[count-1].userId
                    },
                    success(res) {
                      console.log('成功加载对话消息',res);
                      if(res.result.statusMsg=='wrong code')
                      {
                        wx.showModal({
                          title: '消息提示', 
                          content: '添加消息失败',
                        })
                        return;
                      }
                      var count = that.data.messagecount;
                      var personInfo = that.data.messageList[count];
                      messageList = that.data.messageList;
                      var len = res.result.data.length;
                      messageList[count]['message'] = res.result.data[len-1].content;
                      count++;
                      that.setData({
                        messageList: messageList,
                        messagecount: count
                      })
                      console.log(that.data);
                      if(that.data.messagecount==receivedId.length){
                        that.setData({
                          output: that.data.messageList
                        })
                      }
                    },
                    fail: console.error,
                  })
                  
                },
                fail: console.error,
              })
            },
            fail: console.error,
          });
        }
      }
    });
    console.log(this.data.messageList);
  },
  onLoad(){
    
  },
  goToBangDan: function() {
    wx.navigateTo({
      url: '/pages/classification/classification',
    })
  },

  gotoDialogue(e) {
    var gotouserId = this.data.messageList[e.currentTarget.dataset.index].userId;
    wx.navigateTo({
      url: '/pages/message/chatrm/index?sellerId=' + gotouserId,
    })
  }
})
