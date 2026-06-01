# Active Work

This document tracks public workstreams that should be visible to anyone reviewing the repo.

## Now

- Keep dependencies patched and document known security advisories.
- Add project setup docs so contributors and future operators understand how to run the app safely.
- Improve import scripts so directory data can be checked before it touches Supabase.
- Keep programmatic SEO pages healthy across city, category, guide, and neighborhood routes.

## Next

- Add `.env.example` with safe placeholders.
- Add GitHub Actions for build and dependency audit checks.
- Replace or isolate spreadsheet tooling that depends on the vulnerable `xlsx` package line.
- Add smoke tests for public search, business pages, and Stripe checkout route validation.

## Later

- Add a fuller data quality dashboard for duplicates, missing photos, low-confidence categories, and stale business profiles.
- Add owner-facing claim flows for businesses.
- Add analytics proof pages for featured listing customers.

## Operating Notes

- Keep pull requests small and titled clearly.
- Make security work visible but do not publish exploit details.
- Do not commit local data exports, credentials, screenshots, or raw provider responses unless they are sanitized fixtures.
