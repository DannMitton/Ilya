# Report from Code: the calm loupe, slice 7. One squircle for every stop

**2026-09-28.** Brief: `brief-code-calm-loupe-s7_r1_2026-09-28.md`. Branch `Shane`, HEAD `7d2fcd6`. At the start the tree was dirty only with the desk's `docs/memory/STATE.md` and this brief. Nothing committed; no git command that writes was run. Causes are cited at `7d2fcd6`.

Measured on Dann's dev server (`localhost:5173`; no second server was started) from the browser pane at a clean origin, `http://calm7.localhost:5173`, with `Mussorgsky - Sunless 04 - Be bored.musx` loaded at 1,630 × 950. The raw file loads in treble clef, as the desk found; Dann's library copy is in bass. The tag's "m. 25" is the score's index 24 (ids `m24-…`).

**Status: WRITTEN.** Not DONE: DONE is Dann's walk.

**Other writers were active in this tree during the session.** `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `docs/sessions/n154-strings-draft_r1_2026-09-28.md`, `n82-watch-band-draft_r1_2026-09-28.md`, `n86-dead-code_r1_2026-09-28.md`, and two new briefs changed while this work ran. None of them is mine, and the patch leaves them out.

## 1. Causes, measured before anything changed (brief §3)

1. **The grey band on a taken rest is not Ilya's.** Nothing in Ilya draws it. It is the browser's own text selection. A notation glyph is an SVG `<text>`, and a selection paints its FONT box, not its ink. MEASURED: a double-click in the loupe left a selection range of 15 × 193 px over a Finale Maestro glyph, and the rest's own glyph box is 13 × 193 px, a band the full height of the window. The loupe strip set no `user-select` (`Loupe.svelte:2439`). A probe of every painted element over the rest's column found only the rest's glyph and no band.
   - Nothing reads a selection in the loupe (`getSelection` appears nowhere in `apps/web/src`), so the band serves nothing.
   - The last link, that this selection is exactly what Dann photographed, is **INFERENCE**: the geometry and colour match, and no other painter exists. The pane is hidden, so no screenshot of it was taken.
   - Seen in passing: `.loupe :global([data-loupe-selected])` (`Loupe.svelte:3033`) styles an attribute that nothing sets. It is dead and was left alone.
2. **A rest had no ring because the renderer gives it no `data-event-id` group.** `staff-renderer.ts:2708` wraps a rest's hit rectangle and glyph in an anonymous `<g>`, on purpose (N.92 clause 5). Every ring site looked the group up with `closest('[data-event-id]')`, found nothing, and drew nothing:
   - the loupe's ring, `Loupe.svelte:1364-1365`;
   - the loupe's spacing derivation, `Loupe.svelte:1690-1691`;
   - the page's ring, `MarkupPane.svelte:327-328`.
3. **A gap had no ring because the loupe was never told a gap is taken.** `+page.svelte:5010` passed only `selectedEventId`, which `CorrectionCursor.set` sets to null in a gap (`correction-cursor.svelte.ts`). So `pageRing` was null (`Loupe.svelte:1362`).
4. **Observation 3, the rows cut at the window's edge.** `followEntry` (`loupe-hold.ts`) scrolls the least it can to keep the note in view, and it knew nothing of the underlay. MEASURED, m. 25, window 225 px, stepping up from E1 by step: the IPA row straddled the bottom edge from G1 to D2. At A1 its ink ran 216 to 242 px.

## 2. What was built

### The rest's ring

- **New `entryGroup(hit)`** in `selection-ring.ts`: a note's `[data-event-id]` group, or the rest's anonymous group, which is the hit rectangle's parent. `ringBox` reads the rest's glyph from there as it reads a notehead. All three sites use it.
- **The page draws the rest's ring too.** DESK DEFAULT reading of "one mark for every stop", since the page and the loupe share one ring by the ruling of 2026-09-14. MEASURED: the page ring on `m24-7-8` is 15 × 84.5 units.
- **A ring the carried band holds is not a caret boundary** (`ringBoundary`, `stop-ring.ts`). The first build found a new defect: taking m. 2's opening rest put the head caret and the caret after the rest on one x, 1,052 px, two carets with no glyph between them (THE CARET, clause 5). That rest is drawn in the carried band, left of the body. Its ring now leaves the carets where the rest's ink puts them.

### The caret's ring

- **New prop `gapAfter` on `<Loupe>`**, passed from `+page.svelte`.
- **New `caretRingBox`** in `selection-ring.ts`. It shares the note ring's top and bottom rule, now factored out as `ringSpan`: one stave space above the stave, and the IPA face's descent below the IPA baseline. So every ring on a system shares its bottom edge. MEASURED on m. 25: the rest, a gap, and G2 all end at 313.3 px.
- **New module `lib/score/stop-ring.ts`** sizes the caret's ring (`inkRoom`, `caretRingHalf`, `caretRingFloor`).
  - **CODE DEFAULT, the width:** the arrowhead's base plus `RING_PAD_X` (4 units) each side, the padding a notehead gets. `RING_MIN_W` is not applied, since it exists so a notehead is not shrink-wrapped. Drawn at 25.6 px where there is room.
  - **CODE DEFAULT, the top:** the note ring's floor, one space above the stave. The arrowheads end 0.6 of a space above the stave, so the ring clears them by 0.4 of a space. The literal grammar ("one space above the mark's own ink") would lift the caret's ring 0.6 of a space higher than its siblings, so it was not used. The desk's call if that reads tight.
  - **It never touches ink.** Where the padded ring would reach a neighbour, it narrows to leave air. Each caret's room also joins the loupe's spacing search as a pair of its own, against the same floor as the tap pairs, so the search widens a measure until every caret ring fits. MEASURED: tag m. 26 collided in the first build, a gap only 3.30 units wide. Its minGap rose from 30.41 to 33.79, and the ring now clears.
- **The window follows a taken caret** across by its ring and down to the stave (`followEntry` with a null id).

### The grey band

- `.loupe-strip` takes `user-select: none`. MEASURED after: the computed `user-select` is `none`.

### Observation 3: no lyric row is cut at the window's edge

- **New `cleanEdges`** in `loupe-hold.ts`, called after the follow. **CODE DEFAULT:** a row cut by either edge leaves the window whole, moving away from the note, so as much stave as possible stays in view. Where the note stands too near the row for that, the window takes the row in whole. The rows are the IPA and Cyrillic ink, read from the face's glyph metrics, never a `<text>` client rect.
- **The note's 8 px of air gives way before a glyph is cut.** MEASURED at A6: the Cyrillic overhung the bottom edge by 1.6 px, and taking it in left the note 6.2 px from the top edge.
- **An overhang under 1 px is not a cut.** Chrome rounds the face's metrics to whole pixels, and F2 to C2 read 0.2 to 0.3 px overhangs as noise.
- **The rule, in the brief's words:** keep the note in view; when the note and the rows cannot both fit, show the note and leave the rows cleanly out.

**The two measurements the brief asks for**, window 225.3 px (raised at E4, then walked, as Dann did):

| pitch | scroll | notehead ink | IPA row | Cyrillic row |
|---|---|---|---|---|
| E1 | 23 | 204.9 to 217.3 px, in view | out, cleanly (ink from 233.3) | out, cleanly (from 284.9) |
| C7 | 0.5 | 33.6 to 45.9 px, in view | in view whole (192.9 to 219.4) | out, cleanly (from 244.5) |

The full walk, E4 down to C1 and back up to C7, is 66 stops, with the note in view and no row cut at any of them. Before this slice, G1 to D2 cut the IPA row.

**What still stands at the edge:** the ring itself. At a far note the ring (stave to IPA row) is taller than the window, as slice 5 recorded, so its far end runs past the edge. It is a mark, not a glyph, and the brief's rule names glyphs. The desk's call if it wants the ring clipped differently.

## 3. The whole-song sweep, after the last change

Every stop of «Скучай», head gap of m. 2 to the last gap of m. 29, stepped with the panel in Corrections. The first full sweep counted 292 stops: 147 gaps, 116 notes, and 29 rests. The sweep after the last change walked the same stops in two passes (286, then the last five).

- **Every stop carries a ring.**
- **No ring holds a neighbour's ink.** The check covers noteheads, rests, accidentals, flags, stems, and ledger lines, measured by glyph ink.
- **No two carets coincide.** The nearest pair stands 13.4 px apart.
- **A rest's carets clear its ring as a note's do.** The same fallback applies: 8 px beside the rest on m. 25, 8.7 px beside G2.

**Residue, for the desk.** The console names eight rings the spacing search set aside:

- **Four are drawn:** the gap after the carried opening rest on tags m. 2, 11, 20, and 28. Each is bounded by the body panel's own left edge, 2.69 units, not by ink. MEASURED on m. 2: the nearest ink, the rest in the carried band, stands 166 px away. The console line says "short of its room, to ink or the body's edge".
- **Four are never drawn:** head gaps whose loupe flips to the previous measure (cause 1c of the r1 report, still open).
- **Pre-existing, unchanged:** on the carried-rest measures the head caret stands right of the caret after the rest. The r1 report recorded this. The proper fix draws that head caret in the carried band, which is past this brief.

## 4. Gates

Run on the Mac, in order:

1. `pnpm test` (root): all packages green. Web: 89 files, 1,634 tests (1,608 at slice 5). New tests: `stop-ring.test.ts` (10), `selection-ring.test.ts` (3, `entryGroup`), and 8 for `cleanEdges` in `loupe-hold.test.ts`.
2. `pnpm check`: 0 errors, 12 warnings, as before.
3. `pnpm ratchets`: OK. **`Loupe.svelte`'s ceiling fell 3,044 to 3,041.** Nothing was raised. To fit, `hitsFor` moved to `loupe.ts`, and `fingerprint` and `offendingPairs` moved to `loupe-render.ts`, unchanged. `+page.svelte` and `MarkupPane.svelte` hold their ceilings exactly.
4. Playwright chromium: **28 of 28**, run once, before the patch was staged.
5. Playwright phone: **2 passed, 1 skipped by its own guard**, as at slice 5, after the patch was staged. All five rules report 0 violations. Two earlier runs failed, and both failures came from the scan, not the app:
   - `kindOf` (`loupe-scan.test.ts:117`) classified any stop with a ring as a note, so every gap fell under rule 2 once gaps had rings. It now classifies by what is taken: the readout. Rule 2 now also covers a rest's ring, as the brief asks, and exempts only the taken caret, which its own ring surrounds by design (`entryRingTaken`, `loupe-rules.ts`).
   - `paintsAt` (`loupe-probe.ts:365`) read a ring's fill from its attribute. The loupe's ring takes `fill: none` from the stylesheet, so the probe counted the ring's interior as painted. It now reads the computed fill. This never mattered while no caret could stand inside a squircle.

**The screenshot compare was not run:** it lives in the desk's cloud clone. The page capture can change on any song where a rest is taken, since the page now rings a rest.

## 5. The patch

`apps/web/test-results/_desk-n174/calm-loupe-s7.patch`, 16 files, cumulative on `7d2fcd6`, `docs/memory/STATE.md` excluded. It includes `ARCHITECTURE.md`, which names `stop-ring.ts` and the ring's owners. The three new files were added with `diff --no-index`. **Checked: `git apply --check` is clean on a `git archive 7d2fcd6` copy, and the applied copy md5-matches this tree** (`Loupe.svelte` `563e4028…`, `stop-ring.ts` `08d92959…`). A copy is in Code's scratchpad.

The r1 patches `calm-loupe-s1` to `s5` are gone from `test-results/`: Playwright clears that folder. They shipped in `7d2fcd6`.

## 6. Process note

A one-off `npx prettier --write` fetched Prettier from the network and rewrote `loupe-hold.ts` and `selection-ring.ts` in its default style, because this repository has no Prettier configuration. Both files were rebuilt from `git show HEAD:` (a read) and the edits reapplied. The final diff carries no formatting churn.

## 7. NOT ESTABLISHED

- That the grey band Dann photographed was a text selection. The mechanism is measured; the match to his screenshot is inferred.
- How the caret's ring reads at phone width by eye. The phone scan passed; nobody has looked at it.
- The bass-clef copy. Dann's library song is in bass clef and this walk was on the treble copy, so his E1 is a different drawing. The rule is the same, and the 66-stop walk found no cut in the treble copy.
- **Seen, not investigated:** at the end of the song the dock's readout names the gap after the last rest "before the first entry · the next duration enters here".

## The walk, when the desk sends Dann

```
http://localhost:5173
```

Take a note, a rest, and a gap in turn, in Corrections, and see the same squircle on each. Arrival: the rest's squircle surrounds the rest glyph, and a gap's is a narrow squircle around its caret, with the same lavender stroke and the same bottom edge as the note's. Uncommitted work is on the local dev server only; Vercel will not show it until it is committed and pushed.
