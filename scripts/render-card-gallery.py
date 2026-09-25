"""Build the static card gallery from the generated design catalog."""
from html import escape
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
cards = json.loads((root / 'assets/brand/cards/catalog.json').read_text())
portraits = sorted((c for c in cards if c['height'] > c['width']), key=lambda c: (c['number'] < 13, c['number']))
landscapes = sorted((c for c in cards if c['height'] < c['width']), key=lambda c: (c['number'] <= 3, c['number']))

def article(card):
    name, title = card['name'], escape(card['title'])
    portrait = card['height'] > card['width']
    w, h = card['width'] - 75, card['height'] - 75
    stem = f'/assets/brand/cards/{name}'
    badge = '<span class="card-new">NEW</span>' if card['number'] >= 13 else ('<span class="card-new">REFINED</span>' if card['number'] > 3 else '')
    return f'''<article class="business-card" data-card-family="{card['family']}" data-card-orientation="{'portrait' if portrait else 'landscape'}">
<div class="card-stage"><button class="card-flip{' is-portrait' if portrait else ''}" type="button" aria-describedby="card-contact-details" aria-label="Flip {title} business card to the contact side" aria-pressed="false" data-card-title="{title}"><span class="card-turn"><span class="card-face"><img src="{stem}-front-preview.png" alt="" width="{w}" height="{h}" loading="lazy"></span><span class="card-face card-back"><img src="{stem}-back-preview.png" alt="" width="{w}" height="{h}" loading="lazy"></span></span></button></div>
<div class="card-caption"><span>CONCEPT {card['number']:02d} {badge}</span><span class="flip-hint">Flip to contact side ↗</span></div>
<h3>{title}</h3><p>{escape(card['description'])}</p>
<div class="asset-downloads"><a href="{stem}-front.svg" download>Front SVG ↓</a><a href="{stem}-back.svg" download>Back SVG ↓</a></div></article>'''

section = '''<section class="business-section" id="business-cards"><div class="wrap">
<div class="section-heading"><div><span class="eyebrow">07 / A FIRST IMPRESSION YOU CAN HOLD</span><h2>Small card.<br><em>Lasting impression.</em></h2></div><div class="heading-aside"><p>A different orientation. A quieter signature. Seven portrait designs explore how much a small card can say with less. Alongside them, eleven landscape ideas to make your own.</p><a class="text-link" href="/output/pdf/black-raven-business-cards.pdf" download>Download all 18 as PDF ↓</a></div></div>
<div class="card-toolbar" hidden><div class="card-filters" role="group" aria-label="Filter business card concepts"><button type="button" data-card-filter="all" aria-pressed="true" aria-controls="business-gallery">All 18</button><button type="button" data-card-filter="portrait" aria-pressed="false" aria-controls="business-gallery">Portrait · 7</button><button type="button" data-card-filter="minimal" aria-pressed="false" aria-controls="business-gallery">Minimal</button><button type="button" data-card-filter="expressive" aria-pressed="false" aria-controls="business-gallery">Expressive</button><button type="button" data-card-filter="original" aria-pressed="false" aria-controls="business-gallery">Original three</button></div><p class="card-filter-status" role="status" aria-live="polite">18 concepts · 36 considered sides</p></div>
<p class="brand-sr-only" id="card-contact-details">The contact side of each card contains Christopher Shaw, Founder, support@blackravenai.com, and blackravenai.com.</p>
<div id="business-gallery"><section class="card-group" id="portrait-cards" aria-label="Portrait business cards"><div class="card-group-heading"><div><span class="eyebrow">THE PORTRAIT COLLECTION / 07</span><h3>A different point of view.</h3></div><p>2 × 3.5 inches. A familiar object, turned into something unexpected.</p></div><div class="business-grid portrait-grid">''' + '\n'.join(article(c) for c in portraits) + '''</div></section>
<section class="card-group" aria-label="Landscape business cards"><div class="card-group-heading"><div><span class="eyebrow">THE LANDSCAPE COLLECTION / 11</span><h3>Room to make your mark.</h3></div><p>3.5 × 2 inches. From a single symbol to a whole point of view.</p></div><div class="business-grid">''' + '\n'.join(article(c) for c in landscapes) + '''</div></section></div>
<p class="print-note">Tap a card to turn it over. The 36-page PDF includes all eighteen front/back pairs: eleven landscape designs at 3.5 × 2 inches and seven portraits at 2 × 3.5 inches. Each has 0.125-inch bleed and defined trim boxes. Outlined vector artwork in RGB; your printer can apply their production color profile. Use the SVGs to adapt the details or dimensions.</p></div></section>'''
page = root / 'brand.html'
source = page.read_text()
start = source.index('<section class="business-section"')
end = source.index('<section class="wrap brand-section', start)
page.write_text(source[:start] + section + source[end:])
print(f'Rendered {len(cards)} business card concepts into brand.html.')
