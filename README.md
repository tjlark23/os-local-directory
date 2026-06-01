# WilCo Guide

WilCo Guide is a public local-directory app for Williamson County, Texas. It helps people find local businesses by city, category, neighborhood, guide, and business profile.

This repository is intentionally public because it is the visible build log for the directory platform: code changes, security work, data import tooling, SEO pages, and operating docs all happen here in the open.

## What This App Does

- Publishes business directory pages for Leander, Cedar Park, Liberty Hill, Round Rock, Georgetown, Hutto, and nearby Williamson County communities.
- Generates programmatic SEO pages by category, city, guide, and neighborhood.
- Supports business profile pages with reviews, contact information, similar businesses, and upgrade paths.
- Includes admin surfaces for business management, reviews, users, and analytics.
- Connects to Supabase for data and Stripe for paid featured listings.

## Active Workstreams

- **Security:** dependency patching, safer Next.js configuration, Stripe webhook verification, and public security policy.
- **Directory quality:** cleaner business imports, photo/review validation, and duplicate checks.
- **SEO:** category-city pages, guide pages, sitemap coverage, metadata, and structured data.
- **Business revenue:** featured listing checkout, upgrade success flow, and business inquiry routing.
- **Operator docs:** setup, verification, status reports, and maintenance notes that make the public repo understandable.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase
- Stripe
- Vercel

## Local Development

```bash
npm install
npm run dev
```

The app expects Supabase and Stripe environment variables for full production behavior. See `.env.example` once added for the current list.

## Verification

Useful checks before opening or merging a PR:

```bash
npm run build
npm audit
```

For build-only checks without real production credentials, use safe placeholder environment values. Do not use real service keys in local logs or public CI output.

## Repository Status

This repo started from a v0-generated app and is being converted into an active, maintainable public project. Expect small PRs that improve security, docs, data quality, user experience, and deployment confidence.
