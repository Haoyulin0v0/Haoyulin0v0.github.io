/* [FEATURE:THEME] 在正文绘制前恢复主题，减少闪烁。 */
(() => {
  let theme;
  try { theme = localStorage.getItem('notebook-theme'); } catch (_) { /* 禁止存储时使用系统主题。 */ }
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
})();
