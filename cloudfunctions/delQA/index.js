/**
 * API
 *   删除一对Q&A
 * 参数
 *   QAId Q&A的ID
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = db.collection('autoreply').doc(event.QAId).remove()
    console.log(res)
    return {
      statusCode:200,
      statusMsg: 'delete q&a ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'delete q&a fail'
    }
  }
 
  
}