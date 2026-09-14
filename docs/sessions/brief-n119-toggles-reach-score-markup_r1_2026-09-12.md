# Brief: N.119, the Notation toggles reach Score markup

Numbered by Dann. His words: **"I want them to."** UNPLACED; this brief
displaces nothing until he places it.

Read `docs/memory/CONTRACT.md` in full before you start.

## 0. CORRECTION, 2026-09-14. READ THIS BEFORE SECTION 1

The table in section 1 was re-audited on 2026-09-14 against the **drawn text**
rather than against the string, because N.136 had proved one of its rows false.
**Five of the seven rows stand. One row is wrong, and two citations no longer
resolve.** The table itself is edited in place; this block holds the evidence.

**ROW 7 IS FALSE. `openSyllabification` does NOT reach Score markup's drawn
text.**

`VoiceProfilePane.svelte:786` reads
`const ipa = paired?.kind === 'syllable' ? paired.ipa : underlayResolvers.ipa(ev);`.
`openSyllabification` reaches text ONLY through `underlayResolvers`, built at
`VoiceProfilePane.svelte:748-755`. That branch is taken only when the event has
no pairing. Once a song is placed, every event has one, so the resolver branch
and the toggle with it are never reached. `applyNotationPreferences` then runs on
whichever string was chosen (`:786-797`), so the toggle's effect never enters the
string at all.

On the Cyrillic side, `cyrPreview` (`VoiceProfilePane.svelte:821`) reads from
`pairings`, which N.136 traces to `buildSlotQueue(lines)`, the RAW lines, not
`effectiveLines` (`+page.svelte:2182`), which is the open-syllabified view and
goes only to Transcription. The renderer picks that up at
`staff-renderer.ts:754`. **That half rests on N.136's citations rather than on an
independent re-derivation.**

**FOUR ROWS ARE STRONGER THAN THIS BRIEF MADE THEM.** `reducedVowel`,
`palatalNasal`, `geminate` and `shcha` were traced past the engine to the drawn
text: `applyNotationPreferences` at `VoiceProfilePane.svelte:786` feeds
`ipaPreview`, which reaches `paginateScore` at `:984`, `scorePages` at `:970`,
the render at `:1104-1126`, and the renderer's own pickup at
`staff-renderer.ts:2547`. The transforms are at `engine.ts:163`, `:169`, `:172`
and `:166`. `includeGeminates` is hardcoded `true` at
`VoiceProfilePane.svelte:787`.

**TWO CITATIONS IN SECTION 1 NO LONGER RESOLVE. The file has grown since
2026-09-12; the content is still there, at new lines.**

1. Row 7 cited `+page.svelte:2391` for "clears syllable overrides". That line is
   inside `reseatAcross` and is unrelated. The clearing is
   `handleOpenSyllabificationChange` at `+page.svelte:2566-2567`. That function
   touches only `syllableOverrides` and `effectiveLines`, neither of which the
   score's drawn text reads from.
2. The KNOWN GAP quote supporting row 1 was cited at `+page.svelte:4293-4297`.
   It now sits at `:4434-4438`, verbatim.

**WHAT THE RE-AUDIT COULD NOT ESTABLISH, and NOT ESTABLISHED beats a complete
invented answer:**

- The literal SVG emission site was not opened. The audit read as far as
  `staff-renderer.ts:2547-2555`, where `ipa` and `cyr` are pushed into an
  `underlay` array, and `:750-762`, where the same strings are measured. That the
  strings are drawn verbatim is inferred from the measurement using them, not
  read at the emission line.
- Whether an UNPLACED song, carrying no pairings at all, would let
  `openSyllabification` reach the resolver branch and so the drawn text. N.136
  asserts this only weakly and the audit did not verify it independently.
- `pipeline.ts:711`, Fit's separate unconditional stress mark, was not opened. It
  is out of scope for the seven toggles and bears on section 2.

Instrument: one Sonnet subagent, 28 tool calls, all read-only, 2026-09-14. No
file among the four traced was read in full; each was read in part.

---

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
| Open syllables | `openSyllabification` | **NO. CORRECTED 2026-09-14** | see the correction block after this table |

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
