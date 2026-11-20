/* Apply persisted choices before the page paints, without blocking a visitor using restricted storage. */
try {
  document.documentElement.dataset.theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  document.documentElement.lang = localStorage.getItem('lang') === 'pt' ? 'pt' : 'en';
} catch {
  document.documentElement.dataset.theme = 'dark';
  document.documentElement.lang = 'en';
}
