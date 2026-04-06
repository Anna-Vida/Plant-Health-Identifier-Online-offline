import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
};

export function AppHeader({ title, subtitle, showBack, showLogo }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const renderLogo = Boolean(showLogo && !showBack);

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={styles.iconButton}>
              <Ionicons name="chevron-back" size={20} color="#1F2E25" />
            </Pressable>
          ) : renderLogo ? (
            <View style={styles.logoWrap}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.iconFiller} />
          )}
        </View>

        <View style={styles.center}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.right}>
          <View style={styles.iconFiller} />
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FAF8F3',
    borderBottomColor: '#E4E0D7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  title: {
    color: '#1F2E25',
    fontSize: 18,
    fontWeight: Platform.select({ ios: '800', android: '800', default: '800' }),
    letterSpacing: 0.2,
  },
  subtitle: {
    color: '#5C6B61',
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1EDE4',
  },
  iconFiller: {
    width: 38,
    height: 38,
  },
  logoWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5EAD0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7DDC7',
  },
  logo: {
    width: 22,
    height: 22,
    tintColor: '#214730',
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E1D8',
    marginTop: 10,
  },
});

