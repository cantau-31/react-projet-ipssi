import React, { createContext, useContext, useEffect, useState } from 'react';
import { getClothes, saveClothes } from '../services/storageService';

const WardrobeContext = createContext(null);

const DEMO_CLOTHES = [
  { id: '1', name: 'Veste noire', type: 'jacket', style: 'casual', color: 'black', isWaterproof: true, temperatureMin: 5, temperatureMax: 15 },
  { id: '2', name: 'Jean bleu', type: 'pants', style: 'casual', color: 'blue', isWaterproof: false, temperatureMin: 10, temperatureMax: 25 },
  { id: '3', name: 'Pull bordeaux', type: 'sweater', style: 'casual', color: 'bordeaux', isWaterproof: false, temperatureMin: 8, temperatureMax: 16 },
];

export function WardrobeProvider({ children }) {
  const [clothes, setClothes] = useState(DEMO_CLOTHES);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateWardrobe = async () => {
      try {
        const storedClothes = await getClothes();
        if (storedClothes.length > 0) {
          setClothes(storedClothes);
        } else {
          setClothes(DEMO_CLOTHES);
        }
      } catch (error) {
        console.error('[WardrobeContext] Erreur hydratation:', error);
        setClothes(DEMO_CLOTHES);
      }
      setIsHydrated(true);
    };

    hydrateWardrobe();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    saveClothes(clothes).catch((error) => {
      console.error('[WardrobeContext] Erreur sauvegarde:', error);
    });
  }, [clothes, isHydrated]);

  const addCloth = (cloth) => {
    setClothes((prev) => [...prev, { ...cloth, id: Date.now().toString() }]);
  };

  const removeCloth = (id) => {
    setClothes((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <WardrobeContext.Provider value={{ clothes, addCloth, removeCloth }}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  return useContext(WardrobeContext);
}
