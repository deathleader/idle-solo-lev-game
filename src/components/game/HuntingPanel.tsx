// src/components/game/HuntingPanel.tsx
import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useGameLoop } from '../../hooks/useGameLoop';
import { HUNTING_AREAS, getAvailableAreas, getNextAreaToUnlock } from '../../data/huntingAreas';
import { formatNumber, formatTimeShort } from '../../utils/formatters';
import { 
  Swords, 
  Play, 
  Square, 
  MapPin, 
  Clock, 
  Trophy, 
  Star, 
  Lock,
  Target,
  Sword
} from 'lucide-react';

// Styles
const panelStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px',
};

const currentHuntingStyles: React.CSSProperties = {
  ...panelStyles,
  background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(37, 99, 235, 0.1))',
  border: '1px solid rgba(34, 211, 238, 0.3)',
  boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)',
};

const headerIconStyles: React.CSSProperties = {
  padding: '12px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(239, 68, 68, 0.2))',
  border: '1px solid rgba(251, 146, 60, 0.3)',
};

const progressBarStyles: React.CSSProperties = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  overflow: 'hidden',
  height: '16px',
  position: 'relative',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const progressFillStyles: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, #f97316, #ef4444)',
  borderRadius: '12px',
  transition: 'width 0.1s ease',
  boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
};

const rewardCardStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
  border: '1px solid rgba(34, 197, 94, 0.2)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
};

const goldCardStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
  border: '1px solid rgba(251, 191, 36, 0.2)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
};

const stopButtonStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
};

const areaCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '20px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
};

const activeAreaCardStyles: React.CSSProperties = {
  ...areaCardStyles,
  background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(37, 99, 235, 0.15))',
  border: '1px solid rgba(34, 211, 238, 0.4)',
  boxShadow: '0 8px 32px rgba(34, 211, 238, 0.2)',
};

const startButtonStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, #22d3ee, #2563eb)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(34, 211, 238, 0.3)',
};

const huntingButtonStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, #f97316, #ef4444)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  animation: 'pulse 2s infinite',
};

const lockedButtonStyles: React.CSSProperties = {
  backgroundColor: '#374151',
  color: '#9ca3af',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'not-allowed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
};

const monsterTagStyles: React.CSSProperties = {
  fontSize: '11px',
  backgroundColor: '#374151',
  color: '#d1d5db',
  padding: '4px 8px',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

export const HuntingPanel: React.FC = () => {
  const { 
    player, 
    isHunting, 
    currentHuntingArea, 
    startHunting, 
    stopHunting 
  } = useGameStore();
  
  const { getHuntingProgress, getRemainingTime } = useGameLoop();
  
  const availableAreas = getAvailableAreas(player.level);
  const nextArea = getNextAreaToUnlock(player.level);
  const currentArea = HUNTING_AREAS.find(area => area.id === currentHuntingArea);

  const handleStartHunting = (areaId: string) => {
    if (isHunting) {
      stopHunting();
    }
    startHunting(areaId);
  };

  const handleStopHunting = () => {
    stopHunting();
  };

  return (
    <div>
      {/* Current Hunting Status */}
      {isHunting && currentArea && (
        <div style={currentHuntingStyles}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={headerIconStyles}>
                <Target style={{width: '24px', height: '24px', color: '#f97316'}} />
              </div>
              <div>
                <h3 style={{fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', color: '#22d3ee'}}>
                  Currently Hunting
                </h3>
                <p style={{margin: 0, color: '#94a3b8', fontSize: '16px'}}>{currentArea.name}</p>
              </div>
            </div>
            <button
              onClick={handleStopHunting}
              style={stopButtonStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              <Square style={{width: '16px', height: '16px'}} />
              Stop Hunting
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
              <span style={{fontSize: '14px', fontWeight: '600', color: '#f8fafc'}}>Hunting Progress</span>
              <span style={{fontSize: '14px', color: '#22d3ee', fontWeight: '600'}}>
                {formatTimeShort(getRemainingTime())} remaining
              </span>
            </div>
            <div style={progressBarStyles}>
              <div 
                style={{...progressFillStyles, width: `${getHuntingProgress()}%`}}
              />
            </div>
          </div>

          {/* Rewards */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={rewardCardStyles}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px'}}>
                <Star style={{width: '18px', height: '18px', color: '#22c55e'}} />
                <span style={{fontSize: '14px', color: '#22c55e', fontWeight: '600'}}>EXP Reward</span>
              </div>
              <span style={{fontSize: '24px', fontWeight: '800', color: '#22c55e'}}>
                +{formatNumber(currentArea.expReward)}
              </span>
            </div>
            <div style={goldCardStyles}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px'}}>
                <Trophy style={{width: '18px', height: '18px', color: '#eab308'}} />
                <span style={{fontSize: '14px', color: '#eab308', fontWeight: '600'}}>Gold Reward</span>
              </div>
              <span style={{fontSize: '24px', fontWeight: '800', color: '#eab308'}}>
                +{formatNumber(currentArea.goldReward)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hunting Areas */}
      <div style={panelStyles}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(37, 99, 235, 0.2))',
            border: '1px solid rgba(34, 211, 238, 0.3)',
          }}>
            <Swords style={{width: '24px', height: '24px', color: '#22d3ee'}} />
          </div>
          <div>
            <h2 style={{fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0'}}>Hunting Areas</h2>
            <p style={{margin: 0, color: '#94a3b8'}}>Choose your hunting ground</p>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
          {availableAreas.map((area) => {
            const isCurrentArea = currentHuntingArea === area.id;
            const canHunt = player.level >= area.unlockLevel;

            return (
              <div
                key={area.id}
                style={isCurrentArea ? activeAreaCardStyles : areaCardStyles}
                onClick={() => canHunt && handleStartHunting(area.id)}
                onMouseEnter={(e) => {
                  if (canHunt && !isCurrentArea) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canHunt && !isCurrentArea) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                {/* Area Header */}
                <div style={{display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px'}}>
                  <div>
                    <h3 style={{fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0'}}>{area.name}</h3>
                    <p style={{margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: '1.4'}}>{area.description}</p>
                  </div>
                  {isCurrentArea && (
                    <div style={{
                      background: 'linear-gradient(135deg, #22d3ee, #2563eb)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Active
                    </div>
                  )}
                </div>

                {/* Area Stats */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <MapPin style={{width: '16px', height: '16px', color: '#64748b'}} />
                    <span style={{fontSize: '14px', color: '#94a3b8'}}>Level {area.level}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Clock style={{width: '16px', height: '16px', color: '#64748b'}} />
                    <span style={{fontSize: '14px', color: '#94a3b8'}}>
                      {(area.huntDuration / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Rewards */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    borderRadius: '8px',
                    padding: '10px'
                  }}>
                    <div style={{fontSize: '11px', color: '#22c55e', marginBottom: '4px', fontWeight: '600'}}>EXP</div>
                    <div style={{fontSize: '16px', fontWeight: '700', color: '#22c55e'}}>
                      +{formatNumber(area.expReward)}
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    borderRadius: '8px',
                    padding: '10px'
                  }}>
                    <div style={{fontSize: '11px', color: '#eab308', marginBottom: '4px', fontWeight: '600'}}>Gold</div>
                    <div style={{fontSize: '16px', fontWeight: '700', color: '#eab308'}}>
                      +{formatNumber(area.goldReward)}
                    </div>
                  </div>
                </div>

                {/* Monsters */}
                <div style={{marginBottom: '16px'}}>
                  <div style={{fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: '600'}}>Monsters:</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                    {area.monsters.map((monster, index) => (
                      <span key={index} style={monsterTagStyles}>
                        {monster}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {canHunt ? (
                  <button
                    style={isCurrentArea ? huntingButtonStyles : startButtonStyles}
                    onMouseEnter={(e) => {
                      if (!isCurrentArea) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 211, 238, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrentArea) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 211, 238, 0.3)';
                      }
                    }}
                  >
                    {isCurrentArea ? (
                      <>
                        <Sword style={{width: '16px', height: '16px'}} />
                        Hunting...
                      </>
                    ) : (
                      <>
                        <Play style={{width: '16px', height: '16px'}} />
                        Start Hunting
                      </>
                    )}
                  </button>
                ) : (
                  <button style={lockedButtonStyles}>
                    <Lock style={{width: '16px', height: '16px'}} />
                    Requires Level {area.unlockLevel}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Area to Unlock */}
        {nextArea && (
          <div style={{
            marginTop: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(71, 85, 105, 0.1))',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            borderRadius: '12px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Lock style={{width: '20px', height: '20px', color: '#64748b'}} />
              <div>
                <h4 style={{fontWeight: '600', color: '#e2e8f0', margin: '0 0 4px 0'}}>Next Area: {nextArea.name}</h4>
                <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>
                  Unlocks at level {nextArea.unlockLevel} 
                  <span style={{color: '#22d3ee', fontWeight: '600'}}>
                    {' '}({nextArea.unlockLevel - player.level} levels to go)
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};