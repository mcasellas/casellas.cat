import React from 'react';

export const SiteBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#0a0a0b]">
    
    {/* 1. Gradient radial des de la part inferior dreta */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(255, 204, 0, 0.15) 0%, transparent 25%)'
      }}
    ></div>

    {/* 2. Patró topogràfic amb màscara de difuminat */}
    <div 
      className="absolute inset-0 opacity-[0.20]" 
      style={{ 
        backgroundImage: `url("/topography.svg")`, 
        backgroundSize: '610px 610px',
        // filter: 'invert(1)',
        maskImage: 'radial-gradient(circle at 100% 100%, black 5%, transparent 50%)',
        WebkitMaskImage: 'radial-gradient(circle at 100% 100%, black 10%, transparent 50%)'
      }}
    ></div>

  </div>
);
