import{readFile}from'node:fs/promises';
const engine=await readFile('cooking-conversion.js','utf8');
const sitemap=await readFile('sitemap.xml','utf8');
const home=await readFile('index.html','utf8');
const pages=['cooking-conversions','cups-to-ounces','ounces-to-cups','cups-to-tablespoons','tablespoons-to-cups','tablespoons-to-teaspoons','cups-to-ml','ml-to-cups','grams-to-cups','cups-to-grams','butter-converter'];
for(const page of pages){const html=await readFile(`${page}/index.html`,'utf8');for(const token of[`https://conversiontype.com/${page}/`,'<title>','<meta name="description"','<h1>','application/ld+json'])if(!html.includes(token))throw new Error(`${page} missing ${token}`);if(!sitemap.includes(`https://conversiontype.com/${page}/`))throw new Error(`sitemap missing ${page}`)}
for(const token of['cup_fl_oz:8','cup_tbsp:16','tbsp_tsp:3','cup_ml_us:236.5882365','cup_ml_metric:250','flour:120','sugar:198','brown_sugar:213','powdered_sugar:113','butter:226.796185','water:236.5882365','milk:244','honey:336','oats:89','history.replaceState','invalid values','allowedUnits'])if(!engine.includes(token))throw new Error(`engine missing ${token}`);
if(!engine.startsWith("(function(){\n'use strict';"))throw new Error('Cooking engine must isolate declarations from the shared app script');
const grams=await readFile('grams-to-cups/index.html','utf8'),cups=await readFile('cups-to-grams/index.html','utf8'),tbsp=await readFile('tablespoons-to-teaspoons/index.html','utf8'),ml=await readFile('cups-to-ml/index.html','utf8');
for(const ingredient of['All-purpose flour','Granulated sugar','Brown sugar','Powdered sugar','Butter','Water','Milk','Honey','Rolled oats'])if(!grams.includes(ingredient)||!cups.includes(ingredient))throw new Error(`ingredient missing ${ingredient}`);
if(!grams.includes('There is no universal grams-to-cups factor')||!grams.includes('Ingredients have different densities'))throw new Error('grams/cups density warning missing');
if(!tbsp.includes('Australian tablespoon'))throw new Error('Australian tablespoon disclosure missing');
if(!ml.includes('US customary cup')||!ml.includes('metric cup'))throw new Error('cup standards missing');
const bubbleCoverage=[['cups-to-ounces/index.html',['US customary cup','fluid ounces']],['tablespoons-to-teaspoons/index.html',['tablespoon','teaspoon']],['cups-to-ml/index.html',['US customary cup','metric cup','milliliters']],['grams-to-cups/index.html',['densities','cup']],['cups-to-grams/index.html',['gram','densities']],['butter-converter/index.html',['stick of butter','weight ounces']]];
for(const[file,terms]of bubbleCoverage){const html=await readFile(file,'utf8');for(const term of terms)if(!html.toLowerCase().includes(term.toLowerCase()))throw new Error(`${file} missing crawlable definition term ${term}`)}
if(/<loc>[^<]*\?/.test(sitemap))throw new Error('query-state URL leaked into sitemap');
for(const token of['href="/cooking-conversions/"','Cooking conversion tools','href="/cups-to-ounces/"','href="/cups-to-ml/"','href="/grams-to-cups/"','href="/butter-converter/"'])if(!home.includes(token))throw new Error(`homepage cooking discovery missing ${token}`);
console.log('Cooking Conversions v1 SEO, accuracy, state, and architecture checks passed.');
