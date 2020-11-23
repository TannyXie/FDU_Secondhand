/**
 * API
 *   通过用户ID获取用户发布的所有商品信息
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 商品信息(添加了一个sold字段标识是否售出)
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const userId = event.userId ? event.userId : cloud.getWXContext().OPENID
  if (userId == null) {
    return {
      statusCode: 400,
      statusMsg: 'can not get userid'
    }
  }
  // const wxContext = cloud.getWXContext()
  try {
    const _ = db.command
    const res = await db.collection('second-hand-good')
    .where({
      sellerId: _.eq(userId)
    })
    .orderBy('date','desc')
    .get()
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