import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useWardrobe } from '../context/WardrobeContext';
import { useWeather } from '../hooks/useWeather';
import { ClothCard } from '../components/ClothCard';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../theme';

export function ResultScreen() {
  const { clothes } = useWardrobe();
  const { weather } = useWeather();
  const outfit = clothes.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tenue du jour</Text>

        {weather && (
          <View style={styles.weatherSummary}>
            <Text style={styles.weatherIcon}>{weather.icon}</Text>
            <View>
              <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
              <Text style={styles.weatherLabel}>{weather.label}</Text>
            </View>
          </View>
        )}

        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiDot} />
            <Text style={styles.aiTitle}>Recommandation IA</Text>
          </View>
          <Text style={styles.aiText}>
            Version démo — connectez l'API Rima pour les vraies recommandations.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Votre tenue du jour</Text>
        {outfit.map((cloth) => (
          <ClothCard key={cloth.id} cloth={cloth} onDelete={null} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: TYPOGRAPHY.sizes.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  weatherSummary: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    padding: SPACING.md, flexDirection: 'row', alignItems: 'center',
    gap: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  weatherIcon: { fontSize: 36 },
  weatherTemp: { fontSize: TYPOGRAPHY.sizes.xl, fontWeight: '700', color: COLORS.primaryLight },
  weatherLabel: { fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.textSecondary },
  aiCard: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.lg,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  aiDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: COLORS.primary },
  aiTitle: { fontSize: TYPOGRAPHY.sizes.md, fontWeight: '600', color: COLORS.primaryLight },
  aiText: { fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  sectionLabel: {
    fontSize: TYPOGRAPHY.sizes.xs, fontWeight: '600', color: COLORS.textMuted,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: SPACING.md,
  },
});