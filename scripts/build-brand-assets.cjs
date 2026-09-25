/* Design-time only: npm packages sharp and opentype.js (or BRAND_FONT_ENGINE).
   The published site serves the generated assets; it needs no Node runtime. */
const fs=require('node:fs'),path=require('node:path');
const ot=require(process.env.BRAND_FONT_ENGINE||'opentype.js');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/brand');
const fonts={};
for(const weight of ['regular','medium','bold']){const b=fs.readFileSync(path.join(root,`assets/fonts/manrope-${weight}.ttf`));fonts[weight]=ot.parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));}
const C={ink:'#101217',silver:'#F0F1F5',glacier:'#ADC4FF',black:'#000000',white:'#FFFFFF'};
const points=[[5,8],[30,17],[40,8],[49,8],[62,18],[48,21],[41,38],[20,57],[27,33]];
const num=v=>Math.round(v*1000)/1000;
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const rect=(x,y,w,h,fill,rx=0)=>({type:'rect',x,y,w,h,fill,rx});
const line=(x1,y1,x2,y2,stroke,width=1)=>({type:'line',x1,y1,x2,y2,stroke,width});
const circle=(cx,cy,r,fill,stroke,width=1)=>({type:'circle',cx,cy,r,fill,stroke,width});
const mark=(x,y,s,fill,stroke,width=1)=>({type:'path',fill,stroke,width,commands:[...points.map(([a,b],i)=>({type:i?'L':'M',x:x+a*s,y:y+b*s})),{type:'Z'}]});
function textWidth(t,size,tracking=0,weight='bold'){return [...t].reduce((n,c)=>n+fonts[weight].getAdvanceWidth(c,size),0)+Math.max(0,t.length-1)*tracking;}
function txt(t,x,y,size,fill,tracking=0,weight='bold'){
 const commands=[];for(const ch of t){commands.push(...fonts[weight].getPath(ch,x,y,size).commands);x+=fonts[weight].getAdvanceWidth(ch,size)+tracking;}
 return {type:'path',fill,commands};
}
const centered=(t,cx,y,size,fill,tracking=0,weight='bold')=>txt(t,cx-textWidth(t,size,tracking,weight)/2,y,size,fill,tracking,weight);
const d=cmds=>cmds.map(c=>c.type+(c.type==='Z'?'':c.type==='C'?[c.x1,c.y1,c.x2,c.y2,c.x,c.y].map(num).join(' '):c.type==='Q'?[c.x1,c.y1,c.x,c.y].map(num).join(' '):[c.x,c.y].map(num).join(' '))).join('');
function shape(s){const attrs=`fill="${s.fill||'none'}"${s.stroke?` stroke="${s.stroke}" stroke-width="${s.width}"`:''}${s.opacity!==undefined?` opacity="${s.opacity}"`:''}`;
 if(s.type==='path')return `<path d="${d(s.commands)}" ${attrs}/>`;
 if(s.type==='rect')return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.rx}" ${attrs}/>`;
 if(s.type==='line')return `<path d="M${s.x1} ${s.y1}L${s.x2} ${s.y2}" ${attrs}/>`;
 if(s.type==='circle')return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" ${attrs}/>`;
}
const svg=(scene,w,h,label)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${xml(label)}">${scene.map(shape).join('')}</svg>`;
const files=[];
async function save(name,scene,w,h,label,pngWidth=1600){
 const stem=path.join(out,name);fs.mkdirSync(path.dirname(stem),{recursive:true});const source=svg(scene,w,h,label);fs.writeFileSync(stem+'.svg',source);await sharp(Buffer.from(source)).resize({width:pngWidth}).png().toFile(stem+'.png');files.push(name+'.svg',name+'.png');return source;
}
function lockup(kind,color){
 if(kind==='signature')return [mark(74,162,2.8,color),txt('BLACK RAVEN',310,277,71,color,-.7),txt('MAKE SOMETHING MATTER.',315,327,18,color,3,'medium')];
 if(kind==='wide')return [mark(66,208,1.8,color),txt('BLACK RAVEN',225,278,47,color,5.2),txt('MAKE SOMETHING MATTER.',228,322,13,color,4,'medium')];
 if(kind==='stacked')return [mark(398,66,3,color),centered('BLACK RAVEN',500,380,61,color,1),centered('MAKE SOMETHING MATTER.',500,433,16,color,3,'medium')];
 if(kind==='editorial')return [mark(82,134,4.3,color),txt('BLACK',437,262,99,color,2),txt('RAVEN',437,371,99,color,2)];
 if(kind==='ai')return [mark(81,158,3,color),txt('BLACK RAVEN',324,262,62,color,.6),txt('AI',326,326,40,color,4),line(411,302,411,329,color,1),txt('INDEPENDENT SOFTWARE STUDIO',434,319,13,color,2,'medium')];
 return [circle(500,280,208,undefined,color,2),circle(500,280,195,undefined,color,.7),centered('B L A C K   R A V E N',500,159,23,color),mark(405,170,2.8,color),centered('MAKE SOMETHING',500,398,15,color,2,'medium'),centered('MATTER.',500,426,15,color,2,'medium'),line(476,451,524,451,color,1)];
}
function contactBack(bg,fg,accent){return [rect(0,0,1125,675,bg),txt('Christopher Shaw',100,174,49,fg,-.6),txt('FOUNDER / BLACK RAVEN',102,223,26,accent,2,'medium'),line(100,301,1025,301,accent,1),txt('Thoughtful software.',100,375,34,fg,0,'medium'),txt('Extraordinary experiences.',100,422,34,fg,0,'medium'),txt('support@blackravenai.com',100,524,34,fg,0,'regular'),txt('blackravenai.com',100,575,34,fg,0,'regular'),mark(889,442,2,fg)];}
async function main(){
 for(const kind of ['signature','wide','stacked','editorial','ai','seal'])for(const [tone,color] of Object.entries(C))await save(`lockups/${kind}-${tone}`,lockup(kind,color),1000,560,`Black Raven ${kind} lockup in ${tone}`,1800);
 for(const tone of ['black','white'])await save(`mono/mark-${tone}`,[mark(0,0,1,C[tone])],68,64,`Black Raven pure ${tone} symbol`,1024);
 for(const [tone,bg,fg] of [['light',C.white,C.black],['dark',C.black,C.white]]){
  await save(`mono/tile-${tone}`,[rect(0,0,640,640,bg),mark(103,112,6.4,fg)],640,640,`Black Raven ${tone} square`,1200);
  await save(`applications/sticker-${tone}`,[circle(320,320,298,bg,fg,3),mark(103,112,6.4,fg)],640,640,`Black Raven ${tone} circular sticker`,1200);
  await save(`watermarks/symbol-${tone}`,[{...mark(40,35,6.4,fg),opacity:.24}],512,480,`Black Raven transparent ${tone} symbol watermark`,1600);
  await save(`watermarks/signature-${tone}`,[{...mark(15,18,2.9,fg),opacity:.28},{...txt('BLACK RAVEN',245,140,65,fg,2),opacity:.28}],1000,240,`Black Raven transparent ${tone} signature watermark`,2000);
 }
 const pattern=[];for(let y=0;y<2;y++)for(let x=0;x<2;x++){pattern.push(mark(58+x*320,50+y*320,2.8,C.silver));pattern.push(line(276+x*320,260+y*320,292+x*320,260+y*320,C.glacier,1));pattern.push(line(284+x*320,252+y*320,284+x*320,268+y*320,C.glacier,1));}
 await save('applications/flight-pattern',[rect(0,0,640,640,C.ink),...pattern.map(s=>({...s,opacity:.17}))],640,640,'Black Raven repeating flight pattern',1280);
 const cover=[rect(0,0,1920,1080,C.ink),txt('BLACK RAVEN',100,119,29,C.silver,3),txt('INDEPENDENT SOFTWARE & AI',100,177,16,C.glacier,3,'medium'),txt('Make',94,440,157,C.silver,-5),txt('something',94,625,157,C.silver,-5),txt('matter.',94,810,157,C.glacier,-5),mark(1140,200,9.2,C.glacier),line(100,930,1820,930,'#455069',1),txt('DESIGN WITH CARE. BUILD WITH INTENT.',100,987,17,C.silver,3,'medium'),txt('blackravenai.com',1510,987,22,C.silver,0,'regular')];
 await save('applications/social-cover',cover,1920,1080,'Black Raven Make something matter social cover',2400);
 const cards=[
  {name:'quiet-confidence',title:'Quiet confidence',front:[rect(0,0,1125,675,C.ink),mark(411,111,4.5,C.silver),txt('BLACK RAVEN',100,536,38,C.silver,2),txt('MAKE SOMETHING MATTER.',101,579,25,C.glacier,2,'medium'),txt('01',969,575,25,C.glacier,1,'medium')],back:contactBack(C.silver,C.ink,'#536482')},
  {name:'glacier-signal',title:'Glacier signal',front:[rect(0,0,1125,675,C.glacier),mark(687,56,5.4,undefined,'#6d89be',1),mark(641,102,5.4,undefined,'#6d89be',1),mark(595,148,5.4,undefined,'#6d89be',1),txt('MAKE',93,238,87,C.ink,-2),txt('SOMETHING',93,344,87,C.ink,-2),txt('MATTER.',93,450,87,C.ink,-2),line(100,523,1025,523,C.ink,1),txt('BLACK RAVEN',100,581,30,C.ink,3),mark(941,531,1.1,C.ink)],back:contactBack(C.ink,C.silver,C.glacier)},
  {name:'editorial-white',title:'Editorial white',front:[rect(0,0,1125,675,C.white),txt('BLACK',89,247,123,C.black,9),txt('RAVEN',89,397,123,C.black,9),mark(824,93,2.5,C.black),line(100,486,1025,486,C.black,2),txt('MAKE SOMETHING MATTER.',101,562,25,C.black,3,'medium'),txt('BR / AI',844,562,25,C.black,2,'medium')],back:[rect(0,0,1125,675,C.black),mark(82,83,1.8,C.white),txt('Christopher Shaw',101,325,50,C.white,-.5),txt('FOUNDER',103,370,26,C.white,3,'medium'),line(100,425,1025,425,C.white,1),txt('support@blackravenai.com',100,509,34,C.white,0,'regular'),txt('blackravenai.com',100,559,34,C.white,0,'regular'),txt('SOFTWARE WITH CARE.',716,574,23,C.white,1,'medium')]}
 ];
 for(const card of cards)for(const side of ['front','back']){
  const source=await save(`cards/${card.name}-${side}`,card[side],1125,675,`${card.title} business card ${side}`,1125);
  const cropped=source.replace('width="1125" height="675" viewBox="0 0 1125 675"','width="1050" height="600" viewBox="37.5 37.5 1050 600"');
  await sharp(Buffer.from(cropped)).png().toFile(path.join(out,`cards/${card.name}-${side}-preview.png`));
 }
 fs.writeFileSync(process.env.BRAND_CARD_SCENES||'/private/tmp/blackraven-card-scenes.json',JSON.stringify(cards));
 fs.writeFileSync(path.join(out,'collection.json'),JSON.stringify({edition:3,tagline:'Make something matter.',lockups:['signature','wide','stacked','editorial','ai','seal'],colors:C,files},null,2));
 console.log(`Created ${files.length} SVG/PNG collection assets and 6 trimmed card previews.`);
}
main().catch(e=>{console.error(e);process.exitCode=1});
