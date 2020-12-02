// miniprogram/pages/my/myPost/myPost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [
  ],
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
        userId: 'fakeuserid1',
      },
      success(res) {
        console.log('成功', res.result.data.unsold.list);
        that.setData({
          goodsList: res.result.data.unsold.list,
        });
        if(res.result.data.unsold.list)
        {
          if(res.result.data.unsold.list.length){
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
    let goodsList = this.data.goodsList;
    //调用云函数，在后端也把记录删掉
    wx.cloud.callFunction({
      name: 'delGood',
      data:{
        goodId:goodsList[index]._id,
      },
      success(res) {
        console.log('下架成功');
        wx.showToast({
          title: '下架成功',
          duration: 2000,
        })
      },
    })
    goodsList.splice(index,1);
    this.setData({
      goodsList : goodsList 
    });
    if(this.data.goodsList.length==0)
    {
      this.setData({
        hasList : false
      });
    }
},
gotoDetails(e) {
  const index = e.currentTarget.dataset.index;
  let goodsList = this.data.goodsList;
  console.log(index)
  var goodId = goodsList[index]._id
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