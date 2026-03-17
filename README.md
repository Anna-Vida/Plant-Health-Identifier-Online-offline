# Plant Health Identifier (Expo, Gemini)

Identify plant species and diagnose common leaf diseases using the Gemini Vision API. Includes an offline mode scaffold for local matching based on curated datasets.

## Features
- Pick or capture images with Expo Image Picker
- Securely store Gemini API key with SecureStore
- Send base64 images to gemini-1.5-flash for analysis
- Toggle Offline mode to prepare for on-device matching

## Requirements
- Node.js 18+
- Expo Go app on your iOS/Android device
- A Google Generative Language API key (Gemini)

## Setup
1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npx expo start`
3. Open Expo Go and scan the QR code.

## Usage
1. Enter your Gemini API key in the input field and Save Key.
2. Tap Pick Image or Take Photo to select a plant image.
3. Tap Analyze with Gemini to get species, diagnosis, and care steps.
4. Toggle Offline mode to disable cloud requests and show offline plan.

## Offline Mode Plan
- Use a small curated subset of PlantVillage or PlantDoc for target crops.
- Precompute image embeddings server-side (e.g., MobileNet/EfficientNet) and ship vectors + labels as JSON.
- Perform on-device k-nearest neighbor lookup against precomputed vectors.
- For real-time on-device embeddings, migrate to Expo Dev Client with tfjs-react-native.

Dataset references:
- PlantVillage (leaf disease classification): https://www.kaggle.com/datasets/emmarex/plantdisease
- PlantDoc (in-the-wild images): https://github.com/pratikkayal/PlantDoc-Dataset
- PlantCLEF (broader identification): https://www.imageclef.org/lifeclef

## Project Structure
- `src/App.tsx` — main UI and Gemini request
- `app.json` — Expo configuration
- `index.js` — entry point
- `tsconfig.json`, `babel.config.js` — tooling config

## Notes
- Do not commit API keys; keys are stored on-device via SecureStore.
- Web output was disabled to avoid expo-router requirement; use Expo Go for testing.
