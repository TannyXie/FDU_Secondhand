/**
 * API：
 *   返回收藏数最多的六个商品
 * 返回参数：同search云函数
 * 返回说明：
 * - statusCode 状态码 成功时为200
 * - statusMsg 状态信息
 * - data 返回的数据，一个JS对象列表
 */
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return await db.collection('second-hand-good').aggregate()
  .lookup({
    from: "user",
    localField: "sellerId",
    foreignField: "_id",
    as: "seller"
  })
  .project({
    commentList:1,
    coverMiddle:1,
    date:1,
    desc:1,
    intro:1,
    nums:1,
    price:1,
    tag:1,
    name:"$seller.name"
  })
  .unwind('$name')
  .sort({
    nums: -1
  })
  .limit(6)
  .end()
  .then((res) => {
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res
    }
  })
  .catch((err) => {
    return {
      statusCode: 400,
      statusMsg: err
    }
  })
}