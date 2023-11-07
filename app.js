const express = require("express");
const { router } = require("./router");
const app = express();

app.use(express.json());
app.use(express.urlencoded());

// 使用静态资源
app.use(express.static("./node_modules/"));
app.use(express.static("./static/images/"));
app.use(express.static("./static/css/"));
app.use(express.static("./static/js/"));
app.use(express.static("./static/seo/"));

// 导入.html结尾的文件，则导入express-art-template
// app.engine(".html", require("express-art-template")); // 不适用渲染压缩的时候

// 渲染压缩
const htmlMinifier = require("html-minifier");
const artTemplate = require("express-art-template");
// 设置自定义渲染引擎
app.engine("html", (filePath, options, callback) => {
  artTemplate(filePath, options, (err, html) => {
    if (err) {
      callback(err);
    } else {
      const minifiedHTML = htmlMinifier.minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      });
      callback(null, minifiedHTML);
    }
  });
});
app.set("view engine", "html"); // 设置视图引擎为自定义的渲染引擎
// 渲染压缩end

app.use(router);
app.set("view cache", true);
app.listen(6060, () => {
  console.log("服务器：http://127.0.0.1:6060");
});
