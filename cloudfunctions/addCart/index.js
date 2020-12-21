/**
 * API
 *   使用户加购某商品
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 *   goodId 商品ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


exports.main = async (event, context) => {
  // const openid = "oFqwP5Ik4q0dt81_AJX8AWkMWHiI"
  
  // 获取用户ID
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      const userResult = await db.collection('user').where({
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
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'good id cannot be null'
    }
  }
  try {
    checkResult = await db.collection('cart').where({
      userId: db.command.eq(userId),
      goodId: db.command.eq(goodId)
    }).get()
    if (checkResult.data.length > 0) return util.makeResponse(400, 'good already exists in the cart')
  } catch (err) {
    console.log(err)
    return util.makeResponse(500, 'check cart fail')
  }
  try {
    const addResult = await db.collection('cart').add({
      data: {
        userId: userId,
        goodId: goodId
      }
    })
    console.log(addResult)
    return util.makeResponse(200, 'add cart ok', { cartId: addResult._id })
  }catch (err) {
    console.log(err)
    return util.makeResponse(500, 'add cart fail')
  }
}