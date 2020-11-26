/**
 * API
 *   清除该用户所有浏览记录
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
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

  try {
    // 数据记录检查
    const delResult = await db.collection('history').where({
        userId: _.eq(userId)
      }).remove()
    console.log(delResult)
    return {
      statusCode: 200,
      statusMsg: 'del favorite ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'del favorite fail'
    }
  }
}