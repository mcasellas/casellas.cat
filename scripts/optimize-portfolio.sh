#!/bin/bash
# Script per optimitzar el portfoli a WebP (Fulls i Thumbs)
# Adaptat per Marc Casellas

SRC_DIR="src/images/portfolio"
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

echo "Iniciant optimització amb $CMD..."

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
echo "Optimització finalitzada."
