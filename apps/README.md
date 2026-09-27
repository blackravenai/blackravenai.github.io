# BlackRaven mobile portfolio

The public portfolio is `/apps/`, with dedicated pages for Squeezy Fish, DoodleLegs, AVERTED, Wax & Wane and STOPBRAINROT. Each product page is hand-designed and its truthful launch information is maintained independently. None offers a download until a verified store URL is available.

`catalog.json` records app descriptions. `node apps/generate.mjs` scaffolds **missing pages only** and never overwrites existing designed pages or launch disclosures. After adding a new catalog item, design its detail page and add a matching showcase to `/apps/index.html` and, if appropriate, `/projects.html`.

Do not replace the bespoke Squeezy Fish or DoodleLegs pages with generic generated pages. Preserve `/legal/` routes and app-specific policy disclosures when updating the studio.

`/apps/stopbrainrot/` is different: it's the app's own web Rot Check funnel (a built single-page app), published from the stopbrainrot repo with `npm run publish:web`. Don't edit it here — changes will be overwritten on the next publish.

`/apps/wax-and-wane/` also handles Kindred invitation links (`?kindred=CODE`) and hands them off to the app. `/.well-known/apple-app-site-association` and `assetlinks.json` make those links universal links — replace `TEAMID` and the Play signing fingerprint before launch. Keep the page's invite script working.
