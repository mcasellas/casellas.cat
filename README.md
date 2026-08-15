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

Els originals (source of truth) van a `/originals/<categoria>/` (carpeta fora de git,
al `.gitignore`, que no s'esborra mai). Per generar/actualitzar `src/images/portfolio/`
a partir d'aquests originals:

```bash
scripts/sync-portfolio.sh            # totes les categories
scripts/sync-portfolio.sh viatges    # només una categoria
```

L'script genera `fulls/` (webp qualitat 75) i `thumbs/` (webp 580px, qualitat 60) per
cada foto nova o modificada, i esborra el full/thumb de qualsevol foto que ja no
existeixi a `originals/`. Els fitxers de `fulls/`/`thumbs/` sí que es pugen a git
(són els que consumeix el build).

Al final, si hi ha canvis a `src/images/portfolio/`, l'script en fa `git commit`
i `git push` automàticament — cada sincronització deixa el repo (i, per tant, el
desplegament via GitHub Pages) al dia.
