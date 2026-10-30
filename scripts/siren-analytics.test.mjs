import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const script=fs.readFileSync(new URL('../js/siren-analytics.js', import.meta.url),'utf8');
function harness(choice){
 const store=new Map(choice===undefined?[]:[['blackraven.website.analytics.v1',choice]]), nodes=[], handlers={}, sent=[];
 let config,initCount=0;
 const sdk={__SV:1,init(k,c){initCount++;config=c;c.loaded(sdk)},register(p){sdk.props=p},capture(e,p){const event=config.before_send({event:e,properties:{...sdk.props,...p,$current_url:'https://private/?kindred=secret',$set:{email:'secret'}}});if(event)sent.push(event)},opt_out_capturing(){},opt_in_capturing(){}};
 function el(tag){return {tag,children:[],style:{},setAttribute(){},append(n){this.children.push(n)},addEventListener(n,f){this[n]=f},showModal(){},close(){},remove(){}}}
 const footer=el('footer');const document={getElementById(){return null},querySelector(){return footer},createElement:el,body:{append(n){nodes.push(n)}},addEventListener(k,f){handlers[k]=f}};
 const context={window:{posthog:sdk},document,location:{hostname:'www.blackravenai.com',origin:'https://www.blackravenai.com',pathname:'/apps/squeezy-fish/',search:'?utm_source=tiktok&utm_campaign=launch&kindred=private'},localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},URL,URLSearchParams};
 vm.runInNewContext(script,context);return {sent,nodes,handlers,get initCount(){return initCount},footer};
}
test('no SDK until explicit consent; pageview has app and campaign, no private params',()=>{
 const h=harness();assert.equal(h.initCount,0);h.nodes[0].children[0].onclick();assert.equal(h.initCount,1);
 const e=h.sent[0];assert.equal(e.event,'$pageview');assert.equal(e.properties.app,'squeezy-fish');assert.equal(e.properties.utm_campaign,'launch');assert.equal(e.properties.$current_url,'https://www.blackravenai.com/apps/squeezy-fish/');assert.equal(e.properties.$set,undefined);
});
test('store click captured and Google Play referrer tagged; rejection sends nothing',()=>{
 const h=harness('yes');const a={href:'https://play.google.com/store/apps/details?id=example'};
 h.handlers.click({target:{closest:()=>a}});assert.equal(h.sent[1].event,'store_click');assert.match(new URL(a.href).searchParams.get('referrer'),/utm_campaign=launch/);
 const off=harness('no');off.handlers.click({target:{closest:()=>a}});assert.equal(off.sent.length,0);assert.equal(off.initCount,0);
});
test('footer lets a visitor revoke consent; further clicks are dropped',()=>{
 const h=harness('yes');h.footer.children[0].onclick();h.nodes[0].children[1].onclick();
 h.handlers.click({target:{closest:()=>({href:'https://apps.apple.com/app/id123'})}});assert.equal(h.sent.length,1);
});
