/*
  基于wx.request封装的一个请求函数
  因为在小程序开发中request是最常用的api所以会造成很多的代码重复
  因此将其在封装之后可以大大的减少代码的复用
*/

let myRequest = function(args = {url:'', methods:'GET', data:{}, success:function(){}, fail:function(){}}){
  wx.request({
    url: args.url,
    data: args.data,
    header: {'content-type': 'application/json'},
    method: args.methods,
    dataType: 'json',
    responseType: 'text',
    success: (res)=>{
      console.log(res);
      if(res.statusCode == 200){  //请求成功执行回调函数
        args.success(res)
      }
      else{ //请求失败执行回调函数
        args.fail()
      }
    },
  })
}

function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log("success");

        if (res.statusCode == 200) {

          if (res.data.errno == 401) {
            //需要登录后才可以操作

            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);

                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

// 向外暴露接口
module.exports = {
  myRequest: myRequest,
  request,
  get,
  post,
}