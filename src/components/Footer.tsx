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
    className="mt-16 md:mt-24 pt-8 border-t border-[#222] flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0 pb-12"
  >
    <div className="flex flex-col sm:flex-row gap-8 md:gap-12 font-mono text-[10px] text-[#444] uppercase tracking-widest">
      <div>
        <p className="mb-1 text-[#666]">{t('footer.interests_title')}</p>
        <p className="text-[#888]">{t('footer.interests_desc')}</p>
      </div>
      <div className="xl:hidden flex flex-col gap-0.5">
        <p className="mb-1 text-[#666]">LOCATION</p>
        <p className="text-[#888]">41.9309° N, 2.2544° E • CATALUNYA</p>
      </div>
    </div>
    
    <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
      <div className="md:hidden">
        <LanguageSwitcher />
      </div>
      <div className="text-[10px] font-mono text-[#444] tracking-tight">
        © {new Date().getFullYear()} CASELLAS.CAT
      </div>
    </div>
  </motion.footer>
  );
};
