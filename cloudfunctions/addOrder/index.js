/**
 * API
 *   添加一条订单记录
 * 参数
 *   userId （可选）买家ID；若不填则默认为当前用户
 *   goodId  商品ID（在对应的商品类中包含商品信息和卖家ID）
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据，包含订单ID
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
      statusMsg: 'can not get user id',
    }
  }
  const goodId = event.goodId
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'good id cannot be null'
    }
  }
  
  // 数据库操作
  try {
    const addResult = await db.collection('order').add({
      data: {
        userId: userId,
        goodId: goodId,
        createTime: new Date().getTime(),
        finishTime: null
      }
    })
    console.log(addResult)
    return {
      statusCode: 200,
      statusMsg: 'add order ok',
      data: {
        orderId: addResult._id
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'add order fail'
    }
  }

}