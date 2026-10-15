# Fable review of the row 47 brief (the voice line read an octave up or down for the singer's range), r1

Reviewer: Fable 5.1, 2026-10-15. Brief: `docs/sessions/brief-code-octave-for-your-range_r1_2026-10-08.md` (r1, 2026-10-08). Checked against a fresh clone of `Shane` at `14e2ff8`. Every `path:line` below was read this session at that commit. Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, second of rows 5, 47, 48, 13. Strings RATIFIED by Dann 2026-10-08 01:20; none is changed here.

## Verdict

SEND WITH AMENDMENTS (1 to 12). The downward reading exists where the brief says and the upward one is the gap, as Dann kept it. The brief leaves four mechanisms to Code's invention that the tree already has a pattern for (the per-song preference, the two call sites, the Markup notice slot, the Insights block), its gate baseline and lane are stale, and its browser check names a Mac library the cloud box does not have. Nothing in it is unsound.

## Citations checked

| Citation | Status at `14e2ff8` |
|---|---|
| `resolveVocalReadingOctave` reads a treble line an octave down when that fits strictly better | CONFIRMED: `packages/score-parser/src/vocal-octave.ts:48-89`. Non-G clefs return 0 at `:52`; the strict test is `inRangeFraction(-1) > inRangeFraction(0) ? -1 : 0` at `:89`. |
| The explicit octave-clef branch, `marked <= -1` | CONFIRMED: `vocal-octave.ts:54-72`, returns `storesSounding ? 0 : marked`. |
| `shiftVocalOctave` is non-destructive and already handles "or higher" | CONFIRMED: `vocal-octave.ts:92-114`; its doc says "lower (or higher)" (`:93`), it clears `clefs` (`:106`) so the renderer re-picks a clef. |
| `InsightsPane.svelte:142` | MOVED to `apps/web/src/lib/insights/InsightsPane.svelte:144-145`. |
| `MarkupPane.svelte:540-548` | MOVED to `apps/web/src/lib/markup/MarkupPane.svelte:557-571`; the notice is drawn through `NotesColumn`'s `octave` prop at `:1032` and `:1034` (`NotesColumn.svelte:28`, `:93`). |
| `profile.octaveNotice`, `i18n.ts:1316` | MOVED to `apps/web/src/lib/i18n.ts:1321`. `MarkupPane.svelte:570` records it as "Approved copy (Dann, 2026-07-18)". |
| "No typed range: no shift, as now" | CONFIRMED: `vocal-octave.ts:74`. |
| Gate 4 baseline 1991 | STALE. The desk's baseline tonight is 2512; `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:112` still reads 2433 (last moved 2026-10-12). The session reports what it measures. |
| "Runs after row 46" | MET: row 46 shipped 2026-10-08 (`gates-scratch.sh`, the 1991 to 1997 line). |

## Executability, and what the tree already has

- **The per-song preference.** The brief says "remembered with the song" and names no mechanism. N.94's key choice is the pattern: `SongRecord.transposition?` (`apps/web/src/lib/library/types.ts:127`), `SongFields.transposition` (`library.ts:60`, read at `:87`, dropped from the record when null at `:100`), `document.svelte.ts:91` (`$state`), `:258` and `:307` (save and load), and `validateRecord` (`library.ts:135`; the test at `library.test.ts:112-115` shows an out-of-range value is dropped).
- **The two call sites.** Both panes compute `octaveShift` from `adapted.snapshot.range` internally (`InsightsPane.svelte:144`, `MarkupPane.svelte:563`); neither receives `doc`. The page passes props at `+page.svelte:4826-4842` (`InsightsPane`) and `:4854-4874` (`MarkupPane`), and the key choice reaches both as `{keyRuler}` (`:4842`, `:4873`), built once at `:1306-1312`.
- **The Insights sentence.** The phonation sentence is a string, `phonationHeadline`, handed to `singerBlocks` (`InsightsPane.svelte:384`; `singer-blocks.ts:101`) and pushed as a `prose` block (`singer-blocks.ts:360`). "Under the phonation section's sentence" means a new block after that push, or a second field. Row 48 changes the same sentence next; this row owns the block shape.
- **The Markup slot.** `NotesColumn` takes `octave: string | null` (`NotesColumn.svelte:28`) and draws it in `.octave-notice` (`:54`, `:93`). The quiet line is a glyph, a sentence, a middle dot, and a tap, so the prop becomes structured or a snippet.
- **A bass-clef song in the tree.** `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` has a voice part named Bass (`:16`) in F clef (`:45`). The tracked Tchaikovsky fixture is treble (`tchaikovsky-op38-3-voice.musicxml:8`).
- **A typed range without the Mac.** `docs/sessions/n174-c2/voiced.test.ts:13-21` seeds `shane.profiles.v2` in `localStorage` with `characteristics.rangeLow` and `rangeHigh` (`:19`) before load (`:51`).
- **Ceilings.** `MarkupPane.svelte` is 1,352 lines against a ceiling of 1358 (`scripts/ratchets.json:15`); `InsightsPane.svelte` is 752 against 1351; `+page.svelte` is at its ceiling (row 5 lowers it first).
- **DONE "on the alias".** Since row 98 (`10d6553`) Vercel builds only `Shane` and `main`; a cloud branch has no preview. DONE waits for Dann's merge.

## Amendments

### 1. Header: the lane

Replace "For Code on the Mac. QUEUE row 47. Runs after row 46." with:

> Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, after row 5 in the same session. Commit this row with its report; push only `cloud-lane-9`; never `Shane` or `main`; no pull request; never edit `docs/memory/`; do not commit this brief. Read `+page.svelte`, `InsightsPane.svelte`, and `MarkupPane.svelte` fresh after row 5's commits; the line numbers below are at `14e2ff8`.

### 2. Ruled item 1: the upward reading, in the resolver

Append to ruled item 1:

> Today `resolveVocalReadingOctave` returns 0 for every clef but G (`packages/score-parser/src/vocal-octave.ts:52`) and tests only −1 against 0 (`:89`). Build: for any clef (the `marked <= -1` block at `:54-72` kept first and unchanged), with a typed range and at least one pitched note, compute `inRangeFraction` for −1, 0, and +1; return the shift with the strictly greatest fraction, and 0 on any tie with as written (DESK DEFAULT: when −1 and +1 both beat 0 and tie each other, 0). Rewrite the module header (`:1-27`) and the function's doc (`:30-43`), which say "0 or negative" and "a bass clef yields 0", in the file's own voice, with the date and Dann's words of 2026-10-08 01:11 to 01:20; keep the 2026-09-23 measured notes inside the `marked` block as they are.

### 3. Ruled item 4: the per-song preference, by the N.94 pattern

Append to ruled item 4:

> Store the choice as N.94 stores the key: an optional field on `SongRecord` (`apps/web/src/lib/library/types.ts:127`, beside `transposition`), the `SongFields` counterpart with its default (`library.ts:60`, `:87`, `:100`), the document's `$state` with save and load (`document.svelte.ts:91`, `:258`, `:307`), and `validateRecord` dropping anything but the two allowed values (`library.ts:135`; precedent `library.test.ts:112-115`). DESK DEFAULT shape: absent or `null` means "for your range" (the default), the one stored value means "as written"; name it yourself. A record without the field reads as today.

### 4. Ruled item 3: one component, both tabs

Append to ruled item 3:

> Build the line once, as a small component under `apps/web/src/lib/score/` or `apps/web/src/lib/components/`, and use it in both tabs, so the two tabs cannot drift. Insights: `phonationHeadline` is a string handed to `singerBlocks` (`InsightsPane.svelte:384`; `singer-blocks.ts:101`) and pushed as a `prose` block (`singer-blocks.ts:360`); add what the block needs to carry the line directly after that sentence, and no more, because row 48 changes the same sentence next and will build on your shape. Markup: `NotesColumn`'s `octave: string | null` prop (`NotesColumn.svelte:28`, drawn at `:93` as `.octave-notice`) today carries `OCTAVE_NOTICE` (`MarkupPane.svelte:571`, passed at `:1032` and `:1034`); make that prop carry the line instead (a structured prop or a snippet), keeping its place in the column's order (`NotesColumn.svelte:5`, `:79`). The circled 8 is drawn as Transcribe's legend draws its circles (`apps/web/src/lib/components/Paper/LegendItems.svelte:42-51`, the `.legend-icon` circle).

### 5. Ruled item 4: how the choice reaches the panes

Append:

> Both panes compute `octaveShift` from the typed range themselves (`InsightsPane.svelte:144`, `MarkupPane.svelte:563`) and neither receives `doc`. Pass the choice and a flip callback from the page at the two call sites (`+page.svelte:4826-4842`, `:4854-4874`), as `{keyRuler}` is passed (`:4842`, `:4873`); when the choice is "as written", each pane's `octaveShift` is 0 and everything downstream (`printedReading`, `readingScore`, `keyRuler.draw`, `analysisScore`, `underlayResolvers`) follows with no second switch. Add nothing else to `+page.svelte`. Row 5 lowers its ceiling before you start; raise it by exactly the lines you add, in this commit, with the count in the commit message (`scripts/ratchets.json:2`).

### 6. Strings section: the Markup notice's retirement line

Replace "Leave `profile.octaveNotice` in `i18n.ts` with a comment that it is retired from Markup; do not delete it" with:

> Leave `profile.octaveNotice` at `i18n.ts:1321` with a comment that it is retired from Markup by row 47 (2026-10-08 ruling) and drawn by nothing; do not delete it. Remove `OCTAVE_NOTICE` and `showOctaveNotice` from `MarkupPane.svelte:569-571` with their comment, which names Dann's 2026-07-18 approval; carry that date into the new comment so the record is not lost.

### 7. Tests: the resolver cases, with the fixtures to use

Replace the first bullet of "Tests, checks, gates" with:

> Unit tests in `packages/score-parser/src/vocal-octave.test.ts` (it exists; add to it): a treble line high for a bass (−1, as now); a bass-clef line low for a mezzo (+1, new); a line that fits as written (0); a line that fits neither shift better (0); a tie between −1 and +1 (0); no range (0); the `marked <= -1` branch unchanged for MusicXML, denigma MNX, and plain MNX. Build the lines in the test, as the module's existing tests do; do not depend on a fixture's pitches.

### 8. Screenshots and the browser check, without the Mac

Replace the third bullet with:

> Browser checks in Playwright with `PW_CHROMIUM_PATH` set (`docs/memory/ENVIRONMENT.md:4395-4400`; desk viewport 1,440 wide or more, `:4399`). Upward case: `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` (voice part Bass, F clef, `:16`, `:45`) with a seeded mezzo range A3 to A5, seeded as `docs/sessions/n174-c2/voiced.test.ts:13-21` seeds `shane.profiles.v2` (`characteristics.rangeLow`, `rangeHigh`). Downward case: `tchaikovsky-op38-3-voice.musicxml` (treble, `:8`) with a seeded bass range E2 to E4. Check: the line appears in Insights and Markup only when a shift applies; a tap flips to "as written" and the readouts follow; the choice survives a reload (the library is IndexedDB; keep the same browser context). Screenshots, English and French, both tabs, both states, into `docs/sessions/octave-shots/`, committed with the row, each named for song, tab, language, and state. The reader is not involved; nothing here needs WebGPU.

### 9. Gates

Replace the fourth bullet with:

> All eight gates after the row: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512 plus this row's tests, score-parser 675 passed 5 skipped plus this row's, blurb 145, integration 55, ratchets OK (`docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`). Start from the numbers row 5 left; name every number that moves. The French gate (`apps/web/src/lib/i18n.test.ts:101-160`) reads every French value: the five ratified strings carry no colon and no guillemets, and « qu’écrite » takes the typographic apostrophe the table already shows.

### 10. Report

Replace the Report section's last two sentences with:

> NOT ESTABLISHED beats a complete invented answer. WRITTEN is not DONE: a cloud branch has no Vercel preview since row 98 (`10d6553`, builds only `Shane` and `main`), so DONE is Dann's look after his merge. No git writes beyond this lane's own commits and the push of `cloud-lane-9`.

### 11. The Markup ceiling

Append to Constraints (add the heading if the brief has none):

> `MarkupPane.svelte` is 1,352 lines against a ceiling of 1358 (`scripts/ratchets.json:15`). The notice's three lines leave (`:569-571`) and the component (amendment 4) keeps the line's markup out of the pane; if the pane still grows past 1358, raise the ceiling by the exact count in this commit and say why, rather than thinning the component.

### 12. Hand-off to row 48

Append to the Report section:

> One line for row 48, which follows: where the quiet line sits relative to the phonation sentence in `singerBlocks`, with the file and line, because row 48 rewrites that sentence and adds a link inside it.

## What the brief forbids or invites, checked

- `VocalLineEvent` is untouched; `shiftVocalOctave` returns a copy (`vocal-octave.ts:97-113`). `reconciliation/` is untouched.
- "Do not add a second silent save site while N.27 is open" (`CONTRACT.md:125`): the preference is saved through the document as `transposition` is (`document.svelte.ts:258`), no new site.
- The strings are the ratified five; amendment 6 adds a code comment, not a string.

## What I could not establish

- What `vocal-octave.test.ts` already covers (listed, not read); the five cases in amendment 7 may partly exist.
- Whether the tessitura heuristic re-picks treble for a bass line shifted up (`vocal-octave.ts:106` clears `clefs`); the Markup screenshot of the upward case shows it.
- The Playwright chromium count and the gate numbers after row 5.
- Whether `NotesColumn`'s measurement of `.octave-notice` (`NotesColumn.svelte:54`) for the page's share arithmetic tolerates a taller line with a button; the component's own test, if it has one, or the Markup screenshot shows it.
