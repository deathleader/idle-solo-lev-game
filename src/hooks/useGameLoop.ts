// src/hooks/useGameLoop.ts
import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getHuntingAreaById } from '../data/huntingAreas';

export const useGameLoop = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    isHunting,
    currentHuntingArea,
    huntingStartTime,
    gainExperience,
    gainGold,
    updateLastOnlineTime,
  } = useGameStore();

  useEffect(() => {
    // Update last online time every 30 seconds
    const onlineInterval = setInterval(() => {
      updateLastOnlineTime();
    }, 30000);

    return () => clearInterval(onlineInterval);
  }, [updateLastOnlineTime]);

  useEffect(() => {
    if (isHunting && currentHuntingArea && huntingStartTime) {
      const area = getHuntingAreaById(currentHuntingArea);
      if (!area) {
        useGameStore.getState().stopHunting();
        return;
      }

      const huntingLoop = () => {
        const now = Date.now();
        const timeSinceStart = now - huntingStartTime;
        
        if (timeSinceStart >= area.huntDuration) {
          // Complete hunt
          gainExperience(area.expReward);
          gainGold(area.goldReward);
          
          // Start next hunt cycle immediately
          useGameStore.setState({ huntingStartTime: now });
        }
      };

      // Start the loop immediately and then every 100ms for smooth updates
      huntingLoop();
      intervalRef.current = setInterval(huntingLoop, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHunting, currentHuntingArea, huntingStartTime, gainExperience, gainGold]);

  const getHuntingProgress = (): number => {
    if (!isHunting || !currentHuntingArea || !huntingStartTime) return 0;
    
    const area = getHuntingAreaById(currentHuntingArea);
    if (!area) return 0;

    const now = Date.now();
    const timeSinceStart = now - huntingStartTime;
    const progress = Math.min((timeSinceStart / area.huntDuration) * 100, 100);
    
    return progress;
  };

  const getRemainingTime = (): number => {
    if (!isHunting || !currentHuntingArea || !huntingStartTime) return 0;
    
    const area = getHuntingAreaById(currentHuntingArea);
    if (!area) return 0;

    const now = Date.now();
    const timeSinceStart = now - huntingStartTime;
    const remaining = Math.max(area.huntDuration - timeSinceStart, 0);
    
    return remaining;
  };

  return {
    getHuntingProgress,
    getRemainingTime,
  };
};