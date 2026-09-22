# BRIEF. N.153 stage 4: what retires with the crop. r1, 2026-09-21

**READ-ONLY. You write no code, no tests, and no files in the tree. You return a
memo.**

## 1. What was observed

- `OPEN.md` §N.153, stage 4, verbatim: "Retire or knowingly keep `loupe.ts`'s
  crop helpers and their tests, as its own decision. Roughly a dozen exported
  functions and a 781-line test file exist to slice one shared coordinate space,
  and mostly retire with the crop."
- Dann's instruction to the desk, 2026-09-21 20:28: read the actual files;
  a summary must not substitute for the source. **That instruction is passed to
  you and it governs this brief.**

## 2. What is established, each line read by the desk on 2026-09-21

- `apps/web/src/lib/shane/loupe.ts` is 886 lines.
- `apps/web/src/lib/shane/Loupe.svelte` is 3,039 lines. It imports 21 crop-path
  symbols from `loupe.ts` at `Loupe.svelte:32-59`, and every one of the 21 is
  still referenced in its body.
- `cloneNode` does not appear anywhere in `Loupe.svelte`.
- The one-measure render path is live: `renderLoupeMeasure`
  (`loupe-render.ts:79`) is called at `Loupe.svelte:783` and `:2198`, and
  `deriveMinGap` (`loupe-render.ts:119`) at `Loupe.svelte:2203`.
- Two `loupe.ts` exports have no reference anywhere in `apps/web/src` outside
  `loupe.ts`, `loupe.test.ts` and `loupe-render.test.ts`: `SWIPE_DISMISS_PX`
  (`loupe.ts:190`) and the `METER_RUN_IN_SP` re-export (`loupe.ts:369`, imported
  from `@ilya/score-parser` at `loupe.ts:15`).
- `loupe-render.ts:152-156`, its own doc comment: `renderLoupeSystem`
  (`loupe-render.ts:170`) is "no longer called by `Loupe.svelte` since stage 3b
  and kept because `loupe-render.test.ts` proves with it that a slice renders as
  the page drew it... **Stage 4 decides whether it goes.**"
- `loupe-render.test.ts` is 165 lines: stage 3a system equivalence at 64 page
  widths (`:49-89`), stage 3b one-measure rendering and monotonicity (`:91-129`),
  and five unit cases for the bisection (`:131-165`). **It contains no caret-gap
  scan and no click resolution.**
- `loupe.test.ts` is 781 lines. Every one of the 21 symbols has cases in it
  except `openAfterPageMeter`, which has none.

**NOT READ by the desk, and you must not treat it as read:** the body of
`Loupe.svelte` beyond the import block and the six lines cited above, the body of
`loupe.ts` beyond its export signatures, and `loupe.test.ts`.

**Leads, not evidence, and labelled as leads:** `docs/memory/STATE.md`,
`docs/memory/OPEN.md` §N.153, and
`docs/sessions/memo-n92-loupe-reengraves_r1_2026-09-18.md`. Cite none of them as
fact. Where one disagrees with the tree, the tree wins.

## 3. Measure before you change anything

**Read `Loupe.svelte` in full, `loupe.ts` in full, and `loupe.test.ts` in full.**
Do not classify a symbol from a grep count or from a summary. A verdict written
without having read the use site is the failure this brief exists to prevent.

For each of the 21 imported symbols, plus `renderLoupeSystem`,
`SWIPE_DISMISS_PX` and `METER_RUN_IN_SP`, establish:

1. Every reference, with `path:line`.
2. Which path each reference serves: the live one-measure render, the retired
   page-crop, or both.
3. Whether the symbol survives the crop's removal, and why, in one clause.

Then, for `loupe.test.ts`, which `describe` and `it` blocks exercise only code
you have marked RETIRE.

**The reason any symbol survives is yours to find and state. The desk has not
supplied one and you must not infer one from this brief.**

## 4. The rulings this serves

- **N.153 was numbered by Dann 2026-09-18.** Stage 4's wording is quoted in
  section 1 from `OPEN.md` §N.153.
- `OPEN.md` §N.153 lists the caret clauses N.153 serves, including clause 6, that
  the loupe's spacing is its own and does not bind the page. **The desk has not
  opened §THE CARET itself this session, so treat that as a lead and open it if a
  verdict turns on it.**
- Nothing amending stage 4's wording was found this session.

## 5. Constraints

- **READ-ONLY.** No edits, no new files, no test runs that write. No git at all,
  not even read-only git.
- Do not change or propose changes to `VocalLineEvent`, and do not touch
  `apps/web/src/lib/shane/reconciliation/`.
- Out of scope: stage 5's whole-fixture scan, any opinion about the GUI, and any
  recommendation about what to build next.
- **WHAT THIS DISPLACES:** nothing in week 2, which closed on 2026-09-21. It takes
  time from week 3, which already carries N.132 and N.141's last step, both pushed
  out of week 2. Sequencing is the desk's; you may say whether the trade looks
  wrong from the code's side, and nothing further.

## 6. Done when

A memo carrying one table, one row per symbol:

| symbol | defined | every reference (`path:line`) | verdict | evidence, one clause |

Verdicts are `RETIRE`, `KEEP`, or `SHARED`. **Every `RETIRE` row names the grep
that checks it.** A second table does the same for `loupe.test.ts`'s blocks.

## 7. Report back

The table, the results against section 6, and **what could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
