"""Build compact web fonts and branded 1200x630 link previews.

Design-time dependencies: fonttools[woff] and the Node package sharp.
Full source fonts, licenses, and existing brand-kit artwork stay unchanged.
"""
from base64 import b64encode
from html import escape
from pathlib import Path
import subprocess
from fontTools import subset
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / 'assets/fonts'
OUT = ROOT / 'assets/social'
OUT.mkdir(exist_ok=True)
SILVER, GLACIER, INK = '#F0F1F5', '#ADC4FF', '#101217'
RAVEN = 'M5 8 30 17 40 8 49 8 62 18 48 21 41 38 20 57 27 33Z'

for name in ['inter-light', 'inter-regular', 'inter-medium', 'manrope-regular', 'manrope-medium', 'manrope-bold']:
    font = TTFont(FONTS / (name + '.ttf'))
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.name_IDs = ['*']
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=set(range(0x250)) | set(range(0x2000, 0x2070)) | set(range(0x20A0, 0x20D0)) | set(range(0x2190, 0x2200)) | {0x2212, 0x2713})
    sub.subset(font)
    font.flavor = 'woff2'
    font.save(FONTS / (name + '-latin.woff2'))

fonts = {name: TTFont(FONTS / (name + '.ttf')) for name in ['inter-light', 'inter-regular', 'manrope-bold']}


def lettering(text, x, y, size, color=SILVER, face='inter-light'):
    font = fonts[face]
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = size / font['head'].unitsPerEm
    paths = []
    for char in text:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, y)))
        paths.append(pen.getCommands())
        x += font['hmtx'][name][0] * scale
    return f'<path fill="{color}" d="{" ".join(paths)}"/>'


def screenshot(path):
    result = subprocess.run(['node', '-e', "require('sharp')(process.argv[1]).resize({height:510}).png().toBuffer().then(b=>process.stdout.write(b))", str(ROOT / path)], capture_output=True, check=True)
    return b64encode(result.stdout).decode()


cards = [
    ('studio', ['Make something', 'matter.'], 'Software. Design. AI.', None),
    ('squeezy-fish', ['Squeezy Fish'], 'Hold to puff. Release to dive.', 'assets/work/squeezy-fish.webp'),
    ('doodlegs', ['DoodleLegs'], 'Your next great idea has legs.', 'assets/work/doodlegs-play.webp'),
    ('averted', ['AVERTED'], 'Less searching. More sky.', 'assets/work/averted.webp')
]
for slug, lines, caption, shot in cards:
    content = f'<rect width="1200" height="630" fill="{INK}"/>'
    content += f'<path d="{RAVEN}" fill="{SILVER}" transform="translate(53 34) scale(.72)"/>'
    content += lettering('BLACKRAVEN', 118, 67, 25, face='manrope-bold')
    for i, line in enumerate(lines):
        content += lettering(line, 64, (310 if shot else 254) + i * 92, 76, GLACIER if i else SILVER)
    content += lettering(caption, 67, 380 if shot else 432, 27, GLACIER, 'inter-regular')
    content += '<path d="M64 515H674" stroke="#303641"/>'
    content += lettering('Make something matter.' if shot else 'blackravenai.com', 66, 564, 24)
    if shot:
        content += '<defs><clipPath id="screen"><rect x="838" y="60" width="238" height="510" rx="27"/></clipPath></defs>'
        content += '<rect x="834" y="56" width="246" height="518" rx="30" fill="#202B40" stroke="#43516B"/>'
        content += f'<image x="838" y="60" width="238" height="510" preserveAspectRatio="xMidYMid slice" clip-path="url(#screen)" href="data:image/png;base64,{screenshot(shot)}"/>'
    else:
        content += f'<path d="{RAVEN}" fill="none" stroke="#303F5F" stroke-width=".15" transform="translate(819 146) scale(5)"/>'
        content += f'<path d="{RAVEN}" fill="{GLACIER}" transform="translate(794 171) scale(5)"/>'
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="{escape(caption)}">{content}</svg>'
    source = OUT / (slug + '.svg')
    source.write_text(svg)
    subprocess.run(['node', '-e', "require('sharp')(process.argv[1]).png({compressionLevel:9}).toFile(process.argv[2])", str(source), str(source.with_suffix('.png'))], check=True)
print('Generated six local WOFF2 web fonts and four 1200x630 social previews.')
