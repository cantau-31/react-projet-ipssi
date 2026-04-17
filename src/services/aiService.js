/**
 * aiService.js
 * Génère une recommandation de tenue via Mistral AI.
 *
 * Si IA_API_KEY n'est pas configurée, un algorithme local de filtrage
 * prend le relais automatiquement (aucun appel réseau nécessaire).
 *
 * Import de la clé via @env (react-native-dotenv) — jamais en dur dans le code.
 */
import { IA_API_KEY } from '@env';

const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-small-latest';

// ============================================================
// Fonction principale exportée
// ============================================================

/**
 * Retourne une recommandation de tenue.
 * @param {Object} weather    Objet météo { temperature, condition, isRaining, windspeed }
 * @param {Array}  clothes    Tableau de vêtements de l'armoire
 * @returns {Promise<{outfit: string[], explanation: string}>}
 */
export const getOutfitRecommendation = async (weather, clothes) => {
  // Clé non configurée → fallback local
  if (!IA_API_KEY || IA_API_KEY === 'your_mistral_api_key_here') {
    console.log('[aiService] Pas de clé API — utilisation du mode local');
    return getLocalRecommendation(weather, clothes);
  }

  try {
    return await callMistralAI(weather, clothes);
  } catch (error) {
    console.error('[aiService] Erreur Mistral, fallback local :', error.message);
    // Si l'API échoue, on revient sur le mode local plutôt que de crasher
    return getLocalRecommendation(weather, clothes);
  }
};

// ============================================================
// Appel à l'API Mistral AI
// ============================================================

const callMistralAI = async (weather, clothes) => {
  const response = await fetch(MISTRAL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Clé importée depuis .env via @env — jamais écrite en dur
      Authorization: `Bearer ${IA_API_KEY}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Tu es un assistant mode expert. Tu recommandes des tenues vestimentaires en fonction de la météo. ' +
            'Tu réponds TOUJOURS en JSON valide, sans aucun texte avant ou après.',
        },
        {
          role: 'user',
          content: buildPrompt(weather, clothes),
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Mistral API error ${response.status}`
    );
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return parseAIResponse(content, weather, clothes);
};

// ============================================================
// Construction du prompt
// ============================================================

const buildPrompt = (weather, clothes) => {
  const clothesList = clothes
    .map(
      (c) =>
        `- "${c.name}" | type: ${c.type} | style: ${c.style} | couleur: ${c.color} | ` +
        `imperméable: ${c.isWaterproof ? 'oui' : 'non'} | ` +
        `température: ${c.temperatureMin}°C à ${c.temperatureMax}°C`
    )
    .join('\n');

  return `
Météo actuelle :
- Température : ${weather.temperature}°C
- Condition : ${weather.condition}
- Pluie : ${weather.isRaining ? 'Oui' : 'Non'}
- Vent : ${weather.windspeed} km/h

Vêtements disponibles dans l'armoire :
${clothesList}

Consignes :
1. Sélectionne UNIQUEMENT des vêtements de la liste ci-dessus.
2. Choisis les vêtements dont la plage de température inclut ${weather.temperature}°C.
3. Si il pleut, privilégie les vêtements imperméables.
4. Assemble une tenue complète et cohérente (haut + bas si possible).

Réponds en JSON avec exactement ce format :
{
  "outfit": ["nom exact vêtement 1", "nom exact vêtement 2"],
  "explanation": "Explication concise du choix en 2-3 phrases."
}
`.trim();
};

// ============================================================
// Parsing de la réponse IA
// ============================================================

const parseAIResponse = (content, weather, clothes) => {
  try {
    // Extraire le JSON même si l'IA ajoute du texte autour
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.outfit) && typeof parsed.explanation === 'string') {
        return { outfit: parsed.outfit, explanation: parsed.explanation };
      }
    }
  } catch {
    // JSON invalide → fallback
  }
  return getLocalRecommendation(weather, clothes);
};

// ============================================================
// Algorithme local (sans clé API)
// ============================================================

/**
 * Filtre les vêtements adaptés à la météo sans appel IA.
 * Utile en développement ou si l'utilisateur n'a pas de clé API.
 */
const getLocalRecommendation = (weather, clothes) => {
  const { temperature, isRaining } = weather;

  // 1. Vêtements dans la bonne plage de température
  const byTemp = clothes.filter(
    (c) => temperature >= c.temperatureMin && temperature <= c.temperatureMax
  );

  // 2. Si pluie, prioriser les imperméables
  const waterproof = isRaining ? byTemp.filter((c) => c.isWaterproof) : [];

  // 3. Dédupliquer et limiter à 3 items
  const seen = new Set();
  const selected = [];
  for (const item of [...waterproof, ...byTemp]) {
    if (!seen.has(item.id) && selected.length < 3) {
      seen.add(item.id);
      selected.push(item);
    }
  }

  // 4. Aucun vêtement compatible → prendre les 2 premiers disponibles
  if (selected.length === 0 && clothes.length > 0) {
    clothes.slice(0, 2).forEach((c) => selected.push(c));
  }

  // 5. Construire l'explication
  const parts = [`Tenue sélectionnée pour ${temperature}°C`];
  if (isRaining) parts.push('avec conditions pluvieuses');
  if (waterproof.length > 0) {
    parts.push('Des vêtements imperméables ont été privilégiés.');
  }
  parts.push('Les pièces choisies correspondent à votre météo actuelle.');

  return {
    outfit: selected.map((c) => c.name),
    explanation: parts.join('. ') + '.',
  };
};
