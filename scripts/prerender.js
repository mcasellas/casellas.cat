import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const portfolioDir = path.resolve('src/images/portfolio');
// Ha de coincidir amb toUrlSlug de src/utils/humanizeSlug.ts.
const toUrlSlug = (slug) =>
  slug
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/·/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const categories = fs.existsSync(portfolioDir)
  ? fs.readdirSync(portfolioDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
  : [];

const subcategoriesOf = (category) => {
  const thumbsDir = path.join(portfolioDir, category, 'thumbs');
  return fs.existsSync(thumbsDir)
    ? fs.readdirSync(thumbsDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
    : [];
};

const pages = [
  'photos', 'cv', 'hola',
  ...categories.map(slug => `photos/${toUrlSlug(slug)}`),
  ...categories.flatMap(category => subcategoriesOf(category).map(sub => `photos/${toUrlSlug(category)}/${toUrlSlug(sub)}`)),
];

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
