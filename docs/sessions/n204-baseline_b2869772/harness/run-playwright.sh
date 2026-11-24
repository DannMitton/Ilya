#!/bin/bash
# FAMILY 10. usage: bash run-playwright.sh <repo root> <out dir> <run label>
# Runs BOTH projects (chromium = apps/web/e2e, phone = apps/web/e2e-phone) in one go, against the dev server the config starts (`pnpm dev`, port 5173),
# with no update or snapshot flag and traces off. Writes <out>/pw-<label>.json (Playwright's own report), .log, and a per-test result list.
set -u
ROOT=$(cd "$1" && pwd); mkdir -p "$2"; OUT=$(cd "$2" && pwd); L=$3
export PW_CHROMIUM_PATH=${PW_CHROMIUM_PATH:-$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome 2>/dev/null | head -1)}
cd "$ROOT/apps/web"
date -u +%FT%TZ > "$OUT/pw-$L.start"
PLAYWRIGHT_JSON_OUTPUT_NAME="$OUT/pw-$L.json" pnpm exec playwright test --reporter=list,json --trace off > "$OUT/pw-$L.log" 2>&1
echo "exit=$?" > "$OUT/pw-$L.exit"
date -u +%FT%TZ > "$OUT/pw-$L.end"
pkill -f "vite dev" 2>/dev/null
node -e '
const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); const rows = [];
const walk = (s, file) => { for (const sp of s.specs ?? []) for (const t of sp.tests ?? []) rows.push(`${t.projectName}\t${(t.results.at(-1) ?? {}).status ?? "none"}\t${t.status}\t${sp.file}:${sp.line}\t${[...(s.title ? [s.title] : []), sp.title].join(" > ")}`); for (const c of s.suites ?? []) walk(c, file); };
for (const s of r.suites ?? []) walk(s, s.file);
rows.sort(); console.log(rows.join("\n"));
' "$OUT/pw-$L.json" > "$OUT/pw-$L.results.tsv"
echo "run $L: $(wc -l < "$OUT/pw-$L.results.tsv") tests; $(cut -f2 "$OUT/pw-$L.results.tsv" | sort | uniq -c | tr '\n' ' ')"
