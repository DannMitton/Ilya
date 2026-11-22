# Report: lane 83, an extender is drawn from what the page draws

Branch `cloud-lane-83`, cut from `origin/Shane` at `c470e03d` (fetched 2026-11-22). The working tree was dirty on arrival: `docs/memory/{ENVIRONMENT,QUEUE,SCHEDULE,STATE}.md` modified, and two `docs/sessions/read-fable-n204-unit-*.md` untracked. None is mine. None is staged. Nothing under `docs/memory/` was touched.

RULED by Dann, 2026-11-22 04:49: "The source of where words come from should not matter. What appears on the score is the material that must be managed."

## Step 0: extenders on the Tchaikovsky fixture

Read from `docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml`, rendered whole (bars 0 to 98) through `renderSystemSlice`, by a throwaway probe that is not kept.

| | Today (HEAD `c470e03d`) | After |
|---|---|---|
| Extenders | 2 | 2 |
| `m56-0-1`, "читъ!" | drawn | drawn |
| `m91-0-1`, "лю!" | drawn | drawn |

Why each exists: in the file, the note after each of these syllables carries no `<lyric>` (`m57-0-1` and `m92-0-1`), and the singer's words are not in play (no `cyrPreview`). Both are real sustains in the file, word-final syllables (`end`), so each draws its extender.

NOT ESTABLISHED: the brief says measures 58 and 93. The file numbers these bars 57 and 92 (0-based indices 56 and 91). I did not find why the brief is one higher. A pickup offset in the printed edition is a guess, not a finding.

The same two draw when `cyrPreview` repeats the file's own words note for note. The repair changes nothing for a score whose words come from its own file.

## The change

`packages/score-parser/src/staff-renderer.ts`, one local function and three lines:

- `drawnWord(ev)` returns `options.cyrPreview?.[ev.id] ?? ev.syllable?.text ?? ''`. It is the expression the singer's loop already used, and the one the underlay build and `joinsWord` already read.
- The file loop opens a run on a note where `drawnWord` is not empty, and continues it over notes where it is empty.
- The singer's loop reads the same function instead of its own copy, so the two cannot drift.
- The comment above it says they are one rule read from one place. It replaces the old comment ("the data model encodes a melisma by ABSENCE of syllable"), which was the false premise.

Size: 3413 lines, one under the ceiling of 3414. The first draft with a long comment came to 3426 and breached the ratchet, so the comment was folded into the existing one. No ceiling was raised. The ceiling could fall to 3413 (`scripts/ratchets.json`); I left it for the desk.

A second effect, in the same loop: `melismaSpans` and the derived slur come from this loop too. A note that draws a word no longer takes a slur over it either (visible in the pictures: the arch over "над" to "ту" is gone). That is the same fault read at the same place, so I am reporting it as part of this change rather than a separate one.

## Tests

New file `packages/score-parser/src/extender-source.test.ts`, new fixture `packages/score-parser/src/fixtures/underlay-gap.musicxml` (synthetic; two bars; gaps under the note after "Ночь" and the note after "над").

| Test | Protects | Before the change |
|---|---|---|
| draws an extender after each file gap when nothing else supplies a word | a real sustain in the file still draws | passes |
| no extender where the singer's words fill the gap | the fault itself | FAILS (got two extenders, wanted one) |
| no extender at all when the singer's words fill every gap | the same, every gap | FAILS (two, wanted none) |
| a note that draws nothing after a word note still opens a melisma | a real sustain is unaffected in the same render | FAILS (two, wanted one) |
| a pairing's word on a bare note can end one run and leave the next | the word's source does not matter in either direction | FAILS (two, wanted one) |
| Tchaikovsky draws exactly `m56-0-1` and `m91-0-1`, on "читъ!" and "лю!" | the brief's 2 extenders | passes |
| Tchaikovsky draws the same two when `cyrPreview` repeats the file's words | no change for a score with its own words | passes |

Before-state run by putting `git show HEAD:` of `staff-renderer.ts` in place, running the file, and restoring the fix (no git write). Four fail, three pass, as expected. After the change all seven pass.

## Gates

Run from a scratch copy of `~/Downloads/ilya-ship.sh` that drops the branch and untracked-file refusals and exits before any staging (grepped: no `git add`, `commit -m`, or `push`). The tree under test is the branch with the working-tree changes above.

| Gate | Baseline | Reading |
|---|---|---|
| 1 phonology | 462 passed | OK |
| 2 dictionary | 248 passed | OK |
| 3 web check | 0 errors, 12 warnings in 5 files | OK |
| 4 web test | 6801 passed, 1 skipped | OK, unchanged. The new `.musicxml` is under `packages/`, and `markup-pages.test.ts` counts only tracked files under `apps/`, `docs/`, and `tools/`, so committing it does not move gate 4. |
| 5 score-parser | 904 passed, 5 skipped (909) | 911 passed, 5 skipped (916). +7, which is exactly `extender-source.test.ts`. The baseline in `ilya-ship.sh` is the desk's to move to 911 / 916. |
| 6 blurb | 178 passed | OK |
| 7 integration | 159 passed | OK |
| 8 ratchets | OK. | OK. No ceiling raised. |

Gate 4's count is therefore unchanged, and the +7 is gate 5's. Seven added tests, each in the table above.

## Pictures

`docs/sessions/lane83-figures/before.png` and `after.png`. The same two-bar score, paginated onto a letter page (816 px wide, Finale Maestro), with the singer's pasted word "ту" under the fourth note, which the file leaves bare.

- Before: a line runs from "над" through to "ту", and an arch slurs a note that draws its own word. The singer is told to hold a vowel the score does not hold.
- After: "над" and "ту" each stand alone. "Ночь" keeps its extender and arch, because the note after it draws nothing.

Rasterized in headless Chromium from the SVG the renderer returns, with the app's own fonts. The page SVG was not run through the live app or a browser pane. I did not wire a real paired score through `pairings.ts` into the app and look at it; the figure uses `cyrPreview` directly, as the fault does.

## NOT ESTABLISHED

- A note the singer marks as a melisma continuation (`melismaPreview`) draws nothing on the page, but this loop does not count it as "draws nothing" and I left that alone: the brief names `cyrPreview` and the file only. A file syllable under a marked note therefore still opens a run in the file loop. It is a state the hand can produce; I did not test it.
- Why the brief numbers the two bars 58 and 93 (above).
- That the singer's lyrics reach `cyrPreview` in the shipped app exactly as the fixture supplies them. The fault description says they do; I read the renderer, not the app's wiring.

## Files

- `packages/score-parser/src/staff-renderer.ts` (modified)
- `packages/score-parser/src/extender-source.test.ts` (new)
- `packages/score-parser/src/fixtures/underlay-gap.musicxml` (new)
- `docs/sessions/lane83-figures/before.png`, `after.png` (new)
- `docs/sessions/report-code-lane83_r1_2026-11-22.md` (this file)

STRINGS: none, in either language.

---

## Desk note, 2026-11-22 05:2x (Opus 5): the measure numbers are settled

The lane marked NOT ESTABLISHED: "the brief says measures 58 and 93. The file
numbers these bars 57 and 92 (0-based indices 56 and 91). I did not find why the
brief is one higher."

Settled by the desk, RAN against
`docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml`
(a python pass over `<measure number="...">`, counting sounding notes with no
`<lyric>`): the file declares 99 measures starting at number 1, and the two
lyric-less sounding notes are in **declared measure 58** (0-based index 57) and
**declared measure 93** (0-based index 92), each the first note of its bar.

Both figures are right, and they name opposite ends of the same extender. The
lane's ids `m56-0-1` and `m91-0-1` name the **syllable that opens** each run,
which sits in the bar before the gap. The brief's 58 and 93 name the
**continuation note** the extender runs to. No pickup offset is involved, and
nothing in the renderer or the fixture is wrong.

Neither the lane nor the brief needs correcting. Future briefs on extenders
should say which end of the run a bar number names.

## Desk note: the pictures, seen

`before.png` and `after.png` read by the desk, 2026-11-22 05:2x. Before: "Ночь"
carries an extender, and a second extender runs from "над" into "ту" with a slur
arching over the two notes, although "ту" draws its own word. After: "Ночь"
keeps its extender and its slur, and "над" and "ту" each stand alone with no line
and no arch between them. The control passes in both directions on one picture.
