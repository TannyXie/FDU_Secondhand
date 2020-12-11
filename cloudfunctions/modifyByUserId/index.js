/**
 * API
 *   修改用户名字和头像
 * 参数
 *   file 头像图片文件，类型为ArrayBuffer
 *   name 图片名
 *   userId 用户id
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据对象，包含fileID字段
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

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
  const userId = event.userId

  try {
    // console.log(file,name,userId)
    cloudpath='profile/' + userId + '-' + generateRandomStr() + '-' + (new Date()).getTime().toString() + '.jpg'
    const res = await cloud.uploadFile({
      cloudPath: cloudpath,
      fileContent: Buffer.from(file)
    })
    await db.collection('user').where({
      _id: _.eq(userId)
    })
    .update({
      data:{
        name:name,
        avatarUrl:res.fileID
      }
    })
    console.log(res);
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: {
        profileId: res.fileID
      }
    }
  } catch(err) {
    console.log(err);
    return {
      statusCode: 500,
      statusMsg: 'modify user information fail',
    }
  }
}