// 生成目录
function createMenu() {
  // 首先获取所有H标签，若页面中有h4，h5，h6则可以添加到参数中
  var headList = [...document.querySelectorAll("h3,h4")]; // 将H标签构造成一棵树，就可以明确H标签之间的层级
  if (headList.length > 0) {
    var root = {
      children: [],
    };
    var h = {
      node: headList[0],
      children: [],
      parent: root,
    };
    root.children.push(h);
    headList.reduce(function (pre, cur) {
      var n = {
        node: cur,
        children: [],
      };
      while (h.node.localName[1] - n.node.localName[1] !== -1) {
        h = h.parent;
        if (h === root) {
          break;
        }
      }
      n.parent = h;
      h.children.push(n);
      h = n;
      return h;
    }); // 给H标签加id
    var index = 1;
    function createList(list) {
      var text = list.reduce(function (pre, cur) {
        var childText; // 判断该H标签有没有子层H标签
        if (cur.children.length) {
          childText = createList(cur.children);
        } else {
          childText = "";
        }
        cur.node.id = "header" + index++;
        var haclass = ["H3", "H4"];
        for (let f = 0; f < haclass.length; f++) {
          if (haclass[f] == cur.node.nodeName) {
            pre += `<li>
                      <a href="#${cur.node.id}" class="tab${haclass[f]}">
                        ${cur.node.innerHTML}
                      </a>
                      ${childText}
                    </li>`;
          }
        }
        return pre;
      }, "");
      var text = `<ul> ${text} </ul>`;
      return text;
    }
    var content = createList(root.children);
    document.getElementById("directory-box").innerHTML = content;
  } else {
    document.querySelector(".right-aside").style.display = "none";
  }
}
