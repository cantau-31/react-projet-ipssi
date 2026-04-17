import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ScrollView, Switch, SafeAreaView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useWardrobe } from '../context/WardrobeContext';
import { ClothCard } from '../components/ClothCard';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, CLOTH_TYPES, CLOTH_STYLES, CLOTH_COLORS } from '../theme';

const INITIAL_FORM = {
  name: '', type: 'top', style: 'casual', color: 'black',
  isWaterproof: false, temperatureMin: '10', temperatureMax: '25',
};

export function WardrobeScreen() {
  const { clothes, addCloth, removeCloth } = useWardrobe();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [filterType, setFilterType] = useState(null);

  const filtered = filterType ? clothes.filter((c) => c.type === filterType) : clothes;

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addCloth({
      ...form,
      temperatureMin: parseInt(form.temperatureMin) || 0,
      temperatureMax: parseInt(form.temperatureMax) || 30,
    });
    setModalVisible(false);
    setForm(INITIAL_FORM);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mon Armoire</Text>
          <Text style={styles.subtitle}>{clothes.length} vêtements</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        <TouchableOpacity
          style={[styles.chip, !filterType && styles.chipActive]}
          onPress={() => setFilterType(null)}>
          <Text style={[styles.chipText, !filterType && styles.chipTextActive]}>Tous</Text>
        </TouchableOpacity>
        {CLOTH_TYPES.map((t) => (
          <TouchableOpacity key={t.value}
            style={[styles.chip, filterType === t.value && styles.chipActive]}
            onPress={() => setFilterType(filterType === t.value ? null : t.value)}>
            <Text style={[styles.chipText, filterType === t.value && styles.chipTextActive]}>
              {t.emoji} {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>👗</Text>
          <Text style={styles.emptyTitle}>Aucun vêtement</Text>
          <Text style={styles.emptyText}>Appuyez sur + Ajouter pour commencer.</Text>
        </View>
      ) : (
        <FlatList data={filtered} keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ClothCard cloth={item} onDelete={removeCloth} />}
          contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      )}

      {/* Modal ajout */}
      <Modal visible={modalVisible} animationType="slide" transparent
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modal}>
            {/* Header modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau vêtement</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Nom */}
              <Text style={styles.label}>Nom *</Text>
              <TextInput style={styles.input} placeholder="ex: Veste noire..."
                placeholderTextColor={COLORS.textMuted} value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })} />

              {/* Type */}
              <Text style={styles.label}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionRow}>
                  {CLOTH_TYPES.map((t) => (
                    <TouchableOpacity key={t.value}
                      style={[styles.optionChip, form.type === t.value && styles.optionChipActive]}
                      onPress={() => setForm({ ...form, type: t.value })}>
                      <Text style={styles.optionEmoji}>{t.emoji}</Text>
                      <Text style={[styles.optionText, form.type === t.value && styles.optionTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Style */}
              <Text style={styles.label}>Style</Text>
              <View style={styles.optionRow}>
                {CLOTH_STYLES.map((s) => (
                  <TouchableOpacity key={s.value}
                    style={[styles.optionChip, form.style === s.value && styles.optionChipActive]}
                    onPress={() => setForm({ ...form, style: s.value })}>
                    <Text style={[styles.optionText, form.style === s.value && styles.optionTextActive]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Couleur */}
              <Text style={styles.label}>Couleur</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionRow}>
                  {CLOTH_COLORS.map((c) => (
                    <TouchableOpacity key={c.value}
                      style={[styles.optionChip, form.color === c.value && styles.optionChipActive]}
                      onPress={() => setForm({ ...form, color: c.value })}>
                      <Text style={[styles.optionText, form.color === c.value && styles.optionTextActive]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Températures */}
              <Text style={styles.label}>Température (°C)</Text>
              <View style={styles.tempRow}>
                <View style={styles.tempField}>
                  <Text style={styles.tempLabel}>Min</Text>
                  <TextInput style={styles.input} keyboardType="numeric"
                    value={form.temperatureMin}
                    onChangeText={(v) => setForm({ ...form, temperatureMin: v })} />
                </View>
                <Text style={styles.tempArrow}>→</Text>
                <View style={styles.tempField}>
                  <Text style={styles.tempLabel}>Max</Text>
                  <TextInput style={styles.input} keyboardType="numeric"
                    value={form.temperatureMax}
                    onChangeText={(v) => setForm({ ...form, temperatureMax: v })} />
                </View>
              </View>

              {/* Imperméable */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>💧 Imperméable</Text>
                <Switch value={form.isWaterproof}
                  onValueChange={(v) => setForm({ ...form, isWaterproof: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={COLORS.text} />
              </View>

              {/* Bouton sauvegarder */}
              <TouchableOpacity
                style={[styles.saveBtn, !form.name.trim() && styles.saveBtnDisabled]}
                onPress={handleAdd} disabled={!form.name.trim()}>
                <Text style={styles.saveBtnText}>Ajouter le vêtement</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.sm },
  title: { fontSize: TYPOGRAPHY.sizes.xxl, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: TYPOGRAPHY.sizes.sm },
  filterScroll: { maxHeight: 44, marginBottom: SPACING.sm },
  filterContent: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: 'center' },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.full, backgroundColor: COLORS.bgCard, borderWidth: 0.5, borderColor: COLORS.border, marginRight: SPACING.sm },
  chipActive: { backgroundColor: '#1E1B2E', borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: TYPOGRAPHY.sizes.sm },
  chipTextActive: { color: COLORS.primaryLight, fontWeight: '600' },
  list: { padding: SPACING.lg, paddingTop: SPACING.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  emptyEmoji: { fontSize: 56, marginBottom: SPACING.md },
  emptyTitle: { fontSize: TYPOGRAPHY.sizes.xl, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  emptyText: { fontSize: TYPOGRAPHY.sizes.md, color: COLORS.textSecondary, textAlign: 'center' },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modal: { backgroundColor: COLORS.bgCard, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, maxHeight: '92%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: TYPOGRAPHY.sizes.xl, fontWeight: '700', color: COLORS.text },
  modalClose: { color: COLORS.textMuted, fontSize: 20, padding: SPACING.sm },
  label: { fontSize: TYPOGRAPHY.sizes.xs, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: SPACING.md, color: COLORS.text, fontSize: TYPOGRAPHY.sizes.md, borderWidth: 0.5, borderColor: COLORS.border },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  optionChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.bgInput, borderWidth: 0.5, borderColor: COLORS.border, gap: 4 },
  optionChipActive: { backgroundColor: '#1E1B2E', borderColor: COLORS.primary },
  optionEmoji: { fontSize: 13 },
  optionText: { fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.textSecondary },
  optionTextActive: { color: COLORS.primaryLight, fontWeight: '600' },
  tempRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  tempField: { flex: 1 },
  tempLabel: { fontSize: TYPOGRAPHY.sizes.xs, color: COLORS.textMuted, marginBottom: 4 },
  tempArrow: { color: COLORS.textMuted, fontSize: 18, marginTop: SPACING.md },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 0.5, borderColor: COLORS.border },
  switchLabel: { color: COLORS.text, fontSize: TYPOGRAPHY.sizes.md },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.xl },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: '#fff', fontSize: TYPOGRAPHY.sizes.md, fontWeight: '700' },
});