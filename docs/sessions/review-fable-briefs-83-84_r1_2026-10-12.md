# Fable's review of rows 83 and 84 (r1, 2026-10-12)

Reviewer: Fable, as a subagent of the desk. Read whole, from the copy under `/mnt/user-data/uploads/ilya-rewrite/`: both briefs, `BRIEF-TEMPLATE.md`, `markup-pages.test.ts`, `notation-overlay.ts`, `notation-overlay.test.ts`, `MarkupPane.svelte` (1346 lines in this copy), and `tessitura.ts:190-220`. The copy is partial: it holds twelve files and no `.git`, no `package.json`, no `scripts/`, no `tools/`, and no `.musicxml`. Every search below that needed the whole tree is marked accordingly. Nothing was run against a git repository; no git command was run.

## Verdicts

- Row 83: **SEND WITH AMENDMENTS** (amendments 1 to 5).
- Row 84: **SEND WITH AMENDMENTS** (amendments 6 to 11), and after the sequencing in amendment 10 is settled.

## Row 83: the every-score test counts tracked files only

### Section 2 checked against the file

| Claim | Result |
|---|---|
| `markup-pages.test.ts:45-55`, `scores(dir)` walks with `readdirSync`, skips `node_modules` and dot-names, keeps `.musicxml` | checks (comment at `:45`, function `:46-54`, skip at `:48`, keep at `:51`) |
| `:68`, the files are `scores(apps)`, `scores(docs)`, `scores(tools)` | the line is `:66` |
| `:70-72`, a guard of more than 50 | the guard is `:68-70` (`toBeGreaterThan(50)` at `:69`) |
| the comment says "Every tracked" and the walk does not check it | checks (`:45`) |
| 187 tracked, 233 found, 46 under `tools/e16-harness/output/` | not verifiable in this copy; the arithmetic matches (2448 less 2402 is 46) |

`ROOT` is `fileURLToPath(new URL('../../../../../', import.meta.url))` (`:25`): five levels above `apps/web/src/lib/markup/`, which is the repository root. The same mechanism already serves `PANE` at `:24`, so it is known to resolve under vitest on the Mac and in the clean clone (gate 4 passed in both, section 1 of the brief).

### Is the instruction exact enough?

Nearly. Section 5 names the command, the cwd, and the prefix filter, but not the module to import, the encoding, how to split `-z` output, or how the prefix filter is written. Each of those is a place Code can pick a wrong default. Amendment 2 fixes the wording.

### Risks, each with its answer

- **`git ls-files` from vitest's cwd.** No exposure: the brief runs it with `cwd: ROOT`, and `ROOT` is the repository root (`:25`). Output paths are then relative to the root, so `join(ROOT, p)` gives the file and `relative(ROOT, f)` at `:72` keeps the test names it has today.
- **ROOT resolution.** `fileURLToPath` of a directory URL returns a path with a trailing separator; `cwd` and `join` both accept it (Fable's knowledge, not verified).
- **`-z` parsing.** The output is NUL-separated with a NUL after the last entry, so a split on `\0` ends with one empty string that must be dropped. With `-z`, git prints paths as raw bytes and never quotes them, which matters here because score file names may hold Cyrillic; without `-z`, `core.quotePath` would print such names as quoted C escapes and the file would not be found (Fable's knowledge, not verified). The brief's choice of `-z` is right; amendment 2 says how to read it.
- **Paths with spaces.** Handled by `-z` and by `execFileSync` with an argument array (no shell). The pathspec `*.musicxml` matches at any depth, since a git pathspec's `*` matches `/` unless `:(glob)` magic is given (Fable's knowledge, not verified). If Code doubts this, the JS prefix filter in amendment 2 makes the pathspec a convenience only.
- **Output size.** `execFileSync`'s default `maxBuffer` is 1 MiB (Fable's knowledge, not verified); 187 paths are a few kilobytes.
- **CI or a worktree.** A worktree's `.git` is a file; `git ls-files` works there. A fresh or shallow clone has an index; it works there too. Where there is no `.git` at all (an exported archive, or a build container that strips it), the test fails with the brief's message, by design. Whether gate 4 ever runs in such a place is NOT ESTABLISHED; this copy of the tree has no `.git` and would fail.
- **Untracked measure folders Dann later commits.** `git ls-files` reads the index. A `.musicxml` under `docs/sessions/measure-*/` that is committed, or only staged, appears from then on, on every machine that has that commit; so the count moves with the tree, which is what a pinned count wants, and no longer with what sits on one disk. Two residual ways the Mac and a clone can still differ: a file staged but not committed on the Mac (in the Mac's index, not in the clone), and a tracked file deleted from the Mac's disk without `git rm` (still listed; `readFileSync` at `:57` then throws and the test fails, loudly). Both are visible in `git status`, and neither is silent.
- **A scan or truth file kept outside the repository.** `git ls-files` lists index entries only, and the index holds only paths under the root, so an outside file cannot be read unless a tracked symlink ending `.musicxml` points at it (NOT ESTABLISHED that any exists). Note that today's walk follows symlinked directories (`statSync` at `:50` follows links), so the change narrows, never widens, what is read.
- **`tools/` absent.** Today `readdirSync(join(ROOT, 'tools'))` at `:66` throws if `tools/` is missing from a checkout; the `ls-files` form does not. An improvement, not a risk.

### "Done when" observable?

Yes. The counts in section 3 and section 6 are numbers Code prints. One wording gap: in a clean clone, the only way `scores()` and `git ls-files` can differ is a tracked `.musicxml` under a dot-directory or under a tracked `node_modules`, both skipped at `:48`. Amendment 4 says so, so Code knows what "explained file by file" is looking for.

### Amendments for row 83

1. **Section 2, the three citations.** Replace "`apps/web/src/lib/markup/markup-pages.test.ts:68`: the files are `scores(apps)`, `scores(docs)`, and `scores(tools)`" with "`...markup-pages.test.ts:66`: ..." and replace "`:70-72`: a guard that more than 50 files are found" with "`:68-70`: a guard that more than 50 files are found (`:69`)". Reason: the lines in the file are `:66` and `:68-70`; `:45-55` stands (comment `:45`, function `:46-54`).

2. **Section 5, the command.** Replace "List the files with `git ls-files -z -- '*.musicxml'` run at the repository root (`execFileSync('git', [...], { cwd: ROOT })`), kept to paths under `apps/`, `docs/`, and `tools/`." with: "Import `execFileSync` from `node:child_process`. List the files with `execFileSync('git', ['ls-files', '-z', '--', '*.musicxml'], { cwd: ROOT, encoding: 'utf8' })`, split the result on `'\0'`, drop empty strings, keep the paths that start with `apps/`, `docs/`, or `tools/`, and map each to `join(ROOT, p)`. The listing runs where `scores()` runs today, inside the `describe` at `:65`, so `it.each` at `:72` has the list at collection time. Remove `scores()`, and remove the `readdirSync` and `statSync` imports at `:17` if nothing else uses them." Reason: the brief names the command but not the module, encoding, NUL split, or filter form, and each is a place Code can pick a different default.

3. **Section 5, the failure path.** Replace "If `git` is not available where the test runs, the test fails with a message that says so." with: "Wrap the call in `try`/`catch` and rethrow as `new Error('markup-pages: git ls-files failed (is this a git checkout with git installed?): ' + message)`. The test file then fails at collection, which is the intended behaviour." Reason: an uncaught `execFileSync` error already fails the file, but its message names a spawn error, not the cause, and the brief asks for a message that says so.

4. **Section 6, the difference.** Add after "any difference is explained file by file": "In a clean clone the two lists can differ only by a tracked `.musicxml` under a dot-directory or under a tracked `node_modules` path, both of which `scores()` skips at `:48`; report zero such files if there are none." Reason: it tells Code what an explanation is, and makes the expected answer (no difference) observable.

5. **Section 6, the ship script.** Add: "The desk moves the ship script's gate 4 line only after row 84 has also shipped, since row 84 removes 5 tests (`notation-overlay.test.ts:17, :21, :29, :38, :43`)." Reason: rows 83 and 84 run back to back on `cloud-lane`, and a count pinned between them is wrong within the hour.

## Row 84: N.86's remainder, the dead notation-only overlay

### Section 2 checked against the files

| Claim | Result |
|---|---|
| `notation-overlay.ts:1-27`, the header, "Replaced by a real `analyzeScore()` call ..." | checks (header `:1-28`, the sentence at `:25-27`, the function at `:41`) |
| `MarkupPane.svelte:535-536`, "This replaces notationOnlyOverlay" | checks in this copy (`:535-536`) |
| `:721` calls `analyzeScore` | checks (`:721`, inside `analyzed` at `:719-723`) |
| imported only by `notation-overlay.test.ts:11` | checks for the files in this copy; the whole-tree search is NOT ESTABLISHED (see below) |
| `MarkupPane.svelte:123-125` | checks; the sentence runs `:122-125` inside a doc comment `:118-127` |
| `:963-964` | checks; the comment runs `:960-964` |
| `optimalRegion` at `tessitura.ts:196-215` | the doc comment is `:196-203`, the function `:204-218`; `index.ts:182` is not in this copy, NOT ESTABLISHED |

### References the desk may have missed

A search of every file in this copy for `notation-overlay` and `notationOnlyOverlay` finds exactly the lines the brief names, plus the brief itself under `docs/sessions/`. The copy holds no `scripts/ratchets.json`, no `package.json`, no `tsconfig`, no `vite.config`, no e2e folder, and no other `$lib/analysis` module, so whether any of those names the file is NOT ESTABLISHED here. The brief's section 3, step 1 already orders Code to search; amendment 6 widens that search to the places a plain import search misses and gives the one command that settles it. `$lib/analysis/` keeps other modules (`advice-resolver`, `analyze-score-adapter`, `placeholder-line`, `watchlist`, `gates`, imported at `MarkupPane.svelte:91-99`), so removing the two files does not empty the folder.

### Have MarkupPane's line numbers moved?

Not in this copy: `:125`, `:535-536`, `:721`, and `:964` are where the brief says. This copy already carries row 78a's edit (`:724-725`, "row 78a, Dann 2026-10-11 20:06"), so the brief's lines were read after 78a. What rows 78b and 79 change in this file is NOT ESTABLISHED; the brief at row 81 says those rows "run on the cloud lane at the same time" (`brief-code-underlay-baseline_r2_2026-10-12.md:53`), while the desk's note to me says a Code session on the Mac is editing the file. Either way the numbers can move before Code reads them, so amendment 7 makes Code locate the comments by their text.

### What the two comments say, against what the page does

Both comments say the page renders "notation only ... no acoustic marks". Today `analyzed` is `resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))` (`:719-723`), `scorePages` paginates `readingScore` with that `analyzed` (`:837-839`), and `hasAcousticMarks` is true whenever `analyzed.events` holds an entry (`:788`). So marks are drawn whenever a vowel resolves against a profile; the plain line appears when none does (`:535-537`, `:796-799`). The comments are false, not only stale in their pointer. The brief's section 3, step 2 has Code say this; amendment 8 puts the facts in section 2 so Code rewrites from them, and amendment 9 offers draft wording so the rewrite is checkable.

One more header says "notation only": `:495`, "Score pages (live wiring slice 1: notation only)". It does not name the helper, so it does not block "done when". DESK DEFAULT: leave it; widening scope is not worth a second hunk in a file under concurrent edit.

### Merge-conflict risk, and the sequencing

Row 84 edits `MarkupPane.svelte` on `cloud-lane` from a GitHub clone. If rows 78a to 79 change the same file on another lane, the merge of `cloud-lane` into `Shane` conflicts only where the hunks overlap or touch (git's three-way merge keeps non-overlapping hunks in one file; Fable's knowledge, not verified). Row 84's hunks are two comments at `:118-127` and `:960-964`; row 78a's known hunk is at `:724-725`, well clear. What 78b and 79 touch is NOT ESTABLISHED, so the risk cannot be called zero. The cost of a conflict is small (two comment hunks the desk can re-apply by hand) but it lands on Dann's `Shane` merge, which is the one place the brief wants no surprises.

Proposed sequencing, in order of preference:

1. Run row 84 after rows 78a to 79 are committed on the branch the cloud lane clones from, and name that commit in the brief. Row 84 is already "after row 83" and small, so the wait costs little.
2. If 84 must run now: the cloud lane deletes the two files and nothing in `MarkupPane.svelte`; the two comment rewrites go to whichever session holds `MarkupPane.svelte`, with amendment 9's wording. "Done when" then splits: the cloud lane's grep may still find the two comments, and the other session's report closes them.

Amendment 10 writes option 1 into the brief and names option 2 as the fallback.

### "Done when" observable?

Yes, once the grep in amendment 6 is the stated check. "Gate 4's new count is reported with the number of tests removed" is observable; amendment 11 states the number so a different one is a finding.

### Amendments for row 84

6. **Section 3, step 1.** Replace "Confirm with a search that nothing outside its own test imports `notation-overlay`." with: "Run `git grep -n -e 'notation-overlay' -e 'notationOnlyOverlay' -- . ':!docs'` at the repository root and paste the output into the report. Expected: the two files being removed, and `MarkupPane.svelte` at the two comments and `:535`. Anything else (a dynamic `import()`, a ratchet or allow-list under `scripts/`, a `tsconfig` or vitest `include`, an e2e test, a README under `apps/`) is a finding: report it and stop before removing anything." Reason: an import search misses string references, and this copy cannot show whether any exist.

7. **Section 2 and section 5, the comment locations.** Add to section 2: "Line numbers in `MarkupPane.svelte` were read after row 78a's edit (`:724-725`) and may move again; locate the two comments by their text: `see` followed by `notation-overlay.ts for why that is the engine's own semantics` (a `/** */` doc comment on the `ingested` prop), and `notation only for now (no` followed by `acoustic marks; see notation-overlay.ts)` (an HTML comment above `.markup-paper-container`)." Reason: the file is under concurrent edit and the brief's lines are the only locator Code has.

8. **Section 2, what the page does.** Add: "`MarkupPane.svelte:719-723`: `analyzed` is `resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))`, or `null` without a score or resolver. `:837-839`: `scorePages` is `paginateScore(readingScore, analyzed, ...)`. `:788`: `hasAcousticMarks` is true when `analyzed.events` has an entry. So the page draws acoustic marks whenever a vowel resolves against the profile, and the plain vocal line when none does (`:535-537`)." Reason: the two comments claim "no acoustic marks", which is false today, and Code rewrites from facts in section 2, not from its own reading alone.

9. **Section 5, the rewrite.** Add after "keeping the one sentence of reasoning from the helper's header that still holds": "Draft wording, to be checked against amendment 8's lines before use. For the `ingested` prop: `When present, the envelope's content window carries the rendered score pages instead of the interim copy: real systems and underlay through paginateScore, with the acoustic marks analyzeScore resolves against the active profile (see the overlay block below). With no resolvable vowel or no fR1, analyzeScore omits every event and the plain vocal line renders; that is the engine's own semantics, not a bypass.` For the HTML comment: `The SVG pages come from paginateScore over the analysed score; marks appear only where a vowel resolved against the profile, and an empty events map draws the plain vocal line.` The comment at `:535-537` already carries the reasoning and needs no change." Reason: the brief's "say what the page does now" is a taste-free rewrite that is cheaper to check than to invent, and the header sentence that still holds (`notation-overlay.ts:9-13`) is named so Code keeps that one and not the slice-1 scope line.

10. **Section 5, sequencing.** Replace "**Displaces:** nothing." with: "**Displaces:** nothing. **Sequencing:** start this row from a clone that holds rows 78a to 79's commits to `MarkupPane.svelte`; the desk names the commit here: `<sha>`. If those rows have not landed when the cloud lane is free, do only the two file removals and the grep in this row, leave `MarkupPane.svelte` untouched, and say so in the report; the desk then gives the two comment rewrites (amendment 9's wording) to the session that holds the file." Reason: two lanes editing one file is a merge-conflict risk on Dann's `Shane` merge, and the brief does not say which lane holds the file.

11. **Section 5 and 6, the count.** Replace "Gate 4 falls by the removed test's count; report it." with "Gate 4 falls by 5 tests (`notation-overlay.test.ts:17, :21, :29, :38, :43`); report the new count, and report any other number as a finding." Reason: a stated number makes the check observable.

Also for row 84, not an amendment: `SCHEDULE.md` week 5 names `notation-overlay.ts` as an N.86 candidate and the brief's "no other file changes" leaves it; the desk closes that line after the ship. The `wall.ts` and font-lab questions stay with Dann, as the brief says.

## Could not establish

- Whether anything outside the twelve uploaded files names `notation-overlay` (scripts, ratchets, configs, e2e, dynamic imports). Amendment 6 makes Code settle it.
- `packages/score-parser/src/index.ts:182` (the `optimalRegion` export), not in the copy.
- The Mac counts in row 83's section 2 (187 tracked, 233 found, 46 ignored); only the arithmetic was checked.
- Which lane holds `MarkupPane.svelte` for rows 78b and 79, and what lines they change. Row 81's brief says the cloud lane; the desk's note says the Mac.
- Whether gate 4 ever runs where `.git` is absent (a Vercel build, an exported archive). Row 83's test fails there by design.
- Whether any tracked symlink ending `.musicxml` exists.
- The git behaviours marked "Fable's knowledge, not verified": `-z` output shape and quoting, pathspec `*` crossing `/`, `execFileSync`'s default `maxBuffer`, and three-way merge of non-overlapping hunks.
