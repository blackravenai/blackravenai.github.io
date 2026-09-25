"""Render the generated card scenes as vector print artwork with bleed/trim boxes.
Run build-brand-assets.cjs first; PDF generation is only a design-time dependency.
"""
import json
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from pypdf import PdfReader,PdfWriter
from pypdf.generic import RectangleObject
root=Path(__file__).resolve().parents[1]
scenes=json.loads(Path('/private/tmp/blackraven-card-scenes.json').read_text())
out=root/'output/pdf/black-raven-business-cards.pdf'
out.parent.mkdir(parents=True,exist_ok=True)
tmp=Path('/private/tmp/black-raven-business-cards-raw.pdf')
c=canvas.Canvas(str(tmp),pagesize=(270,162))
c.setTitle('Black Raven - Business card collection')
c.setAuthor('Black Raven')
def draw(item):
 c.saveState()
 if item.get('fill'):c.setFillColor(HexColor(item['fill']))
 if item.get('stroke'):c.setStrokeColor(HexColor(item['stroke']));c.setLineWidth(item.get('width',1))
 if item.get('opacity') is not None:c.setFillAlpha(item['opacity']);c.setStrokeAlpha(item['opacity'])
 fill=bool(item.get('fill'));stroke=bool(item.get('stroke'));kind=item['type']
 if kind=='rect':c.roundRect(item['x'],item['y'],item['w'],item['h'],item.get('rx',0),fill=fill,stroke=stroke)
 elif kind=='circle':c.circle(item['cx'],item['cy'],item['r'],fill=fill,stroke=stroke)
 elif kind=='line':c.line(item['x1'],item['y1'],item['x2'],item['y2'])
 elif kind=='path':
  p=c.beginPath();x=y=0
  for q in item['commands']:
   t=q['type']
   if t=='M':p.moveTo(q['x'],q['y']);x,y=q['x'],q['y']
   elif t=='L':p.lineTo(q['x'],q['y']);x,y=q['x'],q['y']
   elif t=='C':p.curveTo(q['x1'],q['y1'],q['x2'],q['y2'],q['x'],q['y']);x,y=q['x'],q['y']
   elif t=='Q':
    p.curveTo(x+2*(q['x1']-x)/3,y+2*(q['y1']-y)/3,q['x']+2*(q['x1']-q['x'])/3,q['y']+2*(q['y1']-q['y'])/3,q['x'],q['y']);x,y=q['x'],q['y']
   elif t=='Z':p.close()
  c.drawPath(p,stroke=stroke,fill=fill,fillMode=1)
 c.restoreState()
for card in scenes:
 for side in ('front','back'):
  c.saveState();c.translate(0,162);c.scale(.24,-.24)
  for item in card[side]:draw(item)
  c.restoreState();c.showPage()
c.save()
r=PdfReader(tmp);w=PdfWriter()
for page in r.pages:
 page.trimbox=RectangleObject([9,9,261,153])
 page.bleedbox=RectangleObject([0,0,270,162])
 w.add_page(page)
w.add_metadata({'/Title':'Black Raven - Three business card concepts','/Author':'Black Raven','/Subject':'Front/back pairs. 3.5 x 2 inch trim, 0.125 inch bleed. RGB vector artwork.'})
for i,card in enumerate(scenes):w.add_outline_item(card['title']+' - front / back',i*2)
with out.open('wb') as f:w.write(f)
print(f'Created {out}: {len(r.pages)} vector pages, 3.5 x 2 in trim + 0.125 in bleed.')
