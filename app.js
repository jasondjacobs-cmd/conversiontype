const key='conversiontype.consent.v1',dialog=document.querySelector('#privacy'),search=document.querySelector('#search'),items=[...document.querySelectorAll('[data-search]')],status=document.querySelector('#status'),empty=document.querySelector('#empty');
const openPrivacy=()=>{if(dialog?.showModal&&!dialog.open)dialog.showModal()};
document.querySelectorAll('[data-privacy]').forEach(x=>x.addEventListener('click',openPrivacy));
document.querySelectorAll('[data-consent]').forEach(x=>x.addEventListener('click',()=>{localStorage.setItem(key,JSON.stringify({choice:x.dataset.consent,savedAt:new Date().toISOString()}));document.documentElement.dataset.consent=x.dataset.consent}));
if(search){search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let count=0;items.forEach(x=>{const show=!q||x.dataset.search.includes(q)||x.textContent.toLowerCase().includes(q);x.hidden=!show;if(show&&x.tagName==='ARTICLE')count++});if(status)status.textContent=q?`${count} matching ${count===1?'tool':'tools'}`:'';if(empty)empty.hidden=!q||count>0})}
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.choice)document.documentElement.dataset.consent=saved.choice;else setTimeout(openPrivacy,350)}catch{setTimeout(openPrivacy,350)}

// Definition Bubbles v1: progressive enhancement for crawlable calculator explanations.
// The underlying explanation text stays in HTML; this layer only adds contextual learning UI.
const definitions={
 'greatest common divisor':{label:'Greatest common divisor (GCD)',text:'The largest whole number that divides evenly into two or more numbers.'},
 'GCD':{label:'Greatest common divisor (GCD)',text:'The largest whole number that divides evenly into two or more numbers.'},
 'equivalent ratio':{label:'Equivalent ratio',text:'A ratio with the same proportional relationship as another ratio, even when the numbers are different.'},
 'ratio':{label:'Ratio',text:'A comparison of two quantities, commonly written with a colon such as 2:3.'},
 'proportion':{label:'Proportion',text:'An equation stating that two ratios or fractions are equal.'},
 'scale factor':{label:'Scale factor',text:'The number used to multiply or divide every corresponding value while preserving a proportion.'},
 'numerator':{label:'Numerator',text:'The top number of a fraction. It tells how many parts are being considered.'},
 'denominator':{label:'Denominator',text:'The bottom number of a fraction. It tells how many equal parts make up the whole.'},
 'fraction':{label:'Fraction',text:'A number that represents part of a whole or a division of one quantity by another.'},
 'percentage point':{label:'Percentage point',text:'The arithmetic difference between two percentages. A rise from 20% to 25% is 5 percentage points.'},
 'percentage change':{label:'Percentage change',text:'The relative increase or decrease from an original value, expressed as a percentage.'},
 'percentage difference':{label:'Percentage difference',text:'A comparison of the difference between two values relative to their average.'},
 'percentage':{label:'Percentage',text:'A value expressed as parts per hundred. For example, 75% means 75 out of 100.'},
 'percent':{label:'Percent',text:'A value per hundred. The symbol % means “out of 100.”'},
 'decimal':{label:'Decimal',text:'A base-10 way to write a number using a decimal point, such as 0.75.'},
 'reciprocal':{label:'Reciprocal',text:'The value produced by swapping a fraction’s numerator and denominator; for example, 3/4 becomes 4/3.'},
 'common denominator':{label:'Common denominator',text:'A shared denominator used to compare, add, or subtract fractions.'},
 'mixed number':{label:'Mixed number',text:'A number containing a whole number and a proper fraction, such as 2 1/3.'},
 'markup':{label:'Markup',text:'The amount added to cost to determine a selling price, often expressed as a percentage of cost.'},
 'margin':{label:'Margin',text:'The portion of a selling price remaining after cost, often expressed as a percentage of the selling price.'},
 'conversion factor':{label:'Conversion factor',text:'A number used to multiply or divide a measurement to express it in another unit.'},
 'centimeter':{label:'Centimeter',text:'A metric unit of length equal to one hundredth of a meter.'},
 'inch':{label:'Inch',text:'A unit of length equal to exactly 2.54 centimeters.'},
 'kilogram':{label:'Kilogram',text:'The base metric unit of mass, equal to 1,000 grams.'},
 'pound':{label:'Pound',text:'An avoirdupois unit of mass equal to exactly 0.45359237 kilograms.'},
 'Celsius':{label:'Celsius',text:'A temperature scale where water freezes at 0 degrees and boils at 100 degrees at standard atmospheric pressure.'},
 'Fahrenheit':{label:'Fahrenheit',text:'A temperature scale where water freezes at 32 degrees and boils at 212 degrees at standard atmospheric pressure.'},
 'kilometer':{label:'Kilometer',text:'A metric unit of length equal to 1,000 meters.'},
 'mile':{label:'Mile',text:'A unit of length equal to exactly 1.609344 kilometers.'},
 'meter':{label:'Meter',text:'The base metric unit of length.'},
 'foot':{label:'Foot',text:'A unit of length equal to 12 inches or exactly 0.3048 meters.'},
 'ounce':{label:'Ounce',text:'An avoirdupois unit of mass equal to exactly 28.349523125 grams.'},
 'gram':{label:'Gram',text:'A metric unit of mass equal to one thousandth of a kilogram.'},
 'elapsed time':{label:'Elapsed time',text:'The amount of time that passes between a starting point and an ending point.'},
 'duration':{label:'Duration',text:'A measured length of time, such as 2 hours and 30 minutes.'},
 'decimal hours':{label:'Decimal hours',text:'A duration written as a decimal number of hours. For example, 1 hour 30 minutes is 1.5 hours.'},
 'business day':{label:'Business day',text:'For these calculators, a Monday through Friday calendar day. Holidays are not automatically excluded.'},
 'calendar day':{label:'Calendar day',text:'Any dated day, including Saturdays, Sundays, and holidays.'},
 'inclusive counting':{label:'Inclusive counting',text:'A counting method that includes both the starting date and ending date.'},
 'leap year':{label:'Leap year',text:'A year with 366 days, including February 29.'},
 '12-hour clock':{label:'12-hour clock',text:'A clock system that divides the day into two 12-hour periods marked AM and PM.'},
 '24-hour clock':{label:'24-hour clock',text:'A clock system that numbers hours from 00 through 23.'}
};

const definitionEntries=Object.entries(definitions).sort((a,b)=>b[0].length-a[0].length);
let activeDefinition=null;
function closeDefinition({restoreFocus=true}={}){
 if(!activeDefinition)return;
 const {trigger,bubble}=activeDefinition;
 trigger.setAttribute('aria-expanded','false');
 bubble.remove();
 activeDefinition=null;
 if(restoreFocus)trigger.focus();
}
function positionDefinition(trigger,bubble){
 const gap=8,pad=12,r=trigger.getBoundingClientRect(),b=bubble.getBoundingClientRect();
 let left=Math.min(Math.max(pad,r.left+(r.width-b.width)/2),window.innerWidth-b.width-pad);
 let top=r.bottom+gap;
 if(top+b.height>window.innerHeight-pad&&r.top-b.height-gap>=pad)top=r.top-b.height-gap;
 bubble.style.left=`${Math.max(pad,left)}px`;bubble.style.top=`${Math.max(pad,top)}px`;
}
function openDefinition(trigger,key){
 if(activeDefinition?.trigger===trigger){closeDefinition();return}
 closeDefinition({restoreFocus:false});
 const def=definitions[key],bubble=document.createElement('div');
 bubble.className='definition-bubble';bubble.id=`definition-${Math.random().toString(36).slice(2)}`;bubble.setAttribute('role','dialog');bubble.setAttribute('aria-label',def.label);
 const heading=document.createElement('strong'),text=document.createElement('span'),close=document.createElement('button');
 heading.textContent=def.label;text.textContent=def.text;close.type='button';close.className='definition-close';close.setAttribute('aria-label',`Close ${def.label} definition`);close.textContent='×';
 bubble.append(heading,text,close);document.body.append(bubble);trigger.setAttribute('aria-controls',bubble.id);trigger.setAttribute('aria-expanded','true');activeDefinition={trigger,bubble};positionDefinition(trigger,bubble);close.addEventListener('click',()=>closeDefinition());
}
function enhanceDefinitions(){
 const roots=document.querySelectorAll('.content p,.content li');
 roots.forEach(root=>{
  if(root.closest('.definition-bubble'))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  const used=new Set();
  nodes.forEach(node=>{
   if(node.parentElement?.closest('a,button,[data-definition]'))return;
   let text=node.nodeValue,match=null;
   for(const [term] of definitionEntries){const re=new RegExp(`\\b${term.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i'),found=re.exec(text);if(found&&!used.has(term.toLowerCase())&&(!match||found.index<match.index)){match={term,index:found.index,value:found[0]}}}
   if(!match)return;
   used.add(match.term.toLowerCase());const frag=document.createDocumentFragment();frag.append(text.slice(0,match.index));const trigger=document.createElement('button');trigger.type='button';trigger.className='definition-term';trigger.dataset.definition=match.term;trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',`${match.value}: show definition`);trigger.textContent=match.value;trigger.addEventListener('click',()=>openDefinition(trigger,match.term));frag.append(trigger,text.slice(match.index+match.value.length));node.replaceWith(frag);
  });
 });
}
enhanceDefinitions();
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&activeDefinition){event.preventDefault();closeDefinition()}});
document.addEventListener('pointerdown',event=>{if(activeDefinition&&!activeDefinition.bubble.contains(event.target)&&event.target!==activeDefinition.trigger)closeDefinition({restoreFocus:false})});
window.addEventListener('resize',()=>{if(activeDefinition)positionDefinition(activeDefinition.trigger,activeDefinition.bubble)});
window.addEventListener('scroll',()=>{if(activeDefinition)positionDefinition(activeDefinition.trigger,activeDefinition.bubble)},{passive:true});
