/**
 * API
 *   添加一条消息记录
 * 参数
 *   senderId   发送者ID，若不填则默认为当前用户
 *   receiverId 接收者ID
 *   content    消息内容
 * 返回
 *   statusCode 状态码
 *   statusMsg  状态信息
 *   data       包含messageId
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  // 若未声明发送方ID，则默认为当前用户
  var senderId = event.senderId
  if (senderId == null) {
    try {
      const userResult = await db.collection('user').where({
        openid: db.command.eq(cloud.getWXContext().OPENID)
      }).get()
      console.log(userResult)
      senderId = userResult.data[0]._id
      if (senderId == null) throw 'openid may not exist'
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        statusMsg: 'can not get user id'
      }
    }
  }

  // 接收方ID和消息内容不得为null
  const receiverId = event.receiverId
  const content = event.content
  if (receiverId == null || content == null) {
    return {
      statusCode: 400,
      statusMsg: 'receiverId or content can not be null'
    }
  }

  try {
    const addResult = await db.collection('message').add({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        content: content,
        time: new Date().getTime()
      }
    })
    console.log(addResult)
    return {
      statusCode: 200,
      statusMsg: 'send message ok',
      data: {
        messageId: addResult._id
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      statusMsg: 'send message fail'
    }
  }
}