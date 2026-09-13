const key='conversiontype.consent.v1',dialog=document.querySelector('#privacy'),search=document.querySelector('#search'),items=[...document.querySelectorAll('[data-search]')],status=document.querySelector('#status'),empty=document.querySelector('#empty');
const openPrivacy=()=>{if(dialog?.showModal&&!dialog.open)dialog.showModal()};
document.querySelectorAll('[data-privacy]').forEach(x=>x.addEventListener('click',openPrivacy));
document.querySelectorAll('[data-consent]').forEach(x=>x.addEventListener('click',()=>{localStorage.setItem(key,JSON.stringify({choice:x.dataset.consent,savedAt:new Date().toISOString()}));document.documentElement.dataset.consent=x.dataset.consent}));
search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let count=0;items.forEach(x=>{const show=!q||x.dataset.search.includes(q)||x.textContent.toLowerCase().includes(q);x.hidden=!show;if(show&&x.tagName==='ARTICLE')count++});status.textContent=q?`${count} matching ${count===1?'tool':'tools'}`:'';empty.hidden=!q||count>0});
document.querySelector('#year').textContent=new Date().getFullYear();
try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.choice)document.documentElement.dataset.consent=saved.choice;else setTimeout(openPrivacy,350)}catch{setTimeout(openPrivacy,350)}
