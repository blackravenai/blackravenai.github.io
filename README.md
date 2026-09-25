# Black Raven studio

A complete static website for **www.blackravenai.com**, designed for the existing GitHub Pages publishing setup. No build step or server-side runtime is required.

## Local preview

From this folder, run `python3 -m http.server 4177 --bind 127.0.0.1` and open http://127.0.0.1:4177/.

## Pages

- `/` — studio homepage
- `/services.html` — capabilities, process, and FAQ
- `/projects.html` — selected products and internal studio work
- `/apps/` — mobile portfolio; existing Squeezy Fish and DoodleLegs product pages retained; AVERTED redesigned
- `/contact.html` — project email brief composer; `/apply.html` preserves the old entry point
- `/brand.html` — brand guide, logo downloads, copyable swatches, downloadable brand kit
- Existing legal URLs and `app-ads.txt` preserved

`studio.css` and `js/studio.js` power the studio pages. The bespoke mobile app pages retain their individual visual identities. Fonts and images are served locally. No new analytics, tracking cookies, or remote font requests are added to the studio pages.

## Contact behavior

The form validates fields and prepares an email. It does **not** submit to a backend or silently send mail. Visitors review the draft, then send it through their email client; copy and text download are alternatives. Project inquiries go to the established `support@blackravenai.com`; app support uses `support@blackravenai.com`.

## Brand assets

`assets/brand/black-raven-brand-kit.zip` includes SVG and transparent PNG marks/lockups, RGB/HEX swatches, font files/licenses, favicon assets, and the usage guide. Logo type is outlined. The hero uses the approved vector raven mark with subtle motion. The current identity uses cool neutral colors, Glacier blue, and upright Manrope typography.

## Validation

Run `python3 scripts/check-site.py` to check all connected internal links, image/script/style paths, and fragment targets. Browser validation should cover desktop/mobile layouts, menu and keyboard use, form validation and email preparation, FAQ/project disclosures, and downloads.

## Publishing

This preview is on branch `codex/blackraven-studio`, in an isolated worktree. Nothing has been published. The existing Pages configuration publishes the root of `main` in `blackravenai/blackravenai.github.io`. Preserve `CNAME`, `.nojekyll`, `app-ads.txt`, `/legal/`, and the individual app pages when integrating. Merge/push only after the owner reviews the local site. GitHub Pages will then publish the approved main branch.

Legacy `styles.css` / `script.js` are retained for compatibility but are not loaded by the redesigned studio pages. Corporate policy text was preserved while its surrounding presentation was updated; app-specific policy content was not rewritten.
