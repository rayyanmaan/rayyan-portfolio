# Netlify Static Deploy (This Repo)

This project is ready for static deployment with client-side routing.

## What was added

- `netlify.toml` at repo root
- `client/public/_redirects` for SPA route fallback
- `netlify-static-dist.zip` generated from `dist/public`

## Why your earlier instructions needed one change

In this repo, Vite outputs to `dist/public` (not `dist`), so Netlify must publish `dist/public`.

## Option 1: Deploy from GitHub (recommended)

1. Push this repo to GitHub.
2. In Netlify, add a new site from that repo.
3. Netlify will read `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
4. Deploy.

## Option 2: Manual upload (single file)

1. Use `netlify-static-dist.zip`.
2. In Netlify, choose manual deploy and upload the zip.
3. Routing works because `_redirects` is included in the built output.

## Notes

- Build warnings mention missing `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID`.
- If analytics is required, set these in Netlify Environment Variables and redeploy.
