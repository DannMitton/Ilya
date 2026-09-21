# BRIEF. N.153 stage 2: one additive data channel to the loupe

Written by the desk 2026-09-20. Shape from `BRIEF-TEMPLATE.md`.
Stage 1 shipped as `0028266`. This is stage 2 and it lands on its own.

## 1. What was observed

- **Measured 2026-09-18:** the separation between a caret's hit centre and its
  neighbour's runs **1.13 px to 7.89 px at phone width, on all 17 held-able
  measures, against a 44 px floor.** A caret is not reliably tappable on a phone
  anywhere in this score. The desktop path works.
- **27 gaps on 12 of the fixture's 18 measures collide**, 18 ink-and-squircle and
  9 beam-crossing. Three passes on 2026-09-17 and 2026-09-18 relocated them
  instead of removing them.
- **Dann, 2026-09-20:** *"In Syllables mode there are no carets"*, and Corrections
  carries more generous spacing so its carets never collide.
- **Dann, 2026-09-20:** *"We already accept that the engraved measure on Paper is
  not the same as the Loupe."*

## 2. What is established, each line read this session

**The producer side, `apps/web/src/lib/shane/VoiceProfilePane.svelte`:**

- `:788-809` `scorePages` is `paginateScore(readingScore, analyzed, { ... })`.
  The five preview maps and the font are spread in conditionally, each as
  `...(x ? { x } : {})`.
- The five maps and their declarations: `ipaPreview` `:587`, `withheldIpa`
  `:621`, `cyrPreview` `:639`, `sylTypePreview` `:648`, `melismaPreview` `:659`.
- `readingScore` `:538`; `analysisScore` `:554`;
  `analyzed` `:673` is `resolveAdvice(analyzeScore(analysisScore,
  adapted.snapshot, vowelResolver))`.
- `notationFont` `:490`, passed at `:807` as
  `font: notationFont.prepared, fontFamily: notationFont.family`.
- `:853-856` the reporting effect: `void scorePages; untrack(() =>
  onpagesdrawn?.())`. **Its comment at `:838-852` states that the effect runs
  after the DOM update for that render, and that the callback must stay
  untracked or the effect loops until `effect_update_depth_exceeded`. Measured
  on the first build of that fix.**

**The consumer side:**

- `apps/web/src/routes/+page.svelte:2003-2005` `handlePagesDrawn` is a function
  declaration that does `pageRevision += 1`. **Its comment at `:1996-2002`
  states an inline arrow here is an unbounded loop.**
- `apps/web/src/routes/+page.svelte:4920` passes `onpagesdrawn={handlePagesDrawn}`.
- `apps/web/src/lib/shane/Loupe.svelte:59` `interface Props`. `revision: unknown`
  is documented there as "anything that changes when the page's SVG is rebuilt".

**The renderer side, `packages/score-parser/src`:**

- `page-layout.ts:98` `sliceScore(parsed, fromMeasure, toMeasure)`.
- `page-layout.ts:180-182` **the clef is resolved ONCE for the whole score**:
  `const renderOptions: StaffRenderOptions = { ...options, clef: options.clef ??
  chooseClef(parsed) }`, with the comment *"a slice-level heuristic could flip
  clefs between systems on a wide-range melody."*
- `page-layout.ts:126` paginate passes the SAME options the render uses,
  resolved clef included.
- `staff-renderer.ts:1818` `renderAnalyzedStaff`.

**INSTRUMENT NOTE, per CONTRACT tether 14.** The claim that
`staff-renderer.ts:2463` reads `options.ipaPreview?.[ev.id] ?? a?.vowel` is
**quoted from the comment at `VoiceProfilePane.svelte:612-615` and was NOT read
at source this session.** Confirm it before relying on it.

**LEAD, not evidence:** `docs/memory/OPEN.md:2031-2040` is the stage list, and
`../sessions/memo-n92-loupe-reengraves_r1_2026-09-18.md` §1 is Code's own plan.

## 3. Measure before you change anything, and report before writing code

1. **The clef question.** For each of the 18 measures of T05, does
   `chooseClef(sliceScore(parsed, m, m))` return the same clef as
   `chooseClef(parsed)`? Report the per-measure result as a table. **If any
   measure differs, the channel must carry the resolved clef and stage 3 must
   pass it, or the loupe draws a different clef from the page.**
2. **The reporting effect's cadence.** Record `pageRevision`'s value across one
   full transcription of T05 BEFORE the change, then after. **The number must
   match.** A new prop bundle that re-runs the effect is the
   `effect_update_depth_exceeded` loop returning by another door.
3. **Which maps are live.** For T05, report which of the five preview maps is
   non-undefined, and how many entries each carries.

**The cause of anything you find is yours to state. This brief supplies none.**

## 4. The rulings this serves

- **`OPEN.md` section THE CARET, ruled by Dann 2026-09-17:** clause 6, the
  loupe's spacing is its own and does not bind the page; clause 7, the loupe
  shows one measure and nothing else; clause 8, the loupe may exceed the page's
  width.
- **Ruled by Dann 2026-09-20** (`OPEN.md:1378-1379`): no carets in Syllables
  mode, and Corrections carries more generous spacing. **Stages 2 and 3 are what
  provide it.**
- **Clause 14 of 2026-09-18 ruled THREE loupe states with Reading as the opening
  one** (`OPEN.md:1878`, `:1886`). **It is refined by the rulings of 2026-09-20**
  (`OPEN.md:1380`): the loupe opens on Syllables and the tween runs Syllables to
  Corrections.
- **DESK DEFAULT of 2026-09-20, NOT Dann's ruling, and free for him to wave off:**
  Reading is retired, leaving two modes and two spacings. **Stage 2 is additive
  and does not depend on this**; it is recorded so stage 3 is not built against a
  third spacing by accident.

## 5. Constraints

- **Additive only.** The page's output and the print's output do not change.
- `onpagesdrawn` stays untracked; `handlePagesDrawn` stays a function
  declaration. Do not convert either to an inline arrow.
- Do not change `VocalLineEvent`, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- Do not turn `underlay-donor.ts` into the alignment engine.
- **Do not touch `loupe.ts`'s crop helpers or their tests. That is stage 4.**
- **Do not swap the clone for the render. That is stage 3.**
- No new strings and no French.
- **No agent commits and no agent stages.** Read-only git only.

## 6. Done when

`WRITTEN` on all of these:

- The bundle (`readingScore`, `analyzed`, the resolved clef, the font, and the
  five preview maps) reaches `Loupe.svelte` as a prop, assembled inside the
  existing untracked effect so it costs no new reactive surface.
- `tsc` is clean and the existing test suites pass at baseline.
- `pageRevision`'s count over one full transcription of T05 is unchanged from
  the pre-change measurement of section 3 item 2.
- The page's rendered SVG and the print output are byte-identical on T05 and on
  the print fixture (Marshak's Sonnet 90 under Kabalevsky op. 52 no. 9, two
  letter sheets).
- Nothing in `Loupe.svelte` reads the new prop yet.

`DONE` is Dann's walk. Do not report this item as done.

## 7. Report back

The commit, the results against every line of section 6, the three measurements
of section 3, and **what could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**

---

## 8. ANCHORS RE-CHECKED AT `46f1d31`, 2026-09-20 16:10, by the desk

**Five commits landed after this brief was written.** Every `path:line` in
section 2 was re-read at `46f1d31`. **Where this section and section 2 disagree,
this section wins**, per CONTRACT tether 3.

**Held, unchanged:** `VoiceProfilePane.svelte` `:490` `notationFont`, `:538`
`readingScore`, `:554` `analysisScore`, `:587` `ipaPreview`, `:621`
`withheldIpa`, `:639` `cyrPreview`, `:648` `sylTypePreview`.
`page-layout.ts:98` `sliceScore`. `page-layout.ts:182` the once-resolved clef.

**Drifted. Find each by the name, not by the old number:**

| thing | section 2 said | tree at `46f1d31` |
|---|---|---|
| `melismaPreview` declaration | `VoiceProfilePane.svelte:659` | `:661` |
| `analyzed` declaration | `VoiceProfilePane.svelte:673` | `:675` |
| `scorePages` / `paginateScore` block | `:788-809` | `:790-812`, `paginateScore(` at `:792` |
| the font spread | `:807` | `:809` |
| the reporting effect | `:853-856` | `:855-858`, its comment ends `:854` |
| `handlePagesDrawn` | `+page.svelte:2003-2005` | `:2023-2024` |
| `onpagesdrawn={handlePagesDrawn}` | `+page.svelte:4920` | `:4854` |
| `interface Props` | `Loupe.svelte:59` | `:61`; `revision: unknown` at `:87` |
| `renderAnalyzedStaff` | `staff-renderer.ts:1818` | `:1868` |

**THE INSTRUMENT NOTE IN SECTION 2 IS DISCHARGED.** The IPA read site was read at
source this session. It is `staff-renderer.ts:3205` and it is
`const ipa = marked ? '' : (options.ipaPreview?.[ev.id] ?? a?.vowel ?? '');`,
**not** the bare form the comment quoted. A second read site exists at
`staff-renderer.ts:1074`, `const ipa = options.ipaPreview?.[ev.id] ?? '';`, with
no `a?.vowel` fallback. **Section 2 knew of one site; there are two.**

**One citation to re-site, not to renumber.** Section 2's `page-layout.ts:126`
"paginate passes the SAME options the render uses" is a sentence in the doc
comment on `sliceWidth`, which now spans `:120-128`. It is a comment, not code.
The code that resolves the clef once is `page-layout.ts:182`.

**NOT ESTABLISHED:** whether the drift came from `e75d6f3`, `7bd3d04`, `b53a6df`,
`9801308` or `46f1d31`. No blame was traced, because the current numbers are what
the build needs.

---

## 9. THE WRONG PIECE WAS MEASURED. Desk error, corrected by Dann 2026-09-20 20:38

**Section 3 names T05 three times. It should say T01.** Dann: *"the fixture with 18
measures is T01, it's an easy mistake to make: we've been using both as test pieces
and they must have gotten swapped."*

**Verified against the file, not inferred:**
`apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml` has 2
`score-part` entries and 18 distinct `measure number` values, highest 18.
**T05 is a different piece**, `Kabalevsky - Shakespeare - T05 Cupid laid by his brand,
and fell.musx` (`OPEN.md:870`), and Code counted 90 measures in it.

**So all three of Code's section 3 measurements describe T05, not the fixture N.153
targets.** They are not wrong; they are about the wrong score.

**What this does NOT affect, and why stage 2 shipped anyway.** Stage 2 hands the loupe
whatever the pane already held. Nothing in the change reads a measure, a clef or a
map, so it is score-agnostic. The byte-identity line of section 6 was closed by reading
the whole diff rather than by rendering one score, so it holds for every score.

**What it DOES affect, and stage 3 owns it:**

1. **The clef question must be re-asked on T01.** Code found every T05 measure carries
   a printed F clef, so every one-measure slice agreed with the whole score. **That
   result says nothing about T01**, and the brief's own warning stands: a measure with
   no printed clef falls to the median heuristic per slice and can differ.
2. **The live-map counts must be re-taken on T01.** On T05, `withheldIpa` and
   `melismaPreview` were `undefined` and the other three carried 146 to 149 entries
   against 170 vocal events. **T01's numbers are NOT ESTABLISHED.**
3. **The `pageRevision` cadence is probably score-independent**, since it counts page
   rebuilds rather than measures. **That is a desk reading, not a measurement.**

**The lesson, and it is the desk's.** `OPEN.md` §N.153 says "the fixture", which was
correct. The brief substituted a score name for it and got the wrong one. **Name the
fixture by its file path, not by a piece label that two scores can answer to.**
