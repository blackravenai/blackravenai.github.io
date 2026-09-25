/* Additional business-card compositions. Coordinates include 37.5px bleed. */
module.exports=({C,rect,line,circle,mark,txt:baseTxt,centered:baseCentered})=>{
 // Card typography is intentionally quieter than the studio's primary wordmark.
 const typeset=base=>(t,x,y,size,fill,tracking=0,weight='light')=>{
  if(t==='BlackRaven'){t='BLACKRAVEN';size*=.72;tracking=3;}
  return base(t,x,y,size,fill,Math.max(0,tracking),weight==='light'?'inter-light':'inter-regular');
 };
 const txt=typeset(baseTxt),centered=typeset(baseCentered);
 const cm=(x,y,scale,fill,stroke,width=1)=>mark(x-33.5*scale,y-32.5*scale,scale,fill,stroke,width);
 const cross=(x,y,color,size=10)=>[line(x-size,y,x+size,y,color,1),line(x,y-size,x,y+size,color,1)];
 const W=1125,H=675;
 const centeredBack=(bg,fg,accent)=>[
  rect(0,0,W,H,bg),centered('BlackRaven',W/2,183,43,fg,-.8),
  centered('Christopher Shaw',W/2,321,44,fg,-.4),centered('FOUNDER',W/2,367,25,accent,3,'medium'),
  centered('support@blackravenai.com',W/2,488,34,fg,0,'regular'),centered('blackravenai.com',W/2,537,34,fg,0,'regular')
 ];
 return [
  {name:'nocturne',title:'Nocturne',family:'minimal',description:'A silver raven. Exactly centered. Everything else can wait until you turn it over.',
   front:[rect(0,0,W,H,C.ink),cm(W/2,H/2,3.25,C.silver)],back:centeredBack(C.ink,C.silver,C.glacier)},
  {name:'white-space',title:'White space',family:'minimal',description:'The inverse, pared right back: one black raven on an uninterrupted white field.',
   front:[rect(0,0,W,H,C.white),cm(W/2,H/2,3.25,C.black)],back:centeredBack(C.white,C.black,'#5D6571')},
  {name:'blue-hour',title:'Blue hour',family:'minimal',description:'Glacier blue, a centered raven, and a small signature. Calm with a little electricity.',
   front:[rect(0,0,W,H,C.glacier),cm(W/2,292,4,C.ink),centered('BlackRaven',W/2,553,38,C.ink,-.5)],
   back:[rect(0,0,W,H,C.ink),txt('Make something',96,185,53,C.silver,-1),txt('matter.',96,248,53,C.glacier,-1),
    line(100,303,1025,303,'#4B5D7E',1),txt('Christopher Shaw',100,382,40,C.silver,-.4),txt('FOUNDER',101,425,24,C.glacier,2,'medium'),
    txt('support@blackravenai.com',100,519,34,C.silver,0,'regular'),txt('blackravenai.com',100,570,34,C.silver,0,'regular'),cm(955,403,1.7,C.glacier)]},
  {name:'edge-of-flight',title:'Edge of flight',family:'expressive',description:'The raven becomes the landscape. An oversized crop brings a bold sense of scale.',
   front:[rect(0,0,W,H,C.ink),mark(590,-98,12,C.silver),txt('BlackRaven',97,468,68,C.silver,-2),
    txt('MAKE SOMETHING',100,537,25,C.glacier,2,'medium'),txt('MATTER.',100,578,25,C.glacier,2,'medium')],
   back:[rect(0,0,W,H,C.silver),rect(0,0,W,60,C.glacier),txt('Christopher Shaw',100,189,49,C.ink,-.8),txt('FOUNDER / BLACKRAVEN',102,241,25,'#536482',2,'medium'),
    txt('A little care.',100,358,41,C.ink,-.7),txt('A world of difference.',100,411,41,C.ink,-.7),
    txt('support@blackravenai.com',100,526,34,C.ink,0,'regular'),txt('blackravenai.com',100,576,34,C.ink,0,'regular'),cm(955,545,2.1,C.ink)]},
  {name:'coordinates',title:'By design',family:'expressive',description:'Fine construction lines and a precise central mark. A nod to the engineering behind the experience.',
   front:[rect(0,0,W,H,C.ink),line(100,202,1025,202,'#303D55',1),line(100,456,1025,456,'#303D55',1),line(423,94,423,573,'#303D55',1),line(702,94,702,573,'#303D55',1),
    ...cross(423,202,C.glacier),...cross(702,456,C.glacier),cm(W/2,329,4.4,C.silver),
    txt('BlackRaven',100,568,36,C.silver,-.4),txt('DESIGN WITH DIRECTION.',701,568,23,C.glacier,1,'medium')],
   back:[rect(0,0,W,H,C.ink),line(100,106,1025,106,'#455570',1),...cross(1025,106,C.glacier),
    txt('Christopher Shaw',100,227,48,C.silver,-.6),txt('FOUNDER',102,274,25,C.glacier,3,'medium'),
    line(100,356,1025,356,'#455570',1),txt('SOFTWARE',100,416,24,C.glacier,2,'medium'),txt('BUILT WITH INTENT.',600,416,24,C.silver,2,'medium'),
    txt('support@blackravenai.com',100,515,34,C.silver,0,'regular'),txt('blackravenai.com',100,567,34,C.silver,0,'regular'),...cross(1025,567,C.glacier)]},
  {name:'signal-stripe',title:'Signal stripe',family:'expressive',description:'A strong vertical band anchors the raven. The connected wordmark gets room to lead.',
   front:[rect(0,0,W,H,C.silver),rect(0,0,244,H,C.glacier),cm(141,337.5,2.7,C.ink),txt('BlackRaven',318,326,70,C.ink,-2),
    txt('MAKE SOMETHING MATTER.',322,388,25,'#536482',2,'medium')],
   back:[rect(0,0,W,H,C.ink),rect(0,0,244,H,C.glacier),cm(141,145,1.8,C.ink),
    txt('Christopher Shaw',318,191,45,C.silver,-1),txt('FOUNDER',320,242,25,C.glacier,3,'medium'),
    line(320,328,1025,328,'#4B5D7E',1),txt('support@blackravenai.com',320,450,34,C.silver,0,'regular'),txt('blackravenai.com',320,501,34,C.silver,0,'regular'),
    txt('BlackRaven',318,580,32,C.silver,-.3)]},
  {name:'the-promise',title:'The promise',family:'expressive',description:'Our whole point of view, set large. The kind of card that starts the conversation.',
   front:[rect(0,0,W,H,C.ink),txt('BLACKRAVEN',100,128,28,C.silver,2),cm(977,111,1.5,C.glacier),
    txt('Make',94,274,113,C.silver,-3),txt('something',94,402,113,C.silver,-3),txt('matter.',94,530,113,C.glacier,-3)],
   back:[rect(0,0,W,H,C.glacier),txt('Care, in every detail.',96,198,57,C.ink,-1.5),line(100,270,1025,270,C.ink,1),
    txt('Christopher Shaw',100,358,44,C.ink,-.5),txt('FOUNDER / BLACKRAVEN',102,409,25,C.ink,2,'medium'),
    txt('support@blackravenai.com',100,518,34,C.ink,0,'regular'),txt('blackravenai.com',100,570,34,C.ink,0,'regular'),cm(962,541,1.8,C.ink)]},
  {name:'flight-rhythm',title:'Flight rhythm',family:'expressive',description:'A field of quiet ravens, interrupted by one clear signal. Pattern with a point of focus.',
   front:[rect(0,0,W,H,C.ink),...[0,1,2,3,4].flatMap(col=>[0,1,2].map(row=>cm(123+220*col,119+189*row,1.75,(col===2&&row===1)?C.glacier:'#293240'))),
    rect(0,548,W,127,C.silver),txt('BlackRaven',100,608,38,C.ink,-.8),txt('MAKE SOMETHING MATTER.',647,604,23,C.ink,1,'medium')],
   back:[rect(0,0,W,H,C.silver),cm(967,136,2.2,C.ink),txt('Christopher Shaw',100,230,47,C.ink,-.8),txt('FOUNDER',102,280,25,'#536482',3,'medium'),
    line(100,354,1025,354,'#B0BBCE',1),txt('support@blackravenai.com',100,443,34,C.ink,0,'regular'),txt('blackravenai.com',100,495,34,C.ink,0,'regular'),
    rect(0,570,W,105,C.ink),txt('SMALL DETAILS. LASTING IMPRESSIONS.',100,623,24,C.silver,2,'medium')]},
  {name:'vertical-signature',title:'Vertical signature',family:'expressive',width:675,height:1125,description:'A different orientation. A centered raven above a deliberate two-line name, like the cover of a small book.',
   front:[rect(0,0,675,1125,C.ink),cm(337.5,345,4.3,C.glacier),centered('BLACK',337.5,696,68,C.silver,9),centered('RAVEN',337.5,787,68,C.silver,9),
    centered('MAKE SOMETHING',337.5,956,25,C.glacier,2,'medium'),centered('MATTER.',337.5,997,25,C.glacier,2,'medium')],
   back:[rect(0,0,675,1125,C.silver),cm(337.5,197,2.2,C.ink),centered('Christopher Shaw',337.5,407,42,C.ink,-.8),centered('FOUNDER',337.5,459,25,'#536482',3,'medium'),
    line(92,548,583,548,'#B0BBCE',1),centered('BlackRaven',337.5,648,38,C.ink,-.6),centered('support@blackravenai.com',337.5,817,33,C.ink,0,'regular'),
    centered('blackravenai.com',337.5,869,33,C.ink,0,'regular'),centered('MAKE SOMETHING MATTER.',337.5,1016,22,C.ink,1.5,'medium')]}
 ];
};
