import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const redirects = await readFile('_redirects', 'utf8');
const lines = redirects.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

assert(lines.includes('/home / 301'), 'Existing /home redirect must be preserved');
assert(
  lines.includes('https://conversiontype.pages.dev/* https://conversiontype.com/:splat 301'),
  'pages.dev must permanently redirect to the apex custom domain while preserving the path'
);

console.log('Production redirect source contract passed.');
