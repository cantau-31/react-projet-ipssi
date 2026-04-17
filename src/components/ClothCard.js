import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, getClothEmoji, getClothColorHex } from '../theme';

export function ClothCard({ cloth, onDelete }) {
  const handleDelete = () => {
    Alert.alert(
      'Supprimer le vêtement',
      `Supprimer "${cloth.name}" de votre armoire ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(cloth.id) },
      ]
    );
  };

  const emoji    = getClothEmoji(cloth.type);
  const colorHex = getClothColorHex(cloth.color);

  return (
    <View style={styles.card}>
      {/* Emoji */}
      <View style={[styles.emojiBox, { backgroundColor: colorHex + '40' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Infos */}
      <View style={styles.body}>
        <Text style={styles.name}>{cloth.name}</Text>
        <View style={styles.tags}>
          <Tag label={cloth.style} />
          {cloth.isWaterproof && <Tag label="💧 Imperméable" highlight />}
          <View style={[styles.colorDot, { backgroundColor: colorHex }]} />
          <Text style={styles.colorLabel}>{cloth.color}</Text>
        </View>
        <Text style={styles.temp}>
          🌡️ {cloth.temperatureMin}°C → {cloth.temperatureMax}°C
        </Text>
      </View>

      {/* Supprimer */}
      {onDelete && (
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}>
          <Text style={styles.delIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function Tag({ label, highlight }) {
  return (
    <View style={[styles.tag, highlight && styles.tagHighlight]}>
      <Text style={[styles.tagText, highlight && styles.tagTextHighlight]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emoji: { fontSize: 22 },

  body: { flex: 1 },
  name: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tag: {
    borderWidth: 0.5,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  tagHighlight: {
    borderColor: COLORS.primary,
    backgroundColor: '#1A1728',
  },
  tagTextHighlight: {
    color: COLORS.primaryLight,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  colorLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  temp: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textMuted,
  },

  delBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  delIcon: { color: COLORS.danger, fontSize: 12, fontWeight: '600' },
});
