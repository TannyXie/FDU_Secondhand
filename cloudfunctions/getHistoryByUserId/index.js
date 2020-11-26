/**
 * API
 *   获取用户的浏览历史
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 查询数据，每一项是good内容和浏览记录时间time
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const time = require('./util.js')

exports.main = async (event, context) => {
  const userId = event.userId ? event.userId : cloud.getWXContext().OPENID
  if (userId == null) {
    return {
      statusCode: 400,
      statusMsg: 'can not get userid'
    }
  }

  try {
    const goodsId = await db.collection('history').where({
      userId: _.eq(userId)
    })
    .orderBy('time','desc').get()
    console.log(goodsId)
    var goodList = []
    for (let i = 0; i < goodsId.data.length; i++) {
      let good = await db.collection('second-hand-good').doc(goodsId.data[i].goodId).get()
      let _time = time.formatTime(goodsId.data[i].time,'Y/M/D h:m:s')
      // goodsId.data[i].time=_time
      good.time=_time
      goodList = goodList.concat(good)
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