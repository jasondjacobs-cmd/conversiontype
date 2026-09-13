const form = document.querySelector('[data-ratio-form]');
const out = document.querySelector('[data-result]');
const shareButton = document.querySelector('[data-share]');
const modes = ['simplify', 'solve', 'scale', 'ratio-to-fraction', 'ratio-to-percentage', 'percentage-to-ratio'];
const fieldsByMode = {
  simplify: ['a', 'b'],
  solve: ['a', 'b', 'c'],
  scale: ['a', 'b', 'factor'],
  'ratio-to-fraction': ['a', 'b'],
  'ratio-to-percentage': ['a', 'b'],
  'percentage-to-ratio': ['percent']
};

const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const fmt = n => Number.isInteger(n) ? String(n) : Number(n.toFixed(6)).toString();
const currentMode = () => form.dataset.mode === 'all' ? form.elements.mode.value : form.dataset.mode;

function render(title, value, steps) {
  out.hidden = false;
  out.innerHTML = `<p class="eyebrow">Result</p><h2>${title}</h2><div class="answer">${value}</div><p>${steps}</p>`;
}

function readNumber(name) {
  const raw = form.elements[name]?.value;
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function readValues(mode) {
  const values = {};
  for (const name of fieldsByMode[mode] || []) {
    const value = readNumber(name);
    if (value === null) return null;
    values[name] = value;
  }
  if (mode !== 'percentage-to-ratio' && values.b === 0) return null;
  if (mode === 'solve' && values.a === 0) return null;
  return values;
}

function showFields(mode) {
  document.querySelectorAll('[data-for]').forEach(element => {
    element.hidden = !element.dataset.for.split(' ').includes(mode);
  });
}

function stateUrl(mode) {
  const url = new URL(location.href);
  url.search = '';
  if (form.dataset.mode === 'all') url.searchParams.set('mode', mode);
  for (const name of fieldsByMode[mode]) url.searchParams.set(name, form.elements[name].value.trim());
  return url;
}

function calculate(event, updateHistory = true) {
  event?.preventDefault();
  const mode = currentMode();
  if (!modes.includes(mode)) {
    render('Check your values', '—', 'Choose a supported calculation.');
    return false;
  }
  const values = readValues(mode);
  if (!values) {
    const message = mode === 'solve'
      ? 'Enter valid known values. The first and second values cannot be zero.'
      : mode === 'percentage-to-ratio'
        ? 'Enter a valid percentage.'
        : 'Enter valid numbers. The second ratio value cannot be zero.';
    render('Check your values', '—', message);
    return false;
  }

  const { a, b, c, factor, percent } = values;
  if (mode === 'simplify') {
    const d = gcd(a, b);
    render('Simplified ratio', `${fmt(a / d)}:${fmt(b / d)}`, `The greatest common divisor is ${fmt(d)}. Divide both values by ${fmt(d)}.`);
  } else if (mode === 'solve') {
    const d = b * c / a;
    render('Missing value', fmt(d), `${fmt(a)}:${fmt(b)} = ${fmt(c)}:${fmt(d)}.`);
  } else if (mode === 'scale') {
    render('Scaled ratio', `${fmt(a * factor)}:${fmt(b * factor)}`, `Multiply both sides by ${fmt(factor)}.`);
  } else if (mode === 'ratio-to-fraction') {
    const d = gcd(a, b);
    render('Fraction', `${fmt(a / d)}/${fmt(b / d)}`, `${fmt(a)}:${fmt(b)} becomes ${fmt(a)}/${fmt(b)}, then reduces by ${fmt(d)}.`);
  } else if (mode === 'ratio-to-percentage') {
    const percentage = a / b * 100;
    render('Percentage', `${fmt(percentage)}%`, `${fmt(a)} ÷ ${fmt(b)} × 100 = ${fmt(percentage)}%.`);
  } else {
    const scaled = Math.round(percent * 100);
    const d = gcd(scaled, 10000);
    render('Ratio', `${scaled / d}:${10000 / d}`, `${fmt(percent)}% = ${fmt(percent)}:100, reduced to lowest terms.`);
  }

  if (updateHistory) history.replaceState(null, '', stateUrl(mode));
  if (shareButton) shareButton.textContent = 'Share result';
  return true;
}

function restoreState() {
  if (!form || !location.search) return;
  const params = new URLSearchParams(location.search);
  const mode = form.dataset.mode === 'all' ? params.get('mode') : form.dataset.mode;
  const hasState = form.dataset.mode === 'all'
    ? params.has('mode') || modes.some(item => fieldsByMode[item].some(name => params.has(name)))
    : fieldsByMode[mode].some(name => params.has(name));
  if (!hasState) return;
  if (!modes.includes(mode) || fieldsByMode[mode].some(name => !params.has(name))) {
    render('Check shared link', '—', 'This shared calculator link is incomplete or unsupported. You can still enter values below.');
    return;
  }

  const restored = {};
  for (const name of fieldsByMode[mode]) {
    const raw = params.get(name);
    if (raw === null || raw.trim() === '' || !Number.isFinite(Number(raw))) {
      render('Check shared link', '—', 'This shared calculator link contains invalid values. You can still enter values below.');
      return;
    }
    restored[name] = raw;
  }
  const numeric = Object.fromEntries(Object.entries(restored).map(([name, value]) => [name, Number(value)]));
  if ((mode !== 'percentage-to-ratio' && numeric.b === 0) || (mode === 'solve' && numeric.a === 0)) {
    render('Check shared link', '—', 'This shared calculator link contains invalid values. You can still enter values below.');
    return;
  }

  if (form.dataset.mode === 'all') form.elements.mode.value = mode;
  for (const [name, value] of Object.entries(restored)) form.elements[name].value = value;
  showFields(mode);
  calculate(null, false);
}

form?.addEventListener('submit', calculate);
form?.querySelector('[name="mode"]')?.addEventListener('change', event => showFields(event.target.value));
shareButton?.addEventListener('click', async () => {
  if (out?.hidden) return;
  const url = location.href;
  try {
    if (navigator.share) await navigator.share({ title: document.title, text: out.innerText.trim(), url });
    else {
      await navigator.clipboard.writeText(url);
      shareButton.textContent = 'Link copied';
    }
  } catch {}
});

restoreState();
