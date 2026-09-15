# ConversionType Project Instructions

This file is the repository-level entry point for instructions that apply to AI agents, ChatGPT Work, and other automated contributors working on ConversionType.

## Required reading before implementation

Before planning, designing, implementing, or modifying any public-facing tool, calculator, converter, landing page, content architecture, SEO behavior, or site UI:

1. Read `docs/RANKING_SEO_STRATEGY.md` in full.
2. Read `docs/UI_DESIGN_SYSTEM.md` in full.
3. Treat both documents as required project standards, not optional guidance.
4. Incorporate the SEO strategy's search-intent, canonical, crawlable-content, internal-linking, definition-bubble, structured-data, sitemap, indexing, release-gate, and production-QA requirements into the implementation.
5. Reuse the UI design system's canonical site shell, calculator patterns, controls, responsive behavior, and accessibility rules rather than creating cluster-specific approximations.
6. Do not create thin, duplicate, doorway, or uncontrolled programmatic pages.
7. If a requested implementation conflicts with either project standard, identify and document the conflict before proceeding rather than silently ignoring the standard.

## UI foundation and drift prevention

`docs/UI_DESIGN_SYSTEM.md` is the authoritative UI contract for public ConversionType tools.

Requirements:

- Start new public tools from the closest currently released reference implementation.
- Reuse established shared markup, classes, CSS, brand treatment, calculator layout, footer, privacy controls, and responsive behavior.
- Do not invent a new header, logo treatment, button style, calculator shell, typography system, spacing system, or mobile breakpoint for an individual calculator cluster.
- Live bidirectional converters must not show a redundant Convert/Calculate button when editing either value already updates the other value immediately.
- Submit-driven calculators may retain Calculate, Solve, Simplify, or equivalent actions when explicit submission is part of the interaction model.
- Add or update automated checks when a public UI contract can regress silently.
- Treat visual consistency failures as product regressions even when calculations and SEO checks pass.

## Future build planning

Every new public tool or landing-page feature should explicitly consider:

- Primary search intent
- Secondary and long-tail search intents
- Canonical URL strategy
- Crawlable page content
- Formula, method, examples, or explanatory content where relevant
- Important terminology that should receive definition bubbles
- Concepts that deserve deeper definition/explanation pages
- Internal-link relationships
- Structured-data decision
- Sitemap and indexing decision
- Share/state URL behavior when applicable
- Canonical UI reference page and interaction pattern
- Mobile usability
- Automated release-gate coverage
- Production QA requirements

Do not treat SEO or UI consistency as post-build passes. They are part of the feature architecture.

## Definition bubbles and contextual learning

When examples or explanatory content contains terminology that a reasonable user may not understand, use the reusable ConversionType definition-bubble pattern described in `docs/RANKING_SEO_STRATEGY.md`.

Requirements:

- Annotate meaningful technical, mathematical, or conversion terms only.
- Use concise, authoritative definitions.
- Support click/tap and keyboard interaction; do not rely on hover alone.
- Keep bubbles usable inside narrow mobile viewports.
- Preserve important explanatory content in crawlable HTML.
- Avoid repeatedly annotating every occurrence of the same term in a short section.
- Use one consistent definition for the same concept across the site where practical.
- Link high-value terms to dedicated definition/explanation pages only when those pages provide substantial standalone value.
- Do not create new indexable URLs merely from opening or interacting with a definition bubble.

Future tools should consider definition opportunities during planning rather than adding them as an afterthought.

## Shareable and stateful URLs

Calculator or converter state may use query parameters for sharing when appropriate. Stateful URLs are utility URLs unless deliberately promoted into curated search landing pages.

Follow the canonical and indexing rules in `docs/RANKING_SEO_STRATEGY.md`. Do not add arbitrary state URLs to the sitemap or create uncontrolled crawlable parameter combinations.

## Release workflow

Use the repository's protected delivery workflow for product changes:

1. Start from the latest `main`.
2. Create a focused feature or fix branch.
3. Implement the smallest coherent change.
4. Add or update automated regression/release-gate coverage.
5. Run the existing local checks and build.
6. Open a pull request into `main`.
7. Do not merge while required gates are failing.
8. Merge only after the required gates pass.
9. Verify the post-merge `main` gates.
10. Perform production QA against the deployed Cloudflare Pages site when the change affects production behavior.

Do not weaken existing gates to make a change pass.

## SEO release requirement

Before opening or merging a PR that creates or materially changes an indexable public page, verify compliance with `docs/RANKING_SEO_STRATEGY.md`.

Where practical, automated gates should verify:

- Production page exists in the build.
- Unique title exists.
- Meta description exists.
- H1 exists.
- Canonical is correct.
- Required crawlable explanatory content is present.
- Definition triggers remain valid and accessible when used.
- Structured data is present and appropriate when required.
- Canonical indexable page is represented correctly in the sitemap.
- Arbitrary calculator/converter state URLs are not added to the sitemap.
- Core tool behavior has regression coverage.
- No prohibited third-party advertising or analytics dependency is introduced unintentionally.

A successful build alone is not sufficient to declare an SEO-focused feature complete.

## Production QA

For relevant releases, production QA should verify both product behavior, UI consistency, and search-facing behavior, including:

- Canonical route loads.
- Tool produces correct results.
- Shared site shell matches `docs/UI_DESIGN_SYSTEM.md`.
- Live converters do not expose redundant submission controls.
- Shareable state restores correctly when supported.
- Mobile layout remains usable.
- No horizontal overflow.
- Title, meta description, H1, canonical, and structured data remain correct.
- Internal links work.
- Definition bubbles open by click/tap and keyboard, remain inside the viewport on mobile, dismiss accessibly, and link correctly to deeper explanation pages when present.
- Sitemap contains the intended clean canonical pages.
- No unintended indexing behavior is introduced by state/query URLs.
- No console/runtime errors or missing assets.
- Privacy controls continue to work.
- No unintended live advertising or analytics provider appears.

## Instruction hierarchy

For ConversionType repository work:

1. Follow the user's explicit task requirements.
2. Follow this `AGENTS.md` file.
3. Follow the project standards referenced by this file, especially `docs/RANKING_SEO_STRATEGY.md` and `docs/UI_DESIGN_SYSTEM.md`.
4. Preserve existing architecture and release gates unless the task explicitly requires a deliberate change.

If requirements conflict, call out the conflict rather than silently discarding a project standard.

## Before declaring work complete

Confirm that:

- `docs/RANKING_SEO_STRATEGY.md` was reviewed when applicable.
- `docs/UI_DESIGN_SYSTEM.md` was reviewed when applicable.
- The implementation follows both standards.
- Definition opportunities were considered for explanatory content.
- Relevant automated gates pass.
- The PR/merge workflow was followed for product changes.
- Production QA was completed when required.
- Any limitation or untested requirement is reported explicitly.

---

**Default instruction for future ConversionType work:** Read and follow this `AGENTS.md` and every project standard it references before designing or building new public tools.
