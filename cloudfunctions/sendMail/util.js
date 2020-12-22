module.exports.generateVerificationCode = function() {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

module.exports.sendMail = async function(mail, code) {
  const nodemailer = require('nodemailer')
  let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465, 
    auth: {
      user: '903712465@qq.com', 
      pass: 'sahypmwzzvtmbfdi'
    }
  })
  return await transporter.sendMail({
    from: '豆芽菜二手交易平台 <903712465@qq.com>',
    subject: '豆芽菜二手交易平台验证码',
    to: mail,
    text: '您好！您的验证码为：' + code + '，请返回小程序填写验证码。'
  })
}

module.exports.makeResponse = function(code, msg, data) {
  let obj = {}
  obj.statusCode = code
  obj.statusMsg = msg
  if (data) obj.data = data
  return obj
}