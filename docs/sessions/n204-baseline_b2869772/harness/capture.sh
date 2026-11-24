#!/bin/bash
# THE ONE COMMAND:  bash docs/sessions/n204-baseline_b2869772/harness/capture.sh <repo root> <out dir>
# Needs: the repo at the commit to photograph, `pnpm install --frozen-lockfile` done, and `pnpm --filter @ilya/web build` done in that tree.
# Families 1, 2, 6 (vitest), 3, 4, 5 (Playwright against the built app), 7, 8, 9 (the build). Family 10 is `run-playwright.sh`.
# It writes under <out dir> and nothing else, and it changes no tracked file.
set -u
ROOT=$(cd "$1" && pwd); OUT=$2; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd)
HERE=$(cd "$(dirname "$0")" && pwd)
export ILYA_REPO_ROOT="$ROOT" CAPTURE_OUT="$OUT"
[ -z "${PW_CHROMIUM_PATH:-}" ] && export PW_CHROMIUM_PATH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome 2>/dev/null | head -1)
{
  echo "commit: $(git -C "$ROOT" rev-parse HEAD)"; echo "node: $(node -v)"; echo "pnpm: $(pnpm -v)"; echo "os: $(uname -srmo)"; echo "tz: ${TZ:-unset}"
  echo "playwright: $(cd "$ROOT/apps/web" && pnpm exec playwright --version)"; echo "chromium: $("$PW_CHROMIUM_PATH" --version 2>/dev/null)"
  echo "scipy: $(python3 -c 'import scipy;print(scipy.__version__)' 2>&1 | tail -1)"
  echo "started: $(date -u +%FT%TZ)"
} > "$OUT/environment.txt"
cd "$ROOT/apps/web"
for f in melody text i18n; do
  echo "== vitest: $f"; pnpm exec vitest run --config "$HERE/vitest.capture.config.mts" "$HERE/$f.capture.ts" 2>&1 | tail -6
done
echo "== build lists"; node "$HERE/build-lists.mjs" "$ROOT" "$OUT/family-build"
echo "== live capture"; node "$HERE/live-capture.mjs" "$ROOT" "$OUT"
for b in "$OUT"/family5-binder-voice/*.ilya; do [ -f "$b" ] && python3 -I "$HERE/binder-members.py" "$b" > "${b%.ilya}.members.txt"; done
# the input list, so a later lane can re-capture rather than guess
{ echo "# inputs: tracked .musicxml (family 1)"; git -C "$ROOT" ls-files -z -- '*.musicxml' | tr '\0' '\n' | grep -E '^(apps|docs|tools|packages)/' | sort; } > "$OUT/inputs.txt"
echo "finished: $(date -u +%FT%TZ)" >> "$OUT/environment.txt"
(cd "$OUT" && find . -type f ! -name MANIFEST.sha256 | LC_ALL=C sort | xargs sha256sum > MANIFEST.sha256)
echo "manifest: $(sha256sum "$OUT/MANIFEST.sha256" | cut -c1-16) over $(wc -l < "$OUT/MANIFEST.sha256") files"
