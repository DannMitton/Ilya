# Brief: Fable reads cloud lane 87 as built, r1

Written by the desk (Opus 5), 2026-11-24 02:1x. `CONTRACT.md` section 1 item 19, widened by Dann 2026-10-27 14:29: anything tried gets a Fable review. This lane is built and pushed and is NOT merged. Dann merges after your verdict.

## What you are reading

Branch `cloud-lane-87`, three commits on top of `Shane` `50315f2e`:

- `07fc9c0b` item 1, the VOIX comment at `apps/web/src/lib/i18n.ts:158`.
- `21f8b319` item 2, the two ratified GUIDE resonance paragraphs seated in `apps/web/src/lib/components/Reading/GuideContent.svelte`, with six pins in `apps/web/src/lib/insights/ratified-lines.test.ts`.
- `594de275` item 3, `placeholder.line.belowCore` and `.belowCoreOne` at `i18n.ts:2051-2052`, and their pins at `lane68-strings.test.ts:16-19`.
- `a2642dde` the lane's own report, `docs/sessions/report-code-dash-voix-and-guide-seating_r1_2026-11-24.md`.

**Its brief is `docs/sessions/brief-code-dash-voix-and-guide-seating_r4_2026-11-24.md` (md5 `138e078d`), committed at `50315f2e`.** Read the brief first, then the lane, then the report. The ratified text the lane seated is `docs/sessions/draft-french-guide-resonance_r2_2026-11-23.md`, and it is the authority for item 2, not the brief.

**Reach the branch however you can read it** (`git ls-remote`, a shallow clone of that branch into your own scratch, or the bridge). **Write nothing into `~/Desktop/ilya-rewrite` except your report.** Do not merge, do not push, do not run the ship script.

## Your verdict, one of three

**MERGE**, **MERGE WITH FIXES** (list them; the desk applies them before the merge), or **DO NOT MERGE** (name each blocker).

## What to check, and nothing is assumed because the report says it

1. **The four passages equal the ratified draft**, in both languages, after the apostrophe rule (U+2019 throughout) and the italic *Ilya*. Compare character by character, not by eye. The draft is the authority; where the lane's text and the draft differ, that is a blocker.
2. **The placement of each paragraph**, against the neighbours the lane names. Paragraph 1 after the typed-values paragraph under `guide-markup-characteristics` and before the notation-conventions heading, in both languages. Paragraph 2 inside Licences, after Scholarship and before Dictionary data, in both languages. **The desk confirmed independently on 2026-11-24 that Scholarship (`GuideContent.svelte:602` English, `:296` French) is the paragraph that names the methods, so the lane's inference is sound; confirm the seating itself.**
3. **No `h4` and no drawer change.** `Drawer.svelte` untouched and still at 1,986 lines; no `toc.guide.*` key added; no new contents entry. A heading seated here would ship a contents entry missing in one language.
4. **Item 3 changed only the two keys named**, and nothing at `i18n.ts:2048`, `:2049`, `:2056-2059`. **The MELODY twins at `:2058-2059` must still read DRAWER and TIROIR**: the desk has ruled they follow in a later lane, not this one.
5. **The pins actually pin.** Six new tests in `ratified-lines.test.ts` that would fail if the text drifted, and the `INS_EN`/`INS_FR` change in `lane68-strings.test.ts` that leaves the two MELODY pins asserting the old phrase.
6. **Nothing forbidden.** No approval or golden file changed, no `.bak`, nothing under `docs/memory/`, no ratchet ceiling raised, no squircle, dash, or placeholder drawing touched.
7. **The comment at item 1 states a fact.** Dann ratified « VOIX » on 2026-11-23 at 22:10 (`docs/memory/INBOX.md`, the 22:10 entry, verified by the desk 2026-11-24). Check the comment says that and claims nothing more.

## The gate figures, which the lane could not settle and you are not asked to re-run

The lane reports gate 4 at `6806 passed | 5 skipped (6811)` in a Linux sandbox, against the Mac floor of `6804 passed | 1 skipped (6805)`. **The desk reconciles it as arithmetic:** six tests added by item 2 (6811 minus 6805), and four that skip in Linux and run on the Mac. Dann's ship run settles it. Say if that reconciliation is wrong; do not run the suites.

## The one thing nobody has done

**Nobody has looked at the two new paragraphs rendered.** There is no preview build for a lane branch, so the look comes after the merge and it is the desk's. Note it; do not try to build.

## Cost and conduct

**Cap 300,000 tokens.** Spawn no subagents. Publish no artifact. Create no `.bak` file. Run `ls` on `docs/sessions/` before naming your report. Every claim about the code carries a `path:line` you read this session.

**NOT ESTABLISHED beats a complete invented answer.**

Report at `docs/sessions/review-fable-lane87-as-built_r1_2026-11-24.md`.

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
