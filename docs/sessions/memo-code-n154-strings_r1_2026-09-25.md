# Memo from Code, r1: N.154's four string fixes (read at `ed2dde1`, tree dirty only in `docs/`)

**Diff.** `i18n.ts`: "Fit" becomes "Ilya" in `calib.welcome.lede` and `calib.welcome.fryAnswer`, both languages; `a11y.paper` becomes Text and Texte, and its comment at `:138-141` now says so; the hand-written sentence is gone from `insights.method.typed` and `.untyped`, both languages. **Outside the brief:** `i18n.test.ts:30` asserted `a11y.paper` = Transcription, so gate 4 would have failed. Its expectation and header comment now cite this ruling.

**Gates.** 216, 235, 0 errors and 12 warnings in 5 files, 1412 (1412), 603 passed and 5 skipped (608). All five match `~/Downloads/ilya-ship.sh:76-80`. A grep of `i18n.ts` values for `Fit `, `hand-written`, and `écrit à la main` returns nothing.

**Walked.** On the local dev server at `sunless.localhost:5173`, not on the alias: the calibration welcome reads "Ilya will measure" and "Ilya reads its resonances", then « Ilya mesurera » and « Ilya en lit ». The paper region's accessible name is Text, then Texte. This matched the expectation I stated before measuring. In the served module, `t()` returns both method lines ending at "repeats taken." and « reprises comprises. ».

**Other renderings of the sentence.** None in `apps/` or `packages/`, including `e2e/` and `e2e-phone/`. It survives only in `docs/`, for example `PRODUCT.md` and `STATE.md`, which were not changed. `GuideContent.svelte:553` still reads "Fit’s analysis model implements …", and was left unchanged per the brief.

## NOT ESTABLISHED
- The alias walk. The alias cannot serve this change until you commit and push it.
- The Insights method line as rendered on a page. Rendering it needs a completed calibration, so only the served string was read.
