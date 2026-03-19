# 🌿 PlantScan AI — Plant Health Identifier

An AI-powered web app that identifies plants and diagnoses health issues using **Google Gemini 2.5**. Simply upload a photo or use your camera to get an instant plant analysis.

## ✨ Features

- 📷 **Live Camera Scanner** — captures plant images directly from your webcam or phone camera
- 📁 **Image Upload** — drag & drop or browse to upload any plant photo
- 🤖 **Gemini 2.5 AI Analysis** — identifies species and diagnoses health conditions
- 🩺 **Health Score** — visual health bar rated 0–100 (Healthy / Moderate / Critical)
- ⚠️ **Issue Detection** — lists specific diseases, pests, or stress symptoms
- 💧 **Care Recommendations** — actionable tips tailored to your plant's condition
- 🌟 **Fun Facts** — learn something new about each plant
- 🕐 **Scan History** — last 8 scans stored locally in your browser
- 🌙 **Premium Dark UI** — glassmorphism design with smooth animations

## 🚀 Getting Started

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API key"** → copy the key

### 2. Open the App

**Option A — Open directly:**
Double-click `index.html` to open in your browser.

**Option B — Serve locally (recommended for camera support):**

```bash
# Using Python
python -m http.server 8080
# Then open: http://localhost:8080

# Using Node.js (npx)
npx serve .
# Then open the URL shown
```

> **Note:** Camera access requires HTTPS or `localhost`. For just image upload, opening the file directly works fine.

### 3. Enter your API key

When the app opens, paste your Gemini API key. It's saved in your browser only — never sent anywhere except Google's API.

### 4. Scan a Plant!

- Click **"📁 Upload Image"** to pick a photo, or
- Click **"📷 Use Camera"** to capture live
- Click **"🔍 Analyze Plant"** to get results

## 🗂 Project Structure

```
Plant/
├── index.html   # App structure & UI layout
├── style.css    # Dark green glassmorphism design system
├── app.js       # Gemini API logic, camera, upload, history
└── README.md    # This file
```

## 🔒 Privacy

- Your API key is stored **only in your browser's `localStorage`**
- Plant images are sent **only to Google's Gemini API** for analysis
- No data is stored on any server — everything is local


## 🤖 AI Model

Uses `gemini-2.5-pro-preview-03-25` via the Gemini REST API with an image + structured prompt, returning:

```json
{
  "plantName": "Scientific name",
  "commonName": "Common name",
  "healthScore": 85,
  "status": "Healthy",
  "issues": [],
  "careRecommendations": ["Water every 5-7 days", "..."],
  "funFact": "..."
}
```

## 📄 License

MIT License — free to use, modify, and distribute.

---

Made with 💚 by Anna Vida · Powered by [Google Gemini 2.5](https://deepmind.google/technologies/gemini/)
