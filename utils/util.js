function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}
function getNowFormatDate_2(newDate) {
  var date = new Date();
  date.setTime(newDate * 1000);
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();

  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  var hours = date.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  var seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + hours + seperator2 + minutes +
    seperator2 + seconds;
  return currentdate;
}

function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

function tounicode(data) {//汉子转化为unicode
  if (data == '') return '请输入汉字';
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += "\\u" + parseInt(data[i].charCodeAt(0), 10).toString(16);
  }
  return str;
}

function cutstr(str, len) {
  var str_length = 0;
  var str_len = 0;
  var str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；
  if (str_length < len) {
    return str;
  }
}

module.exports = {
  formatTime: formatTime,
  getNowFormatDate: getNowFormatDate,
  getNowFormatDate_2: getNowFormatDate_2,
  contains: contains,
  tounicode: tounicode,
  cutstr: cutstr
}