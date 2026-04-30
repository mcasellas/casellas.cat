import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const pages = ['photos', 'cv'];

pages.forEach(page => {
  const pageDir = path.join(distDir, page);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(distDir, 'index.html'),
    path.join(pageDir, 'index.html')
  );
  console.log(`✓ Creat ${page}/index.html`);
});
