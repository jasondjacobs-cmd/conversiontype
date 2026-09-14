# Definition Bubbles v1 production QA

Run after the feature is deployed to Cloudflare Pages.

## Coverage

Test representative pages from each released calculator cluster, then smoke-check all released calculator routes for trigger rendering and layout regressions.

Required representative routes:

- `/ratio-calculator/`
- `/simplify-ratio/`
- `/percentage-calculator/`
- `/percentage-change/`
- `/fraction-calculator/`
- `/simplify-fraction/`

## Desktop/accessibility

- Definition terms are visibly distinct but do not make explanatory copy noisy.
- Click opens the correct definition.
- Trigger receives keyboard focus.
- Enter/Space opens the definition.
- `aria-expanded` reflects open/closed state.
- Escape closes the bubble and returns focus to the trigger.
- Close button is keyboard reachable and has an accessible name.
- Clicking outside closes the bubble.
- Only one bubble is open at a time.
- Opening/closing a definition does not alter the URL.
- No new tab/window is created.
- Calculator behavior, shared-result URLs, privacy dialog, and related links still work.
- No console errors or missing assets.

## Mobile

Test at 320 × 844, 360 × 800, 390 × 844, and 430 × 932 when the QA browser supports exact viewport sizing.

- No horizontal page overflow.
- Trigger remains tappable in flowing paragraph/list text.
- Bubble remains inside the viewport.
- Bubble can flip above a trigger near the bottom of the viewport.
- Bubble content remains readable without zooming.
- Close button remains reachable.
- Scrolling/reorientation does not strand the bubble off-screen.
- Calculator inputs/results remain readable and tappable.
- Privacy dialog still fits.

## SEO/crawlability

- Original explanation, formula, and example text is present in page HTML.
- Definition interaction does not create a new URL or query parameter.
- Canonical remains the clean calculator URL.
- Sitemap remains limited to intended canonical pages.

Report each test as PASS, FAIL, PASS WITH ISSUE, or NOT TESTED. Do not mark Definition Bubbles v1 fully released while required mobile/accessibility checks remain untested.
