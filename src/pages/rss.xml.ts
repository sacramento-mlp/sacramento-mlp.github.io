import { publishedArticles } from '../data/articles';

const origin = 'https://sacramento-mlp.github.io';
const xml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export function GET() {
  const items = [...publishedArticles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(article => {
      const url = origin + '/artigos/' + encodeURIComponent(article.slug) + '/';
      return [
        '<item>',
        '<title>' + xml(article.title.en) + '</title>',
        '<link>' + xml(url) + '</link>',
        '<guid isPermaLink="true">' + xml(url) + '</guid>',
        '<description>' + xml(article.summary.en) + '</description>',
        '<pubDate>' + new Date(article.date + 'T12:00:00Z').toUTCString() + '</pubDate>',
        '<category>' + xml(article.category) + '</category>',
        '</item>'
      ].join('');
    }).join('\n');
  const feed = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0"><channel>' +
    '<title>Mário Sacramento — Articles &amp; Guides</title>' +
    '<link>' + origin + '/artigos/</link>' +
    '<description>Practical technology articles and guides about Windows, automation and software development.</description>' +
    '<language>en</language>' +
    '<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="' + origin + '/rss.xml" rel="self" type="application/rss+xml" />' +
    items +
    '</channel></rss>\n';
  return new Response(feed, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
