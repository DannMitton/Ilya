#!/bin/bash
# Bundles one step0e .mts file against the tree and runs it.
# usage: step0e-run.sh <entry.mts> <workdir> <tmpdir>
set -e
H=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$H/../../.." && pwd)
mkdir -p "$3"
"$REPO/node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/bin/esbuild" "$H/$1" \
	--bundle --platform=node --format=esm --outfile="$3/${1%.mts}.mjs" --log-level=warning
node "$3/${1%.mts}.mjs" "$2"
