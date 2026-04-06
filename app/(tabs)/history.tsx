import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clearScanHistory, listScanHistory, type ScanHistoryItem } from '@/lib/scan-history';

function formatWhen(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return 'Unknown time';
  }
}

export default function HistoryScreen() {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [selected, setSelected] = useState<ScanHistoryItem | null>(null);

  const load = useCallback(async () => {
    const next = await listScanHistory();
    setItems(next);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const isEmpty = items.length === 0;

  return (
    <Screen scroll>
      <Card style={styles.topCard}>
        <View style={styles.topRow}>
          <View style={styles.topIcon}>
            <Ionicons name="time-outline" size={18} color="#234732" />
          </View>
          <View style={styles.topCopy}>
            <Text style={styles.topTitle}>Scan history</Text>
            <Text style={styles.topBody}>
              {isEmpty ? 'No scans saved yet.' : `${items.length} saved scan${items.length === 1 ? '' : 's'}.`}
            </Text>
          </View>
          <Button
            label="Refresh"
            icon="refresh-outline"
            variant="secondary"
            onPress={load}
            style={styles.refreshBtn}
          />
        </View>
      </Card>

      {isEmpty ? (
        <Card>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyBody}>
            Run a scan from the Scanner tab — we’ll save the result here automatically.
          </Text>
        </Card>
      ) : (
        <>
          {selected ? (
            <Card style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>{selected.analysis.diseaseName}</Text>
                <Text style={styles.detailWhen}>{formatWhen(selected.createdAt)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Image source={{ uri: selected.imageUri }} style={styles.thumbLarge} />
                <View style={styles.detailCopy}>
                  <View style={styles.pills}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{selected.analysis.urgency} urgency</Text>
                    </View>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{selected.analysis.spreadRisk} spread</Text>
                    </View>
                  </View>
                  <Text style={styles.detailSummary}>{selected.analysis.summary}</Text>
                  <Text style={styles.detailMeta}>
                    Crop: {selected.analysis.cropType} • Confidence: {Math.round(selected.analysis.confidence * 100)}%
                  </Text>
                </View>
              </View>
              <Button
                label="Close"
                icon="close-outline"
                variant="secondary"
                onPress={() => setSelected(null)}
              />
            </Card>
          ) : null}

          <Card>
            <Text style={styles.sectionTitle}>Saved scans</Text>
            {items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setSelected(item)}
                style={({ pressed }) => [styles.itemRow, pressed && styles.itemPressed]}>
                <Image source={{ uri: item.imageUri }} style={styles.thumb} />
                <View style={styles.itemCopy}>
                  <Text numberOfLines={1} style={styles.itemTitle}>
                    {item.analysis.diseaseName}
                  </Text>
                  <Text numberOfLines={2} style={styles.itemSubtitle}>
                    {item.analysis.summary}
                  </Text>
                  <Text style={styles.itemMeta}>{formatWhen(item.createdAt)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#6D7A6F" />
              </Pressable>
            ))}
          </Card>

          <Card>
            <Button
              label="Clear history"
              icon="trash-outline"
              variant="secondary"
              onPress={async () => {
                await clearScanHistory();
                setSelected(null);
                await load();
              }}
            />
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topCard: {
    backgroundColor: '#FAF5EA',
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  topIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#E8EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCopy: {
    flex: 1,
    gap: 2,
  },
  topTitle: {
    color: '#223626',
    fontSize: 16,
    fontWeight: '800',
  },
  topBody: {
    color: '#5B6B59',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  refreshBtn: {
    minHeight: 44,
  },
  sectionTitle: {
    color: '#223626',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#223626',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyBody: {
    color: '#5B6B59',
    fontSize: 13,
    lineHeight: 18,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5DED2',
  },
  itemPressed: {
    opacity: 0.75,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#D8E0D1',
  },
  itemCopy: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    color: '#223626',
    fontSize: 14,
    fontWeight: '800',
  },
  itemSubtitle: {
    color: '#5B6B59',
    fontSize: 12,
    lineHeight: 16,
  },
  itemMeta: {
    color: '#7E5C2E',
    fontSize: 11,
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: '#1E2F25',
    borderColor: '#1E2F25',
  },
  detailHeader: {
    marginBottom: 12,
    gap: 4,
  },
  detailTitle: {
    color: '#FAF4E7',
    fontSize: 18,
    fontWeight: '800',
  },
  detailWhen: {
    color: '#B6C5B5',
    fontSize: 12,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  thumbLarge: {
    width: 88,
    height: 110,
    borderRadius: 18,
    backgroundColor: '#2D4334',
  },
  detailCopy: {
    flex: 1,
    gap: 10,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#2D4334',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    color: '#DDE8D7',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailSummary: {
    color: '#EDF3E5',
    fontSize: 13,
    lineHeight: 18,
  },
  detailMeta: {
    color: '#B6C5B5',
    fontSize: 12,
    fontWeight: '700',
  },
});

