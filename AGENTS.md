# ConversionType Project Instructions

This file is the repository-level entry point for instructions that apply to AI agents, ChatGPT Work, and other automated contributors working on ConversionType.

## Required reading before implementation

Before planning, designing, implementing, or modifying any public-facing tool, calculator, converter, landing page, content architecture, or SEO behavior:

1. Read `docs/RANKING_SEO_STRATEGY.md` in full.
2. Treat that document as a required project standard, not optional guidance.
3. Incorporate its search-intent, canonical, crawlable-content, internal-linking, structured-data, sitemap, indexing, release-gate, and production-QA requirements into the implementation.
4. Do not create thin, duplicate, doorway, or uncontrolled programmatic pages.
5. If a requested implementation conflicts with `docs/RANKING_SEO_STRATEGY.md`, identify and document the conflict before proceeding rather than silently ignoring the standard.

## Future build planning

Every new public tool or landing-page feature should explicitly consider:

- Primary search intent
- Secondary and long-tail search intents
- Canonical URL strategy
- Crawlable page content
- Formula, method, examples, or explanatory content where relevant
- Internal-link relationships
- Structured-data decision
- Sitemap and indexing decision
- Share/state URL behavior when applicable
- Mobile usability
- Automated release-gate coverage
- Production QA requirements

Do not treat SEO as a post-build content pass. It is part of the feature architecture.

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
- Structured data is present and appropriate when required.
- Canonical indexable page is represented correctly in the sitemap.
- Arbitrary calculator/converter state URLs are not added to the sitemap.
- Core tool behavior has regression coverage.
- No prohibited third-party advertising or analytics dependency is introduced unintentionally.

A successful build alone is not sufficient to declare an SEO-focused feature complete.

## Production QA

For relevant releases, production QA should verify both product behavior and search-facing behavior, including:

- Canonical route loads.
- Tool produces correct results.
- Shareable state restores correctly when supported.
- Mobile layout remains usable.
- No horizontal overflow.
- Title, meta description, H1, canonical, and structured data remain correct.
- Internal links work.
- Sitemap contains the intended clean canonical pages.
- No unintended indexing behavior is introduced by state/query URLs.
- No console/runtime errors or missing assets.
- Privacy controls continue to work.
- No unintended live advertising or analytics provider appears.

## Instruction hierarchy

For ConversionType repository work:

1. Follow the user's explicit task requirements.
2. Follow this `AGENTS.md` file.
3. Follow the project standards referenced by this file, especially `docs/RANKING_SEO_STRATEGY.md`.
4. Preserve existing architecture and release gates unless the task explicitly requires a deliberate change.

If requirements conflict, call out the conflict rather than silently discarding a project standard.

## Before declaring work complete

Confirm that:

- `docs/RANKING_SEO_STRATEGY.md` was reviewed when applicable.
- The implementation follows its requirements.
- Relevant automated gates pass.
- The PR/merge workflow was followed for product changes.
- Production QA was completed when required.
- Any limitation or untested requirement is reported explicitly.

---

**Default instruction for future ConversionType work:** Read and follow this `AGENTS.md` and every project standard it references before designing or building new public tools.
