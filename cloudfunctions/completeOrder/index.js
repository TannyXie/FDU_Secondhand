/**
 * API
 *   完成订单
 * 参数
 *   orderId  订单ID
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
  try {
    // 检查 orderId 非空
    const orderId = event.orderId
    if (orderId == null) {
      return makeResponse(400, 'orderId cannot be null')
    }

    // 检查 order 确实存在
    const orderResult = await db.collection('order').doc(orderId).get() 
    console.log(orderResult)
    if (orderResult.data == null) {
      return makeResponse(400, 'order does not exist')
    }

    // 检查 order 是未完成订单
    if (orderResult.data.finishTime != null) {
      return makeResponse(400, 'order is already finished')
    }

    // 设置 finishTime
    const setFinishResult = await db.collection('order').doc(orderId).update({
      data: {
        finishTime: db.command.set(new Date().getTime())
      }
    })
    console.log(setFinishResult)

    // 确认商品存在
    const goodId = orderResult.data.goodId
    const goodResult = await db.collection('second-hand-good').doc(goodId).get()
    console.log(goodResult)
    if (goodResult.data == null) {
      return makeResponse(400, 'good does not exist')
    }

    // 确认商品还未售出
    if (goodResult.data.sold == true) {
      return makeResponse(400, 'good is already sold')
    }
    
    // 修改商品的 sold 值
    const setSoldResult = await db.collection('second-hand-good').doc(goodId).update({
      data: {
        sold: db.command.set(true)
      }
    })
    console.log(setSoldResult)

    return makeResponse(200, 'complete order ok')

  } catch (err) {
    console.log(err)
    return makeResponse(500, 'unknown error')
  }
}