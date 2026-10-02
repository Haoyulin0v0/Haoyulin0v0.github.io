# 修改指南

## 背景和配色

打开 `_data/appearance.yml`：

```yaml
light:
  background: "#f7f7f7"
  surface: "#ffffff"
  text: "#222222"
  muted: "#666666"
  accent: "#245b9e"
  subtle: "#eeeeee"
  border: "#dddddd"
```

`background` 是页面背景，`surface` 是文章与栏目背景，`accent` 是链接颜色。
深色模式在同一文件的 `dark` 中设置，不用同步修改多处 CSS。

使用背景图片：

```yaml
background:
  image: "/assets/images/background.jpg"
  size: cover
  position: center
  attachment: scroll
```

把图片放到对应路径；将 `image` 改回 `""` 恢复纯色。
图片同时用于深浅色模式，建议选不影响文字阅读的图片。需要给正文加背景时，在 `custom.css` 中写：

```css
#main {
  background: var(--surface);
  padding: 24px;
}
```

## 字体和字号

在 `appearance.yml` 的 `fonts` 中设置：

```yaml
fonts:
  body: '"Microsoft YaHei", sans-serif'
  heading: 'inherit'
  code: 'Consolas, monospace'
  body_size: 16px
  heading_size: 28px
  line_height: 1.8
```

`body` 是正文与界面字体；`heading: inherit` 让标题跟随正文，也可以改为独立字体。
`body_size` 是全站基准字号，`heading_size` 是页面大标题字号。
填写 CSS 字体列表，字体名称需要在设备上存在；默认使用系统字体。

使用自己的字体文件：放到 `assets/fonts/`，在 `custom.css` 里声明：

```css
@font-face {
  font-family: "MyFont";
  src: url("../fonts/my-font.woff2") format("woff2");
  font-display: swap;
}
```

然后把 `fonts.body` 改为 `'"MyFont", sans-serif'`。
相对路径支持个人站点和有路径前缀的项目站点。

## 宽度和列表

同一文件的 `layout`：

```yaml
layout:
  site_width: 960px
  article_width: 720px
  page_padding: 24px
  section_columns: 2
  post_columns: 1
  gap: 16px
  radius: 4px
```

- `site_width`：网站最大宽度。
- `article_width`：文章正文最大宽度。
- `page_padding`：页面左右留白。
- `section_columns`：桌面栏目列数。
- `post_columns`：桌面文章列数，默认单列；改成 2 就是双列卡片。
- `gap`：栏目和文章之间的间距。
- `radius`：圆角；设为 `0px` 使用直角。

尺寸带单位，列数填写正整数。小于 700px 的手机布局默认单列。

## 自由改样式和结构

`assets/css/custom.css` 最后加载，用于自由覆盖，例如把文章改为无边框列表：

```css
.post-card {
  border: 0;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
  padding: 18px 0;
}
```

各文件职责：

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页区块顺序 |
| `_layouts/default.html` | 导航和页脚 |
| `_layouts/post.html` | 文章结构 |
| `_layouts/archive.html` | 栏目、搜索页面结构 |
| `_includes/post-card.html` | 初始文章列表组件 |
| `assets/css/main.css` | 基础排版和手机规则 |
| `assets/js/main.js` 中的 `card(post)` | 搜索结果组件 |

修改文章组件时同步调整初始列表与搜索结果。颜色和字体由 CSS 变量控制，新增样式也可以引用 `var(--accent)`、`var(--font-body)` 等变量。

## 首页和栏目

在 `_data/blog.yml` 设置：

```yaml
intro: 技术学习、日记与感想。
recent_limit: 8
show_sections: true
show_recent: true
```

`intro: ""` 可隐藏首页说明。两个开关可以隐藏栏目区或最新文章区。
编辑 `sections` 改栏目名、展示主题与地址；`_data/navigation.yml` 控制顶部导航。

新增栏目：

1. 在 `sections` 添加 `id`、`title`、`topics`、`url`。
2. 复制 `_pages/tech.html`，修改 `section`、`permalink`、`title`、`description`。
3. 在导航中增加相同地址。
4. 文章使用新 `section` 值。

栏目页标题在页面 front matter 中，与首页显示名分别设置。

## 文章与功能接口

文章使用 Markdown；技术模板在 `_drafts/technical-note.md`，日记模板在 `_drafts/life-note.md`。
`section` 决定栏目，`categories` 决定 URL，`tags` 决定标签。`toc: true` 开启 h2 / h3 目录。
未设置 `section` 的旧文章默认归到 `life`。

| 接口或挂载点 | 用途 |
| --- | --- |
| `/search.json` | 已发布文章的标题、正文、标签等搜索数据 |
| `/feed.xml` | RSS/Atom 订阅 |
| `/sitemap.xml` | 网站地图 |
| `[data-archive]` | 搜索挂载点 |
| `data-section` | 搜索限定栏目 |
| `[data-toc]` | 自动目录 |
| `[data-theme-toggle]` | 主题切换 |

在 `main.js` 搜索 `[FEATURE:SEARCH]` 调整匹配规则。多个空格分隔的关键词默认同时匹配；标签精确匹配。
搜索条件使用 `?q=关键词&tag=标签`，可以分享链接。
搜索索引公开文章正文；草稿默认不进入索引。

修改网站名、域名用 `_config.yml`。项目站点设置 `baseurl: "/仓库名"`，个人站点保持空。
发布前运行 `bundle exec jekyll build`；主题与搜索可在 `bundle exec jekyll serve` 中预览。
