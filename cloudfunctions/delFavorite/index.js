/**
 * API
 *   取消收藏某商品
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
  // 参数检查
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: _.eq(openid)
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
  const goodId = event.goodId
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'no such good'
    }
  }

  try {
    // 数据记录检查
    const checkResult = await db.collection('favorite').where({
      userId: _.eq(userId),
      goodId: _.eq(goodId)
    }).get()
    if (checkResult.data.length == 0) {
      return {
        statusCode: 400,
        statusMsg: 'no such record'
      }
    } else {
      const delResult = await db.collection('favorite').where({
        userId: _.eq(userId),
        goodId: _.eq(goodId)
      }).remove()
      console.log(delResult)
      return {
        statusCode: 200,
        statusMsg: 'del favorite ok'
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'del favorite fail'
    }
  }


}