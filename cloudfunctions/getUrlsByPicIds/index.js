/**
 * API:
 *   根据picId获取图片url
 * 参数：
 *   picIdList 一个picId列表
 * 返回：
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 返回数据，包括urlList字段，是一个url的列表
 */

const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  try {
    const res = await cloud.getTempFileURL({
      fileList: event.picIdList
    })
    console.log(res)
    var urlList = []
    res.fileList.forEach((f) => { 
      urlList = urlList.concat(f.tempFileURL)
    })
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: {
        urlList: urlList
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      statusMsg: 'fail',
    }
  }
}