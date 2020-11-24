/**
 * API
 *   添加用户的一条浏览记录
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
    checkResult = await db.collection('history').where({
      userId: _.eq(userId),
      goodId: _.eq(goodId)
    }).get()
    let _date=new Date()
    if (checkResult.data.length == 0) {
      const res = await db.collection('history').add({
        data: {
          userId: userId,
          goodId: goodId,
          time:_date
        }
      })
      console.log(res)
    } else {
      db.collection('history').where({
        userId: _.eq(userId),
        goodId: _.eq(goodId)
      }).update({
        data:{
          time:_date
        }
      })
    }
    return {
      statusCode: 200,
      statusMsg: 'ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'add history fail'
    }
  }
}