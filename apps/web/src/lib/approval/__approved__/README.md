# Approved output (apps/web)

These files are the approved, byte-for-byte golden masters for
`apps/web/src/lib/approval/*.approval.test.ts`: the exact SVG
`renderAnalyzedStaff` produces for the real, committed
`sunless-01-engraved.musicxml` fixture, and the exact IPA `processText`
produces (with the real dictionary loaded) for a corpus of public-domain
Russian art-song lines.

A diff in either file on a normal `pnpm test` run means the corresponding
code's output changed, not that the change is wrong; a human reviews the
diff and decides. `ipa-corpus.txt` also carries the loaded dictionary's
entry count as its first line: a drop there means a partial dictionary
loaded, which should fail review even if every IPA line still matches.

Re-approve only when the change is intended and reviewed, by running
`vitest -u` (or `pnpm --filter @ilya/web test -- -u`) from `apps/web` and
committing the updated files here alongside the code change that caused
them.
