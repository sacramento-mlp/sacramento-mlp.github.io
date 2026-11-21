import { publishedArticles } from '../data/articles';

const origin = 'https://sacramento-mlp.github.io';
const permanentPaths = [
  '/',
  '/cv/',
  '/artigos/',
  '/produtos/diskguardian/',
  '/produtos/windows-technical-toolkit/',
  '/produtos/domain-admin-toolkit/'
];
const encode = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const entries = [
    ...permanentPaths.map(path => ({ url: origin + path, updated: undefined as string | undefined })),
    ...publishedArticles.map(article => ({ url: origin + '/artigos/' + encodeURIComponent(article.slug) + '/', updated: article.date }))
  ];
  const urls = entries.map(({ url, updated }) =>
    '  <url><loc>' + encode(url) + '</loc>' +
    (updated ? '<lastmod>' + encode(updated) + '</lastmod>' : '') +
    '</url>'
  ).join('\n');

  return new Response('<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n', {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
