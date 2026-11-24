# Brief: N.204 step 4, unit e (the Loupe and Corrections), r1

Written by the desk (Opus 5), 2026-11-24 02:0x, under `plan-code-audit-maintainability_r9_2026-11-23.md` (md5 `6d0cd1e1`), which GOVERNS. Do not redesign its ten steps.

## What you are doing

One judgement read of unit e. **Every file below is read WHOLE.** This is the project's last look at the code before its GUIDE and LEARN are finalized, so the read is judged by thoroughness and never by what it costs (Dann's ruling, `docs/memory/OPEN.md`, "N.204: FABLE READS ALL THE CODE").

**You change nothing.** No file is edited, no branch is cut, no gate is run, nothing is committed. You read, and you return one report.

## The unit: 37 files, 11696 lines, all under `apps/web/src/lib/score/`

CorrectionSurface.svelte, GraceCells.svelte, Loupe.svelte, LoupeHeader.svelte, LoupePlacementRow.svelte,
LoupePrintStrip.svelte, LoupeSyllables.svelte, correction-cursor.svelte.ts, correction-keys.ts, correction-verbs.svelte.ts,
correction.ts, entry-marks.ts, entry.ts, grace-layer.ts, grace-verbs.ts, loupe-edge.ts, loupe-fit.svelte.ts, loupe-fit.ts,
loupe-hold.ts, loupe-ink.ts, loupe-panel.svelte.ts, loupe-place.svelte.ts, loupe-print-wiring.ts, loupe-print.svelte.ts,
loupe-render-bundle.ts, loupe-render.ts, loupe-swipe.svelte.ts, loupe-tween.svelte.ts, loupe.ts, notation-fonts.ts,
press-and-hold.ts, selection-ring.ts, stop-ring.ts, tuplet-row.svelte.ts, undo-history.svelte.ts, undo-wiring.svelte.ts,
value-name.ts

**Read every one of them whole.** If you cannot, say which and why under "What I could not establish". Paths are relative to `apps/web/src/lib/score/` in the repository at `~/Desktop/ilya-rewrite` on the Mac, reachable through the bridge (`device_bash`, `device_list_dir`). The tree is at `Shane` `50315f2e`. **Read the tests of these files too where a test settles what a function is for; the tests are unit `t` and are not yours to audit.**

## What a unit read returns (plan section 5b)

**Per finding:** the name it anchors to, the smell, the refactoring by name (Fowler), its tier, the risk, and the test or baseline that would prove behaviour unchanged.

**The four tiers (plan section 3).** Tier 1: proven-dead code, comments, renames inside a file. Tier 2: moves across modules. Tier 3: splitting a ratcheted hotspot. Tier 4: behaviour defects, which are NOT refactoring and each of which gets its own lane and a line saying what a singer reads differently.

**Also, and these are not optional:**

1. **The paragraph a developer needs** about this unit: what it is for, in a musician's terms before the code's.
2. **The hidden relationships**: what depends on what without an import saying so. Name each one and how you established it.
3. **The comment census** for your files against the test ruled by Dann 2026-11-19 15:00: does this comment curate the code for a future developer? A comment that curates nothing for a reader arriving cold comes out. **A comment carrying one of Dann's rulings STAYS, with its date and words.**
4. **The colour-literal census** (plan section 4a). One table, every colour literal and every hard-coded `font-family` in your files, each in exactly one class: MIGRATE (a token already holds this value; give the token), NEEDS A TOKEN (thematic but unnamed; propose a name inside the five existing hue families, never a sixth), LOCAL BY RIGHT (not thematic; **carry its reason**, a literal with no reason is not in this class). **Re-run `docs/sessions/census-colour-tokens.mjs` rather than trusting any figure written down.** The rule it must not break: a hue names one idea (`apps/web/src/app.css:33-41`).
5. **Your contribution to the duplication census**: every fact in your files that has more than one home. **The desk established on 2026-11-24 that the census undercounts, because each unit counted inside itself: `gcd` has ten homes tree-wide, not four, and the Cyrillic vowel class has eight, not five. So count tree-wide, not inside your unit.**

## What is fixed and is not yours to change (plan section 4)

`VocalLineEvent`; anything under `score/reconciliation/` (unit f reads its three files for context and proposes nothing for them); `analyzePerVerse`; `underlay-donor.ts` is never made the alignment engine; no second silent save site; nothing derived is stored. **DESK DEFAULTS, not Dann's rulings:** no stored-format change, no i18n key deleted, no ratchet ceiling raised.

**ONE VOWEL PER NOTE governs every path this unit touches** (`docs/memory/CONTRACT.md` section 0.1): a note takes exactly one vowel, no more and no less; a vowelless token is a clitic fused to its host; «й» is a consonant. A finding that would let any path write a syllable without a vowel, or with two, is a BLOCKER and is reported as one.

## How to work

- **You may run code to settle a claim you cannot settle by reading.** Copy to `/tmp` inside the bridge VM, run it, delete the copy. Write nothing into the repository. **Mark every claim that rests on a run with the word "ran".**
- **Every claim about the code carries a `path:line` you read this session.** No other form, except the words NOT ESTABLISHED.
- **Create no `.bak` file**: the bridge cannot delete one.
- **Run `ls` on `docs/sessions/` before you name your report**, because revision and lane numbers are not unique across subjects.
- **Spawn no subagents of your own.** Publish no artifact.
- **Cap: 650,000 tokens.** Report your own spend at the end.

## The report

`docs/sessions/read-fable-n204-unit-e_r1_2026-11-24.md` on the Mac, written through the bridge. Sections: the developer's paragraph; the findings; the hidden relationships; the comment census; the colour-literal census; the duplication contributions; your token spend; and a section headed "What I could not establish".

**NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks. Write for a musician who is not a programmer: say what a finding costs or gains a singer, and put the mechanism in the body rather than the heading.
