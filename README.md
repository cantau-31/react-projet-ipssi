# Smart Wardrobe Assistant

> Application mobile React Native qui recommande une tenue vestimentaire adaptée à la météo du jour grâce à une intelligence artificielle.

---

## Equipe

| Membre | Rôle | Branche |
|--------|------|---------|
| Steven JANSEN | Interface & écrans (UI/UX) | `feat/interface` |
| Julien CANTAU | APIs & configuration | `feat/api` |
| Rima OUCHEFOUNE | Intelligence Artificielle & données | `feat/ia` |

---

## Présentation

Smart Wardrobe Assistant résout un problème du quotidien : savoir quoi porter le matin. L'application combine trois sources d'information — votre armoire virtuelle, la météo en temps réel, et une IA — pour vous suggérer la tenue idéale en quelques secondes.

### Fonctionnalités principales

- **Armoire virtuelle** — Ajoutez, consultez et supprimez vos vêtements avec leurs caractéristiques (type, style, couleur, imperméabilité, plage de température)
- **Météo en temps réel** — Géolocalisation automatique et données météo via l'API Open-Meteo
- **Recommandation IA** — Analyse combinée de votre armoire et de la météo pour suggérer une tenue cohérente et adaptée
- **Stockage local** — Toutes vos données sont sauvegardées sur votre téléphone via AsyncStorage

---

## Architecture du projet

```
react-projet-ipssi/
├── App.js                          # Point d'entrée, navigation par onglets
├── babel.config.js                 # Configuration Babel + react-native-dotenv
├── app.json                        # Configuration Expo (nom, splash, icônes, orientation)
├── .env                            # Variables d'environnement (non commité)
├── .env.example                    # Template .env
├── .gitignore
├── package.json
└── src/
    ├── theme.js                    # Design tokens (couleurs, typo, espacements)
    ├── context/
    │   └── WardrobeContext.js      # État global armoire + AsyncStorage
    ├── hooks/
    │   └── useWeather.js           # Hook géolocalisation + météo
    ├── services/
    │   ├── weatherService.js       # Appel API Open-Meteo (gratuit, sans clé)
    │   ├── aiService.js            # Appel API Mistral avec fallback local
    │   └── storageService.js       # Persistance AsyncStorage (CRUD vêtements)
    ├── screens/
    │   ├── HomeScreen.js           # Accueil : météo + actions rapides
    │   ├── WardrobeScreen.js       # Armoire : CRUD vêtements
    │   └── ResultScreen.js         # Résultat : tenue recommandée par l'IA
    └── components/
        ├── ClothCard.js            # Carte vêtement réutilisable
        └── WeatherWidget.js        # Widget météo
```

---

## Répartition détaillée des tâches

### Steven — Interface & écrans

Responsable de tout ce que l'utilisateur voit et avec quoi il interagit.

**Fichiers produits :**
- `src/theme.js` — Palette de couleurs (dark violet), typographie, espacements, constantes de design
- `App.js` — Navigation par onglets avec React Navigation
- `src/screens/HomeScreen.js` — Écran d'accueil avec widget météo, conseils et boutons d'action
- `src/screens/WardrobeScreen.js` — Liste des vêtements avec filtres, formulaire d'ajout en modal
- `src/screens/ResultScreen.js` — Affichage de la tenue recommandée avec explication IA
- `src/components/ClothCard.js` — Composant carte vêtement réutilisable
- `src/components/WeatherWidget.js` — Composant widget météo avec gestion des états

**Choix techniques :**
- Thème dark mode avec palette violet nuit (`#0A0A0F`, `#8B7CF6`, `#C4B5FD`)
- Modal bottom sheet pour le formulaire d'ajout
- Filtres horizontaux scrollables par type de vêtement
- Gestion des états loading / error / empty dans chaque composant

---

### Julien — APIs & configuration

Responsable de la communication avec les services externes et la configuration du projet.

**Fichiers produits :**
- `babel.config.js` — Configuration Babel avec `react-native-dotenv`
- `app.json` — Configuration Expo (nom, orientation, splash, icônes)
- `.env.example` — Template des variables d'environnement
- `.gitignore` — Exclusion du `.env` et des fichiers sensibles
- `src/services/weatherService.js` — Intégration API Open-Meteo (gratuit, sans clé)
- `src/hooks/useWeather.js` — Hook React pour la géolocalisation et la météo

**Choix techniques :**
- API Open-Meteo : gratuite, sans clé, données fiables
- Décodage des codes météo WMO en descriptions françaises
- Fallback sur Paris si la géolocalisation est refusée
- Variables d'environnement via `@env` pour sécuriser les clés API

---

### Rima — Intelligence Artificielle & données

Responsable de la logique métier, du stockage et de la recommandation IA.

**Fichiers produits :**
- `src/context/WardrobeContext.js` — Contexte React global, persistance AsyncStorage, CRUD
- `src/services/aiService.js` — Intégration Mistral AI avec algorithme de fallback local
- `src/services/storageService.js` — Couche d'accès AsyncStorage (get, save, add, remove, clear)
- Données de démonstration (3 vêtements pré-chargés)
- Mode démo sans clé API (algorithme de filtrage par température et imperméabilité)

**Choix techniques :**
- AsyncStorage pour la persistance locale des données
- Prompt engineering structuré : météo + liste vêtements → JSON de recommandation
- Fallback automatique sur algorithme local si la clé API est absente ou invalide
- Parsing sécurisé du JSON retourné par l'IA avec gestion des erreurs

---

## Installation et lancement

### Prérequis

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/client) installé sur votre téléphone (iOS ou Android)

### 1. Cloner le projet

```bash
git clone https://github.com/cantau-31/react-projet-ipssi.git
cd react-projet-ipssi
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditez le fichier `.env` :

```env
# Clé API Mistral AI
IA_API_KEY=your_mistral_api_key_here

# URL météo (laisser tel quel)
WEATHER_API_URL=https://api.open-meteo.com
```

> Si vous laissez `IA_API_KEY=your_mistral_api_key_here`, l'application fonctionne en mode local (sans appel à Mistral).
> Ne jamais commiter le fichier `.env` — il est déjà dans `.gitignore`

### 4. Lancer l'application

```bash
npx expo start
```

Scannez le QR code avec Expo Go sur votre téléphone.

---

## APIs utilisées

| Service | URL | Clé requise | Usage |
|---------|-----|-------------|-------|
| Open-Meteo | https://api.open-meteo.com | Non | Météo en temps réel |
| Mistral AI | https://api.mistral.ai | Oui | Recommandation de tenue |

### Obtenir une clé API Mistral

Rendez-vous sur [console.mistral.ai](https://console.mistral.ai), créez un compte, puis générez une clé dans la section **API Keys**.

---

## Structure d'un vêtement

```json
{
  "id": "1",
  "name": "Veste noire",
  "type": "jacket",
  "style": "casual",
  "color": "black",
  "isWaterproof": true,
  "temperatureMin": 5,
  "temperatureMax": 15
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant unique (timestamp) |
| `name` | string | Nom du vêtement |
| `type` | string | `top`, `shirt`, `sweater`, `pants`, `jacket`, `coat`, `raincoat`, `shoes`... |
| `style` | string | `casual`, `formal`, `outdoor`, `sport`, `elegant` |
| `color` | string | `black`, `white`, `blue`, `grey`, `bordeaux`... |
| `isWaterproof` | boolean | Résistance à l'eau |
| `temperatureMin` | number | Température minimale recommandée (°C) |
| `temperatureMax` | number | Température maximale recommandée (°C) |

---

## Sécurité

- Ne jamais écrire une clé API directement dans le code
- Ne jamais commiter le fichier `.env` sur GitHub
- Toujours utiliser les variables d'environnement via `import { IA_API_KEY } from '@env'`
- Le fichier `.env` est listé dans `.gitignore`

---

## Evolutions possibles

### Court terme
- **Modifier un vêtement** — Ajouter un écran d'édition pour mettre à jour les informations d'un vêtement existant
- **Photos des vêtements** — Permettre à l'utilisateur de prendre une photo ou choisir une image depuis sa galerie
- **Historique des tenues** — Sauvegarder les tenues portées chaque jour pour éviter les répétitions
- **Notifications matinales** — Envoyer une notification push chaque matin avec la tenue du jour suggérée

### Moyen terme
- **Profils multiples** — Gérer plusieurs armoires (travail, sport, soirée) avec des recommandations adaptées au contexte
- **Météo sur plusieurs jours** — Préparer les tenues de la semaine à l'avance
- **Synchronisation cloud** — Sauvegarder l'armoire sur un serveur pour y accéder depuis plusieurs appareils
- **Mode hors-ligne complet** — Recommandations sans connexion internet grâce à un modèle IA embarqué léger

### Long terme
- **Reconnaissance visuelle** — Identifier automatiquement le type et la couleur d'un vêtement depuis une photo
- **Assistant vocal** — Demander une tenue à la voix via Siri ou Google Assistant
- **Machine Learning personnalisé** — Apprendre les préférences de l'utilisateur au fil du temps pour des recommandations de plus en plus précises

---

## Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0 | Toolchain & APIs natives |
| React Navigation | 7.x | Navigation entre écrans |
| AsyncStorage | 2.2.0 | Persistance locale |
| expo-location | 19.x | Géolocalisation |
| react-native-dotenv | 3.x | Variables d'environnement |
| Mistral AI | mistral-small-latest | Recommandation IA |

---

*Projet réalisé dans le cadre du cours React Native — IPSSI 2024/2025*
