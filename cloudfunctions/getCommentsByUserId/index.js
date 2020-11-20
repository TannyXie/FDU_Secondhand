/**
 * API
 *   获取用户发布的所有评论
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 评论数据
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

  // 数据库操作
  try {
    const result = await db.collection('comment').where({
      userId: _.eq(userId)
    }).get()
    console.log(result)
    return {
      statusCode: 200,
      statusMsg: 'get comments ok',
      data: result.data 
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'get comments fail'
    }
  }
}