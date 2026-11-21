# PasteMe landing page refresh

This update changes only the landing page presentation:

- `src/pages/Landing/Landing.jsx`
- `src/pages/Landing/Landing.css`

## What changed

- Reworked the hero into an editorial campaign-preview composition using PasteMe's existing brand mark and plum/sage palette.
- Replaced the previous phone-and-orbit illustration with a layered campaign example and supporting sharing notes.
- Marked the sample campaign visual as a sample so the illustrative fundraising amount is not mistaken for live data.
- Refined typography, spacing, contrast, section cards, FAQ rows, CTA and footer composition.
- Added a short entrance animation, gentle floating support cards, a restrained progress reveal and hover feedback.
- Kept the existing shared scroll-reveal and smooth-scroll systems.
- Added/updated English, Nigerian Pidgin and Yorùbá hero microcopy and menu accessibility labels.
- Improved responsive layouts and respected `prefers-reduced-motion`.

## Preserved

- No backend files or payment/authentication services were changed.
- No API calls, API contracts, routes, wallet logic or campaign data logic were changed.
- No dependencies were added.

## Verification

- Full frontend ESLint: passed.
- Landing JSX syntax parse: passed.
- Landing CSS parse: passed.
- Relative import check: passed.
- Vite production build was not verifiable in this Linux environment because the uploaded `node_modules` contains platform-specific native Rolldown bindings that do not match Linux. Run `npm ci` on the target development machine and then `npm run build`.
