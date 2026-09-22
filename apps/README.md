# Mobile app portfolio pages

One domain and one page per app, independent of any ad provider. These pages describe mobile apps; they do not make them playable on the web.

- `/apps/` — portfolio index
- `/apps/squeezy-fish/`
- `/apps/doodlegs/`
- `/apps/averted/`

Add a catalog entry and run `node apps/generate.mjs` from the website root. Review the generated static pages before publishing. No external fonts, trackers, ad SDKs or signup form are included.

All pages explicitly state pre-launch status; do not add store badges or links until their public destinations work. Existing legal templates need separate child-audience/SDK review before linking them as final launch policies.

Provider onboarding: a working product page is not proof that Kidoz accepts it instead of a store URL. Obtain provider acceptance or manual pre-launch onboarding. Use one BlackRaven publisher account with distinct app/platform entries if supported; never reuse one game's app/ad identifiers for other games.
