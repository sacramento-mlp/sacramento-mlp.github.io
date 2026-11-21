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
  }
}
if (existsSync(rssFile)) {
  const feed = readFileSync(rssFile, 'utf8');
  if (!feed.includes('<rss version="2.0">') || !feed.includes('<channel>')) failures.push('RSS feed missing required channel structure');
  for (const match of feed.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)) {
    const url = match[1].replace(/&amp;/g, '&');
    if (!url.startsWith(origin + '/artigos/')) {
      failures.push(`Unexpected RSS link: ${url}`);
      continue;
    }
    if (!existsSync(routeFile(new URL(url).pathname))) failures.push(`RSS item has no public article page: ${url}`);
  }
}
if (failures.length) {
  console.error('Build smoke test failed:\n' + [...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Build smoke test passed: ${requiredRoutes.length} routes, ${requiredAssets.length} assets, and linked pages.`);
}
