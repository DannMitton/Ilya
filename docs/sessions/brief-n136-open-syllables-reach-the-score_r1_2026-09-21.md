# BRIEF — N.136. Open syllabification reaches Score markup's drawn text

**Written 2026-09-21, 00:45, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `b4320d2`.**

Read `docs/memory/CONTRACT.md` in full before you start.

This is the second half of the gap N.119 closed. N.119 is shipped and walked.

---

## 1. WHAT THE SINGER SEES

Found by Dann on the N.118 walk: **the Open syllables toggle moves, and neither the
Cyrillic nor the IPA on Score markup changes.**

**Corrected here, and this is sharper than `STATE.md` records it:** the toggle is not
disconnected. **It works on an unplaced score and stops working the moment the singer
places one.**

---

## 2. THE MECHANISM, read in the tree 2026-09-21

1. `VoiceProfilePane` **does** receive the toggle (`:179`, `:253`) and feeds it to
   `buildUnderlayResolvers` at `:579`.
2. `VoiceProfilePane.svelte:606` reads
   `const ipa = paired?.kind === 'syllable' ? paired.ipa : underlayResolvers.ipa(ev);`
   **The resolver is consulted only for a note with no pairing.**
3. Once a song is placed, every note has a pairing.
4. Pairings come from `buildSlotQueue(lines)` on **raw** `lines`
   (`+page.svelte:385`, `:2473`, `:3266`), which never sees the toggle.

So the toggle reaches a code path the placed score no longer uses.

---

## 3. WHAT MUST NOT CHANGE, AND IT IS RULED

**The score takes RAW `lines`, never `effectiveLines`, and that is deliberate.**
`+page.svelte:4836-4839`, Dann's N.10 decision of 7 August:

> *"Fit consumes Transcription's output. `lines` is passed RAW, not `effectiveLines` — the
> Fit resolver applies its own open syllabification, so the display view would be sliced
> twice."*

The same reason is stated at `vowel-resolver.ts:389-395`.

**Do not pass `effectiveLines` to the score. Do not rebuild the pairings. Do not
re-derive a seat.** N.157 is open precisely because re-deriving seats loses the singer's
work.

---

## 4. THE FIX, AND WHY IT IS SMALL

**The enabling fact, `syllable-utils.ts:273-276`:**

> *"Reconstitution changes vowel values; open syllabification moves consonant boundaries.
> These transforms are independent... **The vowel sequence is unchanged by re-slicing**,
> so positional matching against the transcription log remains correct."*

A pairing carries exactly one sung vowel (`pairings.ts:113`). **So open syllabification
never changes how many syllables a word has.** It moves a consonant from one syllable's
coda to the next one's onset. The number of notes carrying text, and which note carries
which vowel, are both unchanged.

**Therefore this is a draw-time transform over the ordered paired syllables of one word**,
the same shape as `stressAcutedCyrillic` shipped tonight in `b4320d2`. The pairing map is
not touched.

### The pieces you already have

- **The primitive:** `openSyllabify(syllables)` at `syllable-utils.ts:48`, which is what
  Transcription's own path uses.
- **The word grouping:** `sylTypePreview` in `VoiceProfilePane.svelte` already carries
  each paired syllable's position inside its word (`start`, `middle`, `end`, `whole`),
  built for N.113b item 3 so the renderer draws hyphens from the singer's words. **That is
  the handle for collecting a word's syllables in order from the pairing sequence.**
- **The seam:** `cyrPreview` (`VoiceProfilePane.svelte:641`) and the IPA at `:607`, which
  is where N.119's transform went in.

### Both rows move together

Open syllabification moves a consonant, so **the Cyrillic and the IPA both change.** N.119
touched only the Cyrillic; this one touches both. State in the memo how you kept them in
step.

### The per-word overrides

`applyOpenSyllabificationToLineWords` (`syllable-utils.ts:240-268`) honours a per-word
override from `syllableOverrides` ahead of the global toggle, keyed `lineIndex-wordIndex`.
**Establish whether those overrides are reachable from the score side and say so.** If they
are not, the score honours the global toggle only, and **that is a gap to report, not to
paper over.**

---

## 5. WHAT YOU MUST NOT DO

- **Do not pass `effectiveLines` to the score.** Section 3.
- **Do not rebuild `buildSlotQueue`, the pairings, or any seat.**
- **Do not change `VocalLineEvent`**, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- **Do not slice twice.** If a string reaching your transform has already been
  open-syllabified, say so and stop rather than applying it again.
- **Do not commit and do not stage.**

---

## 6. DEFINITION OF DONE

State your expectation in the message before you measure it (`CONTRACT.md` §5).

1. At 1400 px, on Score markup **with a placed score**, flipping **Open syllables** changes
   the Cyrillic and the IPA under the notes, and flipping it back restores them exactly.
2. **The same word is syllabified the same way on Transcription and on Score markup.**
   Report the two, word by word, and show they match.
3. **No pairing changes.** Compare the pairing map before and after the flip and show it is
   identical.
4. **The note each vowel sits on does not move.** Report the count of notes carrying text
   in both states; it must be the same number.
5. On an **unplaced** score the behaviour is unchanged from today.
6. All five gates at baseline. Gate 4 is `1352 passed (1352)`
   (`~/Downloads/ilya-ship.sh:79`); if you add tests, move the line and back up the
   original.

---

## 7. WHAT YOU COULD NOT ESTABLISH

Fill it. **NOT ESTABLISHED beats a complete invented answer.**

At minimum: whether the per-word syllable overrides are reachable from the score, and what
happens to a clitic, which `syllable-utils.ts:248` skips on the Transcription side.

---

## 8. RETURN MEMO

`docs/sessions/memo-n136-open-syllables_r1_2026-09-21.md`. Short. What changed by file and
line range, the four measurements from section 6, and section 7.
