import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HomeTab() {
  return (
    <Screen scroll>
      <Card style={styles.hero}>
        <View style={styles.heroAccentOne} />
        <View style={styles.heroAccentTwo} />
        <View style={styles.heroRow}>
          <View style={styles.logoWrap}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Field intelligence</Text>
            <Text style={styles.title}>LeafLab</Text>
            <Text style={styles.subtitle}>
              Pro-grade crop scanning with structured risk and action guidance you can share in minutes.
            </Text>
          </View>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.statChip}>
            <Ionicons name="time-outline" size={16} color="#F0E8DA" />
            <Text style={styles.statChipText}>2-3 min scan</Text>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#F0E8DA" />
            <Text style={styles.statChipText}>Decision-ready</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Ready to scan?</Text>
        <Text style={styles.sectionIntro}>Use the leaf button in the center tab bar to open the scanner.</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <Text style={styles.sectionIntro}>Jump back into the tools farmers use most.</Text>
        <View style={styles.actionGrid}>
          <Pressable style={styles.actionTile} onPress={() => router.push('/(tabs)/scan')}>
            <View style={styles.actionIcon}>
              <Ionicons name="leaf" size={18} color="#234732" />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Scan crop</Text>
              <Text style={styles.actionHint}>Start a new diagnosis</Text>
            </View>
          </Pressable>
          <Pressable style={styles.actionTile} onPress={() => router.push('/(tabs)/chat')}>
            <View style={styles.actionIcon}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#234732" />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Ask AgriChat</Text>
              <Text style={styles.actionHint}>Get field guidance</Text>
            </View>
          </Pressable>
          <Pressable style={styles.actionTile} onPress={() => router.push('/(tabs)/guide')}>
            <View style={styles.actionIcon}>
              <Ionicons name="book-outline" size={18} color="#234732" />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Field guide</Text>
              <Text style={styles.actionHint}>Symptoms and response</Text>
            </View>
          </Pressable>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#173126',
    borderColor: '#173126',
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoWrap: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: '#F5EAD0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E7DDC7',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  heroCopy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    color: '#C9D8C8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F8F3E7',
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: '#D1DBC9',
    fontSize: 13,
    lineHeight: 19,
  },
  heroStats: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  statChipText: {
    color: '#F0E8DA',
    fontSize: 12,
    fontWeight: '700',
  },
  heroAccentOne: {
    position: 'absolute',
    top: -30,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#2B4C3A',
    opacity: 0.45,
  },
  heroAccentTwo: {
    position: 'absolute',
    bottom: -40,
    left: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#3A5B46',
    opacity: 0.25,
  },
  sectionTitle: {
    color: '#223626',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionIntro: {
    color: '#5B6B59',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  actionGrid: {
    gap: 10,
  },
  actionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F3EFE4',
    borderWidth: 1,
    borderColor: '#E5DED2',
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#DFE8D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    color: '#223626',
    fontSize: 14,
    fontWeight: '800',
  },
  actionHint: {
    color: '#6B7768',
    fontSize: 12,
    lineHeight: 16,
  },
});

