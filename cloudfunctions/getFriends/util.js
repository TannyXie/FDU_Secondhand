function makeResponse(code, msg, data) {
  let obj = {}
  obj.statusCode = code
  obj.statusMsg = msg
  if (data) obj.data = data
  return obj
}

module.exports.makeResponse = makeResponse