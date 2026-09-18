import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sitemapUrls, changedUrls } from './indexnow-submit.mjs';

const xml = await readFile('sitemap.xml', 'utf8');
const urls = sitemapUrls(xml);
assert.equal(urls.length, 100, 'Expected the current 100 canonical sitemap URLs');
assert(urls.every(url => url.startsWith('https://conversiontype.com/')));
assert.deepEqual(changedUrls(['mortgage-calculator/index.html'], urls), ['https://conversiontype.com/mortgage-calculator/']);
assert.equal(changedUrls(['styles.css'], urls).length, urls.length, 'Shared CSS can affect every canonical page');
assert.deepEqual(changedUrls(['README.md'], urls), [], 'Non-public docs must not trigger submissions');
const key = '9f4a6c2e7b1d4380a5e9c6712f84bd30';
assert.match(key, /^[A-Fa-f0-9-]{8,128}$/);
const hosted = await readFile(`${key}.txt`, 'utf8');
assert.equal(hosted.trim(), key, 'Hosted key file must contain the IndexNow key');
console.log('IndexNow contract passed.');
