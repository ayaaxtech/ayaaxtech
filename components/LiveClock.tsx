
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [timezone, setTimezone] = useState('');
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    // Update clock every second
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Get local timezone name
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Convert "America/New_York" to "NEW YORK"
      const city = tz.split('/').pop()?.replace('_', ' ') || 'LOCAL';
      setTimezone(city.toUpperCase());
    } catch (e) {
      setTimezone('SYSTEM');
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: !is24Hour 
    }).toUpperCase();
  };

  const toggleFormat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIs24Hour(!is24Hour);
  };

  return (
    <div className="flex flex-col animate-[fadeIn_0.5s]">
      <button 
        onClick={toggleFormat}
        title={`Switch to ${is24Hour ? '12h' : '24h'} format`}
        className="text-left group outline-none focus:outline-none"
      >
        <div className="text-[14px] font-black font-mono text-white tracking-tighter leading-none mb-1 group-hover:opacity-80 transition-opacity active:scale-95 origin-left">
          {formatTime(time)}
        </div>
      </button>
      <div className="flex items-center gap-1 opacity-40">
        <MapPin size={8} className="text-white" />
        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted truncate max-w-[80px]">
          {timezone} // SYNCED
        </span>
      </div>
    </div>
  );
};
