/**
 * API
 *   获取用户的浏览历史
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 查询数据，每一项是good内容和浏览记录时间time
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  // 打印参数
  console.log(event)

  var userId = event.userId;
  if (userId == null) {
    try {
      const userResult = await db.collection('user').where({
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
    const historyResult = await db.collection('history').where({
      userId: db.command.eq(userId)
    }).orderBy('time','desc').get()
    console.log(historyResult)

    var goodList = []
    for (let record of historyResult.data) {
      let goodResult = await db.collection('second-hand-good').where({
        _id: db.command.eq(record.goodId)
      }).get()
      console.log(goodResult)
      if (goodResult.data.length > 0) {
        goodList = goodList.concat({
          historyId: record._id,
          goodInfo: goodResult.data[0],
          time: record.time
        })
      }
    }
    console.log(goodList)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: goodList
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }
}