/**
 * API：
 *   根据商品类型查询商品
 * 传入参数：
 * - tag 商品类型
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
  .match({
    tag:event.tag,
    sold:false
  })
  .lookup({
    from: "user",
    localField: "sellerId",
    foreignField: "_id",
    as: "seller"
  })
  // .replaceRoot({
  //   newRoot: $.mergeObjects([ $.arrayElemAt(['$seller', 0]), '$$ROOT' ])
  // })
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
    nums: -1,
    date: -1,
    price: 1,
  })
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