/**
 * API
 *   修改用户名字和头像
 * 参数
 *   name 用户名
 *   file 头像图片文件，类型为ArrayBuffer
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据对象
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

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

  var userId = event.userId;  
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: db.command.eq(cloud.getWXContext().OPENID)
      }).get()
      console.log(userResult)
      userId = userResult.data[0]._id
      if (userId == null) throw 'openid may not exist'
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        statusMsg: 'can not get userid'
      }
    }
  }

  try {
    if (file != null) {
      const uploadResult = await cloud.uploadFile({
        cloudPath: 'profile/' + userId + '-' + generateRandomStr() + '-' + (new Date()).getTime().toString() + '.jpg',
        fileContent: Buffer.from(file)
      })
      console.log(uploadResult)
      
      const updatePicResult = await db.collection('user').doc(userId).update({ 
        data: { picId: uploadResult.fileID } 
      })
      console.log(updatePicResult)

    }
    if (name != null) {
      const updateNameResult = await db.collection('user').doc(userId).update({ data:{ name:name } })
      console.log(updateNameResult)
    }
    return {
      statusCode: 200,
      statusMsg: 'modify user info ok',
    }
  } catch(err) {
    console.log(err);
    return {
      statusCode: 500,
      statusMsg: 'modify user information fail',
    }
  }
}