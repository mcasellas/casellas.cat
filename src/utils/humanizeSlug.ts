// Converteix un slug de carpeta (p. ex. "a_cel_obert") en un text llegible
// ("A cel obert") per quan no hi ha traducció definida a locales/*.json.
// El plugin de Lightroom converteix els espais en "_", així els guions
// reals del nom (p. ex. "Sant Joan-Despí") es conserven tal qual.
export const humanizeSlug = (slug: string): string => {
  const text = slug.replace(/_+/g, ' ').trim();
  return text.charAt(0).toLocaleUpperCase('ca') + text.slice(1);
};

// A la URL els "_" de la carpeta es mostren com a "-" (queda més net).
export const toUrlSlug = (slug: string): string => slug.replace(/_/g, '-');

// Troba la carpeta real que correspon a un segment de URL.
export const fromUrlSlug = (urlSlug: string | undefined, folders: string[]): string | undefined =>
  urlSlug === undefined ? undefined : folders.find((f) => f === urlSlug || toUrlSlug(f) === urlSlug);
