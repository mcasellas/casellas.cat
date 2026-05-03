import { motion } from 'motion/react';
import { useTranslation, Trans } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { StatusDot } from '../components/StatusDot';
import { Footer } from '../components/Footer';

import img1 from '../images/1.webp';
import img2 from '../images/2.webp';
import img3 from '../images/3.webp';
import img4 from '../images/4.webp';
import img5 from '../images/5.webp';

export const HomePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const images = [img1, img2, img3, img4, img5];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative selection:bg-white selection:text-black">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-6 z-50"
      >
        <div className="hidden xl:flex text-[10px] font-mono tracking-widest text-[#444] uppercase flex-col items-end gap-1">
          <span>41.9309° N, 2.2544° E</span>
          <span>CATALUNYA</span>
        </div>
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 md:mb-10 mt-8 md:mt-0 xl:pr-96"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-4" dangerouslySetInnerHTML={{ __html: t('home.title') }} />
        <div className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <StatusDot delay={0.8} />
          {t('home.subtitle')}
        </div>
      </motion.header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
              <a href="https://radiovoltrega.com/endramaliats" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-[#222] pb-2 transition-all hover:border-white">
                <span className="text-[#666] group-hover:text-white transition-colors">03</span> 
                <span className="text-white">{t('home.links.podcast')}</span> 
                <span className="text-[#444] group-hover:text-white transition-colors">{t('home.links.podcast_desc')}</span>
              </a>
            </nav>

            <div className="pt-4">
              <span className="text-[#888] mb-4 inline-block font-mono text-[10px] uppercase tracking-widest">{t('home.follow')}</span>
              <div className="flex flex-wrap gap-6 text-[11px] font-mono tracking-widest uppercase text-[#666]">
                <a href="https://www.instagram.com/marc.casellas" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://twitter.com/casellas98" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
                <a href="https://linkedin.com/in/casellas98" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="https://github.com/mcasellas" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 h-[600px] lg:h-[auto] min-h-[400px] grid grid-cols-2 grid-rows-3 gap-3"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 20 },
              show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="row-span-2 bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer"
          >
            <Link to="/photos" className="absolute inset-0 block">
              <div className="absolute inset-0 bg-[#1a1a1a] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={images[0]} 
                alt={`${t('home.tags.traditions')} - Photography by Marc Casellas`} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
                {t('home.tags.traditions')}
              </div>
            </Link>
          </motion.div>
          
          {[
            { img: images[1], tag: t('home.tags.nature') },
            { img: images[2], tag: t('home.tags.catalonia') },
            { img: images[3], tag: t('home.tags.travel') },
            { img: images[4], tag: t('home.tags.street') }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer"
            >
              <Link to="/photos" className="absolute inset-0 block">
                <div className="absolute inset-0 bg-[#1a1a1a] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src={item.img} 
                  alt={`${item.tag} - Photography by Marc Casellas`} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 text-[9px] md:text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#f0f0f0]">
                  {item.tag}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
