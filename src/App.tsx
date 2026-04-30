import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import exifr from 'exifr';
import { Camera, CircleDot, Clock, Info, X, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ca' ? 'en' : 'ca');
  };

  return (
    <button 
      onClick={toggleLanguage}
      className={`bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#333] text-[#888] hover:text-white px-3 py-1.5 rounded-full font-mono text-[10px] flex items-center gap-2 transition-colors uppercase tracking-widest cursor-pointer ${className}`}
    >
      <Globe size={12} />
      {i18n.language === 'ca' ? 'EN' : 'CA'}
    </button>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  
  return (
  <motion.footer 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="mt-16 md:mt-24 pt-8 border-t border-[#222] flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0"
  >
    <div className="flex flex-col sm:flex-row gap-8 md:gap-12 font-mono text-[10px] text-[#444] uppercase tracking-widest">
      <div>
        <p className="mb-1 text-[#666]">{t('footer.interests_title')}</p>
        <p className="text-[#888]">{t('footer.interests_desc')}</p>
      </div>
    </div>
    <div className="text-[10px] font-mono text-[#444] tracking-tight">
      © {new Date().getFullYear()} CASELLAS.CAT
    </div>
  </motion.footer>
  );
};
const CVPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <div className="absolute top-8 right-6 md:top-12 md:right-12 flex items-center gap-6 z-50">
        <div className="hidden md:flex text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
          <span>41.9309° N, 2.2544° E</span>
          <span>CATALUNYA</span>
        </div>
        <LanguageSwitcher />
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0"
      >
        <Link to="/" className="text-[#888] hover:text-white font-mono text-xs uppercase tracking-widest mb-8 inline-block transition-colors">{t('footer.back_to_home')}</Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          MARC<br/>CASELLAS
        </h1>
        <p className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span> 
          {t('cv.title')}
        </p>
      </motion.header>

      <main className="flex-grow w-full max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#111] rounded-sm p-6 md:p-10 border border-[#222] font-sans text-[#ddd] w-full"
        >
          <div className="space-y-12">
            {/* About Me */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🚀</span> {t('cv.about.title')}</h2>
              <p className="leading-relaxed text-[#aaa] font-light mb-4">
                <Trans i18nKey="cv.about.p1">
                  Computer Engineer (UPC) specialized in <span className="text-white font-medium">infrastructure monitoring, automation</span>, and the deployment of critical services (<span className="text-white font-medium">NetDevOps</span>). Strong background in <span className="text-white font-medium">Python</span> and <span className="text-white font-medium">Cloud environments (GCP/Docker)</span>. Passionate about observability, operational efficiency, and network security.
                </Trans>
              </p>
              <p className="leading-relaxed text-[#aaa] font-light">{t('cv.about.p2')}</p>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">💼</span> {t('cv.experience.title')}</h2>
              
              <div className="space-y-8">
                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#FFCC00] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">{t('cv.experience.adamo.role')}</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://adamo.es" target="_blank" rel="noreferrer" className="text-[#FFCC00] hover:underline">@ {t('cv.experience.adamo.company')}</a> • {t('cv.experience.adamo.date')}</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    {(t('cv.experience.adamo.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i}>
                        <span className="mr-2">{['⚙️', '🖥️', '🔄', '🛡️', '🧪', '📊'][i] || '•'}</span>
                        <Trans i18nKey={`cv.experience.adamo.items.${i}`}>
                          <span /><strong className="text-[#ddd] font-medium" /><em />
                        </Trans>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#555] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">{t('cv.experience.vera.role')}</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://somvera.cat" target="_blank" rel="noreferrer" className="text-white hover:underline">@ {t('cv.experience.vera.company')}</a> • {t('cv.experience.vera.date')}</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    {(t('cv.experience.vera.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i}>
                        <span className="mr-2">{['🗺️', '👁️', '📡'][i] || '•'}</span>
                        <Trans i18nKey={`cv.experience.vera.items.${i}`}>
                          <span /><strong className="text-[#ddd] font-medium" /><em />
                        </Trans>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-4 border-l border-[#333]">
                  <div className="absolute w-2 h-2 bg-[#555] rounded-full -left-[4.5px] top-2"></div>
                  <h3 className="text-lg font-semibold text-white">{t('cv.experience.adamo_noc.role')}</h3>
                  <p className="text-sm font-mono text-[#888] mb-3"><a href="https://adamo.es" target="_blank" rel="noreferrer" className="text-white hover:underline">@ {t('cv.experience.adamo_noc.company')}</a> • {t('cv.experience.adamo_noc.date')}</p>
                  <ul className="space-y-2 text-[#aaa] font-light text-sm list-none">
                    {(t('cv.experience.adamo_noc.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i}>
                        <span className="mr-2">{['🏗️', '🚨', '📈'][i] || '•'}</span>
                        <Trans i18nKey={`cv.experience.adamo_noc.items.${i}`}>
                          <span /><strong className="text-[#ddd] font-medium" /><em />
                        </Trans>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">🛠️</span> {t('cv.skills.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.development')}</h3>
                  <p className="text-[#aaa] font-light">Python, SQL, JavaScript, C++, PHP, FastAPI, Flask, Jinja, HTML</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.infrastructure')}</h3>
                  <p className="text-[#aaa] font-light">Docker, Git, CI/CD, Linux (Debian, Ubuntu, Rocky Linux)</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.cloud')}</h3>
                  <p className="text-[#aaa] font-light">Google Cloud (GCP), BigQuery, Proxmox, VMware</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.networking')}</h3>
                  <p className="text-[#aaa] font-light">OSPF, BGP, DHCP, DNS, SIP, GPON, DWDM</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#2a2a2a] md:col-span-2">
                  <h3 className="font-semibold text-white mb-2">{t('cv.skills.vendors')}</h3>
                  <p className="text-[#aaa] font-light">Huawei, Cisco, PaloAlto, Nokia, ZTE, FiberHome, Mikrotik</p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">🎓</span> {t('cv.education.title')}</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{t('cv.education.degree')}</h3>
                <p className="text-sm font-mono text-[#888] mb-2"><a href="https://www.upc.edu" target="_blank" rel="noreferrer" className="text-white hover:underline">{t('cv.education.university')}</a> • {t('cv.education.date')}</p>
                <p className="text-sm text-[#aaa] font-light italic mb-2">{t('cv.education.major')}</p>
                <p className="text-[#aaa] font-light text-sm">
                  <Trans i18nKey="cv.education.thesis">
                    <strong className="text-[#ddd] font-medium">Thesis:</strong> <a href="https://upcommons.upc.edu/handle/2117/344879" target="_blank" rel="noreferrer" className="text-[#FFCC00] hover:underline">QoS implementation in an ISP</a> – Implementation of quality of service policies for residential traffic.
                  </Trans>
                </p>
              </div>
            </section>

            {/* Projects & Volunteering */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-t border-[#333] pt-8"><span className="text-xl">📻</span> {t('cv.volunteering.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">{t('cv.volunteering.radio.role')} <span className="font-normal text-[#888]">@ <a href="https://radiovoltrega.com" target="_blank" rel="noreferrer" className="text-white hover:underline">Ràdio Voltregà</a> ({t('cv.volunteering.radio.date')})</span></h3>
                  <ul className="list-disc list-inside text-sm text-[#aaa] font-light mt-2 space-y-1">
                    <li>{t('cv.volunteering.radio.item1')}</li>
                    <li>{t('cv.volunteering.radio.item2')}</li>
                    <li>{t('cv.volunteering.radio.item3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{t('cv.volunteering.photography.role')} <span className="font-normal text-[#888]">@ <a href="https://afvoltreganes.cat" target="_blank" rel="noreferrer" className="text-white hover:underline">AFV</a> ({t('cv.volunteering.photography.date')})</span></h3>
                  <ul className="list-disc list-inside text-sm text-[#aaa] font-light mt-2 space-y-1">
                    <li><Trans i18nKey="cv.volunteering.photography.item1">Portfolio available at <Link to="/photos" className="text-[#FFCC00] hover:underline">photos</Link>.</Trans></li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#333] pt-8">
              {/* Languages */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🗣️</span> {t('cv.languages.title')}</h2>
                <ul className="list-disc list-inside text-sm text-[#aaa] font-light space-y-1">
                  <li><strong className="text-[#ddd] font-medium">{t('cv.languages.catalan')}:</strong> {t('cv.languages.native')}</li>
                  <li><strong className="text-[#ddd] font-medium">{t('cv.languages.spanish')}:</strong> {t('cv.languages.native')}</li>
                  <li><strong className="text-[#ddd] font-medium">{t('cv.languages.english')}:</strong> {t('cv.languages.advanced')}</li>
                </ul>
              </section>

              {/* Others */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-xl">🚘</span> {t('cv.others.title')}</h2>
                <ul className="list-disc list-inside text-sm text-[#aaa] font-light space-y-1">
                  <li><strong className="text-[#ddd] font-medium">{t('cv.others.driving')}:</strong> {t('cv.others.license_b')}</li>
                </ul>
              </section>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

// Carreguem els thumbs de la carpeta portfolio per a la graella
const thumbModules = import.meta.glob('/public/images/portfolio/thumbs/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { eager: true });
const allPortfolioThumbs = Object.keys(thumbModules).map(key => key.replace('/public', ''));

const PhotosPage = () => {
  const { t } = useTranslation();
  
  // Creem una llista d'objectes amb la ruta del thumb i de la imatge completa
  // Barregem les imatges aleatòriament només un cop al muntar el component
  const [images] = useState(() => {
    const shuffled = [...allPortfolioThumbs].sort(() => Math.random() - 0.5);
    const mapped = shuffled.map(thumbPath => ({
      thumb: thumbPath,
      full: thumbPath.replace('/thumbs/', '/fulls/')
    }));
    // Assegurem que el número de fotos sigui múltiple de 4 per no deixar buits a la graella
    const count = Math.floor(mapped.length / 4) * 4;
    return mapped.slice(0, count);
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [exifData, setExifData] = useState<any>(null);

  React.useEffect(() => {
    if (selectedIndex === null) {
      setExifData(null);
      return;
    }
    const fullSrc = images[selectedIndex].full;
    exifr.parse(fullSrc).then(data => {
      setExifData(data || {});
    }).catch(e => {
      console.error("Failed to parse EXIF:", e);
      setExifData({});
    });
  }, [selectedIndex, images]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => prev !== null ? (prev + 1) % images.length : null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => prev !== null ? (prev - 1 + images.length) % images.length : null);
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  const openImage = (index: number) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const formatExposureTime = (val: any) => {
    if (!val) return null;
    if (val < 1) {
      return `1/${Math.round(1 / val)}s`;
    }
    return `${val}s`;
  };

  const renderExifValues = () => {
    if (!exifData) return null;
    
    const items = [];
    if (exifData.Model) items.push({ icon: <Camera size={14} />, value: exifData.Model });
    if (exifData.FNumber) items.push({ icon: <CircleDot size={14} />, value: `f/${exifData.FNumber}` });
    if (exifData.ExposureTime) items.push({ icon: <Clock size={14} />, value: formatExposureTime(exifData.ExposureTime) });
    if (exifData.ISO) items.push({ icon: <Info size={14} />, value: `ISO ${exifData.ISO}` });

    if (items.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-4 items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono text-[#ddd]">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {item.icon}
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <div className="absolute top-8 right-6 md:top-12 md:right-12 flex items-center gap-6 z-50">
        <div className="hidden md:flex text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
          <span>41.9309° N, 2.2544° E</span>
          <span>CATALUNYA</span>
        </div>
        <LanguageSwitcher />
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0"
      >
        <Link to="/" className="text-[#888] hover:text-white font-mono text-xs uppercase tracking-widest mb-8 inline-block transition-colors">{t('footer.back_to_home')}</Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          {t('home.title')}
        </h1>
        <p className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span> 
          {t('photos.title')}
        </p>
      </motion.header>

      <main className="flex-grow w-full max-w-none">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {images.map((img, index) => (
             <div 
               key={index} 
               onClick={() => openImage(index)}
               onContextMenu={(e) => e.preventDefault()}
               className="bg-[#1a1a1a] rounded-sm overflow-hidden aspect-square relative group cursor-pointer select-none"
              >
                <img 
                  src={img.thumb} 
                  alt={`Photography ${index}`} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" 
                  loading="lazy" 
                  onDragStart={(e) => e.preventDefault()}
                />
                {/* Capa invisible per dificultar la descàrrega */}
                <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()}></div>
             </div>
          ))}
          {images.length === 0 && (
             <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#333] rounded-sm">
               <span className="text-2xl mb-4">📷</span>
               <p className="text-[#666] font-mono text-sm max-w-md">
                 <Trans i18nKey="photos.not_found">
                   No s'han trobat imatges. Afegeix les teves fotos a la carpeta <span className="text-white bg-[#222] px-1 rounded">public/images/</span> per veure-les aquí.
                 </Trans>
               </p>
             </div>
          )}
        </motion.div>
      </main>

      <Footer />

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={closeImage}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 p-2 rounded-full z-50 cursor-pointer"
              onClick={closeImage}
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute left-0 md:left-8 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors bg-black/30 rounded-full cursor-pointer z-50"
                onClick={prevImage}
              >
                <ChevronLeft size={36} />
              </button>
              
              <div className="relative max-w-[85vw] max-h-[80vh] select-none" onContextMenu={(e) => e.preventDefault()}>
                <img 
                  src={images[selectedIndex].full} 
                  alt="Expanded photography" 
                  className="w-full h-full object-contain rounded-sm"
                  onDragStart={(e) => e.preventDefault()}
                />
                {/* Escut invisible sobre la imatge ampliada */}
                <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()}></div>
              </div>
              
              <button 
                className="absolute right-0 md:right-8 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors bg-black/30 rounded-full cursor-pointer z-50"
                onClick={nextImage}
              >
                <ChevronRight size={36} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center px-4">
                {renderExifValues()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HomePage = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <div className="absolute top-8 right-6 md:top-12 md:right-12 flex items-center gap-6 z-50">
        <div className="hidden md:flex text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
          <span>41.9309° N, 2.2544° E</span>
          <span>CATALUNYA</span>
        </div>
        <LanguageSwitcher />
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 mt-8 md:mt-0"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-4" dangerouslySetInnerHTML={{ __html: t('home.title') }} />
        <p className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span> 
          {t('home.subtitle')}
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
              {t('home.p1')}
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              <Trans i18nKey="home.p2">
                Sóc <span className="text-white font-medium">enginyer informàtic</span> de professió, especialitzat en NetDevOps, monitoratge i automatització.
              </Trans>
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#aaa] font-light max-w-xl">
              {t('home.p3')}
            </p>
          </div>

          <div className="space-y-8">
            <nav className="flex flex-col gap-3 font-mono text-sm">
              <Link to="/cv" className="group flex w-full items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white text-left cursor-pointer">
                <span className={`text-[#666] group-hover:text-white transition-colors ${location.pathname === '/cv' ? 'text-white' : ''}`}>01</span> 
                <span className={`text-white ${location.pathname === '/cv' ? 'font-bold' : ''}`}>{t('home.links.cv')}</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">{t('home.links.cv_desc')}</span>
              </Link>
              <Link to="/photos" className="group flex w-full items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white text-left cursor-pointer">
                <span className={`text-[#666] group-hover:text-white transition-colors ${location.pathname === '/photos' ? 'text-white' : ''}`}>02</span> 
                <span className={`text-white ${location.pathname === '/photos' ? 'font-bold' : ''}`}>{t('home.links.photos')}</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">{t('home.links.photos_desc')}</span>
              </Link>
              <a href="https://radiovoltrega.com/endramaliats" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white">
                <span className="text-[#666] group-hover:text-white transition-colors">03</span> 
                <span className="text-white">{t('home.links.podcast')}</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">{t('home.links.podcast_desc')}</span>
              </a>
            </nav>

            <div className="pt-4">
              <span className="text-[#888] mb-4 inline-block font-mono text-[10px] uppercase tracking-widest">{t('home.follow')}</span>
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
          key="portfolio"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 h-[600px] lg:h-[auto] min-h-[400px] grid grid-cols-2 grid-rows-3 gap-3"
        >
          <Link to="/photos" className="row-span-2 bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer">
            <img src={images[0]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              {t('home.tags.traditions')}
            </div>
          </Link>
          <Link to="/photos" className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer">
            <img src={images[1]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              {t('home.tags.nature')}
            </div>
          </Link>
          <Link to="/photos" className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer">
            <img src={images[2]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              {t('home.tags.travel')}
            </div>
          </Link>
          <Link to="/photos" className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer">
            <img src={images[3]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              {t('home.tags.street')}
            </div>
          </Link>
          <Link to="/photos" className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer">
            <img src={images[4]} alt="Photography by Marc" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
              {t('home.tags.catalonia')}
            </div>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="/photos" element={<PhotosPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

