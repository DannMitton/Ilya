# Brief to Code: N.199, Steps 6a, 7, and 6b: three fixes, the ratified words, the finished drawings

r2, 2026-11-13, from the desk (Opus). r2 applies the Fable review of r1 and of the lane as built (`docs/sessions/review-fable-lane51-and-brief-6b-7_r1_2026-11-13.md`: lane MERGE WITH AMENDMENTS, five; brief SEND WITH AMENDMENTS, eleven; all applied, section "Where each amendment went" says where). For lane 51 (`cloud-lane-51`), after its Step 6 at `9c1c0698`. Continues brief r5 (`docs/sessions/brief-code-n199-calibrate-single-vowel_r5_2026-11-13.md`); everything there still binds unless this brief changes it.

No git writes outside your lane. Gates before and after every step. Canadian spelling, the Oxford comma, no em dashes. One commit and one report per step, `docs/sessions/report-code-n199-step<n>_r1_2026-11-13.md`.

**NOT ESTABLISHED beats a complete invented answer.**

First, merge `origin/Shane` into the lane. It carries this brief, the review, the finished drawings (`docs/sessions/n199-calibrate/drawings-r4/`), and `docs/memory/OPEN.md` with every string Dann ratified today. Report any conflict.

**Order: 6a, then 7, then 6b.** Dann has ratified every string in r5 section 7 in English and French (2026-11-13 10:30 to 11:35, `OPEN.md` section N.199, entries dated 2026-11-13), and the drawings are finished, so he walks the real screen in both languages.

**The e2e file.** `apps/web/e2e/calibrate-new.test.ts` is outside the eight gates and inside CI (`playwright.config` `testDir` is `./e2e`; `.github/workflows/ci.yml:134` runs the whole chromium project). After each step below, run it; after Step 6b, run the whole chromium project once and report its duration.

## Step 6a. Three fixes to what is built

1. **Zones stay** (ruling 5). `voice/chart/zones.ts:105`: a personal vowel's zone takes `now.fR2[vowel]` as its fR2 centre, so once that vowel is sung the zone centres on the singer's own reading and moves on every re-take. Use `ground.fR2[vowel]` for all ten. Test: a personal zone's fR2 centre is the same before and after its own vowel is sung 4 semitones off.
2. **The quick move out after a cancel or an error.** `VowelCapture.svelte:158-161`: the "at rest" effect runs in the same flush and `motion.set` (`view-motion.ts:42-46`) ends the 400 ms move, so the chart snaps. Let the rest effect act only when `model.full` changes, or skip while the motion runs. Test it if the effect can be tested; otherwise observe it in a browser and say so.
3. **The hide toggle during a take.** `VowelCapture.svelte:345` with `:207-210`: the record's visibility is fixed at the tap, but the checkbox stays live. Disable it while a take runs.

## Step 7. The ratified words into `i18n.ts`, English and French

1. **The helper.** `t(key, lang)` takes no variables (`i18n.ts:2539-2543`) and `ds(key, vars)` takes no language (`draft-strings.ts:70`). Add one small helper that fills `{v}`, `{n}`, `{count}`, `{name}` over `t()`, and thread the language to the callers that lack it: `hintText` (`screen-logic.ts:74`), `mainButton` (`:79`), `countWord` (`:32`), and `VowelChart.svelte`.
2. **Move every key** in `voice/chart/draft-strings.ts` into `i18n.ts` with its English and French from `OPEN.md` (section N.199, the entries dated 2026-11-13). Copy the French exactly, including U+00A0 before « : » and U+2019 apostrophes. Then delete `draft-strings.ts`.
3. **English changed after r5, in `OPEN.md` only**, so take it from there, not from `draft-strings.ts`: `capture.hide` and `capture.hidden` say "the readout"; `sheet.legend.hull` says "surrounds"; `sheet.legend.zones` ends "Where they cross, the colours blend."; `sheet.provenance` is corrected. Diff `draft-strings.ts` against `OPEN.md` key by key and list every difference you applied.
4. **No French that Dann has not ratified.** A key or word with no ratified French in `OPEN.md` is listed in your report and left in English behind the switch. You never draft French. This covers the count words in `screen-logic.ts:30` ("None" to "Ten"), which feed `capture.hint.toGo`: until Dann rules on them, the French shows the digit.
5. **The pause line** (`pacifier.pause`, ratified EN 01:05, FR 10:30): "Stop singing, but maintain the shape of your vocal tract for that vowel." / « Arrêtez de chanter, mais gardez la forme de votre conduit vocal pour cette voyelle. » And `PAUSE_MS` (`voice/count-in.ts:18`) from 2000 to 3000 (DESK DEFAULT). Both reach the wheel through `pacifier/count-in.ts`, so every singer's count-in becomes six seconds at the ship; say so in the report. Move with it: `count-in.test.ts:10`; `capture-ritual.test.ts:12-13`; the comments at `capture-ritual.svelte.ts:12` and `count-in.ts:17`; `screen-logic.test.ts:87`; `e2e/calibrate-new.test.ts:4`, `:92` (the 5150 ms cancel now lands in the pause, so move it into the wait for stable fry to keep every phase covered), and `:170` ("numbers are hidden").
6. **The pause line on a phone.** The cue row is two lines (`VowelCapture.svelte:507-519`) beside a readout column that keeps 8 rem when empty (`:520-523`); at 358 px the new line wraps to three lines in English and about four in French, and the row grows and shrinks under the singer's thumb. During a take the readout is empty: let the cue take the full width then, and hold the row at one height that fits the longest cue in both languages. Picture: phone, in the pause, English and French.
7. **Pins.** Pin the new strings in a test as `ratified-lines.test.ts` pins the Guide's, and carry `draft-strings.test.ts`'s copy rules (no "goal", "target", "held", em dash) over the new keys. `VowelCapture.test.ts:116` asserts draft English in French; change it.
8. **`FrSym` takes small capitals** (r5 ruling 14) in its own commit, with a picture of the roster before and after. `FrSym` is on the live roster, so this reaches every singer at the ship. Say whether the face has true small capitals or the browser synthesizes them.

## Step 6b. The finished drawings, the credit, the axis words, the labels

1. **The drawings, one path.** The ten SVGs in `docs/sessions/n199-calibrate/drawings-r4/` move into `apps/web/src/lib/voice/chart/sagittal/`, read with `import.meta.glob` and `?raw` as `apps/web/src/lib/components/Reading/CursiveGlyph.svelte:14` does. One `<svg>` in the squircle: the fixed group drawn once, the ten moving groups stacked and cross-faded, ids stripped or made unique, `stroke="currentColor"` with the Voice lavender family's ink (name the token). `apps/web/static/sagittal/` is deleted whole. The drawings then ride in the page's own script, so they are there offline (`sw.js:23-28` precaches only the shell). Report the bytes added to the bundle.
2. **The checks.** Run `drawings-r4/check.py` in place, unchanged (it reads the files beside it and needs `rsvg-convert`, numpy, and cv2), and report its output. In `drawings.test.ts`: prove the shipped files byte-identical to `drawings-r4/`, and port check.py's first three checks (the fixed group identical in all ten, the required ids, matching path command counts) so the gate keeps them.
3. **The stroke.** The SVGs carry `stroke-width` 4 (dotted 3) in a 544-unit box; in the phone's squircle that is about 0.7 px. Report the rendered stroke in CSS px at 390 and 520, and if it falls under 1 px, widen the squircle (Dann 2026-11-13 11:35 allows it) or scale the stroke, and say which.
4. **The credit** (ratified 11:35). Replace `creditLine` (`drawings.ts:32`) with two keys in `i18n.ts`: `capture.credit.plate` "Drawing: Dann Mitton, after Bolla (1981), plate {n}." / « Dessin : Dann Mitton, d’après Bolla (1981), planche {n}. », and `capture.credit.noPlate` "Drawing: Dann Mitton. Bolla has no plate for this vowel." / « Dessin : Dann Mitton. Bolla ne donne pas de planche pour cette voyelle. » (U+00A0 before « : », U+2019). The plate numbers in `drawings.ts:19-28` match the drawing agent's registration and the handoff: correct the comment at `:6-8` to say so.
5. **The axis words on the capture chart** (DESK DEFAULT on Dann's 10:38 remark). Draw `sheet.axis.front`, `.back`, `.open` on `VowelChart`'s edges as `VowelSpaceSheet.svelte:62-68` does, small, in the grid's grey, hidden in hidden mode. The sticky group already overflows the phone (Step 6 report): measure its height on the phone before and after; if it would grow, do not ship the axis words and report instead.
6. **Labels that never collide.** In `phone-1-idle.png` the [ɪ] placeholder's symbol is lost under [e]'s dot; with ten sung it reads "ɩ e". A fixed offset cannot hold for every voice (for a bass, [ʌ] and [ɑ] sit 1 Hz apart on fR1). Write a small pure placement function (try four positions round the dot, take the first clear of other dots and symbols) with a test, at `ChartLayers.svelte:114` and `:122`. Check none sung, three sung, and ten sung, bass and soprano.

Pictures after 6b: the five desktop and five phone states, English and French, plus [i], [ɑ], and [u] selected so the drawing shows, and the printed sheet in both languages, each on one letter page.

## Out of scope

Step 8, Step 9, Phase 2, M0. The switch `?calibrate=new` stays. Do not merge to `Shane`; the desk measures and Dann ships.

## Noted for later, no action

A real implausible [i] (Dann's own 1063 Hz case) moves [ɨ]'s zone above the extractor's 1200 Hz ceiling, because `anchorF1sFor` includes implausible readings (the wizard's rule). The ring for low confidence (r5 Step 4b) stays unbuilt.

## What the desk could not establish

- The plate numbers against Bolla's book itself (they match the extracted plates' file names and the handoff).
- Any of this with a real microphone.

## Where each amendment went

A1 6a.1; A2 6a.2; A3 6a.3; A4 the order 7 then 6b, and no merge until 6b lands; A5 the e2e paragraph. B1 6b.1; B2 6b.2; B3 7.1; B4 7.4; B5 7.5; B6 7.6; B7 6b.6; B8 the order; B9 6b.3; B10 6b.5; B11 7.7, 7.8, 6b.1, and the merge of `Shane` first.

## Reports

One per step, with `path:line`, gate counts, pictures, and "Could not establish".
