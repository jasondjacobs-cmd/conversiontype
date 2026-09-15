import{readFile}from'node:fs/promises';import assert from'node:assert/strict';
const js=await readFile('cooking-conversion.js','utf8');
for(const token of ['cup_fl_oz:8','cup_tbsp:16','tbsp_tsp:3','cup_ml_us:236.5882365','cup_ml_metric:250','flour:120','sugar:200','butter:226.796185','honey:340','oats:90'])assert.ok(js.includes(token),`missing ${token}`);
const pages=['cooking-conversions','cups-to-ounces','ounces-to-cups','cups-to-tablespoons','tablespoons-to-cups','tablespoons-to-teaspoons','cups-to-ml','ml-to-cups','grams-to-cups','cups-to-grams','butter-converter'];
for(const p of pages){const html=await readFile(`${p}/index.html`,'utf8');assert.ok(html.includes(`https://conversiontype.com/${p}/`),`${p} canonical`);assert.ok(html.includes('<h1>'),`${p} h1`);assert.ok(html.includes('application/ld+json'),`${p} structured data`)}
for(const p of pages.slice(1)){const html=await readFile(`${p}/index.html`,'utf8');assert.ok(html.includes('data-cooking-form'),`${p} form`);assert.ok(html.includes('cooking-conversion.js'),`${p} engine`);assert.ok(html.includes('<h2>Examples</h2>'),`${p} examples`);assert.ok(html.includes('related-grid'),`${p} links`)}
const grams=await readFile('grams-to-cups/index.html','utf8');assert.ok(grams.includes('There is no universal grams-to-cups factor'));assert.ok(grams.includes('data-reverse="true"'));
const ml=await readFile('cups-to-ml/index.html','utf8');assert.ok(ml.includes('US customary (236.5882365 mL)'));assert.ok(ml.includes('Metric (250 mL)'));
const tbsp=await readFile('tablespoons-to-teaspoons/index.html','utf8');assert.ok(tbsp.includes('Australian tablespoons use a different volume'));
console.log('Cooking conversion regression checks passed.');