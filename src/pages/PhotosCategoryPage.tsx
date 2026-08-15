import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import ExifReader from 'exifreader';
import { Camera, CircleDot, Clock, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { StatusDot } from '../components/StatusDot';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { usePortfolioCategoryImages, getCategorySlugs } from '../hooks/usePortfolioImages';

const ImageWithPlaceholder = ({ src, alt }: { src: string, alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-black">
      {!isLoaded && (
        <div className="absolute inset-0 bg-black animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${isLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

export const PhotosCategoryPage = () => {
  const { t } = useTranslation();
  const { category } = useParams<{ category: string }>();
  const { images, isLoading } = usePortfolioCategoryImages(category);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryExists = !!category && getCategorySlugs().includes(category);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [exifData, setExifData] = useState<any>(null);

  useEffect(() => {
    const photoParam = searchParams.get('photo');
    if (!photoParam || images.length === 0) return;
    const index = images.findIndex((img) => img.filename === photoParam);
    if (index !== -1) setSelectedIndex(index);
    setSearchParams((params) => {
      params.delete('photo');
      return params;
    }, { replace: true });
  }, [images, searchParams, setSearchParams]);

  useEffect(() => {
    if (selectedIndex === null) {
      setExifData(null);
      return;
    }
    const fullSrc = images[selectedIndex].full;
    fetch(fullSrc)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.arrayBuffer();
      })
      .then(buffer => {
        return ExifReader.load(buffer);
      })
      .then(tags => {
        setExifData(tags || {});
      })
      .catch(e => {
        console.error("Failed to parse EXIF:", e);
        setExifData({});
      });
  }, [selectedIndex, images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
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
    setDirection(0);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setDirection(1);
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setDirection(-1);
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const renderExifValues = () => {
    if (!exifData || Object.keys(exifData).length === 0) return null;

    const items = [];
    const model = exifData.Model?.description || exifData.Make?.description;
    let fNumber = exifData.FNumber?.description;
    if (fNumber && !fNumber.toString().toLowerCase().startsWith('f/')) {
      fNumber = `f/${fNumber}`;
    }
    const exposureTime = exifData.ExposureTime?.description;
    const iso = exifData.ISOSpeedRatings?.description || exifData.ISO?.description;

    if (model) items.push({ icon: <Camera size={14} />, value: model });
    if (fNumber) items.push({ icon: <CircleDot size={14} />, value: fNumber });
    if (exposureTime) items.push({ icon: <Clock size={14} />, value: exposureTime.includes('/') ? `${exposureTime}s` : `${exposureTime}s` });
    if (iso) items.push({ icon: <Info size={14} />, value: `ISO ${iso}` });

    if (items.length === 0) return null;

    return (
      <div className="flex flex-wrap justify-center gap-4 items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono text-[#ddd] text-center">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {item.icon}
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!categoryExists) {
    return <Navigate to="/photos" replace />;
  }

  const categoryLabel = category ? t(`photos.categories.${category}`, { defaultValue: category }) : '';

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
          { label: categoryLabel, path: `/photos/${category}` },
        ]} />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          {t('home.title')}
        </h1>
        <div className="text-sm md:text-xl font-mono text-[#FFCC00] uppercase flex items-center gap-3">
          <StatusDot delay={0.8} />
          {t('photos.category_label', { category: categoryLabel })}
        </div>
      </motion.header>

      <main className="flex-grow w-full max-w-none">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, transition: { duration: 0.4 } }}
           transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-[#1a1a1a] rounded-sm aspect-square relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
            ))
          ) : images.length > 0 ? (
            images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.03, 0.8),
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={() => openImage(index)}
                onContextMenu={(e) => e.preventDefault()}
                className="bg-black rounded-sm overflow-hidden aspect-square relative group cursor-pointer select-none"
               >
                 <ImageWithPlaceholder
                   src={img.thumb}
                   alt={`${categoryLabel} ${index}`}
                 />
                 <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()}></div>
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

      <Footer showUsageNotice />

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 touch-none"
            onClick={closeImage}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 p-2 rounded-full z-50 cursor-pointer"
              onClick={closeImage}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center justify-center pointer-events-none w-full h-full"
            >
              {/* Preload adjacent images */}
              <div className="hidden">
                <img src={images[(selectedIndex + 1) % images.length].full} alt="preload-next" />
                <img src={images[(selectedIndex - 1 + images.length) % images.length].full} alt="preload-prev" />
              </div>

              <button
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors bg-black/30 rounded-full cursor-pointer z-50 pointer-events-auto"
                onClick={prevImage}
              >
                <ChevronLeft size={36} />
              </button>

              <div
                className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center select-none pointer-events-auto overflow-hidden px-4 md:px-0"
                onContextMenu={(e) => e.preventDefault()}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={selectedIndex}
                    src={images[selectedIndex].full}
                    alt="Expanded photography"
                    onClick={(e) => e.stopPropagation()}
                    custom={direction}
                    variants={{
                      enter: (direction: number) => ({
                        x: direction > 0 ? '100%' : '-100%',
                        opacity: 0,
                        scale: 0.9
                      }),
                      center: {
                        zIndex: 1,
                        x: 0,
                        opacity: 1,
                        scale: 1
                      },
                      exit: (direction: number) => ({
                        zIndex: 0,
                        x: direction < 0 ? '100%' : '-100%',
                        opacity: 0,
                        scale: 0.9
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={(_, info) => {
                      const threshold = 50;
                      if (info.offset.x > threshold) {
                        prevImage();
                      } else if (info.offset.x < -threshold) {
                        nextImage();
                      }
                    }}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 }
                    }}
                    className="absolute max-w-full max-h-full object-contain rounded-sm shadow-2xl cursor-grab active:cursor-grabbing"
                    onDragStart={(e) => e.preventDefault()}
                  />
                </AnimatePresence>
              </div>

              <button
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors bg-black/30 rounded-full cursor-pointer z-50 pointer-events-auto"
                onClick={nextImage}
              >
                <ChevronRight size={36} />
              </button>

              <div className="mt-6 w-full flex justify-center px-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                {renderExifValues()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
