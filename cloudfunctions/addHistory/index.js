/**
 * API
 *   添加用户的一条浏览记录
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 *   goodId 商品ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

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
  const goodId = event.goodId
  if (goodId == null) {
    return {
      statusCode: 400,
      statusMsg: 'good id cannot be null'
    }
  }
  try {
    date=new Date()
    time=Date.parse(date)
    console.log("当前时间戳: ",time)
    begin_time=(new Date().setHours(0,0,0,0)-8*60*60*1000)
    console.log("当天第一个时间戳：",begin_time)
    checkResult = await db.collection('history').where({
      userId: _.eq(userId),
      goodId: _.eq(goodId),
      time: _.gte(begin_time)
    }).get()
    // console.log(checkResult.data.length)
    if (checkResult.data.length == 0) {
      const res = await db.collection('history').add({
        data: {
          userId: userId,
          goodId: goodId,
          time:time
        }
      })
      console.log(res)
    } else {
      db.collection('history').where({
        userId: _.eq(userId),
        goodId: _.eq(goodId),
        time: _.gte(begin_time)
      }).update({
        data:{
          time:time
        }
      })
    }
    return {
      statusCode: 200,
      statusMsg: 'ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'add history fail'
    }
  }
}