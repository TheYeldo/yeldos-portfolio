# Yeldos — Code. Form. Experience.

Personal frontend portfolio for Yeldos Yegimbayev. Built with React, TypeScript and Vite, with a custom WebGL sculpture and an original dark visual identity.

## Run locally

Requires Node.js 22.12+ (Node.js 24 recommended) and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Checks and production build

```sh
pnpm lint
pnpm format:check
pnpm build
pnpm preview
```

`pnpm build` runs strict TypeScript checks and creates the production site in `dist/`. `vercel.json` configures Vercel to build and serve that directory. No environment variables, database or API keys are required.

## Features

- Interactive chrome sculpture with silver and emerald materials, pointer response and a CSS fallback when WebGL is unavailable.
- Filterable projects and accessible native dialogs with repository and live links.
- About, principles, technology stack, process, motion playground and contact sections.
- Three easing curves and adjustable duration in the animation playground.
- Responsive navigation, keyboard focus states, reduced-motion support and a global motion pause.
- GPU animation pauses when the sculpture is outside the viewport or the tab is hidden.
- Working Telegram, GitHub, email and clipboard actions.

## Content and styling

- `src/App.tsx`: personal information, navigation, sections and animation playground.
- `src/styles.css`: design tokens, responsive layouts and shared styles.
- `src/components/Projects.tsx`: project content, links, filters, dialogs and illustrative previews.
- `src/components/projects.css`: project previews and dialog styling.
- `src/components/Sculpture.tsx`: dependency-free WebGL renderer and shader.
- `src/components/sculpture.css`: sculpture presentation and fallback.
- `index.html`: title and search/social metadata.

The project previews are original visual interpretations, explicitly labeled on the site, rather than screenshots. Project descriptions and public contact details are based on the owner's public repositories, previous portfolio and supplied Telegram handle.

Manrope is loaded from Google Fonts; the system font stack is used if the font service is unavailable. The site has no analytics or trackers.

## Verified flows

Desktop and mobile browser checks cover material switching, pause/resume, project filters, project dialogs and Escape/focus restoration, stack accordions, mobile menu, animation controls and responsive overflow. Lint, formatting and the production build should pass before publication.

## Owner

[GitHub](https://github.com/TheYeldo) · [Telegram](https://t.me/Yeldomr)
