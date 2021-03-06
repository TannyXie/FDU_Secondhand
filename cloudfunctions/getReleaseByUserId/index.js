/**
 * API
 *   通过用户ID获取用户发布的所有商品信息
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 商品信息(sold对应已售出商品list，unsold同理)
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: db.command.eq(openid)
      }).get()
      console.log(userResult)
      userId = userResult.data[0]._id
      if (userId == null) throw 'openid may not exist'
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        statusMsg: 'can not get userid'
      }
    }
  }
  
  try {
    const unsold = await db.collection('second-hand-good').aggregate()
    .match({
      sellerId: userId,
      sold:false
    })
    .sort({
      date: -1
    })
    .end()
    const sold = await db.collection('second-hand-good').aggregate()
    .match({
      sellerId: userId,
      sold:true
    })
    .sort({
      date: -1
    })
    .end()
    res={'unsold':null,'sold':null}
    res['unsold']=unsold
    res['sold']=sold
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