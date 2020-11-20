/**
 * API
 *   获取商品底下的所有评论
 * 参数
 *   goodId 商品ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 评论数据
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // 参数检查
  const goodId = event.goodId
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'good id cannot be null'
    }
  }

  // 数据库操作
  try {
    const result = await db.collection('comment').where({
      goodId: _.eq(goodId)
    }).get()
    console.log(result)
    return {
      statusCode: 200,
      statusMsg: 'get comments ok',
      data: result.data 
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'get comments fail'
    }
  }
}