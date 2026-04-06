import { PropsWithChildren } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ViewStyle;
}>;

export function Screen({ scroll, contentStyle, children }: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEE6D6',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#EEE6D6',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.select({ ios: 16, android: 16, default: 16 }),
    gap: 14,
  },
});

