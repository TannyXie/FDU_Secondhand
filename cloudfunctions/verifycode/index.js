/**
 * API：
 *   验证用户输入的验证码是否匹配
 * 参数说明：
 * - studentMail 学生邮箱
 * - enteredCode 用户输入的验证码
 * 返回说明：
 * - statusCode 状态码 成功时为200 失败时为400或500
 * - statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const mail = event.studentMail
  const code = event.enteredCode

  res = await db.collection('verification').where({mail: db.command.eq(mail)}).orderBy('time', 'desc').get()
  console.log(res.data.length);
  console.log(res.data);
  if (res.data.length == 0) {
    return {
      statusCode: 400,
      statusMsg: 'invalid mailbox'
    }
  } else if (res.data[res.data.length-1].code != code) {
    return {
      statusCode: 400,
      statusMsg: 'wrong code'
    }
  } else {
    return db.collection('user').doc(wxContext.OPENID).update({
      data: {
        authorized: true,
        mail: mail
      }
    }).then(() => {
      return {
        statusCode: 200,
        statusMsg: 'ok'
      }
    }).catch(() => {
      return {
        statusCode: 500,
        statusMsg: 'fail to update status'
      }
    })
  }
}