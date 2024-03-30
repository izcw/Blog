const feed = require("feed").Feed;
const fs = require("fs");
const path = require("path");

const urlme = "https://www.zhangchengwei.work/";

class AtomGenerator {
  constructor(title, link, description, author) {
    this.feed = new feed({
      title: title,
      id: link,
      link: link + "atom.xml",
      description: description,
      language: "zh-cn",
      author: {
        name: author,
        email: "mailto:zhangchengwei.work@outlook.com",
        link: link,
      },
    });
  }

  addItems(list, addarrHTML) {
    list.forEach((item) => {
      const title = item.title; // 博客标题
      const url = urlme + item.url; // 博客链接
      const date = item.dateYY + "-" + item.dateMM + "-" + item.dateDD; // 博客发布时间
      const content = addarrHTML.filter((itlist) => itlist.title == item.title); // 博客内容
      this.feed.addItem({
        title: title,
        id: url,
        link: url,
        content: content[0].html,
        author: [
          {
            name: "张成威",
            link: urlme,
          },
        ],
        date: new Date(date),
      });
    });
  }

  generate() {
    const atom = this.feed.atom1();
    fs.writeFileSync(path.resolve(__dirname, "../static/seo/atom.xml"), atom);
    console.log("生成RSS Atom订阅成功");
  }
}

module.exports = AtomGenerator;
