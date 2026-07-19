import { useEffect, useState } from 'react';

export interface PortfolioImage {
  thumb: string;
  full: string;
  filename: string;
}

export interface PortfolioCategory {
  slug: string;
  images: PortfolioImage[];
}

const CATEGORY_ORDER = ['viatges', 'natura', 'astrofotografia', 'catalunya', 'concerts', 'tradicions'];

let cachedCategories: PortfolioCategory[] | null = null;
let loadingPromise: Promise<PortfolioCategory[]> | null = null;

const loadCategories = async (): Promise<PortfolioCategory[]> => {
  const thumbModules = import.meta.glob('../images/portfolio/*/thumbs/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });
  const fullModules = import.meta.glob('../images/portfolio/*/fulls/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });

  const byCategory = new Map<string, PortfolioImage[]>();

  for (const key of Object.keys(thumbModules)) {
    const match = key.match(/portfolio\/([^/]+)\/thumbs\/([^/]+)$/);
    if (!match) continue;
    const [, category, filename] = match;

    const thumbUrl = await (thumbModules[key]() as Promise<string>);
    const fullKey = Object.keys(fullModules).find((k) => k.endsWith(`${category}/fulls/${filename}`));
    const fullUrl = fullKey ? await (fullModules[fullKey]() as Promise<string>) : thumbUrl;

    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)!.push({ thumb: thumbUrl, full: fullUrl, filename });
  }

  return Array.from(byCategory.entries())
    .filter(([, images]) => images.length > 0)
    .map(([slug, images]) => ({ slug, images: images.sort(() => Math.random() - 0.5) }))
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.slug);
      const ib = CATEGORY_ORDER.indexOf(b.slug);
      if (ia === -1 && ib === -1) return a.slug.localeCompare(b.slug);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
};

export function usePortfolioCategories() {
  const [categories, setCategories] = useState<PortfolioCategory[]>(cachedCategories ?? []);
  const [isLoading, setIsLoading] = useState(!cachedCategories);

  useEffect(() => {
    if (cachedCategories) {
      setCategories(cachedCategories);
      setIsLoading(false);
      return;
    }
    if (!loadingPromise) {
      loadingPromise = loadCategories();
    }
    let cancelled = false;
    loadingPromise.then((result) => {
      cachedCategories = result;
      if (!cancelled) {
        setCategories(result);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, isLoading };
}
