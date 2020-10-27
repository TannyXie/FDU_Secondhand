// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return await db.collection('second-hand-good').where({
    intro:{
      $regex:".*"+event.intro+".*",
      $options:'i'
    }
  })
  .orderBy('nums', 'desc')  
  .orderBy('price','asc')
  .orderBy('date','desc')
  .get({
    success:res=>{
      console.log(res)
    }
  });
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}