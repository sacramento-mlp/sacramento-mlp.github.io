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
4. Set `published: true` only after approval and set the correct publication date.
5. Confirm the GitHub Actions build succeeds, then inspect the article on mobile and desktop.

Unapproved drafts are excluded from the public listing and from generated article routes. This is a code-based workflow: **no CMS or editor login is configured**.

## Editorial principles

- Prioritize actionable, original, safe technical advice; do not copy third-party articles.
- Avoid unverified professional claims, exaggerated promises, affiliate promotions without disclosure, and untested destructive commands.
- Link to official documentation where appropriate.
- Distinguish factual guides from opinion and from product announcements.
- Do not publish sensitive personal information.
- Keep both language versions semantically aligned.

## Initial state

The catalog contains one **unpublished sample draft** about safely checking Windows storage. The archive displays an editorial preparation message until an article is approved and published.
