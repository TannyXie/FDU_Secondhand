/**
 * API
 *   卖家确认订单
 * 参数
 *   sellerId  可选，若不填则默认为当前用户ID
 *   orderId   订单ID
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
  // 获取用户ID
  let sellerId = event.sellerId
  if (sellerId == null) {
    try {
      const userResult = await db.collection('user').where({
        openid: db.command.eq(cloud.getWXContext().OPENID)
      }).get()
      console.log(userResult)
      sellerId = userResult.data[0]._id
      if (sellerId == null) throw 'openid may not exist'
    } catch (err) {
      console.log(err)
      return makeResponse(500, 'can not get user id')
    }
  }

  // 检查 orderId 是否非空
  let orderId = event.orderId
  if (orderId == null) {
    return makeResponse(400, 'orderId cannot be null')
  }

  try {
    // 检查 order 是否存在
    const orderResult = await db.collection('order').doc(orderId).get()
    console.log(orderResult)
    if (orderResult.data == null) {
      return makeResponse(400, 'order does not exist')
    }

    // 检查 order 的卖家是否正确
    const goodResult = await db.collection('second-hand-good').doc(orderResult.data.goodId).get()
    console.log(goodResult)
    if (sellerId != goodResult.data.sellerId) {
      return makeResponse(400, 'wrong seller for this good')
    }

    // 设置 flag
    const setFlagResult = await db.collection('order').doc(orderId).update({
      data: {
        sellerCheck: db.command.set(true)
      }
    })
    console.log(setFlagResult)
    
    if (orderResult.data.buyerCheck) {
      const callResult = await cloud.callFunction({
        name: 'completeOrder',
        data: { orderId }
      })
      console.log(callResult)
      return makeResponse(200, 'seller checked, order completed')
    } else {
      return makeResponse(201, 'seller checked, buyer has not checked')
    }
     
  } catch (err) {
    console.log(err)
    return makeResponse(500, 'unknown error')
  }
  
}