/**
 * API
 *   使用户收藏某商品
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

exports.main = async (event, context) => {
  const userId = event.userId ? event.userId : cloud.getWXContext().OPENID
  if (userId == null) {
    return {
      statusCode: 400,
      statusMsg: 'can not get userid'
    }
  }
  const goodId = event.goodId
  try {
    const res = db.collection('favorite').add({
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
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'set favorite fail'
    }
  }
}