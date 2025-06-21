// src/hooks/useOfflineProgress.ts
import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getHuntingAreaById } from '../data/huntingAreas';

export const useOfflineProgress = () => {
  const {
    lastOnlineTime,
    isHunting,
    currentHuntingArea,
    gainExperience,
    gainGold,
    updateLastOnlineTime,
  } = useGameStore();

  useEffect(() => {
    const calculateOfflineProgress = () => {
      const now = Date.now();
      const offlineTime = now - lastOnlineTime;
      
      // Only calculate if offline for more than 1 minute
      if (offlineTime < 60000) return null;
      
      // Only calculate if was hunting
      if (!isHunting || !currentHuntingArea) return null;
      
      const area = getHuntingAreaById(currentHuntingArea);
      if (!area) return null;

      // Calculate how many complete hunts could have been done
      const completedHunts = Math.floor(offlineTime / area.huntDuration);
      
      if (completedHunts > 0) {
        const totalExp = completedHunts * area.expReward;
        const totalGold = completedHunts * area.goldReward;
        
        return {
          timeOffline: offlineTime,
          huntsCompleted: completedHunts,
          expGained: totalExp,
          goldGained: totalGold,
          areaName: area.name,
        };
      }
      
      return null;
    };

    const offlineProgress = calculateOfflineProgress();
    
    if (offlineProgress) {
      // Apply offline rewards
      gainExperience(offlineProgress.expGained);
      gainGold(offlineProgress.goldGained);
      
      // Show offline progress modal (we'll implement this later)
      console.log('Offline Progress:', offlineProgress);
    }
    
    // Update last online time
    updateLastOnlineTime();
  }, []); // Run only once on mount

  return null;
};