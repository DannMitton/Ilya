# BRIEF. N.153 stage 5: the whole-fixture scan. r1, 2026-09-21

**For Claude Code, on Dann's machine.** Stage 4 closed on 2026-09-21 as
"knowingly keep": three symbols have no production caller and are retained for
the proofs they carry. Stage 5 is the last stage of N.153.

## 1. What was observed

- `OPEN.md` §N.153, stage 5, verbatim: "Re-run the whole-fixture scan over all 18
  measures as the acceptance test, plus real-click verification of note, rest and
  caret tap resolution."
- `OPEN.md` §THE CARET clause 13, measured 2026-09-18: "the floor is reached on
  NONE of the 17 measures. The separation runs 1.13 px to 7.89 px against a 44 px
  floor... **So a caret is not reliably tappable on a phone anywhere in this
  score.**"

## 2. What is established, each line read by the desk on 2026-09-21

**The measurement already exists inside the running loupe. Stage 5 drives it and
collects it; it does not invent it.**

- `worstSeparation` (`Loupe.svelte:701-707`) answers the smallest gap between
  neighbouring caret centres in native units.
- `offendingPairs` (`Loupe.svelte:709-718`) names every pair under
  `TAP_FLOOR_PX`, in CSS pixels, by the gaps' own ids.
- The spacing loop (`Loupe.svelte:2198-2222`) renders, measures, and widens. It
  logs one `console.debug` line per measure at `:2208`, carrying `minGap`,
  iterations, elapsed ms and worst px, and a `console.warn` at `:2218` carrying
  the offending pairs whenever the result is unconverged or still under the floor.
- The search is `deriveMinGap` (`loupe-render.ts:119`): bisection, budget
  `MAX_SPACING_RENDERS` = 14 (`:107`), `CEILING_FACTOR` = 4 (`:105`),
  `MIN_GAP_RESOLUTION` = 0.5 (`:103`).
- The result is cached on a key carrying the measure, whether the surface is a
  phone, `unitPx`, the positions' length, and a fingerprint of the render
  (`Loupe.svelte:2199`). **The key includes the phone flag, so a desktop run and a
  phone run do not share an answer.**
- `TAP_FLOOR_PX` = 44 (`loupe-render.ts:72`).
- **The scan cannot be a unit test.** The loop measures a mounted element, and
  `loupe-render.ts:5-8` states that `getBBox` on a detached element answers all
  zeros.
- Playwright is installed and configured: `apps/web/playwright.config.ts`,
  `testDir: './e2e'`, `workers: 1`, `timeout: 60_000`, `baseURL:
  http://localhost:5173`, `webServer: pnpm dev`, and exactly one project, named
  `chromium`, using `devices['Desktop Chrome']`.
- **That config has no phone project.** Clause 13's floor is defined at phone
  width, so a scan on the existing project would measure the case that already
  works.
- One spec exists, `apps/web/e2e/core-loop.test.ts`, 10,503 bytes. **NOT READ by
  the desk.**
- The engraved fixture `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`
  holds 18 measures, asserted at `loupe-render.test.ts:95`.

**Leads, not evidence:** `docs/memory/STATE.md`, `docs/memory/OPEN.md`, and
`docs/sessions/memo-n92-caret-collision_r1_2026-09-17.md`. Where one disagrees
with the tree, the tree wins. In particular, N.156 records that a Sunless 01
fixture is missing its final syllable and a note; **which fixture stage 5 scans,
and whether N.156 touches it, is NOT ESTABLISHED by the desk.**

## 3. Measure before you change anything

Report these before writing the scan:

1. Read `apps/web/e2e/core-loop.test.ts` in full. Does it already raise the
   loupe, and at what viewport? Say whether the scan extends it or stands alone.
2. Establish whether the two console lines at `Loupe.svelte:2208` and `:2218`
   carry everything the scan needs, or whether the page must surface the numbers
   another way. **If another way is needed, say so and propose it before building
   it.**
3. Establish which fixture the scan should load, and whether N.156's defect
   affects it.
4. State the phone viewport you will run at, and where that number comes from.

**The reason for any result is yours to find and state. The desk has supplied
none.**

## 4. The rulings this serves

- **Clause 13, asked for by Dann 2026-09-18**, quoted from `OPEN.md` §THE CARET:
  "**Tap separation floor: 44 CSS pixels between a caret's hit centre and its
  neighbour's, measured at phone width.** DESK DEFAULT, reversible, and it is the
  number his reasoning actually names." Drawn clearance in the same clause: 1.2
  line-gaps becomes **1.6**, also a DESK DEFAULT.
- **Clause 13, same date:** "Where the floor cannot be reached, it is reported,
  never quietly shrunk." **The scan reports. It never adjusts anything to pass.**
- Nothing amending clause 13 was found this session.

**NOT ESTABLISHED, and it is the brief's one open definition.** Stage 5's
done-when says "zero violations of **the five rules**". No definition by that name
exists in `OPEN.md`; §THE CARET carries fourteen numbered clauses, and §N.153
lists four bullets of rulings it serves. **The desk proposes these five as a DESK
DEFAULT, and Dann may correct the set:**

1. No adjacent pair of caret hit centres stands nearer than 44 CSS px at phone
   width (clause 13).
2. No caret stands nearer than 1.6 line-gaps to the squircle's stroke (clause 13,
   which raised clause 4's 1.2).
3. No mark from an adjacent measure is drawn, at either end (clause 7).
4. No opening barline is drawn (clause 11).
5. Every caret stands in the middle of the space it names, and touches nothing
   (clause 1 and the position rule, as §N.153 cites them). **THE BEAM IS THE ONE
   EXCEPTION, RULED BY DANN 2026-09-21 on the desk's recommendation**, now
   `OPEN.md` §THE CARET clause 15. His words: *"The beam is the one exception I
   can think of. Carets must intersect it, there's no other option."* So a beam
   is not "something" here. Noteheads, stems, accidentals, and the squircle
   still are. **Beam contacts are reported as their own named row, counted and
   visible, and never folded into the violations.**

**Build the scan so each rule is a separate, named assertion**, so that correcting
the set later changes which assertions run and not how the scan works.

## 5. Constraints

- **The scan measures. It does not fix.** Do not change the loupe's drawing, its
  spacing, or `deriveMinGap` to make a measure pass. A measure that cannot reach
  the floor is a reported row, per clause 13.
- Do not change `VocalLineEvent`, and do not touch
  `apps/web/src/lib/shane/reconciliation/`.
- Adding a phone project to `playwright.config.ts` is in scope. Changing the
  existing `chromium` project is not.
- Out of scope: N.156's fixture repair, and any change to the caret's drawn
  values.
- **WHAT THIS DISPLACES:** nothing in week 2, which closed on 2026-09-21. It takes
  time from week 3, which already carries N.132 and N.141's last step, both pushed
  out of week 2. Sequencing is the desk's; say whether the trade looks wrong from
  the code's side and nothing further.

## 6. Done when

- One command runs the scan over **all 18 measures at phone width**, and the memo
  states that command.
- Per measure, the scan reports: derived `minGap`, iterations, whether it
  converged, worst separation in CSS pixels, and every offending pair by id.
- Each of the five rules is a separately named assertion, and the report says
  which measures violate which rule.
- **Real-click verification** of note, rest and caret tap resolution, on at least
  one measure that converged and one that did not.
- The page and the print are untouched: the existing suites stay at their
  baseline.
- `WRITTEN` on the code. **`DONE` is Dann's walk**, and the desk asks for it.

## 7. Report back

The commit, the per-measure table, the results against section 6, and **what could
not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
