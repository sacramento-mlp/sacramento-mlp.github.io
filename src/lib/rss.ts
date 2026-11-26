import type { Article } from '../data/articles';
import { origin, localPath, languageTag, type Language } from './locale';
const xml=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
export function articleFeed(articles: Article[], lang: Language) {
  const title=lang==='pt'?'Mário Sacramento — Artigos e Guias':'Mário Sacramento — Articles & Guides';
  const description=lang==='pt'?'Guias práticos de tecnologia, produtividade, Windows e automação.':'Practical technology guides about productivity, Windows and automation.';
  const items=[...articles].sort((a,b)=>b.date.localeCompare(a.date)).map(a=>{
    const url=origin+localPath('/artigos/'+encodeURIComponent(a.slug)+'/',lang);
    return '<item><title>'+xml(a.title[lang])+'</title><link>'+xml(url)+'</link><guid isPermaLink="true">'+xml(url)+'</guid><description>'+xml(a.summary[lang])+'</description><pubDate>'+new Date(a.date+'T12:00:00Z').toUTCString()+'</pubDate><category>'+xml(a.category)+'</category></item>';
  }).join('\n');
  const feed='<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>'+xml(title)+'</title><link>'+origin+localPath('/artigos/',lang)+'</link><description>'+xml(description)+'</description><language>'+languageTag(lang)+'</language><atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="'+origin+localPath('/rss.xml',lang)+'" rel="self" type="application/rss+xml"/>'+items+'</channel></rss>\n';
  return new Response(feed,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
}
