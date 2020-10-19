const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    messageList: [{
      name: "阚海滨",
      message: "你的作业没交",
      profile: '/images/messages/github-otus.png'
    },
    {
      name: '张建国',
      message: '请各位同学告诉我上课时间',
      profile: '/images/messages/github-otus.png'
    },
    {
      name: '王勇',
      message: '这个不考的，但我还是要讲',
      profile: '/images/messages/github-otus.png'
    }
  ],
    swiperCurrent: 0,
  },

  /**
   * 生命周期函数 —— 监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = 'https://mobile.ximalaya.com/mobile/discovery/v3/recommend/hotAndGuess?code=43_310000_3100&device=android&version=5.4.45';

    // 调用自己封装的工具函数，在utils中
    utils.myRequest({
      url: url,
      methods: 'GET',
      success: function(result){
        that.setData({
          showitem: true,
          guess: result.data.paidArea.list,
          xiaoshuocontent: result.data.hotRecommends.list[0].list,
          xiangshengcontent: result.data.hotRecommends.list[2].list,
          lishicontent: result.data.hotRecommends.list[3].list
        })
      },
      fail: function() {
        that.setData({
          showitem: false
        })
      }
    });
  },
  // 宫格导航改变事件
  goToBangDan: function() {
    wx.navigateTo({
      url: '/pages/classification/classification',
    })
  },
  // 上新推荐改变事件
  gotoDialogue(e) {
    var url = e.currentTarget.dataset.coverimg;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/details/details?url=' + url + '&title=' + title,
    })
  }
})
