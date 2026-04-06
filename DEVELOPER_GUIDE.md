# Developer Guide

## Overview
This app is a Next.js App Router frontend for a restaurant site. The current setup favors fast first paint, server-rendered content where possible, and small client-side enhancements for cart state, theme switching, and motion.

## Key Patterns
### Server-first data loading
- Shared API helpers live in [src/lib/api.js](/d:/texas-restuarant/frontend-2/src/lib/api.js).
- Read-only page data should be fetched on the server first and passed into client components as props.
- The helpers return safe fallbacks instead of crashing the page when the API is unavailable.

### Client-only interactivity
- Cart state is handled in [src/components/CartProvider.js](/d:/texas-restuarant/frontend-2/src/components/CartProvider.js).
- Theme state is handled in [src/components/ThemeProvider.js](/d:/texas-restuarant/frontend-2/src/components/ThemeProvider.js).
- Scroll animation is isolated in [src/components/GsapReveal.js](/d:/texas-restuarant/frontend-2/src/components/GsapReveal.js).

### Theme system
- Theme is stored on the `<html>` element through `data-theme`.
- Global light/dark overrides live in [src/app/globals.css](/d:/texas-restuarant/frontend-2/src/app/globals.css).
- The inline script in [src/app/layout.js](/d:/texas-restuarant/frontend-2/src/app/layout.js) prevents theme flash before hydration.

## Editing Guidelines
### When adding a new page
- Fetch read-only data on the server when possible.
- Keep client components focused on local interactivity like filters, toasts, and form state.
- Use [src/components/FastImage.js](/d:/texas-restuarant/frontend-2/src/components/FastImage.js) for image-heavy UI.

### When adding animation
- Prefer CSS for hover/press states.
- Use `GsapReveal` for section-level scroll reveals.
- Avoid adding GSAP to always-mounted critical code paths.

### When adjusting light mode
- Update tokens in `html[data-theme="light"]` first.
- Add targeted overrides only when utility classes are too specific to retheme cleanly.
- Check CTA contrast, footer readability, and image overlays after any palette change.

## Files Worth Knowing
- [src/app/layout.js](/d:/texas-restuarant/frontend-2/src/app/layout.js): root providers and theme boot script
- [src/app/globals.css](/d:/texas-restuarant/frontend-2/src/app/globals.css): global theme and interaction styles
- [src/components/pages/HomePageClient.js](/d:/texas-restuarant/frontend-2/src/components/pages/HomePageClient.js): homepage UI and category cards
- [src/components/Navbar.js](/d:/texas-restuarant/frontend-2/src/components/Navbar.js): primary nav and theme toggle
- [src/components/Footer.js](/d:/texas-restuarant/frontend-2/src/components/Footer.js): footer content and theme-sensitive styling

## Practical Tips
- Restart the dev server after changing `next.config.mjs` or adding dependencies.
- If an image host starts failing, check `images.domains` and `remotePatterns` in `next.config.mjs`.
- If light mode looks off on a section, inspect whether the issue is a utility class override, an image overlay, or hardcoded text color.
