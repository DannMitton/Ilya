# Handoff: the Calibrate redesign (desk thread closed 2026-11-12 22:58)

For the next desk thread. Nothing in the repository was changed by this thread. Every access to the Mac was read-only. The tree was read on `Shane` at `e41e5c8a`.

## 1. Where the work stands

- **Design: settled enough to brief.** The interactive prototype and the printable chart are published in one artifact: "Ilya: your vowel space (mockup)", https://claude.ai/artifact/C1CLY8Kv3ecxj8wyH3MUWB (slug `591b8307-a0a8-448d-8f27-37c30a00eca8`, version `1794541916-746c`). Board C is the phone prototype. Board B3 is the lead printable chart.
- **Brief for Code: NOT WRITTEN.** The desk had begun reading the repository's rules for briefs and stopped when Dann closed the thread.
- **Fable review of the brief: NOT STARTED.** Dann asked whether a review helps. The desk's answer was yes.

## 2. What Dann ruled in this thread

- The main outcome is a trustworthy profile. The visualizer is the draw.
- One chart layout only: phonetic (fR2 across, high to low, left to right; fR1 down). No keyboard. No user-chosen axes.
- Zones: flat translucent colour fills, one colour per vowel, no outlines, grid drawn over the fills (board B3). Voice elements in lavender. Vowel symbols in Lato IPA.
- Zones are large and vague by intent: a neighbourhood, not a target. Overlap is wanted (Vennard's point).
- The chart zooms to the active vowel's zone for the take and zooms out on capture.
- The live dot is unsmoothed ("wobbling is a feature"), with a gentle glide between readings ("a useful lie that I approve of").
- A live readout sits right of the cue line: grey while live, black when captured.
- A toggle, "Hide the chart and numbers while I sing". Ilya records which way each reading was taken.
- The zones slide with the singer: voice-type estimate first, then the singer's own voice.
- The Jones wheel retires as the input. Ten buttons in two rows of five (Grayson's inventory) serve as progress map and selector.
- Tapping a vowel starts that vowel's take at once and takes precedence. Tapping again cancels.
- Ilya's linear order stays (i e ɛ a ɑ o u, then ɨ ɪ ʌ). After a manual pick, Ilya carries on from the singer's lead. All ten vowels are placed from the start.
- The hull is dashed until all ten are sung.
- Start over takes two taps.
- The sagittal drawing sits in a squircle, top right, and changes in place from vowel to vowel. A shared fixed frame is required so only the moving parts change.
- Drawings: Dann's original oropharynx as the base, adapted to Bolla (1981) for tongue, jaw, velum, and pharyngeal wall; lips per Grayson; [ɪ] has no Bolla plate.
- A separate Practice mode for any vowel (velar-i, dark and bright a).
- Aesthetic: Calm Authority. "Apple Store, not Fortnite."
- Provenance for every source.

## 3. Desk defaults Dann has not struck (DESK DEFAULT)

- One zone rule for all ten vowels: Ilya's plausibility window (Bozeman band, 3 semitones below to 2 above; personal vowels, derived centre with the same margins).
- fR2 zone height is a placeholder (2.5 semitones each way).
- Per-glyph optical centring in the feature circle.

## 4. Open questions for Dann

1. Credit line: "after Bolla" or "modeled on Bolla"?
2. Centring taste for [i] and [ɨ]: whole-ink centring or a common body line?

## 5. What the brief must carry (the desk's plan, not yet ratified)

- **Phase 1, no new signal processing:** the single-vowel screen; the ten-button grid in place of the wheel; zones from `checkPlausibility` windows and the stand-ins; the dot lands after the take through the existing `onComplete`; zoom; final readout; interim drawings in the squircle; the summary vowel-space chart; English strings, French as marked drafts for Dann's eye.
- **Phase 2, behind a development switch:** live readings during the fry (a sliding-window extraction at about 4 Hz). Phone performance and closed-phase extraction on 1 s windows are NOT ESTABLISHED.
- **Rulings the redesign reopens, which need Dann's recorded yes:** the two-tap arming, the wheel, and the cue text ratified 2026-09-30.
- **Brief conventions read this session:** named `brief-code-<name>_r1_<date>.md` in `docs/sessions/`; opens with what the singer gets, the ruling, where it lives today with file and line, then steps (Step 0 is read and report), gates, out of scope; carries "NOT ESTABLISHED beats a complete invented answer" verbatim (`CONTRACT.md` §4); a brief that changes how a number is computed names every other site that computes it; no more than two subagents at once; farm-out cost stated first; no French Dann has not seen (§7).

## 6. Line reads from this session (`Shane`, `e41e5c8a`)

- `apps/web/src/lib/voice/CalibrationWizard.svelte` is 2,112 lines. The wheel is imported at `:45` from `$lib/voice/pacifier/Pacifier.svelte` and used at `:1383`.
- `DEFAULT_VOWELS` at `:102`, `CHALLENGING_VOWELS` at `:103`, `ALL_VOWELS` at `:104`.
- `checkPlausibility(formant.f1, vowel, voiceType, anchorF1s)` at `:315`.
- `phase` state at `:335`; phases rendered at `:1292` (welcome), `:1312` (readiness), `:1368` (capture), `:1459` (summary), `:1511` (characteristics).
- `captureSession.startReadiness` at `:697`, with `onComplete` at `:721` and `onError` at `:735`.
- Earlier reads in this thread (before compaction; re-read before citing): `engine/types.ts:26` VOWELS; `engine/stand-ins.ts:14` and `:54`; `engine/derivations.ts:73`; the [ɨ] divergence check wired at `CalibrationWizard.svelte:284`.

## 7. Known gaps and risks

- **[CORRECTED 2026-11-12 23:5x by the next desk, on Dann's word: Bozeman gives fR2. PVA 2nd ed. p. 35: second resonances lie between about F5 and D7, mostly G5 to C7, spanning about a tenth within a voice; Fig. 5.3, p. 31. Do not shorten the next sentence to "no source gives fR2"; `CONTRACT.md` section 8.]** No single source gives fR2 by vowel by voice type. Best spread source: Titze et al. (2016), fry, 77 subjects, by sex. Bozeman PVA2 Fig. 5.3 (p. 31) gives F1 and F2 by vowel for one generic voice; Appendix 2 Fig. 19.1 gives fR1 by five voice types.
- The extractor's prior table is one bass's values for every voice type. Untested.
- The wrong-vowel test (fry [u] when asked for [i]) and the shown-versus-hidden comparison have not been run.
- The drawings in the prototype are interim crops of Dann's 2020 Fig. 4.3 panels. The Bolla adaptation is not done. Plate mapping: i 17, e 13, ɪ none, ɨ 15, ɛ 10, a 3, ɑ 2, ʌ 23, o 6, u 19. In the Bolla PDF, plate n's tracing is PDF page 161 + 2n. The meaning of Bolla's dashed contour is NOT ESTABLISHED.
- Board B3's legend still reads "Where a voice of your type usually lands". The settled wording is "the range Ilya accepts as plausible for this vowel".
- Standing reminder: tighten the comment at `engine/stand-ins.ts:14` ("Bozeman charts fR1 only") and `gaps_pass01.md` line 70.

## 8. Lost with this workspace, and how to get it back

The extracted Bolla outlines and the comparison sheets lived in the cloud workspace and do not carry over. Dann has the two comparison sheets in this thread. The outlines are re-derivable from the Bolla PDF at `~/Desktop/Russian diction & repertoire/Russian resources/` with the page rule in section 7.

## 9. Next steps, in order

1. Write the brief (Phase 1 and Phase 2 as above) as a document for Dann, not into the tree.
2. Spawn one Fable reviewer on it. Relay the findings.
3. Dann ratifies the reopened rulings and the brief. Code builds.
4. Drawings: prove the shared frame on [i] and [ɑ], then the rest.
5. Zone accuracy: Bozeman Fig. 5.3 against the dissertation's Table 5.3; fR2 width and tilt from Titze 2016, Figure 1.
