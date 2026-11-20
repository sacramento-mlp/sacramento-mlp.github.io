/* Shared progressive enhancement for language and theme across static pages. */
(() => {
  const root = document.documentElement;
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* private browsing */ } }
  };
  const langButton = document.getElementById('lang');
  const themeButton = document.getElementById('theme');
  function setLanguage(lang) {
    const next = lang === 'pt' ? 'pt' : 'en';
    root.lang = next;
    document.querySelectorAll('[data-pt][data-en]').forEach((element) => {
      element.textContent = element.getAttribute('data-' + next) || '';
    });
    document.querySelectorAll('[data-aria-pt][data-aria-en]').forEach((element) => {
      element.setAttribute('aria-label', element.getAttribute('data-aria-' + next) || '');
    });
    if (langButton) {
      langButton.textContent = next === 'pt' ? 'EN' : 'PT';
      langButton.setAttribute('aria-label', next === 'pt' ? 'Switch language to English' : 'Mudar idioma para português');
    }
    storage.set('lang', next);
  }
  function setTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (themeButton) {
      themeButton.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeButton.setAttribute('aria-pressed', String(next === 'light'));
    }
    storage.set('theme', next);
  }
  setLanguage(storage.get('lang') === 'pt' ? 'pt' : 'en');
  setTheme(storage.get('theme') === 'light' ? 'light' : 'dark');
  langButton?.addEventListener('click', () => setLanguage(root.lang === 'pt' ? 'en' : 'pt'));
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
})();
