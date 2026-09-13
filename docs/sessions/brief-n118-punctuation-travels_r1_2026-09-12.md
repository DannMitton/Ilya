# Brief: N.118, punctuation travels in the slot

Numbered by Dann 2026-09-09. Design ruled the same day: **give the word's last
syllable its trailing punctuation inside `buildSlotQueue`, so every placement,
shift, and re-seat carries it.** Dann's first idea, a Transcribe-and-fit restore
pass, is WITHDRAWN in favour of this. UNPLACED until he places it.

Read `docs/memory/CONTRACT.md` in full before you start.

## 1. Why the page is inconsistent today

- A placed syllable never carries punctuation, because `cyrOfSyllable` slices
  its string out of `cleanWord` (`pairings.ts:152-160`), and `cleanWord` is by
  definition "Cyrillic stripped of punctuation and dashes"
  (`lib/types.ts:48-49`).
- `pairedCyrillic` overrides only the ids that are in the map
  (`pairings.ts:694-705`), so a cell with no pairing still shows the file's own
  underlay, punctuation and all.
- **So punctuation appears exactly where the singer has not worked yet, and
  vanishes as they place.** That is the inconsistency, and it is backwards.

Gould rule 10, project extraction, **snippet only, not read in full**: the
Cyrillic line keeps the author's punctuation.

## 2. Two things STATE.md listed as NOT ESTABLISHED. Both are now established

The desk read these on 2026-09-12. Confirm them, do not trust them.

1. **The raw punctuation is already held beside `cleanWord`.**
   `WordStackData.punctuation` is "Trailing punctuation stripped from the word"
   (`lib/types.ts:50-51`), and `WordStackData.cyrillic` holds the original as
   entered (`:46-47`). **Nothing needs to be re-derived or re-parsed.**
2. **A trailing comma is priced, but in the wrong font.**
   `estimateCyrillicWidthPx` (`underlay-widths.ts:826-831`) measures against a
   table whose documented coverage includes comma, full stop, hyphen-minus and
   space (`underlay-widths.ts:53`, `:61`), so the cell is measured rather than
   guessed. **AMENDED 2026-09-12:** that table is declared "Per-1000-em advance
   widths for **Source Serif 4** Cyrillic" (`underlay-widths.ts:690`), while the
   page draws the Cyrillic in Source Sans 3. Code measured the gap at about 5%
   on one word (« ночь », 27.72 serif against 26.34 sans). It is a separate
   defect, not N.118's to fix, and the comma inherits it. **Do not remeasure the
   table in this commit.** Price the comma the way every other character is
   priced today, and say in the memo that it carries the same error.

## 3. What to build

Inside `buildSlotQueue` (`pairings.ts:184` onward), append
`WordStackData.punctuation` to the Cyrillic of the word's **last** syllable as
the slot is built. Every downstream path, placement, shift, re-seat and the
receipts, then carries it without further change.

**Establish before you write:** whether the clitic path matters here. The queue
carries `pendingCyr` for a proclitic waiting on the next nucleus
(`pairings.ts:187-190`), and a clitic never reaches across a line break. Say
whether a clitic can be the last syllable of a word that carries punctuation,
and what you did about it.

## 4. What must not change, and these are the traps

- **Do not touch what decides a hyphen or an extender.** The word-final seat
  logic is exactly where N.113's defect lived: the renderer read
  `ev.syllable?.type`, a melisma shifted the seats, and a hyphen was drawn under
  a word that had ended (`pairings.ts:713-720`). Adding a character to the last
  syllable's string must not change how any of that reads the seat. Say in the
  memo how you proved it did not.
- **A blanked cell stays blank.** `applyBlank` writes an explicit empty string
  (`pairings.ts:703`); punctuation must never resurrect a cell that a melisma or
  a blank has emptied.
- Punctuation attaches to the LAST syllable only, never to every syllable of the
  word, and never to a syllable that is not word-final.
- Do not change `VocalLineEvent`, per CONTRACT §6.

## 5. Definition of done

- On Without Sun no. 1, a placed syllable that ends a punctuated word shows the
  punctuation, and the placed cells and the not-yet-placed cells agree with each
  other. State your expectation before you measure it.
- Place, then shift, then re-seat the same syllable: the punctuation survives
  all three.
- A melisma-blanked cell still draws nothing.
- A test that pins it, failing on today's tree.
- Five gates at baseline; if gate 4 moves, say the number and move
  `~/Downloads/ilya-ship.sh:79` before the ship.

## 6. For Dann, in your memo, unanswered by you

`WordStackData.punctuation` is TRAILING punctuation only. Say what the tree does
today with punctuation that is not trailing, an internal dash or an opening
guillemet for instance, and whether any appears in his three scores. Do not fix
it in this commit.

## 7. The return memo

`docs/sessions/memo-n118-punctuation_r1_<date>.md`. Files changed with
`path:line`. The §3 clitic finding. The §4 proof that the seat logic is
untouched. The §6 answer. A section listing what you could not establish.

**NOT ESTABLISHED beats a complete invented answer.**
