"""Validate local paths and fragment targets in the studio's connected public pages."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from collections import deque
root=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.assets=[];self.ids=set();self.h1=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag in ['img','script'] and a.get('src'):self.assets.append(a['src'])
  if tag=='link' and a.get('rel') in ['stylesheet','icon','apple-touch-icon']:self.assets.append(a['href'])
cache={};errors=[]
def parse(p):
 if p not in cache:
  o=Links();o.feed(p.read_text());cache[p]=o
 return cache[p]
queue=deque([root/'index.html',root/'404.html',root/'apply.html']);visited=set()
while queue:
 p=queue.popleft()
 if p in visited:continue
 visited.add(p);doc=parse(p)
 if doc.h1!=1:errors.append(f'{p.relative_to(root)}: expected one h1, got {doc.h1}')
 for href in doc.links+doc.assets:
  u=urlsplit(href)
  if u.scheme or u.netloc:continue
  path=unquote(u.path);target=(root/path.lstrip('/')) if path.startswith('/') else (p.parent/path) if path else p
  target=target.resolve()
  if not target.is_relative_to(root):errors.append(f'Outside root: {href}');continue
  if target.is_dir():target=target/'index.html'
  if not target.exists():
   if not target.suffix and target.with_suffix('.html').exists():target=target.with_suffix('.html')
   else:errors.append(f'{p.relative_to(root)}: missing {href}');continue
  if target.suffix=='.html':
   if u.fragment and unquote(u.fragment) not in parse(target).ids:errors.append(f'{p.relative_to(root)}: missing fragment {href}')
   if href in doc.links:queue.append(target)
print(f'Checked {len(visited)} connected pages, {len(cache)} parsed documents; {len(errors)} errors.')
for err in errors:print(err)
raise SystemExit(bool(errors))
