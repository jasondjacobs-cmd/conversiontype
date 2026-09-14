const form=document.querySelector('[data-percentage-form]');
const out=document.querySelector('[data-result]');
const shareButton=document.querySelector('[data-share]');
const modes=['percentage-of','what-percent','percentage-change','percentage-difference','percent-off','markup-margin'];
const fieldsByMode={
  'percentage-of':['percent','value'],
  'what-percent':['part','total'],
  'percentage-change':['old','new'],
  'percentage-difference':['a','b'],
  'percent-off':['price','discount'],
  'markup-margin':['cost','price']
};
const fmt=n=>Number.isInteger(n)?String(n):Number(n.toFixed(6)).toString();
const currentMode=()=>form.dataset.mode==='all'?form.elements.mode.value:form.dataset.mode;
function render(title,value,steps){out.hidden=false;out.innerHTML='<p class="eyebrow">Result</p><h2>'+title+'</h2><div class="answer">'+value+'</div><p>'+steps+'</p>'}
function readValues(mode){
  const values={};
  for(const name of fieldsByMode[mode]||[]){const raw=form.elements[name]?.value;if(typeof raw!=='string'||raw.trim()===''||!Number.isFinite(Number(raw)))return null;values[name]=Number(raw)}
  if(mode==='what-percent'&&values.total===0)return null;
  if(mode==='percentage-change'&&values.old===0)return null;
  if(mode==='percentage-difference'&&Math.abs(values.a)+Math.abs(values.b)===0)return null;
  if(mode==='markup-margin'&&(values.cost===0||values.price===0))return null;
  return values;
}
function showFields(mode){document.querySelectorAll('[data-for]').forEach(element=>{element.hidden=!element.dataset.for.split(' ').includes(mode)})}
function stateUrl(mode){const url=new URL(location.href);url.search='';if(form.dataset.mode==='all')url.searchParams.set('mode',mode);for(const name of fieldsByMode[mode])url.searchParams.set(name,form.elements[name].value.trim());return url}
function calculate(event,updateHistory=true){
  event?.preventDefault();const mode=currentMode();
  if(!modes.includes(mode)){render('Check your values','—','Choose a supported calculation.');return false}
  const v=readValues(mode);if(!v){render('Check your values','—','Enter valid numbers. Divisors and starting values cannot be zero.');return false}
  if(mode==='percentage-of'){const n=v.percent/100*v.value;render('Percentage amount',fmt(n),fmt(v.percent)+'% of '+fmt(v.value)+' = '+fmt(n)+'.')}
  else if(mode==='what-percent'){const n=v.part/v.total*100;render('Percentage',fmt(n)+'%',fmt(v.part)+' ÷ '+fmt(v.total)+' × 100 = '+fmt(n)+'%.')}
  else if(mode==='percentage-change'){const n=(v.new-v.old)/Math.abs(v.old)*100;render('Percentage change',fmt(n)+'%',('The value '+(n>=0?'increased':'decreased')+' by '+fmt(Math.abs(n))+'%.'))}
  else if(mode==='percentage-difference'){const n=Math.abs(v.a-v.b)/((Math.abs(v.a)+Math.abs(v.b))/2)*100;render('Percentage difference',fmt(n)+'%','Difference ÷ average × 100 = '+fmt(n)+'%.')}
  else if(mode==='percent-off'){const saved=v.price*v.discount/100,sale=v.price-saved;render('Sale price','$'+fmt(sale),fmt(v.discount)+'% off saves $'+fmt(saved)+'.')}
  else{const profit=v.price-v.cost,markup=profit/v.cost*100,margin=profit/v.price*100;render('Markup and margin',fmt(markup)+'% markup · '+fmt(margin)+'% margin','Profit is $'+fmt(profit)+'.')}
  if(updateHistory)history.replaceState(null,'',stateUrl(mode));if(shareButton)shareButton.textContent='Share result';return true;
}
function restoreState(){
  if(!form||!location.search)return;const params=new URLSearchParams(location.search);const mode=form.dataset.mode==='all'?params.get('mode'):form.dataset.mode;
  const hasState=form.dataset.mode==='all'?params.has('mode')||modes.some(item=>fieldsByMode[item].some(name=>params.has(name))):fieldsByMode[mode].some(name=>params.has(name));
  if(!hasState)return;if(!modes.includes(mode)||fieldsByMode[mode].some(name=>!params.has(name))){render('Check shared link','—','This shared calculator link is incomplete or unsupported.');return}
  for(const name of fieldsByMode[mode]){const raw=params.get(name);if(raw===null||raw.trim()===''||!Number.isFinite(Number(raw))){render('Check shared link','—','This shared calculator link contains invalid values.');return}form.elements[name].value=raw}
  if(form.dataset.mode==='all')form.elements.mode.value=mode;showFields(mode);if(!readValues(mode)){render('Check shared link','—','This shared calculator link contains invalid values.');return}calculate(null,false);
}
form?.addEventListener('submit',calculate);form?.querySelector('[name="mode"]')?.addEventListener('change',event=>showFields(event.target.value));
shareButton?.addEventListener('click',async()=>{if(out?.hidden)return;try{if(navigator.share)await navigator.share({title:document.title,text:out.innerText.trim(),url:location.href});else{await navigator.clipboard.writeText(location.href);shareButton.textContent='Link copied'}}catch{}});
restoreState();
