// src/stores/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Player, HunterRank, PlayerStats } from '../types/game';

const initialPlayerStats: PlayerStats = {
  strength: 10,
  agility: 10,
  intelligence: 10,
  vitality: 10,
  sense: 10,
};

const createInitialPlayer = (): Player => ({
  name: 'Sung Jin-Woo',
  level: 1,
  currentExp: 0,
  expToNext: 100,
  rank: 'E',
  stats: { ...initialPlayerStats },
  availableStatPoints: 0,
  currencies: {
    gold: 0,
    crystals: 0,
    shadowEssence: 0,
  },
  lastSaved: Date.now(),
  totalPlayTime: 0,
});

const initialGameState: GameState = {
  player: createInitialPlayer(),
  currentHuntingArea: null,
  huntingStartTime: null,
  isHunting: false,
  achievements: [],
  unlockedAreas: ['goblin-cave'], // Starting area
  gameStartTime: Date.now(),
  lastOnlineTime: Date.now(),
};

interface GameStore extends GameState {
  // Actions
  gainExperience: (amount: number) => void;
  gainGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  levelUp: () => void;
  allocateStatPoint: (stat: keyof PlayerStats) => void;
  startHunting: (areaId: string) => void;
  stopHunting: () => void;
  updateLastOnlineTime: () => void;
  resetGame: () => void;
  
  // Computed values
  getTotalStats: () => PlayerStats;
  canLevelUp: () => boolean;
  getExpPercentage: () => number;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameState,

      // Experience and leveling
      gainExperience: (amount: number) => {
        set((state) => {
          let newExp = state.player.currentExp + amount;
          let newLevel = state.player.level;
          let newExpToNext = state.player.expToNext;
          let newStatPoints = state.player.availableStatPoints;
          
          // Handle multiple level ups
          while (newExp >= newExpToNext) {
            newExp -= newExpToNext;
            newLevel++;
            newStatPoints += 5; // 5 points per level
            newExpToNext = Math.floor(newExpToNext * 1.2); // 20% increase per level
          }
          
          return {
            ...state,
            player: {
              ...state.player,
              level: newLevel,
              currentExp: newExp,
              expToNext: newExpToNext,
              availableStatPoints: newStatPoints,
            },
          };
        });
      },

      // Gold management
      gainGold: (amount: number) => {
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            currencies: {
              ...state.player.currencies,
              gold: state.player.currencies.gold + amount,
            },
          },
        }));
      },

      spendGold: (amount: number) => {
        const currentGold = get().player.currencies.gold;
        if (currentGold >= amount) {
          set((state) => ({
            ...state,
            player: {
              ...state.player,
              currencies: {
                ...state.player.currencies,
                gold: state.player.currencies.gold - amount,
              },
            },
          }));
          return true;
        }
        return false;
      },

      // Level up system
      levelUp: () => {
        set((state) => {
          const player = state.player;
          const expNeeded = player.expToNext;
          
          if (player.currentExp >= expNeeded) {
            const newLevel = player.level + 1;
            const remainingExp = player.currentExp - expNeeded;
            const newExpToNext = Math.floor(expNeeded * 1.2); // 20% increase per level
            
            return {
              ...state,
              player: {
                ...player,
                level: newLevel,
                currentExp: remainingExp,
                expToNext: newExpToNext,
                availableStatPoints: player.availableStatPoints + 5, // 5 points per level
              },
            };
          }
          return state;
        });
      },

      // Stat allocation
      allocateStatPoint: (stat: keyof PlayerStats) => {
        set((state) => {
          if (state.player.availableStatPoints > 0) {
            return {
              ...state,
              player: {
                ...state.player,
                stats: {
                  ...state.player.stats,
                  [stat]: state.player.stats[stat] + 1,
                },
                availableStatPoints: state.player.availableStatPoints - 1,
              },
            };
          }
          return state;
        });
      },

      // Hunting system
      startHunting: (areaId: string) => {
        set((state) => ({
          ...state,
          currentHuntingArea: areaId,
          huntingStartTime: Date.now(),
          isHunting: true,
        }));
      },

      stopHunting: () => {
        set((state) => ({
          ...state,
          currentHuntingArea: null,
          huntingStartTime: null,
          isHunting: false,
        }));
      },

      // Utility functions
      updateLastOnlineTime: () => {
        set((state) => ({
          ...state,
          lastOnlineTime: Date.now(),
        }));
      },

      resetGame: () => {
        set(() => ({
          ...initialGameState,
          gameStartTime: Date.now(),
          lastOnlineTime: Date.now(),
        }));
      },

      // Computed values
      getTotalStats: () => {
        const { stats } = get().player;
        // Later we'll add equipment bonuses here
        return { ...stats };
      },

      canLevelUp: () => {
        const { currentExp, expToNext } = get().player;
        return currentExp >= expToNext;
      },

      getExpPercentage: () => {
        const { currentExp, expToNext } = get().player;
        return Math.min((currentExp / expToNext) * 100, 100);
      },
    }),
    {
      name: 'solo-leveling-game',
      version: 1,
      partialize: (state) => ({
        player: state.player,
        achievements: state.achievements,
        unlockedAreas: state.unlockedAreas,
        gameStartTime: state.gameStartTime,
      }),
    }
  )
);