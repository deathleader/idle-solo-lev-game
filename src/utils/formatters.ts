// src/utils/formatters.ts

export const formatNumber = (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    return (num / 1000000000000).toFixed(1) + 'T';
  };
  
  export const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  export const formatTimeShort = (milliseconds: number): string => {
    const seconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    } else {
      return `0:${seconds.toString().padStart(2, '0')}`;
    }
  };
  
  export const getRankColor = (rank: string): string => {
    switch (rank) {
      case 'E': return 'text-gray-400';
      case 'D': return 'text-green-400';
      case 'C': return 'text-blue-400';
      case 'B': return 'text-purple-400';
      case 'A': return 'text-orange-400';
      case 'S': return 'text-red-400';
      case 'National': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };
  
  export const getRankGlow = (rank: string): string => {
    switch (rank) {
      case 'E': return 'shadow-gray-500/50';
      case 'D': return 'shadow-green-500/50';
      case 'C': return 'shadow-blue-500/50';
      case 'B': return 'shadow-purple-500/50';
      case 'A': return 'shadow-orange-500/50';
      case 'S': return 'shadow-red-500/50';
      case 'National': return 'shadow-yellow-500/50';
      default: return 'shadow-gray-500/50';
    }
  };
  
  export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  };
  
  export const lerp = (a: number, b: number, t: number): number => {
    return a + (b - a) * t;
  };