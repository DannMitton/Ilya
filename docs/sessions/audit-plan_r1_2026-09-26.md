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
