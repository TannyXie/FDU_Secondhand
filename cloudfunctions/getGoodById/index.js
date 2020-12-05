/**
 * API
 *   通过商品ID获取商品信息
 * 参数
 *   goodId 商品ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 商品信息
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  try {
    
    const res = await db.collection('second-hand-good').doc(event.goodId).get()
    console.log(res)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res.data
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }
}