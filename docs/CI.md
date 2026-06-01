# Continuous Integration

The repo runs a GitHub Actions build check on every pull request and every push to `main`.

## What It Checks

- Installs dependencies with `npm ci`.
- Builds the Next.js app with safe placeholder environment values.

## Why Placeholder Values Are Used

The app creates Supabase and Stripe clients during build-time page collection. CI uses fake values so the build can prove the app compiles without exposing real credentials.

## What It Does Not Check Yet

- It does not run a full browser smoke test.
- It does not call Supabase, Stripe, or Vercel.
- It does not fail on non-critical npm audit findings yet because the current app still has a known `xlsx` advisory that needs a separate replacement plan.
- It does not prove a deployment has production Supabase credentials. Missing public Supabase values use build-safe placeholders and log a warning.

## Next Improvements

- Add a dependency audit job once the `xlsx` import path is replaced or isolated.
- Add a Playwright smoke test for the homepage, search page, business page, and upgrade page.
- Add a route-generation check for sitemap and programmatic SEO paths.
