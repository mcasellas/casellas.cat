#!/bin/bash
# Script per optimitzar les fotos de la pàgina d'Inici a WebP
# Aquestes fotos són crítiques per al LCP

SRC_DIR="src/images"

# Detectar si usem magick o convert
if command -v magick >/dev/null 2>&1; then
    CMD="magick"
elif command -v convert >/dev/null 2>&1; then
    CMD="convert"
else
    echo "Error: No s'ha trobat ImageMagick (ni magick ni convert)."
    exit 1
fi

echo "Iniciant optimització de les fotos d'Inici amb $CMD..."

# Optimitzem les 5 fotos principals
for i in {1..5}; do
    # Busquem tant .jpg com .JPG
    FILE=""
    if [ -f "$SRC_DIR/$i.jpg" ]; then
        FILE="$SRC_DIR/$i.jpg"
    elif [ -f "$SRC_DIR/$i.JPG" ]; then
        FILE="$SRC_DIR/$i.JPG"
    fi

    if [ -n "$FILE" ]; then
        echo "Optimitzant $FILE -> $i.webp"
        # Redimensionem a un màxim de 580px per costat per optimitzar al màxim el LCP
        if $CMD "$FILE" -resize "580x580>" -quality 75 "$SRC_DIR/$i.webp"; then
            echo "✓ Creat $i.webp. Eliminant original..."
            rm "$FILE"
        else
            echo "✗ Error processant $FILE"
        fi
    else
        echo "⚠ No s'ha trobat la foto $i.jpg"
    fi
done

echo "---"
echo "Optimització de les fotos d'Inici finalitzada."
echo "Recorda actualitzar els imports a App.tsx per fer servir els fitxers .webp"
