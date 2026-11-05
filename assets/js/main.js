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

/* 正文裸链接：保留已有链接、代码与预格式化文本。 */
(() => {
  document.querySelectorAll('[data-article-body], .page-content .prose').forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => node.parentElement.closest('a, code, pre, script, style, textarea, svg')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const pattern = /https?:\/\/[^\s<>"'，。；！？、（）【】]+/g;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const match of node.textContent.matchAll(pattern)) {
        let url = match[0].replace(/[.,;:!?]+$/, '');
        while (url.endsWith(')') && (url.match(/\)/g) || []).length > (url.match(/\(/g) || []).length) url = url.slice(0, -1);
        if (!url) continue;
        fragment.append(document.createTextNode(node.textContent.slice(cursor, match.index)));
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        fragment.append(link);
        cursor = match.index + url.length;
      }
      if (cursor) {
        fragment.append(document.createTextNode(node.textContent.slice(cursor)));
        node.replaceWith(fragment);
      }
    });
  });
})();

/* documents：标签可多选，同时匹配；筛选写入 URL，支持分享和浏览器返回。 */
(() => {
  const archive = document.querySelector('[data-archive]');
  if (!archive) return;
  const tools = archive.querySelector('[data-search-tools]');
  const input = archive.querySelector('#post-search');
  const tagList = archive.querySelector('[data-filter-tags]');
  const count = archive.querySelector('[data-result-count]');
  const empty = archive.querySelector('[data-no-results]');
  const cards = [...archive.querySelectorAll('[data-document-card]')].map((node) => ({
    node, tags: JSON.parse(node.dataset.tags || '[]'), text: node.dataset.search.toLocaleLowerCase(),
  }));
  let selected = new Set();
  const render = (saveUrl = false) => {
    const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let found = 0;
    cards.forEach((card) => {
      const matches = [...selected].every((tag) => card.tags.includes(tag)) && terms.every((term) => card.text.includes(term));
      card.node.hidden = !matches;
      if (matches) found += 1;
    });
    tagList.querySelectorAll('[data-tag]').forEach((button) => button.setAttribute('aria-pressed', String(selected.has(button.dataset.tag))));
    count.textContent = `${found} / ${cards.length} 篇文章`;
    empty.hidden = found > 0 || (!cards.length && !terms.length && !selected.size);
    if (saveUrl) {
      const url = new URL(location.href);
      url.searchParams.delete('q');
      url.searchParams.delete('tag');
      if (input.value.trim()) url.searchParams.set('q', input.value.trim());
      selected.forEach((tag) => url.searchParams.append('tag', tag));
      history.pushState(null, '', url);
    }
  };
  const restore = () => {
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || '';
    selected = new Set(params.getAll('tag').filter(Boolean));
    tagList.querySelectorAll('[data-unknown-tag]').forEach((button) => button.remove());
    const known = new Set([...tagList.querySelectorAll('[data-tag]')].map((button) => button.dataset.tag));
    selected.forEach((tag) => {
      if (known.has(tag)) return;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'tag-chip';
      button.dataset.tag = tag; button.dataset.unknownTag = 'true';
      button.textContent = tag; tagList.append(button);
    });
    render();
  };
  restore();
  tools.hidden = false;
  let timer;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => render(true), 180); });
  tagList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tag]');
    if (!button) return;
    clearTimeout(timer);
    selected.has(button.dataset.tag) ? selected.delete(button.dataset.tag) : selected.add(button.dataset.tag);
    render(true);
  });
  archive.querySelector('[data-clear-filters]').addEventListener('click', () => {
    clearTimeout(timer); input.value = ''; selected.clear();
    tagList.querySelectorAll('[data-unknown-tag]').forEach((button) => button.remove());
    render(true); input.focus();
  });
  window.addEventListener('popstate', () => { clearTimeout(timer); restore(); });
})();
