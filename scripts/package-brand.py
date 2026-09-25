"""Package the published brand collection, vector business cards, and font licenses."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
brand=root/'assets/brand'
kit=brand/'black-raven-brand-kit.zip'
with ZipFile(kit,'w',ZIP_DEFLATED) as z:
 for p in sorted(brand.rglob('*')):
  if p.is_file() and p.suffix!='.zip':z.write(p,Path('Black-Raven-Brand-Kit')/p.relative_to(brand))
 for p in sorted((root/'assets/fonts').iterdir()):
  if p.is_file():z.write(p,Path('Black-Raven-Brand-Kit/fonts')/p.name)
 pdf=root/'output/pdf/black-raven-business-cards.pdf'
 z.write(pdf,'Black-Raven-Brand-Kit/cards/black-raven-business-cards.pdf')
with ZipFile(kit) as z:
 assert z.testzip() is None
 print(f'Packaged {len(z.namelist())} files; ZIP integrity passed. {kit.stat().st_size/1024/1024:.2f} MB')
