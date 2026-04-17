import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useWeather }   from '../hooks/useWeather';
import { useWardrobe }  from '../context/WardrobeContext';
import { WeatherWidget } from '../components/WeatherWidget';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

export function HomeScreen({ navigation }) {
  const { weather, loading, error, locationName, refresh } = useWeather();
  const { clothes } = useWardrobe();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getAdvice = () => {
    if (!weather) return null;
    if (weather.isRaining) return '🌂 N\'oubliez pas votre imperméable !';
    if (weather.isSnowing) return '❄️ Couvrez-vous bien, il neige !';
    if (weather.isCold)    return '🧥 Il fait froid, pensez à vous couvrir.';
    if (weather.isHot)     return '☀️ Légèrement habillé aujourd\'hui !';
    return '👍 Belle journée pour être bien habillé.';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subtitle}>Que porter aujourd'hui ?</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeNum}>{clothes.length}</Text>
            <Text style={styles.badgeLabel}>vêtements</Text>
          </View>
        </View>

        {/* Météo */}
        <WeatherWidget
          weather={weather}
          loading={loading}
          error={error}
          locationName={locationName}
          onRefresh={refresh}
        />

        {/* Conseil */}
        {weather && (
          <View style={styles.advice}>
            <Text style={styles.adviceText}>{getAdvice()}</Text>
          </View>
        )}

        {/* Actions */}
        <Text style={styles.sectionLabel}>Actions</Text>

        <TouchableOpacity
          style={[styles.btnPrimary, (!weather || clothes.length === 0) && styles.btnDisabled]}
          onPress={() => navigation.navigate('Result')}
          disabled={!weather || clothes.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryIcon}>✨</Text>
          <View style={styles.btnText}>
            <Text style={styles.btnPrimaryTitle}>Générer une tenue</Text>
            <Text style={styles.btnPrimarySubtitle}>Recommandation IA · météo actuelle</Text>
          </View>
          <Text style={styles.btnArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Wardrobe')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryIcon}>👔</Text>
          <View style={styles.btnText}>
            <Text style={styles.btnSecondaryTitle}>Mon armoire</Text>
            <Text style={styles.btnSecondarySubtitle}>
              {clothes.length} vêtement{clothes.length !== 1 ? 's' : ''} enregistré{clothes.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.btnArrowSecondary}>→</Text>
        </TouchableOpacity>

        {clothes.length === 0 && (
          <View style={styles.emptyWarning}>
            <Text style={styles.emptyWarningText}>
              ⚠️ Votre armoire est vide. Ajoutez des vêtements pour obtenir des recommandations.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: { flex: 1 },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    minWidth: 64,
  },
  badgeNum: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  badgeLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textMuted,
  },

  // Conseil
  advice: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  adviceText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.sizes.md,
  },

  sectionLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },

  // Bouton principal
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  btnDisabled: { opacity: 0.45 },
  btnPrimaryIcon: { fontSize: 20, marginRight: SPACING.md },
  btnText: { flex: 1 },
  btnPrimaryTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    color: '#fff',
  },
  btnPrimarySubtitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  btnArrow: { color: 'rgba(255,255,255,0.4)', fontSize: 18 },

  // Bouton secondaire
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  btnSecondaryIcon: { fontSize: 20, marginRight: SPACING.md },
  btnSecondaryTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  btnSecondarySubtitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  btnArrowSecondary: { color: COLORS.textMuted, fontSize: 18 },

  // Avertissement armoire vide
  emptyWarning: {
    backgroundColor: '#1A1520',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.warning,
    marginTop: SPACING.sm,
  },
  emptyWarningText: {
    color: COLORS.warning,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
});
