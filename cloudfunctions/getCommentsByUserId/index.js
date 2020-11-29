/**
 * API
 *   获取用户发布的所有评论
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 评论数据
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // 参数检查
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: _.eq(openid)
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

  // 数据库操作
  try {
    const queryResult = await db.collection('comment').where({
      userId: _.eq(userId)
    }).get()
    console.log(queryResult)

    var returnList = []
    for (let comment of queryResult.data) {
      const commentId = comment._id
      const content = comment.content
      const time = comment.time
      const userResult = await db.collection('user').doc(comment.userId).get()
      const goodResult = await db.collection('second-hand-good').doc(comment.goodId).get()
      returnList = returnList.concat({
        commentId: commentId,
        userInfo: userResult.data,
        goodInfo: goodResult.data,
        content: content,
        time: time
      })
    }
    console.log(returnList)
    return {
      statusCode: 200,
      statusMsg: 'get comments ok',
      data: returnList 
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'get comments fail'
    }
  }
}