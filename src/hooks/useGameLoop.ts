// src/hooks/useGameLoop.ts
import { useEffect, useRef } from "react";
import { useGameStore } from "../stores/gameStore";
import { getHuntingAreaById } from "../data/huntingAreas";

export const useGameLoop = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const shadowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isHunting,
    currentHuntingArea,
    huntingStartTime,
    completeHunt,
    updateLastOnlineTime,
    ownedShadows,
    shadowDeployments,
    gainExperience,
    gainShadowExp,
  } = useGameStore();

  // Manual hunting loop
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
          // Complete hunt (includes shadow extraction chance)
          completeHunt();
          // The completeHunt function already updates huntingStartTime
        }
      };

      // Start the loop immediately and then every 100ms for smooth updates
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
  }, [isHunting, currentHuntingArea, huntingStartTime, completeHunt]);

  // Shadow auto-hunting loop
  useEffect(() => {
    const shadowLoop = () => {
      // Process each area with deployed shadows
      Object.entries(shadowDeployments).forEach(([areaId, shadowIds]) => {
        const area = getHuntingAreaById(areaId);
        if (!area || shadowIds.length === 0) return;

        shadowIds.forEach((shadowId) => {
          const ownedShadow = ownedShadows[shadowId];
          if (!ownedShadow || !ownedShadow.shadow.isDeployed) return;

          // Calculate exp gain for this shadow
          const shadowExpRate =
            (area.expReward / (area.huntDuration / 1000)) *
            ownedShadow.shadow.currentExpMultiplier;
          const expGain = shadowExpRate * 1; // 1 second worth of exp

          // Gain player exp (shadows farming gives player exp)
          gainExperience(expGain);

          // Gain shadow exp (shadows level up too)
          gainShadowExp(shadowId, expGain * 0.1); // Shadows gain 10% of what they generate
        });
      });
    };

    // Run shadow loop every second
    shadowIntervalRef.current = setInterval(shadowLoop, 1000);

    return () => {
      if (shadowIntervalRef.current) {
        clearInterval(shadowIntervalRef.current);
        shadowIntervalRef.current = null;
      }
    };
  }, [shadowDeployments, ownedShadows, gainExperience, gainShadowExp]);

  // Update last online time every 30 seconds
  useEffect(() => {
    const onlineInterval = setInterval(() => {
      updateLastOnlineTime();
    }, 30000);

    return () => clearInterval(onlineInterval);
  }, [updateLastOnlineTime]);

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
