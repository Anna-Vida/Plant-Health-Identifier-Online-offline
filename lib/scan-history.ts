import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PlantAnalysis } from '@/lib/plant-analyzer';

export type ScanHistoryItem = {
  id: string;
  createdAt: number;
  imageUri: string;
  analysis: PlantAnalysis;
};

const STORAGE_KEY = 'leaflab.scanHistory.v1';
const MAX_ITEMS = 50;

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function listScanHistory(): Promise<ScanHistoryItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ScanHistoryItem[];
  } catch {
    return [];
  }
}

export async function saveScanToHistory(
  imageUri: string,
  analysis: PlantAnalysis
): Promise<ScanHistoryItem[]> {
  const existing = await listScanHistory();
  const next: ScanHistoryItem[] = [
    { id: makeId(), createdAt: Date.now(), imageUri, analysis },
    ...existing,
  ].slice(0, MAX_ITEMS);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function clearScanHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

