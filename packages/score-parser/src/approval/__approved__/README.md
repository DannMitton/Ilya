# Approved output (score-parser)

These files are the approved, byte-for-byte golden masters for
`packages/score-parser/src/approval/*.approval.test.ts`: the exact SVG
`renderAnalyzedStaff` produces for the shared demo fixture, and the exact
`ParsedScore` JSON `MusicXmlScoreParser` and `MnxScoreParser` produce for
their respective fixtures (syllable ids normalized; see each test file's
header).

A diff in any of these files on a normal `pnpm test` run means the
corresponding code's output changed, not that the change is wrong; a
human reviews the diff and decides.

Re-approve only when the change is intended and reviewed, by running
`vitest -u` (or `pnpm --filter @ilya/score-parser test -- -u`) from this
package and committing the updated files here alongside the code change
that caused them.
