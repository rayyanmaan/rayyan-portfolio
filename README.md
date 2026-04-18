# Rayyan Portfolio

[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Netlify Ready](https://img.shields.io/badge/Netlify-Ready-00ad9f?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
![License: MIT](https://img.shields.io/badge/License-MIT-111111?style=for-the-badge)

Personal portfolio web app built with a modern React stack, animated interactions, and route-based city/project storytelling.

## At a Glance

- Frontend: React 19, TypeScript, Vite 7, Framer Motion, Wouter, Tailwind CSS v4
- Runtime: Express wrapper for production serving
- Deployment: Netlify static deploy supported out of the box
- Key routes: `/`, `/city/:id`, `/project/:slug`

## Quick Start

Requirements:

- Node.js 20+
- npm

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run check   # TypeScript check
npm run build   # Production build
npm run start   # Serve production build
```

## Project Layout

```text
client/                 Frontend app (Vite root)
  src/components/       Portfolio sections and UI components
  src/pages/            Route pages (Home, CityPage, ProjectPage)
  src/contexts/         Theme and global UI context
  public/               Static assets
server/                 Express production server entry
scripts/                Utility scripts
docs/                   Design and planning docs
```

## Deployment (Netlify)

This repo already includes:

- `netlify.toml`
- `client/public/_redirects`

Build settings:

- Build command: `npm run build`
- Publish directory: `dist/public`

> Important: The SPA fallback redirect is required for direct refreshes on `/city/:id` and `/project/:slug`.

## Environment Variables

See `.env.example` for defaults.

Optional frontend analytics variables:

| Variable | Purpose |
| --- | --- |
| `VITE_ANALYTICS_ENDPOINT` | Analytics script host |
| `VITE_ANALYTICS_WEBSITE_ID` | Site ID for analytics tracking |

## Security Notes

- `.env` and local machine artifacts are ignored via `.gitignore`
- Dependency audits can be run with `npm audit` or `npm audit --omit=dev`
- No hardcoded runtime secrets are required for local development

## License

MIT
