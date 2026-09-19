// GA4 is intentionally absent until a visitor explicitly opts in.
// Do not send form values, result text, search terms, or stateful URLs.
(()=>{
'use strict';
const ID='G-SHR0ETX628', KEY='conversiontype.consent.v1';
let started=false, enabled=false;
function allowed(){try{return JSON.parse(localStorage.getItem(KEY))?.choice==='analytics'}catch{return false}}
function cleanPath(){return location.pathname}
function start(){
 if(started||!allowed())return;
 started=true;enabled=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=function(){window.dataLayer.push(arguments)};
 window.gtag('js',new Date());
 window.gtag('config',ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,anonymize_ip:true,page_location:location.origin+cleanPath(),page_path:cleanPath()});
 const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.append(script);
 event('page_view');
}
function event(name,params={}){if(!enabled||!allowed()||typeof window.gtag!=='function')return;window.gtag('event',name,{...params,page_location:location.origin+cleanPath(),page_path:cleanPath()})}
function consentChanged(){if(allowed())start();else if(enabled){enabled=false;window.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});/* A reload clears any already loaded Google runtime. */location.reload()}}
// Consent buttons persist their choice in app.js on the same click. Defer until that handler completes.
document.addEventListener('click',e=>{if(e.target.closest('[data-consent]'))queueMicrotask(consentChanged)});
document.addEventListener('click',e=>{const share=e.target.closest('[data-share]');if(share)event('share_result',{tool:cleanPath()});const link=e.target.closest('a[href]');if(link){try{const url=new URL(link.href);if(url.origin===location.origin&&url.pathname!==cleanPath()&&link.closest('.related-grid,.side-links,.related'))event('related_calculator_click',{destination:url.pathname})}catch{}}});
document.addEventListener('submit',e=>{if(e.target.closest('form')&&!e.target.closest('#privacy form'))event('calculator_submit',{tool:cleanPath()})});
start();
})();
