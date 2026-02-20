
import React, { useState } from 'react';

interface RocketLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'center' | 'sidebar';
  onClick?: () => void;
  className?: string;
}

export const RocketLogo: React.FC<RocketLogoProps> = ({ size = 'md', variant = 'center', onClick, className = '' }) => {
  const [isFlying, setIsFlying] = useState(false);
  
  const width = size === 'sm' ? 100 : size === 'lg' ? 320 : 200;
  const height = size === 'sm' ? 100 : size === 'lg' ? 320 : 200;
  const containerSize = size === 'sm' ? 'w-24 h-24' : size === 'lg' ? 'w-96 h-96' : 'w-64 h-64';

  const handleMouseEnter = () => {
    if (variant === 'sidebar' && !isFlying) {
      setIsFlying(true);
      setTimeout(() => {
        setIsFlying(false);
      }, 150000);
    }
  };

  const getAnimationClass = () => {
    if (variant === 'center') return 'animate-rocket-launch';
    if (isFlying) return 'animate-rocket-fly-screen';
    return 'animate-rocket-vibe';
  };

  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-1000 ${containerSize} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
    >
      <div className={`relative z-10 transition-transform duration-[30000ms] ${getAnimationClass()}`}>
        {/* Extreme Realism Aerospace Rocket - SpaceX Inspired Modern Design */}
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 100 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
        >
          <defs>
            {/* Ceramic White Thermal Coating */}
            <linearGradient id="ceramicWhite" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Thermal Protection Tiles (Black Side) */}
            <pattern id="tilePattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
              <rect width="1.8" height="1.8" fill="#020617" />
            </pattern>

            <linearGradient id="gridFinMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <radialGradient id="highEfficiencyPlasma">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#60a5fa" /> {/* Blue Core for high efficiency