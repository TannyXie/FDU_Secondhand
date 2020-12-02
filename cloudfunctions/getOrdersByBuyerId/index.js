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


exports.main = async (event, context) => {
  // 参数检查
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: db.command.eq(openid)
      }).get()
      console.log(userResult)
      userId = userResult.data[0]._id
      if (userId == null) throw 'openid may not exist'
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        statusMsg: 'can not get userid'
      }
    }
  }

  // 数据库操作
  try {
    const queryResult = await db.collection('order').where({
      userId: db.command.eq(userId)
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