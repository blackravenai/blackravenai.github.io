"""Check search metadata, indexing rules, schema, previews, and sitemap consistency."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.robotparser import RobotFileParser
import json
import struct
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.blackravenai.com'
PAGES = json.loads((ROOT / 'seo/pages.json').read_text())


class Document(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta = {}; self.links = []; self.ids = []; self.h1 = 0
        self.titles = []; self.data = []; self.capture = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'meta': self.meta.setdefault(a.get('name', a.get('property', a.get('http-equiv', ''))), []).append(a.get('content', ''))
        if tag == 'link': self.links.append(a)
        if tag == 'title': self.capture = 'title'; self.titles.append('')
        if tag == 'script' and a.get('type') == 'application/ld+json': self.capture = 'json'; self.data.append('')
    def handle_data(self, text):
        if self.capture == 'title': self.titles[-1] += text
        if self.capture == 'json': self.data[-1] += text
    def handle_endtag(self, tag):
        if tag in ('title', 'script'): self.capture = None


def require(condition, message):
    if not condition: raise AssertionError(message)


def local_url(url):
    parts = urlsplit(url)
    require(parts.scheme == 'https' and parts.netloc == 'www.blackravenai.com', f'Unexpected canonical host: {url}')
    p = ROOT / parts.path.lstrip('/')
    if p.is_dir(): p /= 'index.html'
    require(p.is_file(), f'Missing resource: {url}')
    return p


robots = RobotFileParser(); robots.parse((ROOT / 'robots.txt').read_text().splitlines())
expected_urls = set(); titles = []; descriptions = []
for page in PAGES:
    path = ROOT / page['file']; doc = Document(); doc.feed(path.read_text())
    label = page['file']
    require(len(doc.titles) == 1 and doc.titles[0].strip(), f'{label}: one descriptive title required')
    require(len(doc.meta.get('description', [])) == 1, f'{label}: one description required')
    require(doc.h1 == 1, f'{label}: expected one h1')
    require(len(doc.ids) == len(set(doc.ids)), f'{label}: duplicate HTML IDs')
    canonical = [x['href'] for x in doc.links if x.get('rel') == 'canonical']
    require(canonical == [ORIGIN + page['url']], f'{label}: canonical mismatch')
    local_url(canonical[0])
    for link in doc.links:
        if link.get('rel') == 'preload': require((ROOT / link['href'].lstrip('/')).is_file(), f'{label}: missing preload')
    if page.get('redirect'):
        require(doc.meta.get('refresh') == ['0; url=' + page['redirect']], f'{label}: expected instant redirect')
        continue
    require(len(doc.meta.get('robots', [])) == 1, f'{label}: conflicting robots rules')
    for key in ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:image']:
        require(len(doc.meta.get(key, [])) == 1, f'{label}: missing/duplicate {key}')
    require(doc.meta['og:url'] == canonical, f'{label}: social canonical differs')
    require(doc.meta['og:title'] == doc.titles, f'{label}: title differs from preview')
    image = local_url(doc.meta['og:image'][0]).read_bytes()
    require(image.startswith(b'\x89PNG\r\n\x1a\n') and struct.unpack('>II', image[16:24]) == (1200, 630), f'{label}: invalid social image dimensions')
    require(doc.meta['twitter:image'] == doc.meta['og:image'], f'{label}: inconsistent previews')
    if page.get('sitemap'):
        expected_urls.add(canonical[0]); titles.extend(doc.titles); descriptions.extend(doc.meta['description'])
        require('noindex' not in doc.meta['robots'][0], f'{label}: public page set to noindex')
        require(robots.can_fetch('Googlebot', canonical[0]), f'{label}: crawl blocked')
        require(len(doc.data) == 1, f'{label}: missing/duplicate schema')
        graph = json.loads(doc.data[0])
        require(graph['@context'] == 'https://schema.org', f'{label}: invalid schema context')
        nodes = graph['@graph']; ids = [x['@id'] for x in nodes]
        require(len(ids) == len(set(ids)), f'{label}: duplicate schema IDs')
        types = {x['@type'] for x in nodes}
        require({'Organization', 'WebSite', page['type']} <= types, f'{label}: incomplete entity graph')
        require('aggregateRating' not in doc.data[0] and 'review' not in doc.data[0], f'{label}: unsupported review markup')
        require('offers' not in doc.data[0], f'{label}: unreleased software must not advertise offers')
        for node in nodes:
            if 'url' in node: local_url(node['url'])
    else:
        require('noindex' in doc.meta['robots'][0], f'{label}: private-use utility page should not be indexed')

require(len(titles) == len(set(titles)), 'Duplicate public titles')
require(len(descriptions) == len(set(descriptions)), 'Duplicate public descriptions')
root = ET.parse(ROOT / 'sitemap.xml').getroot()
urls = [x.text for x in root.findall('{*}url/{*}loc')]
require(set(urls) == expected_urls and len(urls) == len(expected_urls), 'Sitemap differs from public canonical pages')
require(robots.site_maps() == [ORIGIN + '/sitemap.xml'], 'robots.txt must advertise the sitemap')
factory = list((ROOT / 'legal').glob('factory-*/*.html'))
for path in factory:
    doc = Document(); doc.feed(path.read_text())
    require(doc.meta.get('robots') == ['noindex, follow'], f'{path}: prototype page remains indexable')
    require(robots.can_fetch('Googlebot', ORIGIN + '/' + str(path.relative_to(ROOT))), f'{path}: noindex must be crawlable')
catalog = json.loads((ROOT / 'apps/catalog.json').read_text())
require(all(f'{ORIGIN}/apps/{app["slug"]}/' in expected_urls for app in catalog), 'New catalog apps need SEO configuration')
subprocess.run(['python3', str(ROOT / 'scripts/sync-seo.py'), '--check'], check=True)
print(f'SEO checks passed: {len(PAGES)} pages, {len(urls)} sitemap URLs, {len(factory)} excluded prototype pages, valid local previews and schema graphs.')
