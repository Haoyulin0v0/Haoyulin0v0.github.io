/* [FEATURE:THEME] 深浅色切换；只保存本机偏好。 */
(() => {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark' : systemTheme.matches;
  const update = () => {
    button.textContent = isDark() ? '浅色' : '深色';
    button.setAttribute('aria-pressed', String(isDark()));
    button.setAttribute('aria-label', isDark() ? '切换到浅色模式' : '切换到深色模式');
  };
  button.hidden = false;
  button.addEventListener('click', () => {
    const theme = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('notebook-theme', theme); } catch (_) { /* 当前页面仍可切换。 */ }
    update();
  });
  systemTheme.addEventListener('change', update);
  update();
})();

/* [FEATURE:TOC] toc: true 时收集正文 h2 / h3，不改变 Markdown 源文件。 */
(() => {
  const toc = document.querySelector('[data-toc]');
  if (!toc) return;
  const headings = document.querySelectorAll('[data-article-body] h2, [data-article-body] h3');
  if (!headings.length) { toc.closest('details').hidden = true; return; }
  headings.forEach((heading, index) => {
    if (!heading.id) {
      let id = `heading-${index + 1}`;
      while (document.getElementById(id)) id += '-';
      heading.id = id;
    }
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent;
    if (heading.tagName === 'H3') link.className = 'toc-subheading';
    toc.append(link);
  });
})();

/* [FEATURE:SEARCH] 数据接口：search.json；栏目由 data-section 限定。
 * 关键词以空格分隔，多个关键词同时匹配；标签为精确匹配。
 * 使用 textContent 输出内容，避免文章文字被当作 HTML 执行。
 */
(async () => {
  const archive = document.querySelector('[data-archive]');
  if (!archive) return;
  const tools = archive.querySelector('[data-search-tools]');
  const input = archive.querySelector('#post-search');
  const select = archive.querySelector('#tag-filter');
  const list = archive.querySelector('[data-post-list]');
  const initialNodes = [...list.childNodes];
  const count = archive.querySelector('[data-result-count]');
  const empty = archive.querySelector('[data-no-results]');
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const card = (post) => {
    const node = element('article', 'post-card');
    const meta = element('div', 'post-meta');
    const time = element('time', '', post.date);
    time.dateTime = post.date.replaceAll('.', '-');
    meta.append(element('span', '', post.section_title), time);
    const title = element('h3');
    const link = element('a', '', post.title);
    link.href = post.url;
    title.append(link);
    const bottom = element('div', 'card-bottom');
    const tags = element('div', 'tags');
    post.tags.slice(0, 3).forEach((tag) => {
      const tagLink = element('a', '', tag);
      const url = new URL(location.href);
      url.search = '';
      url.searchParams.set('tag', tag);
      tagLink.href = url.pathname + url.search;
      tags.append(tagLink);
    });
    const read = element('a', 'read-link', '↗');
    read.href = post.url;
    read.setAttribute('aria-label', `阅读：${post.title}`);
    bottom.append(tags, read);
    node.append(meta, title, element('p', '', post.description), bottom);
    return node;
  };
  try {
    const response = await fetch(archive.dataset.searchUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const section = archive.dataset.section;
    const posts = data.filter((post) => !section || post.section === section)
      .map((post) => ({ ...post, tags: Array.isArray(post.tags) ? post.tags : [] }));
    const tags = [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
    tags.forEach((tag) => { const option = element('option', '', tag); option.value = tag; select.append(option); });
    const restore = () => {
      const params = new URLSearchParams(location.search);
      input.value = params.get('q') || '';
      const tag = params.get('tag') || '';
      // 保留不存在的标签，给出零结果，而不是悄悄展示所有文章。
      [...select.options].filter((option) => option.dataset.unknown).forEach((option) => option.remove());
      if (tag && !tags.includes(tag)) {
        const option = element('option', '', tag); option.value = tag; option.dataset.unknown = 'true'; select.append(option);
      }
      select.value = tag;
    };
    const render = (saveUrl = false) => {
      const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      const results = posts.filter((post) => {
        const text = [post.title, post.description, post.content, ...post.tags].join(' ').toLocaleLowerCase();
        return (!select.value || post.tags.includes(select.value)) && terms.every((term) => text.includes(term));
      });
      count.textContent = `${results.length} 篇记录`;
      // 没有文章且没有筛选时，保留服务端渲染的栏目提示。
      if (posts.length || terms.length || select.value) list.replaceChildren(...results.map(card));
      else list.replaceChildren(...initialNodes);
      empty.hidden = results.length > 0 || (!posts.length && !terms.length && !select.value);
      if (saveUrl) {
        const url = new URL(location.href);
        input.value.trim() ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
        select.value ? url.searchParams.set('tag', select.value) : url.searchParams.delete('tag');
        history.replaceState(null, '', url);
      }
    };
    restore(); render(); tools.hidden = false;
    let timer;
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => render(true), 150); });
    select.addEventListener('change', () => render(true));
    archive.querySelector('[data-clear-filters]').addEventListener('click', () => {
      clearTimeout(timer); input.value = ''; select.value = ''; render(true); input.focus();
    });
    window.addEventListener('popstate', () => { restore(); render(); });
  } catch (error) {
    archive.querySelector('[data-search-error]').hidden = false;
    console.error('无法加载博客搜索索引', error);
  }
})();
