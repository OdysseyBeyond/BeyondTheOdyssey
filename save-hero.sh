#!/bin/bash
# Copy the illustration to the clipboard, then run:  ./save-hero.sh
set -e
DEST="$(cd "$(dirname "$0")" && pwd)/assets/hero.png"

osascript <<'OSA' 2>/dev/null || { echo "No image on the clipboard. Copy the picture first (right-click the image -> Copy Image), then run this again."; exit 1; }
set d to (the clipboard as «class PNGf»)
set p to (POSIX file "/Users/hwani0814/Desktop/my_homepage/assets/hero.png")
set f to open for access p with write permission
set eof f to 0
write d to f
close access f
OSA
echo "saved -> $DEST"
