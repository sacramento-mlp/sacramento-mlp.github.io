# v0.9.3 — SEO, social sharing and release review

## Scope delivered
- Homepage, résumé, product detail, article archive and published article details now include canonical URL, Open Graph title/description/URL, site name/locale and an explicit text-summary social card.
- Sitemap, robots and RSS (v0.9.1) continue to include only generated public content.
- Search and category filters (v0.9.2) remain hidden until at least one article has been explicitly approved.
- `scripts/verify-dist.mjs` checks the presence of core metadata on the six required public routes.

## Manual verification required
- [ ] Open the six public routes on Android Chrome and desktop.
- [ ] Check page titles, descriptions and canonical URLs in generated HTML.
- [ ] Share the homepage, CV, article index and a product URL: confirm title and description are appropriate.
- [ ] Check both language settings, both color themes and navigation for visual regressions.
- [ ] Validate keyboard navigation and screen-reader semantics where practical.
- [ ] Measure Lighthouse mobile/desktop performance and accessibility using an actual browser; retain evidence.
- [ ] Inspect that sitemap and RSS do not expose any unapproved draft.
- [ ] Review final wording of professional profile/product pages for accurate and non-misleading claims.

## Explicit limitations
- Social previews are **text summaries**, not designed social images. No `og:image` was added. A future D4 social preview needs a reviewed branded image.
- English is the default HTML language; PT is client-side translation on the same URL. Do not declare separate Portuguese `hreflang` URLs that do not exist.
- Google or other indexing is not guaranteed by implementing a sitemap.
- A successful build does not establish WCAG conformance or measured performance.
- `src/data/articles.ts` is in a public source repository even when articles are not published on the site. Do not add confidential draft material.

## Release gate before v1.0
1. Confirm latest GitHub Actions build and Pages deploy succeed.
2. Confirm manual QA items and record any open issues.
3. Review editorial/publication gates.
4. Write the final cross-conversation handoff with verified commit, routes, decisions, limitations and next tasks.
5. Start **v1.0 in a new conversation**, not in this one.
