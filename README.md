# Yeldos — делаю веб ощутимым.

Personal frontend portfolio for Yeldos Yegimbayev, built with React, TypeScript and Vite. An ivory-and-ink visual identity, a custom WebGL Y monogram, real project screenshots and interactive studies of motion, depth and feedback.

[Live portfolio](https://yeldos-portfolio.vercel.app/) · [GitHub](https://github.com/TheYeldo/yeldos-portfolio)

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

`pnpm build` runs strict TypeScript checks and creates `dist/`. `vercel.json` configures the Vite build, output directory and response headers. No environment variables, database or API keys are required.

## Features

- A beveled 3D Y with titanium and obsidian materials, studio reflections, pointer response and a CSS fallback.
- Scroll-linked storytelling and section reveals with a global motion control and system reduced-motion support.
- Three detailed project cases with live screenshots, category filters, native dialogs and repository links.
- A sticky case index, direct project links and switchable room/editor screenshots for Programming Simulator.
- A searchable portfolio index with Ctrl/⌘ K, keyboard navigation and support for projects hidden by filters.
- About, YelGit and ProcessLens, interactive expertise tabs and a four-step working process.
- A playground with editable easing and duration, a keyboard-accessible tilt card and a magnetic button.
- A Telegram contact composer that opens a draft for the selected topic, plus email copy and GitHub links.
- Responsive navigation, keyboard focus restoration, lazy-loaded project images and offscreen/hidden-tab WebGL pausing.
- Canonical URL, Person structured data, social preview, robots.txt and sitemap.xml.

## Project structure

- `src/App.tsx`: navigation, personal content, scroll effects, expertise and contact controls.
- `src/styles.css`: design tokens, global layout, responsive styles and motion preferences.
- `src/components/Signature.tsx` and `signature.css`: dependency-free WebGL renderer and CSS fallback.
- `src/components/Projects.tsx` and `projects.css`: case content, filters, screenshots and dialogs.
- `src/components/BeyondBrowser.tsx` and `beyond-browser.css`: C++ projects.
- `src/components/Playground.tsx` and `playground.css`: interactive motion experiments.
- `src/components/CommandMenu.tsx` and `command-menu.css`: searchable navigation with native dialog semantics.
- `public/projects/`: real screenshots from the owner's projects.
- `index.html`: search/social metadata and structured data.

## Content and assets

Project descriptions are based on the owner's public repositories and existing portfolio. The Telegram handle was supplied by the owner. No fictional clients, employment, testimonials or performance figures are included.

YeldoOS, Taytlo and Programming Simulator screenshots were captured from their public deployments. The ProcessLens screenshot comes from its public repository. All project links and source references are included on the site. The social preview is a screenshot of this portfolio.

Manrope is loaded from Google Fonts with system-font fallback. The site has no analytics or trackers.

## Browser verification

Check desktop and mobile layouts, material switching, pause/resume, project filters, dialog Escape and focus restoration, expertise and playground keyboard navigation, contact topics and email copying. Run lint, formatting and the production build before publishing.

## Owner

[GitHub](https://github.com/TheYeldo) · [Telegram](https://t.me/Yeldomr)
