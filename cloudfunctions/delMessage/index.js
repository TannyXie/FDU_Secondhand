/**
 * API
 *   删除一条消息记录
 * 参数
 *   messageId 消息ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  console.log(event)
  try {
    const res = await db.collection('message').doc(event.messageId).remove()
    console.log(res)
    return {
      statusCode: 200,
      statusMsg: 'delete message ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      statusMsg: 'delete message fail'
    }
  }
 
  
}