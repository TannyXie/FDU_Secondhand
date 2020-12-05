/**
 * API
 *   发布评论
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 *   goodId  商品ID
 *   content 评论内容
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 */


const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


exports.main = async (event, context) => {
  console.log(event)
  // 参数检查
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: db.command.eq(openid)
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
  const goodId = event.goodId
  const content = event.content
  if (goodId == null || content == null) {
    return {
      statusCode: 400,
      statusMsg: 'goodId, content cannot be null'
    }
  }
  
  // 数据库操作
  try {
    const addResult = await db.collection('comment').add({
      data: {
        userId: userId,
        goodId: goodId,
        content: content,
        time: new Date().getTime()
      }
    })
    console.log(addResult)
    return {
      statusCode: 200,
      statusMsg: 'add comment ok',
      data: {
        commentId: addResult._id
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      statusMsg: 'add comment fail'
    }
  }

}