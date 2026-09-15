import {readFile} from 'node:fs/promises';

const unitPages=['cm-to-inches','kg-to-lbs','inches-to-cm','lbs-to-kg','celsius-to-fahrenheit','fahrenheit-to-celsius','km-to-miles','miles-to-km','feet-to-meters','meters-to-feet','ounces-to-grams','grams-to-ounces'];
const cookingPages=['cups-to-ounces','ounces-to-cups','cups-to-tablespoons','tablespoons-to-cups','tablespoons-to-teaspoons','cups-to-ml','ml-to-cups','grams-to-cups','cups-to-grams','butter-converter'];
const livePages=[...unitPages,...cookingPages];
const brand='<a class="brand" href="/" aria-label="ConversionType home"><img src="/android-chrome-192x192.png" alt="" width="44" height="44"><span>Conversion<b>Type</b></span></a>';
const footer='<footer><b>ConversionType</b><span>Convert. Calculate. Compare. Solve.</span><button data-privacy>Privacy choices</button><small>© <span id="year"></span> ConversionType</small></footer>';

for(const page of livePages){
 const html=await readFile(`${page}/index.html`,'utf8');
 for(const [token,label] of [[brand,'canonical brand'],['<a class="skip" href="#main">Skip to content</a>','skip link'],['<main id="main">','main landmark'],['<nav>','navigation'],['class="tool-layout"','tool layout'],['class="calculator"','calculator layout'],[footer,'canonical footer'],['<dialog id="privacy">','privacy dialog'],['data-consent="essential"','essential privacy choice'],['data-consent="analytics"','analytics privacy choice'],['data-share>Share result</button>','Share Result action']])if(!html.includes(token))throw new Error(`${page} missing ${label}`);
 if(/<button[^>]*type="submit"[^>]*>\s*(Convert|Calculate)\s*<\/button>/i.test(html)||/<button class="primary">\s*Convert\s*<\/button>/i.test(html))throw new Error(`${page} has a redundant live-converter submit action`);
 if(cookingPages.includes(page)&&html.includes('<select')&&!/<div class="fields">.*?<select.*?<\/select>.*?<\/div>/.test(html)&&!/<div class="fields conversion-fields">.*?<select.*?<\/select>.*?<\/div>/.test(html))throw new Error(`${page} selector is outside the shared field layout`);
}

const cookingHub=await readFile('cooking-conversions/index.html','utf8');
for(const token of [brand,footer,'<dialog id="privacy">'])if(!cookingHub.includes(token))throw new Error('Cooking hub does not use the canonical shell');
const css=await readFile('styles.css','utf8');
if(css.includes('.brand:not(:has(img))'))throw new Error('Obsolete generated-logo workaround remains');

for(const [page,action] of [['simplify-ratio','Calculate'],['percentage-of','Calculate'],['simplify-fraction','Calculate'],['date-calculator','Calculate']]){
 const html=await readFile(`${page}/index.html`,'utf8');
 if(!new RegExp(`<button[^>]*>${action}<\\/button>`).test(html))throw new Error(`${page} lost its submit-driven ${action} action`);
}
console.log(`Passed UI Foundation Lock checks for ${livePages.length} live converters and submit-driven regressions.`);
