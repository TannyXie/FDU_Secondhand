/**
 * API
 *   使用户加购某商品
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 *   goodId 商品ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const userId = event.userId ? event.userId : cloud.getWXContext().OPENID
  if (userId == null) {
    return {
      statusCode: 400,
      statusMsg: 'can not get userid'
    }
  }
  const goodId = event.goodId
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'good id cannot be null'
    }
  }
  try {
    checkResult = await db.collection('cart').where({
      userId: _.eq(userId),
      goodId: _.eq(goodId)
    }).get()
    if (checkResult.data.length == 0) {
      const res = await db.collection('cart').add({
        data: {
          userId: userId,
          goodId: goodId
        }
      })
      console.log(res)
      return {
        statusCode: 200,
        statusMsg: 'ok'
      }
    } else {
      return {
        statusCode: 300,
        statusMsg: 'already in cart'
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'set favorite fail'
    }
  }
}