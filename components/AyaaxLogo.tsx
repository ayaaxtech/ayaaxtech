import React, { forwardRef, useImperativeHandle } from 'react';

interface AyaaxLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
}

export interface AyaaxLogoHandle {
  triggerExplosion: () => void;
}

export const AyaaxLogo = forwardRef<AyaaxLogoHandle, AyaaxLogoProps>(({ 
  size = 'md', 
  className = '', 
  onClick, 
  active = false 
}, ref) => {
  
  useImperativeHandle(ref, () => ({
    triggerExplosion: () => {
      console.log("AYAAX Core: Visual Signature Finalized.");
    }
  }));

  // Map sizes to responsive font sizes
  const fontSizes = {
    xs: 'text-base',      
    sm: 'text-2xl',    
    md: 'text-4xl',    
    lg: 'text-7xl',
    xl: 'text-9xl'
  };

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className} cursor-pointer select-none transition-all duration-300 ${active ? 'scale-110' : 'hover:scale-105'}`}
      onClick={onClick}
    >
      <span 
        className={`font-black tracking-tighter italic uppercase text-primary drop-shadow-glow transition-all ${fontSizes[size]}`}
        style={{ 
          fontFamily: 'Inter, sans-serif',
          textShadow: active ? '0 0 20px rgba(57, 255, 20, 0.5)' : 'none'
        }}
      >
        AYAAX
      </span>
      {active && (
        <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full animate-pulse pointer-events-none" />
      )}
    </div>
  );
});