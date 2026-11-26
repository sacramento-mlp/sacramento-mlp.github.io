/* Progressive enhancement for the public article catalog. No network requests or third-party search service. */
(() => {
  const library = document.getElementById('article-library');
  if (!library) return;

  const search = document.getElementById('article-search');
  const count = document.getElementById('article-count');
  const empty = document.getElementById('articles-no-results');
  const reset = document.getElementById('article-reset');
  const cards = [...library.querySelectorAll('.article-card[data-category]')];
  const buttons = [...library.querySelectorAll('.article-filter[data-filter]')];
  let category = 'all';

  const normalize = (value) => (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();

  function update() {
    const lang = document.documentElement.lang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    const term = normalize(search.value);
    let visible = 0;

    for (const card of cards) {
      const matchesCategory = category === 'all' || card.dataset.category === category;
      // Search both translations so bilingual technical terms remain discoverable.
      const matchesText = !term || normalize((card.dataset.searchEn || '') + ' ' + (card.dataset.searchPt || '')).includes(term);
      const show = matchesCategory && matchesText;
      card.hidden = !show;
      if (show) visible += 1;
    }

    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    });
    if (count) count.textContent = lang === 'pt'
      ? `${visible} ${visible === 1 ? 'artigo encontrado' : 'artigos encontrados'}`
      : `${visible} ${visible === 1 ? 'article found' : 'articles found'}`;
    if (empty) empty.hidden = visible > 0;
  }

  search.addEventListener('input', update);
  buttons.forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.filter;
    update();
  }));
  reset?.addEventListener('click', () => {
    category = 'all';
    search.value = '';
    update();
    search.focus();
  });
  document.addEventListener('site:languagechange', () => {
    const lang = document.documentElement.lang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    search.placeholder = search.getAttribute('data-placeholder-' + lang) || '';
    update();
  });
  search.placeholder = search.getAttribute('data-placeholder-' + (document.documentElement.lang.toLowerCase().startsWith('pt') ? 'pt' : 'en')) || '';
  update();
})();
