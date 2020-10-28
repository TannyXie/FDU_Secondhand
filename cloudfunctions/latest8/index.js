// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return await db.collection('second-hand-good')
  .orderBy('date','desc')
  .limit(8)
  .get({
    success:res=>{
      console.log(res)
    }
  })
  .then((res) => {
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res.data
    }
  })
  .catch((err) => {
    return {
      statusCode: 400,
      statusMsg: err
    }
  })
}