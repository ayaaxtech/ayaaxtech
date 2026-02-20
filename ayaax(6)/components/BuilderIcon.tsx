
import React from 'react';

export const BuilderIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Orbits - Three intersecting ellipses */}
    <ellipse cx="12" cy="12" rx="11" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(0 12 12)" />
    <ellipse cx="12" cy="12" rx="11" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="11" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 12 12)" />
    
    {/* Microchip - Central square with pins */}
    <rect x="8.5" y="8.5" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill="none" rx="1" />
    
    {/* Pins Left */}
    <path d="M8.5 10H7M8.5 12H7M8.5 14H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Pins Right */}
    <path d="M15.5 10H17M15.5 12H17M15.5 14H17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Pins Top */}
    <path d="M10 8.5V7M12 8.5V7M14 8.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Pins Bottom */}
    <path d="M10 15.5V17M12 15.5V17M14 15.5V17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
