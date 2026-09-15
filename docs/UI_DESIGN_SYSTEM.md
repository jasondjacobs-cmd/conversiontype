# ConversionType UI Design System

This document is the authoritative UI contract for ConversionType public tools. New calculator clusters and changes to existing tools must reuse this system unless a deliberate design-system change is approved and tested across the site.

## Core rule

Do not invent a new page shell, brand treatment, calculator layout, button pattern, typography system, spacing system, or mobile behavior for an individual calculator cluster.

Before building a new public tool, inspect a current released tool that uses the same interaction pattern and reuse its established markup, classes, shared CSS, and behavior.

## Canonical site shell

Public calculator pages use the shared ConversionType shell:

- Header with the ConversionType brand at the left and site navigation/privacy controls at the right.
- Brand treatment must match released tools. Do not substitute a wide logo, alternate artwork, text-only approximation, or cluster-specific logo treatment.
- Brand links to `/` and has an accessible name.
- Header uses the shared `header`, `.brand`, and `nav` rules in `styles.css`.
- Footer uses the shared footer treatment and Privacy Choices control.
- Privacy dialog uses the shared production behavior.

At mobile widths, use the existing shared header wrapping behavior. Do not add a cluster-specific breakpoint to make one tool fit.

## Calculator page structure

Use the released tool-page structure where applicable:

1. Shared header.
2. `.tool-hero` with breadcrumbs, H1, and concise introduction.
3. `.tool-layout` containing the primary `.calculator` and `.side-links` when related tools are useful.
4. Crawlable `.content` with method/formula, examples, tables, definitions, and related links as required by the SEO strategy.
5. Shared footer and privacy dialog.

Use existing shared classes before adding new CSS.

## Calculator controls

Inputs and selects use the shared calculator field treatment and remain readable and tappable at all supported viewports.

### Live bidirectional converters

A converter is live when changing either conversion value immediately updates the other value without requiring submission.

For live converters:

- Do not display a redundant Convert/Calculate button.
- Editing either value updates the opposite value immediately.
- Reverse-direction editing remains supported.
- Option changes such as ingredient, measurement standard, or units recalculate the current value when possible.
- Enter must not reload or navigate away from the page.
- Share Result may remain as a secondary action when state URLs are supported.
- Invalid or empty values use the existing inline status/error behavior.
- Shared URL restoration must produce the same state as direct interaction.

Unit Conversion and Cooking Conversion bidirectional tools are live converters.

### Submit-driven calculators

Keep Calculate, Solve, Simplify, or equivalent primary actions when the user must provide a complete set of inputs before a meaningful result can be produced, or when explicit submission is part of the established interaction model. Ratio, Percentage, Fraction, and applicable Date & Time calculators may use this pattern.

Do not remove a primary action solely for visual consistency if the calculator is not truly live.

## Results and actions

- Use the existing `.result`, `.answer`, `.actions`, and status patterns where applicable.
- Primary buttons use the shared `.primary` treatment.
- Secondary actions use the shared action treatment.
- Do not create cluster-specific button colors or shapes.
- Long results must wrap or contain without document-level horizontal overflow.

## Supporting content

Use the established patterns for:

- `.table-wrap` for horizontally constrained tables.
- `.example-list` for examples.
- `.related-grid` and `.side-links` for related tools.
- Definition Bubbles for concise contextual definitions as specified in `AGENTS.md` and `docs/RANKING_SEO_STRATEGY.md`.

Important explanatory content must remain crawlable HTML.

## Accessibility contract

- Preserve semantic labels for every form control.
- Interactive controls must be keyboard usable.
- Status/result changes that need announcement use the established live-region pattern.
- Focus styles must remain visible.
- Touch controls should meet the established minimum sizing used by released tools.
- Definition Bubbles must retain their established keyboard, dismissal, focus-restoration, and viewport behavior.
- Privacy controls must remain usable at every supported viewport.

## Responsive contract

Every public calculator change must be checked at:

- Desktop: 1363 × 936
- Mobile: 320 × 844
- Mobile: 360 × 800
- Mobile: 390 × 844
- Mobile: 430 × 932

Required at each applicable viewport:

- No document-level horizontal overflow.
- Brand and navigation fit using the shared shell.
- Inputs and controls remain reachable and readable.
- Results do not clip.
- Tables scroll inside their own container when necessary.
- Privacy dialog fits and works.
- No missing assets, console errors, or failed first-party requests.

## Drift prevention

Release gates and browser QA should fail when a new or modified public calculator violates this contract.

At minimum, automated coverage should protect:

- Canonical shared brand/header structure.
- Shared footer/privacy controls.
- Standard tool hero/layout classes for calculator pages.
- No redundant submit button on live bidirectional converters.
- Live forward and reverse conversion behavior.
- Share-state creation/restoration where supported.
- Standard viewport containment.
- Console and request health.

Do not weaken these checks to accommodate a one-off page. Change the design system deliberately if the site-wide contract itself needs to change.

## Reference implementation rule

When starting a new cluster, select a currently released page with the closest interaction model as the reference implementation. Record that reference during implementation. The new cluster should begin by copying/reusing the established structural pattern, then change only the content and behavior required by the new calculator.

The visual design is a site-level system, not a per-feature design decision.
