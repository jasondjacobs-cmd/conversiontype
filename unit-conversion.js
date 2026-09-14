const conversionForm=document.querySelector('[data-conversion-form]'),fromInput=conversionForm?.elements.from,toInput=conversionForm?.elements.to,conversionShareButton=document.querySelector('[data-share]'),conversionStatus=document.querySelector('[data-conversion-status]');
const conversionRules={
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
 const nearestInteger=Math.round(n);
 if(Math.abs(n-nearestInteger)<1e-10)return String(nearestInteger);
 const abs=Math.abs(n);
 if(abs>=1e12||abs<1e-8)return n.toExponential(10).replace(/\.0+(?=e)|(?:(\.\d*?)0+)(?=e)/,'$1');
 return Number(n.toPrecision(12)).toString();
};
function setStatus(message,error=false){if(!conversionStatus)return;conversionStatus.textContent=message;conversionStatus.dataset.error=error?'true':'false'}
function stateUrl(source,value){const url=new URL(location.href);url.search='';url.searchParams.set('source',source);url.searchParams.set('value',value);return url}
function convert(source,updateHistory=true){
 if(!conversionForm)return false;
 const input=source==='from'?fromInput:toInput,output=source==='from'?toInput:fromInput,raw=input.value.trim(),value=Number(raw),rule=conversionRules[conversionForm.dataset.conversion],reversed=conversionForm.dataset.reverse==='true';
 if(raw===''||!Number.isFinite(value)||!rule){output.value='';setStatus('Enter a valid number.',true);return false}
 const useForward=source==='from'?!reversed:reversed;
 output.value=format(useForward?rule.forward(value):rule.reverse(value));
 setStatus(`${input.labels[0].textContent}: ${raw}. ${output.labels[0].textContent}: ${output.value}.`);
 if(updateHistory)history.replaceState(null,'',stateUrl(source,raw));
 if(conversionShareButton)conversionShareButton.textContent='Share result';
 return true;
}
fromInput?.addEventListener('input',()=>convert('from'));
toInput?.addEventListener('input',()=>convert('to'));
conversionForm?.addEventListener('submit',event=>{event.preventDefault();convert(document.activeElement===toInput?'to':'from')});
conversionShareButton?.addEventListener('click',async()=>{if(!location.search)return;try{if(navigator.share)await navigator.share({title:document.title,text:conversionStatus?.textContent||'',url:location.href});else{await navigator.clipboard.writeText(location.href);conversionShareButton.textContent='Link copied'}}catch{}});
function restore(){
 if(!conversionForm||!location.search)return;
 const params=new URLSearchParams(location.search),source=params.get('source'),raw=params.get('value');
 if(!params.has('source')&&!params.has('value'))return;
 if(!['from','to'].includes(source)||raw===null||raw.trim()===''||!Number.isFinite(Number(raw))){setStatus('This shared conversion link contains invalid values. You can still enter a number below.',true);return}
 (source==='from'?fromInput:toInput).value=raw;convert(source,false);
}
restore();
