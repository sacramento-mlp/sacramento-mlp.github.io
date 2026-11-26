/* Language is selected through crawlable links; only theme needs JavaScript. */
(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme');
  function setTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (themeButton) {
      const pt = root.lang.toLowerCase().startsWith('pt');
      themeButton.setAttribute('aria-label', next === 'dark' ? (pt ? 'Ativar tema claro' : 'Switch to light theme') : (pt ? 'Ativar tema escuro' : 'Switch to dark theme'));
      themeButton.setAttribute('aria-pressed', String(next === 'light'));
    }
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
  }
  setTheme(root.dataset.theme);
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
})();
