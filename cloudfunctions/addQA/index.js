/**
 * API
 *   添加一对Q&A
 * 参数
 *   userId 用户ID
 *   question 问题
 *   answer 回答
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 包含QAId
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      const userResult = await db.collection('user').where({
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
  
  try {
    const res = await db.collection('autoreply').add({
      data: {
        userId: userId,
        question: event.question,
        answer: event.answer
      }
    })
    console.log(res);
    return {
      statusCode: 200,
      statusMsg: 'add q&a ok',
      data: {
        QAId: res._id
      }
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      statusMsg: 'add q&a fail'
    }
  }
}