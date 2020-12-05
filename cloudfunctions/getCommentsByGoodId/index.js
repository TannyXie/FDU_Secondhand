/**
 * API
 *   获取商品底下的所有评论
 * 参数
 *   goodId 商品ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 评论数据
 */

 
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


exports.main = async (event, context) => {
  // 参数检查
  const goodId = event.goodId
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'good id cannot be null'
    }
  }

  // 数据库操作
  try {
    const queryResult = await db.collection('comment').where({
      goodId: db.command.eq(goodId)
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