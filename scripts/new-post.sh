#!/usr/bin/env bash
set -euo pipefail
title="${*:-New Post}"
slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g;s/^-+|-+$//g')"
date="$(date +%Y-%m-%d)"
file="_posts/${date}-${slug}.md"

if [[ -f "$file" ]]; then
  echo "File exists: $file" >&2; exit 1
fi

mkdir -p _posts
sed "s/Post title/${title}/" _templates/post.md > "$file"
echo "Created $file"
