// 开启加载
function loading() {
  // console.log("开启");
  document.getElementById("loading-box").style.display = "block";
}

// 关闭加载
function loadingclose() {
  // console.log("关闭");
  // lockScroll(); // 锁定滚动条
  document.getElementById("loading-box").style.animation = "hideback 0.5s";
  setTimeout(function () {
    document.getElementById("loading-box").style.display = "none";
  }, 500);
  // unlockScroll();
}

// 浏览器已完全加载 HTML，并构建了 DOM 树
// DOMContentLoaded —— 浏览器已完全加载 HTML，并构建了 DOM 树，但像 <img> 和样式表之类的外部资源可能尚未加载完成。
// load —— 浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等。
document.addEventListener("DOMContentLoaded", function () {
  // console.log("浏览器已完全加载 HTML，并构建了 DOM 树");
  loadingclose();
});
