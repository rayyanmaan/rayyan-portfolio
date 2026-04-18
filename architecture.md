# Architecture

## Overview

Personal portfolio website for Rayyan Maan (Sameer Qamri). A single-page application with an interactive 3D globe, scroll-driven animations, and a custom cursor. Built with React 19 on a Vite dev server, served in production by Express.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20+ |
| Frontend | React | 19.2 |
| Language | TypeScript | 5.6 (strict) |
| Build | Vite | 7.1 |
| Styling | Tailwind CSS | v4 |
| Animation | Framer Motion | 12 |
| 3D Globe | cobe | 0.6 |
| Routing | wouter | 3.3 |
| UI Primitives | Radix UI (minimal) | — |
| Server | Express | 4.21 |
| Bundler (server) | esbuild | 0.25 |

## Directory Structure

```
/
├── client/                          # React frontend
│   ├── index.html                   # HTML template
│   ├── public/                      # Static assets
│   │   ├── fonts/                   # UKIJ Diwani TTF (Urdu script)
│   │   ├── symbols/                 # City icon images (7 JPGs)
│   │   ├── aa-sameer-qamri.ttf      # Brand font
│   │   ├── doodle.png               # Processed cursor doodle (transparent)
│   │   ├── doodle_raw.jpg           # Original cursor doodle
│   │   ├── logo.png                 # Logo asset
│   │   ├── canva_screenshot.png     # Reference image
│   │   ├── click-on-city.png        # UI instruction image
│   │   └── travel-with-me.png       # Travel section image
│   └── src/
│       ├── App.tsx                  # Root: ErrorBoundary > ThemeProvider > Router
│       ├── main.tsx                 # React DOM entry point
│       ├── index.css                # Global styles, Tailwind, CSS variables
│       ├── logoData.ts              # Base64-embedded logo (~90KB)
│       ├── data/
│       │   └── navigation.ts        # Shared nav item definitions
│       ├── components/
│       │   ├── Hero.tsx             # Name, bio, scroll-driven globe section
│       │   ├── Globe.tsx            # cobe WebGL globe + city markers + icons
│       │   ├── CustomCursor.tsx     # Canvas-processed doodle as cursor
│       │   ├── Navigation.tsx       # Centered section nav
│       │   ├── Logo.tsx             # Top-left logo (theme toggle)
│       │   ├── Footer.tsx           # Fixed bottom bar with links
│       │   ├── Projects.tsx         # Work/experience cards
│       │   ├── Builds.tsx           # Personal project cards
│       │   ├── Stack.tsx            # Tech stack grid
│       │   ├── Contact.tsx          # Contact section
│       │   ├── ErrorBoundary.tsx    # React error boundary
│       │   └── ui/                  # shadcn/ui (minimal: button, card, sonner, tooltip)
│       ├── contexts/
│       │   └── ThemeContext.tsx      # Dark/light theme with localStorage
│       ├── lib/
│       │   └── utils.ts             # cn() utility (clsx + tailwind-merge)
│       └── pages/
│           ├── Home.tsx             # Main layout with section switching
│           ├── CityPage.tsx         # City detail page (per globe marker)
│           └── NotFound.tsx         # 404 page
├── server/
│   └── index.ts                     # Express static file server
├── scripts/
│   └── process_doodle.py            # Python: converts doodle_raw.jpg → doodle.png
├── docs/
│   └── ideas.md                     # Design brainstorm document
├── .claude/
│   ├── skills/
│   │   └── playwright-cli/          # Playwright browser automation skill + references
│   └── docs/
│       └── skills-reference.md      # All available tools, skills, MCP servers
├── dist/                            # Build output (gitignored)
│   ├── public/                      # Vite client build
│   └── index.js                     # esbuild server bundle
├── architecture.md                  # This file
├── CLAUDE.md                        # Agent working guide
├── package.json
├── tsconfig.json
├── vite.config.ts
├── components.json                  # shadcn CLI config
├── .prettierrc
├── .prettierignore
├── .gitignore
├── .env.example
└── README.md
```

## Application Architecture

### Entry Point

```
client/src/main.tsx
  └── App.tsx
        └── ErrorBoundary
              └── ThemeProvider (defaultTheme="light", switchable)
                    └── TooltipProvider
                          └── Toaster (sonner)
                                └── Router (wouter)
```

### Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home | Main single-page with section switching |
| `/city/:id` | CityPage | Individual city detail (linked from globe) |
| `*` | NotFound | 404 fallback |

### Section Navigation

Home uses **state-based section switching** (not URL routing). The `activeSection` state drives which component renders via AnimatePresence:

| Section ID | Component | Description |
|-----------|-----------|-------------|
| `me` | Hero + Globe | Name, bio, scroll-driven 3D globe with city markers |
| `work` | Projects | Work experience cards (3-column grid) |
| `builds` | Builds | Personal project cards (3-column grid) |
| `stack` | Stack | Tech stack organized by category |
| `contact` | Contact | Contact information and socials |

## Theme System

### Implementation
- `ThemeContext` wraps the app, stores theme in localStorage
- Logo click toggles between light and dark
- CSS variables defined in `index.css` under `:root` (light) and `.dark` (dark)

### Design Tokens
All components use semantic CSS variable tokens:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | white | near-black | Page backgrounds |
| `--foreground` | near-black | white | Primary text |
| `--muted-foreground` | gray | light gray | Secondary text |
| `--card` | white | dark gray | Card backgrounds |
| `--primary` | brand color | brand color | Buttons, accents |
| `--destructive` | red | red | Error states |
| `--border` | light gray | dark gray | Borders, dividers |

**Rule:** Never use hardcoded Tailwind color classes (`text-gray-*`, `bg-slate-*`). Always use semantic tokens (`text-foreground`, `bg-background`, etc.).

## Key Components

### Hero (`Hero.tsx`)
- Scroll-driven transforms via `useScroll` + `useTransform`
- Globe scales from 0.84 → 1.22 as user scrolls
- Name hover toggles between English ("rayyan maan") and Urdu ("ریّان مان")
- Sticky positioning keeps globe centered during scroll

### Globe (`Globe.tsx`)
- Renders via `cobe` (WebGL dot-sphere)
- 7 city markers with lat/lng → 3D projection
- City icons positioned absolutely around the globe, revealed progressively on scroll
- Icons processed via `TransparentImage` component (flood-fill background removal)
- Globe rotates automatically, user can drag to rotate manually

### CustomCursor (`CustomCursor.tsx`)
- Processes `doodle_raw.jpg` at runtime: background removal, connected-component filtering, cropping
- Renders as `<motion.img>` with spring physics tracking mouse position
- Inverts in dark mode via CSS `filter: invert(1)`
- Only activates on fine pointer devices (accessibility)

## Animation Patterns

### Easing
Standard easing curve used throughout: `[0.22, 1, 0.36, 1]` (custom ease-out-quart).

### Stagger
Components reveal sequentially using Framer Motion's `staggerChildren` and per-item `delay` offsets.

### Scroll-Driven
- `useScroll({ container: scrollRef })` tracks the fixed scroll container
- `useTransform` maps scroll position to scale, opacity, and position values
- Globe city icons reveal based on scroll thresholds (`150 + i * 65`)

## Data Flow

All content is **static** — no API calls, no database, no backend data fetching.

| Data | Location | Format |
|------|----------|--------|
| City coordinates & symbols | `Globe.tsx` (inline array) | TypeScript object |
| Project/experience data | `Projects.tsx` (inline array) | TypeScript object |
| Build/project data | `Builds.tsx` (inline array) | TypeScript object |
| Tech stack data | `Stack.tsx` (inline object) | TypeScript object |
| Navigation items | `data/navigation.ts` | Shared constant |
| Logo | `logoData.ts` | Base64 data URI (~90KB) |

## Build & Deploy

### Development
```bash
npm run dev          # Vite dev server on port 3000
npm run check        # TypeScript type checking (no emit)
npm run format       # Prettier formatting
```

### Production
```bash
npm run build        # 1. Vite builds client → dist/public/
                     # 2. esbuild bundles server → dist/index.js
npm run start        # NODE_ENV=production node dist/index.js
```

### Server Architecture
Express serves:
1. Static files from `dist/public/`
2. Catch-all route returns `index.html` for client-side routing

## Fonts

| Font | Source | Usage |
|------|--------|-------|
| League Spartan | Google Fonts CDN | Brand headings, navigation |
| UKIJ Diwani | Local TTF (`client/public/fonts/`) | Urdu script hover effect |
| System stack | Browser default | Body text fallback |
