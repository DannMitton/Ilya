# Fable's review of the row 125 brief, r1

Reviewed by Fable (subagent of the desk) 2026-10-19 22:3x, against `cloud-lane-11` at `f93b9e5` in the desk's workspace, read only. 126,017 tokens against a stated worst case of 200k. Verdict and amendments verbatim below; all six applied in r2 (`brief-code-row125-wordless-banner-clause_r2_2026-10-19.md`). Amendment 4's choice taken by the desk (DESK DEFAULT 22:3x): the one comment line in `i18n.ts`. The untracked `apps/web/walk-n188.mjs` it found was the desk's own walk script in the desk's clone, not on the branch; removed.

**SEND WITH AMENDMENTS**

The four strings match the ratified file code point for code point (U+2019 in both « d’une », no U+00A0, no double spaces). Every cited file, line, key, test name, and function holds at `f93b9e5`. The new strings pass every string-wide check: `i18n.test.ts:104-116` `faults` (no `;?!:«»` in the new clause, so nothing to flag, and the floor counts at `:162-166` are unchanged since the old clause had none either); `french-italics.test.ts:26,51,78` (no Italian term, no asterisk); `no-fit-name.test.ts:25,54` (no `Fit`); `no-lyrics-notice.test.ts:92-106` (no "not in a picture", no `%s`); `approval/i18n-keys.test.ts:47` (keys unchanged). No code, test, Guide, or Learn prose quotes the old second sentence outside `i18n.ts:1405,1409` and the two pinned tests. The `+page.svelte` and `witness-lines.ts` citations are accurate. The gate numbers match row 123's report.

1. **Forbid creating the ratified file on the branch.** The brief cites `docs/sessions/ratified-wordless-banner_2026-10-19.md` and says it is not on the branch; Code could reasonably write it from the brief's text. Ratified files reach the tree in Dann's desk-close commits (`d3adabe`, `50a5f85`), not from the lane. Add to "The lane": "Do not create the ratified file or any other new file under `docs/sessions/`; the report is the only new file there."

2. **Say what to do if row 126 breaks a neighbouring test.** `no-lyrics-notice.test.ts:37-60` (row 121's block) feeds the real `MusicXmlScoreParser` from `@ilya/score-parser` with `omr/fixtures/tch-1.musicxml`, and row 126 touches that package. Add to "Tests and the done state": "If any test other than 1a and 1b fails on the branch after row 126, stop, do not repair it, and record it under 'Could not establish'."

3. **Forbid edits to history and merges into the lane.** `docs/sessions/brief-code-row95-the-words-on-a-scan_r1_2026-10-14.md:14-18` quotes the old strings; a diligent agent might "update" it. Add: "Edit no existing file under `docs/sessions/`. Do not merge or rebase `Shane` or `main` into the lane" (row 123's report records the convention, `report-code-row123_r1_2026-10-19.md:3`).

4. **Decide where the row 125 provenance lives in `i18n.ts`.** `:1403-1404` dates both strings to row 95 (2026-10-14 16:36), and the brief says "Nothing else in `i18n.ts` changes." Recommendation: allow one comment line after `:1404`: "Row 125 (ratified by Dann 2026-10-19 22:25): second sentence true before and after words arrive." Cost of leaving it: the file's own comment misdates the words. If the desk prefers the test as the only record, say so in one clause so Code does not add the line unbidden.

5. **Name the commit subject.** The lane's commits read `Row 123: the Guide says why a rest keeps a word's sound`. Add: "Commit subject: `Row 125: the wordless banner stops claiming text nobody added`."

6. **Tighten "lands in Lyrics anyway".** `lyricsTakesPoem` (`witness-lines.ts:153-155`) requires Lyrics empty, no placements, and a non-empty poem; `:2428` also requires `how === 'paste'`, a wordless score, and `ingestedScore !== null`. Replace "lands in Lyrics anyway" with "lands in Lyrics when Lyrics is empty and nothing is seated yet". Code writes the report's narrative from this paragraph.

**For the desk, not this brief**

- `i18n.ts:1443` cites `upload.banner.noLyrics, :511`, a stale line number.
- `upload.banner.reader` (`i18n.ts:1058`) still says "type them into the Input field" / « le champ Entrée » after N.135 gave Input two views; owed under row 103, confirmed at `QUEUE.md:38`.
- `apps/web/walk-n188.mjs` sits untracked in the clone and checks only the first sentences (`:23-24`), which do not change.
- `no-lyrics-notice.test.ts:9-11` header will say "ratified 2026-10-14" over strings ratified 2026-10-19; the one-line comment the brief asks for covers it.

**Could not establish**

- web-test and score-parser baselines after row 126 (row 123 reported 2849 and 744 passed, 5 skipped, before row 126).
- What row 126 changes; whether it alters `tch-1.musicxml` parsing or the `homr` origin detection the row 121 tests depend on.
- Whether `/tmp/briefs` exists in the cloud session; the brief assumes it.
- Nothing was built or run; all checks were by reading and by `python3 -I` on the four strings.
