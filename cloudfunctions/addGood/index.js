/**
 * API：
 *   添加一件商品
 * 传入参数：
 *   coverMiddle 图片url
 *   desc 商品描述
 *   intro 商品名
 *   price 商品价格
 *   sellerId 作为卖家的用户ID
 *   tag 商品类别
 * 返回说明：
 *   statusCode 状态码 成功时为200
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

function getRandomString(){
  let str="abcdefghijklmnopqrstuvwxyz0123456789"
  let code=""
  for(let i=0;i<32;i++){
      let number=Math.random()%36
      code+=str.charAt(number)
  }
  return code;
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let _date=new Date()
  return await db.collection('second-hand-good').add({
    data: {
      // id:_id,
      commentList:[],
      coverMiddle: /*"/images/goods/" +*/ event.coverMiddle,
      date:_date,
      desc:event.desc,
      intro:event.intro,
      nums:0,
      price:event.price,
      sellerId:event.sellerId,
      tag:event.tag
    }
  }).then((res) => {
    return {
      statusCode: 200,
      statusMsg: 'ok'
    }
  }).catch((err) => {
    return {
      statusCode: 500,
      statusMsg: err
    }
  })
}