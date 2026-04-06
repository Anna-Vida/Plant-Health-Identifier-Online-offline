import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function Row({ icon, title, subtitle, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.rowPressed : null]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#234732" />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#6D7A6F" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const currentModel = process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  const hasKey = Boolean(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

  return (
    <Screen scroll>
      <Card style={styles.hero}>
        <Text style={styles.heroTitle}>App settings</Text>
        <Text style={styles.heroBody}>
          Quick view of your current Gemini configuration and useful app links.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Gemini</Text>
        <View style={styles.kv}>
          <Text style={styles.k}>Model</Text>
          <Text style={styles.v}>{currentModel}</Text>
        </View>
        <View style={styles.kv}>
          <Text style={styles.k}>API key</Text>
          <Text style={styles.v}>{hasKey ? 'Configured' : 'Missing (.env)'}</Text>
        </View>
        <Text style={styles.hint}>
          Tip: for production, proxy AI requests through your own backend.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Pages</Text>
        <Row
          icon="information-circle-outline"
          title="About"
          subtitle="What LeafLab does and how to use it"
          onPress={() => router.push('/about')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#FAF5EA',
  },
  heroTitle: {
    color: '#223626',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroBody: {
    color: '#5B6B59',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#223626',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  kv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  k: {
    color: '#5B6B59',
    fontSize: 13,
    fontWeight: '700',
  },
  v: {
    color: '#223626',
    fontSize: 13,
    fontWeight: '800',
  },
  hint: {
    marginTop: 8,
    color: '#7E5C2E',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5DED2',
  },
  rowPressed: {
    opacity: 0.75,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 16,
    backgroundColor: '#E8EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: '#223626',
    fontSize: 14,
    fontWeight: '800',
  },
  rowSubtitle: {
    color: '#5B6B59',
    fontSize: 12,
    lineHeight: 18,
  },
});

