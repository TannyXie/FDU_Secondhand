/**
 * API
 *   添加一对Q&A
 * 参数
 *   question 问题
 *   answer 回答
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
      statusMsg: 'add q&a ok'
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      statusMsg: 'add q&a fail'
    }
  }
}