import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, Switch, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

const KEY_NAME = 'GEMINI_API_KEY';

async function saveKey(key: string) {
  if (!key) return;
  await SecureStore.setItemAsync(KEY_NAME, key);
}

async function loadKey() {
  return SecureStore.getItemAsync(KEY_NAME);
}

async function analyzeWithGemini(apiKey: string, uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64
            }
          },
          {
            text:
              'You are a plant health assistant. Identify plant species if possible and diagnose any visible diseases, pests, or nutrient deficiencies. Provide concise steps for treatment and prevention. If the image is unclear, ask for a clearer leaf image, front and back, with good lighting.'
          }
        ]
      }
    ]
  };
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );
  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('\n') ||
    json?.candidates?.[0]?.content?.parts?.[0]?.text ||
    JSON.stringify(json);
  return text as string;
}

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [offline, setOffline] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKey().then(k => {
      if (k) setApiKey(k);
    });
  }, []);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });
    if (!res.canceled) {
      const asset = res.assets?.[0];
      setImageUri(asset?.uri || null);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const res = await ImagePicker.launchCameraAsync({
      quality: 1
    });
    if (!res.canceled) {
      const asset = res.assets?.[0];
      setImageUri(asset?.uri || null);
    }
  }

  async function analyze() {
    if (!imageUri) return;
    if (!apiKey) return;
    setLoading(true);
    try {
      const text = await analyzeWithGemini(apiKey, imageUri);
      setResult(text);
    } catch (e: any) {
      setResult(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plant Health Identifier</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Offline mode</Text>
        <Switch value={offline} onValueChange={setOffline} />
      </View>
      <TextInput
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="Enter Gemini API Key"
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.row}>
        <Button title="Save Key" onPress={() => saveKey(apiKey)} />
        <View style={{ width: 12 }} />
        <Button title="Pick Image" onPress={pickImage} />
        <View style={{ width: 12 }} />
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text>Select or capture a plant image</Text>
        </View>
      )}
      <View style={styles.actions}>
        <Button title="Analyze with Gemini" onPress={analyze} disabled={offline || !imageUri || !apiKey || loading} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : (
        <Text style={styles.result}>{result}</Text>
      )}
      {offline && (
        <View style={styles.offlineBox}>
          <Text style={styles.offlineTitle}>Offline mode</Text>
          <Text>
            Load a small on-device dataset to match visual symptoms locally. Use PlantVillage or PlantDoc subsets and
            simple nearest-neighbor lookups with precomputed embeddings. This mode is scaffolded and will be extended.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  label: { fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  image: { width: '100%', height: 280, borderRadius: 8, backgroundColor: '#eee' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  actions: { marginTop: 12 },
  result: { marginTop: 16, fontSize: 16 },
  offlineBox: { marginTop: 20, padding: 12, backgroundColor: '#f4f6f8', borderRadius: 8 },
  offlineTitle: { fontWeight: '600', marginBottom: 6 }
});
