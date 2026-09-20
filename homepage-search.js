import{searchIndex}from'./search-index.js';
import{searchTools}from'./search-core.js';

function resultCard(document,entry){
 const link=document.createElement('a'),heading=document.createElement('h3'),description=document.createElement('p'),action=document.createElement('b');
 link.className='card';link.href=entry.url;
 heading.textContent=entry.title;description.textContent=entry.description;
 action.textContent=entry.kind==='collection'?'Open collection':'Open calculator';
 link.append(heading,description,action);
 return link;
}

export function initHomepageSearch(document,index=searchIndex){
 const input=document.querySelector('#search'),status=document.querySelector('#status'),results=document.querySelector('#search-results'),grid=document.querySelector('#search-result-grid'),empty=document.querySelector('#empty'),browse=document.querySelector('#browse');
 if(!input||!status||!results||!grid||!empty||!browse)return;

 const setEmptyState=visible=>{
  empty.hidden=!visible;
  empty.classList.toggle('is-visible',visible);
  empty.setAttribute('aria-hidden',String(!visible));
 };

 const update=()=>{
  const query=input.value.trim();
  if(!query){
   status.textContent='';results.hidden=true;browse.hidden=false;setEmptyState(false);grid.hidden=false;grid.replaceChildren();
   return;
  }
  const matches=searchTools(index,query);
  grid.replaceChildren(...matches.map(entry=>resultCard(document,entry)));
  grid.hidden=matches.length===0;setEmptyState(matches.length===0);
  browse.hidden=true;results.hidden=false;
  status.textContent=`${matches.length} matching ${matches.length===1?'tool':'tools'}`;
 };

 input.addEventListener('input',update);
 input.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&input.value){event.preventDefault();input.value='';update();input.focus()}
 });
}

if(typeof document!=='undefined')initHomepageSearch(document);
