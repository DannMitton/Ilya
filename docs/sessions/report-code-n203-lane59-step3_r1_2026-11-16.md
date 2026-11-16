# Report, Code, N.203 lane 59, Step 3 (the take line)

r1, 2026-11-16. Branch `cloud-lane-59`. Brief r3 Step 3 with amendments 12 to 15, and the desk's testing change of 02:4x (from here on, only the files a step touches; the eight gates and Playwright once at the end of Step 8).

## What changed

- `voice/count-in.ts` rewritten: Breathe 2 s, Sing 4 s, Shape 2 s, then the fry (`BREATHE_MS`, `SING_MS`, `SHAPE_MS`); steps `breathe`, `sing`, `tick` (at 2, 3, 4, 5 s), `shape`, `fry`. The spoken count and `PAUSE_MS` are gone (`PAUSE_MS` became `SHAPE_MS`).
- `voice/capture-ritual.svelte.ts` rewritten around the new parts. Phases: `idle, breathe, sing, shape, listening, sweep, landing`. New field `take: { part, within, holding } | null`. The line fills the first quarter of Fry over 1.0 s while the session waits for steady fry, then holds with `holding: true` and the cue stays; the sweep fills the other three quarters. One timer runs from the tap, at 50 ms, or 250 ms under reduced motion. `LANDING_MS` (900) became `DWELL_MS` (1,400) and now holds under reduced motion too; `GLIDE_MS` (800) added.
- **The component:** `voice/TakeLine.svelte`, with the arithmetic in `voice/take-line.ts`. Props: `parts` (`{ id, label, weight }[]`), `current` (a part id or null), `within` (0 to 1), `holding`, `label`, `reducedMotion`. It owns no clock and reads no session. One `role="progressbar"`; `aria-valuetext` is the current part's label. Lane 60 imports both and passes three parts (Quiet, Breathe, Fry). Each part is a grid column `minmax(min-content, Nfr)`, so no label is cut or overlaps (amendment 14); the proportions bend a little where a word is wider than its share (see the French picture). The hold pulses the fill, and under reduced motion takes a static striped fill (amendment 12). Label type is 12 px.
- `voice/VowelCapture.svelte`: the single bar is replaced by `TakeLine`. The view logic is one rule now: the chart aims at the zoom target of the focused vowel (the take's vowel while one runs) and glides to it in 800 ms on every change of focus or of the reading it holds; it jumps under reduced motion and in hidden mode. The idle and landing branches that used `model.full` are gone. This is Step 4's view rule; I made it here because the ritual's phases the old effects read (`pause`) no longer exist.
- `i18n.ts` (sheet lines 15 and 16, plus the supplement's item 8, character for character): new keys `capture.part.breathe`, `.sing`, `.shape`, `.fry` (Breathe, Sing, Shape, Fry / Respiration, Chant, Forme, Friture), `capture.cue.breathe` (Breathe. / Respirez.); changed `pacifier.singFirst`, `pacifier.pause`, `pacifier.nowSustain`. Header 1,278 keys, `capture.` 38. `calib.readiness.countTwo` and `countOne` stay: the readiness check (lane 60's) still uses them.

## Tests

`take-line.test.ts` (new: arithmetic, four parts in 2, 4, 2, 4, both languages whole, one progressbar, hold marking, three parts for the test fry); `capture-ritual.test.ts` (timings now 2, 4, 2, 3 s and 1.4 s; the line's parts and the held quarter; four ticks at 2, 3, 4, 5 s and none elsewhere; the dwell holds under reduced motion); `count-in.test.ts` rewritten; `chart/screen-logic.test.ts` and `chart/ratified-strings.test.ts` (new words pinned, pins 49 to 54). Those files, plus `VowelCapture.test.ts`, `visit.test.ts`, `i18n-index.test.ts`, `i18n.test.ts`: 129 passed. Before the desk's change reached me I also ran all eight gates on this step: gates 1, 2, 5, 6, 7 at baseline; gate 3 0 errors and 12 warnings; gate 4 6299 passed, 1 skipped (6300); gate 8 OK.

## Pictures (`docs/sessions/report-code-n203-lane59-pictures/`, `step3-<phone|desk>-<en|fr>-<state>.png`)

Phone 390 by 844 (English: rest, breathe, sing, shape, fry, sweep, dwell; French: rest, breathe, shape, sweep, dwell) and desk 1440 by 900 (English, the same seven). I opened all 22 and looked at each. What I saw: the line shows four named parts and the current one is bold; the cue is alone in its row; at the dwell the chart has already moved to hold the new dot (the dot sits left of the zone) and the main button still reads "[i] in progress". In French on a phone the labels are whole and nothing is cut, but « Respiration » widens its column and sits about 4 px from « Chant » (the grid gap), which is tight; I left it, and it is yours to judge. The desk pictures match the phone ones in order and content. In every picture the screen has scrolled, so the vowel's row is above the top of the view: that is Step 4's.

## Things that need Dann's eye or are not yet right

- Page is not what Step 4 asks: the chart still sits in the sticky stage above the buttons, and the page scrolls to the Start button when I click it (the pictures show the top of the screen cut off). Step 4 does both.
- The hint under the buttons still says "Stop, or a second tap on [i], ends this take", which is stale now (a tap no longer cancels). Its words are Step 7's.
- The main button stays disabled through the 1.4 s dwell. Taps on a vowel end the dwell; Start does not. DESK DEFAULT, easy to change.

## What I could not establish

- Whether the ticks sound the same on an iPhone once the microphone stays open (amendment 6): no device. Dann to listen on his walk.
- Whether the wait for fry's pulse reads as "listening" and not "frozen": I saw the hold state only as a still picture, not in motion.
