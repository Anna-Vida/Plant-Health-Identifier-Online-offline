// ============================================================
// PlantScan AI — app.js
// Uses Google Gemini 2.5 (gemini-2.5-pro-preview-03-25) via REST
// ============================================================

const GEMINI_MODEL = "gemini-2.5-pro-preview-03-25";
const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";
const HISTORY_KEY = "plantscan_history";
const API_KEY_KEY = "plantscan_api_key";
const MAX_HISTORY = 8;

// ── State ──────────────────────────────────────────────────
let currentImageBase64 = null;
let currentImageMime = "image/jpeg";
let currentStream = null;
let apiKey = localStorage.getItem(API_KEY_KEY) || "";
let sidebarOpen = false;

// ── DOM refs ───────────────────────────────────────────────
const apiKeyModal = document.getElementById("apiKeyModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const toggleKeyBtn = document.getElementById("toggleKey");
const saveApiKeyBtn = document.getElementById("saveApiKey");
const changeKeyBtn = document.getElementById("changeKeyBtn");
const historyToggle = document.getElementById("historyToggleBtn");
const historySidebar = document.getElementById("historySidebar");
const closeSidebar = document.getElementById("closeSidebar");
const historyList = document.getElementById("historyList");
const clearHistBtn = document.getElementById("clearHistoryBtn");

const dropZone = document.getElementById("dropZone");
const dropZoneInner = document.getElementById("dropZoneInner");
const fileInput = document.getElementById("fileInput");
const previewImg = document.getElementById("previewImg");
const cameraBtn = document.getElementById("cameraBtn");
const cameraViewfinder = document.getElementById("cameraViewfinder");
const cameraFeed = document.getElementById("cameraFeed");
const captureBtn = document.getElementById("captureBtn");
const cancelCameraBtn = document.getElementById("cancelCameraBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeBtnText = document.getElementById("analyzeBtnText");
const analyzeBtnIcon = document.getElementById("analyzeBtnIcon");

const scanCard = document.getElementById("scanCard");
const loadingCard = document.getElementById("loadingCard");
const resultsPanel = document.getElementById("resultsPanel");
const errorCard = document.getElementById("errorCard");
const scanAgainBtn = document.getElementById("scanAgainBtn");
const retryBtn = document.getElementById("retryBtn");

// Results
const plantName = document.getElementById("plantName");
const commonName = document.getElementById("commonName");
const healthBadge = document.getElementById("healthBadge");
const healthScoreNum = document.getElementById("healthScoreNum");
const healthBarFill = document.getElementById("healthBarFill");
const issuesList = document.getElementById("issuesList");
const issuesCard = document.getElementById("issuesCard");
const careList = document.getElementById("careList");
const funFact = document.getElementById("funFact");
const factCard = document.getElementById("factCard");
const errorTitle = document.getElementById("errorTitle");
const errorMsg = document.getElementById("errorMsg");

// Loading steps
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

// ── Init ───────────────────────────────────────────────────
function init() {
  if (!apiKey) {
    showModal();
  }
  renderHistory();
  hideSidebar();
}

// ── API Key Modal ──────────────────────────────────────────
function showModal() {
  apiKeyModal.classList.remove("hidden");
  apiKeyInput.value = apiKey || "";
}
function hideModal() {
  apiKeyModal.classList.add("hidden");
}

saveApiKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    apiKeyInput.style.borderColor = "var(--danger)";
    return;
  }
  apiKeyInput.style.borderColor = "";
  apiKey = key;
  localStorage.setItem(API_KEY_KEY, apiKey);
  hideModal();
});

apiKeyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveApiKeyBtn.click();
});

toggleKeyBtn.addEventListener("click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  toggleKeyBtn.textContent = isPassword ? "🙈" : "👁";
});

changeKeyBtn.addEventListener("click", showModal);

// ── Sidebar ────────────────────────────────────────────────
function showSidebarPanel() {
  sidebarOpen = true;
  historySidebar.classList.remove("sidebar-hidden");
}
function hideSidebar() {
  sidebarOpen = false;
  historySidebar.classList.add("sidebar-hidden");
}

historyToggle.addEventListener("click", () => {
  sidebarOpen ? hideSidebar() : showSidebarPanel();
});
closeSidebar.addEventListener("click", hideSidebar);

clearHistBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

// ── File Upload ────────────────────────────────────────────
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragover"),
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) handleImageFile(file);
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) handleImageFile(file);
});

function handleImageFile(file) {
  stopCamera();
  currentImageMime = file.type || "image/jpeg";
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    currentImageBase64 = dataUrl.split(",")[1];
    showPreview(dataUrl);
    enableAnalyze();
  };
  reader.readAsDataURL(file);
}

function showPreview(src) {
  dropZoneInner.classList.add("hidden");
  cameraViewfinder.classList.add("hidden");
  previewImg.src = src;
  previewImg.classList.remove("hidden");
}

function enableAnalyze() {
  analyzeBtn.disabled = false;
}
function disableAnalyze() {
  analyzeBtn.disabled = true;
}

// ── Camera ─────────────────────────────────────────────────
cameraBtn.addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showError(
      "Camera Not Supported",
      "Your browser does not support camera access. Please upload an image instead.",
    );
    return;
  }
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    cameraFeed.srcObject = currentStream;
    dropZoneInner.classList.add("hidden");
    previewImg.classList.add("hidden");
    cameraViewfinder.classList.remove("hidden");
    disableAnalyze();
  } catch (err) {
    showError(
      "Camera Access Denied",
      "Please allow camera access in your browser settings, or upload an image instead.",
    );
  }
});

cancelCameraBtn.addEventListener("click", () => {
  stopCamera();
  resetDropZone();
});

captureBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = cameraFeed.videoWidth || 640;
  canvas.height = cameraFeed.videoHeight || 480;
  canvas.getContext("2d").drawImage(cameraFeed, 0, 0);
  currentImageMime = "image/jpeg";
  currentImageBase64 = canvas.toDataURL("image/jpeg", 0.92).split(",")[1];
  stopCamera();
  showPreview(canvas.toDataURL("image/jpeg", 0.92));
  enableAnalyze();
});

function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach((t) => t.stop());
    currentStream = null;
  }
  cameraFeed.srcObject = null;
}

// ── Reset ──────────────────────────────────────────────────
function resetDropZone() {
  currentImageBase64 = null;
  previewImg.classList.add("hidden");
  previewImg.src = "";
  cameraViewfinder.classList.add("hidden");
  dropZoneInner.classList.remove("hidden");
  fileInput.value = "";
  disableAnalyze();
}

function resetAll() {
  resetDropZone();
  showSection("scan");
}

scanAgainBtn.addEventListener("click", resetAll);
retryBtn.addEventListener("click", resetAll);

// ── Section visibility ─────────────────────────────────────
function showSection(section) {
  scanCard.classList.add("hidden");
  loadingCard.classList.add("hidden");
  resultsPanel.classList.add("hidden");
  errorCard.classList.add("hidden");

  if (section === "scan") scanCard.classList.remove("hidden");
  if (section === "loading") loadingCard.classList.remove("hidden");
  if (section === "results") resultsPanel.classList.remove("hidden");
  if (section === "error") errorCard.classList.remove("hidden");
}

function showError(title, msg) {
  errorTitle.textContent = title;
  errorMsg.textContent = msg;
  showSection("error");
}

// ── Loading Steps Animation ────────────────────────────────
function setStep(n) {
  [step1, step2, step3].forEach((s, i) => {
    s.classList.remove("active", "done");
    if (i < n - 1) s.classList.add("done");
    if (i === n - 1) s.classList.add("active");
  });
}

// ── Gemini API Call ────────────────────────────────────────
analyzeBtn.addEventListener("click", analyzePlant);

async function analyzePlant() {
  if (!currentImageBase64) return;
  if (!apiKey) {
    showModal();
    return;
  }

  // UI → Loading
  stopCamera();
  showSection("loading");
  setStep(1);

  const stepTimer1 = setTimeout(() => setStep(2), 1500);
  const stepTimer2 = setTimeout(() => setStep(3), 3000);

  const prompt = `You are an expert botanist and plant pathologist. Analyze this plant image and respond ONLY with a valid JSON object (no markdown, no code fences, no extra text) in exactly this format:
{
  "plantName": "Scientific name (Genus species)",
  "commonName": "Common name(s)",
  "healthScore": <integer 0-100>,
  "status": "<one of: Healthy, Moderate, Critical>",
  "issues": ["Issue 1", "Issue 2"],
  "careRecommendations": ["Tip 1", "Tip 2", "Tip 3"],
  "funFact": "An interesting fact about this plant."
}

Rules:
- healthScore: 80-100 = Healthy, 50-79 = Moderate, 0-49 = Critical
- status must match the healthScore range
- If no issues are detected, set issues to []
- If the image does not contain a plant, set plantName to "Not a Plant", commonName to "N/A", healthScore to 0, status to "Critical", issues to ["No plant detected in image"], careRecommendations to [], funFact to "Try again with a clear photo of a plant."
- Be specific about diseases, pests, or stress symptoms observed
- Provide actionable care recommendations`;

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: currentImageMime,
                    data: currentImageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    clearTimeout(stepTimer1);
    clearTimeout(stepTimer2);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `API error ${response.status}`;
      if (response.status === 400 && errMsg.toLowerCase().includes("api key")) {
        showError(
          "Invalid API Key",
          'Your Gemini API key appears to be invalid. Click "API Key" in the header to update it.',
        );
      } else if (response.status === 403) {
        showError(
          "API Key Unauthorized",
          "Your API key does not have access to Gemini 2.5. Please check your key permissions at Google AI Studio.",
        );
      } else {
        showError("API Error", errMsg);
      }
      return;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      showError(
        "Empty Response",
        "Gemini returned no content. Please try again with a different image.",
      );
      return;
    }

    // Parse JSON — strip any accidental code fences
    const jsonStr = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();
    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      // Try to extract JSON from text
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        showError(
          "Parse Error",
          "Could not parse the AI response. Please try again.",
        );
        return;
      }
    }

    // Save to history BEFORE showing results
    saveToHistory(result);

    displayResults(result);
    showSection("results");
  } catch (err) {
    clearTimeout(stepTimer1);
    clearTimeout(stepTimer2);
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      showError(
        "Network Error",
        "Could not reach the Gemini API. Check your internet connection and try again.",
      );
    } else {
      showError(
        "Unexpected Error",
        err.message || "An unknown error occurred.",
      );
    }
  }
}

// ── Display Results ────────────────────────────────────────
function displayResults(result) {
  // Name
  plantName.textContent = result.plantName || "Unknown Plant";
  commonName.textContent = result.commonName || "";

  // Health
  const score = Math.max(0, Math.min(100, result.healthScore || 0));
  const status = (result.status || "Moderate")
    .toLowerCase()
    .replace(/\s+/g, "");

  healthScoreNum.textContent = `${score}/100`;
  healthBadge.textContent = result.status || "Unknown";
  healthBadge.className = "health-badge";
  if (status === "healthy") healthBadge.classList.add("healthy");
  else if (status === "critical") healthBadge.classList.add("critical");
  else healthBadge.classList.add("moderate");

  // Color the health bar
  const barColor =
    status === "healthy"
      ? "linear-gradient(90deg, #16a34a, #22c55e, #4ade80)"
      : status === "critical"
        ? "linear-gradient(90deg, #b91c1c, #ef4444, #f87171)"
        : "linear-gradient(90deg, #b45309, #f59e0b, #fcd34d)";
  healthBarFill.style.background = barColor;
  // Animate bar after short delay
  healthBarFill.style.width = "0%";
  setTimeout(() => {
    healthBarFill.style.width = score + "%";
  }, 100);

  // Issues
  issuesList.innerHTML = "";
  if (result.issues && result.issues.length > 0) {
    issuesCard.classList.remove("hidden");
    result.issues.forEach((issue) => {
      const li = document.createElement("li");
      li.textContent = issue;
      issuesList.appendChild(li);
    });
  } else {
    issuesCard.classList.add("hidden");
  }

  // Care
  careList.innerHTML = "";
  if (result.careRecommendations && result.careRecommendations.length > 0) {
    result.careRecommendations.forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      careList.appendChild(li);
    });
  }

  // Fun fact
  if (result.funFact) {
    factCard.classList.remove("hidden");
    funFact.textContent = result.funFact;
  } else {
    factCard.classList.add("hidden");
  }
}

// ── History ────────────────────────────────────────────────
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveToHistory(result) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    plantName: result.plantName,
    commonName: result.commonName,
    status: result.status,
    healthScore: result.healthScore,
    thumbnail: currentImageBase64
      ? `data:${currentImageMime};base64,${currentImageBase64.substring(0, 200)}`
      : null,
    thumbnailFull: currentImageBase64
      ? `data:${currentImageMime};base64,${currentImageBase64}`
      : null,
    timestamp: new Date().toLocaleString(),
    result: result,
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.splice(MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML =
      '<p class="empty-state">No scans yet. Scan your first plant!</p>';
    return;
  }

  history.forEach((entry) => {
    const statusColors = {
      Healthy: "var(--healthy-color)",
      Moderate: "var(--moderate-color)",
      Critical: "var(--critical-color)",
    };
    const dotColor = statusColors[entry.status] || "var(--text-muted)";

    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      ${
        entry.thumbnailFull
          ? `<img class="history-thumb" src="${entry.thumbnailFull}" alt="${entry.plantName}" />`
          : `<div class="history-thumb" style="background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;font-size:1.3rem;">🌱</div>`
      }
      <div class="history-info">
        <div class="history-name">${entry.plantName}</div>
        <div class="history-status">${entry.status || ""} · ${entry.healthScore}/100</div>
      </div>
      <div class="history-dot" style="background:${dotColor}"></div>
    `;
    item.addEventListener("click", () => {
      displayResults(entry.result);
      showSection("results");
      if (entry.thumbnailFull) {
        currentImageBase64 = entry.thumbnailFull.split(",")[1];
        currentImageMime = entry.thumbnailFull.startsWith("data:image/png")
          ? "image/png"
          : "image/jpeg";
      }
      if (window.innerWidth <= 900) hideSidebar();
    });
    historyList.appendChild(item);
  });
}

// ── Start ──────────────────────────────────────────────────
init();
