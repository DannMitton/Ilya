# Provenance: sunless-01-engraved.musicxml

Written 2026-10-29 (brief r5 step 8) from what `git log --follow` and the files show. A line marked NOT ESTABLISHED could not be read.

**What it is.** Dann's engraving of Musorgsky's *Without Sun* no. 1, "Within Four Walls", one voice part (P1, bass) and a piano part (P2), 36 bars each. Voice notes: 96 (97 until step 10). Verse 1 is the Cyrillic text, verse 2 the IPA.

**Where it came from.** `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` (`score/clitic-seat.test.ts` header, "copied verbatim"). Converter: `musx2mxl 0.2.9`, encoding date 2026-07-22 (`<software>` and `<encoding-date>`, lines 10 to 11 of the file). The source file's md5 and the `.musx` it was converted from (`Mussorgsky - Sunless 01 - Within four walls.musx`, named in the truth extract) are NOT ESTABLISHED: neither is in the clone.

**Edits since, by date (`git log --follow`, full history).**
- 2026-09-04, `7875892d`, N.111, the file added. md5 `265f7cb5fa359942b54826795cf10c4f`.
- 2026-09-20, `b53a6dfa`, N.155 and N.156: "the Sunless 01 text ends with its final syllable", 4 lines. md5 `3b08161a4600f9c7b700a538ee3bfc5c`, which is the md5 of `sunless-01-engraved.musicxml.bak-before-ja-2026-09-20`.
- 2026-09-20, `46f1d310`, "Close of 2026-09-20": the file carries «я.» as its own eighth note after an eighth «ка» (`score/clitic-seat.test.ts`), 25 lines. md5 `8341a301d78abcba62098cbcee764b62`. This is the file as Finale printed it, with «в» alone on its note; it is kept byte for byte as `sunless-01-finale-lone-v.musicxml`.
- 2026-09-27, `7f5b8e83`, N.174 D.2.6: moved with `lib/score/`; content unchanged (same md5).
- 2026-10-29, step 8: the `<lyric>` text and `<syllabic>` of verses 1 and 2 on bars 2 to 16 and on the first two notes of bar 17, from the desk's extract `truth-sunless-01-underlay_2026-10-29.json` (beside this file; md5 `b41fbc6e750d1d5d3928f3419d579057`). The extract's `start` is written `begin` and `whole` `single`. **No note was changed at step 8**: with every `<syllabic>` and `<text>` content blanked, the file before and after are byte for byte equal. 131 lyric values changed (checked by the repair script, not committed). md5 now `b4fc3b5f79a5ee80fd158751e2d4f5b3`. (Bars 17 and 18 were left at step 8 by desk ruling (a) and repaired at step 10, below.)

- 2026-10-29, step 10 (desk default replacing ruling (a)): bars 17 and 18 of the voice part take the print's notes and words, from the desk's reading of the musx truth (`tools/e16-harness/output/truth/mussorgsky_sunless-01_within-four-walls.truth.json` on Dann's Mac, not in the clone) and the tracked extract. Bar 17's notes at 3/4 and 9/8: `<duration>24</duration>`, `quarter`, `<dot/>`, the 2:3 `<time-modification>` and the `<notations>` tuplet removed; lyrics «о» and «ди». Bar 18: the first two notes keep their durations and take «но» and «ка»; the third becomes a quarter (`<duration>16</duration>`) with «я.»; the N.156 eighth «я.» is removed. Verse 2 for the six notes from the extract. Pitches, the piano part, and every other bar untouched. The file now has 96 voice notes. md5 now `649e1afc6e695cfde2e79eceffe93dd6`; before this edit `b4fc3b5f79a5ee80fd158751e2d4f5b3`.

**What it is checked against.** `score/ingestion/fixture-rule.test.ts`: one vowel per note in each Cyrillic verse, no lone mark in any verse, and a note-by-note comparison with the extract (bar, onset, pitch, both verses' text and syllabic) on every bar (step 10). The desk reported that the Lamm print and the musx agree with the extract (2026-10-29 01:1x); I did not read either.

**What it is NOT checked against.** The printed page: NOT ESTABLISHED.
