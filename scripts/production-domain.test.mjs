import{readFile,readdir}from'node:fs/promises';

const origin='https://conversiontype.com';
const pages=[];
async function walk(dir='.'){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    if(['.git','node_modules','dist'].includes(entry.name))continue;
    const path=dir==='.'?entry.name:`${dir}/${entry.name}`;
    if(entry.isDirectory())await walk(path);
    else if(entry.name==='index.html')pages.push(path);
  }
}
await walk();
const sitemap=await readFile('sitemap.xml','utf8');
const robots=await readFile('robots.txt','utf8');
if(!robots.includes(`Sitemap: ${origin}/sitemap.xml`))throw new Error('robots.txt must advertise the canonical custom-domain sitemap');
if(/conversiontype\.pages\.dev/i.test(sitemap+robots))throw new Error('search-facing files must not reference pages.dev');
if(/<loc>https:\/\/www\.conversiontype\.com/i.test(sitemap))throw new Error('sitemap must not contain www URLs');
if(/<loc>[^<]*\?/.test(sitemap))throw new Error('sitemap must not contain calculator state URLs');
for(const file of pages){
  const body=await readFile(file,'utf8');
  if(/conversiontype\.pages\.dev/i.test(body))throw new Error(`${file} references pages.dev`);
  const canonical=body.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if(canonical&&(!canonical.startsWith(origin+'/')&&canonical!==origin+'/'))throw new Error(`${file} has non-production canonical ${canonical}`);
  if(canonical&&canonical.includes('?'))throw new Error(`${file} has stateful canonical`);
  if(/https:\/\/www\.conversiontype\.com/i.test(body))throw new Error(`${file} contains www absolute URL`);
}
console.log(`Production-domain checks passed for ${pages.length} HTML pages.`);
