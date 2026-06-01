# Security Policy

## Supported Surface

This repository is the public source for the WilCo Guide local directory app.
Security work focuses on:

- Next.js application routes and configuration.
- Supabase and Stripe integration boundaries.
- Public directory pages and business inquiry flows.
- Import scripts that touch local business data.

## Reporting

Please open a private security advisory on GitHub when reporting a vulnerability.
If that is not available, contact the repository owner directly and avoid posting exploit details in a public issue.

## Current Known Security Notes

- `next` is pinned to the patched `15.5.x` line to avoid known App Router, image optimizer, and middleware advisories.
- `next.config.mjs` restricts optimized remote images to known Google image hosts instead of allowing every HTTPS hostname.
- The npm audit report still flags `xlsx@0.18.5`. npm does not currently provide an automatic fix for this package line. Treat spreadsheet imports as trusted-operator tooling only until the import path is replaced or isolated.

## Safe Operating Rules

- Do not commit secrets or `.env` files.
- Keep service-role Supabase keys out of browser-delivered code.
- Use Stripe webhook signature verification for all paid listing updates.
- Run `npm audit` before dependency changes are merged.
