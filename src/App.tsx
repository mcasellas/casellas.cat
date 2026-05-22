import { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Lazy load pages for better performance and smaller bundle size
import { HomePage } from './pages/HomePage';
const CVPage = lazy(() => import('./pages/CVPage').then(m => ({ default: m.CVPage })));
const PhotosPage = lazy(() => import('./pages/PhotosPage').then(m => ({ default: m.PhotosPage })));
const HolaPage = lazy(() => import('./pages/HolaPage').then(m => ({ default: m.HolaPage })));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
    <motion.div 
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="text-[#FFCC00] font-mono text-xs uppercase tracking-widest"
    >
      Loading...
    </motion.div>
  </div>
);

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
