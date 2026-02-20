import React from 'react';

interface RubiksCubeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const RubiksCube: React.FC<RubiksCubeProps> = ({ size = 'md', className = '', onClick }) => {
  const scale = size === 'sm' ? 0.5 : size === 'lg' ? 1.5 : 1;
  
  return (
    <div 
      onClick={onClick}
      className={`cube-container ${className} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform duration-300 active:scale-95' : ''}`} 
      style={{ transform: `scale(${scale})` }}
    >
      <div className="cube">
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
          <div key={face} className={`cube-face face-${face}`}>
             {Array.from({ length: 9 }).map((_, i) => (
               <div key={i} className="cube-cell"></div>
             ))}
          </div>
        ))}
      </div>
    </div>
  );
};