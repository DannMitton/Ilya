# Brief: N.156, the Sunless 01 fixture is missing its final syllable and a note

Revision 1, 2026-09-20. Written at the desk. Build in Claude Code.

**Dann ruled this in on 2026-09-20 at 14:21**, choosing to fix the fixture properly
rather than patch the symptom. **It was found by N.155's line-end hyphen on the first
page that hyphen was ever drawn on.**

**File:** `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`
**Primary source, already in the tree:**
`tools/e16-harness/scans/raster400-2.png` (page 2 of
`tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf`). **Read the
scan. Do not work from the fixture alone.**

---

## What the desk established, 2026-09-20

**From the scan, last system, read this session:** the vocal line ends
« Вот о-на ночь мо-я, | ночь о-ди | но-ка-я. » The German underlay confirms the count:
`Nacht, o, du ein-sa-me.` **«одинокая» is five syllables on five notes.** In the final
bar, «но» is a dotted note, «ка» an eighth, «я» a quarter, followed by a rest under a
fermata and the final double barline.

**From the fixture, parsed this session:**

- After the final «ночь» the Cyrillic lyric line has FOUR notes: «о», «ди», «но», «ка».
  **The scan has five.**
- The last lyric entry is «ка» with `<syllabic>middle</syllabic>` and **nothing follows
  it but rests**, so the word never closes. This is what draws the eighth line-end
  hyphen.
- Measure 18 carries «ди» (dotted, `duration` 24), «но» (eighth, 8), «ка» (quarter, 16).
  **That rhythm is exactly the scan's «но», «ка», «я».** So the lyric assignment has slid
  one note earlier, and **the dropped note is earlier in the phrase, at or near the
  «о-ди» duplet the scan brackets in its penultimate bar**, not at the end.
- Measure 17 carries «я,» (half), a quarter rest, «ночь» (half), «о» (half).

**SECOND DEFECT, separate and also real.** The file has two lyric lines, `number="1"`
Cyrillic and `number="2"` IPA. **They agree from the first note until index 13, measure
4, and disagree from there on.** At that point line 1 sets «не» as `single` and opens
«про-гляд-на-я», while line 2 sets one word `ɲɪ-prɑ-ˈɡlʲɑ-dnɑ-jɑ`. By the end of the
file line 2 lags line 1 by one note. **Both lines hold exactly 96 entries, so a count
alone does not reveal this.**

---

## Build in this order

**STEP 1. Collate the fixture against the scan, bar by bar, for the vocal part `P1`
only.** Report where the note counts first diverge. **State the divergence point before
you change anything.**

**STEP 2. Restore the dropped note and re-seat the Cyrillic lyric line** so that
«о-ди-но-ка-я» sits on five notes with «я» as `<syllabic>end</syllabic>`, and the bar's
total duration still balances. **If restoring the note requires a judgement the scan
does not settle, stop and say so rather than choosing.**

**STEP 3. Reconcile lyric line 2 against line 1** from measure 4 onward, so that every
note carries the IPA for the syllable line 1 puts on it. **Where the two disagree about
word division, line 1 is authoritative**, because Ilya transcribes from the Cyrillic.

**STEP 4. Gates.** Baselines as of 2026-09-20: phonology 216, dictionary 235, web-check
0 errors and 12 warnings in 5 files, web-test 1263, score-parser 575 passed and 5
skipped. **This fixture is asserted on by tests, so expect movement and name every
expected value that moves and why.** Do not edit `~/Downloads/ilya-ship.sh`.

---

## State your expectation before you measure

Per the control rule. **The desk's expectation:** after step 2 the line-end hyphen on the
final system disappears, because «ка» is no longer the last syllable and «я» closes the
word, and the count of line-end hyphens on this fixture goes from eight to seven.

---

## What NOT to do

- **Do not retag «ка» as `end`.** Dann rejected that: it prints «одинока», a word not in
  the poem.
- Do not change any renderer code. This is a data fix.
- Do not touch the other Sunless fixtures.
- **No git command that writes.**

---

## Definition of done

1. The fixture's vocal line matches the scan in note count through the final bar.
2. «одинокая» is five syllables on five notes, closing with `end`.
3. Lyric lines 1 and 2 carry the same word divisions on the same notes.
4. The eighth line-end hyphen is gone and the other seven remain.
5. All five gates green, with every baseline movement named.
6. Walked by Dann. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n156-sunless01-fixture_r1_<date>.md`: the divergence point
you found, what you changed by line, your expectations against your measurements, the
gate results, **a section listing what you could not establish**, and any decision this
brief did not settle, marked as yours.
