# Report: row 148, the provenance circle draws only with its icon

Branch `cloud-lane-12`, after row 144 (`89d851f`). Brief: batch A r2, row 148.

## The desk's reading, confirmed first

`processText('Ну-те ж все разом')` on the real dictionary gives, per word, source and clitic flag: `Ну-те: dictionary`, `ж: inferred, enclitic`, `все: supplement`, `разом: dictionary`. So «ж» is a clitic whose source is `'inferred'` (the pipeline's value for a word with no stress data). Before: `showProvenance` is true for `'inferred'`, and `isInferred` is false for a clitic, so `(showProvenance && !isInferred)` held and the frame drew with none of its four icons inside. Seen in the browser at 1,440 px before this row: «ж» carries an `.icon-area` and an empty `.provenance-icon`; after, none (the picture shows the empty circle above «ж» before).

## The diff, by file

- `apps/web/src/lib/components/Paper/provenance-icon.ts` (new): `ICONED_SOURCES` (the four sources the frame has an icon for: `user-dictionary`, `user-composer`, `user-override`, `yo-restored`) and `hasProvenanceIcon(source)`.
- `apps/web/src/lib/components/Paper/WordStack.svelte`: `iconed = showProvenance && hasProvenanceIcon(word.stressSource)` replaces `(showProvenance && !isInferred)` in `hasTopRightIcon`, the `{#if}` that draws the icon area, and the inner `{#if}` that draws the icon. `showProvenance`, `isInferred`, and `isClitic` are kept and unchanged; an inferred non-clitic word keeps its `is-inferred` verify treatment.
- `apps/web/src/lib/components/Paper/provenance-icon.test.ts` (new, 5 tests): «ж» in «Ну-те ж все разом» is enclitic with source `inferred` and gets no frame; each of the four sources gets one; every other source (`dictionary`, `supplement`, `clitic`, `inferred`, `yo-normalized`, `none`, none given) gets none; an inferred non-clitic word's source is not framed; the line's sources as read.

## What else is silenced

`'yo-normalized'` (`packages/phonology/src/engine.ts` about `:779`, carried by `pipeline.ts` about `:664`) drew the empty frame before by the same path (`showProvenance` true, no icon) and now draws none. I did not draw it in the browser; it follows from the code and the unit test.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2932 (2932) (2927 plus 5), web-check 0 errors and 12 warnings, score-parser 775 passed and 5 skipped (780), ratchets OK. `pipeline.ts` is untouched.

## Shared numbers

Whether a word is marked is decided by `showProvenance`, `isInferred`, `isClitic`, and the icon branches in `WordStack.svelte`; the frame's condition now lives in `hasProvenanceIcon`. Other sites that read `stressSource` for display (from `grep -rn stressSource apps/web/src`, non-test): `WordStack.svelte:63` (the displayed IPA falls back to the Cyrillic for a clitic or an inferred word) and `:107`, `:111-114`, `:119`; `InspectorPanel.svelte:98` and `:201` (stress diacritics hidden for a clitic or an inferred word), `:371-373` (the three user sources), `:415` and `:1229` (`getStressIconSvg`, which draws icons in the Inspector); `ne-join.ts:26,43,48,50` (a «не» join rewrites an inferred source to dictionary or supplement); `text/word-marks.svelte.ts:59` (writes a user override); `provenance.ts:60` (a second `showProvenance(stressSource)` with other exclusions, no caller outside its file and tests; left as is) and `:192-194` (the legend's counts skip clitics and count `LEGEND_ORDER` sources). No code sets the source `'clitic'`, so the `'clitic'` exclusion at `WordStack.svelte:113` is dead; left in place as the brief says.

## Pictures

`docs/sessions/batch-a-shots/row148-before-en-1440.png` and `row148-after-en-1440.png`: «Ну-те ж все разом» typed in the Poem field and shown in Text. No French picture: no string changed.

## Could not establish

- **A phone picture.** I measured at 390 px (DOM: before, «ж» has the frame and an icon element; after, none) but my screenshot script clipped the wrong region there, so I deleted those two images rather than ship them.
- That the Inspector's own icon (`InspectorPanel.svelte:415`, `:1229`) is right for `'yo-normalized'` and `'inferred'` clitics: not looked at, not changed.
- `'yo-normalized'` in the browser.
