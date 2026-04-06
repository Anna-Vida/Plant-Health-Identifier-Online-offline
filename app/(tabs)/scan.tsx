import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { analyzePlantImage, type PlantAnalysis } from '@/lib/plant-analyzer';
import { saveScanToHistory } from '@/lib/scan-history';

const HAS_API_KEY = Boolean(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

const URGENCY_COLORS: Record<PlantAnalysis['urgency'], string> = {
  Low: '#2D6A3C',
  Medium: '#B2771A',
  High: '#A63F2D',
};

const SPREAD_RISK_COLORS: Record<PlantAnalysis['spreadRisk'], string> = {
  Low: '#2D6A3C',
  Moderate: '#AF7A1E',
  High: '#A63F2D',
};

export default function ScanScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function setImage(uri: string) {
    setSelectedImage(uri);
    setAnalysis(null);
    setErrorMessage(null);
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow gallery access so you can upload a crop photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Allow camera access so you can scan crop symptoms.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  }

  async function analyzeImage() {
    if (!selectedImage || isAnalyzing) {
      return;
    }

    if (!HAS_API_KEY) {
      setErrorMessage(
        'Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to a .env file, restart Metro, and reload Expo Go.'
      );
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await analyzePlantImage(selectedImage);
      setAnalysis(result);
      await saveScanToHistory(selectedImage, result);
    } catch (error) {
      setAnalysis(null);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to analyze this crop image right now.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Screen scroll>
      <Card style={styles.hero}>
        <Text style={styles.heroTitle}>Crop scanner</Text>
        <Text style={styles.heroSubtitle}>
          1) Capture a clear photo  2) Review the preview  3) Run scan
        </Text>

        <View style={styles.buttonRow}>
          <Button label="Camera" icon="scan-outline" onPress={takePhoto} />
          <Button label="Upload" icon="images-outline" variant="secondary" onPress={pickImage} />
        </View>
      </Card>

      <Card>
        {selectedImage ? (
          <>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Preview</Text>
              <Text
                onPress={() => {
                  setSelectedImage(null);
                  setAnalysis(null);
                  setErrorMessage(null);
                }}
                style={styles.clearText}>
                Clear
              </Text>
            </View>
            <View style={styles.previewFrame}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>
          </>
        ) : (
          <View style={styles.emptyPreview}>
            <Ionicons name="camera-reverse-outline" size={34} color="#6F846C" />
            <Text style={styles.emptyTitle}>No image selected</Text>
            <Text style={styles.emptyCopy}>Use Camera or Upload to start.</Text>
          </View>
        )}

        <View style={styles.analyzeRow}>
          <Button
            label={isAnalyzing ? 'Scanning...' : 'Run scan'}
            icon="flask-outline"
            disabled={!selectedImage || isAnalyzing}
            onPress={analyzeImage}
            style={styles.analyzeButton}
          />
          {isAnalyzing ? <ActivityIndicator color="#214730" /> : null}
        </View>

        {!HAS_API_KEY ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Add your Gemini key</Text>
            <Text style={styles.noticeText}>
              Create a .env file with EXPO_PUBLIC_GEMINI_API_KEY, then restart Metro and reload Expo Go.
            </Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Scan unavailable</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
      </Card>

      {analysis ? (
        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleBlock}>
              <Text style={styles.resultEyebrow}>Scan result</Text>
              <Text style={styles.resultTitle}>{analysis.diseaseName}</Text>
              <Text style={styles.resultSubtitle}>{analysis.summary}</Text>
            </View>
            <View style={styles.pillColumn}>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: `${URGENCY_COLORS[analysis.urgency]}22` },
                ]}>
                <Text style={[styles.statusPillText, { color: URGENCY_COLORS[analysis.urgency] }]}>
                  {analysis.urgency} urgency
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: `${SPREAD_RISK_COLORS[analysis.spreadRisk]}22` },
                ]}>
                <Text
                  style={[
                    styles.statusPillText,
                    { color: SPREAD_RISK_COLORS[analysis.spreadRisk] },
                  ]}>
                  {analysis.spreadRisk} spread risk
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.metricGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Crop</Text>
              <Text style={styles.metricValue}>{analysis.cropType}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Status</Text>
              <Text style={styles.metricValue}>{analysis.healthStatus}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Confidence</Text>
              <Text style={styles.metricValue}>{Math.round(analysis.confidence * 100)}%</Text>
            </View>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>Likely issue</Text>
            <Text style={styles.resultBody}>{analysis.likelyIssue}</Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>Immediate field action</Text>
            {analysis.fieldActions.map((step) => (
              <View key={step} style={styles.listRow}>
                <Text style={styles.listDash}>-</Text>
                <Text style={styles.resultBody}>{step}</Text>
              </View>
            ))}
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#294E36',
    borderColor: '#294E36',
  },
  heroTitle: {
    color: '#F8F3E7',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#D6E0CF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  buttonRow: {
    marginTop: 14,
    gap: 12,
  },
  previewTitle: {
    color: '#223626',
    fontSize: 14,
    fontWeight: '800',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 16,
  },
  clearText: {
    color: '#8F3F2F',
    fontSize: 14,
    fontWeight: '700',
  },
  previewFrame: {
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#A67A47',
    padding: 6,
    backgroundColor: '#D7CBB8',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 16,
    backgroundColor: '#D8E0D1',
  },
  emptyPreview: {
    minHeight: 280,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#C7BEAF',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
    backgroundColor: '#F3EBDD',
  },
  emptyTitle: {
    color: '#314533',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyCopy: {
    color: '#667361',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  analyzeRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  analyzeButton: {
    flex: 1,
  },
  noticeCard: {
    backgroundColor: '#E7EFE5',
    borderRadius: 16,
    padding: 14,
    gap: 5,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#CBD7C7',
  },
  noticeTitle: {
    color: '#234732',
    fontSize: 14,
    fontWeight: '800',
  },
  noticeText: {
    color: '#3D5A46',
    fontSize: 13,
    lineHeight: 18,
  },
  errorCard: {
    backgroundColor: '#F4D6CF',
    borderRadius: 16,
    padding: 14,
    gap: 5,
    marginTop: 12,
  },
  errorTitle: {
    color: '#7A2317',
    fontSize: 15,
    fontWeight: '800',
  },
  errorText: {
    color: '#7A2317',
    fontSize: 13,
    lineHeight: 19,
  },
  resultCard: {
    backgroundColor: '#1E2F25',
    borderColor: '#1E2F25',
  },
  resultHeader: {
    gap: 12,
  },
  resultTitleBlock: {
    gap: 6,
  },
  resultEyebrow: {
    color: '#B6C5B5',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  resultTitle: {
    color: '#FAF4E7',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
  },
  resultSubtitle: {
    color: '#D5DFC9',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  pillColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 120,
    backgroundColor: '#2D4334',
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  metricLabel: {
    color: '#AFC1B0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    color: '#FAF4E7',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  resultSection: {
    marginTop: 16,
    gap: 6,
  },
  resultSectionTitle: {
    color: '#C9D7C6',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  resultBody: {
    color: '#E2EAD9',
    fontSize: 13,
    lineHeight: 20,
  },
  listRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  listDash: {
    color: '#E2EAD9',
    fontSize: 14,
    lineHeight: 20,
  },
});
