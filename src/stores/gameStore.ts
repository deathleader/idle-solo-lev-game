// src/stores/gameStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, Player, PlayerStats, Shadow } from "../types/game";
import {
  createShadowInstance,
  calculateShadowExpMultiplier,
  calculateShadowExpToNext,
} from "../data/shadows";
import { getHuntingAreaById } from "../data/huntingAreas";

const initialPlayerStats: PlayerStats = {
  strength: 10,
  agility: 10,
  intelligence: 10,
  vitality: 10,
  sense: 10,
};

const createInitialPlayer = (): Player => ({
  name: "Sung Jin-Woo",
  level: 1,
  currentExp: 0,
  expToNext: 100,
  rank: "E",
  stats: { ...initialPlayerStats },
  availableStatPoints: 0,
  totalExpEarned: 0,
  lastSaved: Date.now(),
});

const initialGameState: GameState = {
  player: createInitialPlayer(),
  currentHuntingArea: null,
  huntingStartTime: null,
  isHunting: false,
  ownedShadows: {},
  shadowDeployments: {},
  achievements: [],
  unlockedAreas: ["goblin-cave"], // Starting area
  ownedEquipment: {},
  equippedItems: {
    weapon: null,
    armor: null,
    accessory: null,
  },
  gameStartTime: Date.now(),
  lastOnlineTime: Date.now(),
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    autoSaveInterval: 30000, // 30 seconds
    notificationsEnabled: true,
    animationsEnabled: true,
    theme: "dark",
  },
};

interface GameStore extends GameState {
  // Player Actions
  gainExperience: (amount: number) => void;
  allocateStatPoint: (stat: keyof PlayerStats) => void;
  levelUp: () => void;

  // Hunting Actions
  startHunting: (areaId: string) => void;
  stopHunting: () => void;
  completeHunt: () => void;

  // Shadow Actions
  extractShadow: (shadowId: string) => boolean;
  deployShadow: (shadowId: string, areaId: string) => boolean;
  recallShadow: (shadowId: string) => boolean;
  gainShadowExp: (shadowId: string, exp: number) => void;

  // Utility Functions
  updateLastOnlineTime: () => void;
  resetGame: () => void;

  // Computed Values
  canLevelUp: () => boolean;
  getExpPercentage: () => number;
  getTotalShadows: () => number;
  getDeployedShadows: () => Shadow[];
  getShadowExpPerSecond: () => number;
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
          const newTotalExp = state.player.totalExpEarned + amount;

          // Handle multiple level ups
          while (newExp >= newExpToNext) {
            newExp -= newExpToNext;
            newLevel++;
            newStatPoints += 5; // 5 points per level
            newExpToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1)); // Exponential scaling
          }

          return {
            ...state,
            player: {
              ...state.player,
              level: newLevel,
              currentExp: newExp,
              expToNext: newExpToNext,
              availableStatPoints: newStatPoints,
              totalExpEarned: newTotalExp,
            },
          };
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

      // Level up function (manual trigger)
      levelUp: () => {
        const state = get();
        if (state.player.currentExp >= state.player.expToNext) {
          get().gainExperience(0); // Trigger level up logic
        }
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

      completeHunt: () => {
        const state = get();
        if (!state.currentHuntingArea || !state.isHunting) return;

        const area = getHuntingAreaById(state.currentHuntingArea);
        if (!area) return;

        // Gain experience
        get().gainExperience(area.expReward);

        // Check for shadow extraction
        area.shadowDrops.forEach((shadowDrop) => {
          const rand = Math.random() * 100;
          if (rand <= shadowDrop.dropChance) {
            get().extractShadow(shadowDrop.shadowId);
          }
        });

        // Reset hunting start time for next cycle
        set((state) => ({
          ...state,
          huntingStartTime: Date.now(),
        }));
      },

      // Shadow extraction
      extractShadow: (shadowId: string) => {
        try {
          const newShadow = createShadowInstance(shadowId);
          const uniqueId = `${shadowId}-${Date.now()}`;

          set((state) => ({
            ...state,
            ownedShadows: {
              ...state.ownedShadows,
              [uniqueId]: {
                shadowId: uniqueId,
                shadow: { ...newShadow, id: uniqueId },
                extractedAt: Date.now(),
              },
            },
          }));
          return true;
        } catch (error) {
          console.error("Failed to extract shadow:", error);
          return false;
        }
      },

      // Deploy shadow to hunting area
      deployShadow: (shadowId: string, areaId: string) => {
        set((state) => {
          const shadow = state.ownedShadows[shadowId];
          if (!shadow || shadow.shadow.isDeployed) return state;

          const newShadowDeployments = { ...state.shadowDeployments };
          if (!newShadowDeployments[areaId]) {
            newShadowDeployments[areaId] = [];
          }

          // Add shadow to area (multiple shadows allowed)
          newShadowDeployments[areaId].push(shadowId);

          return {
            ...state,
            ownedShadows: {
              ...state.ownedShadows,
              [shadowId]: {
                ...shadow,
                shadow: {
                  ...shadow.shadow,
                  isDeployed: true,
                  deployedArea: areaId,
                },
              },
            },
            shadowDeployments: newShadowDeployments,
          };
        });
        return true;
      },

      // Recall shadow from hunting
      recallShadow: (shadowId: string) => {
        set((state) => {
          const shadow = state.ownedShadows[shadowId];
          if (!shadow || !shadow.shadow.isDeployed) return state;

          const deployedArea = shadow.shadow.deployedArea;
          const newShadowDeployments = { ...state.shadowDeployments };

          if (deployedArea && newShadowDeployments[deployedArea]) {
            newShadowDeployments[deployedArea] = newShadowDeployments[
              deployedArea
            ].filter((id) => id !== shadowId);
          }

          return {
            ...state,
            ownedShadows: {
              ...state.ownedShadows,
              [shadowId]: {
                ...shadow,
                shadow: {
                  ...shadow.shadow,
                  isDeployed: false,
                  deployedArea: null,
                },
              },
            },
            shadowDeployments: newShadowDeployments,
          };
        });
        return true;
      },

      // Shadow experience gain
      gainShadowExp: (shadowId: string, exp: number) => {
        set((state) => {
          const ownedShadow = state.ownedShadows[shadowId];
          if (!ownedShadow) return state;

          const shadow = ownedShadow.shadow;
          let newExp = shadow.currentExp + exp;
          let newLevel = shadow.level;
          let newExpToNext = shadow.expToNext;

          // Handle shadow level ups
          while (newExp >= newExpToNext && newLevel < shadow.maxLevel) {
            newExp -= newExpToNext;
            newLevel++;
            newExpToNext = calculateShadowExpToNext(newLevel);
          }

          // Recalculate multiplier based on new level
          const newMultiplier = calculateShadowExpMultiplier({
            ...shadow,
            level: newLevel,
          });

          return {
            ...state,
            ownedShadows: {
              ...state.ownedShadows,
              [shadowId]: {
                ...ownedShadow,
                shadow: {
                  ...shadow,
                  level: newLevel,
                  currentExp: newExp,
                  expToNext: newExpToNext,
                  currentExpMultiplier: newMultiplier,
                },
              },
            },
          };
        });
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
      canLevelUp: () => {
        const { currentExp, expToNext } = get().player;
        return currentExp >= expToNext;
      },

      getExpPercentage: () => {
        const { currentExp, expToNext } = get().player;
        return Math.min((currentExp / expToNext) * 100, 100);
      },

      getTotalShadows: () => {
        return Object.keys(get().ownedShadows).length;
      },

      getDeployedShadows: () => {
        const { ownedShadows } = get();
        return Object.values(ownedShadows)
          .filter((shadow) => shadow.shadow.isDeployed)
          .map((shadow) => shadow.shadow);
      },

      getShadowExpPerSecond: () => {
        const { ownedShadows, shadowDeployments } = get();
        let totalExpPerSecond = 0;

        Object.entries(shadowDeployments).forEach(([areaId, shadowIds]) => {
          const area = getHuntingAreaById(areaId);
          if (!area) return;

          // Calculate base EXP rate for this area
          const baseExpPerSecond = area.expReward / (area.huntDuration / 1000);

          shadowIds.forEach((shadowId) => {
            const ownedShadow = ownedShadows[shadowId];
            if (ownedShadow && ownedShadow.shadow.isDeployed) {
              // Each shadow contributes based on its multiplier
              const shadowExpRate =
                baseExpPerSecond * ownedShadow.shadow.currentExpMultiplier;
              totalExpPerSecond += shadowExpRate;
            }
          });
        });

        return totalExpPerSecond;
      },

      // Get shadows deployed in specific area
      getShadowsInArea: (areaId: string) => {
        const { ownedShadows, shadowDeployments } = get();
        const deployedIds = shadowDeployments[areaId] || [];
        return deployedIds
          .map((id) => ownedShadows[id]?.shadow)
          .filter(Boolean);
      },
    }),
    {
      name: "solo-leveling-game",
      version: 2,
      partialize: (state) => ({
        player: state.player,
        ownedShadows: state.ownedShadows,
        shadowDeployments: state.shadowDeployments,
        achievements: state.achievements,
        unlockedAreas: state.unlockedAreas,
        gameStartTime: state.gameStartTime,
      }),
    }
  )
);
