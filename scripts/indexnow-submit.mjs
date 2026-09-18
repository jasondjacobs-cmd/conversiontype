import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const HOST = 'conversiontype.com';
const ORIGIN = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY || '9f4a6c2e7b1d4380a5e9c6712f84bd30';
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';

export function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(https:\/\/conversiontype\.com\/[^<]*)<\/loc>/g)].map(match => match[1]);
}

export function changedUrls(files, urls) {
  const set = new Set();
  const all = () => urls.forEach(url => set.add(url));
  for (const file of files) {
    if (/^(styles\.css|app\.js|_headers|robots\.txt|sitemap\.xml)$/.test(file)) { all(); continue; }
    const top = file.split('/')[0];
    if (top === 'index.html') set.add(ORIGIN + '/');
    if (file.endsWith('/index.html')) {
      const url = ORIGIN + '/' + file.slice(0, -'/index.html'.length) + '/';
      if (urls.includes(url)) set.add(url);
    }
    if (/^(ratio|percentage|fraction|unit-conversion|date-time|cooking-conversion|financial-calculators|construction-calculators|grade-gpa-calculators|mortgage-calculators|mortgage-ui)\.js$/.test(top)) all();
  }
  return [...set];
}

async function main() {
  const xml = await readFile('sitemap.xml', 'utf8');
  const urls = sitemapUrls(xml);
  const before = process.env.INDEXNOW_BEFORE_SHA;
  const after = process.env.INDEXNOW_AFTER_SHA || 'HEAD';
  if (!before) throw new Error('INDEXNOW_BEFORE_SHA is required');
  const output = execFileSync('git', ['diff', '--name-only', before, after], { encoding: 'utf8' });
  const files = output.split(/\r?\n/).filter(Boolean);
  const urlList = changedUrls(files, urls);
  if (!urlList.length) {
    console.log('IndexNow: no changed canonical URLs to submit.');
    return;
  }
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList })
  });
  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow submission failed: HTTP ${response.status} ${await response.text()}`);
  }
  console.log(`IndexNow: submitted ${urlList.length} changed canonical URL(s), HTTP ${response.status}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
