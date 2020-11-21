/**
 * API
 *   通过用户ID获取用户信息
 * 参数
 *   userId 用户ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 用户信息
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
    const res = await db.collection('user').doc(userId).get()
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