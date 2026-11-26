export type Language = 'en' | 'pt';
export const origin = 'https://sacramento-mlp.github.io';
export function locale(pathname: string): Language {
  return pathname === '/pt' || pathname.startsWith('/pt/') ? 'pt' : 'en';
}
export function englishPath(pathname: string): string {
  return pathname === '/pt' ? '/' : pathname.startsWith('/pt/') ? pathname.slice(3) : pathname;
}
export function localPath(pathname: string, lang: Language): string {
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return pathname;
  const path = englishPath(pathname);
  return lang === 'pt' ? '/pt' + path : path;
}
export function languageTag(lang: Language) { return lang === 'pt' ? 'pt-PT' : 'en'; }
