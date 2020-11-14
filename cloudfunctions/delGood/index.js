/**
 * API:
 *   下架商品
 * 参数：
 *   goodId 待删除商品的ID
 * 返回：
 *   statusCode 状态码 成功时为200
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  try {
    res = await db.collection('second-hand-good').doc(event.goodId).remove()
    console.log(res)
    return {
      statusCode: 200,
      statusMsg: 'ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail'
    }
  }
}