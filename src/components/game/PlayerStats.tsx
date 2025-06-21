// src/components/game/PlayerStats.tsx
import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { formatNumber } from '../../utils/formatters';
import { User, Zap, Star, Trophy } from 'lucide-react';

const panelStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '24px',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
};

const avatarStyles: React.CSSProperties = {
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: 'rgba(34, 211, 238, 0.2)',
  border: '1px solid rgba(34, 211, 238, 0.3)',
};

const expBarContainer: React.CSSProperties = {
  marginBottom: '24px',
};

const expBarStyles: React.CSSProperties = {
  backgroundColor: '#1e293b',
  borderRadius: '9999px',
  overflow: 'hidden',
  height: '12px',
  marginBottom: '4px',
};

const expBarFillStyles: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(to right, #10b981, #059669)',
  transition: 'width 0.5s ease',
};

const statsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  marginBottom: '24px',
};

const statCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '12px',
};

const statSenseStyles: React.CSSProperties = {
  ...statCardStyles,
  gridColumn: 'span 2',
};

const resourcesStyles: React.CSSProperties = {
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  paddingTop: '16px',
};

const statPointsAlertStyles: React.CSSProperties = {
  marginTop: '16px',
  padding: '12px',
  background: 'linear-gradient(to right, rgba(34, 211, 238, 0.1), rgba(37, 99, 235, 0.1))',
  border: '1px solid rgba(34, 211, 238, 0.2)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export const PlayerStats: React.FC = () => {
  const { player, getExpPercentage } = useGameStore();

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'E': return '#9ca3af';
      case 'D': return '#4ade80';
      case 'C': return '#60a5fa';
      case 'B': return '#a855f7';
      case 'A': return '#fb923c';
      case 'S': return '#f87171';
      case 'National': return '#facc15';
      default: return '#9ca3af';
    }
  };

  return (
    <div style={panelStyles}>
      <div style={headerStyles}>
        <div style={{...avatarStyles, boxShadow: `0 0 10px ${getRankColor(player.rank)}30`}}>
          <User style={{width: '24px', height: '24px', color: getRankColor(player.rank)}} />
        </div>
        <div>
          <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', margin: 0}}>{player.name}</h2>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '0.875rem', fontWeight: '500', color: getRankColor(player.rank)}}>
              {player.rank}-Rank Hunter
            </span>
            <span style={{color: '#94a3b8'}}>• Level {player.level}</span>
          </div>
        </div>
      </div>

      {/* Experience Bar */}
      <div style={expBarContainer}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <span style={{fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
            <Star style={{width: '16px', height: '16px', color: '#facc15'}} />
            Experience
          </span>
          <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>
            {formatNumber(player.currentExp)} / {formatNumber(player.expToNext)}
          </span>
        </div>
        <div style={expBarStyles}>
          <div 
            style={{...expBarFillStyles, width: `${getExpPercentage()}%`}}
          />
        </div>
        <div style={{fontSize: '0.75rem', color: '#64748b', marginTop: '4px'}}>
          {getExpPercentage().toFixed(1)}% to next level
        </div>
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
            <div style={{width: '8px', height: '8px', backgroundColor: '#f87171', borderRadius: '50%'}}></div>
            <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Strength</span>
          </div>
          <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#f87171'}}>
            {formatNumber(player.stats.strength)}
          </span>
        </div>

        <div style={statCardStyles}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
            <div style={{width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%'}}></div>
            <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Agility</span>
          </div>
          <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#4ade80'}}>
            {formatNumber(player.stats.agility)}
          </span>
        </div>

        <div style={statCardStyles}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
            <div style={{width: '8px', height: '8px', backgroundColor: '#60a5fa', borderRadius: '50%'}}></div>
            <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Intelligence</span>
          </div>
          <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#60a5fa'}}>
            {formatNumber(player.stats.intelligence)}
          </span>
        </div>

        <div style={statCardStyles}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
            <div style={{width: '8px', height: '8px', backgroundColor: '#a855f7', borderRadius: '50%'}}></div>
            <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Vitality</span>
          </div>
          <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#a855f7'}}>
            {formatNumber(player.stats.vitality)}
          </span>
        </div>

        <div style={statSenseStyles}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
            <div style={{width: '8px', height: '8px', backgroundColor: '#facc15', borderRadius: '50%'}}></div>
            <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Sense</span>
          </div>
          <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#facc15'}}>
            {formatNumber(player.stats.sense)}
          </span>
        </div>
      </div>

      {/* Resources */}
      <div style={resourcesStyles}>
        <h3 style={{fontSize: '0.875rem', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0'}}>
          <Trophy style={{width: '16px', height: '16px', color: '#facc15'}} />
          Resources
        </h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>Gold</span>
            <span style={{color: '#facc15', fontWeight: '500'}}>
              {formatNumber(player.currencies.gold)}
            </span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>Crystals</span>
            <span style={{color: '#22d3ee', fontWeight: '500'}}>
              {formatNumber(player.currencies.crystals)}
            </span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>Shadow Essence</span>
            <span style={{color: '#a855f7', fontWeight: '500'}}>
              {formatNumber(player.currencies.shadowEssence)}
            </span>
          </div>
        </div>
      </div>

      {/* Available Stat Points Indicator */}
      {player.availableStatPoints > 0 && (
        <div style={statPointsAlertStyles}>
          <Zap style={{width: '16px', height: '16px', color: '#22d3ee'}} />
          <span style={{fontSize: '0.875rem', fontWeight: '500', color: '#22d3ee'}}>
            {player.availableStatPoints} stat points available!
          </span>
        </div>
      )}
    </div>
  );
};