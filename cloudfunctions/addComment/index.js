/**
 * API
 *   发布评论
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 *   goodId  商品ID
 *   content 评论内容
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
  const content = event.content
  
  // 数据库操作
  try {
    const addResult = await db.collection('comment').add({
      data: {
        userId: userId,
        goodId: goodId,
        content: content,
        time: db.serverDate()
      }
    })
    console.log(addResult)
    return {
      statusCode: 200,
      statusMsg: 'add comment ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'add comment fail'
    }
  }

}