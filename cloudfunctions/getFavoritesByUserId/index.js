/**
 * API
 *   获取用户收藏的所有商品
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
const _ = db.command

exports.main = async (event, context) => {
  const userId = event.userId ? event.userId : cloud.getWXContext().OPENID
  if (userId == null) {
    return {
      statusCode: 400,
      statusMsg: 'can not get userid'
    }
  }

  try {
    const queryResult = await db.collection('favorite').where({
      userId: _.eq(userId)
    }).get()
    console.log(queryResult)
    
    var goodList = []
    for (let i = 0; i < queryResult.data.length; i++) {
      let good = await db.collection('second-hand-good').doc(queryResult.data[i].goodId).get()
      goodList = goodList.concat(good.data)
    }
    console.log(goodList)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: goodList
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }
}