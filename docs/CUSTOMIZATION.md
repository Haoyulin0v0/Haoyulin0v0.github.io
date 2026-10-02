# 博客调整指南

## 1. 先理解文件之间的关系

`_config.yml` 管理网站身份和构建设置。 `_data/` 管理文案与导航。
`_posts/` 是公开文章，`_drafts/` 是草稿模板。
`_layouts/` 决定页面结构，`_includes/` 放重复使用的小组件。
`assets/css/` 管理视觉样式，`assets/js/` 管理交互。

访问首页时，Jekyll 先读取 `index.html` 和数据文件，再用 `_layouts/default.html` 包上导航与页脚。
文章先经过 `post.html`，再经过 `default.html`。
栏目先经过 `archive.html`，再经过 `default.html`。

## 2. 改网站名称和首页文案

在 `_config.yml` 中修改：

```yaml
title: 我的个人博客
description: 学习、生活与一些想法。
```

然后在 `_data/blog.yml` 修改：

```yaml
headline: 在学习与生活之间，
headline_accent: 保存值得回看的片段。
intro: 这里是我的个人笔记。
recent_limit: 9
```

`headline` 和 `headline_accent` 分别是首页两行大标题。 `recent_limit` 控制首页文章数，不限制归档页。
修改 YAML 时使用空格缩进；包含冒号的文案请用引号包起来。
网站名称变化后，`_pages/about.md` 里的个人介绍也需要自行调整。

## 3. 改配色、字体和布局宽度

打开 `assets/css/main.css`，找到 `[STYLE:TOKENS]`：

```css
:root {
  --bg: #f8f7f3;         /* 全站背景 */
  --surface: #fffefa;    /* 卡片背景 */
  --ink: #222b2a;        /* 正文字色 */
  --muted: #64706b;      /* 次要文字 */
  --accent: #24685b;     /* 强调色 */
  --accent-soft: #e5ede6;/* 标签 / 代码背景 */
  --line: #dedfd6;       /* 边框 */
  --width: 1120px;       /* 全站最大宽度 */
  --article-width: 760px;/* 文章阅读宽度 */
}
```

改强调色时一起调整 `--accent-soft`。深色模式在 `:root[data-theme="dark"]` 与系统深色媒体查询中，二者应同步修改。
`--sans` 控制界面和正文的字体，`--serif` 控制主要标题。现有字体使用系统回退，无需外部字体请求。

卡片列数在 `.post-grid`；首页栏目列数在 `.section-grid`。
手机样式位于 `[STYLE:RESPONSIVE]`，小于 700px 时为单列。先改桌面默认规则，再检查手机覆盖规则。

## 4. 写文章与设置栏目

文章顶部的 YAML 称为 front matter。以技术文章为例：

```yaml
---
title: "一次 RNA-seq 学习记录"
description: "这篇文章要讨论的问题和得到的收获。"
section: tech
categories: [tech]
tags: [Bioinformatics, RNA-seq]
toc: true
---
```

字段含义：

| 字段 | 用途 |
| --- | --- |
| `title` | 标题 |
| `description` | 首页、归档卡片和文章页简介；省略时卡片使用摘要 |
| `section` | 大栏目：`tech` 或 `life`；必须与栏目 id 一致 |
| `categories` | URL 路径和分类页分组；发表后调整会改变地址 |
| `tags` | 子主题、标签页分组和搜索筛选，例如 CS Learning、观后感 |
| `toc` | `true` 显示 h2 / h3 自动目录；默认关闭 |
| `published` | 设为 `false` 可隐藏文章 |

`section` 决定文章归属，`categories` 决定地址，它们各有用途。
未写 `section` 的旧文章默认归到 `life`。建议新文章明确填写，避免技术文章进入生活栏目。
目录由浏览器脚本生成；不启用 JavaScript 时正文仍可阅读。

正文使用 Markdown。使用 `<!--more-->` 可以划分摘要，使用代码围栏添加语言名可以生成代码标记：

```text
## 问题
这里写背景。

<!--more-->

## 实践
这里写过程。
```

插图存到 `assets/images/`，站内地址用 Jekyll 的 `relative_url`：

```liquid
![图片说明]({{ '/assets/images/example.png' | relative_url }})
```

## 5. 改导航、栏目或增加第三个栏目

只改导航显示文字：编辑 `_data/navigation.yml` 的 `title`。
改首页栏目名、介绍和展示的子主题：编辑 `_data/blog.yml` 的 `sections`。
首页的 `topics` 是展示文案；实际标签来自每篇文章的 `tags`。

新增栏目，例如 Reading：

1. 在 `_data/blog.yml` 的 `sections` 下追加一项：

```yaml
  - id: reading
    number: "03"
    title: 阅读笔记
    english: READING NOTES
    description: 书页间的一些想法。
    topics: [书评, 摘记]
    url: /reading/
```

2. 复制 `_pages/tech.html` 为 `_pages/reading.html`，将 `section` 改为 `reading`、`permalink` 改为 `/reading/`，并调整标题、描述和空列表文案。
3. 在 `_data/navigation.yml` 增加 `title: 阅读笔记`、`url: /reading/`。
4. 新文章使用 `section: reading`。
5. 如希望三个栏目并排，将桌面 `.section-grid` 的列数改为 3；手机端保持单列。

首页栏目介绍来自数据文件，栏目页标题和描述来自页面 front matter，两处均应调整。
搜索索引与卡片会自动读取新栏目的名称。

## 6. 功能接口与搜索规则

这是一套静态站点接口，不需要部署后端。

| 接口 / 挂载点 | 提供什么 |
| --- | --- |
| `/search.json` | 所有已发布文章的标题、地址、日期、栏目、标签、简介、正文文本 |
| `/feed.xml` | RSS/Atom 更新订阅 |
| `/sitemap.xml` | 网站地图 |
| `[data-archive]` | 搜索脚本挂载位置 |
| `data-section` | 栏目限制；空字符串代表全部 |
| `data-search-url` | 搜索索引地址，自动兼容 baseurl |
| `[data-toc]` | 目录生成位置 |
| `[data-article-body]` | 正文标题读取范围 |
| `[data-theme-toggle]` | 主题切换按钮 |

`search.json` 会公开文章正文，这是静态全文搜索需要的数据。草稿和未发布文章默认不进入索引。
数据字段：`title`、`url`、`date`、`section`、`section_title`、`tags`、`description`、`content`。

在 `assets/js/main.js` 搜索 `[FEATURE:SEARCH]`：
- `terms.every(...)` 表示多个关键词必须同时匹配。改为 `terms.some(...)` 时要另行处理空关键词数组，使空搜索仍显示所有文章。
- `[post.title, post.description, post.content, ...post.tags]` 是搜索范围；删掉 `post.content` 就只搜索标题、简介和标签。
- `select.value` 筛选精确标签。
- `card(post)` 控制搜索结果的卡片布局。修改卡片时同步修改 `_includes/post-card.html`，保证初始列表与搜索结果一致。
- `?q=关键词&tag=标签` 可以直接分享筛选结果。无匹配时显示提示；索引加载失败时保留静态文章。

大量文章时，浏览器会一次读取整个索引；当前框架适合个人博客，后续可按数据规模拆分索引。

## 7. 保持发布兼容

这是个人 GitHub Pages 站点，`baseurl: ""`。若迁移到项目站点，改为 `baseurl: "/仓库名"`；如果换域名，同步改 `url`。
布局中的站内链接均经过 `relative_url`，搜索也读取同一前缀。

原来的文章路径规则 `/:categories/:title/` 保留。原占位文章的 `Dairy` 分类也保留，避免修改已有文章地址。可对新文章用 `tech` / `life` 分类。
默认不发布未来日期的文章或 `_drafts/`；用 `--drafts` 仅在本地预览草稿。

发布前运行 `bundle exec jekyll build`，预览首页、技术栏目、生活栏目、归档、文章、404 和 RSS。
检查手机端、主题切换、搜索空结果，以及带中文标签的 URL。
推送和上线由你控制，本次调整只改本地仓库。
