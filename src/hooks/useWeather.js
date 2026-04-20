import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import { fetchWeather } from "../services/weatherService";

const PARIS_COORDS = {
  latitude: 48.8566,
  longitude: 2.3522,
};

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
      let latitude = PARIS_COORDS.latitude;
      let longitude = PARIS_COORDS.longitude;

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;

        const [place] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (place) {
          setLocationName(
            place.city || place.subregion || place.region || "Position actuelle",
          );
        }
      } else {
        setLocationName("Paris");
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
