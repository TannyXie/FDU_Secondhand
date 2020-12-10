/**
 * API:
 *   创建新用户
 * 参数说明：
 *   name 微信昵称
 *   avatarUrl 头像URL
 *   gender 性别 0未知 1男 2女
 */

const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  const name = event.name
  // const avatarUrl = event.avatarUrl
  const gender = event.gender

  try {
    res = await db.collection('user').add({
      data: {
        openid: openid,
        name: name,
        avatarUrl: "cloud://dev-7gam9jnrd4ee6910.6465-dev-7gam9jnrd4ee6910-1303912949/profile/default.jpg",
        gender: gender,
        authorized: false,
        mail: ""
      }
    })
    console.log(res)
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