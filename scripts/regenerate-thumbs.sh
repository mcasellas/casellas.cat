#!/bin/bash
# Sincronitza src/images/portfolio/<categoria>/ després d'una reorganització
# manual. Es poden deixar fotos soltes (RAW jpg/jpeg/png o ja en .webp) tant
# a l'arrel de la categoria com dins de fulls/: l'script les normalitza totes.
#
#  1. Mou qualsevol foto solta de l'arrel de la categoria cap a fulls/.
#  2. Converteix a WebP optimitzat (qualitat 75) qualsevol RAW (jpg/jpeg/png)
#     que trobi dins de fulls/, i elimina l'original un cop convertit.
#  3. Per a cada categoria, esborra tots els thumbs existents i els torna a
#     generar de zero a partir dels fulls (580x580, qualitat 60, sense
#     metadades), garantint que thumbs i fulls quedin sempre en parella.
#
# Es pot executar des de qualsevol lloc (troba l'arrel del projecte sol).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

SRC_DIR="src/images/portfolio"

if [ ! -d "$SRC_DIR" ]; then
    echo "Error: no trobo $SRC_DIR (executant des de $(pwd))."
    exit 1
fi

if command -v magick >/dev/null 2>&1; then
    CMD="magick"
elif command -v convert >/dev/null 2>&1; then
    CMD="convert"
else
    echo "Error: ImageMagick no trobat."
    exit 1
fi

echo "1) Movent fotos soltes a l'arrel de cada categoria cap a fulls/..."
find "$SRC_DIR" -mindepth 1 -maxdepth 1 -type d | while read -r category_dir; do
    find "$category_dir" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r file; do
        fulls_dir="$category_dir/fulls"
        mkdir -p "$fulls_dir"
        echo "Movent: $file -> $fulls_dir/"
        mv "$file" "$fulls_dir/"
    done
done

echo ""
echo "2) Convertint a WebP optimitzat qualsevol RAW (jpg/jpeg/png) dins de fulls/..."
find "$SRC_DIR" -mindepth 2 -maxdepth 2 -type d -iname "fulls" | while read -r fulls_dir; do
    find "$fulls_dir" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r raw; do
        base=$(basename "$raw")
        clean_name=$(echo "$base" | sed 's/^[_-]*//' | sed 's/\.[^.]*$//').webp
        echo "Optimitzant: $raw -> $fulls_dir/$clean_name"
        if $CMD "$raw" -quality 75 "$fulls_dir/$clean_name"; then
            rm "$raw"
        else
            echo "✗ Error convertint $raw"
        fi
    done
done

echo ""
echo "3) Esborrant tots els thumbs i regenerant-los des dels fulls..."
find "$SRC_DIR" -mindepth 1 -maxdepth 1 -type d | while read -r category_dir; do
    fulls_dir="$category_dir/fulls"
    thumbs_dir="$category_dir/thumbs"

    [ -d "$fulls_dir" ] || continue

    rm -rf "$thumbs_dir"
    mkdir -p "$thumbs_dir"

    find "$fulls_dir" -maxdepth 1 -type f -iname "*.webp" | while read -r full; do
        base=$(basename "$full")
        thumb="$thumbs_dir/$base"
        echo "Thumb: $full -> $thumb"
        $CMD "$full" -quality 60 -resize "580x580>" -strip "$thumb"
    done
done

echo "---"
echo "Fet."
