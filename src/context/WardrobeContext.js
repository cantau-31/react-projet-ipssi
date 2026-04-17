import React, { createContext, useContext, useState } from 'react';

const WardrobeContext = createContext(null);

const DEMO_CLOTHES = [
  { id: '1', name: 'Veste noire', type: 'jacket', style: 'casual', color: 'black', isWaterproof: true, temperatureMin: 5, temperatureMax: 15 },
  { id: '2', name: 'Jean bleu', type: 'pants', style: 'casual', color: 'blue', isWaterproof: false, temperatureMin: 10, temperatureMax: 25 },
  { id: '3', name: 'Pull bordeaux', type: 'sweater', style: 'casual', color: 'bordeaux', isWaterproof: false, temperatureMin: 8, temperatureMax: 16 },
];

export function WardrobeProvider({ children }) {
  const [clothes, setClothes] = useState(DEMO_CLOTHES);
  const addCloth = (cloth) => setClothes([...clothes, { ...cloth, id: Date.now().toString() }]);
  const removeCloth = (id) => setClothes(clothes.filter((c) => c.id !== id));
  return (
    <WardrobeContext.Provider value={{ clothes, addCloth, removeCloth }}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  return useContext(WardrobeContext);
}