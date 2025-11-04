#!/usr/bin/env bash
set -euo pipefail

# Batch-optimize images (covers/posts) for Open Graph and page weight.
#
# - JPEG: resize down to max width, strip metadata, progressive, quality X
# - PNG:  resize down to max width, try lossless compression
#
# Prefers ImageMagick (magick/convert + identify). Fallback to macOS sips.
#
# Usage examples:
#   scripts/optimize-images.sh --dry-run
#   scripts/optimize-images.sh --max-width 1600 --quality 82 \
#       --dirs assets/images/covers assets/images/posts

MAX_WIDTH=1600
QUALITY=82
DRY_RUN=0
DIRS=("assets/images")
# Optional PNG optimizers
USE_PNGQUANT=0
PNGQUANT_QUALITY="65-85"   # lossy range, keep high fidelity
PNGQUANT_SPEED=1            # slower = better compression
USE_OXIPNG=0
OXIPNG_LEVEL=4              # 1..6 (higher = slower, better)

human() {
  local bytes="$1"
  local base=1024
  local scale=0
  local units=(B KB MB GB TB)
  while ((bytes >= base && scale < ${#units[@]} - 1)); do
    bytes=$((bytes / base))
    ((scale++))
  done
  printf "%s%s" "$bytes" "${units[$scale]}"
}

die() {
  echo "Error: $*" >&2
  exit 1
}

have_cmd() { command -v "$1" >/dev/null 2>&1; }

IM_IDENTIFY=""
IM_CONVERT=""
SIPS=""
if have_cmd magick; then
  IM_IDENTIFY=(magick identify)
  IM_CONVERT=(magick convert)
elif have_cmd identify && have_cmd convert; then
  IM_IDENTIFY=(identify)
  IM_CONVERT=(convert)
elif have_cmd sips; then
  SIPS=(sips)
else
  die "Need ImageMagick (magick/convert+identify) or sips"
fi

stat_size() {
  local f="$1"
  if stat -f%z "$f" >/dev/null 2>&1; then
    stat -f%z "$f"
  else
    stat -c%s "$f"
  fi
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --max-width)
      MAX_WIDTH="$2"
      shift 2
      ;;
    --quality)
      QUALITY="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --dirs)
      shift
      DIRS=()
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        DIRS+=("$1")
        shift
      done
      ;;
    -h | --help)
      cat <<EOF
Usage: $0 [--max-width N] [--quality Q] [--dry-run] [--dirs DIR ...]
  --max-width  Max width in px (default ${MAX_WIDTH})
  --quality    JPEG quality 1-95 (default ${QUALITY})
  --dry-run    Show actions, do not modify files
  --dirs       Directories to scan (defaults: assets/images/covers assets/images/posts)
  --pngquant [Q]  Enable lossy PNG quantization; optional quality range like 65-85
  --pngquant-speed N  Speed 1..11 (1=best)
  --oxipng [LEVEL]    Enable oxipng lossless optimization; default level ${OXIPNG_LEVEL}
EOF
      exit 0
      ;;
    --pngquant)
      USE_PNGQUANT=1
      # Optional next token as quality
      if [[ ${2-} =~ ^[0-9]+-?[0-9]*$ ]]; then PNGQUANT_QUALITY="$2"; shift 2; else shift 1; fi
      ;;
    --pngquant-speed)
      PNGQUANT_SPEED="$2"; shift 2; ;;
    --oxipng)
      USE_OXIPNG=1
      if [[ ${2-} =~ ^[0-6]$ ]]; then OXIPNG_LEVEL="$2"; shift 2; else shift 1; fi
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
    esac
  done
}

process_im_jpeg() {
  local f="$1"
  local tmp="$f.tmp.jpg"
  local size_before w h
  size_before=$(stat_size "$f")
  read -r w h < <("${IM_IDENTIFY[@]}" -format "%w %h" "$f" 2>/dev/null || echo "0 0")
  [[ "$w" == "" || "$w" == 0 ]] && {
    echo "[--] $f: identify failed"
    return
  }
  local resize_arg="${MAX_WIDTH}x>"
  "${IM_CONVERT[@]}" "$f" -strip -interlace Plane -sampling-factor 4:2:0 \
    -resize "$resize_arg" -quality "$QUALITY" "$tmp" 2>/dev/null || {
    echo "[--] $f: convert failed"
    return
  }
  local size_after
  size_after=$(stat_size "$tmp")
  if ((DRY_RUN)); then
    echo "[OK] $f: would save $(human "$size_before") -> $(human "$size_after")"
    rm -f "$tmp"
  else
    if ((size_after < size_before)); then
      mv -f "$tmp" "$f"
      echo "[OK] $f: saved $(human "$size_before") -> $(human "$size_after")"
    else
      rm -f "$tmp"
      echo "[--] $f: no gain"
    fi
  fi
}

best_file() {
  # echo the path of the smallest file among args
  local best=""
  local best_size=0
  for p in "$@"; do
    [[ -f "$p" ]] || continue
    local s; s=$(stat_size "$p")
    if [[ -z "$best" || $s -lt $best_size ]]; then
      best="$p"; best_size=$s
    fi
  done
  [[ -n "$best" ]] && echo "$best"
}

process_im_png() {
  local f="$1"
  local tmp="$f.tmp.png"
  local size_before
  size_before=$(stat_size "$f")
  local resize_arg="${MAX_WIDTH}x>"
  "${IM_CONVERT[@]}" "$f" -strip -resize "$resize_arg" \
    -define png:compression-level=9 -define png:compression-filter=5 "$tmp" 2>/dev/null || {
    echo "[--] $f: convert failed"; return; }

  local candidates=("$tmp")

  # Optional: lossy quantization via pngquant
  if (( USE_PNGQUANT )) && command -v pngquant >/dev/null 2>&1; then
    local qtmp="$f.q.png"
    pngquant --skip-if-larger --force --output "$qtmp" --quality="$PNGQUANT_QUALITY" --speed "$PNGQUANT_SPEED" "$tmp" >/dev/null 2>&1 || true
    [[ -f "$qtmp" ]] && candidates+=("$qtmp")
  fi

  # Optional: oxipng lossless pass
  if (( USE_OXIPNG )) && command -v oxipng >/dev/null 2>&1; then
    local otmp="$f.oxi.png"
    oxipng -o "$OXIPNG_LEVEL" -Z --strip all -q --out "$otmp" "$tmp" >/dev/null 2>&1 || true
    [[ -f "$otmp" ]] && candidates+=("$otmp")
  fi

  local best; best=$(best_file "${candidates[@]}")
  [[ -z "$best" ]] && { rm -f "$tmp"; echo "[--] $f: no candidates"; return; }

  local size_after; size_after=$(stat_size "$best")
  if (( DRY_RUN )); then
    echo "[OK] $f: would save $(human "$size_before") -> $(human "$size_after")"
    rm -f "$tmp" "$f.q.png" "$f.oxi.png" 2>/dev/null || true
    return
  fi

  if (( size_after < size_before )); then
    mv -f "$best" "$f"
    echo "[OK] $f: saved $(human "$size_before") -> $(human "$size_after")"
  else
    echo "[--] $f: no gain"
  fi
  # cleanup leftovers
  for p in "$tmp" "$f.q.png" "$f.oxi.png"; do [[ -f "$p" && "$p" != "$f" ]] && rm -f "$p"; done
}

lc() { echo "$1" | tr '[:upper:]' '[:lower:]'; }

process_sips() {
  local f="$1"
  local ext="${f##*.}"
  ext="$(lc "$ext")"
  local size_before
  size_before=$(stat_size "$f")
  # Get current width
  local w
  w=$(${SIPS[@]} -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/ {print $2}')
  [[ -z "$w" ]] && { echo "[--] $f: sips identify failed"; return; }

  if ((DRY_RUN)); then
    if ((w > MAX_WIDTH)); then echo "[OK] $f: would resize $w -> $MAX_WIDTH"; fi
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then echo "[OK] $f: would set JPEG high quality (approx)"; fi
    # PNG: indicate optional extra compression
    if [[ "$ext" == "png" ]]; then
      if (( USE_PNGQUANT )); then echo "[OK] $f: would run pngquant (${PNGQUANT_QUALITY}, speed ${PNGQUANT_SPEED})"; fi
      if (( USE_OXIPNG )); then echo "[OK] $f: would run oxipng (-o ${OXIPNG_LEVEL})"; fi
    fi
    return
  fi

  # Work on a temp copy; replace only if smaller
  local tmp
  tmp="$(mktemp "${f##*/}.XXXXXX")" || { echo "[--] $f: mktemp failed"; return; }
  cp -p "$f" "$tmp" || { echo "[--] $f: copy failed"; rm -f "$tmp"; return; }
  if ((w > MAX_WIDTH)); then
    ${SIPS[@]} -Z "$MAX_WIDTH" "$tmp" >/dev/null || true
  fi
  if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
    ${SIPS[@]} -s formatOptions high "$tmp" >/dev/null || true
  fi
  # For PNGs, try extra compressors and pick the best
  if [[ "$ext" == "png" ]]; then
    local candidates=("$tmp")
    if (( USE_PNGQUANT )) && command -v pngquant >/dev/null 2>&1; then
      local qtmp="$f.q.png"
      pngquant --skip-if-larger --force --output "$qtmp" --quality="$PNGQUANT_QUALITY" --speed "$PNGQUANT_SPEED" "$tmp" >/dev/null 2>&1 || true
      [[ -f "$qtmp" ]] && candidates+=("$qtmp")
    fi
    if (( USE_OXIPNG )) && command -v oxipng >/dev/null 2>&1; then
      local otmp="$f.oxi.png"
      oxipng -o "$OXIPNG_LEVEL" -Z --strip all -q --out "$otmp" "$tmp" >/dev/null 2>&1 || true
      [[ -f "$otmp" ]] && candidates+=("$otmp")
    fi
    local best; best=$(best_file "${candidates[@]}")
    local size_after; size_after=$(stat_size "$best")
    if (( size_after < size_before )); then
      mv -f "$best" "$f"
      echo "[OK] $f: saved $(human "$size_before") -> $(human "$size_after")"
    else
      echo "[--] $f: no gain"
    fi
    for p in "$tmp" "$f.q.png" "$f.oxi.png"; do [[ -f "$p" && "$p" != "$f" ]] && rm -f "$p"; done
  else
    local size_after
    size_after=$(stat_size "$tmp")
    if (( size_after < size_before )); then
      mv -f "$tmp" "$f"
      echo "[OK] $f: saved $(human "$size_before") -> $(human "$size_after")"
    else
      rm -f "$tmp"
      echo "[--] $f: no gain"
    fi
  fi
}

process_file() {
  local f="$1"
  local ext="${f##*.}"
  ext="$(lc "$ext")"
  case "$ext" in
  jpg | jpeg)
    if [[ -n "$IM_CONVERT" ]]; then process_im_jpeg "$f"; else process_sips "$f"; fi
    ;;
  png)
    if [[ -n "$IM_CONVERT" ]]; then process_im_png "$f"; else process_sips "$f"; fi
    ;;
  *) : ;;
  esac
}

main() {
  parse_args "$@"
  local total=0 optim=0
  for d in "${DIRS[@]}"; do
    [[ -d "$d" ]] || {
      echo "skip missing dir: $d"
      continue
    }
    while IFS= read -r -d '' f; do
      total=$((total + 1))
      process_file "$f"
    done < <(find "$d" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)
  done
}

main "$@"
