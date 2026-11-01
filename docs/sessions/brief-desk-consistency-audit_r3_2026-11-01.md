# Brief: the consistency audit, how Ilya names its own parts (desk helper, measure only, r3, 2026-11-01)

r3 applies the eight amendments of Fable's review (`review-fable-plan-consistency_r1_2026-11-01.md`, "Amendments to the audit brief") and Dann's rulings of 12:16 and 12:19. r2 added section A2 (Dann 11:58). r1 and r2 beside it.

Asked for by Dann 2026-11-01 11:52 and 11:55 (`docs/memory/INBOX.md`). Written by the desk (Opus). Model: Sonnet. Changes nothing in the tree. Feeds QUEUE rows 169, 170, and 171, the legend (`ARCHITECTURE.md`, `CONTRIBUTING.md`, `README.md`), and a guard test.

## Dann's rule for every recommendation, in his words

"I'm not looking for the more clever, compact design. We still need Ilya to be approachable by users who are looking at the code to understand it and improve it." (2026-11-01 11:52, spelling corrected.) A recommendation that makes the code shorter but harder to read is out. Prefer one named, documented function called from several places over a copy, and prefer a plain name over a clever one.

## Where the tree is

On Dann's Mac, through `mcp__remote-devices__device_bash` (load it with ToolSearch "select:mcp__remote-devices__device_bash" if deferred). Repository at `$HOME/mnt/ilya-rewrite`, branch `Shane`, HEAD `cab8d205`. Read only: `cat`, `sed -n`, `grep`, and `git --no-optional-locks --no-pager grep|log|show|ls-files`. Never write with git. Each `device_bash` call costs several seconds and returns at most 180 s of work, so batch: one call per section, a shell loop over a name list, output written to a scratch file in the session home (`$HOME/audit-A.txt`), then one `cat` of that file. Use `git --no-optional-locks --no-pager grep -nwE 'Fit|Shane|Transcription|Transcribe|Markup|Annotation|Metadata|Ribbon|Inspector|MSR|Pyodide' -- apps/web/src packages scripts tests '*.md'` once and sort the hits by category afterwards; never one grep per name per folder. Write only the one report file named below. If the tool is unreachable, stop and say so in one line.

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
7. persisted names: localStorage and IndexedDB keys, saved song fields, i18n keys. RULED by Dann 2026-11-01 12:00: all of these may be renamed to current terms (the Shane work is not released; row 170's "keys unchanged" is superseded). List every one with its current term. The keys `origin/main` also writes are already established (`review-fable-plan-consistency_r1_2026-11-01.md`, question 6): `shane.profiles.v2`, the `ilya:activeTab` value `transcription`, the `scoreMarkup` band id in `ilya:openStations`, and the databases `ilya-data` and `ilya-library`. Do not re-derive them; list any other persisted key whose name or stored value carries a retired term, with its `Shane` line.
Give counts per name per category, then the full list in an appendix.
Also flag collisions: one word naming two things (for example `loupe.station.lyric` is FR « Texte », the same word as the Text document, `i18n.ts:507`; check whether it is drawn and where).

### A2. The user-facing text, English and French (Dann 2026-11-01 11:58)
Every label, instruction, explanation, banner, error, aria label, and the whole of the Guide and Learn, in both languages:
1. **Names a control as it is drawn.** For each instruction that names a control, tab, button, menu item, or panel, read the component that draws it and say whether the words match what a singer sees (label text, French included). A control named in text and found drawn nowhere is a finding. Row 171's review (`review-fable-brief-row171_r1_2026-11-01.md`, 'Labels confirmed drawn') already confirmed the Guide's control labels against the components; take those lines as read and spend the budget on Learn and `i18n.ts`.
6. **Rulings of 2026-11-01 to check against.** (a) Dann 12:19: the five document and tab names are written in capitals wherever a singer reads them, TEXT, MELODY, INSIGHTS, LEARN, GUIDE, and in French TEXTE, CHANT, APERÇUS, LEÇONS, GUIDE, so that TEXT is set apart from text in prose: count every singer-facing mention not in capitals, per name and language. (b) Dann 12:16: « Reconstitution ponctuelle » is the French for Spot reconstitution, with « Réduction ponctuelle » as its partner (DESK DEFAULT): list every « ciblée » for these controls (known: `InspectorPanel.svelte:60-61`), and every label typed into a component instead of read from `i18n.ts`.
2. **One term per concept across both languages.** Build a two-column term list (English, French) of every Ilya concept the text names (for example the Loupe, Corrections, Input, Poem, Lyrics, the Paper, the drawer, a placement, a syllable seat). Flag any concept named two ways in one language, or matched to two French words, or one French word for two concepts.
3. **Parity.** A key whose English and French say different things (one names a control the other omits, one is out of date). Flag; do not draft French.
4. **Stale explanations.** Text describing behaviour the code no longer has (cite the code line that shows the current behaviour).
5. **Ratified text.** Note which flagged strings are ratified (pinned in `apps/web/src/lib/insights/ratified-lines.test.ts` or another `ratified-*` test, or filed as `docs/sessions/ratified-*`): those change only by Dann's ruling, so list them separately. RULED by Dann 2026-11-01 12:13: ratified text is not frozen ("My ratification of text is just saying I approve(d) of it at that moment in time. We can change and update anything."); a ratified line that breaks consistency is a finding like any other, and its pin in the test changes with it. French changes still go to Dann as marked drafts (`CONTRACT.md` §7).
Row 171's brief already audits the Guide's control names (`docs/sessions/brief-code-row171-guide-names-audit_r1_2026-10-31.md`): read it first, do not repeat its census, and report only what it misses, plus all of Learn and `i18n.ts`.

### B. The legend against the tree
Include `apps/web/.env` (tracked, sets the wall), `scripts/ratchets.json` (every ceiling path exists), and the key-prefix index at `apps/web/src/lib/i18n.ts:7-85` (each prefix's files still use it).
Every path, file, function, folder, and claim in `ARCHITECTURE.md`, `CONTRIBUTING.md`, and README "Project Structure": exists or not, true or not, with the line read. List modules in the tree the codemap omits.

### C. Dead code and dead references (recommendations only)
1. Exports with no importer; files nothing imports; i18n keys no code reads (QUEUE row 155 left 24 `upload.*` keys unread: confirm the count); Comments citing `file.ts:NNN` in non-test source: count them per file (174 at `cab8d205` by `grep -rnoE '[A-Za-z+_-]+\.(ts|svelte|mjs):[0-9]+'`), and for any ten, say whether the cited line still holds what the comment says.
2. Comments, docs, and tests that cite a path, function, or line that no longer exists.
3. Each with a confidence: certain (grep proves no reader) or likely (dynamic access possible, say how).

### D. Duplicated logic (recommendations only)
Places that compute the same thing in two or more sites. Known leads to confirm or refute: the punctuation test (`apps/web/src/lib/boundaries.ts`, a reported dead copy in `packages/phonology/src/engine.ts` near `:1999`, `apps/web/src/lib/pipeline.ts` near `:53`, `apps/web/src/lib/score/pairings.ts` near `:222`); the Cyrillic vowel list (`apps/web/src/lib/score/vowel-resolver.ts` `CYRILLIC_VOWEL`, and any copy such as `apps/web/src/lib/omr/underlay-units.ts`). For each: the sites, whether they agree today, what depends on them agreeing, and the one shared home you recommend (readable, named, documented).

### F. Where a newcomer needs a comment (Dann 2026-11-01 12:05)
Dann: "helpful, economical, practical comments in the code to curate sections and identify relationships and risks when it is warranted. Make our code friendly to newcomers who seek to improve it." And 12:06: "I am not asking for copious commentary. I'm asking for commentary that clarifies purpose, function, and consequences to coders who seek to understand and improve Ilya." So each comment answers one of three things: why this exists (purpose), what it does where the code does not say it plainly (function), and what else changes or breaks if it changes (consequences). And 12:07, point 2a: "how other subsystems and functions relate to a given section, and how that may affect these interrelated elements." Desk proposal for the reviewer: relationships that an import search shows (who imports whom) live in one generated map beside the legend, checked by a test so it cannot drift; a comment in the file names only what that search cannot show (an event a distant component listens for, two sites that must agree, a shared invariant, a value another package depends on), and what a change here does to each. List, with `path:line`: (1) Non-test source files that begin with no comment in their first six lines: 25 of 301 at `cab8d205` (loop over `git ls-files` for `apps/web/src/**/*.{ts,svelte}` and `packages/*/src/**/*.ts`, excluding `.test.`, `.d.ts`, `vendor/`). Verify the count, list the files, and for each say in one clause what the header must name (what it is for, what it must agree with). Do not write the header; (2) relationships a reader cannot see from the file alone (two sites that must agree, an event a distant component listens for, a value another package depends on); (3) risks (a ratchet ceiling near its limit, an invariant from `ARCHITECTURE.md` "Invariants" enforced here, a fragile parse, a known edge case); (4) comments that are stale, wrong, or cite a dead line or ticket only. Recommend where a comment earns its place; skip what the code already says plainly. Do not write the comments.

### E. Recommended order
Group the findings into briefs a Code session can build: (1) singer-facing names (with rows 169 to 171), (2) the legend rewrite with a names table, (3) code identifiers, (4) dead code, (5) shared modules. Size each in files and lines touched, from your counts.

## Rules

- Every claim carries a `path:line` read this session, or a command's output.
- NOT ESTABLISHED beats a complete invented answer.
- Do not propose French wording; flag French that needs Dann.
- Budget: stop at about 350k tokens. If you reach it, write what you have and list what remains under "Not done".
- Order of work, so a budget stop still leaves the useful part: A, A2, B, F, C, D, E. Write each section to the report as it finishes, not all at the end.

## Output

Write `$HOME/mnt/ilya-rewrite/docs/sessions/report-desk-consistency-audit_r1_2026-11-01.md`. House style: Canadian spelling, no em dashes, no exclamation marks, sentence-case headings. Sections A to E, then "Not established" and "Not done". Then reply in under 200 words: the counts per retired name in singer-facing text, the count of persisted keys needing a rename, the top three findings, and the file path.
