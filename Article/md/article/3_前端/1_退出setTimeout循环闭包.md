<!--##
{
        "description": "退出setTimeout循环闭包",
        "tag": [
            "JavaScript"
        ],
        "img":"",
        "dateYY": "2023",
        "dateMM": "06",
        "dateDD": "06",
        "top": true,
        "signal":""
    }
 ##-->

> 本文章仅作为笔记记录

使用一个定时执行的回调函数，需要当条件`num` 等于5时退出当前循环。

但是，在当前的代码中，使用 `return` 、 `break` 语句是无法直接退出 for 循环的，因为 `break` 语句只能用于循环语句中，而不是定时器的回调函数中。

```javascript
let numtime = 10;
let num = 0
for (let y = 0; y < numtime; y++) {
    (function (j) {
        setTimeout(function timer() {
            num++
            console.log("第", j, "秒");
            console.log(num, "num");
            if (num == 5) {
                console.log("现在num等于5了，我想要退出当前", num);
                // return;
                // break;
            }
        }, j * 1000);
    })(y);
}
```

结果将是这样，条件num等于5还是会继续往下执行：

![Untitled](https://picserver.duoyu.link/picfile/image/202306/09-1686325602619.png)

要解决这个问题，可以将循环和定时器分开处理。可以使用一个变量来表示是否继续执行定时器，并在达到特定条件时修改该变量的值，从而实现退出定时器的效果。

```javascript
let numtime = 10;
let num = 0;
let continueTimer = true;

for (let y = 0; y < numtime; y++) {
    (function (j) {
        setTimeout(function timer() {
            if (!continueTimer) {
                return;
            }

            num++;
            console.log("第", j, "秒");
            console.log(num, "num");

            if (num === 5) {
                console.log("现在num等于5了，我想要退出当前", num);
                continueTimer = false;
            }
        }, j * 1000);
    })(y);
}
```

![Untitled](https://picserver.duoyu.link/picfile/image/202306/09-1686325724990.png)