/**
 * API：
 *   根据搜索内容正则查询商品
 * 传入参数：
 * - intro 搜索内容
 * - sortType 排序根据
 * - sortOrder 排序顺序
 * 返回参数：
 * - tag 商品类型
 * - commentList 评论
 * - coverMiddle 图片url(格式为/images/goods/xx.jpg)
 * - date 发布日期
 * - desc:商品描述
 * - intro 商品名称
 * - nums 收藏数
 * - price 价格
 * - tag 类别
 * - name 卖家用户名
 * 返回说明：
 * - statusCode 状态码 成功时为200
 * - statusMsg 状态信息
 * - data 返回的数据，一个JS对象列表
 */

const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // if(event.sortType!="default"){
  //   st=event.sortType
  //   so=event.sortOrder=="desc"?-1:1
  //   console.log(st,so)
  // }
  // else{
  //   st="date"
  //   so=-1
  // }
  raw_data = db.collection('second-hand-good').aggregate()
  .match({
    intro:{
      $regex:".*"+event.intro+".*",
      $options:'i'
    },
    sold:false
  })
  .lookup({
    from: "user",
    localField: "sellerId",
    foreignField: "_id",
    as: "seller"
  })
  .project({
    commentList:1,
    coverMiddle:1,
    date:1,
    desc:1,
    intro:1,
    nums:1,
    price:1,
    tag:1,   
    name:"$seller.name"
  })
  .unwind('$name')
  if(event.sortType=="nums"){
    if(event.sortOrder=="desc"){
      raw_data=raw_data.sort({nums:-1})
    }
    else{
      raw_data=raw_data.sort({nums:1})
    }
  }
  else if(event.sortType=="price"){
    if(event.sortOrder=="desc"){
      raw_data=raw_data.sort({price:-1})
    }
    else{
      raw_data=raw_data.sort({price:1})
    }
  }
  return await raw_data.end()
  .then((res) => {
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: res
    }
  })
  .catch((err) => {
    return {
      statusCode: 400,
      statusMsg: err
    }
  })
}