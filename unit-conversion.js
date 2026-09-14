const form=document.querySelector('[data-conversion-form]'),fromInput=form?.elements.from,toInput=form?.elements.to,shareButton=document.querySelector('[data-share]'),status=document.querySelector('[data-conversion-status]');
const definitions={
 cm:{forward:n=>n/2.54,reverse:n=>n*2.54},
 kg:{forward:n=>n/0.45359237,reverse:n=>n*0.45359237},
 celsius:{forward:n=>n*9/5+32,reverse:n=>(n-32)*5/9},
 km:{forward:n=>n/1.609344,reverse:n=>n*1.609344},
 feet:{forward:n=>n*0.3048,reverse:n=>n/0.3048},
 ounces:{forward:n=>n*28.349523125,reverse:n=>n/28.349523125}
};
const format=n=>{
 if(!Number.isFinite(n))return'';
 if(Object.is(n,-0)||Math.abs(n)<1e-12)return'0';
 const abs=Math.abs(n);
 if(abs>=1e12||abs<1e-8)return n.toExponential(10).replace(/\.0+(?=e)|(?:(\.\d*?)0+)(?=e)/,'$1');
 return Number(n.toPrecision(12)).toString();
};
function setStatus(message,error=false){if(!status)return;status.textContent=message;status.dataset.error=error?'true':'false'}
function stateUrl(source,value){const url=new URL(location.href);url.search='';url.searchParams.set('source',source);url.searchParams.set('value',value);return url}
function convert(source,updateHistory=true){
 if(!form)return false;
 const input=source==='from'?fromInput:toInput,output=source==='from'?toInput:fromInput,raw=input.value.trim(),value=Number(raw),rule=definitions[form.dataset.conversion],reversed=form.dataset.reverse==='true';
 if(raw===''||!Number.isFinite(value)||!rule){output.value='';setStatus('Enter a valid number.',true);return false}
 const useForward=source==='from'?!reversed:reversed;
 output.value=format(useForward?rule.forward(value):rule.reverse(value));
 setStatus(`${input.labels[0].textContent}: ${raw}. ${output.labels[0].textContent}: ${output.value}.`);
 if(updateHistory)history.replaceState(null,'',stateUrl(source,raw));
 if(shareButton)shareButton.textContent='Share result';
 return true;
}
fromInput?.addEventListener('input',()=>convert('from'));
toInput?.addEventListener('input',()=>convert('to'));
form?.addEventListener('submit',event=>{event.preventDefault();convert(document.activeElement===toInput?'to':'from')});
shareButton?.addEventListener('click',async()=>{if(!location.search)return;try{if(navigator.share)await navigator.share({title:document.title,text:status?.textContent||'',url:location.href});else{await navigator.clipboard.writeText(location.href);shareButton.textContent='Link copied'}}catch{}});
function restore(){
 if(!form||!location.search)return;
 const params=new URLSearchParams(location.search),source=params.get('source'),raw=params.get('value');
 if(!params.has('source')&&!params.has('value'))return;
 if(!['from','to'].includes(source)||raw===null||raw.trim()===''||!Number.isFinite(Number(raw))){setStatus('This shared conversion link contains invalid values. You can still enter a number below.',true);return}
 (source==='from'?fromInput:toInput).value=raw;convert(source,false);
}
restore();
