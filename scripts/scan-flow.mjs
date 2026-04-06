import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = path.resolve(process.cwd());

const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
const API_KEY =
  process.env.GEMINI_API_KEY?.trim() ||
  process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() ||
  '';

const OUT_FILE = path.join(PROJECT_ROOT, 'flow-report.md');

const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  '.expo',
  '.idea',
  'dist',
  'build',
  '.next',
  'coverage',
]);

const INCLUDE_EXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.cjs',
  '.mjs',
]);

function nowIso() {
  return new Date().toISOString();
}

function normalizeSlashes(p) {
  return p.replaceAll('\\', '/');
}

function rel(p) {
  return normalizeSlashes(path.relative(PROJECT_ROOT, p));
}

function isProbablyBinary(text) {
  return text.includes('\u0000');
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readText(p, maxChars = 24_000) {
  const raw = await fs.readFile(p, 'utf8');
  if (isProbablyBinary(raw)) return '';
  if (raw.length <= maxChars) return raw;
  return `${raw.slice(0, maxChars)}\n\n/* ... truncated (${raw.length - maxChars} chars) ... */\n`;
}

async function walk(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      results.push(...(await walk(full)));
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!INCLUDE_EXT.has(ext)) continue;
    results.push(full);
  }
  return results;
}

function pickImportant(files) {
  const byRel = new Map(files.map((f) => [rel(f), f]));
  const want = [
    'app/_layout.tsx',
    'app/(tabs)/_layout.tsx',
    'app/(tabs)/index.tsx',
    'app/(tabs)/guide.tsx',
    'lib/plant-analyzer.ts',
    'package.json',
    'app.json',
    'README.md',
    'eslint.config.js',
  ];
  const picked = [];
  for (const w of want) {
    const hit = byRel.get(w);
    if (hit) picked.push(hit);
  }
  return picked;
}

function buildTree(files, limit = 300) {
  const rels = files.map(rel).sort((a, b) => a.localeCompare(b));
  const trimmed = rels.slice(0, limit);
  const more = rels.length > limit ? `\n... plus ${rels.length - limit} more files` : '';
  return trimmed.map((p) => `- ${p}`).join('\n') + more;
}

function localFlowSummary() {
  return [
    '- Entry: `expo-router/entry` → `app/_layout.tsx` Stack → `app/(tabs)`',
    '- Navigation: bottom tabs with `Scanner` (`app/(tabs)/index.tsx`) + `Field Guide` (`app/(tabs)/guide.tsx`)',
    '- Scanner flow: pick/take image → `analyzePlantImage()` (`lib/plant-analyzer.ts`) → Gemini `:generateContent` → normalized JSON → UI cards',
    '- Config: `.env` uses `EXPO_PUBLIC_GEMINI_API_KEY` and optional `EXPO_PUBLIC_GEMINI_MODEL`',
  ].join('\n');
}

function buildPrompt({ tree, importantSnippets, model }) {
  return [
    'You are a senior mobile architect reviewing an Expo Router app.',
    'Goal: describe the app flow and module responsibilities so a new engineer can understand it fast.',
    '',
    'Return Markdown with these sections (in this order):',
    '1) ## App overview (2-4 bullets)',
    '2) ## Navigation map (routes, tabs, stacks)',
    '3) ## Core user flows (step-by-step, include key functions/files)',
    '4) ## Data + API boundaries (what calls what, where secrets are read)',
    '5) ## Risks / improvements (security + reliability, max 8 bullets)',
    '6) ## Suggested “next refactor” plan (3-6 bullets, practical)',
    '',
    `Model you are running on: ${model}.`,
    '',
    '### Repo tree (partial)',
    tree,
    '',
    '### Key files (snippets)',
    importantSnippets,
  ].join('\n');
}

async function callGemini({ apiKey, model, prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
      },
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `Gemini request failed (${res.status})`);
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts
      ?.map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .join('\n')
      .trim() || '';

  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

async function main() {
  const files = await walk(PROJECT_ROOT);
  const tree = buildTree(files);
  const important = pickImportant(files);

  const snippets = [];
  for (const f of important) {
    const content = await readText(f);
    snippets.push(`\n#### ${rel(f)}\n\n\`\`\`\n${content}\n\`\`\`\n`);
  }
  const importantSnippets = snippets.join('\n');

  const header = [
    '# App flow report',
    '',
    `Generated: ${nowIso()}`,
    `Project: \`${path.basename(PROJECT_ROOT)}\``,
    '',
    '## Local, deterministic summary',
    localFlowSummary(),
    '',
    '---',
    '',
  ].join('\n');

  let llmSection = [
    '## Gemini-assisted analysis',
    '',
    '- Status: skipped (no API key found).',
    '- To enable: set `GEMINI_API_KEY` (recommended) or `EXPO_PUBLIC_GEMINI_API_KEY`, then re-run.',
    '',
  ].join('\n');

  if (API_KEY) {
    const prompt = buildPrompt({ tree, importantSnippets, model: DEFAULT_MODEL });
    const analysis = await callGemini({ apiKey: API_KEY, model: DEFAULT_MODEL, prompt });
    llmSection = ['## Gemini-assisted analysis', '', analysis.trim(), ''].join('\n');
  }

  const out = header + llmSection;
  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, out, 'utf8');

  process.stdout.write(`Wrote ${rel(OUT_FILE)}\n`);
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  process.stdout.write(
    [
      'scan-flow: generate a markdown app-flow report.',
      '',
      'Usage:',
      '  npm run scan:flow',
      '',
      'Env:',
      '  GEMINI_API_KEY   (recommended; not exposed to Expo client)',
      '  GEMINI_MODEL     (optional; default gemini-2.0-flash)',
      '  EXPO_PUBLIC_GEMINI_API_KEY (fallback; if already set for the app)',
      '',
    ].join('\n')
  );
  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(String(err?.message || err) + '\n');
  process.exit(1);
});

