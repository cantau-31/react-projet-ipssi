import { WEATHER_API_URL } from "@env";

const WMO_CODES = {
  0: { condition: "clear", label: "Ciel dégagé", icon: "☀️" },
  1: { condition: "partly_cloudy", label: "Peu nuageux", icon: "🌤️" },
  2: { condition: "partly_cloudy", label: "Partiellement nuageux", icon: "⛅" },
  3: { condition: "cloudy", label: "Couvert", icon: "☁️" },
  45: { condition: "fog", label: "Brouillard", icon: "🌫️" },
  48: { condition: "fog", label: "Brouillard givrant", icon: "🌫️" },
  51: { condition: "drizzle", label: "Bruine légère", icon: "🌦️" },
  53: { condition: "drizzle", label: "Bruine modérée", icon: "🌦️" },
  55: { condition: "drizzle", label: "Bruine dense", icon: "🌦️" },
  56: { condition: "freezing_rain", label: "Bruine verglaçante", icon: "🌧️" },
  57: {
    condition: "freezing_rain",
    label: "Bruine verglaçante dense",
    icon: "🌧️",
  },
  61: { condition: "rain", label: "Pluie légère", icon: "🌧️" },
  63: { condition: "rain", label: "Pluie modérée", icon: "🌧️" },
  65: { condition: "rain", label: "Pluie forte", icon: "🌧️" },
  66: { condition: "freezing_rain", label: "Pluie verglaçante", icon: "🌧️" },
  67: {
    condition: "freezing_rain",
    label: "Pluie verglaçante forte",
    icon: "🌧️",
  },
  71: { condition: "snow", label: "Neige légère", icon: "❄️" },
  73: { condition: "snow", label: "Neige modérée", icon: "❄️" },
  75: { condition: "snow", label: "Neige forte", icon: "❄️" },
  77: { condition: "snow", label: "Grains de neige", icon: "❄️" },
  80: { condition: "rain", label: "Averses légères", icon: "🌦️" },
  81: { condition: "rain", label: "Averses modérées", icon: "🌧️" },
  82: { condition: "rain", label: "Averses violentes", icon: "⛈️" },
  85: { condition: "snow", label: "Averses de neige", icon: "🌨️" },
  86: { condition: "snow", label: "Averses de neige fortes", icon: "🌨️" },
  95: { condition: "thunderstorm", label: "Orage", icon: "⛈️" },
  96: {
    condition: "thunderstorm",
    label: "Orage avec grêle légère",
    icon: "⛈️",
  },
  99: {
    condition: "thunderstorm",
    label: "Orage avec grêle forte",
    icon: "⛈️",
  },
};

function parseWeatherCode(code) {
  return (
    WMO_CODES[code] || { condition: "unknown", label: "Inconnu", icon: "❓" }
  );
}

/**
 * Récupère la météo actuelle depuis Open-Meteo.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Données météo formatées
 */
export async function fetchWeather(lat, lon) {
  const baseUrl = WEATHER_API_URL || "https://api.open-meteo.com";
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "precipitation",
      "weather_code",
    ].join(","),
    timezone: "auto",
  });

  const url = `${baseUrl}/v1/forecast?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur météo : ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error("Données météo invalides (pas de données actuelles)");
  }

  const current = data.current;
  const { condition, label, icon } = parseWeatherCode(current.weather_code);

  const isRaining = [
    "rain",
    "drizzle",
    "freezing_rain",
    "thunderstorm",
  ].includes(condition);
  const isSnowing = condition === "snow";
  const temperature = Math.round(current.temperature_2m);
  const isCold = temperature < 10;
  const isHot = temperature > 28;

  return {
    temperature,
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    precipitation: current.precipitation,
    weatherCode: current.weather_code,
    condition,
    label,
    icon,
    isRaining,
    isSnowing,
    isCold,
    isHot,
  };
}

/**
 * Prépare les données météo pour l'IA.
 * Format simplifié pour le prompt IA.
 * @param {Object} weather - Données météo retournées par fetchWeather
 * @param {string} locationName - Nom de la ville
 * @returns {string} Description textuelle pour le prompt IA
 */
export function formatWeatherForAI(weather, locationName) {
  if (!weather) return "Météo indisponible.";

  return [
    `Lieu : ${locationName}`,
    `Température : ${weather.temperature}°C (ressenti ${weather.feelsLike}°C)`,
    `Condition : ${weather.label}`,
    `Humidité : ${weather.humidity}%`,
    `Vent : ${weather.windSpeed} km/h`,
    `Précipitations : ${weather.precipitation} mm`,
    weather.isRaining ? "Il pleut actuellement." : "",
    weather.isSnowing ? "Il neige actuellement." : "",
    weather.isCold ? "Il fait froid." : "",
    weather.isHot ? "Il fait chaud." : "",
  ]
    .filter(Boolean)
    .join("\n");
}
