import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { WardrobeProvider } from './src/context/WardrobeContext';
import { HomeScreen }     from './src/screens/HomeScreen';
import { WardrobeScreen } from './src/screens/WardrobeScreen';
import { ResultScreen }   from './src/screens/ResultScreen';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from './src/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <WardrobeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarShowLabel: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🏠" label="Accueil" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Wardrobe"
            component={WardrobeScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="👔" label="Armoire" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Result"
            component={ResultScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="✨" label="Tenue" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </WardrobeProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0D0C15',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    height: 68,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    minWidth: 72,
  },
  tabItemFocused: {
    backgroundColor: '#1E1B2E',
  },
  tabEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textMuted,
  },
  tabLabelFocused: {
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
});
