# Portfolio Update — Files to Replace

Drop these files into your existing `rayyan-portfolio` repo. They replace the ones that existed before.

## Files Changed

### client/src/ (root)
- `index.css` — adds DM Sans + DM Serif Display fonts, cleans up base styles
- `logoData.ts` — NEW: embedded base64 logo image (your seal stamp)

### client/src/components/
- `Navigation.tsx` — replaced sidebar with centered pill nav (Me! / Work / Builds / Stack / Contact)
- `Logo.tsx` — NEW: fixed top-left logo with springy wiggle hover animation
- `Hero.tsx` — "Me!" page with serif name + bio + tags
- `Projects.tsx` — Work page: 3-col Pinterest-style rounded cards
- `Builds.tsx` — NEW: Builds page with dark-themed cards
- `Stack.tsx` — NEW: Stack page with tool tiles by category
- `Contact.tsx` — updated with correct email and socials
- `Footer.tsx` — NEW: footer matching Michelle Liu layout (logo + name | nav links | cta + email + icons)

### client/src/pages/
- `Home.tsx` — rewired: no sidebar, page-based navigation with AnimatePresence transitions

## Notes
- `About.tsx`, `Map.tsx`, `ErrorBoundary.tsx`, `ManusDialog.tsx` are unchanged — keep them
- `App.tsx`, `main.tsx`, `const.ts` unchanged — keep them
- The logo is embedded in `logoData.ts` so no external asset needed
- If `framer-motion` isn't installed: `npm install framer-motion`
