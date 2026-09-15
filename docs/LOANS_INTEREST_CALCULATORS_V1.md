# Loans & Interest Calculators v1 architecture

## Scope and search intent

This release creates exactly ten permanent pages. `/financial-calculators/` is the discovery hub. `/loan-calculator/` serves loan calculator, loan payment calculator, calculate loan payment, and monthly loan payment intent; no separate `/loan-payment-calculator/` is permitted. `/personal-loan-calculator/` adds origination-fee and net-proceeds analysis. `/auto-loan-calculator/` estimates amount financed from vehicle price, down payment, trade-in credit, tax, and fees. `/compound-interest-calculator/` calculates growth with selectable compounding and end-of-period contributions. `/simple-interest-calculator/` calculates non-compounding interest. `/interest-calculator/` is a distinct comparison tool with an explicit simple-or-compound method. `/apr-calculator/` estimates APR from monthly cash flows. `/loan-payoff-calculator/` projects a balance month by month and compares an extra-payment plan. `/amortization-calculator/` provides a complete payment schedule.

## Formulas, inputs, and outputs

- Fixed-rate loans use `M = P × r(1+r)^n / ((1+r)^n - 1)`, where `r` is annual rate divided by 12 and `n` is the whole number of monthly payments. At zero interest, `M = P / n`. The loan and amortization tools return payment, principal, total interest, and total paid. Terms may be entered in years or months and must resolve to whole months.
- Personal loans use the same payment formula. Origination fee is `principal × fee percent`; net proceeds are principal minus fee. Fees are reported separately from nominal interest, and total borrowing cost is interest plus the fee.
- Auto loans use taxable price `max(vehicle price - trade-in credit, 0)`, tax `taxable price × sales-tax rate`, and amount financed `vehicle price - down payment - trade-in credit + tax + fees`. Results are estimates, not lender disclosures.
- Compound interest uses `A = P(1+r/n)^(nt)` plus the ordinary-annuity future value of recurring contributions, `C × ((1+r/n)^(nt)-1)/(r/n)`. Contributions occur at the end of each compounding period. At zero interest, ending balance is `P + Cnt`. Supported frequencies are annual, semiannual, quarterly, monthly, and daily. Time must create a whole number of contribution periods.
- Simple interest uses `I = Prt` and `A = P + I`.
- The broad interest calculator requires the user to choose simple or compound interest. It reports interest and ending balance and links to the dedicated tools for deeper analysis.
- APR solves `net proceeds = payment × (1-(1+i)^-n)/i`, where net proceeds are loan amount minus included upfront finance charges. A bounded bisection solver finds the monthly rate and reports nominal annual APR as `12i × 100`. Zero-rate cash flows are handled directly. The solver stops after 200 iterations, uses a `1e-12` cash-flow tolerance, expands the upper bound only to a documented safe limit, and rejects cash flows that cannot amortize the amount received. The result is labeled Estimated APR and is not a Truth in Lending disclosure.
- Payoff calculates monthly interest, applies regular plus optional extra payment, reduces principal, and repeats until zero. It adjusts the final payment to balance plus accrued interest. A parallel baseline run provides time and interest saved. Payments that do not exceed first-period interest are rejected, and a 1,200-payment safety limit prevents non-terminating schedules.
- Amortization uses the fixed payment formula and full internal precision. Each row records payment, principal, interest, and remaining balance. The final payment absorbs the remaining balance so it reaches zero.

## Validation and rounding

Money and rates must be finite. Principal-like inputs must be positive; fees and contributions may be zero; rates may be zero but not negative; term/payment counts must be positive and resolve to whole months or periods. Auto-loan reductions cannot make amount financed non-positive. Finance charges must be less than the amount advanced. Displayed currency is rounded to cents, percentages to practical precision, and durations to whole payments. Calculations and later schedule rows use unrounded internal values, never previously displayed values.

## Shared state, canonical, and indexing rules

Every calculator has Share result. Successful calculation replaces the current query with a compact base64url JSON `state` value containing meaningful form inputs only. Loading a valid state restores inputs and recalculates. Unknown query parameters are ignored. Malformed, missing, impossible, or out-of-range state shows a safe message and leaves the form usable. Clean self-referencing canonicals always point to the production calculator URL. Only the ten clean URLs enter the sitemap; state URLs are utility URLs and never sitemap entries or separate pages.

## Linking, definitions, and structured data

The hub links to all nine tools. Loan, amortization, and payoff cross-link; personal loan, APR, and loan cross-link; auto, loan, and APR cross-link; compound, simple, and broad interest cross-link. Definitions use the released bubble system for principal, interest rate, APR, amortization, loan term, origination fee, compound interest, simple interest, amount financed, and finance charge. Core explanations remain static HTML. Calculator pages use truthful `WebApplication` JSON-LD; the hub uses `CollectionPage`. No ratings, lender claims, or unsupported finance schema is used.

## UI reference and release gates

The released `/percentage-of/` and `/date-calculator/` pages are the reference submit-driven tools. New pages reuse their canonical brand/header, tool hero, tool layout, calculator fields, primary Calculate action, result/status pattern, side links, content, footer, and privacy dialog. Schedules use `.table-wrap`. No finance-specific shell, typography, button, breakpoint, or privacy behavior is introduced.

Static and calculation gates cover the exact URL inventory, unique metadata, H1, canonical, crawlable content, structured data, sitemap state, known answers, zero interest, schedules, final-payment rounding, compound contributions, simple interest, APR convergence and impossible states, payoff comparisons and insufficient payments, auto amount financed, personal fees, shared state, malformed state, definitions, canonical shell, and Calculate actions. Browser QA covers 1363×936, 320×844, 360×800, 390×844, and 430×932 for containment, touch targets, tables, privacy, definitions, console errors, failed first-party requests, calculations, and restoration. Existing release gates remain unchanged and must pass. The feature branch may open a PR only after local gates and the production build pass; this task does not merge or alter Cloudflare production.
