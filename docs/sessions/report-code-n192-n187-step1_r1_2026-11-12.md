# Report: N.192 and N.187, step 1 (fixtures), r1, 2026-11-12

Lane `cloud-lane-50`. Step 1 changes no source file.

## What was added

- `packages/score-parser/src/fixtures/key-changes.musicxml`, source written in the comment at its head (synthetic, by hand, to the brief). Twelve bars, one lyric syllable per note, 41 notes.
  - Bars 1 to 4: D major (2 sharps), 4/4, with F sharp.
  - Bar 5: F major (1 flat) mid-system. F natural and B flat here are in the new key, so no sign is drawn on either (they would need signs if judged against D major). Bar 6: B natural, which needs a natural sign against F major.
  - Bar 9: D major again, with `<print new-system="yes"/>`, so a slice from bar 9 opens a system. F sharp and C sharp here are in the restored key. Bar 10: F natural, which needs a natural against D major.
  - Bar 11: key to A major (3 sharps) and time to 3/4 together (amendment 13: the bar that changes both). Bar 12 continues in 3/4.
- `packages/score-parser/src/fixtures/grace-notes.musicxml`, source in its head comment. C major, 4/4, divisions 4; ten bars, 27 kept notes, 11 grace notes. Grace notes are `<grace/>` with `<type>` and no `<duration>`, as homr writes them.
  - Bar 1: a lone eighth with `slash="yes"`. Bar 2: a group of two sixteenths. Bar 3: an after-grace at the bar's end.
  - Bar 4: a grace note carrying a `<lyric>` (to prove it is ignored by default). Bar 5: a grace note between two tied notes.
  - Bar 6: a grace note whose slur starts on it, followed by a two-note melisma (the case of `n188-markings.test.ts:127`, amendment 1). Bar 7: the usual grace-to-main slur.
  - Bar 8: a grace note before the first note of a system (`<print new-system="yes"/>`). Bar 9: a grace note whose principal carries an accidental (F sharp 5).
  - Bar 10: a lone eighth with no `slash` attribute, as a scan writes it (amendment 5).
- `packages/score-parser/src/n192-n187-fixtures.test.ts` (new): two tests. The key fixture parses to key signatures at bars 1, 5, 9, 11 with fifths 2, -1, 2, 3, a 3/4 meter at bar 11, 12 measures, 41 notes, one syllable on each. The grace fixture parses today with 27 notes, 11 "grace note skipped" warnings, and no bar-duration mismatch.

## Gate counts

Score-parser, this step: 787 passed, 5 skipped (792) when the whole package is run at step close (785 + 2 new). Other gates are unchanged by this step; they are measured at steps 2 onward and at the close.

## What I could not establish

- Whether the paginator will break at bar 9 on its own at any given width. The brief says the tests call `renderSystemSlice` and `sliceWidth` with explicit measure ranges, so no width is chosen to force a break; the `<print new-system>` in the fixture is for any test that does want the parser's own reading of it. Whether the parser reads `new-system` at all: NOT ESTABLISHED here.
- Whether the fixtures are the shapes the scan reader writes beyond the grace elements (`generate-main.ts:435-466`). They are hand-written MusicXML 3.1, and are not scan reads.
