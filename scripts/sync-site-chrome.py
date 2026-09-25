"""Sync static headers/footers from shared partials; no browser JavaScript required."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
header=(root/'partials/site-header.html').read_text().strip()
footer=(root/'partials/site-footer.html').read_text().strip()
count=0
for p in root.rglob('*.html'):
 if p.parent==root/'partials':continue
 s=p.read_text()
 if '<header class="site-header">' not in s:continue
 new=re.sub(r'<header class="site-header">.*?</header>',lambda _:header,s,flags=re.S)
 new=re.sub(r'<footer class="site-footer"[^>]*>.*?</footer>',lambda _:footer,new,flags=re.S)
 if new!=s:p.write_text(new)
 count+=1
print(f'Synchronized {count} pages from shared studio partials.')
