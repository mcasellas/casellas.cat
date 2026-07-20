import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { StatusDot } from '../components/StatusDot';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { usePortfolioCategoryPreviews } from '../hooks/usePortfolioImages';

export const PhotosPage = () => {
  const { t } = useTranslation();
  const { previews, isLoading } = usePortfolioCategoryPreviews();

  return (
    <div className="min-h-screen text-[#f0f0f0] font-sans flex flex-col p-6 md:p-12 relative z-10 selection:bg-white selection:text-black">
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
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-30 -mx-6 md:-mx-12 -mt-6 md:-mt-12 px-6 md:px-12 pt-14 md:pt-12 pb-6 md:pb-8 mb-6 md:mb-8 md:pr-48 xl:pr-96 bg-[#0a0a0b]/90 backdrop-blur-md border-b border-white/5"
      >
        <Breadcrumbs items={[
          { label: t('breadcrumb.home'), path: '/' },
          { label: t('breadcrumb.photos'), path: '/photos' },
        ]} />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          {t('home.title')}
        </h1>
        <div className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center gap-3">
          <StatusDot delay={0.8} />
          {t('photos.title')}
        </div>
      </motion.header>

      <main className="flex-grow w-full max-w-none">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, transition: { duration: 0.4 } }}
           transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-[#1a1a1a] rounded-sm aspect-[4/3] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
            ))
          ) : previews.length > 0 ? (
            previews.map((preview, index) => (
              <motion.div
                key={preview.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.08, 0.8),
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="bg-black rounded-sm overflow-hidden aspect-[4/3] relative group cursor-pointer select-none"
              >
                <Link to={`/photos/${preview.slug}`} className="absolute inset-0 block">
                  <div className="relative w-full h-full bg-[#1a1a1a]">
                    <img
                      src={preview.thumb}
                      alt={t(`photos.categories.${preview.slug}`, { defaultValue: preview.slug })}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex items-end justify-between">
                    <h2 className="text-xl md:text-3xl font-black tracking-tighter text-white uppercase">
                      {t(`photos.categories.${preview.slug}`, { defaultValue: preview.slug })}
                    </h2>
                    <span className="text-[10px] md:text-xs font-mono text-[#ccc] bg-black/50 backdrop-blur px-2 py-1 rounded-full">
                      {preview.count}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#333] rounded-sm">
               <span className="text-2xl mb-4">📷</span>
               <p className="text-[#666] font-mono text-sm max-w-md">
                 {t('photos.not_found')}
               </p>
             </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
