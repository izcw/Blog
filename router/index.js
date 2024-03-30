const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const glob = require("glob"); // 查找文件夹
const { pinyin } = require("pinyin-pro"); // 文字转换拼音
const marked = require("marked"); // 解析markdown

const moment = require("moment");
moment.locale("zh-cn");
var timeYY = moment().format("YYYY"); //2022
// var timeMM = moment().format('MM');
// var timeDD = moment().format('DD');

const distPath = "Article/dist/"; // dist 路径

// 初始化
var dataArr = {
  // 当前请求
  current: {
    getnavLink: "/", // url
    getnavName: "首页", // 名称
    reqcolkey: "article", // key
  },
  // 博客信息
  info: {
    author: "张成威",
    title:
      "张成威 的个人网站 | 知不足而奋进，望远山而前行 | 博客 | 网络日志 | 官方网站 | 官网 | Zhang Chengwei's personal website",
    shortTitle: "张成威 - 的个人网站",
    description:
      "张成威的个人网站（zhangchengwei.work），「文章存档」发布我对技术的思考，学习文章、笔记、心得，以及展示我的个人作品及简历等。",
    keywords:
      "张成威,张成威的个人网站,张成威的博客,张成威的官方网站,张成威的网络日志,zhangchengwei,zhangchengwei.work,个人网站,个人博客,官网,博客空间,简历,web前端,编程,开发,互联网,文章,网络日志,技术",
    copyright: "©2022-" + timeYY + " 张成威",
    url: "https://www.zhangchengwei.work",
    rss: "https://www.zhangchengwei.work/rss.xml",
    abouturl: "/article/blog-3",
    contact: [
      {
        name: "github",
        link: "https://github.com/izcw",
        icon1: "/icon/github1.png",
        icon2: "/icon/github01.png",
        text: "Github",
      },
      {
        name: "jike",
        link: "https://okjk.co/fRHvV6",
        icon1: "/icon/jike.png",
        icon2: "/icon/jike01.png",
        text: "即刻",
      },
      {
        name: "bilibili",
        link: "https://b23.tv/oZ1AIXL",
        icon1: "/icon/bilibili.png",
        icon2: "/icon/bilibili01.png",
        text: "bilibili 哔哩哔哩",
      },
      {
        name: "mail",
        link: "mailto:zhangchengwei.work@outlook.com",
        icon1: "/icon/mail1.png",
        icon2: "/icon/mail01.png",
        text: "邮箱",
      },
    ],
  },
};

// 异步读取json文件
const getJSON = function (url, name) {
  const promise = new Promise(function (resolve, reject) {
    // 异步操作：网络请求代码
    fs.readFile(url, (err, data) => {
      if (!err) {
        data = JSON.parse(data);
        resolve({
          status: 200,
          message: url + "查询成功",
          name: name,
          data: data,
        });
      } else {
        reject({
          status: 500,
          message: url + "查询失败",
        });
      }
    });
  });
  return promise;
};

// 全部栏目数据集合
var CacheJsonArr = [
  { name: "links", path: "model/", key: "model" },
  { name: "message", path: "model/", key: "model" },
  { name: "nav", path: "model/", key: "model" },
];

getJSON(distPath + "columnArr.json", "columnArr").then(
  function (data) {
    data.data.forEach((item) => {
      CacheJsonArr.push(item);
    });
    LoopAcquisition(CacheJsonArr);
  },
  function (error) {
    console.log(error);
  }
);

// 循环获取json数据保存到缓存中
/***
 * @param {Object} data 数据
 */
function LoopAcquisition(data) {
  data.forEach((item) => {
    dataArr[item.key] = {};

    getJSON(item.path + item.name + ".json", item.name).then(
      function (data) {
        // 过滤文章是否显示status = true不显示
        let StatusArr = [];
        data.data.datalist.forEach((th) => {
          if (th.status == "true" || th.status == true) {
          } else {
            StatusArr.push(th);
          }
        });
        data.data.datalist = StatusArr;
        //

        dataArr[item.key][data.name] = data.data;
        // console.log(data.status, data.message);
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

// 首页
router.get("/", (req, res) => {
  ReqCurrent(req, "article");
  AcquiRen(req, res, 10, "index");
});

// 归档
router.get("/archives", (req, res) => {
  ReqCurrent(req, "article");
  AcquiRen(req, res, false, "archives");
});

// 读书/观影
router.get("/notesbook", (req, res) => {
  ReqCurrent(req, "notesbook");
  AcquiRen(req, res, 10, "notesbook");
});

// 光影集
router.get("/camera", (req, res) => {
  ReqCurrent(req, "camera");
  AcquiRen(req, res, 10, "camera");
});

// 友链
router.get("/links", (req, res) => {
  ReqCurrent(req, "camera");
  dataArr.viewdata = dataArr.model.links;
  res.render("Links.html", dataArr);
});

// 当前请求信息
/***
 * @param {Object} req 请求
 * @param {string} key 例如 camera article
 */
function ReqCurrent(req, key) {
  let CurrentColumn = dataArr.model.nav.datalist.filter(
    (item) => item.link == req.path
  )[0];
  dataArr.current.getnavLink = CurrentColumn.link; // 当前请求url
  dataArr.current.getnavName = CurrentColumn.name; // 当前栏目名称
  dataArr.current.reqcolkey = key; // 当前key
}

// 请求数据与响应数据
/***
 * @param {Object} req 请求
 * @param {Object} res 响应
 * @param {number} pageSize 页数 false表示不分页 1~n
 * @param {string} renhtml 渲染的html名字 index archives
 */
function AcquiRen(req, res, pageSize, renhtml) {
  // 获取数据
  dataArr.viewdata = pagingPage(
    req.query.page,
    pageSize,
    dataArr.contentData[dataArr.current.reqcolkey],
    req.query.key,
    req.query.column
  ); // 1. 分页页数  2.每页几条 3.数据 4.查询的分类 5.查询的值
  res.render(renhtml + ".html", dataArr);
}

// 简历
// 中文
router.get("/cv", (req, res) => {
  dataArr.viewdata = dataArr.contentData.cv.datalist.filter(
    (item) => item.title == "cn"
  )[0];
  res.render("cv.html", dataArr);
});

// 英文
router.get("/english-cv", (req, res) => {
  dataArr.viewdata = dataArr.contentData.cv.datalist.filter(
    (item) => item.title == "en"
  )[0];
  res.render("cv.html", dataArr);
});

// 404
router.get("/404", (req, res) => {
  res.render("404.html", dataArr);
});

// 留言页
router.get("/message", (req, res) => {
  dataArr.current.getnavLink = "/message"; // 请求url
  dataArr.current.getnavName = "留言";
  dataArr.current.reqcolkey = "message";
  res.render("message.html", dataArr);
});

// 根据id查看文章
router.get("/article/:url", (req, res) => {
  ResRenderfun(req, res, "article");
});

// 根据id查看读书/观影
router.get("/notesbook/:url", (req, res) => {
  ResRenderfun(req, res, "notesbook");
});

// 根据id查看光影集
router.get("/camera/:url", (req, res) => {
  // console.log(req.query);
  // console.log(req.params, "req.params");
  ResRenderfun(req, res, "camera");
});

// 处理id查看文章
/***
 * @param {Object} req 请求数据
 * @param {Object} res 发送
 * @param {string} key 例如 camera article
 */
function ResRenderfun(req, res, key) {
  let temporaryData = dataArr.contentData[key];
  let currentdata = temporaryData.datalist.filter((item) => {
    return item.classPY + "-" + item.id == req.params.url;
  });
  if (currentdata[0].signal == undefined || currentdata[0].signal == "") {
    findurl(temporaryData, req, res);
  } else {
    if (req.query.signal === currentdata[0].signal) {
      findurl(temporaryData, req, res);
    } else {
      dataArr.viewdata = currentdata[0];
      if (req.query.signal == undefined) {
        dataArr.viewdata.prompt = "请输入密码......";
      } else if (req.query.signal == "") {
        dataArr.viewdata.prompt = "不能为空！！！";
      } else {
        dataArr.viewdata.prompt = "密码错误";
      }
      res.render("PasswordError.html", dataArr);
    }
  }
}

function findurl(temporaryData, req, res) {
  temporaryData.datalist.forEach((item, index) => {
    if (item.classPY + "-" + item.id == req.params.url) {
      dataArr.viewdata = item;
      // 上下篇
      dataArr.prev = temporaryData.datalist[index - 1];
      dataArr.next = temporaryData.datalist[index + 1];
      if (dataArr.prev == undefined) {
        dataArr.prev = [];
      }
      if (dataArr.next == undefined) {
        dataArr.next = [];
      } // 上下篇end
      let berelatedto = []; // 相关文章
      for (item of temporaryData.datalist) {
        if (item.class == dataArr.viewdata.class) {
          berelatedto.push(item);
        }
      }
      dataArr.berelatedto = berelatedto; // 相关文章end
      res.render("article.html", dataArr);
    }
  });
}

// 分页截取函数
/***
 * @param {string} page 当前页数
 * @param {string} pageSize 一页几条,如果等于false则不分页
 * @param {Object} data 全部数据
 * @param {string} key 查询的key
 * @param {string} column 查询的值
 */
function pagingPage(page = 1, pageSize = 10, data, key, column) {
  // 初始化值
  page = page === undefined ? 1 : page;
  key = key === undefined ? "class" : key;
  column = column === undefined ? "" : column;

  // 按分类查询，与页数数据截取
  datalist = searchKeysValue(data.datalist, key, column);
  let arrt =
    pageSize === false
      ? datalist
      : datalist.slice((page - 1) * pageSize, pageSize * page);

  // 渲染需要的数据
  let pageArr = {};

  // 判断翻页键是否大于4
  let numsturning = 0;
  if (page > 4) {
    numsturning = page - 4;
  } else {
    numsturning = 0;
  }

  pageArr = {
    numsturning: numsturning, // 当前页减4得出翻页键的限制
    total: Math.ceil(datalist.length / pageSize), // 总页数(Math.ceil向上取整)
    querypage: page, //第几页
    data: arrt, // 截取的数据
    key: key,
    column: column,
    class: data.class,
    tag: data.tag,
    Year: data.Year,
  };

  return pageArr;
}

// 单条件精确查找
// https://juejin.cn/post/6844904113986076686
/***
 * @param {Object} lists 所有数据
 * @param {string} key 需要查询的数据的键值
 * @param {string} column 需要查询的值
 */
function searchKeysValue(lists, key, column) {
  if (column === "") return lists;
  let resArr = {};
  if (key === "tag") {
    resArr = lists.filter((item) => item[key].find((elem) => elem === column));
  } else if (key === "class") {
    resArr = lists.filter((item) => item[key] === column);
  }
  return resArr;
}

// 生产dist以及项目文件夹
function produceDist() {
  let ParentFolder = glob.sync("Article/md/*/").reverse(); // 父级文件夹目录 Article\\md\\article
  var FileparsingArr = []; // 全部md文件
  ParentFolder.forEach((item, index) => {
    let Classification = glob.sync(item.replace(/\\/g, "/") + "/*/").reverse(); // 获取分类文件夹路径 Article\\md\\article\\笔记小册
    FileparsingArr.push({
      father: path.parse(item).name,
      fatherPath: item,
      classList: [],
    });
    Classification.forEach((litem, ind) => {
      let globfiles = glob.sync(litem.replace(/\\/g, "/") + "/*.md").reverse(); // 获取分类下的md文件Article\\md\\read\\1.读书.md'
      let claname = path.parse(litem).name.match(/(?<=^(\d+\_)).+/g)[0]; // 分类name/去序号
      FileparsingArr[index].classList.push({
        class: claname,
        classPY: pingyingSpace(claname),
        classPath: litem,
        mdList: globfiles,
      });
    });
  });
  produceHtml(FileparsingArr);
}

// const runDist = produceDist();
// produceDist(); //生产

// 创建dist下生产的文件夹
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

const builder = require("xmlbuilder");
var sitemapArr = [
  "https://www.zhangchengwei.work/",
  "https://www.zhangchengwei.work/archives",
  "https://www.zhangchengwei.work/notesbook",
  "https://www.zhangchengwei.work/links",
  "https://www.zhangchengwei.work/cv",
  "https://www.zhangchengwei.work/english-cv",
  "https://www.zhangchengwei.work/message",
];

// 生产dist下的html
/***
 * @param {Object} globfiles 文件夹下的所有md文件
 */
function produceHtml(globfiles) {
  var addarr = [];
  var addarrHTML = [];

  // 循环栏目
  globfiles.forEach((item, index) => {
    addarr.push({ father: item.father, desc: [] });

    // 循环分类
    item.classList.forEach((listem) => {
      mkdirsSync(distPath + "/" + item.father + "/" + listem.classPY); // 生产dist文件夹

      // 循环md
      listem.mdList.forEach((stitem) => {
        let mdtitle = path.parse(stitem).name.match(/(?<=^(\d+\_)).+/g)[0]; // md标题
        let mdindex = path.parse(stitem).name.match(/^(\d+(?=\_))/)[0]; // md序号
        fs.readFile(stitem, (err, data) => {
          if (err) {
            console.error(err, "读取Md文件错误");
            return err;
          }
          data = data.toString();
          // 获取md内容
          let { compress, descJson } = AnaMarkdown(
            data,
            item.father,
            listem.class,
            listem.classPY,
            mdtitle,
            mdindex
          );
          // console.log(compress);
          addarrHTML.push({
            title: descJson.title,
            html: compress,
          });
          addarr[index].desc.push(descJson);

          // 创建与写入html
          fs.writeFile(
            distPath + "/" + descJson.path,
            compress,
            function (err) {
              if (err) return console.log("读取失败");
              // console.log(descJson.path, '写入成功');
            }
          );
        });
      });
    });
  });

  // 写入json
  setTimeout(() => {
    // 写入json
    // console.log(addarr, "写入json成功");
    addartJson(addarr);

    // 生成rss
    // console.log(addarr[1]);
    let AllData = [];
    addarr.forEach((item) => {
      item.desc.forEach((item2) => {
        AllData.push(item2);
      });
    });
    // console.log(AllData);
    myFeed.addItems(AllData, addarrHTML); // 1.addarr[0].desc 文章json
    myFeed.generate();

    // 生成sitemap.xml
    addarr.forEach((liem) => {
      liem.desc.forEach((liem2) => {
        sitemapArr.push(dataArr.info.url + "/" + liem2.url);
      });
    });
    sitemap(sitemapArr);
    fs.writeFile(
      "Article/dist/sitemap.json",
      JSON.stringify(sitemapArr),
      function (err) {
        if (err) return console.log("sitemap.json读取失败");
        console.log("sitemap.json，写入成功");
        process.exit(); // 执行完退出
      }
    );
  }, 2000);
}

// RSS feed
const AtomGenerator = require("./feed");
const myFeed = new AtomGenerator(
  "张成威的网络日志", // title
  "https://www.zhangchengwei.work/", // link
  "Zhang Chengwei's Network Log", // description
  "张成威" // author
);

// 生成rss格式
// const myArticles = [
//   {
//     title: "JavaScript如何制作一款Markdown编辑器？",
//     url: "https://www.zhangchengwei.work/article/Markdownbianjiqi-1",
//     date: "2023-05-24",
//     content: "<h1>hello</h1>"
//   },
//   {
//     title: "JavaScript如何制作一款Markdown编辑器？",
//     url: "https://www.zhangchengwei.work/article/Markdownbianjiqi-1",
//     date: "2023-05-24",
//     content: "<h1>hello</h1>"
//   }
// ]
// myFeed.addItems(myArticles)
// myFeed.generate()

// 生成sitemap.xml
function sitemap(urls) {
  // 基本配置项
  const baseOption = {
    version: "1.0",
    encoding: "UTF-8",
    standalone: true,
  };
  const urlsetOption = {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
  };
  // 创建sitemap.xml的基础结构
  const xml_obj = builder.create("urlset", urlsetOption, null, baseOption);
  // 循环遍历并添加每个url
  for (let loc of urls) {
    let url = xml_obj.ele("url");
    url.ele("loc", null, loc);
    url.ele("priority", null, "1.0");
    url.ele("changefreq", null, "always");
  }
  // 生成xml字符串
  let xmlString = xml_obj.end({
    pretty: true,
    indent: "  ",
    newline: "\n",
  });
  // 写入sitemap.xml文件
  fs.writeFileSync("static/seo/sitemap.xml", xmlString);
}

// 百度推送
const schedule = require("node-schedule");
const request = require("request");

// 每天准时执行
var rule = new schedule.RecurrenceRule();
rule.hour = 0; // 24小时制
rule.minute = 0;
const job = schedule.scheduleJob(rule, function () {
  console.log(moment().format("LLLL"), "百度推送");
  fs.appendFile("log.txt", moment().format("LLLL") + "\n", function (err) {
    if (err) return console.log("追加失败");
    console.log("追加成功");
  });
  getJSON("Article/dist/sitemap.json").then(
    function (data) {
      var urls = data.data;
      // 必应
      biying(urls);
      // 推送每个url
      urls.forEach((url) => {
        // 百度
        request.post(
          "http://data.zz.baidu.com/urls?site=https://www.zhangchengwei.work&token=k6XhwZoCmUDld31b",
          { form: { urls: [url] } },
          function (err, res, body) {
            if (res.statusCode === 200) {
              console.log(`百度推送成功: ${url}`);
              fs.appendFile(
                "log.txt",
                `------------百度-推送成功: ${url}\n`,
                function (err) {
                  if (err) return console.log("追加失败");
                }
              );
            } else {
              console.log(`百度推送失败: ${url}`);
              fs.appendFile(
                "log.txt",
                `------------百度-推送《失败》: ${url}\n`,
                function (err) {
                  if (err) return console.log("追加失败");
                }
              );
            }
          }
        );
      });
    },
    function (error) {
      console.log(error);
    }
  );
});

// 必应推送
function biying(urlList) {
  const apiKey = "2677f9d9d1884ccaa7a8cc9bb8677a8d";

  urlList.forEach((url, index) => {
    const apiUrl = `http://www.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${apiKey}`;
    const requestBody = JSON.stringify({ siteUrl: url });

    setTimeout(function () {
      request.post(
        apiUrl,
        { body: requestBody },
        (err, res, body) => {
          if (err) {
            console.log(`推送 ${url} 失败:`, err);
            fs.appendFile(
              "log.txt",
              `------------B必应-推送《失败》: ${url}\n`,
              function (err) {
                if (err) return console.log("追加失败");
              }
            );
          } else {
            console.log(`推送 ${url} 成功:`, body);
            fs.appendFile(
              "log.txt",
              `------------B必应-推送成功: ${url}\n`,
              function (err) {
                if (err) return console.log("追加失败");
              }
            );
          }
        },
        1000 * index
      );
    });
  });
}

// 解析markdown
/***
 * @param {Object} data 数据
 * @param {string} folder 栏目文件夹名字
 * @param {string} className 分类
 * @param {string} classNamePY 分类拼音
 * @param {string} title 文章title
 * @param {string} index 文章序号id
 */
function AnaMarkdown(data, folder, className, classNamePY, title, index) {
  // 提取Mackdown描述信息
  let Matching = /<!--##([\s\S]*?)##-->/i;
  let cutout = data.match(Matching)[1];
  cutout = JSON.parse(cutout);
  let descJson = cutout;
  descJson.url = folder + "/" + classNamePY + "-" + index;
  descJson.path =
    folder + "/" + classNamePY + "/" + classNamePY + "-" + index + ".html";
  descJson.title = title;
  descJson.id = index;
  descJson.column = folder;
  descJson.class = className;
  descJson.classPY = classNamePY;

  // markdown转HTML
  let datahtml = data.match(/(?<=\#\#\-\-\>)([\s\S])+/gi)[0]; // 提取内容
  var HTMLString = marked.parse(datahtml.toString());
  var compress = compressHTML(String(HTMLString)); // 压缩
  return { compress, descJson };
}

// 文字转拼音，并去空格
function pingyingSpace(text) {
  return pinyin(text, { toneType: "none" }).replace(/\s*/g, "");
}

// markdown压缩
function compressHTML(html) {
  // html = html.replace(/<!--[\s\S]*?-->/g, "");// 去除注释
  // html = html.replace(/\s+/g, " ");// 去除多余空白
  // html = html.replace(/>\s+</g, "><");// 去除标签之间空格
  // return html.trim();
  return html;
}

// 添加数据
function addartJson(descArr) {
  let columnArr = []; // 栏目
  descArr.forEach((item) => {
    columnArr.push({ name: item.father, path: distPath, key: "contentData" });

    // 按照时间降序排序
    function sortIdDesc(a, b) {
      let dateA = new Date(a.dateYY + "-" + a.dateMM + "-" + a.dateDD);
      let dateB = new Date(b.dateYY + "-" + b.dateMM + "-" + b.dateDD);
      return dateB - dateA;
    }
    item.desc.sort(sortIdDesc);

    // 提取全部分类
    var resultClass = Array.from(new Set(item.desc.map((k) => k.class)));

    // 提取全部标签
    var resultTag = [];
    item.desc.map((k) =>
      k.tag.map((ta) => {
        resultTag.push(ta);
      })
    );
    resultTag = Array.from(new Set(resultTag));

    // 提取年份
    var dateYear = Array.from(new Set(item.desc.map((k) => k.dateYY)));

    // 最终数据JSON.stringify(JsonArr)
    var JsonArr = {
      class: resultClass,
      tag: resultTag,
      datalist: item.desc,
      name: item.father,
      url: item.father != "article" ? "/" + item.father : "/",
      Year: dateYear,
    };

    // 写入json保存
    fs.writeFile(
      distPath + item.father + ".json",
      JSON.stringify(JsonArr),
      function (err) {
        if (err) return console.log("读取失败");
        console.log(item.father + ".json，写入成功");
      }
    );
  });

  // 保存栏目json
  fs.writeFile(
    distPath + "columnArr.json",
    JSON.stringify(columnArr),
    function (err) {
      if (err) return console.log("读取失败");
      console.log("columnArr.json，写入成功");
    }
  );
}

// 管理面板
router.get("/admin", (req, res) => {
  res.render("admin/admin.html");
});
router.get("/admin/editor", (req, res) => {
  res.render("admin/editor.html");
});

module.exports = { router, produceDist };
