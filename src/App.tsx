import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomePage, GlitchTitle } from './pages/HomePage';
import { StatusDot } from './components/StatusDot';

// Lazy load pages for better performance and smaller bundle size
const CVPage = lazy(() => import('./pages/CVPage').then(m => ({ default: m.CVPage })));
const PhotosPage = lazy(() => import('./pages/PhotosPage').then(m => ({ default: m.PhotosPage })));
const PhotosCategoryPage = lazy(() => import('./pages/PhotosCategoryPage').then(m => ({ default: m.PhotosCategoryPage })));
const HolaPage = lazy(() => import('./pages/HolaPage').then(m => ({ default: m.HolaPage })));

// Loading component for Suspense
const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4">
          <GlitchTitle text={t('home.title')} />
        </h1>
        <div className="text-sm md:text-xl font-mono text-[#FFCC00] flex items-center justify-center gap-3">
          <StatusDot delay={0.2} />
          {t('common.loading')}
        </div>
      </div>
    </div>
  );
};

import { SiteBackground } from './components/SiteBackground';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <SiteBackground />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/photos/:category" element={<PhotosCategoryPage />} />
            <Route path="/hola" element={<HolaPage />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
