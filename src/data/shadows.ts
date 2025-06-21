// src/data/shadows.ts
// src/data/shadows.ts
import type { Shadow, ShadowRarity } from "../types/game";

// Shadow rarity configurations
export const SHADOW_RARITY_CONFIG = {
  common: {
    baseExpMultiplier: 0.5,
    maxLevel: 20,
    color: "#9ca3af",
    glowColor: "rgba(156, 163, 175, 0.3)",
  },
  uncommon: {
    baseExpMultiplier: 0.8,
    maxLevel: 30,
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.3)",
  },
  rare: {
    baseExpMultiplier: 1.2,
    maxLevel: 50,
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.3)",
  },
  epic: {
    baseExpMultiplier: 2.0,
    maxLevel: 75,
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.3)",
  },
  legendary: {
    baseExpMultiplier: 5.0,
    maxLevel: 100,
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.3)",
  },
};

// Shadow templates - used to create actual shadow instances
export const SHADOW_TEMPLATES: {
  [shadowId: string]: Omit<
    Shadow,
    | "level"
    | "currentExp"
    | "expToNext"
    | "currentExpMultiplier"
    | "isDeployed"
    | "deployedArea"
  >;
} = {
  "goblin-shadow": {
    id: "goblin-shadow",
    name: "Goblin Shadow",
    rarity: "common",
    maxLevel: SHADOW_RARITY_CONFIG.common.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.common.baseExpMultiplier,
    extractedFrom: "goblin-cave",
    icon: "👹",
    description: "A simple goblin shadow. Weak but reliable for basic farming.",
  },
  "goblin-warrior-shadow": {
    id: "goblin-warrior-shadow",
    name: "Goblin Warrior Shadow",
    rarity: "uncommon",
    maxLevel: SHADOW_RARITY_CONFIG.uncommon.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.uncommon.baseExpMultiplier,
    extractedFrom: "goblin-cave",
    icon: "⚔️",
    description: "An enhanced goblin with basic combat training.",
  },
  "spider-shadow": {
    id: "spider-shadow",
    name: "Spider Shadow",
    rarity: "common",
    maxLevel: SHADOW_RARITY_CONFIG.common.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.common.baseExpMultiplier,
    extractedFrom: "spider-den",
    icon: "🕷️",
    description: "Fast and agile, perfect for quick farming runs.",
  },
  "poison-spider-shadow": {
    id: "poison-spider-shadow",
    name: "Poison Spider Shadow",
    rarity: "rare",
    maxLevel: SHADOW_RARITY_CONFIG.rare.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.rare.baseExpMultiplier,
    extractedFrom: "spider-den",
    icon: "🟢",
    description: "Venomous attacks make this shadow highly effective.",
  },
  "orc-warrior-shadow": {
    id: "orc-warrior-shadow",
    name: "Orc Warrior Shadow",
    rarity: "uncommon",
    maxLevel: SHADOW_RARITY_CONFIG.uncommon.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.uncommon.baseExpMultiplier,
    extractedFrom: "orc-stronghold",
    icon: "🧌",
    description: "Strong and durable, excellent for sustained farming.",
  },
  "orc-shaman-shadow": {
    id: "orc-shaman-shadow",
    name: "Orc Shaman Shadow",
    rarity: "rare",
    maxLevel: SHADOW_RARITY_CONFIG.rare.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.rare.baseExpMultiplier,
    extractedFrom: "orc-stronghold",
    icon: "🔮",
    description: "Magic-enhanced shadow with powerful abilities.",
  },
  "orc-chieftain-shadow": {
    id: "orc-chieftain-shadow",
    name: "Orc Chieftain Shadow",
    rarity: "epic",
    maxLevel: SHADOW_RARITY_CONFIG.epic.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.epic.baseExpMultiplier,
    extractedFrom: "orc-stronghold",
    icon: "👑",
    description: "A legendary leader shadow with exceptional power.",
  },
  "skeleton-shadow": {
    id: "skeleton-shadow",
    name: "Skeleton Shadow",
    rarity: "common",
    maxLevel: SHADOW_RARITY_CONFIG.common.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.common.baseExpMultiplier,
    extractedFrom: "undead-crypt",
    icon: "💀",
    description: "Undead shadow that never tires.",
  },
  "wraith-shadow": {
    id: "wraith-shadow",
    name: "Wraith Shadow",
    rarity: "rare",
    maxLevel: SHADOW_RARITY_CONFIG.rare.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.rare.baseExpMultiplier,
    extractedFrom: "undead-crypt",
    icon: "👻",
    description: "Ethereal shadow that phases through obstacles.",
  },
  "lich-shadow": {
    id: "lich-shadow",
    name: "Lich Shadow",
    rarity: "epic",
    maxLevel: SHADOW_RARITY_CONFIG.epic.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.epic.baseExpMultiplier,
    extractedFrom: "undead-crypt",
    icon: "🧙‍♂️",
    description: "Ancient magical shadow with immense power.",
  },
  "dragon-whelp-shadow": {
    id: "dragon-whelp-shadow",
    name: "Dragon Whelp Shadow",
    rarity: "rare",
    maxLevel: SHADOW_RARITY_CONFIG.rare.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.rare.baseExpMultiplier,
    extractedFrom: "dragon-lair",
    icon: "🐉",
    description: "Young dragon shadow with growing potential.",
  },
  "drake-shadow": {
    id: "drake-shadow",
    name: "Drake Shadow",
    rarity: "epic",
    maxLevel: SHADOW_RARITY_CONFIG.epic.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.epic.baseExpMultiplier,
    extractedFrom: "dragon-lair",
    icon: "🔥",
    description: "Fierce drake shadow with fire-based attacks.",
  },
  "ancient-dragon-shadow": {
    id: "ancient-dragon-shadow",
    name: "Ancient Dragon Shadow",
    rarity: "legendary",
    maxLevel: SHADOW_RARITY_CONFIG.legendary.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.legendary.baseExpMultiplier,
    extractedFrom: "dragon-lair",
    icon: "🐲",
    description: "The ultimate shadow - an ancient dragon of immense power.",
  },
  "shadow-beast-shadow": {
    id: "shadow-beast-shadow",
    name: "Shadow Beast Shadow",
    rarity: "epic",
    maxLevel: SHADOW_RARITY_CONFIG.epic.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.epic.baseExpMultiplier,
    extractedFrom: "shadow-realm",
    icon: "🌑",
    description: "Pure shadow entity from another dimension.",
  },
  "void-walker-shadow": {
    id: "void-walker-shadow",
    name: "Void Walker Shadow",
    rarity: "legendary",
    maxLevel: SHADOW_RARITY_CONFIG.legendary.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.legendary.baseExpMultiplier,
    extractedFrom: "shadow-realm",
    icon: "🌌",
    description: "Transcendent shadow that walks between dimensions.",
  },
  "lesser-monarch-shadow": {
    id: "lesser-monarch-shadow",
    name: "Lesser Monarch Shadow",
    rarity: "legendary",
    maxLevel: SHADOW_RARITY_CONFIG.legendary.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.legendary.baseExpMultiplier,
    extractedFrom: "monarch-domain",
    icon: "👹",
    description: "A shadow of royal lineage with incredible power.",
  },
  "monarch-shadow": {
    id: "monarch-shadow",
    name: "Monarch Shadow",
    rarity: "legendary",
    maxLevel: SHADOW_RARITY_CONFIG.legendary.maxLevel,
    baseExpMultiplier: SHADOW_RARITY_CONFIG.legendary.baseExpMultiplier * 1.5, // Special bonus
    extractedFrom: "monarch-domain",
    icon: "👑",
    description: "The shadow of a true Monarch - apex of shadow power.",
  },
};

export const createShadowInstance = (shadowId: string): Shadow => {
  const template = SHADOW_TEMPLATES[shadowId];
  if (!template) {
    throw new Error(`Shadow template not found: ${shadowId}`);
  }

  return {
    ...template,
    level: 1,
    currentExp: 0,
    expToNext: 100,
    currentExpMultiplier: template.baseExpMultiplier,
    isDeployed: false,
    deployedArea: null,
  };
};

export const getShadowTemplate = (shadowId: string) => {
  return SHADOW_TEMPLATES[shadowId];
};

export const calculateShadowExpToNext = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const calculateShadowExpMultiplier = (shadow: Shadow): number => {
  // Base multiplier + level bonus
  const levelBonus = (shadow.level - 1) * 0.1; // +10% per level
  return shadow.baseExpMultiplier * (1 + levelBonus);
};

export const getRarityColor = (rarity: ShadowRarity): string => {
  return SHADOW_RARITY_CONFIG[rarity].color;
};

export const getRarityGlow = (rarity: ShadowRarity): string => {
  return SHADOW_RARITY_CONFIG[rarity].glowColor;
};
