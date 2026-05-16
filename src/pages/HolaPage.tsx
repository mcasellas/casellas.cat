import React from 'react';
import { motion } from 'motion/react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  Globe, 
  FileText, 
  Radio, 
  ArrowRight 
} from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { StatusDot } from '../components/StatusDot';

export const HolaPage = () => {
  const { t } = useTranslation();

  const links = [
    {
      title: t('hola.links.portfolio'),
      desc: t('hola.links.portfolio_desc'),
      url: '/',
      isInternal: true,
      icon: <Globe className="text-[#FFCC00]" size={20} />
    },
    // {
    //   title: t('hola.links.cv'),
    //   desc: t('hola.links.cv_desc'),
    //   url: '/cv',
    //   isInternal: true,
    //   icon: <FileText className="text-[#FFCC00]" size={20} />
    // },
    {
      title: t('hola.links.instagram'),
      desc: t('hola.links.instagram_desc'),
      url: 'https://www.instagram.com/marc.casellas',
      isInternal: false,
      icon: <Instagram size={20} />
    },
    {
      title: t('hola.links.linkedin'),
      desc: t('hola.links.linkedin_desc'),
      url: 'https://linkedin.com/in/casellas98',
      isInternal: false,
      icon: <Linkedin size={20} />
    },
    {
      title: t('hola.links.github'),
      desc: t('hola.links.github_desc'),
      url: 'https://github.com/mcasellas',
      isInternal: false,
      icon: <Github size={20} />
    },
    {
      title: t('hola.links.twitter'),
      desc: t('hola.links.twitter_desc'),
      url: 'https://twitter.com/casellas98',
      isInternal: false,
      icon: <Twitter size={20} />
    },
    {
      title: t('hola.links.podcast'),
      desc: t('hola.links.podcast_desc'),
      url: 'https://radiovoltrega.com/endramaliats',
      isInternal: false,
      icon: <Radio size={20} />
    }
  ];

  return (
    <div className="min-h-screen text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative z-10 selection:bg-white selection:text-black justify-between">
      {/* Top bar controls */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-end items-center w-full max-w-xl mx-auto mb-8"
      >
        {/* <div className="flex items-center gap-3 font-mono text-[10px] text-[#666] tracking-widest uppercase">
          <span>41.9309° N, 2.2544° E</span>
        </div> */}
        <LanguageSwitcher />
      </motion.div>

      {/* Main profile and links container */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-xl mx-auto py-8">
        
        {/* Profile info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 w-full"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.8] mb-4 ml-[-0.05em] uppercase text-white">
            <Trans i18nKey="hola.title" defaultValue="MARC CASELLAS" />
          </h1>
          <div className="text-xs md:text-sm font-mono text-[#FFCC00] flex items-center justify-center gap-3 tracking-widest uppercase">
            <StatusDot delay={0.4} />
            <Trans i18nKey="hola.subtitle" defaultValue="NetDevOps · Fotografia · Ràdio" />
          </div>
        </motion.div>

        {/* Links list */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col gap-4"
        >
          {links.map((link, index) => {
            const content = (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-[#888] group-hover:text-white transition-colors">
                    {link.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-mono text-sm font-bold text-white group-hover:text-[#FFCC00] transition-colors tracking-tight">
                      {link.title}
                    </p>
                    <p className="text-[11px] text-[#666] group-hover:text-[#aaa] transition-colors leading-tight font-light mt-0.5">
                      {link.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-[#444] group-hover:text-[#FFCC00] transition-all transform group-hover:translate-x-1" />
              </>
            );

            const className = "group flex items-center justify-between p-4 bg-[#0a0a0b]/60 hover:bg-[#0a0a0b]/90 backdrop-blur-md rounded-sm border border-[#222] hover:border-[#FFCC00]/50 transition-all duration-300 w-full cursor-pointer";

            if (link.isInternal) {
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                  }}
                >
                  <Link to={link.url} className={className}>
                    {content}
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
                  {content}
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="w-full max-w-xl mx-auto pt-8 border-t border-[#222]/50 flex justify-between items-center text-[10px] font-mono text-[#444] uppercase tracking-widest mt-12"
      >
        <span>CATALUNYA</span>
        <span>© {new Date().getFullYear()} CASELLAS.CAT</span>
      </motion.footer>
    </div>
  );
};
