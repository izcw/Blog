<!--##
{
        "description": "原生js页面事件",
        "tag": [
            "JavaScript",
            "页面事件"
        ],
        "img":"",
        "dateYY": "2023",
        "dateMM": "07",
        "dateDD": "28",
        "top": true,
        "signal":""
    }
 ##-->

#### DOMContentLoaded事件


DOMContentLoaded页面的DOM树解析好并且需要等待JS执行完才触发，事件不直接等待CSS文件、图片的加载完成


事件会在文档的HTML和所有子资源（如图像和样式表）已经加载完成后触发，但不包括像CSS、图片等外部资源的加载。您可以将您的JavaScript代码包装在DOMContentLoaded事件中，以确保它们在文档完全解析后执行。

```javascript
document.addEventListener("DOMContentLoaded", function () {
  console.log("当前 HTML 被完全加载以及解析完成");
});
```

---

#### window.onload方法


window.onload() 方法用于在网页加载完毕后立刻执行的操作，即当 HTML 文档加载完毕后，立刻执行某个方法。


通常用于 <br /> 元素，在页面完全载入后(包括图片、css文件等等)执行脚本代码。

```javascript
window.onload = function() {
  console.log("页面全部加载完成");
};
```

window.unload 表示卸载的意思，这个事件在从当前浏览器窗口内移动文档的位置时触发。
<br />
也就是说，通过超链接、前进或后退按钮等方式从一个页面跳转到其他页面，或者关闭浏览器窗口时触发。

---

#### beforeunload事件


beforeunload事件类型与unload事件类型功能相似，不过它更人性化，如果beforunload事件处理函数返回字符串信息，那么该字符串会显示一个确认对话框，询问用户是否离开当前页面。

```javascript
window.onbeforeunload = function(e){
 return "您的数据还未保存！";
}
```
