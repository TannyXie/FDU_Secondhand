/**
 * API
 *   获取用户作为卖方的所有订单
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
    const goodQueryResult = await cloud.callFunction({
      name: 'getGoodBySellerId',
      data: {
        userId: userId 
      }
    })
    console.log(goodQueryResult.result)

    var orderList = []
    for (let good of goodQueryResult.result.data) {
      let orderQueryResult = await db.collection('order').where({
        goodId: _.eq(good._id)
      }).get()
      for (let record of orderQueryResult.data) {
        orderList = orderList.concat({
          orderId: record._id,
          userId: record.userId,
          goodId: record.goodId,
          createTime: new Date(record.createTime),
          finishTime: record.finishTime ? new Date(record.finishTime) : null
        })
      }
    }
    console.log(orderList)

    return {
      statusCode: 200,
      statusMsg: 'get orders ok',
      data: orderList
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'get orders fail'
    }
  }
}