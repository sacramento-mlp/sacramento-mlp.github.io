import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const outDir = resolve('dist');
const requiredRoutes = [
  '/',
  '/cv/',
  '/artigos/',
  '/produtos/diskguardian/',
  '/produtos/windows-technical-toolkit/',
  '/produtos/domain-admin-toolkit/'
];
const requiredAssets = [
  '/brand/ms-logo.png',
  '/js/preferences.js',
  '/js/preferences-init.js'
];
const failures = [];
const routeFile = (route) =>
  route === '/' ? join(outDir, 'index.html') : join(outDir, route.slice(1), 'index.html');

for (const route of requiredRoutes) {
  const file = routeFile(route);
  if (!existsSync(file)) {
    failures.push(`Missing route ${route} (${file})`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  if (!html.includes('href="/artigos/"')) failures.push(`Missing Articles navigation: ${route}`);
  if (!html.includes('/js/preferences.js')) failures.push(`Missing preferences script: ${route}`);
  if (!html.includes('ms-logo.png')) failures.push(`Missing brand reference: ${route}`);
  if (!html.includes('href="#main-content"')) failures.push(`Missing keyboard skip link: ${route}`);
  if (!/<main\b[^>]*\bid="main-content"[^>]*\btabindex="-1"/.test(html)) failures.push(`Missing focusable main content landmark: ${route}`);
  if (!html.includes('data-aria-pt="Navegação principal"')) failures.push(`Missing bilingual main navigation: ${route}`);
  // Share previews must identify the canonical URL, without inventing image metadata.
  const canonical = 'https://sacramento-mlp.github.io' + route;
  if (!html.includes('rel="canonical" href="' + canonical + '"')) failures.push(`Missing canonical URL: ${route}`);
  if (!html.includes('property="og:url" content="' + canonical + '"')) failures.push(`Missing Open Graph URL: ${route}`);
  if (!html.includes('property="og:title"')) failures.push(`Missing Open Graph title: ${route}`);
  if (!html.includes('property="og:description"')) failures.push(`Missing Open Graph description: ${route}`);
  if (!html.includes('name="twitter:card" content="summary"')) failures.push(`Missing social summary card: ${route}`);
  if (!html.includes('name="description"')) failures.push(`Missing meta description: ${route}`);


}
for (const asset of requiredAssets) {
  if (!existsSync(join(outDir, asset.slice(1)))) failures.push(`Missing public asset ${asset}`);
}

// Verify key internal links from built HTML resolve to an output page.
for (const route of requiredRoutes) {
  const file = routeFile(route);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href="(\/[^"#?]*\/)(?:#[^"]*)?"/g)) {
    const href = match[1];
    if (!existsSync(routeFile(href))) failures.push(`Broken route link ${route} → ${href}`);
  }
}
// Releasing an article requires an explicit editorial approval in source control.
const approvalFile = resolve('src/data/publication-approvals.json');
const approvals = existsSync(approvalFile)
  ? JSON.parse(readFileSync(approvalFile, 'utf8')).approvedSlugs
  : null;
if (!Array.isArray(approvals) || approvals.some(slug => typeof slug !== 'string')) {
  failures.push('Missing or invalid publication-approvals.json');
}
const approvedPaths = new Set((Array.isArray(approvals) ? approvals : []).map(slug => '/artigos/' + slug + '/'));
for (const route of approvedPaths) {
  const file = routeFile(route);
  if (!existsSync(file)) { failures.push(`Missing approved article route: ${route}`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!/<h1[^>]*data-pt="[^"]+"[^>]*data-en="[^"]+"/.test(html)) failures.push(`Missing bilingual article heading: ${route}`);
  if (!html.includes('/js/preferences.js')) failures.push(`Missing article language switch: ${route}`);
  if (route === '/artigos/inbox-zero-outlook/' && (!html.includes('article-table') || !html.includes('article-sources'))) failures.push('Missing Inbox Zero tables or references');
}
const listingFile = routeFile('/artigos/');
if (existsSync(listingFile)) {
  const listing = readFileSync(listingFile, 'utf8');
  for (const match of listing.matchAll(/class="article-card"[^>]*href="([^"]+)"/g)) {
    if (!approvedPaths.has(match[1])) failures.push(`Article listing lacks editorial approval: ${match[1]}`);
  }
  if (approvedPaths.size === 0 && listing.includes('id="article-library"')) {
    failures.push('Search controls should be absent when no article is approved');
  }
  for (const slug of approvedPaths) {
    if (!listing.includes('href="' + slug + '"')) failures.push(`Approved article not listed: ${slug}`);
  }
}
// The sitemap and RSS feed must list real public pages only.
const origin = 'https://sacramento-mlp.github.io';
const sitemapFile = join(outDir, 'sitemap.xml');
const rssFile = join(outDir, 'rss.xml');
const robotsFile = join(outDir, 'robots.txt');
for (const file of [sitemapFile, rssFile, robotsFile]) {
  if (!existsSync(file)) failures.push(`Missing search discovery resource: ${file}`);
}
if (existsSync(robotsFile)) {
  const robots = readFileSync(robotsFile, 'utf8');
  if (!robots.includes('Sitemap: ' + origin + '/sitemap.xml')) failures.push('robots.txt does not advertise sitemap.xml');
}
if (existsSync(sitemapFile)) {
  const sitemap = readFileSync(sitemapFile, 'utf8');
  for (const route of approvedPaths) if (!sitemap.includes('<loc>' + origin + route + '</loc>')) failures.push('Missing approved sitemap article: ' + route);
  for (const route of requiredRoutes) {
    if (!sitemap.includes('<loc>' + origin + route + '</loc>')) failures.push(`Missing sitemap location: ${route}`);
  }
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = match[1];
    if (!url.startsWith(origin + '/')) {
      failures.push(`Unexpected sitemap URL: ${url}`);
      continue;
    }
    const route = new URL(url).pathname;
    if (!existsSync(routeFile(route))) failures.push(`Sitemap URL has no generated page: ${route}`);
    if (route.startsWith('/artigos/') && route !== '/artigos/' && !approvedPaths.has(route)) {
      failures.push(`Unapproved sitemap article: ${route}`);
    }
  }
}
if (existsSync(rssFile)) {
  const feed = readFileSync(rssFile, 'utf8');
  for (const route of approvedPaths) if (!feed.includes('<link>' + origin + route + '</link>')) failures.push('Missing approved RSS article: ' + route);
  if (!feed.includes('<rss version="2.0">') || !feed.includes('<channel>')) failures.push('RSS feed missing required channel structure');
  for (const match of feed.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)) {
    const url = match[1].replace(/&amp;/g, '&');
    if (!url.startsWith(origin + '/artigos/')) {
      failures.push(`Unexpected RSS link: ${url}`);
      continue;
    }
    const articleRoute = new URL(url).pathname;
    if (!existsSync(routeFile(articleRoute))) failures.push(`RSS item has no public article page: ${url}`);
    if (!approvedPaths.has(articleRoute)) failures.push(`Unapproved RSS item: ${url}`);
  }
}
if (failures.length) {
  console.error('Build smoke test failed:\n' + [...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Build smoke test passed: ${requiredRoutes.length} routes, ${requiredAssets.length} assets, and linked pages.`);
}
