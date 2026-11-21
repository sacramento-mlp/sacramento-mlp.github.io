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
if (failures.length) {
  console.error('Build smoke test failed:\n' + [...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Build smoke test passed: ${requiredRoutes.length} routes, ${requiredAssets.length} assets, and linked pages.`);
}
