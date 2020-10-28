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
    tag:event.tag
    }
  )
  .orderBy('nums', 'desc')  
  .orderBy('date','desc')
  .get({
    success:res=>{
      console.log(res)
    }
  });
}