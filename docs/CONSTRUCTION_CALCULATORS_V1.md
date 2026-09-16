# Construction Calculators v1 Architecture

**Status:** Locked before implementation  
**Branch:** `feature/construction-calculators-v1`  
**UI contract:** `docs/UI_DESIGN_SYSTEM.md`  
**SEO contract:** `docs/RANKING_SEO_STRATEGY.md`

## Goal

Build the first Construction & Materials calculator cluster as a focused set of useful, evergreen tools. Reuse ConversionType's released submit-driven calculator shell and avoid near-duplicate pages for project or keyword variants that use the same underlying calculation.

## Permanent indexable URLs

Build exactly these ten clean canonical pages in v1:

1. `/construction-calculators/`
2. `/concrete-calculator/`
3. `/concrete-slab-calculator/`
4. `/square-footage-calculator/`
5. `/cubic-yard-calculator/`
6. `/gravel-calculator/`
7. `/mulch-calculator/`
8. `/paint-calculator/`
9. `/board-foot-calculator/`
10. `/stair-calculator/`

Do not create v1 pages for `/concrete-floor-calculator/`, `/concrete-driveway-calculator/`, `/driveway-concrete-calculator/`, `/concrete-patio-calculator/`, `/concrete-pad-calculator/`, `/driveway-gravel-calculator/`, `/pea-gravel-calculator/`, `/gravel-tonnage-calculator/`, `/mulch-bag-calculator/`, `/square-feet-calculator/`, `/board-feet-calculator/`, or `/stair-stringer-calculator/`. Those intents belong on the relevant parent calculator unless later SERP evidence supports a materially distinct page.

## Shared interaction contract

Construction calculators are submit-driven. Retain a clear `Calculate` action and prevent Enter from causing accidental navigation or reload. Use the canonical `.tool-hero`, `.tool-layout`, `.calculator`, `.result`, `.answer`, `.actions`, `.primary`, `.table-wrap`, `.content`, `.side-links`, `.related-grid`, shared header/footer/privacy dialog, and existing Definition Bubble system.

Use full internal precision. Round displayed currency to cents and displayed measurements to a useful precision without feeding display rounding back into later calculations.

Supported dimension units should reuse a shared measurement layer where practical: inches, feet, yards, millimeters, centimeters, and meters. Area/volume outputs may include square feet, square yards, square meters, acres, cubic feet, cubic yards, and cubic meters when relevant.

## Shared state contract

Each calculator should support `Share Result` when the calculation has meaningful restorable inputs.

Rules:

- Query parameters restore every meaningful input needed to reproduce the result.
- Clean canonical always points to the clean calculator URL.
- Query-state URLs are utility URLs, not sitemap entries or separate search landing pages.
- Unknown parameters are ignored safely.
- Malformed, non-finite, impossible, or out-of-range values are rejected safely.
- Restored state must calculate identically to direct input.
- A clean URL must remain fully functional.
- Do not place personal information in shared state.
- Parameter names must be stable, short, descriptive, and documented below.

## Validation conventions

Unless a calculator states a stricter rule:

- Required dimensions and quantities must be finite and greater than zero.
- Counts must be positive integers.
- Waste percentages must be finite and between 0 and 100 inclusive.
- Optional prices must be finite and zero or greater.
- Material density/yield values must be positive.
- Reject calculations that overflow practical JavaScript numeric limits or produce non-finite results.
- Do not silently convert invalid negative dimensions into positive values.
- Unit selectors must accept only enumerated supported units.

## 1. Construction Calculators hub

**URL:** `/construction-calculators/`

**Intent:** construction calculators, material calculators, building calculators.

No primary numeric calculation is required. The hub must describe the cluster and link crawlably to all nine tools. It belongs in the sitemap and site discovery.

## 2. Concrete Calculator

**URL:** `/concrete-calculator/`

**Intent:** concrete calculator, concrete yard calculator, concrete volume calculator, concrete bags, how much concrete.

Support project/shape modes without creating separate indexable mode URLs:

- rectangular slab/wall/footing
- circular column/footing
- circular slab

Rectangular volume:

`V = length × width × depth`

Circular volume:

`V = π × radius² × height`

Convert computed volume to cubic feet, cubic yards, and cubic meters as useful.

**Inputs:** shape, dimensions with units, quantity, waste percent, optional price per cubic yard. Bag calculations should support explicit 40 lb, 60 lb, and 80 lb bag yields using documented constants rather than deriving bag yield from bag weight alone.

**Outputs:** base volume, waste-adjusted order volume, cubic feet, cubic yards, cubic meters, 40/60/80 lb bag estimates, approximate weight when a documented density assumption is selected/used, and optional material cost.

**State parameters:** `shape`, `length`, `width`, `depth`, `diameter`, `height`, `unit`, `qty`, `waste`, `price` as applicable to the selected mode.

Do not imply that a bag yield, density, waste allowance, thickness, or project design is universally correct. Explain assumptions.

## 3. Concrete Slab Calculator

**URL:** `/concrete-slab-calculator/`

**Intent:** concrete slab calculator, concrete slab estimator, concrete floor calculator, concrete patio/driveway/pad quantity.

Formula:

`V = length × width × thickness × quantity`

Convert to cubic yards with `yd³ = ft³ / 27` after unit normalization.

**Inputs:** length, width, thickness, dimension units, slab quantity, waste percent, optional price per cubic yard.

**Outputs:** base cubic feet/yards, waste allowance, order quantity, 40/60/80 lb bag estimates, approximate weight under a documented assumption, optional material cost.

**State parameters:** `length`, `width`, `thickness`, `lengthUnit`, `thicknessUnit`, `qty`, `waste`, `price`.

Worked examples may include patio, driveway, garage floor, and shed pad. Do not present example thicknesses as universal code requirements.

## 4. Square Footage Calculator

**URL:** `/square-footage-calculator/`

**Intent:** square footage calculator, square feet calculator, area calculator for common projects.

Support at least rectangle, circle, triangle, and trapezoid, with multiple areas that can be totaled.

Formulas after unit normalization:

- Rectangle: `A = length × width`
- Circle: `A = πr²`
- Triangle: `A = base × height / 2`
- Trapezoid: `A = (a + b) × height / 2`

**Inputs:** shape-specific dimensions, units, quantity/rows where applicable, optional price per square foot.

**Outputs:** total square feet, square yards, square meters, acres when useful, and optional cost.

**State parameters:** stable row-oriented parameters or a compact validated row encoding plus `price`. The implementation must cap the number of restorable rows to prevent unbounded URLs.

## 5. Cubic Yard Calculator

**URL:** `/cubic-yard-calculator/`

**Intent:** cubic yard calculator, yardage calculator, cubic yards from dimensions.

This calculator is material-neutral. It calculates volume, not concrete-specific quantity.

Rectangular formula:

`V = length × width × depth`

Support common geometry only when it adds useful distinct value and is covered by tests.

**Inputs:** shape/dimensions, units, quantity, optional price per cubic yard.

**Outputs:** cubic yards, cubic feet, cubic meters, optional cost.

**State parameters:** `shape`, dimension parameters, `unit`, `qty`, `price`.

## 6. Gravel Calculator

**URL:** `/gravel-calculator/`

**Intent:** gravel calculator, gravel yards, gravel tons, driveway gravel calculator, gravel cost.

Volume:

`V = area × depth`

Mass:

`mass = volume × density`

**Inputs:** length/width or total area, depth, units, gravel type or explicit density, quantity/waste when useful, optional price by supported pricing unit.

**Outputs:** cubic feet, cubic yards, tons, pounds, optional bag estimate when an explicit bag size/yield is supplied, and optional cost.

**State parameters:** `mode`, `length`, `width`, `area`, `depth`, unit parameters, `material`, `density`, `waste`, `price`, `priceUnit` as applicable.

Never imply one density applies to all gravel. Presets must expose/document their assumptions and allow a custom density where practical.

## 7. Mulch Calculator

**URL:** `/mulch-calculator/`

**Intent:** mulch calculator, mulch yards, mulch bags, how much mulch.

Formula after normalization:

`ft³ = area(ft²) × depth(in) / 12`

`yd³ = ft³ / 27`

**Inputs:** area or length × width, depth, units, optional multiple beds/quantity, bag size/yield, optional price.

**Outputs:** cubic feet, cubic yards, bag count rounded up for purchase quantity, optional estimated cost.

**State parameters:** `mode`, `length`, `width`, `area`, `depth`, unit parameters, `qty`, `bagSize`, `price`, `priceUnit`.

## 8. Paint Calculator

**URL:** `/paint-calculator/`

**Intent:** paint calculator, how much paint, wall paint calculator, room paint calculator.

Core method:

`paintable area = gross wall/entered area - excluded openings`

`coverage required = paintable area × coats`

`gallons = coverage required / coverage per gallon`

**Inputs:** wall/room dimensions or total paintable area, doors/windows or excluded area, coats, adjustable coverage per gallon, optional price per gallon.

**Outputs:** gross area, excluded area, paintable area, coverage required, exact gallons, practical rounded purchase quantity, optional liters and estimated cost.

**State parameters:** `mode`, dimension/area parameters, `doors`, `windows` or `excludeArea`, `coats`, `coverage`, `price`.

Coverage must be adjustable. Do not present a manufacturer-specific coverage rate as universally correct.

## 9. Board Foot Calculator

**URL:** `/board-foot-calculator/`

**Intent:** board foot calculator, board feet calculator, lumber board feet, lumber cost.

For dimensions in inches × inches × feet:

`BF = thickness(in) × width(in) × length(ft) / 12`

Multiply by quantity for each row and sum rows for a project total.

**Inputs:** thickness, width, length, units, quantity, optional price per board foot. Support multiple lumber rows with a documented maximum.

**Outputs:** board feet per piece, row totals, total board feet, optional total cost.

**State parameters:** compact validated row encoding with a strict row cap plus `price`, or stable numbered row parameters. Do not permit unbounded query growth.

## 10. Stair Calculator

**URL:** `/stair-calculator/`

**Intent:** stair calculator, stair rise and run, stair stringer calculator.

Core geometry:

- Determine integer riser count from total rise and target/max riser input.
- `actual riser height = total rise / riser count`
- For a standard floor-to-floor stair, tread count is normally one fewer than riser count unless the selected configuration explicitly changes that relationship.
- `total run = tread count × tread depth`
- `stringer length = √(total rise² + total run²)`
- `angle = atan(total rise / total run)`

**Inputs:** total rise, units, target/max riser height, tread/run depth, optional configuration inputs needed to distinguish tread count behavior.

**Outputs:** riser count, actual riser height, tread count, tread depth, total run, stringer length, stair angle.

**State parameters:** `rise`, `unit`, `maxRiser`, `tread`, and any explicitly supported configuration selector.

Validate that the resulting geometry is mathematically possible. Building-code information is informational and jurisdiction-dependent. Never label a result code-compliant without jurisdiction-specific verification.

## SEO/content contract

Every calculator page must include unique title, meta description, H1, self-referencing clean canonical, working tool near the top, crawlable explanation, formula/method, useful worked example(s), assumptions where relevant, result interpretation, definitions, and related calculators.

Use `WebApplication` structured data where it accurately describes the visible calculator. Do not invent ratings, reviews, contractor endorsements, code compliance, or unsupported rich-result markup.

All ten clean canonical URLs belong in the sitemap. Shared-state URLs do not.

## Definition Bubble candidates

Consider shared definitions for: area, volume, square foot, cubic foot, cubic yard, waste allowance, density, coverage rate, board foot, riser, tread, run, stringer, stair angle, and material yield. Annotate only useful occurrences and keep essential explanations in crawlable HTML.

## Internal linking

The Construction Calculators hub links to every tool. Strong contextual relationships include:

- Concrete Calculator ↔ Concrete Slab Calculator ↔ Cubic Yard Calculator
- Square Footage Calculator ↔ Paint Calculator ↔ Mulch Calculator
- Cubic Yard Calculator ↔ Gravel Calculator ↔ Mulch Calculator
- Board Foot Calculator ↔ Stair Calculator

Avoid excessive unrelated cross-linking.

## Release gates

Before merge, automated coverage should verify:

- exact ten-URL inventory and explicit absence of prohibited near-duplicate v1 URLs
- unique title/meta/H1/canonical
- crawlable formula/method/examples
- structured data where required
- sitemap membership of clean canonical URLs only
- shared-state creation/restoration and malformed-state handling
- unit normalization and known-answer formula cases
- concrete rectangular/circular calculations, waste and bag yields
- slab calculations and quantity handling
- square-footage shape formulas and multi-area totals
- cubic-yard conversions
- gravel volume/density/mass behavior
- mulch yards/bag rounding
- paint exclusions/coats/coverage
- board-foot multi-row totals
- stair riser/tread/run/stringer/angle logic and edge cases
- Definition Bubble integrity
- canonical UI shell and submit-driven Calculate actions
- existing Ratio, Percentage, Fraction, Unit, Date & Time, Cooking, Finance, SEO, Definition Bubble, and UI Foundation tests remain green
- production build succeeds

## Production QA

Test the hub and all nine calculators at 1363×936, 320×844, 360×800, 390×844, and 430×932 as applicable. Verify calculations, restored share state, header/navigation, readable/tappable controls, contained results, `.table-wrap` behavior for wide/multi-row results, Definition Bubbles, privacy dialog, internal links, metadata/canonical/schema, sitemap, no document horizontal overflow, no console/runtime errors, no missing assets or failed first-party requests, and no unintended advertising/analytics provider.

## Implementation order

This document is the architecture lock. Implementation starts only after this file is committed to `feature/construction-calculators-v1`. Build from the closest released submit-driven calculator reference, preferably the Financial Calculators cluster where its interaction pattern applies. Do not redesign the site.
