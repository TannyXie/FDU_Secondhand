/**
 * API：
 *   发送包含验证码的邮件
 * 参数说明：
 * - studentMail 合法的学邮字符串
 * 返回说明：
 * - statusCode 状态码 成功时为200 失败时为400
 * - statusMsg 状态信息 成功时为'ok' 失败时为'fail'
 */

const nodemailer = require('nodemailer')

function generateVerificationCode() {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

function sendMail(mail, code) {
  let transporter = nodemailer.createTransport({
    // 邮件服务器配置
    host: 'smtp.qq.com',
    port: 465, 
    auth: {
      user: '903712465@qq.com', 
      pass: 'sahypmwzzvtmbfdi'
    }
  })
  return transporter.sendMail({
    from: '豆芽菜二手交易平台 <903712465@qq.com>',
    subject: '豆芽菜二手交易平台验证码',
    to: mail,
    text: '您好！您的验证码为：' + code + '，请返回小程序填写验证码。'
  })
}

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  let mail = event.studentMail
  let code = generateVerificationCode()
  sendMail(mail, code).then((res) => {
    console.log(res)
    db.collection('verification').add({
      data: {
        mail: mail,
        code: code
      }
    })
    return {
      statusCode: 200,
      statusMsg: code
    }
  })
  .catch((err) => {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail'
    }
  })
}