"""Generate static search metadata. Python standard library; no publishing runtime."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import argparse
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.blackravenai.com'
PAGES = json.loads((ROOT / 'seo/pages.json').read_text())
START, END = '<!-- Search metadata -->', '<!-- /Search metadata -->'
ORGANIZATION = {
    '@type': 'Organization', '@id': ORIGIN + '/#organization',
    'name': 'BlackRaven', 'alternateName': 'BlackRaven AI',
    'legalName': 'BlackRaven AI LLC', 'url': ORIGIN + '/',
    'logo': ORIGIN + '/assets/brand/mono/tile-light.png',
    'email': 'support@blackravenai.com', 'slogan': 'Make something matter.',
    'description': 'An independent software studio designing and developing web and mobile apps, games, and AI experiences.',
    'contactPoint': {'@type': 'ContactPoint', 'contactType': 'customer support',
                     'email': 'support@blackravenai.com', 'url': ORIGIN + '/contact.html'}
}
SITE = {'@type': 'WebSite', '@id': ORIGIN + '/#website', 'url': ORIGIN + '/',
        'name': 'BlackRaven', 'alternateName': 'BlackRaven AI', 'inLanguage': 'en',
        'publisher': {'@id': ORGANIZATION['@id']}}
IMAGES = {
    'studio': 'BlackRaven raven symbol with Make something matter, software, design and AI.',
    'squeezy-fish': 'Squeezy Fish ocean survival gameplay by BlackRaven.',
    'doodlegs': 'DoodleLegs draw-and-run gameplay by BlackRaven.',
    'averted': 'AVERTED astronomy observing planner by BlackRaven.'
}


class Head(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta = {}; self.title = ''; self.in_title = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title': self.in_title = True
        if tag == 'meta': self.meta[attrs.get('name', attrs.get('property', ''))] = attrs.get('content', '')
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
    def handle_data(self, text):
        if self.in_title: self.title += text


def meta(name, content, prop=False):
    return f'<meta {"property" if prop else "name"}="{name}" content="{escape(content, quote=True)}">'


def schema(page, title, description, image):
    url = ORIGIN + page['url']
    item = {'@type': page['type'], '@id': url + '#webpage', 'url': url,
            'name': title, 'description': description, 'inLanguage': 'en',
            'isPartOf': {'@id': SITE['@id']}, 'about': {'@id': ORGANIZATION['@id']},
            'primaryImageOfPage': {'@type': 'ImageObject', 'url': image, 'width': 1200, 'height': 630}}
    graph = [ORGANIZATION, SITE, item]
    if page['file'] == 'services.html':
        services = [('product', 'Product strategy and experience design', 'Product discovery, UX flows, interface design, and interactive prototypes.'),
                    ('engineering', 'Custom software development', 'Web and mobile applications, business tools, APIs, integrations, and release preparation.'),
                    ('ai', 'Applied AI development', 'Assistants, knowledge experiences, automations, and model and tool integrations.')]
        graph += [{'@type': 'Service', '@id': url + '#' + anchor, 'url': url + '#' + anchor,
                   'name': name, 'description': desc, 'provider': {'@id': ORGANIZATION['@id']}}
                  for anchor, name, desc in services]
        item['mainEntity'] = [{'@id': url + '#' + anchor} for anchor, _, _ in services]
    if page['file'] in ('apps/index.html', 'projects.html'):
        graph.append({'@type': 'ItemList', '@id': url + '#apps', 'name': 'Original BlackRaven apps',
                      'itemListElement': [{'@type': 'ListItem', 'position': i, 'name': name,
                                           'url': ORIGIN + '/apps/' + slug + '/'}
                                          for i, (slug, name) in enumerate([('squeezy-fish', 'Squeezy Fish'), ('doodlegs', 'DoodleLegs'), ('averted', 'AVERTED')], 1)]})
        item['mainEntity'] = {'@id': url + '#apps'}
    # Unreleased apps have no invented ratings, prices, store URLs, or rich-result offers.
    return {'@context': 'https://schema.org', '@graph': graph}


def render_page(page):
    source = (ROOT / page['file']).read_text()
    head, body = source.split('</head>', 1)
    current = Head(); current.feed(head)
    title = page.get('title', current.title)
    description = page.get('description', current.meta.get('description', ''))
    head = re.sub(re.escape(START) + '.*?' + re.escape(END), '', head, flags=re.S)
    head = re.sub(r'<title>.*?</title>', '', head, flags=re.S | re.I)
    def remove_managed_tag(match):
        tag = match.group()
        parser = Head(); parser.feed(tag)
        if any(k in ('description', 'robots') or k.startswith(('og:', 'twitter:')) for k in parser.meta): return ''
        return tag
    head = re.sub(r'<meta\b[^>]*>', remove_managed_tag, head, flags=re.I)
    head = re.sub(r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>', '', head, flags=re.I)
    head = re.sub(r'[ \t]+\n', '\n', head)
    lines = [START, f'<title>{escape(title)}</title>', meta('description', description),
             f'<link rel="canonical" href="{ORIGIN + page["url"]}">']
    if page.get('redirect'):
        lines.append(f'<meta http-equiv="refresh" content="0; url={page["redirect"]}">')
    else:
        lines.append(meta('robots', page.get('robots', 'index, follow, max-image-preview:large')))
        image_name = page.get('image', 'studio')
        image = ORIGIN + f'/assets/social/{image_name}.png'
        for name, value in {'type': 'website', 'site_name': 'BlackRaven', 'locale': 'en_US',
                            'title': title, 'description': description, 'url': ORIGIN + page['url'],
                            'image': image, 'image:width': '1200', 'image:height': '630',
                            'image:type': 'image/png', 'image:alt': IMAGES[image_name]}.items():
            lines.append(meta('og:' + name, value, prop=True))
        for name, value in {'card': 'summary_large_image', 'title': title, 'description': description,
                            'image': image, 'image:alt': IMAGES[image_name]}.items():
            lines.append(meta('twitter:' + name, value))
        if page.get('sitemap'):
            data = json.dumps(schema(page, title, description, image), ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
            lines.append(f'<script type="application/ld+json">{data}</script>')
    # Preload only the display font actually needed for the studio's first screen.
    if '/studio.css?' in head:
        lines.append('<link rel="preload" href="/assets/fonts/inter-light-latin.woff2" as="font" type="font/woff2" crossorigin>')
    lines.append(END)
    return head.rstrip() + '\n' + '\n'.join(lines) + '\n</head>' + body


def outputs():
    for page in PAGES: yield ROOT / page['file'], render_page(page)
    # Prototype policy URLs remain accessible to users and app-store reviewers.
    # Do not Disallow them: crawlers must read the noindex directive.
    for path in sorted((ROOT / 'legal').glob('factory-*/*.html')):
        source = path.read_text()
        tag = '<meta name="robots" content="noindex, follow" />'
        pattern = r'<meta\b(?=[^>]*name=["\']robots["\'])[^>]*>'
        result, count = re.subn(pattern, tag, source, flags=re.I)
        if not count: result = source.replace('</head>', tag + '</head>', 1)
        yield path, result
    ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    ET.register_namespace('', ns)
    sitemap = ET.Element('{' + ns + '}urlset')
    for page in PAGES:
        if page.get('sitemap'):
            entry = ET.SubElement(sitemap, '{' + ns + '}url')
            ET.SubElement(entry, '{' + ns + '}loc').text = ORIGIN + page['url']
    ET.indent(sitemap)
    yield ROOT / 'sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(sitemap, encoding='unicode') + '\n'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail when generated metadata needs updating.')
    args = parser.parse_args(); changed = []
    for path, content in outputs():
        if path.read_text() != content:
            changed.append(str(path.relative_to(ROOT)))
            if not args.check: path.write_text(content)
    print(f'{"Outdated" if args.check else "Updated"}: {len(changed)} files; {len(PAGES)} managed pages.')
    if args.check and changed:
        print('\n'.join(changed)); raise SystemExit(1)
