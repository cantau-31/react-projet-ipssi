/**
 * storageService.js
 * Gestion de la persistance locale des vêtements via AsyncStorage.
 * Toutes les opérations CRUD sont centralisées ici.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@wardrobe_clothes';

/**
 * Récupère tous les vêtements stockés localement.
 * @returns {Promise<Array>} Tableau de vêtements (vide si rien en stock)
 */
export const getClothes = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const data = JSON.parse(json);
    // Garantit que les types sont corrects (protection JSI new architecture)
    return data.map((item) => ({
      ...item,
      isWaterproof: Boolean(item.isWaterproof),
      temperatureMin: Number(item.temperatureMin),
      temperatureMax: Number(item.temperatureMax),
    }));
  } catch (error) {
    console.error('[storageService] Erreur getClothes:', error);
    return [];
  }
};

/**
 * Sauvegarde (écrase) la liste complète des vêtements.
 * @param {Array} clothes Tableau de vêtements à sauvegarder
 */
export const saveClothes = async (clothes) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clothes));
  } catch (error) {
    console.error('[storageService] Erreur saveClothes:', error);
    throw error;
  }
};

/**
 * Ajoute un vêtement à l'armoire.
 * Structure attendue :
 * {
 *   id: string, name: string, type: string, style: string,
 *   color: string, isWaterproof: boolean,
 *   temperatureMin: number, temperatureMax: number
 * }
 * @param {Object} item Vêtement à ajouter
 */
export const addClothing = async (item) => {
  const clothes = await getClothes();
  await saveClothes([...clothes, item]);
};

/**
 * Supprime un vêtement par son identifiant.
 * @param {string} id Identifiant du vêtement à supprimer
 */
export const removeClothing = async (id) => {
  const clothes = await getClothes();
  await saveClothes(clothes.filter((c) => c.id !== id));
};

/**
 * Supprime tous les vêtements (utile pour les tests).
 */
export const clearWardrobe = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
