#!/usr/bin/env bash

OUTFILE="taskora_src_files.txt"

find "/data/data/org.smartide.code/files/home/projects/TaskoraFrontend/src" -type f \
  ! -path "*/.git/*" \
  ! -path "*/node_modules/*" \
  ! -path "*/.vercel/*" \
  ! -path "*/.idea/*" \
  ! -path "*/dist/*" \
  ! -path "*/public/*" \
  -exec printf "\n--- FILE: %s ---\n" {} \; \
  -exec cat {} \; > "$OUTFILE"

echo "Done. Output saver to $OUTFILE"