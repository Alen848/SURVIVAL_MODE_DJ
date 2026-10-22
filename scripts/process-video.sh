#!/bin/bash
# Encodes the curated live clips from _source into web-ready MP4s + posters.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/_source"
OUT="$ROOT/public/media/video"
mkdir -p "$OUT"

# name | source | start | duration | optional pre-filter (fixes clips filmed sideways)
CLIPS=(
  "drop-1|VIDEOS NUEVOS/survival Mode -  Drop 1.mp4|18|14"
  "drop-2|VIDEOS NUEVOS/survival Mode -  Drop 2.mp4|6|14"
  "booth-red|VIDEOS NUEVOS/DSC_3491.mov|0|12"
  "booth-hands|VIDEOS NUEVOS/DSC_3459.mov|4|14"
  "vanguard|VIDEOS NUEVOS/IMG_4401.mov|6|14|transpose=2,"
  "led-stage|VIDEOS NUEVOS/IMG_8109.mov|6|14"
  "sonora-park|VIDEOS VIEJOS/copy_18947044-A4E4-4E86-BDA1-148251423F02.mov|10|14"
  "festival-blue|VIDEOS VIEJOS/IMG_1386.mov|0|14"
  "bouncing|VIDEOS VIEJOS/IMG_9769.MOV|4|14"
)

for c in "${CLIPS[@]}"; do
  IFS='|' read -r name file ss dur pre <<< "$c"
  ffmpeg -loglevel error -y -ss "$ss" -t "$dur" -i "$SRC/$file" \
    -vf "${pre}scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -crf 25 -profile:v high -movflags +faststart \
    -c:a aac -b:a 96k -ac 2 "$OUT/$name.mp4"
  ffmpeg -loglevel error -y -ss 1.5 -i "$OUT/$name.mp4" -frames:v 1 -q:v 4 "$OUT/$name.jpg"
  echo "$name $(du -h "$OUT/$name.mp4" | cut -f1)"
done

# Hero montage: horizontal center crops of four clips, silent, seamless-ish loop.
H=()
for spec in "drop-1|2" "booth-red|1" "sonora-park|3" "festival-blue|2" "drop-2|4"; do
  IFS='|' read -r n s <<< "$spec"; H+=(-ss "$s" -t 2.6 -i "$OUT/$n.mp4")
done
ffmpeg -loglevel error -y "${H[@]}" -filter_complex \
 "[0:v]crop=720:405:0:400,scale=1600:900,setsar=1[a];[1:v]crop=720:405:0:520,scale=1600:900,setsar=1[b];[2:v]crop=720:405:0:300,scale=1600:900,setsar=1[c];[3:v]crop=720:405:0:420,scale=1600:900,setsar=1[d];[4:v]crop=720:405:0:450,scale=1600:900,setsar=1[e];[a][b][c][d][e]concat=n=5:v=1:a=0,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -preset slow -crf 27 -movflags +faststart "$OUT/hero.mp4"
ffmpeg -loglevel error -y -ss 0.4 -i "$OUT/hero.mp4" -frames:v 1 -q:v 4 "$OUT/hero.jpg"
# Mobile hero: vertical, silent
ffmpeg -loglevel error -y -t 10 -i "$OUT/drop-1.mp4" -an -c:v libx264 -preset slow -crf 28 -movflags +faststart "$OUT/hero-mobile.mp4"
du -sh "$OUT"
