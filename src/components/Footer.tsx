import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
  <motion.footer 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="mt-16 md:mt-24 pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0 relative"
  >
    {/* Línia superior amb degradat radial per no trepitjar el mapa topogràfic */}
    <div 
      className="absolute top-0 left-0 w-full h-[1px] bg-[#222]"
      style={{
        maskImage: 'radial-gradient(circle at 100% 100%, transparent 0%, black 50%)',
        WebkitMaskImage: 'radial-gradient(circle at 100% 100%, transparent 0%, black 50%)'
      }}
    />
    <div className="flex flex-col sm:flex-row gap-8 md:gap-12 font-mono text-[10px] text-[#444] uppercase tracking-widest">
      <div className="flex flex-col gap-1">
        <p className="text-[#666] uppercase tracking-widest">{t('home.follow')}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#888]">
          <a href="https://www.instagram.com/marc.casellas" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://twitter.com/casellas98" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
          <a href="https://linkedin.com/in/casellas98" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/mcasellas" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
      <div className="xl:hidden flex flex-col gap-1">
        <p className="text-[#666] uppercase tracking-widest">LOCATION</p>
        <p className="text-[#888]">41.9309° N, 2.2544° E • CATALUNYA</p>
      </div>
    </div>
    
    <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
      <div className="md:hidden">
        <LanguageSwitcher />
      </div>
      <div className="text-[10px] font-mono text-[#888] tracking-tight">
        © {new Date().getFullYear()} CASELLAS.CAT
      </div>
    </div>
  </motion.footer>
  );
};
