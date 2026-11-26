/* Theme is persisted; the URL determines the server-rendered language. */
try {
  document.documentElement.dataset.theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
} catch { document.documentElement.dataset.theme = 'dark'; }
