# Rayyan Portfolio

Personal portfolio web app built with React, TypeScript, and Vite.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Framer Motion
- Wouter routing
- Tailwind CSS v4
- Express (production server wrapper)

## Project Structure

```
client/               # Frontend app (Vite root)
	src/
		components/       # Portfolio sections and UI pieces
		pages/            # Route pages (Home, CityPage, ProjectPage)
		contexts/         # Theme context
	public/             # Static assets
server/               # Express production server entry
scripts/              # Utility scripts
docs/                 # Design and planning docs
```

## Local Development

Requirements:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Type-check:

```bash
npm run check
```

Build production bundle:

```bash
npm run build
```

Run production server locally:

```bash
npm run start
```

## Routing

Client-side routes use Wouter and are expected to be served by index fallback in static hosting:

- `/`
- `/city/:id`
- `/project/:slug`

## Netlify Static Deploy

This repository includes:

- `netlify.toml`
- `client/public/_redirects`

Use:

- Build command: `npm run build`
- Publish directory: `dist/public`

The redirect fallback is required so direct refreshes on dynamic routes work correctly.

## Environment Variables

See `.env.example` for available variables.

Current optional variables used by the frontend include analytics values:

- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

## Security and Hygiene

- `.env` files are gitignored.
- Local artifacts and scratch files are excluded via `.gitignore`.
- Production dependency vulnerabilities are checked with `npm audit --omit=dev`.

## License

MIT
