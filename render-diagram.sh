#!/bin/bash
# Renders architecture.mmd to PNG and PDF
# Usage: ./render-diagram.sh
# Requires: npx (comes with Node.js)

npx --yes @mermaid-js/mermaid-cli \
  -i architecture.mmd \
  -o architecture.png \
  -b white -w 1600 --scale 3

npx --yes @mermaid-js/mermaid-cli \
  -i architecture.mmd \
  -o architecture.pdf \
  -b white

echo "Done: architecture.png + architecture.pdf"
