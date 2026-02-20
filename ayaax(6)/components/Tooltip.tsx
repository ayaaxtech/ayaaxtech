import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top', 
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let top = 0;
        let left = 0;
        const offset = 12;

        switch (position) {
          case 'top':
            left = centerX;
            top = rect.top - offset;
            break;
          case 'bottom':
            left = centerX;
            top = rect.bottom + offset;
            break;
          case 'left':
            left = rect.left - offset;
            top = centerY;
            break;
          case 'right':
            left = rect.right + offset;
            top = centerY;
            break;
        }
        
        setCoords({ left, top });
        setIsVisible(true);
      }
    }, delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <>
      <div 
        ref={triggerRef}
        className={`${className} inline-block`}
        onMouseEnter={show} 
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
          className="fixed z-[10000] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl pointer-events-none transition-all duration-300 ease-out animate-[tooltipIn_0.2s_ease-out] whitespace-nowrap max-w-[280px] truncate ring-1 ring-white/5"
          style={{
            top: coords.top,
            left: coords.left,
            transform: position === 'top' ? 'translate(-50%, -100%)' :
                       position === 'bottom' ? 'translate(-50%, 0)' :
                       position === 'left' ? 'translate(-100%, -50%)' :
                       'translate(0, -50%)'
          }}
        >
          {content}
        </div>,
        document.body
      )}
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translate(-50%, -90%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
        }
      `}</style>
    </>
  );
};