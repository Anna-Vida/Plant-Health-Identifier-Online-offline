export type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
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

const GEMINI_MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey(): string {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to a .env file to enable chat.');
  }

  return apiKey;
}

function toGeminiRole(role: ChatMessage['role']): 'user' | 'model' {
  return role === 'assistant' ? 'model' : 'user';
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${getApiKey()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map((message) => ({
          role: toGeminiRole(message.role),
          parts: [{ text: message.text }],
        })),
        systemInstruction: {
          parts: [
            {
              text: [
                'You are AgriChat, a practical crop health assistant for farmers.',
                'Focus on crop, soil, irrigation, pests, and disease in plants.',
                'Do not provide human or animal medical advice.',
                'Keep answers concise, action-oriented, and safe for field use.',
                'If unsure, recommend checking with local agronomy support.',
              ].join(' '),
            },
          ],
        },
        generationConfig: {
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Chat request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const text =
    payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('\n')
      .trim() ?? '';

  if (!text) {
    throw new Error('The chat service returned an empty response.');
  }

  return text;
}
