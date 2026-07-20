import { useEffect, useState } from 'react';

export interface PortfolioImage {
  thumb: string;
  full: string;
  filename: string;
}

export interface PortfolioCategoryPreview {
  slug: string;
  count: number;
  thumb?: string;
}

export interface FeaturedPhoto {
  category: string;
  filename: string;
}

const CATEGORY_ORDER = ['viatges', 'natura', 'astrofotografia', 'catalunya', 'concerts', 'tradicions'];

// import.meta.glob only records the file list at build time; calling the
// accessor for a given key is what actually resolves/fetches that one file.
// Keeping these at module scope and only invoking the keys we need is what
// lets each page load just the images it actually renders.
const thumbModules = import.meta.glob('../images/portfolio/*/thumbs/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });
const fullModules = import.meta.glob('../images/portfolio/*/fulls/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });

const parseThumbKey = (key: string): { category: string; filename: string } | null => {
  const match = key.match(/portfolio\/([^/]+)\/thumbs\/([^/]+)$/);
  if (!match) return null;
  return { category: match[1], filename: match[2] };
};

const sortBySlugOrder = (slugs: string[]): string[] =>
  [...slugs].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

const filenamesByCategory = (): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  for (const key of Object.keys(thumbModules)) {
    const parsed = parseThumbKey(key);
    if (!parsed) continue;
    if (!map.has(parsed.category)) map.set(parsed.category, []);
    map.get(parsed.category)!.push(parsed.filename);
  }
  return map;
};

export const getCategorySlugs = (): string[] => sortBySlugOrder(Array.from(filenamesByCategory().keys()));

const resolveThumb = (category: string, filename: string): Promise<string> | null => {
  const key = Object.keys(thumbModules).find((k) => k.endsWith(`${category}/thumbs/${filename}`));
  return key ? (thumbModules[key]() as Promise<string>) : null;
};

const resolveFull = async (category: string, filename: string, fallback: string): Promise<string> => {
  const key = Object.keys(fullModules).find((k) => k.endsWith(`${category}/fulls/${filename}`));
  return key ? (fullModules[key]() as Promise<string>) : fallback;
};

/** Home page: resolves only the handful of thumbs listed in FEATURED_PHOTOS. */
export function useFeaturedPhotoThumbs(featured: FeaturedPhoto[]) {
  const [thumbs, setThumbs] = useState<(string | undefined)[]>(() => featured.map(() => undefined));

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      featured.map(({ category, filename }) => resolveThumb(category, filename) ?? Promise.resolve(undefined))
    ).then((urls) => {
      if (!cancelled) setThumbs(urls);
    });
    return () => {
      cancelled = true;
    };
  }, [featured]);

  return thumbs;
}

let cachedPreviews: PortfolioCategoryPreview[] | null = null;
let previewsLoadingPromise: Promise<PortfolioCategoryPreview[]> | null = null;

const loadPreviews = async (): Promise<PortfolioCategoryPreview[]> => {
  const byCategory = filenamesByCategory();
  const slugs = sortBySlugOrder(Array.from(byCategory.keys()));

  return Promise.all(
    slugs.map(async (slug) => {
      const filenames = byCategory.get(slug) ?? [];
      if (filenames.length === 0) return { slug, count: 0, thumb: undefined };
      const pick = filenames[Math.floor(Math.random() * filenames.length)];
      const thumb = await (resolveThumb(slug, pick) ?? Promise.resolve(undefined));
      return { slug, count: filenames.length, thumb };
    })
  );
};

/** /photos overview: resolves just one random thumb per category. */
export function usePortfolioCategoryPreviews() {
  const [previews, setPreviews] = useState<PortfolioCategoryPreview[]>(cachedPreviews ?? []);
  const [isLoading, setIsLoading] = useState(!cachedPreviews);

  useEffect(() => {
    if (cachedPreviews) {
      setPreviews(cachedPreviews);
      setIsLoading(false);
      return;
    }
    if (!previewsLoadingPromise) {
      previewsLoadingPromise = loadPreviews();
    }
    let cancelled = false;
    previewsLoadingPromise.then((result) => {
      cachedPreviews = result;
      if (!cancelled) {
        setPreviews(result);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { previews, isLoading };
}

const categoryCache = new Map<string, PortfolioImage[]>();
const categoryLoadingPromises = new Map<string, Promise<PortfolioImage[]>>();

const loadCategoryImages = async (slug: string): Promise<PortfolioImage[]> => {
  const filenames = filenamesByCategory().get(slug) ?? [];

  const images = await Promise.all(
    filenames.map(async (filename) => {
      const thumb = await (resolveThumb(slug, filename) ?? Promise.resolve(''));
      const full = await resolveFull(slug, filename, thumb);
      return { thumb, full, filename };
    })
  );

  return images.sort(() => Math.random() - 0.5);
};

/** Category gallery: resolves every thumb + full for that single category only. */
export function usePortfolioCategoryImages(slug: string | undefined) {
  const [images, setImages] = useState<PortfolioImage[]>(slug ? categoryCache.get(slug) ?? [] : []);
  const [isLoading, setIsLoading] = useState(() => !!slug && !categoryCache.has(slug));

  useEffect(() => {
    if (!slug) {
      setImages([]);
      setIsLoading(false);
      return;
    }
    if (categoryCache.has(slug)) {
      setImages(categoryCache.get(slug)!);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    if (!categoryLoadingPromises.has(slug)) {
      categoryLoadingPromises.set(slug, loadCategoryImages(slug));
    }
    let cancelled = false;
    categoryLoadingPromises.get(slug)!.then((result) => {
      categoryCache.set(slug, result);
      if (!cancelled) {
        setImages(result);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { images, isLoading };
}
