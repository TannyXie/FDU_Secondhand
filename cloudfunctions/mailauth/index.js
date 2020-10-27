
const nodemailer = require('nodemailer')

function generateVerificationCode() {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

var transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', // 邮件服务器
  port: 465, // 服务器端口
  auth: {
    user: '903712465@qq.com', // 发送方邮箱
    pass: 'sahypmwzzvtmbfdi'  // 发送方授权码
  }
})

exports.main = async (event, context) => {
  let code = generateVerificationCode()
  var res = await transporter.sendMail({
    from: '复旦二手交易平台开发团队 <903712465@qq.com>',
    subject: '复旦二手交易平台验证码',
    to: event.studentMail,
    text: '您好！您的验证码为：' + code + '，请返回小程序填写验证码。'
  })
  return code
}