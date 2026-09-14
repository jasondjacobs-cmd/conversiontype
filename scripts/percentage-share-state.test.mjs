import assert from 'node:assert/strict';
import{readFile}from'node:fs/promises';
import vm from'node:vm';
const source=await readFile(new URL('../percentage.js',import.meta.url),'utf8');
const cases={
 'percentage-of':{values:{percent:'20',value:'150'},answer:'>30<'},
 'what-percent':{values:{part:'45',total:'150'},answer:'30%'},
 'percentage-change':{values:{old:'80',new:'100'},answer:'25%'},
 'percentage-difference':{values:{a:'40',b:'60'},answer:'40%'},
 'percent-off':{values:{price:'80',discount:'25'},answer:'\\$60'},
 'markup-margin':{values:{cost:'60',price:'100'},answer:'66.666667% markup · 40% margin'}
};
const allNames=['percent','value','part','total','old','new','a','b','price','discount','cost'];
function page({mode,search='',values={}}){
 const listeners={};const defaults={percent:'20',value:'150',part:'45',total:'150',old:'80',new:'100',a:'40',b:'60',price:'80',discount:'25',cost:'60'};
 const elements=Object.fromEntries(allNames.map(name=>[name,{value:values[name]??defaults[name]}]));elements.mode={value:values.mode||mode};
 const form={dataset:{mode},elements,addEventListener(name,fn){listeners[name]=fn},querySelector(selector){return selector==='[name="mode"]'&&mode==='all'?elements.mode:null}};
 elements.mode.addEventListener=(name,fn)=>{listeners.modeChange=fn};
 const out={hidden:true,innerHTML:'',innerText:''};const share={textContent:'Share result',addEventListener(name,fn){listeners.share=fn}};
 const location={href:'https://conversiontype.com/test/'+search,search};const history={replaceState(_s,_t,url){location.href=String(url);location.search=new URL(location.href).search}};
 let copied='';
 vm.runInNewContext(source,{document:{title:'Calculator',querySelector(selector){return selector==='[data-percentage-form]'?form:selector==='[data-result]'?out:selector==='[data-share]'?share:null},querySelectorAll(){return[]}},location,history,navigator:{clipboard:{async writeText(text){copied=text}}},URL,URLSearchParams,Number,Math,Object});
 return{form,out,listeners,location,copied:()=>copied};
}
for(const[mode,item]of Object.entries(cases)){
 const first=page({mode,values:item.values});assert.equal(first.listeners.submit({preventDefault(){}}),true);assert.match(first.out.innerHTML,new RegExp(item.answer));
 const url=new URL(first.location.href);assert.equal(url.searchParams.has('mode'),false);for(const[name,value]of Object.entries(item.values))assert.equal(url.searchParams.get(name),value);
 const restored=page({mode,search:url.search});for(const[name,value]of Object.entries(item.values))assert.equal(restored.form.elements[name].value,value);assert.match(restored.out.innerHTML,new RegExp(item.answer));
}
const main=page({mode:'all',values:{mode:'percent-off',price:'80',discount:'25'}});assert.equal(main.listeners.submit({preventDefault(){}}),true);assert.equal(new URL(main.location.href).searchParams.get('mode'),'percent-off');await main.listeners.share();assert.equal(main.copied(),main.location.href);
const restored=page({mode:'all',search:new URL(main.location.href).search});assert.equal(restored.form.elements.mode.value,'percent-off');assert.match(restored.out.innerHTML,/\\$60/);
for(const search of['?mode=bad&a=1','?mode=percentage-of&percent=nope&value=4','?mode=what-percent&part=3','?mode=percentage-change&old=0&new=4']){const invalid=page({mode:'all',search});assert.match(invalid.out.innerHTML,/Check shared link/)}
console.log('Passed percentage calculations, shareable-state restoration, sharing, and malformed URL checks.');
