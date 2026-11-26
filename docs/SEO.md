# SEO operations — v1.1

## Scope and stable routes

English remains the default at existing URLs. European Portuguese uses /pt/ and equivalent paths. Shared Astro views render language-specific HTML on the server at build time. Language links are ordinary links and do not require JavaScript. Theme preference remains independent. No automatic redirection based on stored language.

Every localized page has its own canonical URL, reciprocal en / pt-PT / x-default alternates, localized descriptions and titles. The sitemap includes both languages; RSS feeds are /rss.xml and /pt/rss.xml. Draft articles remain excluded. Structured data describes the real professional profile and approved articles only; no fictitious reviews, offers, or ratings.

## Search Console (owner, no paid services)

1. Open https://search.google.com/search-console/ and add the URL-prefix property https://sacramento-mlp.github.io/ (not a Domain property for GitHub's shared domain).
2. Choose HTML file verification, download the exact Google-supplied file, and place it unmodified in public/ via a reviewed commit. Deploy and verify ownership. Never share credentials.
3. Submit https://sacramento-mlp.github.io/sitemap.xml under Sitemaps.
4. Inspect the English and Portuguese homepage, résumé and Inbox Zero article URLs. Request indexing for important URLs after the live inspection succeeds.
5. Review indexing and performance reports; submission is not a guarantee of indexing or ranking.

## Release verification

Run npm ci, npm test, npm run check, npm run verify:contrast, npm run build, npm run verify:dist.
Verify navigation, language selection, contact panel and theme on mobile and desktop. Inspect the live pages with Search Console, Google Rich Results Test and PageSpeed Insights. Record real results; no synthetic score is claimed.
Keep existing URLs, use permanent redirects only if later migrations require them, and avoid automatic language redirects.

## Editorial strategy

Initial proposed clusters (not approved for publication): Outlook Quick Steps, Search Folders, categories and rules linked to the existing Inbox Zero guide; Windows storage and maintenance linked to DiskGuardian; PowerShell and domain administration linked to relevant toolkits. Publish only original, verified and explicitly approved bilingual material. Add relevant internal links, reliable sources and useful titles; avoid keyword stuffing, generated filler and unsupported claims.

## Measurement

After ownership verification, record a baseline for indexed pages, impressions, clicks, CTR, search queries, average position, and page/device/country breakdown. Review monthly using comparable 28-day periods. Core Web Vitals require real field data; laboratory Lighthouse results are diagnostic, not equivalent to field metrics. No analytics or tracking scripts are introduced by this release.
