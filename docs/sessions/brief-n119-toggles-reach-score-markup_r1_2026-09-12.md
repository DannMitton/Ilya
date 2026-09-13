# Brief: N.119, the Notation toggles reach Score markup

Numbered by Dann. His words: **"I want them to."** UNPLACED; this brief
displaces nothing until he places it.

Read `docs/memory/CONTRACT.md` in full before you start.

## 1. The audit, done 2026-09-12 by the desk. Confirm it, do not trust it

`STATE.md` recorded that the score page "takes `openSyllabification` only".
**That is wrong, and this brief corrects the record.** Five of the seven
toggles already reach Score markup, because `VoiceProfilePane.svelte:787`
runs every IPA string through `applyNotationPreferences(ipa, notationPrefs,
true)` before the renderer sees it.

| toggle (drawer label) | field | reaches Score markup | evidence |
|---|---|---|---|
| Apply stress acutes | `showStressDiacritics` | **NO** | never passed to `VoiceProfilePane`; that file has zero references to it |
| Display [ə] instead | `reducedVowel` | yes | `engine.ts:163-165` |
| Palatalized nasal [nʲ] | `palatalNasal` | yes | `engine.ts:169-171` |
| Length markers [tː] | `geminate` | yes | `engine.ts:172-176`, with `includeGeminates` true at `VoiceProfilePane.svelte:787` |
| Length marker [ʃʲː] | `shcha` | yes | `engine.ts:166-168` |
| Reconstitution | `reconstitution` | **NO** | the field is declared *"Phase 3 — not wired yet"* (`engine.ts:34`) and `applyNotationPreferences` never reads it |
| Open syllables | `openSyllabification` | yes | `buildUnderlayResolvers`, `VoiceProfilePane.svelte:748-755`; also clears syllable overrides, `+page.svelte:2391` |

**The stress-acutes gap is already named in the tree**, at
`+page.svelte:4293-4297`: *"KNOWN GAP, accepted and unnumbered: the
stress-acutes toggle will appear on Fit and change nothing there, because
`showStressDiacritics` never reaches `VoiceProfilePane`. Fit's IPA stress mark
is a separate and unconditional thing (`pipeline.ts:711`)."* N.119 is Dann
numbering that gap.

## 2. What to build

**Only the stress acutes.** Pass `showStressDiacritics` into
`VoiceProfilePane` and let it govern the printed IPA line the same way the
Transcription page governs its own.

**Establish first, and say it in the memo before you write code:** what
`pipeline.ts:711` does unconditionally, and whether making the score page
honour the toggle means suppressing a mark that is currently always drawn,
adding one that is currently never drawn, or both. The desk has not opened
that line this session and will not guess.

## 3. What NOT to build, and why it is a ruling rather than a task

**Do not wire `reconstitution`.** It changes nothing in EITHER document, not
just on the score page, and what it should do is not written down anywhere
this desk can find. A toggle that is drawn and does nothing is the same fault
as a mark that says nothing, which CONTRACT §6 forbids. **Dann rules this
one:** wire it to a stated behaviour, or take it off the panel until it has
one. Put the question in your memo; do not answer it.

Note for that ruling, established: a per-word **spot** reconstitution does
exist and is live (`+page.svelte:4638` passes `spotReconstitution` to `Paper`;
`lib/reconstitution.ts`; the legend key `legend.spot-reconstitution`). The
global toggle is the unwired one. Say whether the two are the same idea.

## 4. The counter tells the truth only after this

`Notation`'s header reads `n of 7 changed` (`bandState.ts`, `notationDepartures`
counts all seven). Today two of those seven change nothing on the score page,
so the phrase can say `1 of 7 changed` beside a page that did not change.
Closing §2 fixes half of that. The other half waits on §3.

## 5. Definition of done

- At 1400 px, on Score markup with a placed score, flipping **Apply stress
  acutes** visibly changes the printed IPA line, and flipping it back restores
  it. State your expectation before you measure it.
- Nothing else on either page changes.
- Five gates at baseline; if gate 4 moves, say the number and move
  `~/Downloads/ilya-ship.sh:79` before the ship.

## 6. The return memo

`docs/sessions/memo-n119-toggles_r1_<date>.md`. The §2 finding about
`pipeline.ts:711`, stated before the change. Files changed with `path:line`.
The §3 question put to Dann, unanswered. The §1 table, confirmed or corrected
against the tree. A section listing what you could not establish.

**NOT ESTABLISHED beats a complete invented answer.**
