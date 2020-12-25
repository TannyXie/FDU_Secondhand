/**
 * API
 *   添加一条订单记录
 * 参数
 *   userId （可选）买家ID；若不填则默认为当前用户
 *   goodId  商品ID（在对应的商品类中包含商品信息和卖家ID）
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据，包含订单ID
 */


const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const util = require('./util.js')

exports.main = async (event, context) => {
  // 打印调用方输入参数
  console.log(event)

  // 如果userId为空，默认填为当前用户
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: db.command.eq(cloud.getWXContext().OPENID)
      }).get()
      console.log(userResult)
      if (userId == null) throw 'openid may not exist'
      userId = userResult.data[0]._id
    } catch (err) {
      console.log(err)
      return util.makeResponse(500, 'can not get userid')
    }
  }

  // goodId不可为空
  const goodId = event.goodId
  if (goodId == null) return util.makeResponse(400, 'good id cannot be null')

  // (userId, goodId)必须唯一，不可重复添加订单
  try {
    const checkResult = await db.collection('order').where({
      userId: db.command.eq(userId),
      goodId: db.command.eq(goodId),
    }).get()
    console.log(checkResult)
    if (checkResult.data.length > 0) return util.makeResponse(400, 'order already exists')
  } catch (err) {
    console.log(err)
    return util.makeResponse(500, 'check order fail')
  }

  //验证goodId存在，不可购买不存在的商品
  //验证goodId的sold为false，不能买已经出售的商品
  //验证goodId的sellerId不为userId，不可购买自己的商品
  try {
    const checkResult = await db.collection('second-hand-good').where({
      _id: db.command.eq(goodId),
    }).get()
    console.log(checkResult.data)
    if (checkResult.data.length == 0) return util.makeResponse(400, 'good does not exit')
    if (checkResult.data[0].sold==true) return util.makeResponse(400, 'good is already sold')
    if(checkResult.data[0].sellerId==userId) return util.makeResponse(400,'can not buy your good')
  } catch (err) {
    console.log(err)
    return util.makeResponse(500, 'check goods fail')
  }

  // 添加订单
  try {
    const addResult = await db.collection('order').add({
      data: {
        userId: userId,
        goodId: goodId,
        buyerCheck: false,
        sellerCheck: false,
        createTime: new Date().getTime(),
        finishTime: null
      }
    })
    console.log(addResult)
    return util.makeResponse(200, 'add order ok', { orderId: addResult._id })
  } catch (err) {
    console.log(err)
    return util.makeResponse(500, 'add order fail')
  }
}