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

// Ordre de subcategories per categoria pare; les no llistades s'ordenen alfabèticament.
const SUBCATEGORY_ORDER: Record<string, string[]> = {};

// import.meta.glob only records the file list at build time; calling the
// accessor for a given key is what actually resolves/fetches that one file.
// Keeping these at module scope and only invoking the keys we need is what
// lets each page load just the images it actually renders.
const thumbModules = import.meta.glob('../images/portfolio/*/thumbs/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });
const fullModules = import.meta.glob('../images/portfolio/*/fulls/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });
// Subcategoria: un nivell extra sota thumbs/fulls (Co niada dins d'un Cs).
const subThumbModules = import.meta.glob('../images/portfolio/*/thumbs/*/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });
const subFullModules = import.meta.glob('../images/portfolio/*/fulls/*/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { as: 'url' });

const parseThumbKey = (key: string): { category: string; subcategory?: string; filename: string } | null => {
  const subMatch = key.match(/portfolio\/([^/]+)\/thumbs\/([^/]+)\/([^/]+)$/);
  if (subMatch) return { category: subMatch[1], subcategory: subMatch[2], filename: subMatch[3] };
  const match = key.match(/portfolio\/([^/]+)\/thumbs\/([^/]+)$/);
  if (!match) return null;
  return { category: match[1], filename: match[2] };
};

const sortByOrder = (slugs: string[], order: string[]): string[] =>
  [...slugs].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

const sortBySlugOrder = (slugs: string[]): string[] => sortByOrder(slugs, CATEGORY_ORDER);

const sortBySubcategoryOrder = (category: string, slugs: string[]): string[] =>
  sortByOrder(slugs, SUBCATEGORY_ORDER[category] ?? []);

const filenamesByCategory = (): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  for (const key of Object.keys(thumbModules)) {
    const parsed = parseThumbKey(key);
    if (!parsed || parsed.subcategory) continue;
    if (!map.has(parsed.category)) map.set(parsed.category, []);
    map.get(parsed.category)!.push(parsed.filename);
  }
  return map;
};

// category -> subcategory -> filenames
const filenamesBySubcategory = (): Map<string, Map<string, string[]>> => {
  const map = new Map<string, Map<string, string[]>>();
  for (const key of Object.keys(subThumbModules)) {
    const parsed = parseThumbKey(key);
    if (!parsed || !parsed.subcategory) continue;
    if (!map.has(parsed.category)) map.set(parsed.category, new Map());
    const subMap = map.get(parsed.category)!;
    if (!subMap.has(parsed.subcategory)) subMap.set(parsed.subcategory, []);
    subMap.get(parsed.subcategory)!.push(parsed.filename);
  }
  return map;
};

// A category counts as present if it has direct images and/or subcategories
// (e.g. viatges only has subcategories like amsterdam/interrail, no direct files).
export const getCategorySlugs = (): string[] =>
  sortBySlugOrder(Array.from(new Set([...filenamesByCategory().keys(), ...filenamesBySubcategory().keys()])));

export const getSubcategorySlugs = (category: string): string[] =>
  sortBySubcategoryOrder(category, Array.from(filenamesBySubcategory().get(category)?.keys() ?? []));

const resolveThumb = (category: string, filename: string, subcategory?: string): Promise<string> | null => {
  const modules = subcategory ? subThumbModules : thumbModules;
  const suffix = subcategory ? `${category}/thumbs/${subcategory}/${filename}` : `${category}/thumbs/${filename}`;
  const key = Object.keys(modules).find((k) => k.endsWith(suffix));
  return key ? (modules[key]() as Promise<string>) : null;
};

const resolveFull = async (category: string, filename: string, fallback: string, subcategory?: string): Promise<string> => {
  const modules = subcategory ? subFullModules : fullModules;
  const suffix = subcategory ? `${category}/fulls/${subcategory}/${filename}` : `${category}/fulls/${filename}`;
  const key = Object.keys(modules).find((k) => k.endsWith(suffix));
  return key ? (modules[key]() as Promise<string>) : fallback;
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
  const bySubcategory = filenamesBySubcategory();
  const slugs = getCategorySlugs();

  return Promise.all(
    slugs.map(async (slug) => {
      const direct = (byCategory.get(slug) ?? []).map((filename) => ({ filename, subcategory: undefined as string | undefined }));
      const nested = Array.from(bySubcategory.get(slug)?.entries() ?? []).flatMap(([subcategory, filenames]) =>
        filenames.map((filename) => ({ filename, subcategory }))
      );
      const entries = [...direct, ...nested];
      if (entries.length === 0) return { slug, count: 0, thumb: undefined };
      const pick = entries[Math.floor(Math.random() * entries.length)];
      const thumb = await (resolveThumb(slug, pick.filename, pick.subcategory) ?? Promise.resolve(undefined));
      return { slug, count: entries.length, thumb };
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

const loadCategoryImages = async (category: string, subcategory: string | undefined): Promise<PortfolioImage[]> => {
  const filenames = subcategory
    ? filenamesBySubcategory().get(category)?.get(subcategory) ?? []
    : filenamesByCategory().get(category) ?? [];

  const images = await Promise.all(
    filenames.map(async (filename) => {
      const thumb = await (resolveThumb(category, filename, subcategory) ?? Promise.resolve(''));
      const full = await resolveFull(category, filename, thumb, subcategory);
      return { thumb, full, filename };
    })
  );

  return images.sort(() => Math.random() - 0.5);
};

/** Category (or subcategory) gallery: resolves every thumb + full for that gallery only. */
export function usePortfolioCategoryImages(category: string | undefined, subcategory?: string) {
  const cacheKey = category ? (subcategory ? `${category}/${subcategory}` : category) : undefined;
  const [images, setImages] = useState<PortfolioImage[]>(cacheKey ? categoryCache.get(cacheKey) ?? [] : []);
  const [isLoading, setIsLoading] = useState(() => !!cacheKey && !categoryCache.has(cacheKey));

  useEffect(() => {
    if (!category || !cacheKey) {
      setImages([]);
      setIsLoading(false);
      return;
    }
    if (categoryCache.has(cacheKey)) {
      setImages(categoryCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    if (!categoryLoadingPromises.has(cacheKey)) {
      categoryLoadingPromises.set(cacheKey, loadCategoryImages(category, subcategory));
    }
    let cancelled = false;
    categoryLoadingPromises.get(cacheKey)!.then((result) => {
      categoryCache.set(cacheKey, result);
      if (!cancelled) {
        setImages(result);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [category, subcategory, cacheKey]);

  return { images, isLoading };
}

let cachedSubcategoryPreviews = new Map<string, PortfolioCategoryPreview[]>();
let subcategoryPreviewsLoadingPromises = new Map<string, Promise<PortfolioCategoryPreview[]>>();

const loadSubcategoryPreviews = async (category: string): Promise<PortfolioCategoryPreview[]> => {
  const bySubcategory = filenamesBySubcategory().get(category) ?? new Map<string, string[]>();
  const slugs = sortBySubcategoryOrder(category, Array.from(bySubcategory.keys()));

  return Promise.all(
    slugs.map(async (slug) => {
      const filenames = bySubcategory.get(slug) ?? [];
      if (filenames.length === 0) return { slug, count: 0, thumb: undefined };
      const pick = filenames[Math.floor(Math.random() * filenames.length)];
      const thumb = await (resolveThumb(category, pick, slug) ?? Promise.resolve(undefined));
      return { slug, count: filenames.length, thumb };
    })
  );
};

/** Category page: resolves one random thumb per subcategory, if the category has any. */
export function usePortfolioSubcategoryPreviews(category: string | undefined) {
  const [previews, setPreviews] = useState<PortfolioCategoryPreview[]>(
    category ? cachedSubcategoryPreviews.get(category) ?? [] : []
  );
  const [isLoading, setIsLoading] = useState(() => !!category && !cachedSubcategoryPreviews.has(category));

  useEffect(() => {
    if (!category) {
      setPreviews([]);
      setIsLoading(false);
      return;
    }
    if (cachedSubcategoryPreviews.has(category)) {
      setPreviews(cachedSubcategoryPreviews.get(category)!);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    if (!subcategoryPreviewsLoadingPromises.has(category)) {
      subcategoryPreviewsLoadingPromises.set(category, loadSubcategoryPreviews(category));
    }
    let cancelled = false;
    subcategoryPreviewsLoadingPromises.get(category)!.then((result) => {
      cachedSubcategoryPreviews.set(category, result);
      if (!cancelled) {
        setPreviews(result);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { previews, isLoading };
}
