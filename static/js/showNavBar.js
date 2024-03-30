// 获取 "nav" 元素
var navElementheader = document.querySelector(".pc-header");

var ToppingElement = document.querySelector(".topping");

// 点击按钮时将页面置顶
function scrollToTop() {
  window.scrollTo(0, 0);
}

var getwindowWidth = "200";
var getwindowHeight = "200";

// 获取页面大小并打印
function printPageSize() {
  var windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  getwindowWidth = windowWidth;
  getwindowHeight = windowHeight;
  //   console.log("页面宽度：" + getwindowWidth + "px");
  //   console.log("页面高度：" + getwindowHeight + "px");
  if (getwindowWidth > 767.98) {
    navElementheader.style.display = "block";
  } else {
    navElementheader.style.display = "none";
  }
}

// 页面初始化时获取页面大小
window.addEventListener("DOMContentLoaded", function () {
  printPageSize();
});

// 监听窗口大小改变事件
window.addEventListener("resize", function () {
  printPageSize();
});

// 记录上一次滚动位置的变量
var lastScrollY = 0;

// 监听滚动事件
window.addEventListener("scroll", function () {
  // 获取页面滚动的垂直距离
  var currentScrollY = window.scrollY || window.pageYOffset;

  // 返回顶部按钮
  // 如果滚动距离大于等于 400 像素，显示 "回到顶部" 元素
  if (currentScrollY >= 400 && ToppingElement) {
    ToppingElement.style.display = "block";
  } else {
    ToppingElement.style.display = "none";
  }

  // 导航
  // 检测滚动方向并打印
  if (currentScrollY > lastScrollY && currentScrollY >= 200) {
    // console.log(currentScrollY, "向下滑动");
    navElementheader.style.display = "none";
    navElementheader.style.position = "absolute";
  } else if (currentScrollY < lastScrollY && getwindowWidth >= 768) {
    // console.log(currentScrollY, "向上滑动");
    navElementheader.style.display = "block";
    navElementheader.style.position = "fixed";
  } else if (currentScrollY < 200 && getwindowWidth >= 768) {
    navElementheader.style.display = "block";
    navElementheader.style.position = "absolute";
  }

  // 更新上一次滚动位置的值
  lastScrollY = currentScrollY;
});
