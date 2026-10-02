# Hirasawa_Yui · 个人博客

一个使用 Jekyll / GitHub Pages 的文字博客，分为「技术与学习」和「日记与感想」。所有布局、样式、交互均在仓库中，可以直接修改，无需寻找远程主题源码。

## 快速定位修改入口

| 想调整什么 | 修改文件 | 搜索标记 / 位置 |
| --- | --- | --- |
| 网站名称、描述、域名 | `_config.yml` | `[SITE]` |
| 顶部导航 | `_data/navigation.yml` | `[NAV]` |
| 首页标题、简介、栏目、最近文章数量 | `_data/blog.yml` | `[HOME]`、`[SECTIONS]` |
| 首页区块及顺序 | `index.html` | `[HOME:HERO]`、`[HOME:SECTIONS]`、`[HOME:RECENT]` |
| 颜色、字体、内容宽度 | `assets/css/main.css` | `[STYLE:TOKENS]` |
| 手机排版 | `assets/css/main.css` | `[STYLE:RESPONSIVE]` |
| 顶部、底部公共结构 | `_layouts/default.html` | `site-header`、`site-footer` |
| 文章卡片 | `_includes/post-card.html` | `post-card` |
| 文章页结构 | `_layouts/post.html` | `article-header`、`data-article-body` |
| 栏目搜索页结构 | `_layouts/archive.html` | `data-archive` |
| 搜索规则、目录、主题切换 | `assets/js/main.js` | `[FEATURE:SEARCH]`、`[FEATURE:TOC]`、`[FEATURE:THEME]` |
| 搜索数据字段 | `search.json` | 构建时输出公开文章 JSON |
| 关于页面 | `_pages/about.md` | 直接编辑 Markdown |

在编辑器中全局搜索上述标记即可定位。完整修改例子见 [博客调整指南](docs/CUSTOMIZATION.md)。

## 写第一篇文章

1. 技术文章复制 `_drafts/technical-note.md`；日记或感想复制 `_drafts/life-note.md`。
2. 将副本保存为 `_posts/YYYY-MM-DD-英文短名.md`，例如 `_posts/2026-10-02-first-note.md`。
3. 修改头部的 `title`、`description`、`section`、`categories`、`tags`，然后写正文。
4. `section: tech` 出现在技术栏目，`section: life` 出现在日记与感想栏目。子主题用标签区分。
5. 提交并推送后由 GitHub Pages 构建。日期晚于当前日期的文章默认不会发布，草稿默认不会发布。

现有空白文章已规范为 `2026-10-02-Dairy.md`，现为明确标注的框架占位文章，可以替换或删除。其 `Dairy` 分类和文件名短名保留，以保持原路径。

## 本地运行

安装 Ruby 和 Bundler 后，在仓库目录运行：

```sh
bundle install
bundle exec jekyll serve
```

打开 http://127.0.0.1:4000 。修改 `_config.yml` 后重启服务。需要预览草稿时使用 `bundle exec jekyll serve --drafts`；正式发布时不加此参数。

完整构建检查：

```sh
bundle exec jekyll build
```

不需要 Node、数据库或后端服务。保留 GitHub Pages 的 Jekyll 发布方式，仓库自己的布局替代了原来的远程主题。RSS 与 sitemap 由现有 GitHub Pages 支持的插件生成。

## 功能范围

- 首页栏目入口、最近文章，技术 / 生活独立列表。
- 按标题、正文和标签搜索，精确标签筛选，搜索条件保留在 URL。
- Markdown 正文、代码块、表格、图片、可选目录、上一篇 / 下一篇。
- 手机排版、深浅色切换、RSS、分类和标签页面、404 页面。
- 禁用 JavaScript 时仍可浏览文章；搜索失败时保留文章列表。
- 这是文字博客框架，未接入音频节目、评论或账号系统。
