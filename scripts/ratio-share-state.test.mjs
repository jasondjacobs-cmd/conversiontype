import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../ratio.js', import.meta.url), 'utf8');
const modeFields = {
  simplify: { a: '24', b: '36' },
  solve: { a: '2', b: '3', c: '4' },
  scale: { a: '3', b: '2', factor: '4' },
  'ratio-to-fraction': { a: '2', b: '6' },
  'ratio-to-percentage': { a: '3', b: '4' },
  'percentage-to-ratio': { percent: '75' }
};
const expected = {
  simplify: '2:3',
  solve: '>6<',
  scale: '12:8',
  'ratio-to-fraction': '1/3',
  'ratio-to-percentage': '75%',
  'percentage-to-ratio': '3:4'
};

function page({ mode, search = '', values = modeFields[mode] }) {
  const listeners = {};
  const elements = Object.fromEntries(Object.entries({ mode, a: '3', b: '4', c: '6', factor: '2', percent: '75', ...values }).map(([name, value]) => [name, { value }]));
  const form = {
    dataset: { mode },
    elements,
    addEventListener(name, callback) { listeners[name] = callback; },
    querySelector(selector) { return selector === '[name="mode"]' && mode === 'all' ? elements.mode : null; }
  };
  elements.mode.addEventListener = (name, callback) => { listeners.modeChange = callback; };
  const out = { hidden: true, innerHTML: '', innerText: '' };
  const share = { textContent: 'Share result', addEventListener(name, callback) { listeners.share = callback; } };
  const location = { href: `https://conversiontype.com/test/${search}`, search };
  const history = { replaceState(_state, _title, url) { location.href = String(url); location.search = new URL(location.href).search; } };
  let copied = '';
  const context = {
    document: {
      title: 'Calculator',
      querySelector(selector) { return selector === '[data-ratio-form]' ? form : selector === '[data-result]' ? out : selector === '[data-share]' ? share : null; },
      querySelectorAll() { return []; }
    },
    location,
    history,
    navigator: { clipboard: { async writeText(text) { copied = text; } } },
    URL,
    URLSearchParams,
    Number,
    Math,
    Object
  };
  vm.runInNewContext(source, context);
  return { form, out, listeners, location, copied: () => copied };
}

for (const [mode, values] of Object.entries(modeFields)) {
  const first = page({ mode, values });
  assert.equal(first.listeners.submit({ preventDefault() {} }), true, `${mode} calculates`);
  assert.match(first.out.innerHTML, new RegExp(expected[mode]), `${mode} result`);
  const stateUrl = new URL(first.location.href);
  assert.equal(stateUrl.searchParams.has('mode'), false, `${mode} dedicated URL omits mode`);
  for (const [name, value] of Object.entries(values)) assert.equal(stateUrl.searchParams.get(name), value, `${mode} stores ${name}`);

  const restored = page({ mode, search: stateUrl.search });
  for (const [name, value] of Object.entries(values)) assert.equal(restored.form.elements[name].value, value, `${mode} restores ${name}`);
  assert.match(restored.out.innerHTML, new RegExp(expected[mode]), `${mode} restores result`);
}

const main = page({ mode: 'all', values: { mode: 'scale', a: '3', b: '2', factor: '4' } });
assert.equal(main.listeners.submit({ preventDefault() {} }), true);
assert.equal(new URL(main.location.href).searchParams.get('mode'), 'scale');
await main.listeners.share();
assert.equal(main.copied(), main.location.href, 'share copies the stateful URL');
const mainRestored = page({ mode: 'all', search: new URL(main.location.href).search });
assert.equal(mainRestored.form.elements.mode.value, 'scale');
assert.match(mainRestored.out.innerHTML, /12:8/);

for (const search of ['?mode=unknown&a=1&b=2', '?mode=simplify&a=nope&b=2', '?mode=simplify&a=2', '?mode=ratio-to-percentage&a=2&b=0']) {
  const invalid = page({ mode: 'all', search });
  assert.match(invalid.out.innerHTML, /Check shared link/);
}

console.log('Passed ratio shareable-state calculation, restoration, sharing, and malformed URL checks.');
