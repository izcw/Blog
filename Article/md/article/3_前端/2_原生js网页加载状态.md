<!--##
{
        "description": "原生js网页加载状态",
        "tag": [
            "JavaScript",
            "加载"
        ],
        "img":"",
        "dateYY": "2023",
        "dateMM": "07",
        "dateDD": "28",
        "top": true,
        "signal":""
    }
 ##-->

当前文档的加载状态document.readyState

* `uninitialized`（未初始化）还没有调用send()方法
* `loading`（载入）已调用send()方法，正在发送请求
* `loaded`（载入完成）send()方法执行完成，已经接收到全部响应内
* `interactive`（交互）正在解析响应内容
* `completed`（完成）响应内容解析完成，可以在客户端调用了

```javascript
if (document.readyState == "loading") {
  console.log("（载入）已调用send()方法，正在发送请求");
}
```

停止加载

```javascript
window.stop()
```
