import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useWardrobe } from '../context/WardrobeContext';
import { ClothCard } from '../components/ClothCard';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

export function WardrobeScreen() {
  const { clothes, removeCloth } = useWardrobe();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Armoire</Text>
        <Text style={styles.subtitle}>{clothes.length} vêtements</Text>
      </View>
      <FlatList
        data={clothes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClothCard cloth={item} onDelete={removeCloth} />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  title: { fontSize: TYPOGRAPHY.sizes.xxl, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  list: { padding: SPACING.lg, paddingTop: SPACING.sm },
});