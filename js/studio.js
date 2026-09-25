const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches && 'IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.section-heading,.project-card,.doodle-feature,.service-list>a,.studio-note').forEach(el=>{el.classList.add('reveal-ready');obs.observe(el)})}
// Keep the signature responsive to the visitor without changing the approved mark.
const hero=document.querySelector('.hero-stage');
const signature=document.querySelector('.signature-art');
if(hero && signature){
  const motionToggle=signature.querySelector('.logo-motion-toggle');
  const finePointer=window.matchMedia('(pointer: fine)');
  let paused=false;
  const resetTilt=()=>{signature.style.setProperty('--rx','0deg');signature.style.setProperty('--ry','0deg')};
  const syncMotionPreference=()=>{motionToggle.hidden=reduced.matches;resetTilt()};
  syncMotionPreference();
  reduced.addEventListener('change',syncMotionPreference);
  hero.addEventListener('pointermove',e=>{
    if(paused || reduced.matches || !finePointer.matches || e.pointerType==='touch')return;
    const r=hero.getBoundingClientRect();
    signature.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-.5)*22}deg`);
    signature.style.setProperty('--rx',`${(.5-(e.clientY-r.top)/r.height)*14}deg`);
  });
  hero.addEventListener('pointerleave',resetTilt);
  motionToggle.addEventListener('click',()=>{
    paused=!paused;
    signature.classList.toggle('is-paused',paused);
    motionToggle.setAttribute('aria-pressed',String(paused));
    motionToggle.setAttribute('aria-label',paused?'Resume logo animation':'Pause logo animation');
    resetTilt();
  });
  if('IntersectionObserver' in window){
    const visibility=new IntersectionObserver(([entry])=>signature.classList.toggle('is-offscreen',!entry.isIntersecting));
    visibility.observe(signature);
  }
}
// Clipboard feedback always offers an honest fallback.
async function copyText(text,status){try{await navigator.clipboard.writeText(text);status.textContent='Copied to clipboard.'}catch{status.textContent='Copy is unavailable in this browser. Select and copy the text directly.'}}
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',()=>copyText(button.dataset.copy,document.querySelector('.copy-status'))));
const form=document.getElementById('project-form');
if(form){const panel=document.getElementById('brief-preview');const briefText=document.getElementById('brief-text');let brief='';let subject='';form.addEventListener('submit',e=>{e.preventDefault();const messageInput=form.elements.message;messageInput.setCustomValidity(messageInput.value.trim().length<10?'Please tell us a little more about your project.':'');const nameInput=form.elements.name;nameInput.setCustomValidity(nameInput.value.trim()?'':'Please enter your name.');if(!form.reportValidity())return;const d=new FormData(form);subject=`Project enquiry: ${d.get('type')}`;brief=`Hi Black Raven,\n\n${d.get('message').trim()}\n\nProject type: ${d.get('type')}\nName: ${d.get('name').trim()}\nEmail: ${d.get('email').trim()}${d.get('company').trim()?'\nCompany / project: '+d.get('company').trim():''}`;briefText.textContent=brief;document.getElementById('email-brief').href=`mailto:support@blackravenai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;form.hidden=true;panel.hidden=false;panel.focus();panel.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'})});document.getElementById('edit-brief').addEventListener('click',()=>{panel.hidden=true;form.hidden=false;form.querySelector('textarea').focus()});document.getElementById('copy-brief').addEventListener('click',()=>copyText(brief,panel.querySelector('.copy-status')));document.getElementById('download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([`To: support@blackravenai.com\nSubject: ${subject}\n\n${brief}`],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='black-raven-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)})}
// A single expanded studio project keeps the work calm and readable.
document.querySelectorAll('.studio-project').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('.studio-project').forEach(other=>{if(other!==detail)other.open=false})}));

form?.addEventListener('input',e=>{if(typeof e.target.setCustomValidity==='function')e.target.setCustomValidity('')});
