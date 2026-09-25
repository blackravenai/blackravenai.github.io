# Local review / Black Raven studio

Status: complete local preview; not published.

Preview: http://127.0.0.1:4177/
Brand guide: http://127.0.0.1:4177/brand.html
Branch: codex/blackraven-studio

## Verified

- 19 connected public pages: local page, asset, and fragment targets all resolve.
- Desktop (1440px), tablet (768px), phone (390px), and narrow phone (320px) checks.
- Mobile navigation opens, closes with Escape, and returns focus to its control.
- Contact form rejects empty input, produces a truthful email draft with correct recipient/content, supports copying, and returns to editing without losing the brief. No email was sent.
- Brand HEX copying works. Downloadable ZIP contains 22 files and passes archive integrity validation.
- Service FAQs and one-at-a-time studio project accordions work.
- Loaded images and local fonts checked; no browser errors observed in the inspected flows.
- Reduced-motion CSS disables motion and leaves content visible; native links and disclosures do not depend on animation.
- App page generator run against existing pages: every designed page preserved byte-for-byte.
- Corporate policy text is preserved exactly. App-specific legal pages, app-ads.txt, and CNAME unchanged.
- JavaScript syntax check and git diff whitespace check pass.

## Intentional behavior

The inquiry form prepares an email for the visitor to send. There is no backend submission service, consistent with static GitHub Pages hosting. Copy and text download provide alternatives to an installed mail app.

All mobile apps retain pre-launch status. No store buttons or unverified release claims were introduced. The shelved K2/v2 project is not featured.

To publish after review, integrate this branch into the existing GitHub Pages repository's main branch. Preserve all app-specific pages, legal paths, domain configuration, and seller declarations. No remote push or deployment has been performed.

## Identity refinement / owner feedback

- Approved raven mark, mobile menu, app-card motion, and original copy preserved.
- Wing artwork removed; hero now uses the approved vector mark and subtle construction-line motion.
- Studio palette changed to Raven, Silver, Glacier blue, Slate, and Cloud; brand downloads regenerated.
- All studio type uses upright Manrope; retired serif font removed from the kit.
- Services now pair product/engineering/AI copy with linked, animated product-screen compositions. Portfolio and contact introductions also have product visuals.
- All site contact references, email draft recipients, brief downloads, and documentation use support@blackravenai.com. No previous contact address remains in the working site.
- Revised pages verified at 390px and 320px with no horizontal overflow, broken loaded images, or italic emphasis. Desktop hero, portfolio, contact, and service visuals inspected.
- Inquiry draft verified with support recipient; no email sent. Direct homepage-to-engineering navigation verified.
- Brand kit integrity and all 19 connected routes/assets/fragment targets pass.

Still a local preview; no deployment.
