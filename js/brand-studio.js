const logoGrid=document.querySelector('.collection-grid');
const cardToolbar=document.querySelector('.card-toolbar');
if(cardToolbar){
 cardToolbar.hidden=false;
 cardToolbar.querySelectorAll('[data-card-filter]').forEach(button=>button.addEventListener('click',()=>{
  const family=button.dataset.cardFilter;
  let visible=0;
  document.querySelectorAll('.business-card').forEach(card=>{
   card.hidden=family==='portrait'?card.dataset.cardOrientation!=='portrait':family!=='all'&&card.dataset.cardFamily!==family;
   if(!card.hidden)visible++;
  });
  document.querySelectorAll('.card-group').forEach(group=>group.hidden=!group.querySelector('.business-card:not([hidden])'));
  cardToolbar.querySelectorAll('[data-card-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  cardToolbar.querySelector('.card-filter-status').textContent=`${visible} concepts · ${visible*2} considered sides`;
 }));
}
document.querySelectorAll('[data-logo-theme]').forEach(button=>button.addEventListener('click',()=>{
 const tone=button.dataset.logoTheme;
 logoGrid.dataset.collectionTheme=tone;
 document.querySelectorAll('[data-logo-theme]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 logoGrid.querySelectorAll('[data-lockup]').forEach(card=>{
  const stem=`/assets/brand/lockups/${card.dataset.lockup}-${tone}`;
  const image=card.querySelector('img');image.src=stem+'.svg';image.alt=`BlackRaven ${card.dataset.lockup} logo arrangement in ${tone}`;
  card.querySelectorAll('[data-format]').forEach(link=>link.href=stem+'.'+link.dataset.format);
 });
 document.querySelector('.collection-status').textContent=`Showing ${button.textContent}. Downloads follow your selected treatment.`;
}));
document.querySelectorAll('.card-flip').forEach(button=>button.addEventListener('click',()=>{
 const flipped=button.getAttribute('aria-pressed')!=='true';
 button.setAttribute('aria-pressed',String(flipped));
 button.setAttribute('aria-label',`Flip ${button.dataset.cardTitle} business card to the ${flipped?'brand':'contact'} side`);
 button.closest('.business-card').querySelector('.flip-hint').textContent=flipped?'Flip to brand side ↗':'Flip to contact side ↗';
}));
document.querySelectorAll('[data-watermark-tone]').forEach(button=>button.addEventListener('click',()=>{
 const tone=button.dataset.watermarkTone;
 document.querySelector('.watermark-grid').dataset.watermarkSurface=tone;
 document.querySelectorAll('[data-watermark-tone]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 document.querySelectorAll('[data-watermark]').forEach(card=>{
  const stem=`/assets/brand/watermarks/${card.dataset.watermark}-${tone}`;
  card.querySelector('img').src=stem+'.svg';
  card.querySelectorAll('[data-format]').forEach(link=>link.href=stem+'.'+link.dataset.format);
 });
 document.querySelector('.watermark-status').textContent=`${tone==='dark'?'White watermarks for dark':'Black watermarks for light'} backgrounds. Opacity is built into the downloadable files.`;
}));
