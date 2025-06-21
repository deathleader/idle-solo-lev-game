// src/components/ui/LevelUpNotification.tsx
import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Star, Zap, Sparkles } from 'lucide-react';

const notificationStyles: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 1000,
  minWidth: '320px',
  maxWidth: '400px',
};

const cardStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))',
  backdropFilter: 'blur(16px)',
  border: '2px solid rgba(251, 191, 36, 0.6)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 20px 40px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2)',
  animation: 'levelUpSlide 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), levelUpGlow 2s ease-in-out infinite alternate',
  position: 'relative',
  overflow: 'hidden',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '12px',
};

const iconContainerStyles: React.CSSProperties = {
  position: 'relative',
  padding: '12px',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
};

const sparkleStyles: React.CSSProperties = {
  position: 'absolute',
  color: 'rgba(255, 255, 255, 0.8)',
  animation: 'sparkle 1.5s ease-in-out infinite',
};

const titleStyles: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '900',
  color: '#1f2937',
  margin: 0,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  letterSpacing: '0.5px',
};

const levelTextStyles: React.CSSProperties = {
  fontSize: '16px',
  color: '#374151',
  margin: 0,
  fontWeight: '600',
};

const statPointsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  padding: '8px 12px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

const statPointsTextStyles: React.CSSProperties = {
  fontSize: '14px',
  color: '#1f2937',
  fontWeight: '700',
  margin: 0,
};

// Inject keyframes
const injectKeyframes = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes levelUpSlide {
      0% {
        transform: translateX(100%) scale(0.8);
        opacity: 0;
      }
      100% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }
    
    @keyframes levelUpGlow {
      0% {
        box-shadow: 0 20px 40px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2);
      }
      100% {
        box-shadow: 0 20px 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.4);
      }
    }
    
    @keyframes sparkle {
      0%, 100% {
        opacity: 0;
        transform: scale(0.5) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
      }
    }
    
    @keyframes fadeOut {
      0% {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
      }
    }
  `;
  document.head.appendChild(styleSheet);
};

export const LevelUpNotification: React.FC = () => {
  const { player } = useGameStore();
  const [lastLevel, setLastLevel] = useState(player.level);
  const [showNotification, setShowNotification] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Inject keyframes on mount
    injectKeyframes();
  }, []);

  useEffect(() => {
    if (player.level > lastLevel) {
      setShowNotification(true);
      setIsClosing(false);
      setLastLevel(player.level);
      
      // Start fade out after 4 seconds
      const fadeTimer = setTimeout(() => {
        setIsClosing(true);
      }, 4000);

      // Hide notification after fade animation
      const hideTimer = setTimeout(() => {
        setShowNotification(false);
        setIsClosing(false);
      }, 4600);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [player.level, lastLevel]);

  if (!showNotification) return null;

  const cardStylesWithAnimation = {
    ...cardStyles,
    animation: isClosing 
      ? 'fadeOut 0.6s ease-in-out forwards' 
      : 'levelUpSlide 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), levelUpGlow 2s ease-in-out infinite alternate'
  };

  return (
    <div style={notificationStyles}>
      <div style={cardStylesWithAnimation}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        
        <div style={headerStyles}>
          <div style={iconContainerStyles}>
            <Star style={{width: '28px', height: '28px', color: '#1f2937'}} />
            {/* Floating Sparkles */}
            <Sparkles style={{...sparkleStyles, top: '-4px', right: '-4px', width: '16px', height: '16px', animationDelay: '0s'}} />
            <Sparkles style={{...sparkleStyles, bottom: '-4px', left: '-4px', width: '12px', height: '12px', animationDelay: '0.5s'}} />
            <Sparkles style={{...sparkleStyles, top: '50%', right: '-8px', width: '14px', height: '14px', animationDelay: '1s'}} />
          </div>
          <div>
            <h1 style={titleStyles}>LEVEL UP!</h1>
            <p style={levelTextStyles}>You are now level {player.level}</p>
          </div>
        </div>
        
        <div style={statPointsStyles}>
          <Zap style={{width: '16px', height: '16px', color: '#1f2937'}} />
          <span style={statPointsTextStyles}>+5 Stat Points Available</span>
        </div>
        
        {/* Shine Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          animation: 'shine 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      </div>
      
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};