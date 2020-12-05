/**
 * API
 *   获取两个用户的消息记录
 * 参数
 *   thisUserId     其一用户ID，若不填则默认为当前用户
 *   anotherUserId  另一用户ID，必须声明
 * 返回
 *   statusCode     状态码
 *   statusMsg      状态信息
 *   data           按照时间顺序排列的消息列表
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
    // 若未声明其一用户ID，则默认为当前用户
    var thisUserId = event.thisUserId
    if (thisUserId == null) {
      try {
        const userResult = await db.collection('user').where({
          openid: db.command.eq(cloud.getWXContext().OPENID)
        }).get()
        console.log(userResult)
        thisUserId = userResult.data[0]._id
        if (thisUserId == null) throw 'openid may not exist'
      } catch (err) {
        console.log(err)
        return {
          statusCode: 500,
          statusMsg: 'can not get user id'
        }
      }
    }
 
    // 另一用户ID不得为空
    const anotherUserId = event.anotherUserId
    if (anotherUserId == null) {
      return {
        statusCode: 400,
        statusMsg: 'anotherUserId can not be null'
      }
    }

    try {
      const queryResult = await db.collection('message').where(
        db.command.or(db.command.and({
          senderId: thisUserId,
          receiverId: anotherUserId
        }), db.command.and({
          senderId: anotherUserId,
          receiverId: thisUserId
        }))
      ).orderBy('time', 'asc').get()
      console.log(queryResult)
  
      return {
        statusCode: 200,
        statusMsg: 'get messages ok',
        data: queryResult.data
      }

    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        statusMsg: 'get messages fail'
      }
    }
  
}