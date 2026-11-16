# Report: strophic lane A, Step 0 (read and measure)

Brief: `docs/sessions/brief-code-strophic-lane-a_r5_2026-11-15.md` (r5, read in full). Branch `cloud-lane-56`, cut from `origin/Shane` at `fb9d829e` ("Close of the 2026-11-15 Fable desk"). Working tree clean at the start. Cloud clone, Linux, Node 22, pnpm 10.28, `pnpm install --frozen-lockfile`.

**One correction to the setup.** The sandbox's local `Shane` was stale at `649fe492`. `git fetch` moved `origin/Shane` to `fb9d829e`, which is the commit the instruction names, and `649fe492` is its ancestor. The branch was cut from `origin/Shane`, not the local `Shane`.

## The eight gates on the untouched tip

| Gate | Baseline | Measured | Match |
| --- | --- | --- | --- |
| phonology | 462 passed (462) | 462 passed (462) | yes |
| dictionary | 248 passed (248) | 248 passed (248) | yes |
| svelte-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files | yes |
| web unit | 5817 passed, 1 skipped (5818) | 5817 passed, 1 skipped (5818) | yes |
| score-parser | 842 passed, 5 skipped (847) | 842 passed, 5 skipped (847) | yes |
| blurb | 178 passed (178) | 178 passed (178) | yes |
| root integration | 159 passed (159) | 159 passed (159) | yes |
| ratchets | OK | OK | yes |

The brief's gate list does not name the eight. I took them as the five package suites (phonology, dictionary, blurb, score-parser, root integration), `svelte-check`, the web unit suite, and `node scripts/ratchets.mjs`, and every count matched the baseline you gave. The build and Playwright are Step 5's.

## What changed in Step 0

Two new files, no code under any module the brief names:

- `apps/web/src/lib/markup/strophic-byte-baseline.test.ts` (new).
- `apps/web/src/lib/markup/strophic-byte-baseline.json` (new, the D8 baseline: 207 entries, one SHA-256 per tracked `.musicxml` under `apps/`, `docs/`, `tools/`, and `packages/`, of `paginateScore`'s pages at `markup-pages.test.ts`'s geometry, taken on `fb9d829e` before any other change; it is deterministic on a second run).

**D8 caveat.** D8 says the baseline is taken through the function MarkupPane will call, which is the extracted module of Step 4a. That module does not exist yet. For every tracked file the extracted function returns its input by reference, so the baseline through `paginateScore` is the same value. Step 4a's test must run the same hashes through the extracted function. The test carries a list, `FIXTURES_ADDED_BY_THE_LANE`, that Step 1 fills with the new fixtures' paths; nothing else may be missing from the baseline.

## Cited lines

I read every cited line at this tip. Those I could match by exact text all stand at their cited numbers: `unfold.ts` 85, 150, 190, 215, 249, 622, 677; `performance-order.ts` 64; `verses.ts` 22; `MarkupPane.svelte` 591, 606, 733, 853, 855, 877, 925 to 941; `staff-renderer.ts` 754, 764, 772, 943 to 944, 2197 to 2198, 2378, 3127 to 3129, 3147; `page-layout.ts` 136, 139, 264, 284, 309, 313, 328, 388, 465; `types.ts` 139, 290, 625, 636; `musicxml-parser.ts` 821, 901; `grace.ts` 28, 149, 166; `accidental-carry.ts` 41; `loupe-ink.ts` 102, 107, 136, 199, 215, 228, 229, 255 to 256; `selection-ring.ts` 193, 196, 199; `Loupe.svelte` 952, 1055, 1102, 1131, 1996; `loupe.ts` 57 to 58, 347; `vowel-resolver.ts` 216 to 221, 653; `rebar.ts` 362 to 384. I did not read lines 133 of `ties-and-slurs.ts` and 69 to 70 and 90 to 91 of `printed-marks.ts` closely enough to say the exact text matches; they are at the cited lines but I did not re-derive their behaviour.

**Where the files are.** The brief names `Loupe.svelte`, `loupe.ts`, `loupe-ink.ts`, `selection-ring.ts`, `vowel-resolver.ts`, and `rebar.ts` without a directory. All six live in `apps/web/src/lib/score/`, not `markup/`. `MarkupPane.svelte` is in `markup/`.

**The corrected score keeps repeat and ending markers.** `rebar.ts:344-384` builds each measure from `...bar.base`, so `repeatStart`, `repeatEnd`, `repeatTimes`, `repeatAfterJump`, `jump`, and `ending` survive. It deletes them only on a piece of a bar that was split (`!p0.first` for `repeatStart` and `jump`, `!pl.last` for `repeatEnd`, `repeatTimes`, and `repeatAfterJump`). Fable's read stands, with that split-bar nuance.

## D2: what pass 1 prints today under a verse-1 slur where verse 2 sings (ESTABLISHED)

I ran it. A one-bar test score had four notes: verse 1 and 2 on notes 1, 3, and 4, and on note 2 only verse 2 (a verse-1 continuation). The parser gives that note `syllable = { text: "свет", verseNumber: 2 }` with no `versesInfo` (`musicxml-parser.ts:821`; `vowel-resolver.ts:216`). The path MELODY uses (`buildUnderlayResolvers(score, 1)`; a `cyrPreview` record built as `MarkupPane.svelte:682-698` does) printed `ночь`, `свет`, `мать`, `вода`. So **pass 1 prints verse 2's word under the note where verse 1 holds a slur**, as the brief predicted. Therefore, in a score with a kept later pass, pass 1's events take the verse-1 view's syllables (ids unchanged), and the report for Steps 3 and 4a will say so. The resolver's `cyrillic` hook returned nothing for any note in this test (no modern-spelling difference), so the printed word was the note's own syllable. The temporary test is deleted and is not in the commit.

## Readers of the hit and event attributes (D6)

Non-test files that read `data-hit`, `data-event-id`, `data-of-event`, `data-ipa-of`, `data-system`, or `data-tacet`, with counts of non-comment lines: `Loupe.svelte` 36, `loupe-ink.ts` 12, `selection-ring.ts` 9, `loupe-probe.ts` (e2e-phone) 8, `staff-renderer.ts` 7 (writer), `MarkupPane.svelte` 4, `grace-draw.ts` 3 (writer), `loupe-hold.ts` 3, `crossing-ring.ts` 3, `+page.svelte` 2, `loupe.ts` 2, `TimeSignatureControls.svelte` 2, `page-layout.ts` 1 (writer), `system-ground.ts` 1, `loupe-render.ts` 1, `ClefControls.svelte` 1.

**Two readers the brief's list lacks:** `ClefControls.svelte:66` and `loupe-render.ts:41-50` (it writes a `data-system` range for the Loupe's own excerpt). `ClefControls.svelte:66` walks every `[data-hit]` of its system and picks the nearest to a barline, as `TimeSignatureControls.svelte:41` does. Under D6 a later-pass event has no `data-hit`, so both controls see pass 1's events only, which is the intended inertness. **NOT ESTABLISHED:** whether either control misplaces itself in a mixed system where the nearest hit is a later-pass bar's neighbour; Step 4a's pictures can show it, and I have not seen it.

**Readers of the value of `data-system`:** only `Loupe.svelte:1056` (`parseSystemRange`). `loupe-ink.ts:199` and `crossing-ring.ts:92`, `selection-ring.ts:237, 261`, `MarkupPane.svelte:365`, and `Loupe.svelte:523, 1044` use `[data-system]` as a `closest` or `querySelectorAll` handle and do not read its value. **Readers of `data-tacet`:** `loupe-ink.ts:112, 137` and `loupe.ts:347` use it as a handle; none reads the value.

**A finding the brief does not name.** `Loupe.svelte:1055-1058` collects only wrappers that carry `data-system`, and `Loupe.svelte:1996` reports `system: systemIndexOf(ranges, measureIndex) + 1`. A system that holds later-pass bars only carries `data-verse-system` (D6), so it drops out of the ranges and the Loupe's own "system N" number can fall behind the page's count after such a system. I have not run it. Step 4a's check, "open the Loupe on a bar after the passage and report which system it names", will measure it.

**Walks over a system's elements** (D6): `loupe-ink.ts:199-252` (`pageMetrics`: every element of every `[data-system]`, skipping `rect[data-hit]` by name at `:229`), `loupe-ink.ts:255-256` (the system head is the leftmost `[data-hit]`), `loupe-ink.ts:102` (`musicInk` gates on the first `MUSIC_MARK`, `loupe.ts:347`), `selection-ring.ts:193-199` (`ipaBaselineOf`), `Loupe.svelte:952`, `Loupe.svelte:1131-1141` (renames hit rectangles in its clone), and `system-ground.ts:70`.

## Readers keyed by event id between the render score and the page

The five option channels (`cyrPreview` `staff-renderer.ts:3128`, `ipaPreview` `:3129`, `sylTypePreview` `:943-944` and `:3147`, `melismaPreview` `:3127`, `withheldIpa` `:3134`), and `analyzed.events[id]` (`staff-renderer.ts:1575, 2046, 2071, 2239, 2659`; `ties-and-slurs.ts:145-146, 227, 365`), plus the Cyrillic read at `:2383`. A sixth, `slurAcross`, is computed inside `renderSystemSlice` from the score handed in (`page-layout.ts:257`), so derived ids reach it without a channel. `incomingAccidentals` is keyed by pitch, not by event id. **Every channel is looked up by `ev.id` of the score `paginateScore` is given, so a derived id reaches each one if D5's module re-keys the five option records and `analyzed.events` under the derived ids.** Nothing between the render score and the page reads by a source id I did not list. `MarkupPane.svelte:359-365` and `crossing-ring.ts:90` find a note's hit by id in the live page; a later-pass id has no `data-hit`, so they find nothing, which D6 intends.

## `~v` in tracked scores (D4)

`~v` occurs in no tracked `.musicxml` (207 files) and in no non-test source under `apps/web/src` or `packages/*/src`. Event and grace ids in the tree are the parser's own (`m<bar>-<voice>-<n>`, plus `~g`/`~a` for grace notes). **NOT ESTABLISHED** (as the brief already says): that a singer's own file cannot supply a `<note id>` containing `~v`.

## `sungVerseNumbers` and `analyzePerVerse` callers (§4)

`sungVerseNumbers`: one non-test caller, `analyze-per-verse.ts:42`, plus the export at `index.ts:39`. `analyzePerVerse`: no non-test caller on this tip (the file's own header names it; the grep finds none elsewhere). Fable's read stands.

## The scan reader

- **Verses: one.** The only code that writes lyrics into homr's output, `underlay-words.ts:182` and `:187`, writes `<lyric number="1">` only. The scan reader returns one verse.
- **Repeat barlines: NOT ESTABLISHED.** `metre-witness.ts:152` matches `<repeat` and heavy barline styles as a break if homr's MusicXML carries them, so the code expects that they may appear. I did not run homr (not in this sandbox) and have no scan output to look at, so whether homr emits `<repeat>` is not known to me.

## Does the render report a bar's x position to the page-layout seam (D7)?

**No, as data.** `renderSystemSlice` returns one SVG string (`page-layout.ts:214-221`), and `paginateScore` reads only its `viewBox` (`viewBoxOf`, `:182-185`). Nothing returns a bar's drawn x or a group's x. What the string holds: each note is a `<g data-event-id>` whose first child is `<rect data-hit x=...>` (`staff-renderer.ts:2899, 2919`), and its left edge is the midpoint to the previous column (`hitL`), not the note's own x. The notehead's own `x` sits inside the same group. **So the label's x can be read out of the markup by the seam, but the hit rectangle is a gap midpoint, so I would take the notehead glyph's `x` and say so; this is the decision for Step 4b.** I have not touched `staff-renderer.ts` for the label, and I do not now expect to need to. A derived-id event group is drawn like any other, so its `x` is in the markup in the same place.

## The clause at `staff-renderer.ts:764` (named before any edit, D7)

Today: `if (open && open.toMeasure === m.index - 1 && !meterDeclaredAt(parsed, m.index) && !keyDeclaredAt(parsed, m.index))`. **Proposed edit:** `tacetRuns(parsed)` gains an optional second parameter, a set of bar indices at which a run must not extend (`breakAt?: ReadonlySet<number>`), and the clause gains `&& !breakAt?.has(m.index)`. It has two callers: `staff-renderer.ts:1543` (inside the system render) and `page-layout.ts:284`. Both must pass the same set, so `StaffRenderOptions` gains one optional field and `paginateScore` gains one optional option that feeds it. The set comes from the render score's per-bar report (D4's "its source index, its pass, and its verse place"). That adds a few lines to `staff-renderer.ts` (3412 of 3427, room for 15) and does not touch `types.ts`. **A different route I considered and rejected:** reading the printed bar `number` (a restart at a pass boundary) inside the renderer, because a number that repeats is a property of the printed edition, not a signal I should infer from; it would also fire on a legitimate renumbered bar.

## Ratchets

`MarkupPane.svelte` 1362 of 1364 (room for 2). `staff-renderer.ts` 3412 of 3427. `Loupe.svelte` 3012 of 3012. `types.ts` 999 of the default 1000. Not in the brief's list, and relevant to D6: `loupe.ts` 990, `selection-ring.ts` 406, `loupe-ink.ts` 282, all under the 1000-line default for an unlisted file. **`loupe.ts` has 10 lines of room**, which will bind the D6 guard there. `page-layout.ts` is 477. `i18n.ts` is exempt.

**`markup.verseLabel` does not exist.** Grep for `verseLabel` and `verseTag` in `i18n.ts` finds nothing, so Step 4b must add the keys. The ratified strings are in `OPEN.md` ("STROPHIC VERSE LABELS, EN AND FR", 12:58): "Verse 2" / « Couplet 2 », and "12 · verse 2" / « 12 · couplet 2 ». I will copy those words and no others. If you read "write no new English or French" as covering even the keys that carry ratified words, say so before Step 4b; otherwise I proceed.

## What I could not establish

- Whether homr's output carries `<repeat>` (scan reader).
- Whether `ClefControls` and `TimeSignatureControls` misplace themselves in a mixed system.
- How the Loupe's "system N" behaves after a later-pass-only system (Step 4a measures it).
- Whether a singer's own `<note id>` can contain `~v`.
- The exact text at `ties-and-slurs.ts:133`, `printed-marks.ts:69-70` and `:90-91` against the brief's claims about them; I confirmed the line numbers fall in the right functions, not the behaviour.
