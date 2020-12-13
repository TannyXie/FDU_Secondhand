// miniprogram/pages/my/browseHistory/browseHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList:[],
    goodsList: [
  ],
    idx2List:[],
    hasList:false,
    loaded:0,
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
      name: 'getHistoryByUserId',
      data:{
        userId:"fakeuserid1",
      },
      success(res) {
        console.log('成功', res.result.data);
        if(res.result.data.length)
        {
          res.result.data.sort(function(a, b){return a.time - b.time});
        }
        var arr =new Array();
        var date2idx=new Map();
        var idx2List=new Array();
        var idx=0;
        var keys=new Array()
        for(var i=0;i<res.result.data.length;i++)
        {
          arr[i]=res.result.data[i].data
          //get the browse date
          var date=res.result.data[i].time.split(' ')[0]
          console.log(date)
          
          if(!date2idx.has(date))
          {
          date2idx.set(date,idx)
          keys[idx]=date
          idx++
          }
          var j=date2idx.get(date)
          if(idx2List[j])
          {idx2List[j]=idx2List[j].concat(arr[i]);
          }
          else
          {
            idx2List[j]=[arr[i]];
          }

        }
        console.log(arr)
        console.log(date2idx)
        console.log(idx2List)
        console.log(keys)
    
        that.setData({
          dateList:keys,
        });
        that.setData({
          goodsList: arr,
          idx2List:idx2List
        });
        if(res.result.data)
        {
          if(res.result.data.length){
          that.setData({
            hasList: true,
          });
        }
        }
        that.setData({
          loaded:1,
        })
      },
    })
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
deleteHistory(e) {
  //调用云函数，在后端把所有记录删掉
  wx.cloud.callFunction({
    name: 'delHistory',
    data:{
      userId:"fakeuserid1",
    },
    success(res) {
      console.log('成功清空历史');
      wx.showToast({
        title: '清空成功',
        duration: 2000,
      })
    },
  })
  this.setData({
    hasList:false,
  });
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