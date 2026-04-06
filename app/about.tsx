import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';

const WHAT_IT_DOES = [
  'Scan a crop photo (camera or gallery) and estimate likely disease or stress.',
  'Return urgency + spread risk + first field actions as structured guidance.',
  'Provide a field guide for better photo capture and faster scouting decisions.',
];

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, header: () => <AppHeader title="About" showBack /> }} />
      <Screen scroll>
        <Card>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons name="leaf-outline" size={18} color="#234732" />
            </View>
            <View style={styles.brandCopy}>
              <Text style={styles.title}>LeafLab</Text>
              <Text style={styles.subtitle}>Plant Disease Identification Tool</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>What this app does</Text>
          {WHAT_IT_DOES.map((line) => (
            <View key={line} style={styles.row}>
              <Text style={styles.bullet}>-</Text>
              <Text style={styles.body}>{line}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.warning}>
          <Text style={styles.sectionTitle}>Important</Text>
          <Text style={styles.body}>
            Image-based diagnosis can be wrong. Use the scan as a first pass, then confirm with local
            extension guidance if damage is severe.
          </Text>
        </Card>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#E8EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#223626',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#5B6B59',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#223626',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#7E5C2E',
    fontSize: 16,
    lineHeight: 20,
  },
  body: {
    flex: 1,
    color: '#536252',
    fontSize: 14,
    lineHeight: 20,
  },
  warning: {
    backgroundColor: '#F4D6CF',
    borderColor: '#E7BEB5',
  },
});

