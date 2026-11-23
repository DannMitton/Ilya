# Fable's review: batch 3 brief r2, and the WCAG report

r1, 2026-11-23 early. Fable 5.2, one session, two documents (`CONTRACT.md` section 4, one Fable session a day, many briefs). 182,267 tokens of a 300,000 cap, 25 tool uses, 5.7 minutes. Read at `Shane` `e8f64d4f`. Filed by the desk from Fable's returned memo; Fable wrote no files and ran no build.

## Task A verdict: DO NOT SEND for r2. r3 carries every amendment below.

All three of r2's corrections to r1 were confirmed in the tree. The blockers are about what r2 left out.

### Blocker 1. Batch 3 is not the folder rename, and r2 said it was

`apps/web/src/lib/names.ts:102-130` records batch 3 as five renames: the identifiers `markup` to `melody` and `MarkupPane` to `MelodyPane` (`:106-109`); the folder (`:110`); the stored tab id with a migration that keeps reading `'markup'` (`:112-117`); the `guide-markup-*` anchors with a second migration step (`:118-123`); and the key `tab.markedScore` to `tab.melody` (`:124-129`). `docs/house-style/code-conventions.md:11`, `:41`, and `:43` add `BAND_IDS.scoreMarkup`, three headings, `shane.profiles.v2`, and 94 hyphenated i18n keys.

**The danger named:** an agent in a lane titled "consistency batch 3", told that "every mention follows it", reads `names.ts:116` and writes `melody` as the stored tab id, with no line in r2 telling it to stop. A second danger is bookkeeping: the desk books batch 3 as done and then builds the header test, the module map, and the line-number sweep against `MarkupPane`, churning them later.

**The desk verified this in the tree** and established what Fable left open: every one of the five is still open, `tab.melody` has zero occurrences, `shane.profiles.v2` is live at `profileStore.ts:75`, and the `guide-markup-*` anchors have 36 sites. r3's section 4 is that inventory.

### Blocker 2. The done-when cannot be met without a file r2 never names

`names.ts:110` holds `today: 'apps/web/src/lib/markup/'`, so r2's own grep hits it. `names-table.test.ts:52` builds the "folder today" cell from it and `:70-73` compares it with `ARCHITECTURE.md:173`. Updating one without the other fails gate 4, and `ARCHITECTURE.md` sits outside r2's grep scope while r2 section 5 says to stop if gate 4 moves.

### The ten amendments, all applied in r3

1. **Step 0, how the value is shared.** `svelte.config.js` is plain JavaScript loaded by Node, which does not load `.ts`, so it cannot import `vite.config.ts`. Move `buildId()` into a new `apps/web/build-id.js` and import it in both. Fable's DESK DEFAULT on the file name.
2. **The ratchet key governs imports in both directions.** `moduleOfSpec` (`:93-97`) resolves `$lib/melody/...` through `moduleOfPath`, and `:115` skips a null target, so `insights/` importing `melody/` would also pass unseen. Prove the gate is live after the rename by adding a forbidden import, running `node scripts/ratchets.mjs`, pasting the breach, and removing it.
3. **The sites r2 does not name:** `names.ts:110` with `ARCHITECTURE.md:173`; prose at `ARCHITECTURE.md:137-138`, `:164`, `:237`, `AGENTS.md:11`, `code-conventions.md:11`; three tests reading by relative path (`one-head-one-foot.test.ts:22`, `footer-credit.test.ts:42`, `stand-in-borrowing.test.ts:170`); seven reading from the working directory; the hand-written key index at `i18n.ts:50`, `:51`, `:54`, `:63`, `:89`, `:91`. And widen the done-when grep from `lib/markup` to `markup/`.
4. **A bright line** listing everything that does not change: file names, the tab id, CSS selectors, the environment variable, the anchors, every i18n key, and `names.ts` `identifiers` and `persisted`.
5. **Retitle as a first slice** and replace section 4 with the inventory.
6. **Expected failures are not "gate 4 moved".** Between the `git mv` and the last path fix the tests fail with file-not-found; the rule is about the final count.
7. **Step 0's done-when compares all of `build/`**, not only `_app`, with `diff -rq` and its output in the report. The 2026-11-19 measurement covered three paths only (`ENVIRONMENT.md:5677`), so a second cause is not ruled out.
8. **Name step 0's side effects:** two deployments of one commit share a version name, so a redeploy of the same commit raises no update notice and installs no new worker. Pages are network-first and chunks content-hashed, so what can go stale is an unhashed static file. Report, do not repair.
9. **The rename changes built bytes by itself.** Svelte's default `cssHash` hashes the component file name, so the folder's five `.svelte` files get new scoped class names after the move. Step 0 therefore lands first, and a before-and-after difference in those names is expected. Fable's inference from reading, not from a build.
10. **Citation tidying:** the ceiling loop is `:72-74`, the `MODULES` object `:78-85`. And `ENVIRONMENT.md:5679` still carries r1's wrong sentence that `build/sw.js` stamps its own `CACHE_VERSION`; that is the desk's to fix.

### Citations checked

Every citation in r2 CONFIRMED, including SvelteKit's `Date.now()` fallback at `kit/src/core/config/options.js:312`, the `version.json` write at `kit/src/exports/vite/index.js:1022-1023`, `stamp-sw.mjs:18`, `:27`, `:75` (so r1's second wire would have been a duplicate), `ratchets.mjs:83`, `:87-91`, `:109`, `:113`, and `ratchets.json:16`. Two CORRECTED: r2 section 4's "found none" (blocker 1), and r1's `vite.config.ts:13-18`, which stops two lines short.

Checked and clean: no `markup` key in `.github/`, `vercel.json`, either `tsconfig.json`, `playwright.config.ts`, or `vitest.config.ts`; no other clock, random, or path source in the seven `apps/web/scripts/*.mjs`. One ordering source found: `stamp-sw.mjs:49` walks with `readdirSync` unsorted.

## Task B: the WCAG report

**The headline barrier is CONFIRMED, with one correction that widens it.** `MarkupPane.svelte:306-310` is the comment, `:311-321` the effect, `:319` a `document.addEventListener('click', handler)`; no `keydown` and no `tabindex` in the file. The rectangles carry no `tabindex`, role, or name (`staff-renderer.ts:2645`, `:2920`, `grace-draw.ts:136`). **The correction: that listener only selects.** The Loupe is opened at `+page.svelte:1399` from pointer coordinates and at `:2367`, both outside `markup/`, so the repair is not confined to `MarkupPane.svelte`.

| barrier | verdict |
|---|---|
| 1. Keyboard cannot open the Loupe | CONFIRMED, and wider than cited |
| 2. Loupe takes no focus; Escape drops it | PARTLY CONFIRMED. The "2.4.11" citation is unsupported. `LoupeSyllables.svelte:30-31` records that nothing is focused there by a ruling, so the obvious fix meets a recorded ruling and is Dann's |
| 3. Nothing announces a correction | CONFIRMED on the markup (`CorrectionSurface.svelte:469`; no `aria-live` anywhere in `score/*.svelte`) |
| 4. Unnamed 1-pixel field | PARTLY CONFIRMED. It is `<input type="file">`, not a text field. "A screen reader says edit text, blank" is unsupported |
| 5. Word names | CONFIRMED on the markup; the report gives two different element counts, 550 and 736 |
| 6. Focus ring contrast | CONFIRMED on the arithmetic, 2.85 to 1, but against `--drawer-bg` rather than the page |
| `.sigil-name` contrast | PARTLY CONFIRMED |
| `aria-required-children` | PARTLY CONFIRMED; the report's wording does not match the markup |
| `scrollable-region-focusable`, `nested-interactive`, `label`, `target-size` | NOT CONFIRMED |

**What stops a singer:** barrier 1, for anyone who cannot use a pointer. Barrier 2 hinders once 1 is repaired; barrier 4 is a confusing second Tab stop and a two-attribute fix. Barrier 3 is screen-reader only. Barriers 5 and 6 and the table's rows are technical conformance, of which 354 contrast elements are the real workload.

**What the report claims beyond its method:** every screen-reader announcement (none was run, as its own section 6 says); that the phone behaves the same (the phone has its own tap handler at `+page.svelte:1381-1399`); and "the whole list that I could find", since axe covers a minority of criteria and it ran a dev server rather than a build. "Not met at A and AA" is supportable, because one failure suffices.

**Order against the rename:** the rename goes first. Barrier 1's repair touches `MarkupPane.svelte`, which moves, and would add lines to a file whose ceiling is 1,231. Barriers 3, 4, 5, and 6 live outside the folder and do not depend on it.

## What Fable could not establish

Whether two builds differ in zero files once the name is fixed (no build was run); whether `readdirSync` order is stable between builds; whether amendment 9 happens in a real build; which Node version Vercel uses; which batch 3 items were already done (the desk established this); the gate baselines and the ship script, none of which Fable read; the Loupe's keyboard reachability through `+page.svelte:2367`; and every behavioural count in the WCAG report.

Terms: "first slice" and "bright line" are Fable's coinages; "DESK DEFAULT" and "NOT ESTABLISHED" are the project's.
