import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile('analytics.js','utf8');
const build=await readFile('scripts/build.mjs','utf8');
const headers=await readFile('_headers','utf8');
assert.match(build,/['"]analytics\.js['"]/,'production must copy analytics module');
assert.match(build,/inject\('dist'\)/,'production must inject analytics on all HTML pages');
assert.match(headers,/script-src[^\n]*https:\/\/www\.googletagmanager\.com/);
assert.match(source,/G-SHR0ETX628/);
function harness(choice){
 const listeners=new Map(),requests=[],events=[],store=new Map(),scripts=[],root={};let reloads=0;
 if(choice)store.set('conversiontype.consent.v1',JSON.stringify({choice}));
 const localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const document={head:{append:script=>{scripts.push(script);requests.push(script.src)}},createElement:tag=>({tag}),addEventListener:(name,fn)=>{const list=listeners.get(name)||[];list.push(fn);listeners.set(name,list)}};
 const location={origin:'https://conversiontype.com',pathname:'/loan-calculator/',search:'?principal=PRIVATE',hash:'#private',reload:()=>{reloads++}};
 const window={dataLayer:[]};
 const context={document,window,localStorage,location,URL,Date,queueMicrotask:fn=>fn()};
 vm.runInNewContext(source,context,{filename:'analytics.js'});
 function click(target){for(const fn of listeners.get('click')||[])fn({target:{closest:selector=>selector==='[data-consent]'&&target==='consent'?{}:null}})}
 function setChoice(next){store.set('conversiontype.consent.v1',JSON.stringify({choice:next}));click('consent')}
 function eventNames(){return window.dataLayer.filter(item=>item[0]==='event').map(item=>item[1])}
 function assertClean(){for(const item of window.dataLayer)assert.ok(!JSON.stringify(item).includes('PRIVATE'),'never transmit share-state values')}
 return {requests,scripts,window,setChoice,eventNames,assertClean,get reloads(){return reloads}};
}
const unknown=harness();assert.equal(unknown.requests.length,0,'no Google request without choice');assert.deepEqual(unknown.eventNames(),[]);unknown.setChoice('essential');assert.equal(unknown.requests.length,0,'essential-only must not load Google');unknown.setChoice('analytics');assert.equal(unknown.requests.length,1,'opt-in loads Google once');assert.match(unknown.requests[0],/googletagmanager\.com\/gtag\/js\?id=G-SHR0ETX628/);assert.deepEqual(unknown.eventNames(),['page_view']);unknown.assertClean();unknown.setChoice('essential');assert.equal(unknown.reloads,1,'revocation must unload Google runtime');assert.equal(unknown.eventNames().length,1,'revocation must not emit another event');
const denied=harness('essential');assert.equal(denied.requests.length,0,'persisted denial must not load Google');
const opted=harness('analytics');assert.equal(opted.requests.length,1,'persisted opt-in may load Google');opted.assertClean();opted.setChoice('analytics');assert.equal(opted.requests.length,1,'repeated consent must not duplicate tag');opted.setChoice('essential');assert.equal(opted.reloads,1);const afterReload=harness('essential');assert.equal(afterReload.requests.length,0,'revoked choice must remain off after reload');
console.log('PASS: analytics absent before consent and on persisted denial; opt-in loads once; sanitized page view; revocation reloads and stays off.');
