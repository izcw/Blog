// 判断主题
var htmlbox = document.querySelector("html");
function changetheme() {
  if (localStorage.getItem("theme") === "true") {
    htmlbox.classList.add("dark");
    document
      .querySelectorAll(".toggle")
      .forEach((item, index) => (item.src = `/icon/thesun${index}.png`));
  } else {
    htmlbox.classList.remove("dark");
    document
      .querySelectorAll(".toggle")
      .forEach((item, index) => (item.src = `/icon/moon${index}.png`));
  }
}
changetheme();

// 切换主题
function toggleTheme() {
  if (localStorage.getItem("theme") === "true") {
    localStorage.setItem("theme", "false");
    changetheme();
  } else {
    localStorage.setItem("theme", "true");
    changetheme();
  }
}
