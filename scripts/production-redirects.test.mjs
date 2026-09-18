import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const redirects = await readFile('_redirects', 'utf8');
const lines = redirects.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

assert(lines.includes('/home / 301'), 'Existing /home redirect must be preserved');
assert(
  !lines.some(line => line.includes('conversiontype.pages.dev')),
  'Domain-level pages.dev redirects are unsupported in Pages _redirects; use Cloudflare Bulk Redirects'
);

console.log('Production redirect source contract passed.');
