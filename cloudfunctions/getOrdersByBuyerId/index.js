/**
 * API
 *   获取用户作为买方的所有订单
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // 参数检查
  const userId = event.userId ? event.userId : cloud.getWXContext().OPENID
  if (userId == null) {
    return {
      statusCode: 400,
      statusMsg: 'can not get user id'
    }
  }

  // 数据库操作
  try {
    const queryResult = await db.collection('order').where({
      userId: _.eq(userId)
    }).get()
    console.log(queryResult)

    var returnList = []
    for (let record of queryResult.data) { 
      returnList = returnList.concat({
        orderId: record._id,
        userId: record.userId,
        goodId: record.goodId,
        createTime: record.createTime ? new Date(record.createTime) : null,
        finishTime: record.finishTime ? new Date(record.finishTime) : null
      })
    }
    console.log(returnList)

    return {
      statusCode: 200,
      statusMsg: 'get orders ok',
      data: returnList 
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'get orders fail'
    }
  }
}