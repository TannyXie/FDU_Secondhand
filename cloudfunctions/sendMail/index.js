/**
 * API：
 *   发送包含验证码的邮件
 * 参数说明：
 * - mail 合法的学邮字符串
 * 返回说明：
 * - statusCode 状态码 成功时为200 失败时为400
 * - statusMsg 状态信息 成功时为'ok' 失败时为'fail'
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const util = require('./util.js')

exports.main = async (event, context) => {
  console.log(event)

  const mail = event.mail
  if (mail == null)  return util.makeResponse(400, 'mail cannot be null')
  const code = util.generateVerificationCode()
  
  try {
    const sendMailResult = await util.sendMail(mail, code)
    console.log(sendMailResult)
    if (sendMailResult.accepted.length > 0) {
      const addVeriResult = await db.collection('verification').add({
        data: {
          time: new Date().getTime(),
          mail: mail,
          code: code
        }
      })
      console.log(addVeriResult)
      return util.makeResponse(200, 'send mail ok')
    } else throw 'unknown reason'
  } catch (error) {
    console.log(error)
    return util.makeResponse(500, 'send mail fail')
  }
}