# Plant Disease Identification Tool

Plant Disease Identification Tool is an Expo app for farmers and growers to scan crops, upload field photos, and estimate likely disease pressure, spread risk, and first-response actions.

## Setup

1. Install dependencies.
   ```bash
   npm install
   ```
2. Create your local env file.
   ```bash
   cp .env.example .env
   ```
3. Add your key to `.env`.
   ```bash
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the app.
   ```bash
   npm start
   ```

## Scan the codebase (app flow report)

Generate a local Markdown report (`flow-report.md`) that summarizes screens, navigation, and the main scanner flow. If you provide a Gemini key, it also adds an AI-assisted architecture/flow analysis.

```bash
npm run scan:flow
```

Recommended env vars (keep secrets out of git):

- `GEMINI_API_KEY` (preferred for the code scanner script)
- `GEMINI_MODEL` (optional, defaults to `gemini-2.0-flash`)

## Expo Go

- This app is Expo Go compatible because it only uses Expo SDK modules already supported in Expo Go, including `expo-image-picker`.
- For local testing in Expo Go, keep your Gemini key in `.env` as `EXPO_PUBLIC_GEMINI_API_KEY=...`.
- If you change the `.env` value while Metro is running, do a full reload in Expo Go to pick up the new value.

## EAS Build

- `eas.json` is included with `development`, `preview`, and `production` profiles.
- For cloud builds, set `EXPO_PUBLIC_GEMINI_API_KEY` in EAS for the matching environment instead of relying on a local `.env` file.
- Suggested commands:
  ```bash
  eas build --profile preview --platform android
  eas build --profile production --platform android
  eas build --profile production --platform ios
  ```
- The current app identifiers are:
  - Android: `com.annap.leaflab`
  - iOS: `com.annap.leaflab`
- Change those before store release if you want a different package or bundle ID.

## Features

- Camera and gallery image capture with `expo-image-picker`
- Gemini-powered plant identification and health analysis
- Structured output with urgency, likely issue, care steps, and prevention tips
- Built-in guide screen for better photo capture and symptom interpretation

## Notes

- The current implementation sends requests directly from the client. That is acceptable for a prototype, but a production release should proxy AI requests through your own backend.
- Diagnosis from an image is not a substitute for lab testing or expert confirmation.
