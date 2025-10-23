import React from 'react';

export const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 15l3.5-3.5" />
    <path d="M20.9 10.4A9 9 0 1 0 3.1 10.4" />
    <path d="M12 3v1" />
    <path d="M18.4 6.6l-.7.7" />
    <path d="M21 12h-1" />
    <path d="M18.4 17.4l-.7-.7" />
    <path d="M12 21v-1" />
    <path d="M5.6 17.4l.7-.7" />
    <path d="M3 12h1" />
    <path d="M5.6 6.6l.7.7" />
  </svg>
);
