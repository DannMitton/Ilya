#!/bin/bash
# Bundles and runs step0c-sites.mts. Run after step0c-browser.mjs, step0c-staves.mts, and step0c-metre.mjs.
# usage: step0c-run.sh <workdir> <tmpdir>
set -e
H=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$H/../../.." && pwd)
node "$H/step0c-mkprobes.mjs" "$2/gen"
"$REPO/node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/bin/esbuild" "$H/step0c-sites.mts" \
	--bundle --platform=node --format=esm --alias:@gen="$2/gen" --outfile="$2/sites.mjs" --log-level=warning
node "$2/sites.mjs" "$1"
