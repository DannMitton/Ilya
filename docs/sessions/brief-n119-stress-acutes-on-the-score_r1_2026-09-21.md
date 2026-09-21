# BRIEF — N.119. The stress acutes reach Score markup

**Written 2026-09-21, 00:20, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `6101e01`.**

**This supersedes `brief-n119-toggles-reach-score-markup_r1_2026-09-12.md`**, which was
written but never run. That brief's audit still stands and is worth reading for context.
**Two things in it are wrong and are corrected here**, in sections 2 and 3.

Read `docs/memory/CONTRACT.md` in full before you start.

Scope: **the stress acutes only.** `openSyllabification` is N.136 and is not in this
brief. `reconstitution` is **N.158** and is not in this brief.

---

## 1. WHAT THE SINGER SEES TODAY

Dann numbered this on 2026-09-10. His words: ***"I want them to."***

On Transcription, **Apply stress acutes** puts a combining acute on the stressed vowel of
each Cyrillic word. On Score markup it does nothing at all. The control moves and the page
does not, which is the same fault as a mark that says nothing (`CONTRACT.md` §6).

The header counter makes it worse: `Notation` reads `n of 7 changed`
(`bandState.ts:129`, which counts all seven), so it can say a number beside a page that
did not change.

---

## 2. CORRECTION ONE: THE TOGGLE MARKS THE CYRILLIC, NOT THE IPA

**The 2026-09-12 brief said to let the toggle govern "the printed IPA line". That is
wrong**, and building it that way would change the wrong row.

Read this session, `apps/web/src/lib/components/Paper/WordStack.svelte:53-54`:

```
// Apply combining acute accent to the stressed vowel in Cyrillic
const displayCyrillic = $derived.by(() => {
	if (!showStressDiacritics || !word.cyrillic) return word.cyrillic;
```

**It marks the Cyrillic.** The IPA carries the engine's own stress mark and is not touched
by this toggle.

### THE RULE IS ALREADY WRITTEN. MIRROR IT, DO NOT DERIVE IT

`InspectorPanel.svelte:201` already draws the acute, per character:

```
showStressDiacritics && !isClitic && word.stressSource !== 'inferred'
  && entry.features?.type === 'vowel' && entry.features?.position === 'stressed'
  && entry.char !== 'ё' && entry.char !== 'Ё'
```

`WordStack.svelte:55-61` is the same rule in the other shape, and its comment gives the
reason: *"Acute accent is a confidence signal: suppress for clitics (no independent
stress) and inferred/VERIFY words (stress uncertain)."*

**Take that predicate as written.** Two documents that disagree about whether the same word
is confidently stressed is worse than neither marking it.

### Why `'inferred'` matters, from Dann 2026-09-21

> *"some words will not have stress markings because the dictionary does not recognize
> them. This will mean the orthographic rendering also doesn't have a stress mark. That is
> why we built three provenance options for stress marks that are provided after Ilya
> analyzes a text."*

`pipeline.ts:655` and `:671` set `stressSource = 'inferred'` when the lookup fails, and
`provenance.ts:58-63` holds the ё rule plus his three: `user-dictionary`, `user-composer`,
`user-override`. **So an unrecognized word carries no acute anywhere, by construction, and
a word the singer has attributed carries one.** Nothing extra is needed for this; it falls
out of reusing the predicate.

---

## 3. CORRECTION TWO: DO NOT CARRY A WORD INDEX TO THE SCORE

The obvious build is to thread `showStressDiacritics` into `VoiceProfilePane` and reuse
`word.stressIndex`. **Do not.** On Transcription the acute is placed by the index of the
stressed vowel **within a word**. On the score the Cyrillic is **per syllable**:
`cyrPreview` at `VoiceProfilePane.svelte:641` is `pairedCyrillic(pairings, blankUnderlay)`,
and `pairings.ts:789-800` returns each pairing's own `cyrillic` string. A word-level index
does not locate a vowel inside a fragment of that word.

**The syllable already knows.** `pairings.ts:110` declares a syllable's IPA as *"The full
syllable IPA, stress mark included, clitics fused"*, and `:134-137` describes the same
string with the engine's stress mark restored or removed.

**So the derivation is: the stressed syllable is the one whose own IPA carries the engine's
stress mark, and the acute goes on the vowel in that syllable's Cyrillic.** Within a
syllable there is normally one vowel, so no index has to travel.

**The correspondence is 1:1 and the dictionary has already done this work.** One pairing,
one note, one syllable, one vowel: `pairings.ts:113` declares `vowel` as *"The single sung
vowel, or undefined where the engine resolved none."* There is no ambiguity to resolve.

Cite the engine's stress mark (`engine.ts:230`, per `pairings.ts:39`) and the pairing field
you read it from, and build.

---

## 4. WHAT TO BUILD

1. Thread `showStressDiacritics` into `VoiceProfilePane`. It has **zero references** there
   today, confirmed by grep this session across `apps/web/src`.
2. Apply the acute to `cyrPreview`'s strings, under section 2's four conditions, by
   section 3's derivation.
3. **Nothing else changes.** `applyNotationPreferences` at `VoiceProfilePane.svelte:607`
   governs the IPA and is untouched.

**Where the clitic and inferred-stress facts live on the score side is NOT ESTABLISHED by
the desk.** `pairings.ts:322` mentions *"inferred stress or a withheld syllable"*, so the
notion exists in that file. Find it, cite it, and if it is not reachable from the pairing,
say so rather than dropping the condition.

---

## 5. WHAT YOU MUST NOT DO

- **Do not touch the IPA row.**
- **Do not wire `reconstitution`.** It is its own item, **N.158**, numbered 2026-09-21 and
  specified in `docs/memory/OPEN.md`. It needs a channel the pairing does not have, so it
  is not a line you can add here.
- **Do not build `openSyllabification`.** That is N.136.
- **Do not drop a suppression condition to make the build simpler.** Report it instead.
- **Do not commit and do not stage.**

---

## 6. DEFINITION OF DONE

State your expectation in the message before you measure it (`CONTRACT.md` §5).

1. At 1400 px, on Score markup with a placed score, flipping **Apply stress acutes**
   visibly changes the Cyrillic underlay, and flipping it back restores it.
2. **The same word carries the same mark on Transcription and on Score markup**, including
   every case where it is suppressed. Report a list of the words suppressed on each
   surface and show the two lists match.
3. The IPA row is unchanged, byte for byte, in both toggle states.
4. `ё` never takes an acute.
5. All five gates at baseline. Gate 4 is `1342 passed (1342)`
   (`~/Downloads/ilya-ship.sh:79`); if you add tests, move the line and back up the
   original.
6. Print output is unchanged when the toggle is off.

---

## 7. WHAT YOU COULD NOT ESTABLISH

Fill it. **NOT ESTABLISHED beats a complete invented answer.**

At minimum: whether the clitic and inferred-stress facts are reachable from a pairing.

---

## 8. RETURN MEMO

`docs/sessions/memo-n119-stress-acutes_r1_2026-09-21.md`. Short. The section 3 findings
stated before the change, what changed by file and line range, the two lists from section
6 item 2, and section 7.
