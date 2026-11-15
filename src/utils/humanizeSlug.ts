// Converteix un slug de carpeta (p. ex. "a_cel_obert") en un text llegible
// ("A cel obert") per quan no hi ha traducció definida a locales/*.json.
// El plugin de Lightroom converteix els espais en "_", així els guions
// reals del nom (p. ex. "Sant Joan-Despí") es conserven tal qual.
export const humanizeSlug = (slug: string): string => {
  const text = slug.replace(/_+/g, ' ').trim();
  return text.charAt(0).toLocaleUpperCase('ca') + text.slice(1);
};

// A la URL només hi deixem [a-z0-9-]: es treuen accents, dièresis, ç, "l·l"...
// i qualsevol altre caràcter passa a "-" (p. ex. "l'església_de_cèl·lers" → "l-esglesia-de-cellers").
// Ha de coincidir amb toUrlSlug de scripts/prerender.js.
export const toUrlSlug = (slug: string): string =>
  slug
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/·/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Troba la carpeta real que correspon a un segment de URL (accepta també
// URLs antigues amb accents).
export const fromUrlSlug = (urlSlug: string | undefined, folders: string[]): string | undefined => {
  if (urlSlug === undefined) return undefined;
  const normalized = toUrlSlug(urlSlug);
  return folders.find((f) => f === urlSlug || toUrlSlug(f) === normalized);
};
