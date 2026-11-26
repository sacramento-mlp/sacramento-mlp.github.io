import { publishedArticles } from '../data/articles';
import { productCatalog } from '../data/products';
import { origin, localPath, languageTag, type Language } from '../lib/locale';
const permanentPaths=['/','/cv/','/artigos/',...productCatalog.map(p=>'/produtos/'+p.slug+'/')];
const xml=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const languages: Language[]=['en','pt'];
export function GET(){
  const pages=[...permanentPaths.map(path=>({path,date:undefined as string|undefined})),...publishedArticles.map(a=>({path:'/artigos/'+encodeURIComponent(a.slug)+'/',date:a.date}))];
  const urls=pages.flatMap(({path,date})=>languages.map(lang=>{
    const location=origin+localPath(path,lang);
    const alternates=languages.map(l=>'<xhtml:link rel="alternate" hreflang="'+languageTag(l)+'" href="'+xml(origin+localPath(path,l))+'"/>').join('');
    return '<url><loc>'+xml(location)+'</loc>'+(date?'<lastmod>'+xml(date)+'</lastmod>':'')+alternates+'<xhtml:link rel="alternate" hreflang="x-default" href="'+xml(origin+path)+'"/></url>';
  })).join('\n');
  return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+urls+'\n</urlset>\n',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
