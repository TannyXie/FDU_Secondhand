/**
 * API
 *   checkFavoriteByUserIdAndGoodId 判断用户是否收藏某商品
 * 参数
 *   userId （可选）用户ID，若不填则默认为当前用户
 *   goodId  商品ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 包含一个flag字段
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var userId = event.userId
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
        statusMsg: 'can not get user id'
      }
    }
  }

  var goodId = event.goodId
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'goodId can not be null'
    }
  }

  try {
    const checkResult = await db.collection('favorite').where({
      userId: userId,
      goodId: goodId
    }).get()
    console.log(checkResult)
    return {
      statusCode: 200,
      statusMsg: 'check ok' + (checkResult.data.length > 1 ?  ' WARNING: multiple records are not allowed' : ''),
      data: {
        flag: checkResult.data.length > 0
      }
    }
  
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      statusMsg: 'check fail',
    }
  }


}