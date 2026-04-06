# App flow report

Generated: 2026-03-31T12:22:19.116Z
Project: `PlantHealthIdentifierExpo`

## Local, deterministic summary
- Entry: `expo-router/entry` → `app/_layout.tsx` Stack → `app/(tabs)`
- Navigation: bottom tabs with `Scanner` (`app/(tabs)/index.tsx`) + `Field Guide` (`app/(tabs)/guide.tsx`)
- Scanner flow: pick/take image → `analyzePlantImage()` (`lib/plant-analyzer.ts`) → Gemini `:generateContent` → normalized JSON → UI cards
- Config: `.env` uses `EXPO_PUBLIC_GEMINI_API_KEY` and optional `EXPO_PUBLIC_GEMINI_MODEL`

---
## Gemini-assisted analysis

- Status: skipped (no API key found).
- To enable: set `GEMINI_API_KEY` (recommended) or `EXPO_PUBLIC_GEMINI_API_KEY`, then re-run.
