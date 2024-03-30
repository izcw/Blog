// 模态框
var greydiv = document.getElementById("greydiv");
greydiv.innerHTML = `
<div class="posidiv">
    <ul class="closeicon">
        <li onclick="closediv()" class="closeitem"><img src="/icon/close.png" alt="关闭" title="关闭"></li>
    </ul>
    <div id="closediv"></div>
    <div id="posidiv-box"></div>
</div>
`;

var posidivbox = document.getElementById("posidiv-box"); // 内容框
document.getElementById("closediv").onclick = function () {
  closediv();
};

// 关闭模态框
function closediv() {
  greydiv.style.animation = "closediv 0.5s";
  setTimeout(function () {
    unlockScroll();
    greydiv.style.display = "none";
    greydiv.style.animation = "themecolor 0.5s";
    document.querySelector(".download-img").remove();
  }, 500);
}

// 查看图片
document.querySelectorAll(".imgEnlarge p img").forEach((item) => {
  let arcimg = item.src;
  item.onclick = function () {
    imgEnlarge(arcimg);
  };
});

// 打赏
function Reward() {
  lockScroll();
  greydiv.style.display = "block";

  posidivbox.innerHTML = `
    <div id="contentdiv">
      <div class="reward-box">
        <p>如果本博客对您有所帮助，可以请作者吃糖^_^</p>
        <img src="/Reward.png" width="85%" alt="打赏">
      </div>
    </div>`;
}

function imgEnlarge(arcimg) {
  lockScroll();
  greydiv.style.display = "block";
  posidivbox.innerHTML = `<img src="${arcimg}" class="imgEnlarge-contentdiv">`;

  // 下载按钮
  let closeiconbox = document.querySelector(".closeitem");
  let downloadDIV = document.createElement("li");
  downloadDIV.className = "download-img";
  downloadDIV.innerHTML = `<a href="${arcimg}" download="zhangchengwei.work.jpg"><img src="/icon/download-img.png" alt="下载" title="下载"></a>`;
  closeiconbox.parentNode.insertBefore(downloadDIV, closeiconbox);
}

// 打开搜索
function Find() {
  document.querySelector(".blog-searchbox").style.display = "block";

  let input = document.getElementById("searchinput");
  input.focus();

  input.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      document.getElementById("myBtn").click();
    }
  });
  lockScroll();
}

// ctrl+f
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.keyCode === 65) {
    Find();
  }
});
const oDiv = document.getElementById("searchbox").innerHTML;
// 搜索
function getsearch() {
  document.getElementById("searchbox").innerHTML = oDiv; // 初始化
  let inputtext = document.getElementById("searchinput").value;
  if (inputtext === "" || inputtext === null || inputtext === undefined) {
    document
      .getElementById("searchinput")
      .setAttribute("placeholder", "不能为空");
    document.querySelectorAll(".finditem").forEach((item) => {
      item.style.display = "block";
    });
  } else {
    findHighlight(inputtext, oDiv);
  }
  document.getElementById("searchinput").focus();
}

// 关闭搜索
function closeFind() {
  unlockScroll();
  document.querySelector(".blog-searchbox").style.display = "none";
}

// 锁定滚动条
function lockScroll() {
  let widthBar = 17,
    root = document.documentElement;
  if (typeof window.innerWidth == "number") {
    widthBar = window.innerWidth - root.clientWidth;
  }
  root.style.overflow = "hidden";
  root.style.borderRight = widthBar + "px solid transparent";
}

// 解锁滚动条
function unlockScroll() {
  let root = document.documentElement;
  root.style.overflow = "";
  root.style.borderRight = "";
}

// 搜索高亮
function findHighlight(searchVal, htmldiv) {
  var sText = htmldiv;
  var reg1 = /<script[^>]*>(.|\n)*<\/script>/gi; //去掉script标签
  sText = sText.replace(reg1, "");
  var bgColor = "#ff9632";
  var num = -1;
  var rStr = new RegExp(searchVal, "gi"); //匹配传入的搜索值不区分大小写 i表示不区分大小写，g表示全局搜索
  var rHtml = new RegExp("<.*?>", "ig"); //匹配html元素
  var aHtml = sText.match(rHtml); //存放html元素的数组
  var arr = sText.match(rStr);
  a = -1;
  sText = sText.replace(rHtml, "{~}"); //替换html标签
  sText = sText.replace(rStr, function () {
    a++;
    return (
      "<span name='addSpan' class='findHighlight' style='padding:0 1px;color:#000; background-color: " +
      bgColor +
      ";'>" +
      arr[a] +
      "</span>"
    );
  }); //替换key
  sText = sText.replace(/{~}/g, function () {
    //恢复html标签
    num++;
    return aHtml[num];
  });
  document.getElementById("searchbox").innerHTML = sText;

  // 显示匹配的内容
  var finditemul = document.querySelectorAll(".finditem");
  finditemul.forEach((item) => {
    if (item.querySelector(".findHighlight") !== null) {
      item.style.display = "block";
      document.querySelector(".notfound").style.display = "none";
    }else{
      document.querySelector(".notfound").style.display = "block";
    }
  });
}

// 文章锁

// 回车事件
function keyup_submit(e) {
  var evt = window.event || e;
  if (evt.keyCode == 13) {
    //回车事件
    confirmclick();
  }
}

// 确认密码
function confirmclick() {
  let passval = document.getElementById("textbox_password");
  if (passval.value == "") {
    passval.setAttribute("placeholder", "不能为空！！！");
  } else {
    let urls = window.location.pathname;
    window.location.href = urls + "?signal=" + passval.value;
    closediv();
  }
}

// 欢迎新朋友
function WelcomeNewFriends() {
  lockScroll();
  greydiv.style.display = "block";

  posidivbox.innerHTML = `
    <div id="Welcomecontentdiv">
      <div class="Welcomereward-box">
      <h2>Hello！您好</h2>
        <p>我是 <span>张成威</span></p>
        <p>欢迎您访问我的个人网站</p>
        <p>初次与您见面，欢迎多多交流</p>
        <div class="hr"></div>
        <p>或者访问我的：</p>
        <a href="/" target="_blank" rel="博客首页" title="博客首页">博客首页</a>
        <a href="https://www.about.zhangchengwei.work" target="_blank" rel="我的主页" title="我的主页">我的主页</a>
        <a href="/message" target="_blank" rel="留言" title="留言">留言</a>
        <a href="/links" target="_blank" rel="友情链接" title="友情链接">友情链接</a>
        <div class="closedivbi">&gt;&gt;&nbsp;开启访问-继续阅读&nbsp;&lt;&lt;</div>
      </div>
    </div>`;
}

var Welcomefriend = localStorage.getItem("Welcomefriend");
if (Welcomefriend == null || Welcomefriend !== 'true') {
  WelcomeNewFriends();
  localStorage.setItem("Welcomefriend", "true");
} else {
  // console.log("不是新人");
}

document.querySelector(".closedivbi").onclick = function () {
  closediv();
};
