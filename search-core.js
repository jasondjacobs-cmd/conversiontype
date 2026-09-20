const stopWords=new Set(['a','an','the','to','of','for','in','into','and','or','how','many','much','is','are','my','with']);

export function normalizeSearchText(value=''){
 return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/%/g,' percent ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}

function canonicalToken(value){
 let token=value;
 if(/^calculat(?:e|es|ed|ing|ion|ions|or|ors)$/.test(token))return'calculate';
 if(/^convert(?:s|ed|ing|er|ers)?$/.test(token)||token==='conversion'||token==='conversions')return'convert';
 if(token.length>5&&token.endsWith('ies'))token=token.slice(0,-3)+'y';
 else if(token.length>3&&token.endsWith('s')&&!token.endsWith('ss'))token=token.slice(0,-1);
 return token;
}

export function searchTokens(value=''){
 const tokens=normalizeSearchText(value).split(' ').filter(Boolean).map(canonicalToken);
 const useful=tokens.filter(token=>!stopWords.has(token));
 return useful.length?useful:tokens;
}

function fieldTokens(entry){
 return searchTokens(`${entry.title} ${entry.description} ${entry.url.replaceAll('/',' ')}`);
}

function tokenMatches(queryToken,indexToken){
 return queryToken===indexToken||(queryToken.length>=3&&indexToken.startsWith(queryToken));
}

function includesEvery(queryTokens,indexTokens){
 return queryTokens.every(queryToken=>indexTokens.some(indexToken=>tokenMatches(queryToken,indexToken)));
}

function scoreEntry(entry,query,queryTokens){
 const title=normalizeSearchText(entry.title),url=normalizeSearchText(entry.url.replaceAll('/',' '));
 const titleTokens=searchTokens(entry.title),urlTokens=searchTokens(entry.url.replaceAll('/',' '));
 let score=0;
 if(title===query)score+=1000;
 else if(title.startsWith(query))score+=700;
 else if(title.includes(query))score+=500;
 if(includesEvery(queryTokens,titleTokens))score+=300;
 if(includesEvery(queryTokens,urlTokens))score+=180;
 if(url===query)score+=80;
 return score-entry.title.length/1000;
}

export function searchTools(index,rawQuery){
 const query=normalizeSearchText(rawQuery),queryTokens=searchTokens(rawQuery);
 if(!query||queryTokens.length===0)return[];
 return index
  .filter(entry=>includesEvery(queryTokens,fieldTokens(entry)))
  .map(entry=>({entry,score:scoreEntry(entry,query,queryTokens)}))
  .sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title))
  .map(result=>result.entry);
}
