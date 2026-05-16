import React from 'react';

export const SiteBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0b]">
    
    {/* 1. Patró topogràfic en blanc amb màscara de degradat */}
    <div className="absolute inset-0 opacity-[0.20]">
      {/* Capa blanca amb la forma de l'SVG */}
      <div 
        className="absolute inset-0 bg-white" 
        style={{ 
          maskImage: `url("/topography.svg")`, 
          WebkitMaskImage: `url("/topography.svg")`,
          maskSize: '610px 610px',
          WebkitMaskSize: '610px 610px'
        }}
      />
      {/* Capa negra que tapa la blanca per fer el degradat radial */}
      <div 
        className="absolute inset-0 bg-[#0a0a0b]"
        style={{
          maskImage: 'radial-gradient(circle at 100% 100%, transparent 10%, black 60%)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 100%, transparent 10%, black 60%)'
        }}
      />
    </div>

    {/* 2. Gradient radial ambre */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(255, 204, 0, 0.15) 0%, transparent 35%)'
      }}
    ></div>

  </div>
);
