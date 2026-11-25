# Fable: N.204 phase 1b, unit j

Written by the desk 2026-11-25 00:3x. Cap 180000 tokens. One agent.
Tree: `Shane` at `65196e65`, which already holds lane 88's merge.

## Read this first, in full

`docs/sessions/plan-code-audit-maintainability_r10_2026-11-24.md`, the governing
plan, sections 1, 2, 3, and the phase 1b paragraph in section 6. It is committed,
so read it from the tree. **r9 and earlier are superseded; read r10 and nothing
earlier.** Then `docs/memory/OPEN.md`, the section "WHAT ILYA DOES FOR A SINGER:
THE MODEL", which is what the code is compared against.

## The unit

apps/web/src/lib/voice/, excluding voice/engine/ and voice/chart/ which are unit i

**Every source file in it, read whole.** Dann ruled this on 2026-11-18 at 22:47
and it is never to be asked again: the read is Fable's, over all the source,
never tiered or trimmed to save a limit, because it is the last look at the code
before GUIDE and LEARN are finalized. **Why this unit now:** The VOICE pane is James's whole walk, and it is the smallest remaining unit.

## What the read returns

Per the plan's phase 1b, for this unit:

1. **Every finding**, each carrying the name it anchors to, the smell, the
   refactoring by name, its tier, the risk, and the test or baseline that would
   prove behaviour unchanged.
2. **The paragraph a developer needs** to arrive cold and work here.
3. **The hidden relationships**: what is coupled to what in ways no import shows.
4. **The comment census for these files**, against the plan's section 3 test
   (a comment curates the code for a future developer; one that curates nothing
   for a reader arriving cold comes out). Count blocks, and count comment lines
   marked for removal separately from any added.
5. **The duplication census for this unit**: every fact with two or more homes,
   named, with each home's `path:line`.
6. **The token table** for section 4a: every colour literal and `font-family`
   classified MIGRATE, NEEDS A TOKEN, or LOCAL BY RIGHT, with its reason.
7. **Behaviour defects** are tier 4 and are ranked by what a singer meets, not
   by tier. Dann widened the purpose on 2026-11-19 at 14:54 to eliminating
   errors and resolving contradictions, so a defect is in scope, not merely
   noted.

## Permissions and constraints

- **You may run code to settle a claim you cannot settle by reading.** Mark each
  such claim "ran". Both completed units did this and it is what produced real
  words for unit a's behaviour defects.
- **Create no `.bak` file.** The bridge cannot delete one.
- **Check with `ls` before naming any report path**, because lane numbers are
  not unique across subjects.
- Read-only git, always `git --no-optional-locks`. Write nothing to the tree.
  Never commit, never push.
- Every claim about the code carries a `path:line` read in THIS session.
- House style: Canadian spelling, Oxford comma, no em dashes, sentence case
  headings, no `simply`, `just`, `easy`, no exclamation marks.
- **NOT ESTABLISHED beats a complete invented answer.**

## Return

The whole read as your final message, as text. The desk files it at
`docs/sessions/read-fable-n204-unit-j_r1_2026-11-25.md`. Report your own
token count, tool uses, and elapsed minutes at the end, for the estimates table.
