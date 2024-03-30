// time 时间格式2020-02-20
// upto 布尔值，判断是否需要到月以后
// tip 提示词字符串
function cycleDate(time, upto, tip) {
  tip = tip === undefined ? "" : tip;
  let times = new Date(time).getTime(); // time为时间戳
  let delta = (new Date().getTime() - times) / 1000;

  let minute = Math.round(Number(delta / 60)); // 分钟
  let hour = Math.round(Number(delta / (60 * 60))); // 小时
  let day = Math.round(Number(delta / (60 * 60 * 24))); // 天
  let week = Math.round(Number(delta / (60 * 60 * 24 * 7))); // 星期
  let month = Math.round(Number(delta / (60 * 60 * 24 * 30))); // 月
  let year = Number(delta / (60 * 60 * 24 * 365)); // 年
  var decimal = Number(year.toString().match(/\d+\.(\d){1}/g)[0]); //年/月
  // console.log(minute, "分钟", hour, "小时", day, "天", week, "星期", month, "月", year, "年", decimal, "年");

  if (minute <= 59) {
    return minute + "分钟" + tip;
  } else if (hour <= 23 && minute > 59) {
    return hour + "小时" + tip;
  } else if (day <= 6 && hour > 23) {
    return day + "天" + tip;
  } else if (week <= 4 && day > 6) {
    return week + "个星期" + tip;
  } else if (month <= 11 && week > 4 && upto != true) {
    return month + "个月" + tip;
  } else if (year > 1 && month > 11 && upto != true) {
    return decimal + "年" + tip;
  } else {
    return time;
  }
}

// 文章日期
let Publicationtime = document.querySelectorAll(".publication-time");
Publicationtime.forEach((item, index) => {
  item.innerText = cycleDate(item.innerText, true, "前");
});

// 最后更新时间
let renew = document.getElementById("blog-renew");
renew.innerText = cycleDate(renew.innerText, false, "前");

// 运行时间
let runstime = document.querySelector("#blog-runtime");
runstime.innerText = cycleDate("2023-04-20");
