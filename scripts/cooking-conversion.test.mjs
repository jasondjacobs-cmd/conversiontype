import{readFile}from'node:fs/promises';
const engine=await readFile('cooking-conversion.js','utf8');
const sitemap=await readFile('sitemap.xml','utf8');
const pages=['cooking-conversions','cups-to-ounces','ounces-to-cups','cups-to-tablespoons','tablespoons-to-cups','tablespoons-to-teaspoons','cups-to-ml','ml-to-cups','grams-to-cups','cups-to-grams','butter-converter'];
for(const page of pages){const html=await readFile(`${page}/index.html`,'utf8');for(const token of[`https://conversiontype.com/${page}/`,'<title>','<meta name="description"','<h1>','application/ld+json'])if(!html.includes(token))throw new Error(`${page} missing ${token}`);if(!sitemap.includes(`https://conversiontype.com/${page}/`))throw new Error(`sitemap missing ${page}`)}
for(const token of['cup_fl_oz:8','cup_tbsp:16','tbsp_tsp:3','cup_ml_us:236.5882365','cup_ml_metric:250','flour:120','sugar:198','brown_sugar:213','powdered_sugar:113','butter:226.796185','water:236.5882365','milk:244','honey:336','oats:89','history.replaceState','invalid values','allowedUnits'])if(!engine.includes(token))throw new Error(`engine missing ${token}`);
const grams=await readFile('grams-to-cups/index.html','utf8'),cups=await readFile('cups-to-grams/index.html','utf8'),tbsp=await readFile('tablespoons-to-teaspoons/index.html','utf8'),ml=await readFile('cups-to-ml/index.html','utf8');
for(const ingredient of['All-purpose flour','Granulated sugar','Brown sugar','Powdered sugar','Butter','Water','Milk','Honey','Rolled oats'])if(!grams.includes(ingredient)||!cups.includes(ingredient))throw new Error(`ingredient missing ${ingredient}`);
if(!grams.includes('Cups measure volume while grams measure mass'))throw new Error('grams/cups density warning missing');
if(!tbsp.includes('Australian tablespoon'))throw new Error('Australian tablespoon disclosure missing');
if(!ml.includes('US customary cup')||!ml.includes('Metric cup'))throw new Error('cup standards missing');
if(/<loc>[^<]*\?/.test(sitemap))throw new Error('query-state URL leaked into sitemap');
console.log('Cooking Conversions v1 SEO, accuracy, state, and architecture checks passed.');