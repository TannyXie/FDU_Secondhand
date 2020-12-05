/**
 * API
 *   上传文件
 * 参数
 *   file 图片文件，类型为ArrayBuffer
 *   name 图片名
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据对象，包含fileID字段
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function generateRandomStr() {
  const charset = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
  var s = ''
  for (let i = 0; i < 4; i++) 
    s += charset[Math.floor(Math.random() * charset.length)]
  return s
}

exports.main = async (event, context) => {
  const file = event.file
  const name = event.name

  try {
    const res = await cloud.uploadFile({
      cloudPath: 'pic/' + name + '-' + generateRandomStr() + '-' + (new Date()).getTime().toString() + '.jpg',
      fileContent: Buffer.from(file)
    })
    console.log(res);
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: {
        picId: res.fileID
      }
    }
  } catch(err) {
    console.log(err);
    return {
      statusCode: 500,
      statusMsg: 'upload picture fail',
    }
  }
}