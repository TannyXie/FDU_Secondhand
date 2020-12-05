function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  
  // var date = new Date(number).getFullYear();
  returnArr.push(new Date(number).getFullYear());
  returnArr.push(formatNumber(new Date(number).getMonth() + 1));
  returnArr.push(formatNumber(new Date(number).getDate()));
  
  returnArr.push(formatNumber(new Date(number).getHours()));
  returnArr.push(formatNumber(new Date(number).getMinutes()));
  returnArr.push(formatNumber(new Date(number).getSeconds()));
  
  for (var i in returnArr) {
  format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
  }
  
  module.exports = {
  formatTime: formatTime,
  // formatTimeTwo: formatTimeTwo 
  }