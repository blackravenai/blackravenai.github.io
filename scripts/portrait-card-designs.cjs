/* Portrait collection. 2 × 3.5 inch trim; scene includes 0.125 inch bleed. */
module.exports=({C,rect,line,mark,txt,centered})=>{
 const W=675,H=1125;
 const cm=(x,y,s,fill)=>mark(x-33.5*s,y-32.5*s,s,fill);
 const t=(text,x,y,size,fill,tracking=0,weight='regular')=>txt(text,x,y,size,fill,tracking,`inter-${weight}`);
 const ct=(text,x,y,size,fill,tracking=0,weight='regular')=>centered(text,x,y,size,fill,tracking,`inter-${weight}`);
 // Apply the rotation to the outlines themselves so SVG and print PDF agree.
 const rotate=(shape,degrees,x,y)=>{
  const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
  return {...shape,commands:shape.commands.map(command=>{
   const q={...command};
   for(const suffix of ['','1','2'])if(q['x'+suffix]!==undefined){const px=q['x'+suffix],py=q['y'+suffix];q['x'+suffix]=x+c*px-s*py;q['y'+suffix]=y+s*px+c*py;}
   return q;
  })};
 };
 const details=(bg,fg,accent)=>[
  rect(0,0,W,H,bg),cm(117,157,1.15,fg),
  t('CHRISTOPHER',92,418,31,fg,2),t('SHAW',92,463,31,fg,2),t('FOUNDER',93,518,23,accent,3),
  line(92,600,583,600,accent,1.2),t('BLACKRAVEN',92,674,28,fg,3,'light'),
  t('support@blackravenai.com',92,936,31,fg),t('blackravenai.com',92,984,31,fg)
 ];
 return [
  {name:'still-dark',title:'Still / dark',family:'minimal',width:W,height:H,
   description:'One small raven, centered in a tall field of black. A quiet front with a finely set contact side.',
   front:[rect(0,0,W,H,C.ink),cm(W/2,H/2,2.8,C.silver)],back:details(C.silver,C.ink,'#52627B')},
  {name:'still-light',title:'Still / light',family:'minimal',width:W,height:H,
   description:'The inverse. Black on white, with nothing around the symbol to dilute the impression.',
   front:[rect(0,0,W,H,C.white),cm(W/2,H/2,2.8,C.black)],
   back:[rect(0,0,W,H,C.white),ct('BLACKRAVEN',337.5,196,29,C.black,4,'light'),
    line(312,302,363,302,'#53617A',1.2),ct('CHRISTOPHER SHAW',337.5,574,29,C.black,1.5),ct('FOUNDER',337.5,625,23,'#53617A',3),
    ct('support@blackravenai.com',337.5,923,31,C.black),ct('blackravenai.com',337.5,971,31,C.black)]},
  {name:'spine',title:'Spine',family:'expressive',width:W,height:H,
   description:'The name runs up the edge. A small raven balances the open field, like a beautifully spare book cover.',
   front:[rect(0,0,W,H,C.silver),rotate(t('BLACKRAVEN',0,0,66,C.ink,8,'light'),-90,178,1000),cm(498,192,1.8,C.ink),
    t('MAKE',359,889,24,'#4B5C78',2),t('SOMETHING',359,938,24,'#4B5C78',2),t('MATTER.',359,987,24,'#4B5C78',2)],
   back:[rect(0,0,W,H,C.ink),line(178,92,178,1033,'#53617A',1.2),cm(414,201,1.8,C.glacier),
    t('CHRISTOPHER',234,497,28,C.silver,1),t('SHAW',234,542,28,C.silver,1),t('FOUNDER',235,595,23,C.glacier,2),
    rotate(t('support@blackravenai.com',0,0,31,C.silver),-90,126,996),
    t('blackravenai.com',234,966,29,C.silver)]},
  {name:'aperture',title:'Aperture',family:'minimal',width:W,height:H,
   description:'A fine frame, a centered mark, and a small signature. Every element has room to breathe.',
   front:[rect(0,0,W,H,C.ink),{...rect(90,90,495,945,undefined),stroke:'#77879F',width:1.2},cm(337.5,491,3.2,C.silver),
    ct('BLACKRAVEN',337.5,853,29,C.silver,4,'light'),ct('MAKE SOMETHING MATTER.',337.5,927,21,C.glacier,1.3)],
   back:[rect(0,0,W,H,C.ink),t('BLACKRAVEN',92,161,28,C.silver,4,'light'),
    t('Christopher Shaw',92,440,38,C.silver,0,'light'),t('FOUNDER',94,495,23,C.glacier,3),
    line(92,599,583,599,'#77879F',1.2),t('Make something',92,688,35,C.silver,0,'light'),t('matter.',92,738,35,C.silver,0,'light'),
    t('support@blackravenai.com',92,936,31,C.silver),t('blackravenai.com',92,984,31,C.silver)]},
  {name:'horizon',title:'Horizon',family:'expressive',width:W,height:H,
   description:'A long stretch of Glacier blue, grounded by a dark base. The raven floats above a discreet name.',
   front:[rect(0,0,W,H,C.glacier),cm(337.5,320,3.1,C.ink),rect(0,835,W,290,C.ink),ct('BLACKRAVEN',337.5,996,30,C.silver,4,'light')],
   back:[rect(0,0,W,H,C.silver),rect(0,0,W,145,C.glacier),t('BLACKRAVEN',92,275,27,C.ink,4,'light'),
    t('Christopher',92,479,45,C.ink,0,'light'),t('Shaw',92,538,45,C.ink,0,'light'),t('FOUNDER',94,597,23,'#52627B',3),
    t('support@blackravenai.com',92,936,31,C.ink),t('blackravenai.com',92,984,31,C.ink)]},
  {name:'ascending',title:'Ascending',family:'expressive',width:W,height:H,
   description:'An enlarged raven cuts across the tall format. A small, widely spaced signature grounds the movement.',
   front:[rect(0,0,W,H,C.ink),mark(135,-100,11.8,C.glacier),t('BLACKRAVEN',92,899,30,C.silver,4,'light'),
    t('MAKE SOMETHING',94,973,23,C.silver,2),t('MATTER.',94,1014,23,C.silver,2)],
   back:[rect(0,0,W,H,C.silver),t('MAKE SOMETHING',92,161,23,'#52627B',2),t('MATTER.',92,202,23,'#52627B',2),
    t('Christopher Shaw',92,495,38,C.ink,0,'light'),t('FOUNDER',94,550,23,'#52627B',3),
    cm(520,707,1.8,C.ink),t('support@blackravenai.com',92,936,31,C.ink),t('blackravenai.com',92,984,31,C.ink)]}
 ];
};
