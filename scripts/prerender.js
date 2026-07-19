import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const portfolioDir = path.resolve('src/images/portfolio');

const categories = fs.existsSync(portfolioDir)
  ? fs.readdirSync(portfolioDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
  : [];

const pages = ['photos', 'cv', 'hola', ...categories.map(slug => `photos/${slug}`)];

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
