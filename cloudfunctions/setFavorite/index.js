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
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: db.command.eq(cloud.getWXContext().OPENID)
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
    const checkResult = await db.collection('favorite').where({
      userId: db.command.eq(userId),
      goodId: db.command.eq(goodId)
    }).get()
    if (checkResult.data.length == 0) {
      const addResult = await db.collection('favorite').add({
        data: {
          userId: userId,
          goodId: goodId
        }
      })
      console.log(addResult)
      const updateResult = await db.collection('second-hand-good').doc(goodId).update({
        data: {
          nums: db.command.inc(1)
        }
      })
      console.log(updateResult)
      return {
        statusCode: 200,
        statusMsg: 'ok'
      }
    } else {
      return {
        statusCode: 300,
        statusMsg: 'already in favorite'
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