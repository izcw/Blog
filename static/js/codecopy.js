// 代码复制
var inputcopy = document.createElement("input");
inputcopy.setAttribute("type", "text");
inputcopy.setAttribute("id", "copyValtxt");
inputcopy.style.opacity = "0";
document.getElementById("DoEditor").appendChild(inputcopy);

let precode = document.querySelectorAll("pre");
precode.forEach((item, index) => {
  let itemcode = item.querySelector("code").getAttribute("class"); // 语言
  let langua = itemcode.match(/(?<=language-).+/gi)[0];
  var codelanguage = document.createElement("span");
  codelanguage.className = "codelanguage";
  codelanguage.innerHTML = langua;
  item.appendChild(codelanguage);

  var buttoncopy = document.createElement("button"); // code按钮
  buttoncopy.className = "copycode";
  buttoncopy.innerHTML = "Copy";
  buttoncopy.onclick = function () {
    copyCode(this);
  };
  item.appendChild(buttoncopy);
});

function copyCode(e) {
  e.innerText = "复制成功";
  setTimeout(() => {
    e.innerText = "Copy";
  }, 500);
  let copyval = document.getElementById("copyValtxt");
  copyval.value = e.parentNode.children[0].innerText;
  copyval.select();
  document.execCommand("copy");
}
