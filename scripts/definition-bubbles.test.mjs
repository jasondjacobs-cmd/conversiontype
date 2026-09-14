import { readFile } from 'node:fs/promises';

const app = await readFile('app.js','utf8');
const css = await readFile('styles.css','utf8');
const terms = ['ratio','greatest common divisor','GCD','equivalent ratio','proportion','scale factor','numerator','denominator','fraction','percentage','percent','percentage point','percentage change','percentage difference','decimal','reciprocal','common denominator','mixed number','markup','margin','conversion factor','centimeter','inch','kilogram','pound','Celsius','Fahrenheit','kilometer','mile','meter','foot','ounce','gram'];
for (const term of terms) {
  if (!app.includes(`'${term}'`)) throw new Error(`Missing definition term: ${term}`);
}
const required = [
  ["querySelectorAll('.content p,.content li')",'explanatory-content scope'],
  ["setAttribute('aria-expanded','false')",'aria-expanded state'],
  ["setAttribute('role','dialog')",'dialog semantics'],
  ["event.key==='Escape'",'Escape dismissal'],
  ['textContent=def.text','safe definition rendering'],
  ['positionDefinition','viewport positioning'],
  ["addEventListener('pointerdown'",'outside dismissal']
];
for (const [needle,name] of required) if (!app.includes(needle)) throw new Error(`Missing definition behavior: ${name}`);
if (app.includes('window.open(')) throw new Error('Definition bubbles must not use browser popup windows.');
if (!css.includes('.definition-term:focus-visible')) throw new Error('Missing visible keyboard focus style.');
if (!css.includes('calc(100vw - 24px)')) throw new Error('Missing mobile viewport width constraint.');
console.log(`Passed Definition Bubbles v1 regression checks for ${terms.length} shared terms.`);
