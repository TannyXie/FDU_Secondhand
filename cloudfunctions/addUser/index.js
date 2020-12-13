/**
 * API:
 *   添加一条用户记录
 * 参数说明：
 *   name   名字
 *   picId  头像在云存储中的ID
 *   gender 性别： 0未知 1男 2女
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  const name = event.name
  const picId = event.picId || "cloud://dev-7gam9jnrd4ee6910.6465-dev-7gam9jnrd4ee6910-1303912949/profile/default.jpg"
  const gender = event.gender

  try {
    const addUserResult = await db.collection('user').add({
      data: {
        openid: openid,
        name: name,
        picId: picId,
        gender: gender,
        authorized: false,
        mail: null
      }
    })
    console.log(addUserResult)
    return {
      statusCode: 200,
      statusMsg: 'add user ok'
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      statusMsg: 'add user fail'
    }
  }
    
  

}