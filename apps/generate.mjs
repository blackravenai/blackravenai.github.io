// Generates public, static pre-launch pages. No account signup or ad activation.
import fs from 'node:fs';
import path from 'node:path';
const root=import.meta.dirname;
const header=fs.readFileSync(path.join(root,'../partials/site-header.html'),'utf8').trim();
const footer=fs.readFileSync(path.join(root,'../partials/site-footer.html'),'utf8').trim();
const apps=JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8'));
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function layout(title,description,url,body){return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} · BlackRaven</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="https://www.blackravenai.com${url}"><link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/apps/site.css"><link rel="stylesheet" href="/css/site-chrome.css?v=2"><script src="/js/navigation.js?v=1" defer></script></head><body><a class="skip" href="#main">Skip to content</a>${header}<main id="main" class="wrap">${body}</main>${footer}</body></html>\n`;}

const cards=apps.map(app=>`<article class="card" style="--accent:${app.accent}"><span class="eyebrow">${escape(app.kind)}</span><h2>${escape(app.name)}</h2><p>${escape(app.tagline)}</p><p><span class="badge">In development</span></p><a href="/apps/${app.slug}/">Explore ${escape(app.name)} →</a></article>`).join('');
if(!fs.existsSync(path.join(root,'index.html'))) fs.writeFileSync(path.join(root,'index.html'),layout('Our mobile apps','Meet the mobile apps in development at BlackRaven AI LLC.','/apps/',`<section class="hero"><span class="eyebrow">Independent mobile apps</span><h1>Little worlds.<br>Distinct ideas.</h1><p class="lead">Games to experiment with. Tools to explore with. Meet the mobile apps we are building at BlackRaven.</p><span class="badge">Coming soon · No release date announced</span></section><section class="grid" aria-label="Apps">${cards}</section>`));
for(const app of apps){
  if(!/^[a-z0-9-]+$/.test(app.slug)||!/^#[a-f0-9]{6}$/i.test(app.accent))throw Error('Invalid app slug or accent');
  const dir=path.join(root,app.slug);
  if(fs.existsSync(path.join(dir,'index.html'))) { console.log(`Preserved existing designed page: ${app.slug}`); continue; }
  fs.mkdirSync(dir,{recursive:true});
  const body=`<section class="hero" style="--accent:${app.accent}"><span class="eyebrow">${escape(app.kind)}</span><h1>${escape(app.name)}</h1><h2>${escape(app.tagline)}</h2><p class="lead">${escape(app.description)}</p><span class="badge">In development · Not yet available in stores</span></section><section aria-label="Planned experience" style="--accent:${app.accent}"><h2>What we are building</h2><ul class="features">${app.features.map(x=>`<li>${escape(x)}</li>`).join('')}</ul></section><section class="notice"><h2>A page for a mobile app—not a browser game</h2><p>This is the official pre-launch information page for ${escape(app.name)} by BlackRaven AI LLC. The app is being prepared for mobile devices. Features and availability may change before release.</p><p>Verified store download links, final pricing and launch privacy information will be added before public availability. No store release date has been announced.</p><a href="mailto:support@blackravenai.com?subject=${encodeURIComponent(app.name+' enquiry')}">Contact us about ${escape(app.name)}</a></section>`;
  fs.writeFileSync(path.join(dir,'index.html'),layout(app.name,app.description,`/apps/${app.slug}/`,body));
}
console.log(`Scaffolded missing pages only. Existing app designs and launch information were preserved.`);
