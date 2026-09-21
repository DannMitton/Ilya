# MEMO — N.119. The stress acutes reach Score markup

**Written 2026-09-21 by Claude Code, branch `Shane`, tree at `6101e01` plus the uncommitted changes listed in section 2.**
**Answers `brief-n119-stress-acutes-on-the-score_r1_2026-09-21.md`. Nothing is staged and nothing is committed.**

**Status: WRITTEN and WALKED in the browser pane at 1400 px. Not walked by Dann.**

---

## 1. What the tree says about the derivation (brief section 3)

**Order of events, stated honestly:** I read these before writing the code, but the
memo was not written until after. The brief asked for them before the code.

The derivation holds. I did not substitute a word index.

- **Field names.** A syllable pairing is `{ kind: 'syllable', cyrillic, ipa, vowel, origin }`
  (`pairings.ts:118-125`). **`ipa` carries the mark.** It is the slot's full IPA with
  the stress mark restored (`syllableIpa`, `pairings.ts:162-168`, which prepends the mark
  when `SyllableData.isStressed` is true and `.ipa` lacks it).
- **The mark.** `STRESS_MARK = 'ˈ'` (`pairings.ts:43`), the engine's `markers.stress`
  (`packages/phonology/src/engine.ts:230`, read this session).
- **Multi-vowel syllables.** The engine cuts at every vowel, so a raw slot holds one vowel
  (`engine.ts:1085-1095`, the syllabifier). Only a moved syllable boundary makes a
  syllable with two. Nothing on the pairing says which vowel is stressed there.
  **The fixture has none:** all 97 pairings in the stored Sunless song hold exactly one
  vowel letter (counted in the browser from IndexedDB).
  **What I did anyway:** a syllable with other than exactly one vowel letter is left bare.
- **Fused clitics.** `buildSlotQueue` fuses a vowelless clitic into the slot with a
  no-break space (`pairings.ts:59`, `:201-273`). A vowelless word has no vowel by
  definition (`CYRILLIC_VOWEL`, `vowel-resolver.ts:155`), so the slot's vowel is always the host's.

## 2. What changed

| File | Lines | Change |
|---|---|---|
| `apps/web/src/lib/shane/pairings.ts` | 802-851 | New `stressAcutedCyrillic(cyr, map, lines)`. It touches only the Cyrillic record. |
| `apps/web/src/lib/shane/VoiceProfilePane.svelte` | 77, 180-185, 254, 649-652 | Import; prop `showStressDiacritics` (default `false`); `cyrPreview` applies the function when the toggle is on. |
| `apps/web/src/routes/+page.svelte` | 4856, 4504-4505 | Passes `{showStressDiacritics}` to `VoiceProfilePane`. Stale "KNOWN GAP" comment replaced. |
| `apps/web/src/lib/components/Drawer/NotationFields.svelte` | 14-18 | Stale "KNOWN GAP" comment replaced. |
| `apps/web/src/lib/shane/pairings.test.ts` | 39-41, 594-651 | 10 new tests for `stressAcutedCyrillic`. |
| `~/Downloads/ilya-ship.sh` | 79 | Gate 4 baseline `1342` moved to `1352`. Original is at `~/Downloads/ilya-ship.sh.bak-before-n119`. |

`applyNotationPreferences` and `ipaPreview` are untouched.

**The four conditions, in the order the function checks them.** (a) no stress mark in the
syllable's own IPA, (b) stress index absent or negative, (c) clitic (`stressSource === 'clitic'`,
`isProclitic`, `isEnclitic`) or `stressSource === 'inferred'`, (d) `ё`/`Ё`. Conditions
(b) and (c) are read from the word the pairing came from, found as
`transcribedLines[origin.lineIndex].words[origin.wordIndex]`
and confirmed by `origin.word === word.cleanWord`. If the word is not found or does not
match, the syllable is left bare.

**Where the clitic and inferred facts live (brief section 4):** on `WordStackData`
(`types.ts:52-55`, `:91-93`), not on the pairing. They ARE reachable, through `origin`,
because `VoiceProfilePane` already receives `transcribedLines={lines}`
(`+page.svelte` at the `VoiceProfilePane` call).

## 3. Measured, at 1400 px

Song: the stored `sunless01.musicxml` at `http://sunless.localhost:5173`, 97 placed
syllable pairings, 39 words on Transcription.

**Expectation, stated before measuring:** flipping the toggle puts U+0301 on the stressed
vowel of the Cyrillic underlay and flipping back restores it byte for byte. Likeliest
failure: the renderer drawing the combining mark badly.

| Item | Result |
|---|---|
| 1. Flip on / off / on | Acutes on the score: 31 / 0 / 31 (all read from the SVG `<text>` nodes). The off state equals the on state with U+0301 stripped, exactly. The second on equals the first on, exactly. No dotted circle (U+25CC) in any node. |
| 2. Same marks on both surfaces | Matches. See the lists below. Zero words disagree. |
| 3. IPA row | The 294 non-Cyrillic `<text>` nodes are identical, in order, with the toggle off and on. |
| 4. `ё` | Score syllables `лёт` and `лё` carry no acute. |
| 5. Gates | 216, 235, 0 errors and 12 warnings in 5 files, 1352, 575 passed and 5 skipped. |
| 6. Print with toggle off | NOT MEASURED through the print path. With the toggle off, `cyrPreview` is the value `pairedCyrillic` returned before this change (the new branch is not entered). |

**Words with no acute, Transcription** (8 of 39): `не` (clitic), `проглядная,` (inferred),
`без` (clitic), `в` (clitic), `полёт` (ё), `за` (clitic), `на` (clitic), `далёкое;` (ё).

**Words with no acute, Score markup** (7 of 38): `не`, `проглядная`, `без`, `полёт`, `за`, `на`, `далёкое`.

**The lists match.** The one difference is `в`, which is a vowelless clitic: it owns no
slot, so the score has no syllable of its own to mark. It is suppressed on Transcription
and has nothing to suppress on the score. Score words map to score syllables by poem order
(the score's 97 Cyrillic nodes equal the pairings sorted by line, word, and slot, with no mismatch).

## 4. What I could not establish (brief section 7)

- **The first flip did nothing, and I do not know why.** On the first load of the
  dev server, the toggle went on, the pairings were placed, `lines` held 39 words, and
  the score drew zero acutes. After a reload the same flip drew 31, from a cold start
  and from a warm one. I did not reproduce the miss. A debug line I added showed `lines`
  empty on the first render after load and populated on the next. My guess, a stale first
  compile, is an inference and is not tethered.
- **Multi-vowel syllables.** No such syllable exists in the fixture, so the "leave bare"
  behaviour is covered by a unit test and was not seen on a real score.
- **A note whose Cyrillic comes from the file, not a pairing.** `cyrPreview` covers paired
  notes only. On a lyric-bearing score, an unpaired note draws the file's own cell
  (the `pairedCyrillic` doc comment, `pairings.ts`), and that cell gets no acute. I did not look for a fixture with
  unpaired notes.
- **A stale pairing.** A pairing whose `origin.word` no longer matches the transcription is
  left bare. Whether that shows up in practice depends on `reseat.ts`, which I did not read.
- **Print.** I did not open the print path.
- **Header counter.** `Notation` still reads `n of 7 changed`. With this change six of the
  seven toggles reach the score, and `reconstitution` and `openSyllabification` are outside
  this brief. I changed nothing in `bandState.ts`.

## 5. State of the tree

- `docs/memory/OPEN.md` shows as modified. I did not touch it, and it was not modified at the
  start of the session (`git status` then listed only `PRODUCT.md`). Something else wrote it.
- The staged fixture copy in `apps/web/static/reader/` was deleted.
- The Browser pane's toggle in `localStorage` for `sunless.localhost` is reset to `false`.
