# Report: step B0, the fixtures (Code, cloud lane 43, r1, 2026-11-10)

Commit: "B0: the barline and time signature fixtures". Files: five `.musicxml` in `apps/web/src/lib/omr/fixtures/` and `apps/web/src/lib/omr/barline-fixtures.test.ts` (6 tests).

## What was built

Five small hand-built MusicXML files, one voice, no lyrics, no note ids (the parser then makes ids as it does for a homr reading, `m{bar}-{num}-{den}`, `musicxml-parser.ts:732-734`). Each says in a comment that it is synthetic. They are NOT readings of any scan.

| file | shape | what its test pins |
|---|---|---|
| `barline-clean-4-4` | eight 4/4 bars, bar 5 opens with a rest | the control: 8 bars, every bar adds up |
| `barline-fused` | bars 4 and 5 of the control joined: one bar of eight quarters | 7 bars; bar 4 reads `8 of 4` |
| `barline-fused-rest-dropped` | the same with bar 5's rest dropped | bar 4 reads `7 of 4`; no exact multiple (the case A refuses) |
| `time-signature-wrong` | eight bars of three quarters under a stated 4/8 (the Gretchaninov reading's shape) | every bar reads `6 of 4` |
| `time-signature-barlines-wrong` | a 3/4 melody laid out in six bars of four quarters under a stated 4/4 | adds up under 4/4; reads `4 of 3` under 3/4 (the rebar case, T2) |

## Answers the brief asked B0 to report

- **Does a silent bar have an entry to carry a mark?** Yes, in the four stored homr readings in the tree (`tch-1`, `tch-2`, `tch-3`, `sun3-2`): no measure lacks a `<note>`, and a bar with no pitch holds rest events (`tch-1` bars 1 to 7, `tch-2` bar 35, `tch-3` bars 8, 22, 32 to 37). Counted by a scratch script over the files. A bar of rests carries a mark on its first rest.
- **Fused bars on the Lamm scan, yes or no:** NOT ESTABLISHED. The Lamm scan and the reader's kept MusicXML of it are on the maintainer's Mac, not on this lane, and this sandbox cannot run the reader.

## What I could not establish

- The fixtures Fable named (f1 song 1's kept MusicXML with its bar 4 and 5 barline removed) are on the Mac. These stand in, by shape. Where the desk wants the real ones, drop them into the same folder and the tests that name a fixture by file can take them.
- Whether the reader ever fuses bars on a real page: no stored reading here holds a case (Fable: 0 of 37).
