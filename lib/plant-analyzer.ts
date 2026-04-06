export type PlantAnalysis = {
  cropType: string;
  plantName: string;
  diseaseName: string;
  healthStatus: string;
  confidence: number;
  likelyIssue: string;
  summary: string;
  urgency: 'Low' | 'Medium' | 'High';
  spreadRisk: 'Low' | 'Moderate' | 'High';
  careSteps: string[];
  preventionTips: string[];
  fieldActions: string[];
  scoutingChecks: string[];
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

export const GEMINI_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey(): string {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to a .env file to enable disease analysis.'
    );
  }

  return apiKey;
}

function getMimeType(uri: string): string {
  const normalizedUri = uri.toLowerCase();

  if (normalizedUri.endsWith('.png')) {
    return 'image/png';
  }

  if (normalizedUri.endsWith('.webp')) {
    return 'image/webp';
  }

  return 'image/jpeg';
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : fallback;
}

function normalizeArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 4);

  return items.length > 0 ? items : fallback;
}

function normalizeUrgency(value: unknown): PlantAnalysis['urgency'] {
  if (value === 'Low' || value === 'Medium' || value === 'High') {
    return value;
  }

  return 'Medium';
}

function normalizeSpreadRisk(value: unknown): PlantAnalysis['spreadRisk'] {
  if (value === 'Low' || value === 'Moderate' || value === 'High') {
    return value;
  }

  return 'Moderate';
}

function normalizeConfidence(value: unknown): number {
  const confidence = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(confidence)) {
    return 0.6;
  }

  return Math.max(0.2, Math.min(0.99, confidence));
}

function stripCodeFence(value: string): string {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function parseStructuredResponse(rawText: string): Record<string, unknown> | null {
  const cleanText = stripCodeFence(rawText);
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizeResponse(
  structuredResponse: Record<string, unknown> | null,
  rawText: string
): PlantAnalysis {
  const fallbackSummary =
    stripCodeFence(rawText) || 'Analysis returned, but it was not structured clearly.';
  const likelyIssue = normalizeText(
    structuredResponse?.likelyIssue,
    normalizeText(structuredResponse?.diseaseName, 'Unknown disease or crop stress')
  );

  return {
    cropType: normalizeText(structuredResponse?.cropType, 'Crop not identified'),
    plantName: normalizeText(structuredResponse?.plantName, 'Plant not identified'),
    diseaseName: normalizeText(structuredResponse?.diseaseName, likelyIssue),
    healthStatus: normalizeText(structuredResponse?.healthStatus, 'Needs attention'),
    confidence: normalizeConfidence(structuredResponse?.confidence),
    likelyIssue,
    summary: normalizeText(structuredResponse?.summary, fallbackSummary),
    urgency: normalizeUrgency(structuredResponse?.urgency),
    spreadRisk: normalizeSpreadRisk(structuredResponse?.spreadRisk),
    careSteps: normalizeArray(structuredResponse?.careSteps, [
      'Isolate or mark affected plants before symptoms spread further.',
      'Inspect leaf undersides, stems, and nearby rows for similar lesions.',
      'Adjust watering to keep foliage dry during late afternoon and evening.',
    ]),
    preventionTips: normalizeArray(structuredResponse?.preventionTips, [
      'Improve spacing and airflow to reduce leaf wetness.',
      'Rotate crops and remove infected residue after harvest.',
      'Disinfect tools and avoid moving through wet plants unnecessarily.',
    ]),
    fieldActions: normalizeArray(structuredResponse?.fieldActions, [
      'Scout the next 5 to 10 surrounding plants for the same symptoms.',
      'Separate severely affected material from healthy crop blocks if possible.',
      'Record the affected area before deciding on treatment.',
    ]),
    scoutingChecks: normalizeArray(structuredResponse?.scoutingChecks, [
      'Check whether symptoms are limited to older leaves or new growth.',
      'Look for insect presence, eggs, webbing, or frass around the lesion.',
      'Note if symptoms are clustered in wet or shaded sections of the field.',
    ]),
  };
}

async function uriToBase64(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;

        if (typeof result !== 'string') {
          reject(new Error('Unable to read the selected image.'));
          return;
        }

        const [, base64 = ''] = result.split(',');
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Unable to convert the selected image.'));
      reader.readAsDataURL(request.response);
    };
    request.onerror = () => reject(new Error('Unable to load the selected image.'));
    request.open('GET', uri);
    request.responseType = 'blob';
    request.send();
  });
}

export async function analyzePlantImage(imageUri: string): Promise<PlantAnalysis> {
  const imageBase64 = await uriToBase64(imageUri);
  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${getApiKey()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: [
                  'You are an agricultural crop disease assistant for farmers.',
                  'Look at the crop photo and estimate the crop type, plant identity, visible disease or stress, spread risk, and first field actions.',
                  'Return one JSON object with these keys only:',
                  'cropType, plantName, diseaseName, healthStatus, confidence, likelyIssue, summary, urgency, spreadRisk, careSteps, preventionTips, fieldActions, scoutingChecks.',
                  'healthStatus should be one of: Healthy, Watch closely, Needs attention.',
                  'urgency should be one of: Low, Medium, High.',
                  'spreadRisk should be one of: Low, Moderate, High.',
                  'confidence must be a number between 0 and 1.',
                  'careSteps, preventionTips, fieldActions, and scoutingChecks must each be arrays of 2 to 4 short strings.',
                  'Keep summary under 55 words.',
                  'If uncertain, say that the diagnosis is provisional and avoid overclaiming.',
                  'Respond with valid JSON only and no markdown code fences.',
                ].join(' '),
              },
              {
                inlineData: {
                  mimeType: getMimeType(imageUri),
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Analysis request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const rawText =
    payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('\n')
      .trim() ?? '';

  if (!rawText) {
    throw new Error('The analysis service returned an empty response.');
  }

  return normalizeResponse(parseStructuredResponse(rawText), rawText);
}
