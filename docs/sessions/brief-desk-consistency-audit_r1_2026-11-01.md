# Brief: the consistency audit, how Ilya names its own parts (desk helper, measure only, r1, 2026-11-01)

Asked for by Dann 2026-11-01 11:52 and 11:55 (`docs/memory/INBOX.md`). Written by the desk (Opus). Model: Sonnet. Changes nothing in the tree. Feeds QUEUE rows 169, 170, and 171, the legend (`ARCHITECTURE.md`, `CONTRIBUTING.md`, `README.md`), and a guard test.

## Dann's rule for every recommendation, in his words

"I'm not looking for the more clever, compact design. We still need Ilya to be approachable by users who are looking at the code to understand it and improve it." (2026-11-01 11:52, spelling corrected.) A recommendation that makes the code shorter but harder to read is out. Prefer one named, documented function called from several places over a copy, and prefer a plain name over a clever one.

## Where the tree is

On Dann's Mac, through `mcp__remote-devices__device_bash` (load it with ToolSearch "select:mcp__remote-devices__device_bash" if deferred). Repository at `$HOME/mnt/ilya-rewrite`, branch `Shane`, HEAD `cab8d205`. Read only: cat, sed -n, grep, `git --no-optional-locks --no-pager grep|log|show|ls-files`. Never write with git. Write only the one report file named below. If the tool is unreachable, stop and say so in one line.

Scope: `apps/web/src`, `apps/web/static` (text files only), `apps/web/e2e`, `packages/*/src`, `scripts/`, `tests/`, the root `*.md`, `docs/house-style/`, `vercel.json`, `package.json` files. Out of scope, count only: `docs/sessions/` and `docs/memory/` (records of history; old names there are correct as history), `third_party/`, `tools/` (dated harnesses), `data/`.

## The current names (read from the tree or ruled; verify each)

| concept | English on screen | French on screen | source |
|---|---|---|---|
| the transcription document | Text | Texte | `apps/web/src/lib/i18n.ts:186` |
| the score document | Melody (RULED 2026-10-31 20:07, not yet built; today "Markup") | Chant (ruled; today « Annotation ») | `i18n.ts:197`, key `tab.markedScore` stays; QUEUE row 170 |
| the analysis document | Insights | Aperçus | `i18n.ts:201` |
| lessons | Learn | Leçons | `i18n.ts:187` |
| help | Guide | Guide | `i18n.ts:188` |

Retired or historical names to hunt (seed list; add any you find): Fit; Shane (as a name shown or as a code identifier; it is the project codename, `ARCHITECTURE.md:7`); Transcription and the Transcription tab; Transcribe (the control); Markup and « Annotation » (retiring under row 170); Metadata; Ribbon; Inspector; the drawer handle; MSR and My Sung Russian; `?reader=ilya`, Pyodide, and the old page reader (retired, QUEUE row 155); "four tabs". For each, establish from the tree whether it is still drawn, and say so with the line.

## What to produce

### A. Names census
For every concept above and every retired name: each site, by category, with `path:line`:
1. strings a singer reads (`i18n.ts` values, Svelte markup text, aria labels, page titles);
2. the Guide and Learn (`apps/web/src/lib/components/Reading/GuideContent.svelte` and the Learn components; find them);
3. the legend (`ARCHITECTURE.md`, `CONTRIBUTING.md`, `README.md`);
4. code identifiers, file and folder names (for example `apps/web/src/lib/markup/`, `MarkupPane.svelte`);
5. comments;
6. tests;
7. persisted names: localStorage and IndexedDB keys, saved song fields, i18n keys. Renaming these would orphan a singer's saved work or break a ruling ("keys unchanged", row 170). List them; recommend they stay, each with its one-line reason for the legend.
Give counts per name per category, then the full list in an appendix.
Also flag collisions: one word naming two things (for example `loupe.station.lyric` is FR « Texte », the same word as the Text document, `i18n.ts:507`; check whether it is drawn and where).

### B. The legend against the tree
Every path, file, function, folder, and claim in `ARCHITECTURE.md`, `CONTRIBUTING.md`, and README "Project Structure": exists or not, true or not, with the line read. List modules in the tree the codemap omits.

### C. Dead code and dead references (recommendations only)
1. Exports with no importer; files nothing imports; i18n keys no code reads (QUEUE row 155 left 24 `upload.*` keys unread: confirm the count); CSS classes nothing uses, where cheap to establish.
2. Comments, docs, and tests that cite a path, function, or line that no longer exists.
3. Each with a confidence: certain (grep proves no reader) or likely (dynamic access possible, say how).

### D. Duplicated logic (recommendations only)
Places that compute the same thing in two or more sites. Known leads to confirm or refute: the punctuation test (`apps/web/src/lib/boundaries.ts`, a reported dead copy in `packages/phonology/src/engine.ts` near `:1999`, `apps/web/src/lib/pipeline.ts` near `:53`, `apps/web/src/lib/score/pairings.ts` near `:222`); the Cyrillic vowel list (`apps/web/src/lib/score/vowel-resolver.ts` `CYRILLIC_VOWEL`, and any copy such as `apps/web/src/lib/omr/underlay-units.ts`). For each: the sites, whether they agree today, what depends on them agreeing, and the one shared home you recommend (readable, named, documented).

### E. Recommended order
Group the findings into briefs a Code session can build: (1) singer-facing names (with rows 169 to 171), (2) the legend rewrite with a names table, (3) code identifiers, (4) dead code, (5) shared modules. Size each in files and lines touched, from your counts.

## Rules

- Every claim carries a `path:line` read this session, or a command's output.
- NOT ESTABLISHED beats a complete invented answer.
- Do not propose French wording; flag French that needs Dann.
- Budget: stop at about 350k tokens. If you reach it, write what you have and list what remains under "Not done".

## Output

Write `$HOME/mnt/ilya-rewrite/docs/sessions/report-desk-consistency-audit_r1_2026-11-01.md`. House style: Canadian spelling, no em dashes, no exclamation marks, sentence-case headings. Sections A to E, then "Not established" and "Not done". Then reply in under 200 words: the counts per retired name in singer-facing text, the top three findings, and the file path.
