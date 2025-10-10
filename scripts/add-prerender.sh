#!/bin/bash

# Add prerender export to all .astro pages except API routes

files=(
  "src/pages/404.astro"
  "src/pages/about.astro"
  "src/pages/contribute.astro"
  "src/pages/episodes/index.astro"
  "src/pages/episodes/[slug].astro"
  "src/pages/guests/index.astro"
  "src/pages/guest/[slug].astro"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Check if file already has prerender export
    if ! grep -q "export const prerender" "$file"; then
      # Add export at the beginning of the frontmatter (after ---)
      sed -i.bak '1,/^---$/s/^---$/---\nexport const prerender = true;\n/' "$file"
      echo "✅ Added prerender to $file"
      rm "${file}.bak"
    else
      echo "⏭️  Skipped $file (already has prerender)"
    fi
  else
    echo "❌ File not found: $file"
  fi
done
