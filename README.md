# PlantScan AI — Plant Health Identifier

An AI-powered web app that identifies plants and diagnoses health issues using Google Gemini 2.5. Simply upload a photo or use your camera to get an instant plant analysis.

[![Powered by Gemini 2.5](https://img.shields.io/badge/Gemini_2.5-4A89F3?style=for-the-badge&logo=google-gemini&logoColor=white)](https://gemini.google.com)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Features

- **Live Camera Scanner** — captures plant images directly from your webcam or phone camera
- **Image Upload** — drag & drop or browse to upload any plant photo
- **Gemini 2.5 AI Analysis** — identifies species and diagnoses health conditions
- **Health Score** — visual health bar rated 0–100 (Healthy / Moderate / Critical)
- **Issue Detection** — lists specific diseases, pests, or stress symptoms
- **Care Recommendations** — actionable tips tailored to your plant’s condition
- **Fun Facts** — learn something new about each plant
- **Scan History** — last 8 scans stored locally in your browser
- **Premium Dark UI** — glassmorphism design with smooth animations

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create your local env file

   ```bash
   cp .env.example .env
   ```

3. Start the app

   ```bash
   npx expo start
   ```
