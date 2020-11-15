/**
 * API
 *   上传文件
 * 参数
 *   base64str 用base64编码的图片
 *   name 图片名
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据对象，包含fileID字段
 */

const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
const { time } = require('console')
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
  // var base64str = fs.readFileSync('test.png', 'base64')
  const base64str = event.base64str
  const name = event.name

  if (base64str == null) {
    return {
      statusCode: 400,
      statusMsg: 'no such file'
    }
  }
  try {
    const res = await cloud.uploadFile({
      cloudPath: 'pic/' + name + '-' + generateRandomStr() + '-' + (new Date()).getTime().toString(),
      fileContent: Buffer.from(base64str, 'base64')
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
      statusCode: 400,
      statusMsg: 'upload picture fail',
    }
  }
}