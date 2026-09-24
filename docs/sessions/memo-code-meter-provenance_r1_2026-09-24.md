# MEMO. Where wrong meters come from

**Claude Code, 2026-09-24, branch `Shane` at `5e22d03`, tree dirty only in `docs/memory/STATE.md` and `SCHEDULE.md` (not mine). Answers `brief-code-meter-provenance_r1_2026-09-24.md`. WRITTEN, not DONE.**

Finale writes a pickup as a short actual meter under a full display meter, and both converters keep only the actual one. musx2mxl also spells Sunless 1's dotted-half beat in eighths, so its 3/4 and 6/4 become 6/8 and 12/8. Dann's `.musx` does not carry 12/8.

## Evidence

The raw EnigmaXML (`score.dat`, decrypted in scratch) holds, per `measSpec`:

| Song | Bar 1 actual | Bar 1 display (`useDisplayTimesig`) | From bar 2 | denigma MNX |
|---|---|---|---|---|
| 1 | 1 × 3072 EDU | 2 × 3072 | 2 × 3072 | 3/4, then 6/4 |
| 2, 3 | 2 × 1024 | 4 × 1024 | 4 × 1024 | 2/4, then 4/4 |
| 4, 5, 6 | 4 × 1024 | none that differs | 4/4 | 4/4 |

The real changes match too: song 3 bars 36 to 37, and song 4 bars 22 to 23.

**The display meter is absent from what Ilya reads.** denigma's MNX `time` has only `count` and `unit`. The MusicXML has no `implicit` bar and no second `<time>`. `adoptPickupMeter` (`pickup.ts`, shipped in `5e22d03`) already applies the item 5 detection. Through `.musx`, `MnxScoreParser` now reads 6/4, 4/4, and 4/4 plus 3/2, all with a pickup, for songs 1 to 3.

## Tests that pin 12/8

I ran the fixture's readers against a corrected copy (3/4, 6/4) through a redirected `readFileSync`. The control logged all seven redirects. Only `correction.test.ts:484` fails: two level-1 beams become zero. `pickup.test.ts:29` names 12/8, but its bars are synthetic.

## NOT ESTABLISHED

- Why musx2mxl chooses eighths: its source is not in the tree.
- Why 6/4 draws no beams in that test.
- That `pickup.test.ts:29` covers the parsed fixture.
- Song 4's bar 22 against the print.
- `e2e-phone/loupe-scan.test.ts` (Playwright), which I did not run.
