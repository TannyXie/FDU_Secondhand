// miniprogram/pages/my/myPost/myPost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unsoldList: [
  ],
    soldList:[],
    hasList:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'getReleaseByUserId',
      data:{
      },
      success(res) {
        console.log(res)
        console.log('成功获得未卖出', res.result.data.unsold.list);
        console.log('成功获得已卖出', res.result.data.sold.list);
        that.setData({
          unsoldList: res.result.data.unsold.list,
          soldList: res.result.data.sold.list,
        });
        if(res.result.data.unsold.list)
        {
          if(res.result.data.unsold.list.length||res.result.data.sold.list.length){
          that.setData({
            hasList: true,
          });
        }
        }
      },
    })
  },
  //卖家主动下架商品
  deleteRelease(e) {
    const index = e.currentTarget.dataset.index;
    let unsoldList = this.data.unsoldList;
    //调用云函数，在后端也把记录删掉
    wx.cloud.callFunction({
      name: 'delGood',
      data:{
        goodId:unsoldList[index]._id,
      },
      success(res) {
        console.log('下架成功');
        wx.showToast({
          title: '下架成功',
          duration: 2000,
        })
      },
    })
    unsoldList.splice(index,1);
    this.setData({
      unsoldList : unsoldList 
    });
    if(this.data.unsoldList.length==0&&this.data.soldList.length==0)
    {
      this.setData({
        hasList : false
      });
    }
},
gotoDetails(e) {
  const index = e.currentTarget.dataset.index;
  let unsoldList = this.data.unsoldList;
  console.log(index)
  var goodId = unsoldList[index]._id
  console.log(goodId)
  wx.navigateTo({
    url: '/pages/details/index?key=' + goodId
  })
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

  }
})