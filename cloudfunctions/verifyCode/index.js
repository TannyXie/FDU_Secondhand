/**
 * API：
 *   验证用户输入的验证码是否匹配
 * 参数说明：
 * - mail 学生邮箱
 * - code 用户输入的验证码
 * 返回说明：
 * - statusCode 状态码 成功时为200 失败时为400或500
 * - statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const util = require('./util.js')

exports.main = async (event, context) => {
  console.log(event)

  let userId = event.userId
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
    return util.makeResponse(500, 'cannot get user id')
  }
}
  
  const mail = event.mail
  const code = event.code
  if (mail == null || code == null) 
    return util.makeResponse(400, 'mail and code cannot be null')

  const queryResult = await db.collection('verification').where({
    mail: db.command.eq(mail),
    time: db.command.gte(new Date().getTime() - 10 * 60 * 1000)
  }).orderBy('time', 'desc').get()
  console.log(queryResult)

  if (queryResult.data.length == 0) {
    return util.makeResponse(400, 'no verification record for the input mail in 10 minutes')
  } else if (queryResult.data[0].code != code) {
    return util.makeResponse(400, 'wrong code for the input mail')
  } else {
    try {
      const setAuthResult = await db.collection('user').doc(userId).update({
        data: {
          authorized: true,
          mail: mail
        }
      })
      console.log(setAuthResult)
      return util.makeResponse(200, 'verify code ok')
    } catch (error) {
      console.log(error)
      return util.makeResponse(500, 'verify code fail')
    }
  }
}