/**
 * API
 *   通过邮箱获取预设的问答
 * 参数
 *   mail 邮箱
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data QA对象列表
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
    const _ = db.command
    const res = await db.collection('autoreply').where({
      userId: _.eq(userId)
    }).field({
      question: true,
      answer: true
    }).get()
    console.log(res)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res.data
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }

}