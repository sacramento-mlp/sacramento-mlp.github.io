# Articles & Guides — Editorial workflow

The public archive lives at `/artigos/`. Individual articles use `/artigos/<slug>/`.

## Source of truth

Edit `src/data/articles.ts`. Each article has:
- `slug`: stable, lowercase URL identifier
- `date`: ISO date (`YYYY-MM-DD`)
- `category`: `windows`, `powershell`, `security` or `development`
- `readMinutes`: estimated reading time
- `published`: publication gate, **false by default**
- `title`, `summary`: English and European Portuguese
- `sections`: headings and paragraphs in both languages

## Publishing procedure

1. Draft with `published: false`.
2. Check accuracy, commands, risks, privacy, references and spelling in **both** languages.
3. Ask for editorial approval before making the article public.
4. After approval, add the article slug to `src/data/publication-approvals.json`, set `published: true`, and set the correct publication date.
5. Confirm the GitHub Actions build succeeds, then inspect the article on mobile and desktop.

The build checks that articles shown publicly, indexed in the sitemap, or included in RSS are explicitly allowlisted. Unapproved drafts are excluded from the public listing and from generated article routes. This is a code-based workflow: **no CMS or editor login is configured**.

## Editorial principles

- Prioritize actionable, original, safe technical advice; do not copy third-party articles.
- Avoid unverified professional claims, exaggerated promises, affiliate promotions without disclosure, and untested destructive commands.
- Link to official documentation where appropriate.
- Distinguish factual guides from opinion and from product announcements.
- Do not publish sensitive personal information.
- Keep both language versions semantically aligned.

## Initial state

The catalog contains one **unpublished sample draft** about safely checking Windows storage. The archive displays an editorial preparation message until an article is approved and published.

## Search and category filters (v0.9.2)

When at least one approved article is published, the library automatically displays a bilingual search field and category filters. The client-side search is accent-insensitive and searches the approved articles' titles and summaries in both languages; the site does not send search terms to a server. If there are no published articles, the editorial preparation message remains visible and filters are not shown.

**Do not store confidential drafts in this repository:** source files are publicly readable even if their article routes are not generated.
