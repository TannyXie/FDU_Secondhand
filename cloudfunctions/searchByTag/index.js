/**
 * API：
 *   根据商品类型查询商品
 * 参数说明：
 * - tag 商品类型
 * 返回说明：
 * - statusCode 状态码 成功时为200
 * - statusMsg 状态信息
 * - data 返回的数据，一个JS对象列表
 */

const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return await db.collection('second-hand-good').where({
    tag: event.tag
  })
  .orderBy('nums', 'desc')  
  .orderBy('date', 'desc')
  .get()
  .then((res) => {
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res.data
    }
  })
  .catch((err) => {
    return {
      statusCode: 400,
      statusMsg: err
    }
  })
}