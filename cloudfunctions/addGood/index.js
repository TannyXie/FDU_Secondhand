// 云函数入口文件
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

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let _date=new Date()
    let _id=getRandomString()
    return await db.collection('second-hand-good').add({ //填写自己的数据库名称
      data: {
        id:_id,
        commentList:[],
        coverMiddle:"/images/goods/"+event.coverMiddle,
        date:_date,
        desc:event.desc,
        intro:event.intro,
        nums:0,
        price:event.price,
        sellerId:event.sellerId,
        tag:event.tag
      }
    })
  } catch (e) {
    console.log(e)
    return e;
  }
}