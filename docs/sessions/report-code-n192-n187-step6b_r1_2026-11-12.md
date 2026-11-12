# Report: N.192 and N.187, step 6b (Corrections: key changes), r1, 2026-11-12

Lane `cloud-lane-50`. Built to the brief with amendments 14 to 17 (the layer is applied where the corrected score is built, not in `applyCorrections`; one checkbox; the fifteen signatures by count; a saved transposition).

## What changed

- **The record.** `NoteCorrection.keySignature?: { fifths, through: 'next' | 'end', notes: 'follow' | 'keep' } | 'remove'`, on the entry that opens the bar. `withCorrection`, `clearCorrection`, and `amendsNote` each gained it, so Restore on the opening note does not take the key mark with it.
- **`key-signature.ts` (new), the sibling of `time-signature.ts`.** The two write-time rules: one mark stands in a bar (a new one replaces it), and "to the end of the song" removes her own later marks, so marks never overlap. Choosing the key the reading already has, "to the next change", writes nothing and removes her mark. `heldKey`, `setKey`, `removeKey`; the fifteen signatures (`KEY_CHOICES`) labelled by the upload question's own strings (`upload.ask.keyNone`, `.keySharp(s)`, `.keyFlat(s)`), no new option strings.
- **`applyKeyLayer`**, called in `BarLayer` after `rebar` and the grace layer (not in `applyCorrections`, amendment 14): each bar in scope takes the new key on `Measure.keySignature` (keeping the bar's mode); `keySignatures` is rebuilt from the measures, so the head, the transposition ruler, and `engraveInKey`'s `printed` all see it; nothing returns a new object where there is no mark. "To the next change" ends at the next change of the READING's own key or the next mark, whichever first. 'Remove' gives the bars to the next change the key of the bar before, with the notes following; it is not offered on the first bar.
- **'follow', bar by bar:** the old key is the key that bar had before this mark. A note whose alteration equals the old key's for its letter takes the new key's; one stated against the old key (a printed natural, on a letter the old key does not alter) stays. It never moves a pitch the singer set (a `pitch` correction or a hand entry), and it applies to grace notes in scope as to notes. 'keep' changes no pitch.
- **The card** (`KeySignatureCard.svelte`, state in `key-signature-ui.svelte.ts`, mounted by `ScoreControls.svelte` beside the time signature card, shaped like it): a menu-sized card on a fine pointer, a sheet on a coarse one; the fifteen signatures as a select; the two scope choices of the time signature card; ONE checkbox "The notes follow the new key" (on by default; off is 'keep') with one help line; Remove (only on a bar that opens a change and is not the first); Cancel. The page's outside-click guard (`+page.svelte:1308`) learned the card's overlay, as it knows the time signature card's; without it the Loupe closed when the card was used (found by the Playwright run).
- **The cell:** "Key signature", in the Loupe's Corrections station. `CorrectionSurface.svelte` has no line of room (1227 of 1227), so the cell lives in `GraceCells.svelte`, which now renders it always (disabled in a gap, on a grace note, or with no bar held); the surface's one line for that component changed in place, adding none.
- **`BarLayer.heldKey`, `.keyWrite`; `CorrectionVerbs.handleKeySignature`, `.heldKey`**; the page attaches the card once (`+page.svelte` 5527 of 5534).
- Strings: PENDING DANN, as step 6's: the English drafts stand, the French slot holds the same English (no French invented), one contiguous block in `i18n.ts`; the key index at its head is updated (1,240 keys). Keys: `loupe.keySignature` "Key signature"; `correct.keyChange` "Change the key from this bar"; `correct.keyToNext` "To the next key change"; `correct.keyToEnd` "To the end of the song"; `correct.keyFollow` "The notes follow the new key"; `correct.keyFollowHelp` "A note with no accidental of its own takes the new key's sharp or flat. Turn this off to keep every pitch as it is." (the desk's amended wording from Fable's question 3); `correct.keyRemove` "Remove this key change"; `loupe.undo.keyChanged` "key changed"; `loupe.undo.keyRemoved` "key change removed".

## Step 0's two measurements, answered here

- **A saved transposition when the opening key is corrected (amendment 17).** `appliedChoice` (`transposition-ruler.ts`) returns a stored `{ semitones, fifths }` only if it is still a stop of the printed key; `printed` is read from the corrected score, so correcting the opening key drops a stale choice and the page opens as printed. Where the choice is still a stop of the corrected key, `engraveInKey` moves the key and the pitches consistently. Tested (`markup/key-correction-transposition.test.ts`): a choice made against D major (up a tone, 4 sharps) is dropped after the opening key is corrected to A major, and the one that fits A major (5 sharps) stands. The signature and the pitches therefore cannot disagree. I did not stop.
- **A printed natural as `<alter>0</alter>` (amendment 15).** NOT ESTABLISHED, as step 0 reported; it did not "find that it does", so I built 'follow' with the known harm tagged in `key-signature.ts`'s head: a printed accidental equal to the misread key's alteration is re-spelled with the rest. For the desk to decide: whether the parser keeps a printed-natural flag in a side list once a scan page with a natural has been run through the reader.

## Tests

- `key-signature.test.ts` (16): no mark returns the same objects; 'follow' sets every bar in scope, stops at the next change of the reading, re-spells exactly the notes on the old key's altered letters (F natural to F sharp, B flat to B natural; a stated B natural stays), leaves a hand-set pitch and a hand entry alone, re-spells a grace note, and with scope 'end' judges each bar against its own old key; 'keep' changes no pitch; Remove takes the bars to the key before, is not offered on the first bar or on a bar with no change, and taking away the singer's own change writes nothing else; the two write-time rules; Undo is the earlier map; `engraveInKey` moves a corrected key as a read one; refuses a key that is not one.
- `markup/key-correction-transposition.test.ts` (1): the stored transposition.
- `rebar.test.ts:147` and `rebar-notes.test.ts:183-193` pass unchanged (the key layer is applied after `rebar`, so it does not reach them).
- Playwright, desktop (`e2e/key-signature-card.test.ts`, 4 pass): the card opens from bar 5 with fifteen signatures, `1 flat` selected, "to the next key change" and the checkbox on, Remove offered; Remove takes bars 5 to 8 to D major (the page draws one change, `2>3`) with one Undo step back; a key to the end of the song keeping the pitches (`2>0`) and one Undo step; Escape closes and changes nothing. Phone (`e2e-phone/key-signature-card.test.ts`, passes): the card is a sheet, offers no Remove on bar 6, and applies a key chosen there.

## Gate counts after this step

| Gate | Result |
|---|---|
| score-parser | 838 passed, 5 skipped (843), 39 files (unchanged by this step) |
| web, all of `src/lib` | 5231 passed, 1 skipped (5232), 283 files |
| svelte-check | 0 errors, 12 warnings |
| ratchets | OK. `CorrectionSurface.svelte` 1227 of 1227; `Loupe.svelte` 3012 of 3012; `+page.svelte` 5527 of 5534 |
| Playwright | `key-signature-card` desktop 4 of 4, phone 1 of 1; the whole suite runs at step 7 |

## Screenshots

`docs/sessions/shots-n192-n187-step6b_2026-11-12/`: the card on desktop and at 390 px (`key-card-desktop-en.png`, `key-card-390-en.png`): the sheet from the foot, one flat selected, the two scope choices, the checkbox with its help line, the button and Cancel; the Loupe above it holding bar 6 shows the one-flat head. English only: the French is not ruled.

## What I could not establish

- The French, and a French screenshot (not ruled).
- Whether six cells plus Grace note, Slash, and Key signature fit the Corrections station at 390 px without crowding: the cells flow in the station's own flex rows; I saw the station at 390 px in step 6's shot, not with all cells present in one frame.
- A tap on the key change drawn on the score opening the card (as the time signature's drawn digits do): not built. The cell is the only way in. DESK DEFAULT; say if wanted.
- The Loupe's behaviour for a bar whose key a mark changed, beyond the head showing the key in force (seen at bar 6).
