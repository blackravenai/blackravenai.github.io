# Search visibility

The static HTML contains all metadata and structured data. Crawlers do not need JavaScript to read the site. The publishing setup remains GitHub Pages with no build step.

## Maintaining a page

1. Add or update its entry in `seo/pages.json`. Titles and descriptions should describe the visible content naturally. Preserve truthful development/availability status.
2. Run `python3 scripts/sync-seo.py` after editing page metadata, scaffolding apps, or generating prototype policy pages.
3. Run `python3 scripts/check-site.py` and `python3 scripts/check-seo.py`.
4. Review locally, commit, deploy, and verify public URLs. Updating a page does not mean a search engine has recrawled it.

The sitemap contains the canonical public studio, app, and official app support/policy pages. It excludes the brand library, 404 page, old contact alias, and generated prototype legal pages. Brand/prototype pages use `noindex, follow`; robots.txt deliberately allows crawling so search engines can read that directive. Their URLs remain accessible. This is indexing control, not access control.

The old `/apply.html` URL uses an immediate HTML redirect to `/contact.html` and the destination canonical URL. GitHub Pages does not offer custom server-side redirect rules in this publishing configuration.

## Structured data and previews

- Organization and WebSite markup identify BlackRaven, its approved logo, slogan, and support email.
- Service markup describes the real product design, software development, and applied AI offerings shown on the services page.
- Collection pages describe the three current apps through an ItemList.
- Unreleased apps do not receive fabricated ratings, reviews, prices, store links, or SoftwareApplication rich-result claims. Add verified store information when products launch.
- Social previews are 1200 × 630 PNGs. `scripts/build-seo-assets.py` creates the outlined SVG sources/PNG exports and compact Latin WOFF2 web fonts. It requires Python `fonttools[woff]` and Node `sharp` at design time. Full source fonts and licenses remain unchanged.
- The four main headline/body/control/wordmark font files decreased from 433,136 to 194,688 bytes (about 55%). This is a transfer-size measurement, not a measured Core Web Vitals improvement.

## Search Console

The existing verified property is `sc-domain:blackravenai.com`. Use its Sitemaps report to submit `https://www.blackravenai.com/sitemap.xml` after deployment. Use URL Inspection for the homepage and important updated pages. Request indexing only after the live page passes; a successful request is not a guarantee of indexing or ranking.

At the start of this work, the property overview reported two indexed pages and the Submitted sitemaps table was empty. These reports lag behind the live site. There was no Core Web Vitals field data available in the overview.

## Continuing organic growth

Publish useful individual app pages and verified store links as apps launch. Add real project case studies that explain the problem, design/engineering decisions, and outcome when those details can be shared. Keep support and launch information current. Review Search Console queries and page impressions before creating additional service content. Avoid manufactured reviews, paid ranking links, keyword-stuffed pages, and unverified location claims.

Reference guidance:

- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Noindex rules](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
