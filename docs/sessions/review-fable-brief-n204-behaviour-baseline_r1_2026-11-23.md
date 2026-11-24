# Review: brief N.204 step 1, the behaviour baseline (r1)

Fable, 2026-11-23. Subject: `docs/sessions/brief-code-n204-behaviour-baseline_r1_2026-11-23.md`, md5 `0c1de9e0`, 69 lines. Judged against plan r9 (md5 `6d0cd1e1`, the figure `STATE.md` records), the instruments report, the `STATE.md` close, and `CONTRACT.md`. No source file was opened, so every statement here about the code is taken from those five documents and is marked where it is an inference.

## Verdict

**SEND WITH AMENDMENTS.** Four blockers, nineteen amendments.

The brief names all ten families the plan names, pins the right commit, keeps the lane on its own branch, and carries the `.bak`, `docs/memory/`, and NOT ESTABLISHED lines. Its design is right. What it lacks is what makes the result usable by the lanes that follow: a way to compare the baseline with any later commit, a capture route, and a command a later lane can run again.

## Blockers

### B1. The baseline as specified cannot be compared with any later commit

The brief says the build stamps the commit into its own version name, and for that reason builds at `b2869772`. Every later lane builds at its own commit, so every file that carries the stamp differs from the baseline after a lane that changed nothing. On the brief's own account that reaches families 7 and 8 at least. Whether it also reaches hashed file names across the build, the exported binder, or a printed footer is NOT ESTABLISHED.

Done-when item 3 holds every lane to "the behaviour baseline equal byte for byte except the listed intended differences". The brief produces no list of what differs for the stamp alone, so that sentence cannot be checked for families 7 and 8 on the first lane.

**Repair, cheap.** The desk already confirmed that `b2869772` and `93edb360` hold identical source under `apps`, `packages`, and `scripts`. Add a third build at `93edb360`. Its difference from the `b2869772` build is the footprint of the stamp and nothing else. File that list as `STAMP-FOOTPRINT` beside the manifest; it is the standing listed difference every later lane subtracts. If the footprint is anything other than the stamp string in a small number of files, stop and report, because then a change of commit changes the build in ways the plan has not accounted for.

"Stamp footprint" is my term.

### B2. No family has a stated capture route, and the brief does not require a capture that can be run again

The brief's own sentence reads: "the harness is new and lives under `scripts/baseline/` or in the lane's own folder, and the brief says which." The brief does not say which. No family names its route (through the built app in a browser, or through the packages in node), its input set, or its file format.

The plan's use of the baseline is a re-capture after every lane. A set of captured files with no committed, re-runnable capture and no recorded input list cannot serve that: the next lane would rebuild the harness, and any difference could be the harness.

**Repair.** The brief states:

1. One harness location. My recommendation is the lane's own folder, `docs/sessions/n204-baseline_b2869772/harness/`, because the brief's first prohibition is "change no file under `apps/`, `packages/`, or `scripts/`", and because the desk's own check that source equals base is a diff over those three paths, which a new file under `scripts/` breaks. If workspace packages do not resolve from there, the lane stops and reports and the desk rules on `scripts/baseline/`. If the desk prefers `scripts/baseline/` from the start, the first prohibition is reworded to "change no existing file; add nothing outside `scripts/baseline/`", and the lane reports gate 8 after the addition. Whether a new file under `scripts/` moves a ratchet is NOT ESTABLISHED.
2. One command that takes a checkout directory and an output directory and writes all captured families and the manifest. The harness is committed.
3. A per-family route, or an instruction that the lane chooses the route, records it in the manifest, and never mixes routes inside one family. The requirement that families 1 to 5 come "from the two builds" implies the browser route for all five; say so, or say where node is acceptable (TEXT may not depend on the build at all).
4. An `INPUTS` list per family in the manifest: which fixtures, which voice, which language, which page size.

### B3. The search-first line is missing, and `CONTRACT.md` section 4 says such a brief does not go

Section 4: "A brief that proposes new work carries one line naming the grep it ran and what came back, or it does not go." The brief proposes a new harness and carries no such line.

The instruments report names things already in the tree that bear on it: `approval/__approved__/*` under `apps/web` and under `packages/score-parser/src`, `analysis/__golden__/adapter-snapshots.json`, `melody/strophic-byte-baseline.json`, and the e2e folders. Whether any of them already holds part of family 1, 2, or 3 is NOT ESTABLISHED, and it is the desk's search to run. The project's document list also holds `e38-guide-ruled-and-the-capture-harness_2026-08-10.md`; I could not open it from here.

### B4. "Run twice" is narrowed from the whole baseline to five families

Plan section 5a: the behaviour baseline is "built at the base commit and run twice to prove it deterministic", and the ten items follow inside that one parenthesis. The brief takes families 1 to 5 twice and families 6 to 10 once. Section 8's rule, read from the other side, is that a step must not deliver less than the ask.

- Families 7, 8, and 9 are in effect taken twice by step 1's comparison. The brief does not say so, and it needs to, so the report can state it per family.
- **Family 10 is the one that matters.** A Playwright run taken once cannot tell a failing test from an unstable one, and done-when item 3 holds every later lane to "both Playwright projects pass".
- Family 6 costs nothing to take twice.

**Repair.** One sentence: all ten are taken twice; 7 to 9 through step 1; 6 and 10 by a second run.

## Amendments

**On step 1 and the build**

1. **Say how the `b2869772` tree is made.** `checkout` is on section 4's forbidden list, and the cloud-lane exception grants commit and push on one branch and nothing else. The harness also does not exist at `b2869772`. State: the lane's own working tree stays on `cloud-lane-86` throughout; each build tree is a separate directory outside it, made by a detached worktree or an export of the commit; the lane reports which, and reports the stamp string each build carried. Whether the stamp survives an export with no `.git` is NOT ESTABLISHED, which is the reason to report it.
2. **Define "clean state".** As written, two builds in one directory can share a cache and pass for that reason. Ask for two separate directories at different paths, the build output and every build cache absent before each, and a statement of whether the install was shared.
3. **Separate the two builds in time and place.** Two builds minutes apart in one container cannot detect a stamp at the grain of a day, or a dependence on time zone. Run the second build at least one minute after the first and under a different `TZ`. A difference from that is a finding, reported like any other.
4. **Name the comparison.** A sorted list of path, size, and sha256 for each build, compared as sets, so a file present in one build only is reported and not passed over. Name the build command and the output directory, or have the lane report both with the environment variables that were set. Whether the build a cloud session produces is the build Vercel serves is NOT ESTABLISHED.
5. **Add two stops.** (a) Step 0's gates are not at baseline: stop. (b) The build fails, or completes with a model or asset fetch that failed or was skipped: stop. The instruments report records that build scripts copy and fetch files into `static/`, and that `apps/web/omr-underlay/` was empty in the staged tree while a copy script expects a model file there. A build that succeeds with assets missing would give a wrong baseline for families 7, 8, and 9 that looks valid.
6. **Say what a stopped lane still delivers.** The step 0 and step 1 reports and the difference list, committed and pushed. No repair is attempted, and nothing labelled a baseline is committed.
7. **Give the determinism history its source, or mark it.** The brief states that the build differed in fifteen files until 2026-11-19, that Dann ruled the repair in at 15:20, and that it shipped inside N.211. None of the plan, the `STATE.md` close, or the instruments report carries that. The plan describes N.211 as the first slice of consistency batch 3, a folder rename. `CONTRACT.md` section 4 records that on 2026-11-19 at 15:2x the desk found a commit stamp already computed at `apps/web/vite.config.ts:13-18`. The statement "the build stamps the commit into its own version name" is a claim about the code and section 0 requires a line read with it. Cite the record and the lines, or have step 0 read the lines and report them before step 1.

**On the families**

8. **Family 1, the fixture set.** "Every test fixture" is not a countable set as written. The lane enumerates it, files the list, and reports score files and scans apart. A scan that cannot be read in the container is reported as not captured, by name, never dropped. One fixture carries `.bak` in its name; the lane leaves it as found.
9. **Families 3 and 5, the voice.** INSIGHTS output and a saved-voice JSON both need a voice. The instruments report records that the capture stub is development only and that the recorder flag is false in a production build. Name the voice input: an existing fixture if one exists, which the desk's search under B3 answers. If the only route is a simulated microphone, the lane holds both families out and reports.
10. **Family 4, the print format.** State what a "printed page" is as a file. A PDF written by the browser may carry a creation date, and whether the phone project's browser can write one is NOT ESTABLISHED.
11. **No silent normalising.** Where two runs of a family differ only in a date or a generated identifier, the lane names the fields, keeps the raw files, and stops short of deciding. A normalising step enters the harness only on the desk's word and is listed in the manifest, because it becomes part of what every later lane compares.
12. **Family 6.** Use the plan's term, the i18n table. Commit the sorted table beside its hash and state the sort and the serialization, so a changed hash can be read as a changed line.
13. **Families 7 to 9.** Add sha256 per file to the list of sizes, since a same-size change is invisible to sizes. Take the precache list from the built `sw.js`, and file the source one beside it. Say when `static/` is measured (before the build scripts and after), split tracked from generated, and give the hash of each fetched file.
14. **Family 10.** File the list of every test with its status, not counts alone; a count can hold while one test replaces another. State what the projects run against. Add no update flag to any run. A failing or unstable test is reported and left as found. `STATE.md` records no Playwright count, so the brief has no expected figure to give and can say so.

**On comparability**

15. **Record the environment in the manifest, and fix what can be fixed.** Operating system image, node, pnpm, browser build, a hash of the installed font list, locale, and time zone; `TZ` and `LANG` set to stated values for every capture. Plan section 5c runs tier 3 lanes on the Mac. Whether a drawn page captured in a Linux container equals the same page captured on the Mac is NOT ESTABLISHED, and if it does not, tier 3 lanes need a baseline of their own. That is a question for the desk and the plan, and the lane's environment record is what answers it.

**On git, size, cost, and the record**

16. **Git hygiene, in the brief's words.** Stage by explicit path only, never `git add -A` or `git add .`, which is the occasion section 4 gives for the whole git rule. Before each commit, `git status --porcelain` shows nothing outside the lane's folder and its reports. No force push. Step 0 confirms `cloud-lane-86` does not already exist on the remote. The gates run in the lane tree and the builds run elsewhere, so test output never lands in a build tree.
17. **Size.** The brief calls the captures "text artifacts"; a binder and a PDF may not be. Add a total ceiling beside the per-family one: ten families at 20 MB each is 200 MB into history that a merge makes permanent. My recommendation is a total of 50 MB before the desk's word, with the manifest always committed.
18. **Cost and ceiling.** The brief names no model, no token cap, and no subagent rule. Section 4 requires a bounded cost stated before a farm-out, a cap set from the actuals table, and a ceiling of two. Add the model, the cap, and "no more than two subagents at once".
19. **Quote the ask, fix the report names, and trim the figures of speech.** Section 8 asks that a brief quote the words it serves: put section 5a's sentence and done-when item 3 in verbatim. Plan section 5b asks every brief to say "check with `ls` before naming a report path"; the brief fixes a path dated 2026-11-23 for a lane that will run later, and "one commit per step with its own report" sits beside a single step 3 report, so name each. "A photograph of exactly what Ilya produces today", "a baseline nobody can diff later is not a baseline", and "a baseline that cannot reproduce itself is not yet a baseline" are the constructs section 6 bans; each can be cut with no fact lost. Last, the brief defers "bundle and `static/` byte sizes" to the Mac with the timings, but bytes are not timings and families 7 and 9 already hold them; say the lane reports the two totals so nothing waits on the Mac for a byte count.

## The five questions

### 1. Does it capture everything the plan's baseline names?

All ten items of section 5a are present, in the plan's order, and none is reworded into something smaller. The base commit is the plan's. Three things fall short:

- "Run twice" covers five families, not ten (B4).
- The plan's purpose for the baseline, comparison after every lane, is not served for families 7 and 8 (B1) or for any family without a re-runnable capture (B2).
- The brief does not quote the plan's sentence, so a reader cannot check the first two points from the brief alone (amendment 19).

One observation outside the plan, offered and not required: the plan asks for both languages on INSIGHTS only. If the drawn MELODY page or a printed page carries French strings, a lane that alters them shows only as one changed hash in family 6. The desk may want families 1 and 4 in both languages. That is my suggestion and would widen the plan.

### 2. Is each family capturable by a cloud session, and does the brief say by which path?

The brief states a path for none of the ten. `STATE.md` establishes that the bridge cannot build and that this is why the work is a lane; no document I read establishes that a cloud session has completed a production build of this tree or run either Playwright project.

| # | Family | Route the brief assumes | Risk that the route does not exist |
|---|---|---|---|
| 1 | MELODY SVG | Unstated; "from the two builds" implies the built app in a browser | Medium. Score files are likely loadable; scans need reader models whose presence in a container is NOT ESTABLISHED |
| 2 | TEXT, IPA corpus | Unstated; the corpus has no path in the brief | Low for the capture; where the corpus lives is NOT ESTABLISHED |
| 3 | INSIGHTS, both languages | Unstated; needs a voice and a song | **High.** No voice input is named (amendment 9) |
| 4 | Printed pages | Unstated; no format | **High.** A byte-stable print artifact may not exist (amendment 10) |
| 5 | Binder and saved-voice JSON | Unstated | **High.** A saved voice needs a voice; the stub is development only; the binder may carry dates. The plan itself lists "whether a fixture binder from a released build exists" as NOT ESTABLISHED |
| 6 | i18n hash | Unstated; node | Low |
| 7 | Build file list | The build | Medium. Depends on the build completing with every fetched asset (amendment 5) |
| 8 | Precache list | The build | As 7, and source or built is unstated |
| 9 | `static/` bytes | Unstated moment | As 7; the figure differs before and after the build scripts |
| 10 | Both Playwright projects | Unstated | Medium. Not among the eight gates; browser availability for the phone project in a container is NOT ESTABLISHED |

Families 3, 4, and 5 are where the brief assumes a route that may not exist. The brief's closing section does tell the lane to say so when a path fails, which is the right fallback, but it is the brief's job to name the voice input and the print format first.

### 3. Is the determinism check sound, and is its stop condition right?

The stop condition is right in direction: differing builds mean no baseline is taken, and the brief says so plainly. It needs amendment 6, so a stopped lane still files what it found, and amendment 5, so a build that fails or runs short of assets stops the lane too.

The check itself is not yet sound, in four ways:

- "Clean state" is undefined, and a shared cache can make two builds agree (amendment 2).
- Two builds close together in one place cannot see a coarse time stamp, a time zone, or a path (amendments 2 and 3).
- The comparison method is unstated, so a file present in one build only could be missed (amendment 4).
- It proves one commit equal to itself and says nothing about what a change of commit alone does (B1).

One further point. The plan asks that the baseline be deterministic; the brief makes byte-identical builds the gate. That is stricter than the plan and I think correct, because families 7 to 9 are the build's own bytes.

### 4. Does anything risk changing behaviour, moving a ratchet, or touching a file it should not?

Nothing in the brief instructs a change to source, and its prohibitions are stated. Four risks sit in what it leaves open:

- **A harness under `scripts/baseline/`** contradicts the first prohibition as worded, falls inside the frozen map's unit o, breaks the desk's source-equals-base check, and may meet gate 8. Whether it moves a ratchet is NOT ESTABLISHED (B2).
- **A sweep by `git add -A`** after gates, builds, and Playwright runs have written output into the tree (amendment 16).
- **An update flag** on a Playwright or approval run would rewrite approved files (amendment 14).
- **The commit of captures** is permanent once merged, and the brief bounds one family, not the total (amendment 17).

The lane ships nothing into `static/`, so section 8's byte-count rule is not engaged.

### 5. Does the brief hold Dann's standing rules?

| Rule | Held? |
|---|---|
| Git: the lane's own branch only, never `Shane` or `main`, no pull request, Dann merges | Held, in those words |
| Git: how the base commit is reached without a forbidden command | Not stated (amendment 1) |
| No `.bak` file | Held |
| Nothing under `docs/memory/` | Held |
| A section for what could not be established, and the verbatim sentence | Held |
| Fable review before Code gets it (section 1 item 19) | Held; the brief marks itself NOT SENT |
| Search before proposing new work (section 4) | **Not held** (B3) |
| A claim about the code carries a line read (section 0) | **Not held** for the stamp and the determinism history (amendment 7) |
| Bounded cost, cap from actuals, ceiling of two (section 4) | **Not in the brief** (amendment 18) |
| Quote the ask the brief serves (section 8) | **Not held** (amendment 19) |
| No timing reported without control (section 8) | Held; timings are excluded |
| `ls` before naming a report path (plan section 5b) | Not held (amendment 19) |
| House style (section 6) | Held but for three figures of speech (amendment 19) |

## What I could not establish

1. **How the build computes its stamp**, whether an environment variable can pin it, and whether it survives a tree with no `.git`. I opened no source. B1's repair does not depend on the answer.
2. **The determinism history the brief states** (fifteen files, the 15:20 ruling, shipped inside N.211). I read the `STATE.md` close and the named plan sections; it may be recorded lower in `STATE.md`, in `OPEN.md`, or in `ENVIRONMENT.md`, none of which was on my list.
3. **Whether a cloud session has ever built this tree for production or run either Playwright project**, and which browsers the two projects use.
4. **Whether the reader's model files and the underlay model reach a cloud container**, and what the build does when one is missing.
5. **What the existing approval and golden files already capture**, and whether a saved-voice or binder fixture exists.
6. **Whether a new file under `scripts/` trips gate 8** or any other gate.
7. **Whether `cloud-lane-86` is free.** `STATE.md` names lane 85 as the latest.
8. **Whether captures made on Linux equal captures made on the Mac.**
9. **What cloud lanes now draw on.** Section 4 records the cloud credit as expiring 2026-11-05 and asks the desk to say at once if sessions stop drawing on it. I read no later line on this, and the estimates table in `ENVIRONMENT.md` was not on my list, so I propose no cap figure.
10. **The contents of project knowledge.** I have no tool that reads it here; the one document I name from its list I know by title only.
11. **My token spend.** I cannot read my own counter. My estimate is about 150,000 tokens, under the 300,000 cap.

## Files read

**Whole:**

- `docs/sessions/brief-code-n204-behaviour-baseline_r1_2026-11-23.md` (69 lines).
- `docs/sessions/report-sonnet-n204-step1-instruments_r1_2026-11-23.md` (215 lines, in two reads).

**In part:**

- `docs/sessions/plan-code-audit-maintainability_r9_2026-11-23.md`: section 5's opening and step 1 (lines 115 to 144); steps 8, 9, and 10 with sections 5a, 5b, and 5c (lines 240 to 304); sections 8, 9, and 10 (lines 383 to 450), so all twelve done-when items and not items 3 and 7 alone. Elsewhere, only the lines a search for `b2869772`, N.211, and Playwright returned (lines 30, 340, 355, 457). Sections 1 to 4a, steps 2 to 7, 5d, 5e, 6, and 7 were not read.
- `docs/memory/STATE.md`: lines 1 to 37 whole, which is the header and the 2026-11-23 late close. Below that, only the lines a search for lane numbers and `b2869772` returned (lines 43, 49, 63, 71).
- `docs/memory/CONTRACT.md`: sections 0, 0.1, 0.2, 0.3, and 1 (lines 1 to 49); section 4 (93 to 113); section 5 (114 to 138); section 6 (139 to 153); **section 8 whole** (164 to 180), read in two parts with its final 3,001-character line printed alone and its closing words checked ("which way they go.**"). Sections 2, 3, 7, and 9 were not read. No result was piped through `cut`, and no read exceeded 18 kB.

No source file was opened. One file was written: this report. No `.bak` file was created.
