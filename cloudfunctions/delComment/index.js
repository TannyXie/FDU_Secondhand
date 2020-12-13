/**
 * API
 *   删除评论
 * 参数
 *   commentId   评论ID
 * 返回
 *   statusCode  状态码
 *   statusMsg   状态信息
 */


const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

function makeResponse(code, msg, data) {
  let obj = {}
  obj.statusCode = code
  obj.statusMsg = msg
  if (data) obj.data = data
  return obj
}

exports.main = async (event, context) => {
  console.log(event)
  try {
    if (event.commentId == null) 
      return makeResponse(400, 'comment id cannot be null')
    const res = await db.collection('comment').doc(event.commentId).remove()
    console.log(res)
    return {
      statusCode: 200,
      statusMsg: 'del ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'del fail'
    }
  }
}