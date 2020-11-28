/**
 * API
 *   通过卖家ID获取商品信息
 * 参数
 *   userId （可选）卖家ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 商品信息
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
    const queryResult = await db.collection('second-hand-good').where({
      sellerId: _.eq(userId)
    }).get()
    console.log(queryResult)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: queryResult.data
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }
}