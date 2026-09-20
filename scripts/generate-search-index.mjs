import{readFile,writeFile}from'node:fs/promises';
import{dirname,join}from'node:path';
import{fileURLToPath}from'node:url';

const projectRoot=join(dirname(fileURLToPath(import.meta.url)),'..');

function decodeHtml(value=''){
 return value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_match,code)=>String.fromCodePoint(Number(code)));
}

function textMatch(html,pattern,label,path){
 const value=html.match(pattern)?.[1];
 if(!value)throw new Error(`${path} is missing ${label}`);
 return decodeHtml(value.replace(/<[^>]+>/g,'').trim());
}

export async function createSearchIndex(root=projectRoot){
 const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');
 const urls=[...sitemap.matchAll(/<loc>(https:\/\/conversiontype\.com\/[^<]*)<\/loc>/g)].map(match=>new URL(match[1]).pathname).filter(path=>path!=='/');
 const seen=new Set(),entries=[];
 for(const url of urls){
  if(seen.has(url))throw new Error(`Duplicate sitemap URL: ${url}`);
  seen.add(url);
  const pagePath=join(root,url.replace(/^\//,'').replace(/\/$/,''),'index.html');
  const html=await readFile(pagePath,'utf8');
  const title=textMatch(html,/<h1[^>]*>([\s\S]*?)<\/h1>/i,'H1',url);
  const description=textMatch(html,/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,'meta description',url);
  const main=html.match(/<main\b[\s\S]*?<\/main>/i)?.[0]||'';
  const kind=/<form\b/i.test(main)?'calculator':'collection';
  entries.push({title,description,url,kind});
 }
 return entries;
}

export function serializeSearchIndex(index){
 return `export const searchIndex=Object.freeze(${JSON.stringify(index)});\n`;
}

export async function writeSearchIndex(output=join(projectRoot,'dist','search-index.js')){
 const index=await createSearchIndex();
 await writeFile(output,serializeSearchIndex(index));
 return index.length;
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const output=process.argv[2]?join(projectRoot,process.argv[2]):join(projectRoot,'search-index.js');
 const count=await writeSearchIndex(output);
 console.log(`Generated ${count} homepage search entries in ${output}.`);
}
