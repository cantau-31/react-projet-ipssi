import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import { fetchWeather } from "../services/weatherService";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState("");

  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Permission de localisation refusée. Activez-la dans les réglages.",
        );
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (place) {
        setLocationName(
          place.city || place.subregion || place.region || "Position actuelle",
        );
      }

      const data = await fetchWeather(latitude, longitude);
      setWeather(data);
    } catch (err) {
      setError(err.message || "Impossible de récupérer la météo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return { weather, loading, error, locationName, refresh: loadWeather };
}
