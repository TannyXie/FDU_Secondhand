//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tagArray: ['二手书籍', '数码家电', '生活用品', '护肤美妆', '学习用品','服装鞋子','食品药品','其他'],
    tagIndex: 0,
    name:"",
    description:"",
    tag:"二手书籍",
    price:"",
    // qaArray: [{id: 0, question: '', answer: ''}],
    // numQA: 1,
    picId:""
  },
  bindPickerChange: function (e) {
    var curtag = this.data.tagArray[e.detail.value];
    this.setData({
      tagIndex: e.detail.value,
      tag: curtag
    })
    console.log('tag picker发送选择改变，携带值为', e.detail.value)
  },
 
  nameInput: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  descInput: function(e){
    this.setData({
      description: e.detail.value
    })
  },
  priceInput: function(e){
    let value = e.detail.value.replace(/\D/g, '')
    this.setData({
      price: value
    })
  },
  /*
  questionInput: function(e){
    console.log(e)
    var curQue = e.detail.value;
    const curid = e.currentTarget.dataset.index;
    this.data.qaArray[curid].question = curQue;
    this.setData({
      qaArray: this.data.qaArray
    })
  },
  answerInput: function(e){
    var curAns = e.detail.value;
    const curid = e.currentTarget.dataset.index;
    this.data.qaArray[curid].answer = curAns;
    this.setData({
      qaArray: this.data.qaArray
    })
  },
  moreQA: function (){
    const length = this.data.qaArray.length
    this.data.qaArray.push({ id: length, question: "", answer:"" });
    this.setData({
      qaArray: this.data.qaArray
    })
    console.log('moreqa: qaArray length: '+this.data.qaArray.length)
  },*/
   // 上传图片
   doUpload: function () {
     var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let fPath = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中',
        })
        wx.compressImage({
          src: fPath, // 图片路径
          quality: 20, // 压缩质量
          success: (res) => {
            fPath = res.tempFilePath
            console.log('压缩成功'+fPath)
            wx.getFileSystemManager().readFile({
              filePath: fPath,
              success: (res) => {
                console.log(res)
                wx.cloud.callFunction({
                  name: 'uploadPicture',
                  data: {
                    file: res.data,
                    name: "imagePost",
                    dir:'pic/'
                  },
                  success: function(res) {
                    console.log(res.result)
                    if (res.result.statusCode==200)
                    {
                      wx.hideLoading()
                      console.log('[上传文件] 成功：', res)
                      that.setData({ picId: res.result.data.picId })
                      wx.showToast({
                        icon: 'none',
                        duration: 2000,
                        title: '上传成功', //+ that.data.picId,
                      })
                    }
                    else 
                    {
                      wx.hideLoading()
                      wx.showToast({
                        icon: 'none',
                        duration: 2000,
                        title: '上传失败'
                      })
                      console.log('[上传文件] 失败', res)
                    }
                  },
                  fail: (res) => {
                    wx.hideLoading()
                      wx.showToast({
                        icon: 'none',
                        duration: 2000,
                        title: '上传失败，文件过大'
                      })
                    console.error(res)
                  },
                })
              }
            })
          },
          fail: console.error
        })
      }
    })
  },
  /*
  // 发布自动回复
  doPostQA: function () {
    console.log('post qa: qaArray length: '+this.data.qaArray.length)
    var that=this;
    var i;
    var errorflag = 0;
    for (i = 0; i < this.data.qaArray.length; i++) {
      var curque = that.data.qaArray[i].question;
      var curans = that.data.qaArray[i].answer;
      if(curque=="" && curans=="")
      {
        wx.showToast({
          icon: 'none',
          title: "存在信息未填写完整",
        })
        continue;
      }
      wx.cloud.callFunction({
        // 云函数名称
        name: 'addQA',
        // 传给云函数的参数
        data: {
          question: curque,
          answer: curans,
        },
        success: function(res) {
          if (res.result.statusCode==200)
          {
            console.log('[发布自动回复] 成功：', res)
          }
          else
          {
            flag=1;
            console.error('[发布自动回复] 失败', res)
            wx.showToast({
              icon: 'none',
              title: '发布自动回复失败',
            })
          }
        },
        fail: console.error,
      })
    }
    if(errorflag!=1)
      {
        this.setData({
          qaArray: [{id: 0, question: '', answer: ''}]
        })
        wx.showToast({
          icon: 'none',
          title: '[发布自动回复]成功',
        })
      }
   
 },*/
   // 发布商品
   doPost: function () {
     var that=this;
     if(that.data.picId =="" | that.data.description ==""| that.data.name ==""| that.data.price ==""| that.data.tag =="") 
     {
      console.error('[发布商品] 失败，信息不完整')
       wx.showToast({
        icon: 'none',
        title: '请填写完整信息',
      })
    }
      else
      {       
        wx.cloud.callFunction({
          // 云函数名称
          name: 'addGood',
          // 传给云函数的参数
          data: {
            coverMiddle: that.data.picId,
            desc: that.data.description,
            intro: that.data.name,
            price: Number(that.data.price),
            tag: that.data.tag,
          },
          success: function(res) {
            if (res.result.statusCode==200)
            {
              console.log('[发布商品] 成功：', res)
              wx.showToast({
                duration: 2000,
                title: '['+that.data.name+']'+'发布成功',
                icon: 'none',
              })
              that.setData({
                tagIndex: 0,
                name:"",
                description:"",
                tag:"",
                price:"",
                tag:"二手书籍",
                picId:""
              })
            }
            else
            {
              console.error('[发布商品] 失败', res)
              wx.showToast({
                icon: 'none',
                title: '['+that.data.name+']'+'发布失败',
              })
            }
          },
          fail: console.error,
        })
      }
    
  }
})
