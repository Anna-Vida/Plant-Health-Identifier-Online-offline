import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: '#1E5137',
        tabBarInactiveTintColor: '#6D7A6F',
        headerShown: true,
        header: ({ route }) => {
          const name = route.name;
          const meta =
            name === 'home'
              ? { title: 'Home', subtitle: 'Quick actions and guidance' }
              : name === 'scan'
                ? { title: 'Scanner', subtitle: 'Capture and analyze a crop photo' }
                : name === 'history'
                  ? { title: 'History', subtitle: 'Recent scans and notes' }
                  : name === 'guide'
                    ? { title: 'Field Guide', subtitle: 'Signs, tips, and first response' }
                  : name === 'chat'
                    ? { title: 'AgriChat', subtitle: 'Ask about crop health and field care' }
                    : { title: 'LeafLab' };
          return (
            <AppHeader
              title={meta.title}
              subtitle={meta.subtitle}
              showLogo
            />
          );
        },
        tabBarStyle: {
          backgroundColor: '#FAF8F3',
          borderTopColor: '#DFE6DB',
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AgriChat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="chatbubble-ellipses-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scanner',
          tabBarLabel: () => null,
          tabBarButton: ({ onPress, accessibilityRole, accessibilityState, accessibilityLabel, testID }) => (
            <Pressable
              onPress={onPress}
              accessibilityRole={accessibilityRole}
              accessibilityState={accessibilityState}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              style={({ pressed }) => [styles.centerWrap, pressed && styles.pressed]}>
              <View style={styles.centerButton}>
                <Ionicons name="leaf" size={26} color="#F7F0E0" />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="time-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Field Guide',
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="leaf-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
  },
  pressed: {
    opacity: 0.85,
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 22,
    backgroundColor: '#214730',
    borderWidth: 3,
    borderColor: '#FAF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A2D22',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
