// src/types/game.ts

// Base Types
export type HunterRank = "E" | "D" | "C" | "B" | "A" | "S" | "National";
export type ShadowRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";
export type EquipmentRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";
export type EquipmentType = "weapon" | "armor" | "accessory";

// Player Stats Interface
export interface PlayerStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  sense: number;
}

// Player Interface
export interface Player {
  name: string;
  level: number;
  currentExp: number;
  expToNext: number;
  rank: HunterRank;
  stats: PlayerStats;
  availableStatPoints: number;
  totalExpEarned: number;
  lastSaved: number;
}

// Shadow Drop Configuration
export interface ShadowDrop {
  shadowId: string;
  name: string;
  rarity: ShadowRarity;
  dropChance: number; // percentage (0-100)
  icon: string;
}

// Hunting Area Interface
export interface HuntingArea {
  id: string;
  name: string;
  description: string;
  level: number;
  expReward: number;
  unlockLevel: number;
  huntDuration: number; // in milliseconds
  monsters: string[];
  shadowDrops: ShadowDrop[];
}

// Shadow Interface
export interface Shadow {
  id: string;
  name: string;
  rarity: ShadowRarity;
  level: number;
  currentExp: number;
  expToNext: number;
  maxLevel: number;
  baseExpMultiplier: number;
  currentExpMultiplier: number;
  extractedFrom: string; // hunting area id where it was extracted
  isDeployed: boolean;
  deployedArea: string | null; // area id where it's currently deployed
  icon: string;
  description: string;
}

// Owned Shadow Interface
export interface OwnedShadow {
  shadowId: string; // unique instance id
  shadow: Shadow;
  extractedAt: number; // timestamp when extracted
}

// Equipment Interface
export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: EquipmentRarity;
  level: number;
  enhanceLevel: number;
  stats: Partial<PlayerStats>;
  requirements: {
    level: number;
    rank: HunterRank;
  };
  description: string;
  icon: string;
}

// Achievement Interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: {
    type: "level" | "hunt" | "shadow" | "equipment" | "exp" | "areas";
    target: number;
    current?: number;
  };
  reward: {
    type: "exp" | "statPoints" | "unlock";
    amount: number;
    description?: string;
  };
  isCompleted: boolean;
  unlockedAt?: number;
  icon: string;
}

// Shadow Rarity Configuration
export interface ShadowRarityConfig {
  baseExpMultiplier: number;
  maxLevel: number;
  color: string;
  glowColor: string;
}

// Game Settings Interface
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
  animationsEnabled: boolean;
  theme: "dark" | "light";
}

// Main Game State Interface
export interface GameState {
  // Player Data
  player: Player;

  // Hunting State
  currentHuntingArea: string | null;
  huntingStartTime: number | null;
  isHunting: boolean;

  // Shadow Army
  ownedShadows: { [shadowId: string]: OwnedShadow };
  shadowDeployments: { [areaId: string]: string[] }; // area id -> array of shadow ids

  // Progress Tracking
  achievements: Achievement[];
  unlockedAreas: string[];

  // Equipment (for future implementation)
  ownedEquipment: { [equipmentId: string]: Equipment };
  equippedItems: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
  };

  // Game Meta
  gameStartTime: number;
  lastOnlineTime: number;
  settings: GameSettings;
}

// Notification Interface
export interface GameNotification {
  id: string;
  type: "level-up" | "shadow-extracted" | "achievement" | "info";
  title: string;
  message: string;
  timestamp: number;
  duration?: number; // auto-dismiss after X milliseconds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; // additional data for the notification
}

// Shadow Army Statistics
export interface ShadowArmyStats {
  totalShadows: number;
  deployedShadows: number;
  totalExpPerSecond: number;
  shadowsByRarity: { [rarity in ShadowRarity]: number };
  averageLevel: number;
}

// Hunter Statistics
export interface HunterStats {
  totalHunts: number;
  totalExpGained: number;
  totalShadowsExtracted: number;
  areasUnlocked: number;
  currentExpPerSecond: number;
  timeSpentHunting: number; // in milliseconds
}

// Offline Progress Calculation
export interface OfflineProgress {
  timeOffline: number; // milliseconds
  expGained: number;
  shadowsLeveled: { [shadowId: string]: number }; // shadow id -> levels gained
  playerLevelsGained: number;
  areasUnlocked: string[];
}

// Future Prestige System (placeholder)
export interface PrestigeData {
  level: number;
  points: number;
  bonuses: { [bonusId: string]: number };
  totalResets: number;
  lastResetTime: number;
}

// UI State (for complex UI components)
export interface UIState {
  selectedTab: string;
  shadowManagementOpen: boolean;
  achievementsOpen: boolean;
  settingsOpen: boolean;
  notifications: GameNotification[];
}
