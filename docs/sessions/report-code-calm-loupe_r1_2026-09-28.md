# Report from Code: the calm loupe, r1

**2026-09-28.** Brief: `brief-code-calm-loupe_r1_2026-09-28.md`. Branch `Shane`, HEAD `9ebfdc0`, working tree dirty with slice 3 of the Correction Station (the cursor) plus the five slices below. Nothing committed; no git command that writes was run. Causes are cited at `9ebfdc0` unless a line says "now".

Measured on Dann's dev server (`localhost:5173`, already running; no second server was started) from the browser pane at a clean origin, `http://calm.localhost:5173`, with `Mussorgsky - Sunless 04 - Be bored.musx` loaded and a 1,630 x 950 viewport, the width Dann walked at. The tag's "m. 3" is the score's measure index 2 (ids `m2-…`).

**Status of the five slices: WRITTEN.** Not DONE: DONE is Dann's walk.

## Patches for the desk

In `apps/web/test-results/_desk-n174/`, git-ignored, each cumulative on `9ebfdc0` with slice 3 of the Correction Station included:

| file | carries |
|---|---|
| `calm-loupe-s1.patch` | slice 1 |
| `calm-loupe-s2.patch` | slices 1 and 2 |
| `calm-loupe-s3.patch` | slices 1 to 3 |
| `calm-loupe-s4.patch` | slices 1 to 4 |
| `calm-loupe-s5.patch` | slices 1 to 5. **Checked: `git apply --check` is clean on a `git archive 9ebfdc0` copy.** |

`s1` to `s4` also carry hunks of `docs/memory/STATE.md`, the desk's own overnight edits, picked up by accident. Apply them with `--exclude=docs/memory/STATE.md`. `s5` leaves that file out. `correction-cursor.patch` (slice 3 alone) is restored beside them. Copies of all six are in Code's scratchpad, since Playwright clears `test-results/`.

## 1. Causes, observation by observation

1. **The card jumps as the cursor moves inside one measure.** Three causes found in the tree. Dann's own 1,867 against 1,957 px **was NOT reproduced**: on m. 3 at 1,630 px the card measured 929.3 px on every note and gap in both modes, because it sat at its width cap.
   - (a) **The width depended on the mode.** The caret places were computed only with Corrections open (`Loupe.svelte:1527`), and the body's footprint widening reads them (`:1750-1757`). MEASURED uncapped, 2,600 px viewport: m. 3 was 1,320.4 px with the panel closed and 1,386.0 px in Corrections.
   - (b) **The width depended on the selection.** The widening and the barline nudges (`:1663-1672`) used the placement for the taken note's squircle only (`pageRing`, `:1364`). The code's own comment at `:1415-1420` recorded this as NOT ESTABLISHED past its fixture. It did not move on m. 3.
   - (c) **The head caret raises the previous measure.** A gap's held measure is its anchor's measure (`+page.svelte:1461`, `gapAnchor?.measureIndex`), and the head gap of measure k is the tail gap of k − 1. MEASURED: Left from m. 3's first entry onto its head caret re-raised m. 2, 1,386 px to 1,423 px at 2,600, with different music. **Not fixed; see §4, item 1.**
   - The width is recomputed on every redraw (`:2119-2121`), as the desk read.
2. **The tag block is one line or two.** `{#if noteLine}` (`Loupe.svelte:2437`), and in a gap `noteLine` is empty. MEASURED: `.loupe-top` 312 px on a note, 294 in a gap. The card's top moved 9 px each way, half the difference, because it hangs from `anchorTop = centreY - bareHeight / 2` (`:2390`).
3. **m. 3's right end: no closing barline, and a clipped note with «для».** **Clause 7 was met.** «для» is m. 3's own last note (`m2-7-8`, the seat log's "note 7 m2-7-8 «для»"), not the next measure's. The render is one measure (`renderLoupeMeasure`, `loupe-render.ts:85-95`), and a clause 7 probe of the body's clip found only m. 3's own five events. The cause is width:
   - The spacing search answered its own ceiling. One caret pair, the head caret against the caret after the opening rest, stands 18 to 34 px apart at every spacing, because the rest's lead-in does not read `minGap`. So the search could never meet 44 px, and it returned the ceiling for the whole measure (`loupe-render.ts:150`). MEASURED: m. 3 minGap 80.67 against the page's 14, strip 1,297.6 px in a 907 px window. The window scrolls sideways (`overflow-x: auto`, `Loupe.svelte:2828`), and nothing scrolled it, so the right 391 px, the closing barline among them, was out of view.
   - Four measures of this song did this: tag m. 3, 8, 26, and 27 (indices 2, 7, 25, 26).
4. **An accidental widens the card.** Read, not measured: a change to the drawing re-renders the measure and changes the spacing cache key (`Loupe.svelte:2213-2214`). The re-derived spacing sets a new width, and `:2121` applies it at once. On this song an added sharp did not widen m. 3 or m. 6, because the tap-floor spacing already had room for it. An entered note is the positive control used below.
5. **A far pitch makes the card taller and moves the buttons.** The window's height is the page's ink band (`windowHeight`, `Loupe.svelte:1886`, from `pageMetrics` at `:1243`), so a ledger note anywhere grows it. `bareHeight` (`:2384`) grows with it, and the card re-centres half up and half down (`:2390`), as the memo read. MEASURED, m. 3, F♯4 down three octaves: window 225 to 328 px, card top 368 to 317, first correction button 729.2 to 780.8. The pitch functions are unbounded (`correction.ts:164-194`).
6. **Panel closed, the arrows stop in the gaps.** `move` walks `stepCursor` whatever the mode (slice 3's `correction-cursor.svelte.ts`, from `+page.svelte:1052`). MEASURED: the note line read F♯4, gap, F♯4, gap with no carets drawn.
7. **The filled pill does not close the panel.** `handleLoupeMode` always sets the panel open (`+page.svelte:1429-1432`).
8. **The notation is larger than it needs to be.** The main cause is item 3's ceiling, not the point size. The point size is already one number per page: the desk's magnification, 12 px stave space over the page's own (`Loupe.svelte:1064-1069`). After slice 4, at 1,630 px, three of this song's 27 measures still scroll: tag m. 2, 11, and 20. They converge honestly at minGap 74.68 to 76.24, because the 44 px tap floor needs that much.

## 2. The rulings, before and after

| ruling | at `9ebfdc0` | now |
|---|---|---|
| Clause 12, size keyed to the held measure | not met (causes 1a, 1b, 1c) | met for mode and selection; **1c open** |
| Clause 7, nothing from adjacent measures | met | met, re-probed |
| Clause 11, the closing barline stays | drawn, but out of view on m. 3 | in view on m. 3; on the three wide measures, when the taken entry nears it |
| Clause 8 as amended, size once per song | point size already per page; not fitted to the room | not built (§4, item 2) |
| Zoom courtesy | absent | not built (§4, item 2) |
| Ruling 6, the music at one vertical | not met (cause 5) | met |
| Top segment is the anchor, two lines reserved | not met (cause 2) | met |
| Width on one measure grows, never shrinks, eased | not met | met; the magnification half is not built |
| Height on one measure held, scrolls inside | not met | met |
| Pitch limits C1 and C7 | not met | met |
| The cursor stops only where a stop is drawn | not met | met |
| A second click on the filled pill closes | not met | met |
| Music keys do nothing in Syllables mode | not met | met |

## 3. The slices

Gates on every slice, run on the Mac: `pnpm test` all green (web suite 1,586 at slice 1, rising to 1,608 at slice 5), `pnpm ratchets` OK with only lowered ceilings, `pnpm check` 0 errors (12 warnings, none in these files), Playwright chromium **28 of 28**. From slice 3 on, the phone loupe scan (`--project=phone`) also ran: 2 passed, and 1 skipped by its own guard, which needs an unconverged measure at 390 px. **The screenshot compare was not run**: it lives in the desk's cloud clone.

### Slice 1: the pill closes, the cursor stops only at visible stops, music keys stand down (observations 7 and 6)

- **New `lib/score/loupe-panel.svelte.ts`** (82 lines), class `LoupePanel`: `mode` and `open`, moved from `+page.svelte:1356-1387` with their rulings. `choose(m)` closes the panel on a second press of the filled pill and keeps the mode. `caretsShown` is the one N.149 condition, `mode === 'corrections' && open`. `musicKeys` follows it.
- `CorrectionCursor` takes a second argument, `gapsAreStops`. With no carets drawn, `move` walks past gaps. From a gap it lands on the next entry. At either end the bar stays on the last entry rather than landing in an unseen gap.
- `handleCorrectionKey`: with the music keys off, only ArrowLeft, ArrowRight, and Escape act. Undo and Redo sit above that line and work in both modes.
- **CODE DEFAULT, for the desk:** a shut panel counts as Syllables for the music keys, as it does for the carets. The cells are not on screen, so a key would change the music out of sight. Consequence: right after a raise, Up does nothing until Corrections is chosen.
- MEASURED: the arrows went F♯4, F♯4, F♯4 note to note with the panel closed; Down did nothing in Syllables; a second press on the filled pill closed the panel and removed the carets; the chevron reopened Corrections.
- Tests: 8 in `loupe-panel.test.ts`, 4 new in `correction-cursor.test.ts`.

### Slice 2: the tag block always holds two lines (observation 2)

- `Loupe.svelte`: the second line is always drawn, a no-break space in a gap. `.loupe-tag.paired` is folded into `.loupe-tag`.
- MEASURED on m. 3, note, gap, note, gap: card top 368.0, window top 419.0, panel top 696.8, `.loupe-top` 312 px every time.
- Trap met: the Edit tool wrote a raw U+00A0 for `' '`. Replaced with the escape before staging. Playwright ran on the raw character, which is the same string at run time.

### Slice 3: one width per measure (observations 1 and 4, clause 12, the ratified grow-only rule)

- The caret places are worked out in both modes and drawn only in Corrections. They are placed for every selection and for none (the loop that derivation already ran), so the barline nudges and the footprint widening belong to the measure.
- **New `lib/score/loupe-hold.ts`**, class `GrowOnlyWidth`. On one measure the card grows and never shrinks, and a growth eases over 150 ms, none under reduced motion. The key is measure, room, and whether the notation face has arrived. MEASURED: the first frame of every raise is drawn before the face resolves, with no meter panel, and the face lands 2 ms later (586.8 then 624.4 px on m. 6). Without the face in the key, every raise would animate a growth.
- MEASURED at 2,600: m. 3 at 1,386.0 px in both modes and on every stop (it was 1,320.4 closed). Positive control, m. 6: entering a note grew the card 624.4 to 761.8 px with the transition live (`width, left`, 0.15 s); Undo held it at 761.8 while the strip returned to 601.6.

### Slice 4: the window shows the whole measure where it can, and follows the taken entry (observations 3 and 8)

- `deriveMinGap` (`loupe-render.ts`) sets aside a pair the ceiling cannot clear, reports it in `stuck`, and clears every other pair at the smallest spacing that does. The answer stays unconverged, so the console warning still names the stuck pair. New `pairSeparations` keys each adjacent caret pair; it replaces `worstSeparation` in `Loupe.svelte`, with the same worst value.
- `followEntry` in `loupe-hold.ts` scrolls the window just far enough to show the taken entry: its ring, or its hit rectangle for a rest, which has no ring. It runs after `tick()`. MEASURED: before that, stepping Left into m. 2 landed on its closing rest at scroll 0, the rest 1,101 px into a 907 px window.
- MEASURED at 1,630: m. 3 minGap 31.19 (was 80.67), strip 683.5 px (was 1,297.6), card 706.3 px, closing barline and tail in view on every note. Measures 8, 26, 27, and 28 (by the tag) now fit. On m. 2 the scroll follows each note; its closing rest brings the scroll to 343, and stepping back to its opening rest returns it to 300.
- Tests: 4 for the stuck-pair search, 2 for `pairSeparations`, and 4 for `followScroll`.

### Slice 5: the window holds its height, and pitch stops at C1 and C7 (observation 5)

- `HeldHeight` in `loupe-hold.ts` holds the first window height drawn on a measure. `.loupe-window` is `align-items: safe center`, so a taller drawing starts at its top. `overflow-y` stays `hidden`: no finger drag scrolls it, and the vertical swipe still dismisses.
- `followEntry` also scrolls vertically, by the note's own ink and never the ring. The ring runs from above the stave to the IPA row, and at a far note it is taller than the window (232 px against 225 at F♯1). A notehead is a `<text>`, whose client rect is its font's layout box (F♯6's read 350 to 543 px), so a glyph is read at its own `y`, half a stave space either side.
- `stepAllowed` in `correction.ts`: bounds are MIDI 24 and 96 on the sounding pitch. A note read outside the range may step back toward it. `handleStep`, `handleOctave`, and `handleSemitone` return before Undo at a bound, and the hold repeats `handleStep`, so it stops too.
- MEASURED, m. 3, F♯4 to F♯1 and up to F♯6: card top 368.0 and first button 729.2 throughout (the button moved to 780.8 before); window 225 px; notehead in view at every octave (630 px at F♯1, 447 at F♯6, window 419 to 644).
- Limits: diatonic steps from F♯1 went E♯1, D♯1, C♯1, B♯0, then stopped. B♯0 is C1's sounding pitch, reached because a step keeps its sharp. Octave and semitone did nothing there. Undo held exactly 7 entries. The top stops at B♯6, C7's sounding pitch.
- Tests: 4 for the limits, 2 for `HeldHeight`.

### Line counts

| file | `9ebfdc0` | now |
|---|---|---|
| `routes/+page.svelte` | 6,097 | 6,029 (slice 3 of the Correction Station took 45; ceiling lowered 6,052 to 6,029) |
| `lib/score/Loupe.svelte` | 3,054 | 3,044 (ceiling lowered to 3,044) |
| `lib/score/loupe-render.ts` | 203 | 259 |
| `lib/score/correction.ts` | 670 | 692 |
| `lib/score/correction-cursor.svelte.ts` | new in slice 3 | 113 |
| `lib/score/loupe-panel.svelte.ts` | none | 82 |
| `lib/score/loupe-hold.ts` | none | 147 |

`ARCHITECTURE.md` names the two new modules. The `9ebfdc0` figures are read with `git show`.

## 4. Open, for the desk

1. **Cause 1c, the head caret, is not fixed, and the fix reaches past this brief.** Holding the loupe on measure k while its head caret is taken is the obvious change. It would strand an entry: a note entered in a gap takes its anchor's measure (`correction.ts:513` at `9ebfdc0`, `measureIndex = anchor ? anchor.measureIndex : 0`), which is k − 1. So a digit typed at m. 3's head caret would put a note at the end of m. 2 while the loupe shows m. 3, and the loupe would then jump to m. 2. Today the loupe flips to m. 2 first, so the singer at least sees where the note will land. The clean fix is an entered note that knows its measure. That changes the stored correction record, which is Correction Station territory (slices 4 to 6). **CODE DEFAULT: left as it is.** The desk's call.
2. **Clause 8 as amended, and the zoom, are not built.** Slice 4 removed most of observation 8's cause. What remains is three honest wide measures at 1,630 px. Fitting one size per song means deriving every measure's spacing up front, about 30 ms each, near a second for this song, on the first raise or in idle time, then lowering the magnification until the ordinary measures fit. Recommendation: let Dann walk slices 1 to 5 first, since the brief's picture of observation 8 predates the ceiling fix. The zoom's French `aria-label`s are drafted for his ruling whenever it is built: « Réduire le zoom » and « Agrandir le zoom » (English "Zoom out" and "Zoom in").
3. **A gap left unseen.** Close the panel while the bar stands in a gap, and the bar stays in a gap with no caret drawn until the next arrow. The next arrow leaves it for an entry. Moving it to the gap's anchor on close is small; not done without the desk's word.
4. **The brief's cite `Loupe.svelte:682-687` for clause 8's comment is `hitsFor` at `9ebfdc0`.** Clause 8's words are at `:821-826` and `:1217-1221`. Neither was touched, since the magnification did not change, so the retraction and amendment record waits for the slice that changes it.
5. **The screenshot compare is expected to change** from slice 2 on (the reserved line) and slice 4 (narrower strips on four measures).

## 5. NOT ESTABLISHED

- Why Dann's card measured 1,867 against 1,957 px within m. 3. Three candidate causes are fixed above; none reproduced his numbers at 1,630 px in the pane.
- Whether the 150 ms growth reads well on a real display. A hidden pane freezes CSS transitions, so the ease was confirmed by computed style only.
- How the height hold behaves on a phone. Only the desk width was walked; the phone loupe scan passed.

## The walk, when the desk sends Dann

```
http://localhost:5173
```

Uncommitted work is on the local dev server only. Vercel will not show it until it is committed and pushed.
