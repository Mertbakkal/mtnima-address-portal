# MTNIMA Address Management Portal

React + TypeScript + Vite implementation of the MTNIMA address portal design (see `../README.md` and `../design/` for the original handoff).

## Run

```
npm install
npm run dev
```

## Structure

- `src/styles/tokens/` — the design system's CSS custom properties, copied verbatim from `design/tokens/` (plus `--radius-2xl` / `--radius-pill`, referenced in the handoff but missing from the source `semantic.css`).
- `src/components/{core,forms,navigation,panels,map}/` — the reusable design-system components, ported 1:1 from `design/components/*.jsx` to typed `.tsx`.
- `src/screens/` — the two app screens (`LoginScreen`, `AppShell`) plus the map canvas and the three attribute panels, ported from `design/address-portal/*.jsx`.
- `public/assets/` — static assets (icons, login background, vendor logo, field photos) copied from `design/assets/`.

## Known gaps (carried over from the design handoff)

- Icons are still the raster PNGs from the slide deck — swap for real SVGs in `Icon.tsx` / `public/assets/icons/`.
- No official MTNIMA logo; the login screen still shows the Başarsoft vendor mark.
- The Hierarchy module is an intentional placeholder — no source screen was provided.
- Address numbering (`101, 102, …`), the digital address, and all attribute-panel values are still hardcoded/sequential placeholders — wire up real data fetching, street/point persistence, and the address-allocation API.
- `../design/assets/bg-login-map.png` has a faint mockup card baked into the image itself (visible behind the real card) — replace with a plain static map screenshot of Nouakchott.
