import React from 'react';
import { motion } from 'motion/react';

export default function App() {
  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <div className="hidden md:flex absolute top-12 right-12 text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
        <span>41.9309° N, 2.2544° E</span>
        <span>CATALUNYA</span>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-4">
          MARC<br/>CASELLAS
        </h1>
        <p className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span> 
          ENGINYER INFORMÀTIC (UPC) / FOTOGRAFIA / RÀDIO
        </p>
      </motion.header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col justify-between border-t border-[#222] pt-8"
        >
          <div className="space-y-6 mb-10 lg:mb-15">
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              Hola, sóc en Marc. Nascut a la comarca d'Osona, Catalunya. 
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              Sóc <span className="text-white font-medium">enginyer informàtic</span> de professió, especialitzat en NetDevOps, monitoratge i automatització.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              Fora de l'àmbit tècnic, sóc un apassionat de capturar i explicar històries. Ho faig a través de la fotografia, sobretot de carrer, viatge i paisatge, i també des de la ràdio. Aquest espai recull una part d'aquesta vessant més personal i creativa.
            </p>
          </div>

          <div className="space-y-8">
            <nav className="flex flex-col gap-3 font-mono text-sm">
              <a href="https://marc.casellas.cat" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white">
                <span className="text-[#666] group-hover:text-white transition-colors">01</span> 
                <span className="text-white">CURRÍCULUM</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">NETDEVOPS →</span>
              </a>
              <a href="https://photos.casellas.cat" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white">
                <span className="text-[#666] group-hover:text-white transition-colors">02</span> 
                <span className="text-white">FOTOGRAFIA</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">PORTFOLIO →</span>
              </a>
              <a href="https://radiovoltrega.com/endramaliats" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white">
                <span className="text-[#666] group-hover:text-white transition-colors">03</span> 
                <span className="text-white">ENDRAMALIATS</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">PODCAST →</span>
              </a>
            </nav>

            <div className="pt-4">
              <span className="text-[#888] mb-4 inline-block font-mono text-[10px] uppercase tracking-widest">Segueix-me a ...</span>
              <div className="flex flex-wrap gap-6 text-[11px] font-mono tracking-widest uppercase text-[#666]">
                <a href="https://www.instagram.com/marc.casellas" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://twitter.com/casellas98" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">X</a>
                <a href="https://linkedin.com/in/casellas98" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="https://github.com/mcasellas" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 h-[600px] lg:h-[auto] min-h-[400px] grid grid-cols-2 grid-rows-3 gap-3"
        >
          <div className="row-span-2 bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[0]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Tradicions
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[1]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Natura
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[2]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Viatge
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[3]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Street Photograpy 
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group">
            <img src={images[4]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              Catalunya
            </div>
          </div>
        </motion.div>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 md:mt-24 pt-8 border-t border-[#222] flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0"
      >
        <div className="flex flex-col sm:flex-row gap-8 md:gap-12 font-mono text-[10px] text-[#444] uppercase tracking-widest">
          <div>
            <p className="mb-1 text-[#666]">Interessos</p>
            <p className="text-[#888]">Fotografia • Ràdio • NetDevOps</p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-[#444] tracking-tight">
          © {new Date().getFullYear()} CASELLAS.CAT
        </div>
      </motion.footer>
    </div>
  );
}

