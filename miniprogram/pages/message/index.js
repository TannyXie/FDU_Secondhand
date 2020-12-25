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
    output: [],
    loaded: 0,

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
        console.log('成功获取朋友', res);
        const receivedId = res.result.data.userIdList;
        let tempList = [];
        let j = 0;
        for (; j < receivedId.length; ++j) {
          const i = j;
          tempList.push({ 'userId': receivedId[i] });
          let person = receivedId[i];
          wx.cloud.callFunction({
            name: 'getUserById',
            data: {
              userId: person
            },
            success(res) {
              console.log('成功获取用户信息', res.result.data);
              tempList[i]['nickName'] = res.result.data.name
              wx.cloud.callFunction({
                name: 'getUrlsByPicIds',
                data: {
                  picIdList: [res.result.data.picId]
                },
                success(res) {
                  console.log('成功加载评论头像', res);
                  tempList[i]['profile'] = res.result.data.urlList[0];
                  wx.cloud.callFunction({
                    name: 'getMessages',
                    data: {
                      anotherUserId: tempList[i].userId
                    },
                    success(res) {
                      console.log('加载对话消息', res);
                      if (res.result.statusMsg == 'wrong code') {
                        wx.showToast({
                          title: '消息加载失败',
                          duration: 2000,
                          icon: 'none'
                        })
                      }
                      var len = res.result.data.length;
                      tempList[i]['message'] = res.result.data[len - 1].content;
                      tempList[i]['time'] = res.result.data[len - 1].time
                      if (tempList.length == receivedId.length && tempList[receivedId.length - 1].hasOwnProperty('message') && tempList[receivedId.length - 1]['message'] != '') {
                        tempList.sort(function (a, b) {
                          return b.time - a.time
                        })
                        that.setData({
                          output: tempList,
                          loaded: 1
                        })
                        console.log("展示的数据", that.data.output)
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
  },
  goToBangDan: function () {
    wx.navigateTo({
      url: '/pages/classification/classification',
    })
  },

  gotoDialogue(e) {
    var gotouserId = e.currentTarget.dataset.id
    console.log(gotouserId)
    wx.navigateTo({
      url: '/pages/message/chatrm/index?sellerId=' + gotouserId,
    })
  }
})
