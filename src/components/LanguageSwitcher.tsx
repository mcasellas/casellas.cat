import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('ca') ? 'en' : 'ca');
  };

  return (
    <button 
      onClick={toggleLanguage}
      className={`bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#333] text-[#888] hover:text-white px-3 py-1.5 rounded-full font-mono text-[10px] flex items-center gap-2 transition-colors uppercase tracking-widest cursor-pointer ${className}`}
    >
      <Globe size={12} />
      {i18n.language.startsWith('ca') ? 'CA' : 'EN'}
    </button>
  );
};
