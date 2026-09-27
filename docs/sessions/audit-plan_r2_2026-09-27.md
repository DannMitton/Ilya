# The architecture audit: plan, draft r2, 2026-09-27

**A dated draft, not a ruling.** r2 adds where each phase stands and a proposed finish line
for phase 4 (DESK DEFAULT, Dann's to change). r1 follows unchanged below it.

## Where each phase stands, 2026-09-27 at `f5d0dd4`

| phase | state |
|---|---|
| 0. Baseline | done, branch `audit`, merged |
| 1. Safety net | done, merged |
| 2. Guardrails | done, merged; N.174 added check 4 (the six modules) to `scripts/ratchets.mjs` |
| 3. The map | `ARCHITECTURE.md` draft r1, kept current by N.174. Dann's read of it is owed |
| 4. The refactor | not started. Cut 1 is ready: `brief-code-audit-correction-station_r2_2026-09-27.md` |
| 5. Independent check and walk | not started |

N.174 (the code says Text, Markup, and Insights; closed 2026-09-27) was not a phase, but it
gave phase 4 its destinations: extracted code lands in one of the six modules or in
`lib/components/`, and the ratchet holds the boundary. Every phase 4 slice is also checked
by the 84-capture screenshot compare (`../memory/ENVIRONMENT.md` §`SCREENSHOT COMPARE`).

## Phase 4's finish line, proposed (DESK DEFAULT)

The cut list is `page-cutlist_r1_2026-09-27.md` (Sonnet, read-only, checked by the desk
where cited here). Its figures are estimates, and it says so.

1. **`+page.svelte`: the seven cuts ship**, in the list's order: the Correction Station, the
   song library, the loupe and dock, tab and reading navigation, the calibration shell, the
   drawer's content snippets, and the text-arrival pipeline (split in two first; the list
   rates it highest risk). That takes the script from 4,369 lines to about 2,000.
2. **An eighth slice, the style pass:** each extracted component already takes the style
   rules it owns; this slice sorts what remains of the 968-line `<style>` block into
   page-global (the app shell, print) and component-owned, and moves the second kind. Its
   target is set from what it finds. Without it the whole file ends near 3,350 lines, so
   **"the whole file below 2,000" is not a promise this plan can make yet** (the desk said
   it could on 2026-09-27 07:04; the cut list showed otherwise).
3. **Then `staff-renderer.ts` (3,534 lines) and `Loupe.svelte` (3,054)**: each gets its own
   read-only cut list first, and its target comes from that list.
4. **Every cut:** one commit, every gate green, the ceiling in `scripts/ratchets.json`
   lowered to the new count, the 84 captures unchanged.

Phase 4 is done when items 1 to 3 are done. By count that is nine slices for
`+page.svelte` and two cut lists before the other two files are sized: a range, not a
measurement.

---

# The architecture audit: plan, draft r1, 2026-09-26

**A dated draft, not a ruling.** Written by the desk from the conversation of
2026-09-26 00:13 to 00:31. It expands and contracts as the audit learns.

## The goal, in Dann's words

*"The goal is to release stable code with a clear documented architecture that
can be easily, predictably accessed by future collaborators."* (2026-09-26 00:21)

## Rulings that shape it

- 2026-10-30 is a target, not a wall (`../memory/SCHEDULE.md`, amended 2026-09-26 00:21).
- Option 3, who writes the code (`../memory/CONTRACT.md` §5, 2026-09-26 00:25):
  subagents in the desk's cloud workspace write tests, guardrails, and documents
  on branch `audit`; Code writes the hotspot refactors on Dann's machine.
- Feature work continues (`../memory/CONTRACT.md` §5, 2026-09-26 00:31).

## The phases

0. **Baseline.** Every gate's number, a hotspot table (churn times complexity),
   a map of which singer paths the end-to-end tests cover, and an inventory of
   existing architecture documents checked against the tree.
1. **Safety net.** Approval (characterization) tests around the top hotspots;
   end-to-end tests for any uncovered singer path.
2. **Guardrails.** Ratchets in CI: file-size ceilings, dependency rules,
   unused-code detection, and the svelte-check baseline allowed only to fall.
3. **The map.** One short `ARCHITECTURE.md` in matklad's shape, gathered and
   corrected from `README.md`, `AGENTS.md`, `CONTRACT.md` §6, `PRODUCT.md`, and
   the project maps; the others point to it.
4. **Refactor.** Hotspots first, `+page.svelte` first, one extraction per commit,
   gates green after each, by Code.
5. **Independent check.** A fresh agent audits the code against the map; Dann walks.

## Measured on 2026-09-26 in the cloud clone at `b7c2fc6`

- svelte-check: 0 errors, 12 warnings. CI allows 23 (`.github/workflows/ci.yml`).
- Tests: packages 1,194 passed (5 skipped); `apps/web` 1,466 passed, 1 failed:
  `insights.test.ts:388`, "reads real watch-list output and says nothing when
  nothing fired". Whether it fails on Dann's machine: NOT ESTABLISHED.
- Build: passes.
- Push from the cloud: refused until the Claude GitHub App has the repository.

## Sources

matklad, ARCHITECTURE.md (2021); understandlegacycode.com on hotspots, on
Feathers, and on approval tests; knip.dev; dependency-cruiser rules reference
and FAQ; svelte.dev best practices. Links in the conversation of 2026-09-26.
