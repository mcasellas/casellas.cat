import fs from 'fs';
import path from 'path';
import { FEATURED_PHOTOS } from '../src/config/featuredPhotos.ts';

const portfolioDir = path.resolve('src/images/portfolio');

const missing = FEATURED_PHOTOS.filter(({ category, subcategory, filename }) => {
  const thumbPath = subcategory
    ? path.join(portfolioDir, category, 'thumbs', subcategory, filename)
    : path.join(portfolioDir, category, 'thumbs', filename);
  return !fs.existsSync(thumbPath);
});

if (missing.length > 0) {
  console.error('✗ FEATURED_PHOTOS (src/config/featuredPhotos.ts) apunta a fotos que ja no existeixen:');
  missing.forEach(({ category, subcategory, filename }) => {
    const shown = subcategory ? `${category}/${subcategory}/${filename}` : `${category}/${filename}`;
    console.error(`  - ${shown}`);
  });
  console.error('\nSegurament el plugin de Lightroom ha renombrat o mogut aquestes fotos.');
  console.error('Actualitza src/config/featuredPhotos.ts amb els noms/rutes correctes.');
  process.exit(1);
}

console.log('✓ FEATURED_PHOTOS: totes les fotos destacades existeixen.');
