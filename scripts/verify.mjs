import{access,readFile}from'node:fs/promises';
const ratioPages=["ratio-calculator","simplify-ratio","solve-ratio","scale-ratio","ratio-to-fraction","ratio-to-percentage","percentage-to-ratio"];
const percentagePages=["percentage-calculator","percentage-of","what-percent","percentage-change","percentage-difference","percent-off","markup-margin-calculator"];
const fractionPages=["fraction-calculator","simplify-fraction","fraction-to-decimal","decimal-to-fraction","fraction-to-percentage","percentage-to-fraction"];
const pages=[...ratioPages,...percentagePages,...fractionPages];
const required=['index.html','styles.css','app.js','ratio.js','percentage.js','fraction.js','robots.txt','sitemap.xml','site.webmanifest','favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png','android-chrome-192x192.png','android-chrome-512x512.png','assets/conversiontype-logo.png','.github/workflows/release-gates.yml','.github/workflows/production-qa.yml','qa/conversiontype-production.spec.mjs',...pages.map(x=>x+'/index.html')];
await Promise.all(required.map(file=>access(file)));
const html=await readFile('index.html','utf8'),app=await readFile('app.js','utf8'),ratio=await readFile('ratio.js','utf8'),percentage=await readFile('percentage.js','utf8'),fraction=await readFile('fraction.js','utf8'),map=await readFile('sitemap.xml','utf8'),manifest=JSON.parse(await readFile('site.webmanifest','utf8'));
const combined=html+app+ratio+percentage+fraction;
const checks=[[html.includes('<meta name="description"'),'SEO description'],[html.includes('id="privacy"'),'privacy choices'],[html.includes('Percentage Calculator'),'percentage launch tool'],[app.includes('conversiontype.consent.v1'),'versioned consent'],[ratio.includes('data-ratio-form'),'ratio engine'],[percentage.includes('data-percentage-form'),'percentage engine'],[fraction.includes('data-fraction-form'),'fraction engine'],[!/(googletagmanager|doubleclick|adsbygoogle|google-analytics)/i.test(combined),'no provider scripts'],[manifest.name==='ConversionType','web manifest'],...pages.map(p=>[map.includes('https://conversiontype.com/'+p+'/'),'sitemap '+p])];
const titles=new Set(),descriptions=new Set();
for(const p of pages){
 const body=await readFile(p+'/index.html','utf8');
 const title=body.match(/<title>([^<]+)<\/title>/)?.[1];
 const description=body.match(/<meta name="description" content="([^"]+)"/)?.[1];
 checks.push(
  [body.includes('<link rel="canonical" href="https://conversiontype.com/'+p+'/">'),p+' canonical'],
  [Boolean(description),p+' description'],
  [body.includes('<h1>'),p+' h1'],
  [body.includes('application/ld+json'),p+' structured data'],
  [body.includes(ratioPages.includes(p)?'data-ratio-form':percentagePages.includes(p)?'data-percentage-form':'data-fraction-form'),p+' calculator'],
  [!body.match(/rel="canonical"[^>]*\?/),p+' clean canonical'],
  [body.includes('<h2>Examples</h2>'),p+' examples'],
  [body.includes('class="related-grid"'),p+' internal links']
 );
 if(ratioPages.includes(p)||fractionPages.includes(p))checks.push([body.includes('<h2>Formula</h2>'),p+' formula']);
 checks.push([!titles.has(title),p+' unique title'],[!descriptions.has(description),p+' unique description']);
 titles.add(title);descriptions.add(description);
}
checks.push([!/<loc>[^<]*\?/.test(map),'sitemap excludes query states']);
for(const[passed,name]of checks)if(!passed)throw new Error('Release gate failed: '+name);
console.log('Passed '+checks.length+' platform and SEO release checks.');
