# ConversionType Ranking & SEO Strategy

**Status:** Project standard  
**Applies to:** All future ConversionType tools, calculators, converters, landing pages, and releases  
**Primary objective:** Build useful tools that are also useful, crawlable search landing pages capable of earning organic traffic from Google, Bing, AI search systems, and other discovery platforms.

## Core rule

Every new ConversionType tool must be both:

1. A genuinely useful interactive utility.
2. A genuinely useful search landing page that can stand on its own without requiring a search engine or crawler to execute the calculator first.

Do not ship a tool as a thin JavaScript interface with little or no crawlable explanatory content.

## 1. Permanent search-focused URLs

Give each meaningful search intent its own permanent, indexable URL when the intent is distinct enough to deserve a page.

Examples from the Ratio cluster:

- `/ratio-calculator/`
- `/simplify-ratio/`
- `/solve-ratio/`
- `/scale-ratio/`
- `/ratio-to-fraction/`
- `/ratio-to-percentage/`
- `/percentage-to-ratio/`

Do not hide multiple high-value search intents exclusively behind tabs, dropdowns, or JavaScript modes on one URL.

Avoid creating separate indexable pages for trivial variations that do not provide unique value.

### Cross-site ownership: file-format converters

File-format conversion search intents are owned by `ConvertFileType.com`.

ConversionType must not create duplicate indexable file-converter tools or landing pages for intents already served, or deliberately assigned to be served, by ConvertFileType.com. This prevents the two sites from unnecessarily competing for the same file-conversion queries and avoids maintaining duplicate utilities.

ConversionType may keep a File Converters discovery block or other contextually useful references. Those references should:

- Link directly to the corresponding permanent ConvertFileType.com converter.
- Use descriptive anchor text that accurately identifies the destination tool.
- Clearly indicate that the destination is on ConvertFileType.com when that context helps the user.
- Use normal followed editorial links when they are genuinely useful; do not add `nofollow` merely because both sites are related.
- Avoid thin ConversionType intermediary pages, doorway pages, redirect-only SEO pages, or duplicate canonical pages for the same file-conversion intent.
- Never add ConvertFileType.com-owned converter URLs or synthetic ConversionType equivalents to the ConversionType sitemap.

ConvertFileType.com may link back to ConversionType calculators or numeric/unit conversion tools when those links genuinely help users. Do not create artificial reciprocal-link patterns solely to manipulate rankings.

Before adding any future file-format converter to ConversionType, check ConvertFileType.com ownership first. If the intent belongs there, strengthen the relevant cross-site discovery link instead of rebuilding the tool.

## 2. Required anatomy of every indexable tool page

Each indexable calculator or conversion page should normally contain:

- A unique, descriptive `<title>`.
- A unique meta description.
- One clear H1 aligned with the search intent.
- A self-referencing canonical URL using the clean production URL.
- The working tool near the top of the page.
- Crawlable static HTML explaining what the tool does.
- The formula, method, or conversion logic when relevant.
- At least one useful worked example; use several when they add genuine value.
- Clear definitions where users may not understand the terminology.
- Context about when or why the calculation is useful when appropriate.
- Related-tool internal links.
- Appropriate structured data when it accurately describes the page.
- Mobile-friendly layout and usable controls.

The written content must help the user. Do not add filler merely to increase word count.

## 3. Search-intent and long-tail strategy

Build around specific problems people actually search for rather than broad keywords alone.

For ratio tools, examples include:

- ratio 3 to 5 as a percentage
- what is 2:3 as a fraction
- simplify 24:36
- convert 7:8 to percentage
- what percentage is 3 out of 8
- how to scale a 16:9 ratio
- 5:4 ratio calculator
- percentage to ratio calculator
- 75 percent as a ratio
- 25 percent as a ratio

Future tool clusters should use the same principle: identify the parent utility, its distinct sub-intents, and useful long-tail questions surrounding them.

## 4. Tool-cluster architecture

Build topical clusters instead of unrelated one-off pages.

Initial and future clusters may include:

- Ratio calculators
- Percentage calculators
- Fraction calculators
- Measurement conversions
- Time conversions
- Additional conversion and calculation categories supported by real search demand

Within each cluster:

- Create a strong parent/hub tool where useful.
- Create dedicated pages for distinct high-value intents.
- Link related tools together naturally.
- Link from broader category pages to the most important tools.
- Avoid orphan pages.

The objective is to make ConversionType increasingly useful and authoritative within each subject area before expanding indiscriminately.

## 5. Programmatic SEO policy

Programmatic answer pages are allowed only when they provide meaningful standalone value.

A future curated result page such as `/ratio/24-to-36/` could include:

- Original ratio
- Simplified ratio
- Fraction
- Decimal
- Percentage
- Greatest common divisor explanation
- Calculation steps
- Relevant scaling information
- Related ratios and tools

Do **not** mass-generate millions of thin combinations.

Start with a controlled set of common or validated queries, potentially tens or hundreds rather than millions, and expand only when search-demand and quality data justify it.

Each indexable programmatic page must be useful enough that a person landing directly on it gets a complete answer rather than a templated shell with numbers substituted into boilerplate.

## 6. Calculator-state and shared-URL policy

Interactive calculator state may be stored in query parameters so users can share calculations.

These stateful URLs are utility URLs, not automatically separate SEO landing pages.

Rules:

- Keep the canonical pointed at the clean tool URL unless a specific result page has deliberately been promoted to a curated indexable landing page.
- Do not add arbitrary calculator-state URLs to the sitemap.
- Do not create infinite crawlable parameter combinations.
- Validate all URL-supplied values as untrusted input.
- A clean URL must always remain fully functional.

If a result deserves its own search landing page, create a deliberate curated page rather than relying on a query-string state URL.

## 7. Internal linking

Internal links are part of the product architecture, not an afterthought.

Every tool should help users discover the logical next calculation.

Use:

- Related tools
- Parent/category links
- Contextual links within explanations where useful
- Links from results when a logical next action exists
- Curated links between closely related answer pages
- Definition bubbles that can link important terminology to deeper explanation pages

Use descriptive anchor text. Avoid excessive or irrelevant cross-linking.

As the site grows, prioritize important pages so they are reachable through a short, understandable navigation path.

## 8. Definition bubbles and contextual learning

Examples and explanatory sections should help users understand unfamiliar terminology without forcing them to leave the tool page.

ConversionType should use a reusable definition-bubble system for meaningful technical, mathematical, or conversion terms.

Examples include:

- ratio
- greatest common divisor (GCD)
- equivalent ratio
- proportion
- scale factor
- numerator
- denominator
- fraction
- percentage
- conversion factor
- metric
- imperial

Rules:

- Only annotate terms that genuinely benefit from explanation. Do not turn ordinary words into noisy links.
- A linked term should open a concise definition bubble on click or tap.
- Do not rely on hover-only interaction; the behavior must work on touch devices.
- Definition triggers must be keyboard accessible.
- The bubble must remain within the viewport on narrow mobile screens.
- Escape or an equivalent accessible close action should dismiss the bubble.
- Important page content must remain present in crawlable HTML; definitions must not hide essential explanations from search engines or users without JavaScript.
- Each concept should use one authoritative definition across the site wherever practical.
- Short definitions belong in the bubble; longer explanations should use a dedicated page when the concept justifies one.
- High-value concept pages may use clean URLs such as `/definitions/greatest-common-divisor/` and should provide genuinely useful standalone content before being indexed.
- Definition bubbles may link to those deeper pages with descriptive anchor text such as `Learn more about greatest common divisors`.
- Opening a definition bubble must not generate a new indexable URL or uncontrolled query parameter.
- Avoid repeatedly annotating every occurrence of the same term in a short section; prioritize readability.

This system should create a useful knowledge graph between tools, examples, definitions, deeper concept pages, and related calculators without creating thin SEO pages.

## 9. Technical SEO requirements

Maintain the following across the site:

- Valid `robots.txt`
- XML sitemap containing canonical indexable pages
- Correct canonical tags
- Unique page titles and meta descriptions
- Semantic headings
- Crawlable HTML content
- Appropriate structured data
- Useful 404 behavior
- Permanent redirects when URLs are replaced
- HTTPS production URLs
- Responsive/mobile usability
- Fast loading and minimal unnecessary JavaScript
- No broken internal links or missing assets

Do not depend on client-side JavaScript for all meaningful page content when the important explanatory content can be shipped in HTML.

## 10. Structured data

Use structured data only when it truthfully represents the visible page and matches supported schema types.

For interactive calculators, `WebApplication` with an appropriate application category may be used when accurate.

Do not invent unsupported rich-result types or add misleading markup solely in an attempt to gain enhanced search presentation.

Structured data must remain consistent with the visible page.

## 11. Google, Bing, and indexing operations

Once the custom production domain is live:

- Verify `conversiontype.com` in Google Search Console.
- Set up Bing Webmaster Tools.
- Submit the production sitemap.
- Implement IndexNow where appropriate.
- Monitor indexing, crawl issues, impressions, clicks, queries, positions, and page performance.

Use actual Search Console and Bing data to decide which tools, sub-intents, and answer pages should be expanded next.

Do not choose the long-term content roadmap solely from intuition once real search data is available.

## 12. AI search and answer-engine visibility

Pages should also be easy for AI-powered search and answer systems to understand and extract.

Favor:

- Direct answers near the relevant question.
- Clear formulas and calculation steps.
- Explicit definitions.
- Descriptive headings.
- Worked examples.
- Consistent terminology.
- Useful tables where they genuinely improve comprehension.
- Clean HTML and stable URLs.

Do not create separate low-quality content merely for AI systems. The same page should serve humans and machines well.

## 13. Quality and anti-spam rules

Never pursue ranking through thin or manipulative pages.

Avoid:

- Keyword stuffing
- Near-duplicate landing pages
- Doorway pages
- Automatically generated pages with no unique value
- Hidden text or links
- Misleading structured data
- Fake reviews, ratings, authorship, or expertise
- Indexing arbitrary search/filter/calculator-state combinations
- Copying competitors' explanatory content
- Publishing pages only to capture keyword variants

Search traffic is the outcome of useful pages, sound architecture, technical accessibility, and sustained coverage of real user needs.

## 14. Monetization policy

Organic usefulness comes before ad density.

During early tool development:

- Do not let advertising interfere with calculator use.
- Do not introduce live ad-provider dependencies unless the release explicitly includes monetization.
- Preserve fast loading and layout stability.

When display advertising is introduced later, keep the primary tool immediately usable and avoid layouts that materially degrade user experience or search performance.

## 15. Release-gate expectations

Future release gates should increasingly verify SEO requirements automatically.

For every new indexable tool page, gates should check where practical:

- Page exists in the production build.
- Unique title exists.
- Meta description exists.
- H1 exists.
- Canonical is correct.
- Required static explanatory content is present.
- Appropriate structured data is valid/present when required.
- Canonical page is included in the sitemap when indexable.
- Arbitrary state/query URLs are not inserted into the sitemap.
- No prohibited live ad/analytics providers are introduced unintentionally.
- Build succeeds.
- Core calculator/conversion behavior has regression coverage.
- Definition triggers remain valid and accessible when the page uses definition bubbles.

A green build alone is not sufficient if the new page violates the project's search architecture.

## 16. Production QA expectations

After deployment, verify both product behavior and search-facing behavior.

Production QA should include, as applicable:

- Canonical production route loads.
- Calculator/converter produces correct results.
- Mobile layout works at narrow widths.
- No horizontal page overflow.
- Page title, description, H1, canonical, and structured data are correct.
- Internal links work.
- Definition bubbles open by click/tap and keyboard, remain usable on mobile, and link correctly to deeper explanation pages when present.
- Sitemap contains the intended clean page.
- Shareable state does not create unintended canonical/indexing behavior.
- No console/runtime errors or missing assets.
- Privacy controls continue to work.
- No unintended third-party advertising or analytics requests appear.

Do not mark an SEO-focused release complete solely because CI passes.

## 17. Expansion decision framework

Before creating a major new cluster or large set of landing pages, evaluate:

1. Does the query represent a real user problem?
2. Can ConversionType provide a better or faster answer/tool?
3. Is the intent sufficiently different from an existing page?
4. Can the page contain meaningful unique value?
5. Can it be naturally linked into the site's architecture?
6. Is there evidence of search demand, impressions, related queries, competitor visibility, or user demand?
7. Can the page remain useful even if it receives no search traffic?

If the answer to the quality questions is no, do not create the page simply for SEO.

## 18. Future-build instruction

Before implementing any new ConversionType tool or landing-page cluster, review this document and design the release around it.

Every future feature plan should identify:

- Primary search intent
- Secondary/long-tail intents
- Canonical URL(s)
- Page content required to answer the intent
- Important terminology that should receive definition bubbles
- Any concepts deserving dedicated definition/explanation pages
- Internal-link relationships
- Structured-data decision
- Sitemap/indexing decision
- State/share URL behavior if applicable
- Automated SEO gates
- Production QA requirements

If a proposed implementation conflicts with this strategy, explicitly document the reason before deviating.

---

## Guiding principle

**ConversionType should rank because each page is the best practical combination of tool + answer for the problem it targets—not because the site manufactures the largest number of URLs.**
