import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('editorial selection requires publication flag AND explicit approval', () => {
  const source = read('src/data/articles.ts');
  const approvals = JSON.parse(read('src/data/publication-approvals.json'));
  assert.ok(Array.isArray(approvals.approvedSlugs));
  assert.match(source, /new Set(?:<string>)?\(publicationApprovals\.approvedSlugs\)/);
  assert.match(source, /article\.published\s*&&\s*approvedSlugs\.has\(article\.slug\)/);
});

test('article routes, RSS and sitemap use the approved published catalog', () => {
  for (const path of ['src/pages/artigos/[slug].astro', 'src/views/ArticleIndex.astro', 'src/pages/rss.xml.ts', 'src/pages/sitemap.xml.ts']) {
    assert.match(read(path), /publishedArticles/, path);
  }
});

function simulateTheme(lang, initial = {}, blockedStorage = false) {
  const values = new Map(Object.entries(initial));
  const button = { attributes: {}, handlers: {}, setAttribute(name,value){this.attributes[name]=value;}, addEventListener(name,callback){this.handlers[name]=callback;} };
  const root={lang,dataset:{theme:'dark'}};
  const document={documentElement:root,getElementById(id){return id==='theme'?button:null;}};
  const localStorage={getItem(key){if(blockedStorage)throw Error('blocked');return values.get(key)??null;},setItem(key,value){if(blockedStorage)throw Error('blocked');values.set(key,value);}};
  const context={document,localStorage};
  runInNewContext(read('public/js/preferences-init.js'),context);
  runInNewContext(read('public/js/preferences.js'),context);
  return {root,button,values};
}
test('URL language is stable and theme preference is restored independently',()=>{
  const pt=simulateTheme('pt-PT',{lang:'en',theme:'light'});
  assert.equal(pt.root.lang,'pt-PT');
  assert.equal(pt.root.dataset.theme,'light');
  pt.button.handlers.click();
  assert.equal(pt.root.dataset.theme,'dark');
  assert.equal(pt.values.get('theme'),'dark');
  assert.equal(pt.button.attributes['aria-label'],'Ativar tema claro');
  const en=simulateTheme('en',{lang:'pt',theme:'dark'});
  assert.equal(en.root.lang,'en');
});
test('theme remains usable with blocked storage',()=>{
  const app=simulateTheme('pt-PT',{},true);
  assert.equal(app.root.lang,'pt-PT');
  app.button.handlers.click();
  assert.equal(app.root.dataset.theme,'light');
});
test('language switch is a crawlable link',()=>{
  assert.match(read('src/components/SiteHeader.astro'), /<a[^>]*id="lang"[^>]*href=\{alternate\}/);
});
test('shared navigation preserves the six public destinations', () => {
  const header = read('src/components/SiteHeader.astro');
  const home = read('src/views/Home.astro');
  const cv = read('src/views/Resume.astro');
  const products = read('src/views/ProductDetail.astro');
  assert.match(header, /href:\s*'\/cv\/'/);
  assert.match(header, /href:\s*'\/artigos\/'/);
  assert.match(header, /'#sobre'/);
  assert.match(header, /'#produtos'/);
  assert.match(header, /'#contacto'/);
  assert.match(home, /slug:'diskguardian'/);
  assert.match(home, /slug:'windows-technical-toolkit'/);
  assert.match(home, /slug:'domain-admin-toolkit'/);
  assert.match(cv, /<SiteHeader\s+current="cv"/);
  assert.match(products, /SiteHeader/);
});

test('public page templates retain keyboard skip links and a focusable main region', () => {
  for (const path of ['src/views/Home.astro', 'src/views/Resume.astro', 'src/views/ArticleIndex.astro', 'src/views/ArticleDetail.astro']) {
    const page = read(path);
    assert.match(page, /class="skip-link"\s+href="#main-content"/, path);
    assert.match(page, /<main\s+id="main-content"\s+tabindex="-1"/, path);
    assert.match(page, /<SiteHeader/, path);
    assert.match(page, /<SiteFooter/, path);
  }
});

test('production deployment remains restricted to main', () => {
  const workflow = read('.github/workflows/deploy.yml');
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run check/);
  assert.doesNotMatch(workflow, /branches:\s*\[[^\]]*develop/);
});

 test('homepage and résumé share the visible professional email panel', () => {
  const panel = read('src/components/ContactPanel.astro');
  assert.match(panel, /sacramento\.mlp\.it@gmail\.com/);
  assert.match(panel, /data-email-address/);
  assert.match(panel, /data-copy-email/);
  assert.match(panel, /navigator\.clipboard\.writeText/);
  for (const path of ['src/views/Home.astro', 'src/views/Resume.astro']) {
    const page = read(path);
    assert.match(page, /<ContactPanel\s*\/>/, path);
    assert.doesNotMatch(page, /sacramento\.mlp\.it@gmail\.com/, path);
  }
});

 test('contact sections share the responsive side-by-side layout', () => {
  for (const path of ['src/views/Home.astro', 'src/views/Resume.astro']) {
    const page = read(path);
    assert.match(page, /class="contact-section"><div class="wrap contact-inner"><div>/, path);
    assert.match(page, /<\/p><\/div><ContactPanel\s*\/><\/div><\/section>/, path);
  }
});

 test('Inbox Zero guide has complete bilingual content and explicit approval', () => {
  const article = JSON.parse(read('src/data/inbox-zero-outlook.json'));
  const approvals = JSON.parse(read('src/data/publication-approvals.json'));
  assert.equal(article.published, true);
  assert.ok(approvals.approvedSlugs.includes(article.slug));
  const checkPair = pair => { for (const lang of ['en','pt']) assert.ok(typeof pair[lang] === 'string' && pair[lang].trim()); };
  checkPair(article.title); checkPair(article.summary);
  for (const section of article.sections) {
    checkPair(section.heading); section.paragraphs.forEach(checkPair);
    if (section.table) { section.table.headers.forEach(checkPair); for (const row of section.table.rows) { assert.equal(row.length, section.table.headers.length); row.forEach(checkPair); } }
  }
  for (const source of article.sources) { checkPair(source.label); assert.match(source.url, /^https:\/\/(support\.microsoft\.com|learn\.microsoft\.com)\//); }
  assert.match(read('src/views/ArticleDetail.astro'), /article\.sources/);
  assert.match(read('src/views/Home.astro'), /latestArticle\.slug/);
});

 test('both locale routes share views and the article approval filter',()=>{
  for(const path of ['index.astro','cv.astro','artigos/index.astro','artigos/[slug].astro','produtos/[slug].astro']){
    const en=read('src/pages/'+path),pt=read('src/pages/pt/'+path);
    assert.match(en,/views\//);assert.match(pt,/views\//);
    if(path==='artigos/[slug].astro'){assert.match(en,/publishedArticles/);assert.match(pt,/publishedArticles/);}
  }
  assert.match(read('src/components/SeoHead.astro'), /hreflang="pt-PT"/);
  assert.match(read('src/components/SeoHead.astro'), /application\/ld\+json/);
});
