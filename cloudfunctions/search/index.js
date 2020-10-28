const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return await db.collection('second-hand-good').where({
    intro:{
      $regex:".*"+event.intro+".*",
      $options:'i'
    }
  })
  .orderBy('nums', 'desc')  
  .orderBy('price','asc')
  .orderBy('date','desc')
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