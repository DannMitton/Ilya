# Report, Code, N.203 lane 59, Step 5 (a tap on the chart focuses a vowel)

r1, 2026-11-16. Branch `cloud-lane-59`. Brief r3 Step 5 with amendment 18. Tests run: only the files this step touches and what imports them (the desk's change of 02:4x).

## What changed

- `voice/chart/tap.ts` (new, pure): `zoneEllipse` (the same ellipse `ChartLayers.svelte` draws), `vowelForTap` (a tap inside one or more zones focuses the vowel whose dot, sung else placeholder, is nearest the tap in chart units; outside every zone, null), `chartPoint` (a client point to chart units through the `xMidYMid meet` letterbox; a point in the letterbox is null).
- `voice/chart/VowelChart.svelte`: a transparent `<rect class="tap-layer" aria-hidden="true">` over the frame with an `onclick` (a `click`, never `pointerdown` or `touchstart`, so a scroll that starts on the chart changes nothing). It reads the tap against the `view` prop as it stands at that instant, so a tap mid-glide hits what is drawn. New optional prop `onFocus`; the old comment saying a tap does nothing is rewritten. The layer takes no focus and is hidden from assistive technology; the ten buttons stay the keyboard path.
- `voice/chart/screen-logic.ts`: `tapEffect(phase)`: `focus` at rest, `endDwellAndFocus` in the dwell, `ignore` during a take. `VowelCapture.svelte` uses it for the buttons and passes `tapVowel` to the chart as `onFocus`, so the button and the chart do one thing.
- `e2e/calibrate-new.test.ts`: two new tests (a tap on a zone focuses and records nothing; a tap during a take changes nothing, and a vertical drag that starts on the chart leaves the focus alone). Not run until the end of Step 8.
- No change to `ChartLayers.svelte` (the sheet draws with it and takes no taps).

## Tests

`chart/tap.test.ts` (new, 14): placeholders hit their own vowel; a grid scan finds more than 20 points inside two or more zones and each resolves to the nearer dot; outside every zone is null; a sung dot is used where there is one; a zoomed view is hit as drawn; the letterbox maps; and `tapEffect` for every phase. With the rest of `voice/chart`, `VowelCapture.test.ts`, `capture-ritual.test.ts`, `take-line.test.ts`, `count-in.test.ts`, `visit.test.ts`: 22 files, 312 passed. A `click` on the real chart, and the drag, are covered only by the two new browser tests, which have not run yet.

## Pictures (`step5-<phone|desk>-<en|fr>-tap-before|tap-mid-glide|tap-after.png`)

Phone English and French, desk English: before the tap (ɨ in focus, seven recorded), 300 ms after a tap on [o]'s zone, and 1.2 s after. All nine opened and looked at. The tap moves the focus to [o] (the symbol, name, readout, side view, Re-take [o], the cue "[o] is captured." all follow) and the chart glides to it; nothing is recorded (the count stays 7 of 10). In the "before" pictures the chart is shown because the script scrolled it into view on the phone English picture; the French phone picture is unscrolled and shows the chart whole at the bottom.

## Things for Dann's eye

- At rest the chart is moved in on the focused vowel (Dann 2026-11-15 19:16), so a tap on it reaches the neighbouring zones only (Fable's review, question 2). Built as ruled. The pictures show it: from ɨ in focus the visible zones are ɨ's neighbours.
- `tapEffect` and the chart's tap layer: the layer shows a pointer cursor over the whole frame, including where no zone lies. Easy to restrict.

## What I could not establish

- A real finger on a real phone: not available here.
- Whether the tap's `click` is reliable on iOS Safari for an SVG `rect` with a transparent fill: NOT ESTABLISHED: I have not run WebKit, and I did not check how Safari treats a `fill: transparent` rect.
