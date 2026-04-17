import { useState, useEffect } from 'react';

export function useWeather() {
  const [weather, setWeather] = useState({
    temperature: 14,
    feelsLike: 11,
    humidity: 78,
    windSpeed: 22,
    precipitation: 2.1,
    condition: 'rain',
    label: 'Pluie modérée',
    icon: '🌧️',
    isRaining: true,
    isSnowing: false,
    isCold: true,
    isHot: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Nantes');

  const refresh = () => console.log('refresh météo');

  return { weather, loading, error, locationName, refresh };
}