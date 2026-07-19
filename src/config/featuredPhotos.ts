export interface FeaturedPhoto {
  category: string;
  filename: string;
}

// Ordre = ordre de les 5 caselles de la home (tags: traditions, nature, catalonia, travel, street).
// filename ha de coincidir exactament amb el nom de fitxer dins de
// src/images/portfolio/<category>/thumbs/<filename>
export const FEATURED_PHOTOS: FeaturedPhoto[] = [
  { category: 'tradicions', filename: 'MCM8002-Mejorado-NR-2.webp' },
  { category: 'natura', filename: 'M5031248-Enhanced-NR-2.webp' },
  { category: 'catalunya', filename: 'MCM7808-HDR-Editar.webp' },
  { category: 'viatges', filename: 'MCM6297-Enhanced-NR.webp' },
  { category: 'viatges', filename: 'DSC2922-NEF_DxO_DeepPRIMEXD.webp' },
];
