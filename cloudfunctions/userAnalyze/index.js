/**
 * API
 *   通过用户ID获取用户发布商品已/售出数，发布商品总收藏数
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 
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
        openid: _.eq(openid)
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
    const $ = db.command.aggregate
    const tmp = await db.collection('second-hand-good').aggregate()
    .match({
      sellerId: userId
    })
    .sort({
      date: -1
    })
    .group({
      _id: '$sold',
      count: $.sum(1),
      nums: $.sum('$nums')
    })
    .end()
    res={'unsold':null,'sold':null,'nums':null}
    res['unsold']=tmp.list[0].count
    res['sold']=tmp.list[1].count
    res['nums']=tmp.list[0].nums+tmp.list[1].nums
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