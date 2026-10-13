# Review: brief for Code, offers for a bar (row 51, slice 2, r1, 2026-10-12)

Fable, 2026-10-12. Read this session, whole: the brief; `bars-to-confirm.ts`; `triplets.ts`; `entry.ts:280-470`; `draft-corrections-wording_r1`; `plan-corrections-build_r1`; `report-code-bars-to-confirm_r1`. Nothing else in the upload exists (`OPEN.md`, `CONTRACT.md`, the recheck report, `types.ts`, the git history), so every claim that rests on those is marked.

## Verdict

**SEND WITH AMENDMENTS.** The frame is right (pure module, no edit to `triplets.ts`, the page decides). The offer rules in section 4 are under-specified in four places where a Sonnet session will invent: the run's start position, what a run is, the ladder's ends, and the unit of equality. Two of the section 7 tests as worded contradict the "exactly one candidate" rule. Ten amendments below.

## Citations

| Brief | Says | Found | Holds |
|---|---|---|---|
| s1 `report-code-bars-to-confirm_r1_2026-10-09.md` | slice 1 shipped | report line 3, `WRITTEN` | Yes |
| s1 `...-recheck_r1_2026-10-11.md` | rechecked | not in upload | NOT ESTABLISHED |
| s1 bar rule 2026-10-05 00:52 | | `bars-to-confirm.ts:13` | Yes |
| s1 wording, 16:00 to 16:02 | four strings | draft lines 3, 13, 14, 15, 17 | Yes, verbatim |
| s1 Dann 15:50, OPEN.md item 5 | quoted words | ruling and time at `bars-to-confirm.ts:8`, `triplets.ts:64-65`; the words themselves | Ruling yes; words NOT ESTABLISHED |
| s1 Dann 20:10 "Quadruplets happen" | | no source in upload | NOT ESTABLISHED |
| s2 `bars-to-confirm.ts:38-55` | `BarToConfirm`, `barsToConfirm` | interface `:38-47`; function `:55`; `:49-53` are unrelated | Range loose |
| s2 `triplets.ts:119-201` | five exports | `Metre` `:119`, `readMetre` `:125`, `Ratio` `:155`, `compound` `:190`, `conventionalSpace` `:201-206` | Off by five lines |
| s2 `ruleRatios :276-279` | 3:2 always; 2:3, 4:3 compound | `:277-279` | Yes |
| s2 `entry.ts:310-313` | counts 2 to 9, five values | `:310`, `:313` | Yes |
| s4 `WHOLE_EPSILON :51-53` | | `:53`, not exported; applied to whole-note sums `:83-91` | Lines yes; use no (A4) |
| s5 draft 15:53 to 16:01 | | draft line 14 | Yes |
| s6 baselines at `9e1af16` | eight numbers | no tree | NOT ESTABLISHED |
| s2 row 89, row 56 | | `triplets.ts:48-49` names rows 54 and 56 as landed; row 89 unseen | Partly |

## Findings

1. **Sections 1 and 2.** Observation and fact, with one slip: section 1 item 3's last sentence ("An offer names what Ilya may have missed and sends the singer to the page") is purpose, not observation (A8). Section 2 bullet 4 is an instruction, harmless.
2. **The unit of equality.** `measureFill` rounds `actual` to three decimals (`entry.ts:458`); `WHOLE_EPSILON` is private and guards whole-note sums, not `actual`. A Sonnet told "agree to its WHOLE_EPSILON" will export it or invent a beat-unit epsilon. Exact fractions from `e.duration.fraction` (`entry.ts:424-431`) need none (A4).
3. **Kind 1 can offer a double dot** ("add a dot" to a dotted note), a wrapped step (`stepValue` cycles whole to 16th, `entry.ts:333`), a grace note (takes no time, `triplets.ts:299`), or a note already under a tuplet. None is named (A6).
4. **Kind 2 has no definition of a run and no start rule.** `triplets.ts` requires one printed type, no dots, none already in another tuplet (`:208-216`), and a start that is a whole number of spans from the bar's start (`:187`, `:241-242`). Without the start rule, a 4/4 bar of five quarters yields three triplet runs, one straddling beats 2 and 3. A run of mixed values (half and quarter) has no "n of one value" to be n of (A7).
5. **4:3 in simple metre, as written, fires in 2/4 and 4/4,** where four notes of one value already divide the beat or bar evenly; a musician would call a quadruplet of quarters in 4/4 absurd. In 3/4, 3/8, and 3/2 it is the ordinary quadruplet. This is my musical reasoning, not a source; Gould is not read this session. The brief presents the simple-metre 4:3 as Dann's (20:10); it is the desk's reading of a quote I cannot see (A7).
6. **"At most two runs"** does not say what happens at three or more, nor the order of two that start together (A7).
7. **Two section 7 tests contradict the rule.** "Short by half a half note offers the half dotted": a 4/4 bar of half and quarter has two candidates (dot the half; quarter to half), so none is offered. "Three quarters and a half reading long": the half stepped down to a quarter is a lone kind 1 candidate, so the bar offers that as well as the 3:2 run. "A 3/4 bar of four quarters" also admits a 3:2 run over the first three (2 + 1 = 3) (A9).
8. **Buildable from the cloud: yes, with A3.** `triplets.ts` works on MusicXML text; the new module works on `VocalLineEvent`, so nothing in it is reusable beyond `Metre`, `Ratio` (types, erased at build), and `compound` (one line). Importing a value from a file row 89 is editing tonight is the one tie; copying the one line cuts it.
9. **What `VocalLineEvent` carries** (printed type, dots, tuplet, rest, grace) is not established by any file in the upload; `pitch` (`entry.ts:289`) and `duration.fraction` (`:424`) are. The brief must have Sonnet measure this first (A5).
10. **No shape for the result.** "Report them in the result" names no field (A10).

## Amendments

1. Section 2 bullet 1: replace `:38-55` with "`BarToConfirm` (`bars-to-confirm.ts:38-47`); `barsToConfirm(score: Pick<ParsedScore, 'measures' | 'vocalLine'>)` (`:55`). The new function takes the same `score` shape plus one `BarToConfirm`." Reason: the range as given spans unrelated lines, and the input type is otherwise unstated.
2. Section 2 bullet 2: replace `:119-201` with `:119-206`, and add: "`readNote`, `isRun` (`:208-216`), `onlyRunsThatFill` (`:224-247`), and `ruleRatios` (`:277-279`) are not exported and read MusicXML text, not `VocalLineEvent`; the new module states its own run test over events and does not export anything from `triplets.ts`." Reason: stops a detour into a file that must not change.
3. Section 2 bullet 4, add: "DESK DEFAULT: import only the types `Metre` and `Ratio`. Copy `compound`'s one line (`triplets.ts:190`) into the new file with a comment naming its source. Do not call `conventionalSpace`." Reason: a type import is erased at build; a value import ties the cloud build to tonight's edit.
4. Section 4, replace the `WHOLE_EPSILON` bullet with: "Equality is exact. Sum each event's `duration.fraction` (`entry.ts:424-431`) as a fraction in lowest terms and compare it with `beats/beatType`. No epsilon. `actual` and `expected` in the tables are `BarToConfirm`'s own." Reason: see finding 2.
5. Section 3, new item 1 before the table: "List the fields of `VocalLineEvent` (`packages/score-parser/src/types.ts`, with `path:line`) that the rules need: printed type, dots, tuplet, rest, grace, pitch, `duration.fraction`. Where one is absent, mark the rule that needs it NOT ESTABLISHED and build the rest." Reason: finding 9.
6. Section 4 kind 1, replace the first paragraph with: "A candidate is one sounding event (not a grace note) that carries no tuplet. Four changes, each tried alone: add a dot to an undotted note; remove the dot from a note with exactly one dot; step its printed type one rung longer or one rung shorter along `TUPLET_VALUES` (`entry.ts:313`), stopping at `16th` and `whole` (do not use `stepValue`, which wraps, `:333`). A rest is a candidate; its offer carries no pitch. `index` is the event's 0-based position among the bar's events in `vocalLine` order." Reason: finding 3.
7. Section 4 kind 2, replace with: "A run is n consecutive sounding events of one printed type, none dotted, none under a tuplet, n being the ratio's n; a rest may stand in a run. Its span is m of its notes, and it begins at a time from the bar's start that is a whole number of spans (`triplets.ts:187`, `:241-242`), so no run straddles a beat. One run at a time: a bar that fits only under two runs gets no offer of this kind and says so in the result. Ratios: 3:2 in any metre; 2:3 and 4:3 in compound metre; 4:3 in simple metre only where `beats` is 3 (DESK DEFAULT, the desk's reading of Dann 20:10; Dann may widen it). Where one or two runs fit, return them as A and B by start, then by n ascending. Where three or more fit, offer none and report them all." Reason: findings 4, 5, 6.
8. Section 1 item 3: delete the final sentence, or move it to section 5 as a ruling. Reason: purpose in the observation section.
9. Section 7, replace the test list with concrete bars: (a) 4/4 half, eighth, eighth: one offer, the half dotted; (b) 3/4 dotted half, quarter: one offer, the dot removed; (c) 4/4 half, quarter: no kind 1 offer, both candidates reported; (d) 3/4 four quarters: A 3:2 over quarters 0 to 2, B 4:3 over all four; (e) 4/4 three quarters, half: kind 1 offers the half as a quarter, and kind 2 offers one 3:2 run; (f) 4/4 five quarters: A 3:2 at quarter 0, B 3:2 at quarter 2, none at quarter 1; (g) 6/8 two quarters: one 2:3 run, no kind 1 offer (two candidates reported); (h) 4/4 four quarters plus a quarter under 3:2 already marked: not offered again; (i) a bar whose only fix is a grace note's length: nothing; (j) a bar with no candidate: nothing. Reason: finding 7, and each rule of A6 and A7 pinned.
10. Section 4, add the result's shape, DESK DEFAULT: `{ kind: 'note' | 'tuplet' | 'none'; note?: { index, pitch?, type, dots }; change?: { what: 'dot' | 'undot' | 'longer' | 'shorter'; to: NoteBase; dots: number }; runs?: { label: 'A' | 'B'; start; n; ratio: Ratio }[]; rejected: string[] }`, where `rejected` lists the candidates set aside and why, in plain words for the report, not for the singer. Reason: finding 10.

## Could not establish

- The recheck report, `OPEN.md` items 1 to 5 and the 15:50 words, Dann's 20:10 words and their context (set 4, 4F), `CONTRACT.md` §4, QUEUE rows 89 and 93, and the eight baselines at `9e1af16`: none is in the upload.
- Whether `VocalLineEvent` carries type, dots, tuplet, rest, or grace (`types.ts` not in upload).
- Whether `VocalLineEvent` carries beams or ties, so whether a run can be kept inside a beamed group or a tied pair can be told. Neither rule is in the brief; A7's start rule is the only guard.
- Whether a bar that states its own metre is marked on `Measure` (`triplets.ts:12-14` leaves such bars alone; `bars-to-confirm.ts:71` reads each bar against its own snapshot). A metre homr misread (Kabalevsky, `triplets.ts:16-18`) will draw offers the page refutes; the singer answers no, which the design allows.
- Whether importing from `apps/web/src/lib/omr/` into `apps/web/src/lib/score/` crosses a layering rule; `bars-to-confirm.ts:34-35` imports only the parser and `./entry`.
- Gould's Table 2 (p. 203) on the quadruplet in simple metre: not read; finding 5 is reasoning, not citation.
