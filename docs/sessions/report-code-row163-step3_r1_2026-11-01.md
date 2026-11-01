# Report: row 163, step 3 (the tidy on leaving Lyrics)

2026-11-01, Code (Sonnet), branch `mac-row163`, on `f8cb810e`. Review amendments 12 to 14 applied.

## What changed

- New `apps/web/src/lib/text/break-tidy.ts`: `tidyBreaks(text)` and `lyricsOnLeave(value, shownIsDerived)`. It reads the text the way the pipeline does (`splitIntoPreLines`, so the same tokens and the same hyphenated-particle split), moves each typed # to the end of its unit with `moveBreaksToUnitEnds` and the engine's clitic sets (the pipeline's own boundary pass, `boundaries.ts`), strips every # (with the no-break spaces before it), and writes `BREAK_MARK` (`break-text.ts:21`, ` #`) after the unit's last token. No second literal.
- `IntakeViews.svelte`: imports `lyricsOnLeave` from `break-tidy` and the `onBlur` comment says what it now does. Behaviour is unchanged where the field shows the score's derived words (null) and in every view but Lyrics.
- `break-glue.ts`: `glueTypedMarks` and the old `lyricsOnLeave` are removed (the tidy replaces them; keeping both would leave dead code, and `lyricsOnLeave` could not stay there without a cycle: `break-glue` is imported by `syntactic-break`, which the tidy imports). The token patterns stay.
- `syntactic-break.ts`: the comment that said Ilya never moves a typed # now says the text is tidied on leaving Lyrics.
- `glue-typed-marks.test.ts` is replaced by `break-tidy.test.ts` (30 tests).

## What it does, by form (each is a test)

No space, one or many spaces, a tab, an already-glued mark, no-break and ordinary spaces mixed, a # leading the next word, a # inside a word («ва#с» to «вас #»), two #s together or apart (one remains), a # at a line's end: all become «<unit> #». A # after a proclitic («в# доме» to «в доме #») or before an enclitic («сказал # бы я» to «сказал бы # я») goes to the unit's end. A # at the start of a line moves to the end of the line before; a line holding only #s goes; a # with no word before it is removed. The tidy is idempotent.

## Proved: nothing moves, except what the ruling moves

On Sunless no. 1, six #s typed in each of six forms (a space, no space, many spaces, no-break and ordinary spaces, led onto the next word, two together): the tidied text has the same `wordGrid`, the same words, syllables, `ipaContent`, `ipaDisplay`, and break flags, the same slot queue, the same seats, a diff that reports `unchanged`, and a re-seat that moves no seat. (Six typed #s give four in the text when two land on one unit, such as a clitic and its host; the test counts against the pipeline's own flags.) The one form that changes meaning is a line-initial #: dropped before, a break on the line before after; a test states it (amendment 13).

## Differences from the review, and what is not established

- Amendment 14 said the tidy needs the dictionary for the clitic sets. They are the engine's static sets (`GraysonEngine.proclitics`, `enclitics`); only the split of a hyphenated particle reads the dictionary, and a word it does not split is one piece with the same end. So no "before it loads" guard was written; the comment in `break-tidy.ts` says why.
- **A line-initial # after a blank line is removed, not carried across the blank line.** The peel reads each line alone, so no word precedes it. NOT ESTABLISHED whether Dann means it to cross a blank line.
- **A line that held only #s is deleted whole** (its # ends the line before). The ruling says "moves to the end of the line before"; whether the emptied line should stay as a blank line is not stated. DESK DEFAULT.
- A # standing after a bare punctuation token («слово — #») goes after the unit's last word, before the dash.
- The tidy runs on blur only (as before). The Playwright suite was not run; the textarea's own undo history does not take the change (as with step 9's gluing).

## Gates

| Gate | Before this step | Now |
|---|---|---|
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3732 | **3739 passed, 1 skipped (3740)** (the old glue tests, 23, are replaced by 30) |
| 8 ratchets | OK | OK |

Gates 1, 2, 5, 6, 7 read no file this step touched; they run in full at the end. `ilya-ship.sh` gate 4 baseline after this step: `3739 passed | 1 skipped (3740)`.
