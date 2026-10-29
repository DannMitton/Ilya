# Report: N.135 stage 2b r5, step 9, a typed `#` takes the no-break form when the singer leaves Lyrics (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`, on top of step 8 (`8f8ac575`). One commit. Ruled by Dann 2026-10-29 01:48 (*"Yes I love it make it so."*). The last step of the brief; I stop after its push.

## The answer first

1. **Built.** Leaving the Lyrics field turns `я #` into `я #`. Nothing changes while the singer types, on a paste, in the Poem view, or on the score's own words. A `#` never moves.
2. **Where.** There was no blur handler. A new `onblur` on the Lyrics textarea, `apps/web/src/lib/components/Drawer/IntakeViews.svelte:250` (handler `onBlur`, `:205`), Lyrics view only. The conversion is `glueTypedMarks` in `apps/web/src/lib/text/break-glue.ts:32`, beside `WORD_TOKEN`, and the decision is `lyricsOnLeave` (`:41`), which returns the new text or null. **`+page.svelte` is untouched** (5,586 lines, its ceiling).
3. **Placement unchanged**, tested on Sunless 1 with a `#` typed after three words (below).
4. **Undo:** seen in a browser. Control+Z after the blur puts the field back to `я иду домой #`, with the ordinary space. One browser, one key combination (below).
5. **Gates:** 1 291 passed (291). 2 248 passed (248). 3 found 0 errors and 12 warnings in 5 files. **4 3705 passed | 1 skipped (3706).** 5 775 passed | 5 skipped (780). 6 145 passed (145). 7 55 passed (55). 8 ratchets: OK.

## The rule, as built

`glueTypedMarks(text)` replaces one or more U+0020 spaces or tabs between a word's last character and a `#` with one U+00A0, where the `#` is followed by whitespace, a line end, the text's end, or another `#`. The regex is `/([^\s#])[ \t]+(?=#(?:\s|$|#))/gu`.
- A `#` already glued is left alone (the character before it is the U+00A0, not a space).
- **«я #на» is left as typed.** Converted it would read as one token (`WORD_TOKEN`) and fuse two words. Tested both ways.
- A line break is never touched (only spaces and tabs are matched): «я\n #» is unchanged.
- A `#` inside a word («ва#с») has no space before it and is unchanged.
- **My reading of "a word's last character":** any non-space character that is not a `#`. So «я # #» becomes «я # #» and the second `#` takes no glue. The brief does not say; this keeps a chain from becoming a row of glued marks. It is a choice, and the desk may rule otherwise.
- The converter writes the U+00A0 as the escape ` `, in `break-glue.ts`, the file that already holds the three patterns about it. No fourth file has the character (brief §7).

## Placement test (`text/glue-typed-marks.test.ts`, 24 tests)

On the repaired Sunless 1 fixture's text (39 words after the changes of step 8 is 40 words; the text is whatever `scoreWordsText` gives), a `#` is typed with an ordinary space after the 3rd, 9th, and 20th words, then glued. Equal before and after: `wordGrid`; every word's `cleanWord`, `syntacticBreak`, `ipaContent`, `ipaDisplay`, and syllables; the slot queue (`cyrillic`, `ipa`, `origin`); `seatScoreWords` on each text (the whole seat map); and `seatedTextDiff(typed, glued).diff.unchanged` is true, with `reseatByDiff` returning the same map. The break sits on the word before it in both.

**Mutants:** changing the lookahead so that «я #на» is converted fails two tests ("leaves «я #на» as it is" and "is the mutant that would fuse two words"). Run, then restored.

## Undo

The change goes up through `oninput(value, 'paste')`, the path a Lyrics edit takes (`IntakeViews.svelte:onBlur` to `IntakePanel`'s `oninput`, the page's `handleInput`, `+page.svelte:2380`). I did not use `handlePoemInput` (`:2362`), which claims the score's derived words; the field does not convert while it shows them (`scoreWords`, below).

**What I saw** (`e2e/glue-typed-marks.test.ts`, Playwright, Chromium 153, headless, Linux; typed `я иду домой #`, left the field, the field read `я иду домой #`; Control+Z in the field): the field read `я иду домой #`, the ordinary space. So in that browser the undo did restore it (a value set from code did not clear the textarea's history). **Not observed:** Cmd-Z on a Mac, Firefox, Safari, a touch keyboard's undo. And not observed: whether the app's state (the seats, the Text view) followed the undo; the test reads the field only. After an undo the next blur would glue the `#` again. The test pins what I saw, for Chromium only.

## The derived-words guard (amendment 13)

`IntakeViews` has a new prop `scoreWords` (named so, because a prop called `derived` collides with the `$derived` rune; the first build did, and `svelte-check` caught it), which `IntakePanel` sets from its existing `poemDerived` (`IntakePanel.svelte:377`). With it true, `lyricsOnLeave` returns null. Not tested in a browser: I did not drop a score whose derived words hold a `#` after an ordinary space.

## Tests

- `text/glue-typed-marks.test.ts` (24): the conversions and the non-conversions; idempotent; `lyricsOnLeave`; the placement test.
- `e2e/glue-typed-marks.test.ts` (3, Chromium): leaving glues and typing does not; «я #на дом» is left; Control+Z as seen. All pass.

## Departures

- «я # #»: my reading above.
- The undo is one browser's (above), not "whatever undoes a typed edit" in general.

## NOT ESTABLISHED

Undo on a Mac, in Firefox or Safari, or on a touch device; the app's state after an undo; the guard with a real derived-words song; the Text view (unchanged by design, not looked at).

## Files

`apps/web/src/lib/text/break-glue.ts`, `apps/web/src/lib/components/Drawer/IntakeViews.svelte`, `apps/web/src/lib/components/Drawer/IntakePanel.svelte`, `apps/web/src/lib/text/glue-typed-marks.test.ts` (new), `apps/web/e2e/glue-typed-marks.test.ts` (new), a typo fixed in the step 8 report (`.musxl` to `.musx`), this report.
