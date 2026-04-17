// ─────────────────────────────────────────────
//  SMART WARDROBE ASSISTANT — Design Tokens
//  Palette : Violet Night
// ─────────────────────────────────────────────

export const COLORS = {
  // Fonds
  bg:       '#0A0A0F',
  bgCard:   '#13121A',
  bgCard2:  '#1C1A26',
  bgInput:  '#1C1A26',

  // Bordures
  border:      '#252332',
  borderLight: '#3A3850',

  // Accent violet
  primary:      '#8B7CF6',
  primaryLight: '#C4B5FD',
  primaryDark:  '#6D5EE0',

  // Accent secondaire
  accent: '#5DCAA5',

  // Textes
  text:          '#EEEAF0',
  textSecondary: '#6B6880',
  textMuted:     '#4A4860',

  // Sémantique
  success: '#5DCAA5',
  warning: '#EF9F27',
  danger:  '#F09595',
  info:    '#85B7EB',

  // Couleurs vêtements
  clothColors: {
    black:    '#2C2C2A',
    white:    '#EEEAF0',
    blue:     '#378ADD',
    grey:     '#888780',
    green:    '#639922',
    red:      '#E24B4A',
    bordeaux: '#993556',
    beige:    '#BA7517',
    yellow:   '#EF9F27',
    pink:     '#D4537E',
    orange:   '#D85A30',
    purple:   '#8B7CF6',
    brown:    '#854F0B',
  },
};

export const TYPOGRAPHY = {
  sizes: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   18,
    xl:   22,
    xxl:  28,
    hero: 40,
  },
  weights: {
    light:   '300',
    regular: '400',
    medium:  '500',
    bold:    '700',
  },
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const RADIUS = {
  sm:   6,
  md:   10,
  lg:   16,
  xl:   24,
  full: 999,
};

export const CLOTH_TYPES = [
  { value: 'top',       label: 'Haut',        emoji: '👕' },
  { value: 'shirt',     label: 'Chemise',      emoji: '👔' },
  { value: 'sweater',   label: 'Pull',         emoji: '🧥' },
  { value: 'pants',     label: 'Pantalon',     emoji: '👖' },
  { value: 'shorts',    label: 'Short',        emoji: '🩳' },
  { value: 'jacket',    label: 'Veste',        emoji: '🥼' },
  { value: 'coat',      label: 'Manteau',      emoji: '🧥' },
  { value: 'raincoat',  label: 'Imperméable',  emoji: '🌂' },
  { value: 'dress',     label: 'Robe',         emoji: '👗' },
  { value: 'skirt',     label: 'Jupe',         emoji: '👗' },
  { value: 'shoes',     label: 'Chaussures',   emoji: '👟' },
  { value: 'accessory', label: 'Accessoire',   emoji: '🧣' },
];

export const CLOTH_STYLES = [
  { value: 'casual',  label: 'Casual'  },
  { value: 'formal',  label: 'Formel'  },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'sport',   label: 'Sport'   },
  { value: 'elegant', label: 'Élégant' },
];

export const CLOTH_COLORS = [
  { value: 'black',    label: 'Noir'     },
  { value: 'white',    label: 'Blanc'    },
  { value: 'grey',     label: 'Gris'     },
  { value: 'blue',     label: 'Bleu'     },
  { value: 'red',      label: 'Rouge'    },
  { value: 'green',    label: 'Vert'     },
  { value: 'yellow',   label: 'Jaune'    },
  { value: 'orange',   label: 'Orange'   },
  { value: 'pink',     label: 'Rose'     },
  { value: 'purple',   label: 'Violet'   },
  { value: 'brown',    label: 'Marron'   },
  { value: 'beige',    label: 'Beige'    },
  { value: 'bordeaux', label: 'Bordeaux' },
];

export function getClothEmoji(type) {
  return CLOTH_TYPES.find((t) => t.value === type)?.emoji ?? '👕';
}

export function getClothColorHex(colorValue) {
  return COLORS.clothColors[colorValue] ?? '#6B6880';
}

export function getClothTypeLabel(type) {
  return CLOTH_TYPES.find((t) => t.value === type)?.label ?? type;
}
