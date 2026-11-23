import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('editorial selection requires publication flag AND explicit approval', () => {
  const source = read('src/data/articles.ts');
  const approvals = JSON.parse(read('src/data/publication-approvals.json'));
  assert.ok(Array.isArray(approvals.approvedSlugs));
  assert.match(source, /new Set\(publicationApprovals\.approvedSlugs\)/);
  assert.match(source, /article\.published\s*&&\s*approvedSlugs\.has\(article\.slug\)/);
});

test('article routes, RSS and sitemap use the approved published catalog', () => {
  for (const path of ['src/pages/artigos/[slug].astro', 'src/pages/artigos/index.astro', 'src/pages/rss.xml.ts', 'src/pages/sitemap.xml.ts']) {
    assert.match(read(path), /publishedArticles/, path);
  }
});

function simulatePreferences(initial = {}, blockedStorage = false) {
  const values = new Map(Object.entries(initial));
  const buttons = Object.fromEntries(['lang', 'theme'].map(id => [id, {
    textContent: '', attributes: {}, handlers: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { this.handlers[name] = callback; }
  }]));
  const label = {
    textContent: 'English', attributes: { 'data-en': 'English', 'data-pt': 'Português' },
    getAttribute(key) { return this.attributes[key]; }
  };
  const root = { lang: 'en', dataset: { theme: 'dark' } };
  const document = {
    documentElement: root,
    getElementById(id) { return buttons[id]; },
    querySelectorAll(selector) { return selector === '[data-pt][data-en]' ? [label] : []; },
    dispatchEvent() {}
  };
  const localStorage = {
    getItem(key) { if (blockedStorage) throw Error('blocked'); return values.get(key) ?? null; },
    setItem(key, value) { if (blockedStorage) throw Error('blocked'); values.set(key, value); }
  };
  const context = { document, localStorage, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } } };
  runInNewContext(read('public/js/preferences-init.js'), context);
  runInNewContext(read('public/js/preferences.js'), context);
  return { root, buttons, label, values };
}

test('preferences restore and toggle Portuguese/English and light/dark', () => {
  const app = simulatePreferences({ lang: 'pt', theme: 'light' });
  assert.equal(app.root.lang, 'pt');
  assert.equal(app.root.dataset.theme, 'light');
  assert.equal(app.label.textContent, 'Português');
  app.buttons.lang.handlers.click();
  app.buttons.theme.handlers.click();
  assert.equal(app.root.lang, 'en');
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(app.values.get('lang'), 'en');
  assert.equal(app.values.get('theme'), 'dark');
});

test('preferences remain usable when local storage is unavailable', () => {
  const app = simulatePreferences({}, true);
  assert.equal(app.root.lang, 'en');
  assert.equal(app.root.dataset.theme, 'dark');
  app.buttons.lang.handlers.click();
  app.buttons.theme.handlers.click();
  assert.equal(app.root.lang, 'pt');
  assert.equal(app.root.dataset.theme, 'light');
});
