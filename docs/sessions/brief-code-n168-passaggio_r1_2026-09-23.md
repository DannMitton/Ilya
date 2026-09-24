# CODE BRIEF. N.168 step 2, addendum: Mitton's passaggi

**Written by the desk 2026-09-23 19:30. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`.** Follows `brief-code-n168-frequency-run_r1_2026-09-23.md` and its memo. Same house rules: no git writes, gates before and after, Canadian spelling, no em dashes.

**NOT ESTABLISHED beats a complete invented answer.**

## The change

The frequency run reported passaggio as not assessed because the tree holds no primo or secondo for Mitton (`tools/n168-frequency-run/frequency-run.run.ts:64`). The dissertation supplies them:

- **Primo Ab3, secondo Db4.** Mitton (2020), §3.2.2, Table 3.1, printed p. 30 (Miller's lyric bass values), and §3.5, p. 35: "The range that defines the lyric bass zona di passaggio (Ab3-Db4) is overlaid on the graphs in Chapter 6."
- **Origin:** generic, from a published value for the voice category, not measured from Dann's voice. Say so in the code comment beside the values.

1. Add `passaggio: { primo: Ab3, secondo: Db4 }` to the Mitton profile in the runner, with the citation above in a comment. Godin stays without passaggi.
2. Re-run the frequency run and regenerate `out/frequency-run.md` and `.csv`.
3. Report in a short addendum at the end of `docs/sessions/memo-code-n168-frequency-run_r1_2026-09-23.md`: the passaggio dimension's shares for Mitton (inside, outside), how the top regions changed, and the per-piece zones (below, between, above) if the runner reports them.

No change to `packages/` or `apps/`. The gates should not move; confirm they did not.

## Done when

The regenerated tables show passaggio assessed for Mitton, and the memo addendum reports the shares.
