# 网站修改入口

| 想改什么 | 编辑文件 |
| --- | --- |
| 头像、简介、GitHub、邮箱、其他联系方式、CV、文章与成果 | `_data/profile.yml` |
| 首页仓库预览：名称、链接、简介、语言 | `_data/projects.yml` |
| 写作时参考的标签选项 | `_data/tags.yml` |
| 顶部导航 | `_data/navigation.yml` |
| 字体、背景、宽度与配色 | `_data/appearance.yml` |
| 透明卡片等样式 | `assets/css/custom.css` |
| 新文章模板 | `_drafts/document.md` |

首页放头像、个人介绍和仓库预览；documents 集中展示文章，按标签多选筛选；about 放联系方式、CV 和将来的文章与成果。仓库预览完全由配置文件控制，不依赖访客访问 GitHub API。

## 写文章与展示开关

复制 `_drafts/document.md` 到 `_posts/2026-11-05-my-note.md`，文件名必须使用 `YYYY-MM-DD-短名.md`。例如：

```yaml
---
title: 我的文章
description: 简介
tags: [动画, 观后感, shirobako, TV]
published: false
toc: true
---
```

- `tags` 数量不限，自由增删；所有标签都会显示在文章与卡片上。documents 自动收集已发布文章的标签；多选时同时匹配所选标签。
- `published: false`：不构建这篇文章，documents、搜索、标签、RSS 和 sitemap 都不会收录。
- `published: true`：正式发布。布尔值不加引号。不填时默认发布。
- `_drafts/` 目录中的文件默认也不发布。需要发布时移到 `_posts/` 并将 `published` 改为 `true`。
- `toc` 仅控制文章内部目录。
- 旧文章中的 `categories` 仅为保留原有网址，无需填写 `section`。新文章无需分类字段。

注意：不发布不等于私密，公开 GitHub 仓库内的源文件仍可被查看。

## 头像、联系方式和 CV

在 `_data/profile.yml` 中替换头像网址，或上传图片到 `assets/images/` 后填写站内路径。邮箱只填地址；其他联系方式按注释示例添加。空字段不会生成空链接。

上传 CV PDF 到 `assets/files/`，填写 `cv_url: /assets/files/cv.pdf`；也可填外部网址。以后在 `publications` 列表里添加标题、链接和简介即可展示文章与成果。

## 链接与图片

推荐写 `[链接文字](https://example.com)` 或 `<https://example.com>`。这两种写法即使禁用 JavaScript 也能点击。正文直接粘贴的 http/https 网址会自动变为链接；代码块内的内容不转换。

图片推荐存放在 `assets/images/`，例如 `![图片说明](/assets/images/example.png)`。已有 `_pic/` 目录也会输出，兼容旧文章。折叠内容内要解析 Markdown，请写 `<details markdown="1">`。

## 本地预览

安装 Ruby 和 Bundler 后运行 `bundle install`、`bundle exec jekyll serve`。完整构建检查用 `bundle exec jekyll build`。修改 `_config.yml` 后重启。推送 master 后由 GitHub Pages 构建发布。
