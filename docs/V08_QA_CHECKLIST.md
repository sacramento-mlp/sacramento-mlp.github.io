# v0.8 — Manual accessibility and mobile QA

The automated build, route and color-token checks are **not** a substitute for a real browser audit. Before marking v0.8 complete, inspect the live deployment on an Android browser and a desktop browser.

## Keyboard
- [ ] Press Tab on each page. The first visible focus item is “Skip to main content” / “Saltar para o conteúdo principal”.
- [ ] Press Enter on that link. Focus moves to `main#main-content` and bypasses navigation.
- [ ] Every navigation link, button and card displays a visible focus indicator.
- [ ] Every interactive element can be reached and operated without a mouse.
- [ ] No keyboard trap is present.

## Language and theme
- [ ] Default theme is dark; default language is English when there are no saved preferences.
- [ ] Switching PT/EN updates page labels, skip link and accessible control names.
- [ ] Theme toggle changes color palette; state persists across page navigation and reloads.
- [ ] Dark and light text, actions, cards and focus states remain legible.

## Layout
- [ ] Check 320, 360, 390, 768 and desktop-width viewports.
- [ ] All five header links remain available, without clipped labels or off-screen scrolling.
- [ ] No body-level horizontal scrolling appears.
- [ ] Approved D4 logo is intact, not distorted or replaced.
- [ ] Headings are readable and content cards do not overlap.
- [ ] `/artigos/` renders correctly with zero published articles.

## Performance
- [ ] Record Lighthouse performance and accessibility reports on deployed mobile and desktop pages.
- [ ] Inspect image dimensions, layout shifts and total transferred assets.
- [ ] Verify the JavaScript works with restricted localStorage.

## Release gate
Run `npm run build`, `npm run verify:dist`, and `npm run verify:contrast`. Confirm a successful GitHub Pages deployment. Do not claim WCAG compliance, browser-tested accessibility or measured performance without performing those tests.

## Next phase
v0.9 covers editorial library search/filtering, sitemap, robots.txt and RSS; only reviewed and approved articles may be included in public feeds and routes.
