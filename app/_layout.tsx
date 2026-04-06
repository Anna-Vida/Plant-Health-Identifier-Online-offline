import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F3F0E7' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="about" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
