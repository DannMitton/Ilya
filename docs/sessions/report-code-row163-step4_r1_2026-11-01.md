# Report: row 163, step 4 (the # in the Loupe's Syllables list)

2026-11-01, Code (Sonnet), branch `mac-row163`, on `27c2fa59`. Review amendment 15 applied.

## What changed

- `apps/web/src/lib/score/LoupeSyllables.svelte` (mounted at `Loupe.svelte`, which is untouched: it has one line of headroom). Each item now carries `brk: slot.ipa.endsWith('#')`, the source of truth the review names (`pairings.ts` grafts the # onto `slot.ipa`). After the unit's last syllable's button, and outside it, a `<span class="loupe-syl-hash" aria-hidden="true">#</span>` stands, with `margin-inline-start: 0.256em` (the same word space as Text and Markup). It is not a button, so a tap on it places nothing; it sits in the list's grey (`#6a655f`, the unplaced colour) and `cursor: default`.
- No `Slot` field was added, and `slot.cyrillic` never holds a #: `syntactic-break-surfaces.test.ts:57` and `:72` stay green. The # does not appear in the Cyrillic under the notes or in the Poem.
- On the phone strip the span is a non-shrinking flex item inside the 44 px row (`align-items: center`, row height unchanged) and sets no `touch-action`, so the row's own `pan-x` is the only claim.
- `loupe-syllables-break.test.ts` (6, new): server-renders the list for desk and phone with the real dictionary: one # span, aria-hidden, outside every button, after «Я» in «Я # на правду», after the LAST syllable of «правду # я», none where nothing was typed, never inside a button.

## Not established

- DESK DEFAULT, as the review reads it: Dann's 2026-10-21 01:38 "never in the Cyrillic" means the Russian under the notes, not this list (`OPEN.md:3327`); his to correct.
- The 44 px row and the pan were not measured on a touch-emulated phone; the markup and CSS are as above. The Playwright suite was not run.
- «Undo» wording: not in scope; unchanged.

## Gates

| Gate | Before this step | Now |
|---|---|---|
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3739 | **3745 passed, 1 skipped (3746)** (+6) |
| 8 ratchets | OK | OK |
