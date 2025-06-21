// src/types/game.ts

export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'National';

export interface PlayerStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  sense: number;
}

export interface Player {
  name: string;
  level: number;
  currentExp: number;
  expToNext: number;
  rank: HunterRank;
  stats: PlayerStats;
  availableStatPoints: number;
  currencies: {
    gold: number;
    crystals: number;
    shadowEssence: number;
  };
  lastSaved: number;
  totalPlayTime: number;
}

export interface HuntingArea {
  id: string;
  name: string;
  description: string;
  level: number;
  expReward: number;
  goldReward: number;
  unlockLevel: number;
  huntDuration: number; // in milliseconds
  imageUrl?: string;
  monsters: string[];
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  level: number;
  enhanceLevel: number;
  stats: Partial<PlayerStats>;
  requirements: {
    level: number;
    rank: HunterRank;
  };
  price: number;
}

export interface Shadow {
  id: string;
  name: string;
  level: number;
  rarity: 'common' | 'elite' | 'boss' | 'monarch';
  stats: PlayerStats;
  abilities: string[];
  isActive: boolean;
  extractedFrom: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: {
    type: 'level' | 'hunt' | 'gold' | 'equipment' | 'shadow';
    target: number;
  };
  reward: {
    type: 'gold' | 'exp' | 'crystals' | 'statPoints';
    amount: number;
  };
  isCompleted: boolean;
  unlockedAt?: number;
}

export interface GameState {
  player: Player;
  currentHuntingArea: string | null;
  huntingStartTime: number | null;
  isHunting: boolean;
  achievements: Achievement[];
  unlockedAreas: string[];
  gameStartTime: number;
  lastOnlineTime: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
  theme: 'dark' | 'light';
}