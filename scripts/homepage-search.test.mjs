import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';
import{createSearchIndex,serializeSearchIndex}from'./generate-search-index.mjs';
import{normalizeSearchText,searchTools,searchTokens}from'../search-core.js';

const index=await createSearchIndex();
const sitemap=await readFile('sitemap.xml','utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>https:\/\/conversiontype\.com(\/[^<]*)<\/loc>/g)].map(match=>match[1]).filter(url=>url!=='/');
assert.equal(index.length,sitemapUrls.length,'every public sitemap tool must be searchable');
assert.equal(new Set(index.map(entry=>entry.url)).size,index.length,'search URLs must be unique');
for(const url of sitemapUrls)assert.ok(index.some(entry=>entry.url===url),`search index missing ${url}`);
for(const entry of index){assert.ok(entry.title&&entry.description);assert.match(entry.url,/^\/[a-z0-9-]+\/$/);assert.ok(['calculator','collection'].includes(entry.kind))}
for(const url of ['/unit-converters/','/date-time-calculators/','/cooking-conversions/','/financial-calculators/','/construction-calculators/','/grade-calculators/','/mortgage-calculators/'])assert.equal(index.find(entry=>entry.url===url)?.kind,'collection',`${url} must be labeled as a collection`);

const first=(query)=>searchTools(index,query)[0]?.url;
assert.equal(first('loan calculator'),'/loan-calculator/');
assert.equal(first('mortgage calculator'),'/mortgage-calculator/');
assert.equal(first('GPA calculator'),'/gpa-calculator/');
assert.equal(first('concrete calculator'),'/concrete-calculator/');
assert.equal(first('  grams to cups  '),'/grams-to-cups/');
assert.ok(searchTools(index,'how many cups in grams').some(entry=>entry.url==='/grams-to-cups/'));
assert.ok(searchTools(index,'%').some(entry=>entry.url==='/percentage-calculator/'));
assert.ok(searchTools(index,'ratio').some(entry=>entry.url==='/ratio-calculator/'));
assert.ok(!searchTools(index,'ratio').some(entry=>entry.url==='/date-time-calculators/'),'ratio must not match duration');
assert.deepEqual(searchTools(index,'zzzz-no-match'),[]);
assert.equal(normalizeSearchText('  Mortgage & Home  '),'mortgage and home');
assert.deepEqual(searchTokens('How many cups in grams'),['cup','gram']);
assert.match(serializeSearchIndex(index),/^export const searchIndex=Object\.freeze\(/);

const homepage=await readFile('index.html','utf8');
for(const token of ['<span class="visually-hidden">Search all calculators</span>','aria-controls="search-results"','id="search-result-grid"','id="browse"','src="/homepage-search.js?v=homepage-search-empty-state-v1"','href="/styles.css?v=homepage-search-empty-state-v1"'])assert.ok(homepage.includes(token),`homepage missing ${token}`);
const styles=await readFile('styles.css','utf8');
assert.ok(styles.includes('.visually-hidden'));
assert.ok(styles.includes('.search:focus-within'));
assert.ok(styles.includes(':where([hidden]){display:none!important}'),'hidden search states must remain visually hidden');
assert.ok(styles.includes('#empty{display:none}#empty.is-visible{display:block}'),'empty state must require an explicit visible class');
console.log(`Homepage search contract passed for ${index.length} public tools.`);
