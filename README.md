# 个人博客

Jekyll / GitHub Pages 文字博客。包含 tech（技术）、life（日记）、review（作品感想）三个栏目，以及文章列表、搜索、标签筛选、目录和深浅色模式。

## 修改入口

| 内容 | 文件 |
| --- | --- |
| 背景、字体、字号、行距、配色、宽度、列数 | `_data/appearance.yml` |
| 自由添加或覆盖 CSS | `assets/css/custom.css` |
| 首页说明、栏目、文章数量、区块开关 | `_data/blog.yml` |
| 网站名称、域名 | `_config.yml` |
| 导航 | `_data/navigation.yml` |
| 首页结构 | `index.html` |
| 文章页 | `_layouts/post.html` |
| 文章列表组件 | `_includes/post-card.html` |
| 搜索、目录、主题切换 | `assets/js/main.js` |
| 关于页面 | `_pages/about.md` |

详细例子见 [修改指南](docs/CUSTOMIZATION.md)。

样式加载顺序：`main.css`（基础结构）→ `settings.css`（根据外观配置生成）→ `custom.css`（自由覆盖）。
常用设置集中在数据文件里，页面结构可直接改 HTML，没有远程主题。

## 写文章

复制 `_drafts/technical-note.md`、`_drafts/life-note.md` 或 `_drafts/review-note.md` 到 `_posts/YYYY-MM-DD-短名.md`。文件名必须带日期，否则 Jekyll 不会将其识别为文章。
修改文章头部：

```yaml
---
title: 文章标题
description: 简介
section: tech
categories: [tech]
tags: [CS Learning]
toc: true
---
```

`section: tech` 对应技术；`section: life` 对应日记；`section: review` 对应作品感想。
`categories` 影响地址，`tags` 用于细分主题。草稿和未来日期文章默认不发布。

文章配图放在 `assets/images/`，链接使用 `{{ '/assets/images/文件名.png' | relative_url }}`。以 `_` 开头的普通图片目录默认不会输出，避免使用 `_pic/` 或 Windows 反斜杠路径。

## 本地运行

安装 Ruby 和 Bundler 后：

```sh
bundle install
bundle exec jekyll serve
```

打开 http://127.0.0.1:4000 。修改 `_config.yml` 后重启；数据、样式和文章修改会自动重建。
用 `bundle exec jekyll build` 检查完整构建。草稿预览加 `--drafts`。

推送后由 GitHub Pages 发布。本次只修改本地文件。
