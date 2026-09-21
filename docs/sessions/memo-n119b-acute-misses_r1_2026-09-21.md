# MEMO — N.119b. The acute does not draw on some words that carry stress

**Written 2026-09-21 by Claude Code, branch `Shane`, tree at `b4320d2` plus the uncommitted changes in section 3.**
**Answers `brief-n119b-acute-misses_r1_2026-09-21.md`. Nothing is staged and nothing is committed.**

**Status: WRITTEN and WALKED in the browser pane at 1400 px on the stored Sunless song. Case B is reproduced and fixed. Case A is NOT reproduced (section 4).**

---

## 1. The dump, grouped by cause

I put a temporary instrument inside `stressAcutedCyrillic` that recorded, for every
placed syllable, each condition evaluated independently (not stopping at the first
`continue`). It is removed. All 97 rows, with the toggle on and no hand-assigned stress:

| Question from the brief | Result |
|---|---|
| Rows where `word.cleanWord === p.origin.word` | **97 of 97.** `pairings.ts:838` (as it stood at `b4320d2`) rejects **0**. |
| Rows where the drawn text holds other than one vowel | **0.** `:844` rejects **0**. Every row held exactly one vowel letter. |
| Vowel scan set | Both cases: `аеёиоуыэюяАЕЁИОУЫЭЮЯ`, the same set as `WordStack.svelte:66-68`. `Ком` returns 1 vowel, `ляд` returns 1. |
| Rows whose resolved word does not contain the syllable's Cyrillic | 1: `в бью`. That is the fused vowelless clitic `в` (no-break space), not a misresolution. The word resolved is `бьющемся`, which is correct. |
| Rows whose stored `ipa` carries the mark | 33. |
| Rows whose live slot (`word.syllables[slotIndex].isStressed`) disagrees with the stored `ipa` mark | **0**, in the baseline. |

**The 66 rows with no acute:** 64 have no stress mark in their IPA, and 2 are `ё`
(`лёт`, `лё`). Of the 64, 8 sit in the five words the engine gives no mark at all (`не`,
`проглядная` ×4, `без`, `за`, `на`, clitic or inferred) and 56 are unstressed syllables of
stressed words. That 8/56 split is derived from word counts, not read row by row. No row
was rejected by `:838`, `:844`, or the index, clitic, or inferred checks: those four
conditions rejected **zero** rows in the baseline.

**The baseline has no miss.** 31 acutes drew, and Transcription and the score agree.

## 2. The cause I could reproduce

**The stored pairing `ipa` goes stale when the singer assigns stress by hand.**

Sequence: place the score, then in Transcription assign stress on «проглядная» to the
second syllable (Inspector, stress circle, **My assignment**). Transcription follows at
once: `stressIndex 1`, `stressSource 'user-override'`, «прогля́дная». On the score the
same four rows read (dump, read this session):

- `ляд`: stored `ipa` `lʲɑd`, **no mark**; live word `si 1, ss user-override`.
- The score's IPA row drew `lʲɑd`; no acute drew.

`shownPairings` is `refreshPairings(doc.pairings, slotQueue)` (`+page.svelte:418`), and
`refreshPairings` refreshed a pairing only when its **Cyrillic** differed
(`pairings.ts:464` at `b4320d2`). A stress change alters the slot's IPA and leaves its
Cyrillic alone, so nothing refreshed. `stressAcutedCyrillic` reads the mark from the
pairing's `ipa`, so it saw an unmarked syllable and correctly did nothing. **The defect was
in the refresh, not in the acute function.** It is Dann's timing hypothesis, exactly: the
pairing is a snapshot, the live word moved, and the two disagreed.

**A second shape of the same fault, measured against my own first attempt at the fix.**
That attempt refreshed the IPA only where it differed by the stress mark alone. I moved
stress of «Комнатка» from `Ком` to `нат`, and the score drew **both** `Ко́м` and `на́т`:
unstressing `Ком` also reduces its vowel (`kom` becomes `kɑm`), so the IPA differed by more
than the mark and the old acute stayed. I widened the condition to any IPA difference
(section 3). A stale pairing can put an acute on the WRONG
syllable, which Dann's ruling of 2026-09-21 (`docs/memory/PRODUCT.md`, section WHAT THE
STRESS ACUTES ARE FOR) calls worse than none.

## 3. What changed

| File | Lines | Change |
|---|---|---|
| `apps/web/src/lib/shane/pairings.ts` | 464-472 | `refreshPairings` now also refreshes when `current.ipa !== p.ipa` (same word). It copies the whole slot, `vowel` included, as it already did for a Cyrillic change. Every writer of a pairing copies `slot.ipa` (`firstPass`, `placeSyllable`, `reseat.ts:219`, `clitic-seat.ts:380`), so the slot's IPA is the current one. |
| `apps/web/src/lib/shane/pairings.test.ts` | 70-87 | 2 regression tests: a moved stress refreshes the mark and the vowel and leaves the text; a different word is not refreshed. |
| `~/Downloads/ilya-ship.sh` | 79 | Gate 4 baseline `1352` moved to `1354`. Original at `~/Downloads/ilya-ship.sh.bak-before-n119b`. |

**`stressAcutedCyrillic` is unchanged, and no suppression condition is loosened.**

**A consequence you should know about.** The score's IPA row now follows a hand-assigned
stress as well: it read `lʲɑd`, and reads `ˈlʲɑd` after the fix. That is the same stale
snapshot, and leaving it would have put an acute on «ляд» over an IPA row without `ˈ`.
Exactly one IPA cell changed in the walk. **This is a DESK DEFAULT**, reversible by
reverting the one condition.

## 4. Definition of done

**Expectation, stated before measuring:** assigning stress by hand moves the acute, and
the IPA mark, on the score with no reload and no toggle flip; likeliest failure, another
stale snapshot I had not found.

1. **The dump:** section 1.
2. **«проглядная» (Case B):** after a hand assignment, the score draws `ля́д` and the IPA
   cell reads `ˈlʲɑd`; Transcription reads «прогля́дная». Acute count 31 to 32. **MEASURED.**
3. **«Комнатка» (Case A): NOT REPRODUCED.** With no hand assignment it drew `Ко́м` in every
   run. Moved by hand to `нат`, the score drew `Ком` bare and `на́т`, IPA `kɑm ˈnɑt kʌ`,
   count 31. Reverting restored the baseline exactly (all SVG text identical). I do not know
   what state Dann's screen was in.
4. **Suppressed list:** unchanged from `b4320d2`, since the acute function is unchanged.
   In the baseline the score suppresses `не`, `проглядная`, `без`, `полёт`, `за`, `на`,
   `далёкое` and Transcription suppresses those plus `в`, the permitted difference. **In the
   hand-assigned state `проглядная` leaves that list on both surfaces, because Transcription
   also stops suppressing it.**
5. **Acute counts:** baseline 31; after assigning `проглядная` 32; after moving `Комнатка`
   31 (one left, one arrived); after reverting 31.
6. **Gates:** 216, 235, 0 errors and 12 warnings in 5 files, 1354, 575 passed and 5 skipped.
   All at baseline, with gate 4 moved to 1354.

## 5. What I could not establish (brief section 8)

- **Case A, «Комнатка», UPDATE after Dann's two screenshots.** His score row reads IPA
  `kom nɑt kʌ` with **no `ˈ` on `kom`**, while Transcription reads `ˈkom nɑt kʌ`. So the
  stored pairing for `Ком` carried no mark, which is the stale-snapshot shape of section 2,
  and not a `:838` or `:844` miss. I stripped the mark from that stored pairing
  (`m1-0-1`, `ˈkom` to `kom`) and reloaded the fixed build: it drew `Ко́м` and `ˈkom`, with
  the stored value untouched (the refresh is projected). I restored the stored value after.
  **Why the pairing lost its mark is NOT ESTABLISHED.** My guess, that it was placed
  before stress resolved, is an inference. The fix covers the symptom whatever the reason.
- **Case A, earlier note.** No miss reproduced. Both `:838` and `:844` rejected zero rows, so
  neither named suspect is the cause on this song. If Dann's screen differs from mine, the
  difference is in his stored song or his session, which I cannot read. **The next
  instrument is the same dump, run on his state:** I can hand him a one-line console
  snippet if he wants it, but the instrument is not in the tree.
- **Case B as Dann saw it.** He reports the IPA row already carried `ˈlʲad` while the acute
  was missing. In my reproduction the score's IPA row was stale too, so his screen was in a
  different state than the one I reproduced. **What I fixed is a real defect with the same
  visible symptom. I did not prove it is the one he saw.**
- **«непроглядная» as one word.** Dann writes it as one word; the fixture's poem has
  `не проглядная` with a space. I did not test a joined spelling.
- **Whether the deployed alias runs `b4320d2` plus other work.** Not checked.
- **Real time across a mounted pane.** Score markup and Transcription are separate tabs, so
  the walk changed stress on Transcription and looked at a freshly shown score. I did not
  verify an update while both are on screen at once (the Portrait and split layouts).
- **`docs/memory/OPEN.md`** showed as modified in the last memo. It no longer does.
