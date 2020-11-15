/**
 * API
 *   获取用户加购的所有商品
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 查询数据，一个goodId的列表
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
  try {
    const _ = db.command
    const qres = await db.collection('cart').where({
      userId: _.eq(userId)
    }).get()
    console.log(qres)
    var res = []
    for (let i = 0; i < qres.data.length; i++) 
      res = res.concat(qres.data[i].goodId)
    console.log(res)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }
}