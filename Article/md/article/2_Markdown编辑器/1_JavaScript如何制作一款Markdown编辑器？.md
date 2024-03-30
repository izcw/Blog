<!--##
{
        "description": "如何制作Markdown编辑器？，制作Markdown方法",
        "tag": [
            "JavaScript",
            "Markdown"
        ],
        "img":"https://picserver.duoyu.link/picfile/image/202306/07-1686097408445.png",
        "dateYY": "2023",
        "dateMM": "05",
        "dateDD": "24",
        "top": true,
        "signal":""
    }
 ##-->

![Markdown](https://picserver.duoyu.link/picfile/image/202306/07-1686097408445.png)

---

### 实现Markdown编辑器有两种，一种是带编辑框的渲染，一种是所见即所得的实时渲染

#### 1.带编辑框的渲染

带编辑框，即有两个视图，一个是输入框视图，一个是预览视图。类似于这样：
![Markdown](https://picserver.duoyu.link/picfile/image/202306/07-1686097574395.png)

#### 2.所见即所得的实时渲染

实时渲染比较典型的例子是Notion，和Typora，边输入边渲染，例如在前面输入三个井号加空格就是三级标题，输入四个就是四级标题“### 文本”，即可实时预览。类似于这样：
![Markdown](https://picserver.duoyu.link/picfile/image/202306/07-1686097616884.png)

---

### 第一种的实现方法（带编辑框的渲染）

这种比较简单，可以利用插件[marked](https://github.com/markedjs/marked)，将md格式的内容转成HTML

- 编辑视图：可以使用textarea制作一个简单的编辑器，甚至input都可以，只要md格式不乱，或者直接通过读取.md文件的方式获得md格式的文本。然后使用[marked](https://github.com/markedjs/marked)转换成HTML格式。

- 预览视图：前面已经利用插件将md格式内容转换为HTML格式内容了，直接在浏览器就能看到效果。

---

### 第二种的实现方法（所见即所得）

这里提到一个contenteditable属性，contenteditable是浏览器Dom的一个原生属性，值为true时表示该元素变为可编辑状态。因此原生就直接支持很多内容编辑操作，包括光标位移、内容选择的行为、键盘事件（如方向键控制光标）等等。

demo

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Markdown</title>
</head>
<style>
    html,
    body {
        width: 100%;
        height: 100%;
        background-color: #eeeeee;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .Editor {
        padding: 1rem;
        width: 600px;
        height: 800px;
        background-color: #fff;
    }
</style>

<body>
    <div class="Editor" contenteditable="true" spellcheck="true">
        <p>hello</p>
        <h1>hello</h1>
    </div>
</body>

</html>

```

![contenteditable](https://picserver.duoyu.link/picfile/image/202306/07-1686097644509.png)

当输入内容时会自动创建一个div将当前输入的内容包裹。换行则会创建`<div><br></div>`。
所以我们可以利用这个规则，监听输入的变化，然后通过获取innerHTMl去获取生成的内容，比如输入一个三级标题“### 我是三级标题”，它会自动创建为这样：`<div>### 我是三级标题<br></div>`，再利用正则匹配### 去解析生成`<h3>### 我是三级标题<br></h3>`

</br>

当然这只是我的初步尝试，我还是一名小白，通过这篇文章记录一下我的思路，如有更好的办法，可以评论区留言。会继续追更！
