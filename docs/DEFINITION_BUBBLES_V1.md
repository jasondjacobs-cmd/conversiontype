# Definition Bubbles v1

Definition Bubbles v1 progressively enhances the crawlable explanation and example content on every currently released ConversionType calculator.

## Coverage

- Ratio calculator cluster
- Percentage calculator cluster
- Fraction calculator cluster

The shared implementation scans only `.content p` and `.content li` explanatory content. The original HTML text remains present and crawlable without JavaScript.

## Initial terminology

The shared dictionary includes ratio, greatest common divisor (GCD), equivalent ratio, proportion, scale factor, numerator, denominator, fraction, percentage, percent, percentage point, percentage change, percentage difference, decimal, reciprocal, common denominator, mixed number, markup, and margin.

## Interaction requirements

- Click/tap opens an in-page definition bubble.
- No `window.open()` or browser popup is used.
- Definition triggers are native buttons and keyboard reachable.
- `aria-expanded` communicates open state.
- The bubble uses dialog semantics and an accessible label.
- Escape closes the active bubble and restores focus.
- A visible close button is provided.
- Clicking/tapping elsewhere dismisses the bubble without stealing focus.
- Resize and scroll reposition an open bubble.
- Mobile width is constrained to the viewport.
- Definition strings are inserted with `textContent`, not HTML.

## SEO and content rules

The definition UI is progressive enhancement. Important calculator explanations, formulas, and examples remain normal HTML. Opening a bubble does not change the URL, create a query parameter, or create an indexable page.

Dedicated definition pages are intentionally out of scope for v1. They should be created only when a concept can support substantial standalone content under the Ranking SEO Strategy.

## Release gates

`scripts/verify.mjs` verifies the shared definition engine, explanatory-content scope, ARIA state, dialog semantics, Escape dismissal, safe text insertion, keyboard focus styling, mobile viewport constraint, close control, and absence of browser-popup behavior.
