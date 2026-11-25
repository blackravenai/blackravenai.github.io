# Circuit Quest landing page

Public URL after deployment: `https://www.blackravenai.com/apps/circuit-quest/`.

This is a buildless marketing page, not the Circuit Quest web application. Its download links point to the verified public iOS listing. Do not add Android or browser-play availability until those public destinations work.

## Assets

- Original `simulation.png`, `puzzle-bench.png`, and `quest-map.png` came from the Circuit Quest repo's `store/screenshots/review-2026-11-18/iphone/` captures.
- `build-steps.png` came from `store/screenshots/review-2026-11-01/iphone/04-build-steps.png`.
- WebP copies are resized originals. The app UI is not recreated or altered.
- The press ZIP contains the four original PNGs, the 512px app icon, and `fact-sheet.txt`.
- Pixelify is locally served under its included OFL license. The page uses the site's local Inter fonts.
- `/assets/social/circuit-quest.png` is a 1200 by 630 original layout incorporating an actual app screenshot.

The LED illustration is labeled as a teaching illustration. The mini lesson is based on the app's `rp-never-lit` repair puzzle and links to Arduino's original Blink wiring example.

## Metadata

The page and portfolio description are registered in `seo/pages.json`. `scripts/sync-seo.py` now supports an optional page-specific `apps` list so the portfolio's structured data can preserve its actual linked products.

The repository already had a mismatch between its broader SEO manifest and sitemap before this change. Do not run a global metadata regeneration and accidentally remove other existing product URLs. This change preserves every existing sitemap entry and adds only Circuit Quest.

## Review

Reviewed November 24, 2026 at 1440px, 390px, and 320px widths: no horizontal overflow, all images load, dark background, one H1, working lesson disclosure and mobile menu, and a successful press ZIP response. `git diff --check` passes. Existing whole-site failures remain: the STOPBRAINROT app shell has no static H1, and the older sitemap/SEO manifest entries differ.

Publish through the site's existing GitHub Pages root-of-main workflow. No build step, new service, tracking, or paid dependency was added.
