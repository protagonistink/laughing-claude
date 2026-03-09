# CLAUDE.md - AI Assistant Guide for Protagonist Ink Menu

## Project Overview

Protagonist Ink Menu is a cinematic full-screen navigation overlay built with React, designed to integrate with Webflow sites. It replaces Webflow's native navbar with a premium animated overlay featuring navigation links, story cards from Webflow CMS, an email signup, and a custom ink trail cursor effect.

**Live deployment:** Netlify (with GitHub Pages as secondary via GitHub Actions)

## Tech Stack

- **React 18** + **TypeScript 5.3** - UI framework
- **Vite 5** - Build tool and dev server
- **Framer Motion** - Animation library
- **Tailwind CSS 3** - Utility-first styling
- **Lucide React** - Icon library
- **Google Generative AI** - Gemini API for content generation
- **Webflow CMS API** - Dynamic story content

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (localhost:5173)
npm run build     # TypeScript check + Vite production build → dist/
npm run preview   # Preview production build locally
```

There are no test or lint commands configured.

## Project Structure

```
src/
├── components/
│   ├── StoryCard.tsx       # Story card with poster image (2:3 ratio)
│   ├── CursorTrail.tsx     # Canvas-based ink trail cursor effect
│   └── Icons.tsx           # Custom SVG icons (Arrow, Close, Mail, LinkedIn, Instagram)
├── services/
│   ├── geminiService.ts    # Google Generative AI integration
│   └── webflowService.ts   # Webflow CMS API integration
├── App.tsx                 # Main overlay component - all state and orchestration
├── main.tsx                # React entry point
├── types.ts                # TypeScript interfaces (Story)
└── index.css               # Tailwind directives + Google Fonts imports
```

Key non-source files:
- `vite.config.ts` - Base path `/laughing-claude/`, deterministic asset names (no hashes)
- `tailwind.config.js` - Brand colors and font families
- `netlify.toml` - Build config and CORS headers for Webflow embedding
- `public/_headers` - Netlify CORS headers

## Architecture & Patterns

### Component Design
- **App.tsx** is the main orchestrator — handles all state, event listeners, and layout
- Components are functional with hooks (`useState`, `useEffect`, `useRef`)
- No global state management; local component state only

### Webflow Integration
- Communicates via custom DOM events (`toggleMenu`, `closeMenu`)
- Aggressively manages z-index to keep hamburger button visible over Webflow layers
- Targets multiple hamburger selectors (`.menu-burger`, `.w-nav-button`, `.hamburger-trigger`, `[data-nav-trigger]`)
- CORS headers configured in both `netlify.toml` and `public/_headers`

### Animation Conventions
- Use Framer Motion variant objects for reusable animations
- Custom cubic bezier easing: `[0.76, 0, 0.24, 1]`
- Stagger children with delay-based patterns
- Always define exit animations separately from entry
- `AnimatePresence` wraps conditionally rendered animated elements

### Styling
- Tailwind-first — use utility classes, avoid inline styles except for dynamic values
- Brand colors defined in `tailwind.config.js`:
  - `brand-dark`: #282828, `brand-light`/`brand-text`: #F9F9F9
  - `brand-red`/`brand-highlightRed`: #C83C2F
  - `brand-blue`/`brand-highlightBlue`: #1E3F66
- Fonts: Cormorant Garamond (serif headings), Karla (sans-serif body)
- Mobile-first responsive: use `lg:` breakpoint for desktop layouts

### API & Data
- Environment variables use `import.meta.env.VITE_*` prefix
- Services return mock/fallback data when APIs are unavailable (graceful degradation)
- `webflowService.ts` transforms raw CMS responses into the `Story` interface
- `geminiService.ts` handles AI content generation with the Google Generative AI SDK

### Error Handling
- Try-catch in all async service functions
- Console logging with emoji prefixes for debugging
- Fallback to mock data on API failure — UI never breaks

## Build & Deployment

- **Vite** builds to `dist/` with deterministic filenames (`assets/index.js`, `assets/index.css`)
- **Base path** is `/laughing-claude/` (configured in `vite.config.ts`)
- **Netlify** is the primary deployment target (configured in `netlify.toml`)
- **GitHub Actions** deploys to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`, Node 20)

## Git Conventions

- Branch from `main` for features
- Use descriptive commit messages
- PRs with numbered references (e.g., PR #17)
- Never commit `.env` files, `node_modules/`, or `dist/`
