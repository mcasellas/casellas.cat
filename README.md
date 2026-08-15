# Marc Casellas - Portfolio

Aquest és el codi font del meu portfolio personal. Inclou seccions sobre la meva feina com a enginyer informàtic, la meva passió per la ràdio i una galeria fotogràfica.

## Tecnologies utilitzades

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Framer Motion** (animacions)

## Com provar-ho en local

1. **Instal·la les dependències:**
   ```bash
   npm install
   ```

2. **Executa el servidor de desenvolupament:**
   ```bash
   npm run dev
   ```

3. **Obre el navegador:**
   Ves a `http://localhost:3000`

## Estructura del projecte

- `/public/images`: Conté les fotografies del portfolio.
- `/src`: Codi font de l'aplicació.
- `App.tsx`: Component principal amb el disseny i la lògica.

## Gestió de les fotos del portfolio

Tot el flux es gestiona des del plugin de Lightroom a `lightroom-plugin/`
(`ExportServiceProvider.lua` + `PortfolioSync.lua`) — no cal cap script bash
ni `.bat`. En crear una col·lecció de publicació per categoria i prémer
"Publish": Lightroom exporta cada foto com a JPEG a `/originals/<categoria>/`
(carpeta fora de git, al `.gitignore`, que fa de "master"), el propi plugin
genera `fulls/` (webp qualitat 75) i `thumbs/` (webp 580px, qualitat 60) a
`src/images/portfolio/<categoria>/` cridant `magick` directament, i finalment
fa `git add`/`commit`/`push` dels canvis. Si treus una foto de la col·lecció
i tornes a publicar, el plugin esborra l'original i els seus webp.

Al mateix diàleg de configuració del servei hi ha el botó **"Sincronitza tot
ara (originals/ → src/)"**, que esborra permanentment tota
`src/images/portfolio/` i la regenera des de zero a partir de totes les
fotos que ja hi ha a `originals/` (no només les publicades en aquell
moment) — així mai queden webp orfes encara que `originals/` s'hagi tocat a
mà (recuperable via git si ja hi havia commit). No cal tornar a publicar
cada foto una per una des de Lightroom. Útil després de canviar la
qualitat/mida del webp o si algun fitxer s'ha malmès. Les fotos es
processen en paral·lel: el nombre de processos `magick` simultanis es
configura al camp "Processos en paral·lel" (0 = automàtic: nuclis del
processador × 2, ja que la feina és sobretot d'E/S de disc i la CPU no se
sol saturar amb un worker per nucli; el camp admet fins a 64 si vols provar
valors més alts a mà).

### Subcategories (Collection Set > Collection a Lightroom)

Una categoria pot tenir subcategories agrupant col·leccions dins d'un
Collection Set (Cs) a Lightroom: el Cs esdevé la categoria i cada Collection
(Co) que hi ha a dins la subcategoria, generant:

```
originals/<categoria>/foto.jpg                 # Co amb el mateix nom que el Cs (fotos "arrel")
originals/<categoria>/<subcategoria>/foto.jpg  # qualsevol altra Co dins del Cs
```

El plugin ho detecta llegint el Collection Set pare de la col·lecció que
estàs publicant (`ExportServiceProvider.lua`, `resolveCategoryAndSubcategory`)
— no cal configurar cap carpeta de destí manualment. Genera
`src/images/portfolio/<categoria>/{fulls,thumbs}/<subcategoria>/` igual que
per a una categoria plana. Al web, cada subcategoria té pàgina pròpia a
`/photos/<categoria>/<subcategoria>`.

### Noms de carpeta amb accents, espais o l·l

El nom de la col·lecció (o del Collection Set) es converteix automàticament
a minúscules amb espais convertits en `-` per formar el slug de carpeta/URL.
Per mostrar el nom "bonic" a la web cal afegir l'entrada corresponent a
`src/locales/ca.json`/`en.json` (`photos.categories.<slug>` o
`photos.subcategories.<categoria>.<slug>`); si no hi ha traducció, es mostra
el slug tal qual.
