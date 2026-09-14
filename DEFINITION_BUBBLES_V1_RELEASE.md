# Definition Bubbles v1 release summary

Definition Bubbles v1 adds reusable in-page definitions to explanatory content across all currently released Ratio, Percentage, and Fraction calculators.

The feature is progressive enhancement: calculator explanations and examples remain crawlable HTML. Definition triggers are added only inside explanatory paragraphs and list items. Bubbles do not create URLs, query parameters, new windows, or tabs.

Accessibility includes native button triggers, visible focus, `aria-expanded`, dialog semantics, accessible close controls, Escape dismissal with focus restoration, and pointer dismissal. Mobile positioning constrains bubbles to the viewport and repositions on resize/scroll.

Release-gate coverage is included in `scripts/verify.mjs` and `scripts/definition-bubbles.test.mjs`. Production/mobile QA instructions are in `qa/definition-bubbles-v1.md`; an executable Playwright QA spec is provided at `qa/definition-bubbles-v1.spec.mjs` for QA environments with Playwright available.
