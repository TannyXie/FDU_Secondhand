/**
 * API
 *   查询聊天对象
 * 参数
 *   userId  可选，若不填则默认当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg  状态信息
 *   data       包含userIdList字段，即与某用户有消息记录的用户ID列表
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const util = require('./util')

exports.main = async (event, context) => {
  // 打印参数
  console.log(event)

  // 获取用户ID
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
      return util.makeResponse(500, 'can not get userid')
    }
  }

  // 查询消息
  try {
    // 这里使用var，因为在下一个try&catch块中还要用
    var messageResult = await db.collection('message').where(
      db.command.or(
        { senderId: db.command.eq(userId) }, 
        { receiverId: db.command.eq(userId) }
      )
    ).orderBy('time', 'desc').get()
    console.log(messageResult)
  } catch (err) {
    console.log(err)
    return util.makeResponse(400, 'query messages fail')
  }
  
  // 构造用户列表
  try {
    var userIdList = []
    for (let record of messageResult.data) {
      let other = (record.senderId == userId) ?　record.receiverId : record.senderId
      if (! userIdList.includes(other)) {
        userIdList = userIdList.concat(other)
      }
    }
    console.log(userIdList)
    return util.makeResponse(200, 'ok', { userIdList })
  } catch (err) {
    console.log(err)
    return util.makeResponse(500, 'construct user list fail')
  }
}