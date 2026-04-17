import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

export function WeatherWidget({ weather, loading, error, locationName, onRefresh }) {

  if (loading) {
    return (
      <View style={[styles.card, styles.centered]}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.loadingText}>Récupération de la météo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.card, styles.centered]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weather) return null;

  return (
    <View style={styles.card}>
      {/* Ligne du haut */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.location}>📍 {locationName}</Text>
          <Text style={styles.condition}>{weather.label}</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshIcon}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* Température principale */}
      <View style={styles.mainRow}>
        <Text style={styles.weatherIcon}>{weather.icon}</Text>
        <View>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.feelsLike}>Ressenti {weather.feelsLike}°</Text>
        </View>
        {/* Pills météo */}
        <View style={styles.pills}>
          {weather.isRaining && <Pill label="🌧️ Pluie"  />}
          {weather.isSnowing && <Pill label="❄️ Neige"  />}
          {weather.isCold    && <Pill label="🧊 Froid"  />}
          {weather.isHot     && <Pill label="🌡️ Chaud"  />}
        </View>
      </View>

      {/* Détails */}
      <View style={styles.details}>
        <Detail icon="💧" value={`${weather.humidity}%`}        label="Humidité"  />
        <Detail icon="💨" value={`${weather.windSpeed} km/h`}   label="Vent"      />
        <Detail icon="🌧️" value={`${weather.precipitation} mm`} label="Précipit." />
      </View>
    </View>
  );
}

function Pill({ label }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

function Detail({ icon, value, label }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  errorIcon: { fontSize: 32, marginBottom: SPACING.sm },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  retryBtn: {
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  retryText: { color: COLORS.primaryLight, fontSize: TYPOGRAPHY.sizes.sm },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  location: { fontSize: TYPOGRAPHY.sizes.xs, color: COLORS.textSecondary },
  condition: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text,
    fontWeight: '500',
    marginTop: 2,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: { color: COLORS.primaryLight, fontSize: 18, fontWeight: '500' },

  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  weatherIcon: { fontSize: 48 },
  temperature: {
    fontSize: 52,
    fontWeight: '300',
    color: COLORS.primaryLight,
    letterSpacing: -2,
    lineHeight: 56,
  },
  feelsLike: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  pills: {
    marginLeft: 'auto',
    gap: SPACING.xs,
    alignItems: 'flex-end',
  },
  pill: {
    backgroundColor: '#1A1728',
    borderWidth: 0.5,
    borderColor: '#3A2F5E',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  pillText: { fontSize: TYPOGRAPHY.sizes.xs, color: COLORS.primaryLight },

  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  detailItem: { alignItems: 'center' },
  detailIcon:  { fontSize: 14, marginBottom: 2 },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  detailLabel: { fontSize: TYPOGRAPHY.sizes.xs, color: COLORS.textMuted },
});
