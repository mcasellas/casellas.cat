#!/bin/bash
# Script per optimitzar fotos noves a WebP (Fulls i Thumbs), organitzades per categoria
# Adaptat per Marc Casellas
#
# Ús: ./optimize-portfolio.sh <categoria>
# Cal deixar les fotos RAW (jpg/jpeg/png) directament dins de
# src/images/portfolio/<categoria>/ (no dins de fulls/ ni thumbs/).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

CATEGORY="$1"

if [ -z "$CATEGORY" ]; then
    echo "Ús: $0 <categoria>"
    echo "Categories existents:"
    find src/images/portfolio -mindepth 1 -maxdepth 1 -type d -printf '  - %f\n' 2>/dev/null
    exit 1
fi

SRC_DIR="src/images/portfolio/$CATEGORY"
FULLS_DIR="$SRC_DIR/fulls"
THUMBS_DIR="$SRC_DIR/thumbs"

mkdir -p "$FULLS_DIR"
mkdir -p "$THUMBS_DIR"

if command -v magick >/dev/null 2>&1; then
    CMD="magick"
elif command -v convert >/dev/null 2>&1; then
    CMD="convert"
else
    echo "Error: ImageMagick no trobat."
    exit 1
fi

echo "Iniciant optimització de '$CATEGORY' amb $CMD..."

# Use find to handle filenames with spaces and special characters safely
find "$SRC_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r file; do
    base=$(basename "$file")

    # Netejar nom: treure caràcters inicials i canviar extensió
    clean_name=$(echo "$base" | sed 's/^[_-]*//' | sed 's/\.[^.]*$//').webp

    echo "Processant: $base"

    # 3. Generar FULL (preservant metadades) i THUMB (sense metadades)
    if $CMD "$file" -quality 75 "$FULLS_DIR/$clean_name" && \
       $CMD "$file" -quality 60 -resize "580x580>" -strip "$THUMBS_DIR/$clean_name"; then
        echo "✓ $clean_name generat. Eliminant original."
        rm "$file"
    else
        echo "✗ Error en $base"
    fi
done

echo "---"
echo "Optimització de '$CATEGORY' finalitzada."
