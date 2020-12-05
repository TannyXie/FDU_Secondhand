/**
 * API
 *   通过邮箱获取预设的问答
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data QA列表
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
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
    const res = await db.collection('autoreply').where({
      userId: db.command.eq(userId)
    }).get()
    console.log(res)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res.data
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }

}