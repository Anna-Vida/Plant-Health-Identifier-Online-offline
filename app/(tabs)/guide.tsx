import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';

const CROP_ALERTS = [
  {
    crop: 'Rice',
    sign: 'Brown lesions, yellow halos, drying tips',
    action: 'Check lower canopy, standing water management, and clustering across paddies.',
    icon: 'water-outline' as const,
  },
  {
    crop: 'Corn',
    sign: 'Leaf blight streaks, rust pustules, uneven yellowing',
    action: 'Inspect row spread and compare lower leaves with upper leaves before spraying.',
    icon: 'nutrition-outline' as const,
  },
  {
    crop: 'Tomato',
    sign: 'Leaf spots, curling, wilting, stem lesions',
    action: 'Check both fungal spotting and insect-vectored disease around nearby plants.',
    icon: 'bug-outline' as const,
  },
  {
    crop: 'Cabbage',
    sign: 'V-shaped yellowing, black veins, soft rot smell',
    action: 'Remove heavily infected plants, avoid overhead irrigation, and sanitize tools.',
    icon: 'leaf-outline' as const,
  },
  {
    crop: 'Chili and Eggplant',
    sign: 'Mosaic, curling, bronzing, fruit lesions',
    action: 'Look for mites, aphids, and virus patterns before applying fungicide.',
    icon: 'flame-outline' as const,
  },
];

const RESPONSE_STEPS = [
  'Scout a small radius first, then expand if the same symptom repeats in nearby rows.',
  'Separate weather injury, nutrient stress, pest damage, and disease before choosing treatment.',
  'Record the date, area, crop stage, and irrigation condition when symptoms appear.',
  'Use the scan result as a first pass, then confirm with local extension guidance if damage is severe.',
];

const PHOTO_GUIDE = [
  'Take one close photo of the worst lesion.',
  'Take one mid-range photo showing several leaves.',
  'Take one whole-plant or whole-row photo for pattern recognition.',
  'Avoid glare, muddy blur, and heavy shadows over the symptom area.',
];

const QUICK_CHECKS = [
  { label: 'Spots with halos', note: 'Often fungal/bacterial. Check if expanding after rain/dew.' },
  { label: 'Powdery growth', note: 'Usually fungal. Look at leaf underside and shaded areas.' },
  { label: 'Chewed edges / holes', note: 'Pests. Search for larvae, eggs, frass.' },
  { label: 'Yellowing between veins', note: 'Nutrient or root stress. Compare old vs new leaves.' },
];

export default function GuideScreen() {
  return (
    <Screen scroll>
      <Card style={styles.hero}>
        <View style={styles.heroAccentOne} />
        <View style={styles.heroAccentTwo} />
        <Text style={styles.eyebrow}>Field Guide</Text>
        <Text style={styles.title}>Disease signs farmers should watch</Text>
        <Text style={styles.subtitle}>
          Use this guide to capture better crop photos, read the scanner output faster, and respond
          before disease pressure spreads across the block.
        </Text>
        <View style={styles.heroChips}>
          <View style={styles.heroChip}>
            <Ionicons name="scan-outline" size={14} color="#F7E9C7" />
            <Text style={styles.heroChipText}>Photo-ready tips</Text>
          </View>
          <View style={styles.heroChip}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#F7E9C7" />
            <Text style={styles.heroChipText}>Field-safe advice</Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Ionicons name="flash-outline" size={16} color="#234732" />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>Quick checks</Text>
            <Text style={styles.sectionHint}>Fast ways to separate pest, disease, and stress.</Text>
          </View>
        </View>
        {QUICK_CHECKS.map((item) => (
          <View key={item.label} style={styles.quickRow}>
            <View style={styles.quickBadge}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#2B4C3A" />
            </View>
            <View style={styles.quickCopy}>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickNote}>{item.note}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Ionicons name="leaf-outline" size={16} color="#234732" />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>Crop alert cards</Text>
            <Text style={styles.sectionHint}>Symptoms with the fastest spread risk.</Text>
          </View>
        </View>
        {CROP_ALERTS.map((item) => (
          <View key={item.crop} style={styles.alertCard}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={18} color="#234732" />
            </View>
            <View style={styles.alertCopy}>
              <Text style={styles.cardTitle}>{item.crop}</Text>
              <Text style={styles.bodyText}>{item.sign}</Text>
              <Text style={styles.actionText}>{item.action}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Ionicons name="flag-outline" size={16} color="#234732" />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>First response in the field</Text>
            <Text style={styles.sectionHint}>Do this before you spray or remove plants.</Text>
          </View>
        </View>
        {RESPONSE_STEPS.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.bodyText}>{step}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Ionicons name="camera-outline" size={16} color="#234732" />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>Photo sequence for better scans</Text>
            <Text style={styles.sectionHint}>Capture this set to improve accuracy.</Text>
          </View>
        </View>
        {PHOTO_GUIDE.map((tip) => (
          <View key={tip} style={styles.tipRow}>
            <Ionicons name="camera-outline" size={18} color="#7B5A24" />
            <Text style={styles.bodyText}>{tip}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.warningCard}>
        <Ionicons name="warning-outline" size={18} color="#842F1D" />
        <Text style={styles.warningText}>
          If the scan shows high urgency and high spread risk, isolate affected plants where
          possible, avoid moving through wet foliage, and verify the problem before broad chemical
          application.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#5A4527',
    borderColor: '#5A4527',
    overflow: 'hidden',
    gap: 12,
  },
  heroAccentOne: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#7A5A32',
    opacity: 0.5,
  },
  heroAccentTwo: {
    position: 'absolute',
    bottom: -50,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6D5231',
    opacity: 0.28,
  },
  eyebrow: {
    color: '#F7E9C7',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFF7E8',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: '#EADCC0',
    fontSize: 14,
    lineHeight: 21,
  },
  heroChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroChipText: {
    color: '#F7E9C7',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#E6ECDC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: {
    flex: 1,
  },
  sectionTitle: {
    color: '#223626',
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '800',
  },
  sectionHint: {
    color: '#5B6B59',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F3EFE4',
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5DED2',
  },
  quickBadge: {
    width: 28,
    height: 28,
    borderRadius: 12,
    backgroundColor: '#DFE8D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCopy: {
    flex: 1,
    gap: 4,
  },
  quickLabel: {
    color: '#243527',
    fontSize: 14,
    fontWeight: '800',
  },
  quickNote: {
    color: '#586455',
    fontSize: 13,
    lineHeight: 18,
  },
  alertCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: '#F3EFE4',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5DED2',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DFE8D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: '#243527',
    fontSize: 16,
    fontWeight: '800',
  },
  bodyText: {
    color: '#586455',
    fontSize: 14,
    lineHeight: 21,
  },
  actionText: {
    color: '#7B5A24',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 2,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE3D7',
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#234732',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepBadgeText: {
    color: '#F7F0E0',
    fontSize: 13,
    fontWeight: '800',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  warningCard: {
    backgroundColor: '#F2D8CF',
    flexDirection: 'row',
    gap: 10,
    borderColor: '#E7BEB5',
  },
  warningText: {
    flex: 1,
    color: '#842F1D',
    fontSize: 13,
    lineHeight: 19,
  },
});
