# Fable's review of row 86's brief (r1, 2026-10-12)

Reviewer: Fable 5.1, 2026-10-12. Inputs read whole: `brief-code-the-final-test-set4_r1_2026-10-12.md` (row 86), `brief-code-the-final-test-set3_r1_2026-10-11.md` and `report-code-the-final-test-set3_r1_2026-10-11.md` (row 76), `report-code-set3-four-below_r1_2026-10-11.md` (row 77), and `BRIEF-TEMPLATE.md`. All under `/mnt/user-data/uploads/ilya-rewrite/docs/sessions/`. Nothing was built or run. Row 55's brief, row 74's report, the harness scripts, the Mac's working tree, and Vercel were not read; where a check needs them, the line says NOT ESTABLISHED.

## Verdict

**SEND WITH AMENDMENTS.** The protocol is row 76's with the changes it names, the stop rule is intact, the rehearsal expectation is right, and the song identities are protected on paper. Three things leave the one run open to an untrustworthy or unrepeatable number: the brief names no commit for the alias to serve, it does not say when the stamp is checked, and it carries row 76's gap on the alias moving mid-run unchanged. The amendments below close them without changing what is measured.

## 1. Does the protocol match row 76's where it should, and differ only where it says?

Row 86 says "Same protocol as row 76 ... with the changes below" (row 86 brief:3). Set against row 76's brief, step by step:

| Step | Row 76 | Row 86 | Stated as a change? |
|---|---|---|---|
| 1 commit | "serves the commit named in the prompt" (row 76 brief:17) | "which commit the deployed alias serves", plus a reader stamp check (row 86 brief:16) | Yes, but see section 3: no commit is named and nothing stops on the commit. |
| 2 rehearsal | K and M against row 74's lines (row 76 brief:18) | K and M against row 76's `rehearsal-lines.txt` (row 86 brief:17) | Yes. Right, see section 2. |
| 3 the ten | letters Q to Z, glob order, `<webgpu or wasm>` (row 76 brief:19 to 20) | labels 4A to 4J, glob order, `webgpu` fixed, keep in the private `run/` folder (row 86 brief:18 to 20) | Yes. |
| 3 secrecy | "do not open, view, list, or print any scan, truth, reading, or bar" (row 76 brief:19) | the same plus "and you do not print a file name" (row 86 brief:18) | Yes, and it answers row 76's slip (row 76 report:65). |
| 4 refusal | scores 0 as row 55's step 4 (row 76 brief:21) | the same, also citing row 76's step 4 (row 86 brief:21) | Same. See section 7 on stalls. |
| 5 total | `final-line.ts total` (row 76 brief:22) | same (row 86 brief:22) | Same. |
| 6 harness folder | not stated in row 76's brief; the report put `ten/keep` inside the tree folder (row 76 report:18) | new folder, "scripts and the printed lines only; no reading, no name" (row 86 brief:23) | Yes, and it moves `keep` out of the tree, which row 76 did not. |
| Report | no edit to `docs/memory/` (row 76 brief:36) | no edit except row 86's State in `QUEUE.md` (row 86 brief:38) | Yes, stated. |

One unstated difference: row 76 let Code choose `webgpu or wasm`; row 86 fixes `webgpu`. Row 76's report says all twelve songs took WebGPU anyway (row 76 report:18), so this is a narrowing, not a change in what was measured. No amendment.

One internal inconsistency: line 3 says "nothing in the working tree touched ... this row writes only its own new folder", while line 38 asks for a report file in `docs/sessions/` and a line in `docs/memory/QUEUE.md`. Three writes, not one. Amendment 6 lists them.

## 2. Is the rehearsal expectation right under ilya.7?

Yes, with one caveat about what "ilya.7" means on the alias.

- Row 76's rehearsal lines for K and M equal row 74's rule-on lines, every count (row 76 report:22, lines at :25 to :28).
- Row 77 ran K and M through the drop box on the local build with both fixes, compared each reading by `cmp` against row 74's step 3 readings, and printed "same" for K and M (row 77 report:238, :264, :266). It then states "38 of 38 same. Because K to P and G to O read byte for byte as before, their lines equal row 74's" (row 77 report:282), and prints K's and M's lines (row 77 report:285 to :286, :289 to :290). Those four lines are character for character the lines in row 76's report (:25 to :28).
- Row 77's readings were "all from the final form" of fix 2 (row 77 report:147), on a build whose readings are stamped `homr-web@0.2.0-ilya.7/465` (row 77 report:41).

So row 77 does establish K and M byte-identical under ilya.7, on the local dev server. The brief's clause "row 77 kept K and M's readings byte for byte, its report" (row 86 brief:17) is right.

Caveat: row 77 measured locally and says "The change is not committed or deployed" (row 77 report:312). The rehearsal on the alias is the first time K and M meet the deployed ilya.7, which is the point of a rehearsal. The expectation holds only if the alias serves a build equal to row 77's local one, which is what section 3 is about.

## 3. The reader stamp check, and whether the alias serves ilya.7

**What the stamp proves.** The stamp comes from `HOMR_WEB_VERSION` in `apps/web/src/lib/omr/stamp.ts`, which row 77 moved to ilya.7 (row 77 report:162). The brief's gloss "(row 77's tarball)" (row 86 brief:16) overstates it: the stamp proves the app's constant, not that the deployed package is the tarball with md5 `cf4b95db538887512fef2fe575d6fc67` (row 77 report:165), and not that fix 1 (`metre-witness.ts` and `join-pages.ts`, row 77 report:138) is in the build. A commit check proves those; the stamp alone does not.

**Whether the alias serves ilya.7: NOT ESTABLISHED from the inputs.** Row 76 established the alias at `8e74f39` with readings stamped ilya.6 (row 76 report:11, :13). Row 77 established the tree at `7bb929a`, nothing committed, nothing deployed (row 77 report:3, :312), and left the shipping step to Dann, who was to `git add` the tarball first (row 77 report:171). No input records a later ship. The task's context says row 77 shipped as `b80b543`; that is the desk's statement, not verified in any report read here. If the tarball was not added before that ship, the Vercel build fails on the lockfile's file reference and the alias keeps serving the previous deployment, stamped ilya.6; the stamp check would catch that case (Fable's knowledge of Vercel's behaviour on a failed build, not verified).

**Two gaps in step 1 as written.**

1. It asks "which commit" and sets a stop only on the stamp (row 86 brief:16). Row 76's step 1 named a commit to confirm (row 76 brief:17). Code will report a commit and carry on whatever it is. Amendment 1.
2. The stamp exists only on a reading, so "every reading carries the stamp" can only be checked after a drop. The brief does not say the check happens on K and M before any set 4 song is dropped. If Code drops 4A to learn the stamp and the stamp is wrong, a set 4 song has been read on the wrong reader before the stop. Amendment 2.

## 4. Does a dev server or Playwright on the Mac risk the uncommitted tree?

**Dev server: not needed, and the brief does not ask for one.** Every drop is on the deployed alias (row 86 brief:18), as row 76's were (row 76 report:18). Row 77's dev-server starts rewrote `.svelte-kit/generated` and stalled the first drop (row 77 report:45); whether that folder is ignored by git is NOT ESTABLISHED here, and it does not arise if no dev server starts. Amendment 5 says so in one clause, so Code does not start one for convenience.

**Playwright:** headless Chrome with a fresh context per song writes nothing into the tree. Row 76's harness copied scans under letters and deleted them after each drop (row 76 report:18); where those copies sat is NOT ESTABLISHED. If they sit in the tree's harness folder and a run dies mid-song, a scan is left under a letter in `docs/sessions/`. Amendment 5 puts copies in the private folder.

**The scorer:** `final-line.ts` under `tsx` and `conv.py` read tree files and write `keep`; the brief moves `keep` to `~/Downloads/_desk-heldout4-private/run/` (row 86 brief:19 to 20). Where the raw reading (`read.json`) and `conv.py`'s output land is not said; line 23 forbids readings in the harness folder but names no home for them. Amendment 5.

**The one tree write that overlaps the desk's:** `docs/memory/QUEUE.md`. Row 77 saw `QUEUE.md`, `OPEN.md`, and `PRODUCT.md` modified by someone else during its run (row 77 report:3). Two editors on `QUEUE.md` in the same hour is reversible but untidy. Amendment 6 confines Code to one line.

## 5. Can Code see song identities?

On paper, no. The brief forbids opening, viewing, listing, and printing any scan, truth, reading, or bar, and any file name (row 86 brief:18), names the glob so no `ls` is needed, and keeps `_reserve/`, `rt/`, and the parent folder out (row 86 brief:18). The "Known before the run" section describes shapes (bass clef, pickup bars, a third verse, a second language, grace notes) and names no composer, title, or opus (row 86 brief:27 to 30). The labels 4A to 4J in glob order give Dann the mapping without the brief carrying it.

Two channels the brief does not close:

- **stderr.** A truth file that fails to parse, a Playwright timeout, or a `tsx` stack trace prints the path, and the path carries the stem. Row 76's harness did not slip here, but the brief should say that script output other than the labelled lines goes to a file in the private folder. Amendment 5.
- **The report.** Row 76's report avoided names; the brief for row 86 asks for "the adapter" and "how" the commit was checked (row 86 brief:38), which is where a path could be pasted. Amendment 5 adds one clause.

Row 76's slip is carried by the same person: Code on this Mac saw set 3's titles once (row 76 report:65, row 77 report:320). Set 4 is a different folder with different files, so that knowledge does not reach set 4.

## 6. Is "stop and do not diagnose" intact?

Yes. "Then stop. Do not diagnose a BELOW song and do not open `keep`: opening a song is Dann's decision" (row 86 brief:34) is row 76's wording (row 76 brief:32). "The set gets one run" (row 86 brief:7) matches row 76 (row 76 brief:7). The report section asks for lines verbatim and "Could not establish" (row 86 brief:38). Nothing in the brief invites a second drop, a look at `keep`, or a cause.

## 7. Risks to the single run's repeatability and to the number

**7.1 The alias moving mid-run.** Row 76 could not establish that the alias still pointed at `8e74f39` after its one check before the rehearsal (row 76 report:14, :59). Row 86 inherits the gap unchanged (row 86 brief:16). The one thing that moves the alias is a push to `Shane`; rows 78a to 85 sit uncommitted and the desk is working in the same tree. Two cheap protections: Code records the alias's deployment ID and commit before the rehearsal and again after the total, and reports both; Dann pushes nothing to `Shane` between the two. The per-reading stamp protects only against a reader-version change, not against an app-only change (section 3). Using the deployment's own URL instead of the alias would freeze the build, but it is not the singer's path and whether it serves without sign-in is NOT ESTABLISHED (row 76 checked only the alias, row 76 report:12). Amendment 3.

**7.2 A stall scored as a refusal.** Row 77 saw drops that timed out at 10 minutes with no `[omr]` line, caused by a page reload under the dev server, and dropped each once more (row 77 report:45). Row 76 saw none on the alias (row 76 report:51). The brief scores "a refusal" 0 "exactly as row 55's step 4" (row 86 brief:21); row 55's definition is not among the inputs, so whether a stall before the reader starts counts as a refusal is NOT ESTABLISHED here. If it does, one cold start or network drop zeroes a song, the set is spent, and the total is wrong by up to a tenth. A stall that never reaches homr says nothing about the reader. Amendment 4 names the distinction and asks the desk to confirm it against row 55's step 4.

**7.3 Chrome drift.** `channel: 'chrome'` uses the Mac's installed Google Chrome, which updates itself. Neither row 76 nor row 77 recorded the Chrome version (row 76 report:18, row 77 report:41). The rehearsal catches a gross change in K and M, not a subtle one on a shape K and M lack. Repeatability needs the version on record. Amendment 7.

**7.4 The second-language songs.** Three of the ten print French or German under the Russian (row 86 brief:29). Row 77 found that homr reads the other language's split notes as extra notes, that nothing in its MusicXML tells the lines apart, and that no general rule was built (row 77 report:100 to :106, :151). Row 77's T lost 2.6 points on 14 such notes and stayed BELOW. The desk and Dann know this (row 86 brief:29) and Dann said proceed (row 86 brief:3). This is not a brief fault; it is a known downward pressure on three of ten songs with the set about to be spent. No amendment; the desk decides.

**7.5 The truth files.** Drafts by two helpers, not proofed by Dann (row 86 brief:30). Row 77 found six truth faults in set 3's X that cost it 4.2 points (row 77 report:49 to :55, :215 and :228). The same can happen here and the brief says so. No amendment.

## 8. Against the template

The template asks for a displacement line in every brief (BRIEF-TEMPLATE.md:37 to :41). Row 86 gives sequencing ("after row 85 reports", row 86 brief:3) and no displacement. Row 76's brief had none either. Amendment 8 adds one line. The template's other sections are built for a change brief; a measure-only brief with no cause slot satisfies its purpose (BRIEF-TEMPLATE.md:7 to :8).

## Amendments

Each replaces or adds wording in `brief-code-the-final-test-set4_r1_2026-10-12.md`. Line numbers are the brief's.

**1. Name the commit and stop on it.** Replace step 1 (line 16) with:

> 1. Confirm, as row 76 did (Vercel `get_deployment` and `curl -I`), that the deployed alias `https://ilya-git-shane-dannmittons-projects.vercel.app` serves commit `<COMMIT>` on `Shane`, READY, with `aliasError` null, and that `curl -I` returns 200 with no sign-in. If the commit differs, stop and report. Record the deployment ID.

The desk fills `<COMMIT>` from its own check; the inputs read here do not establish which commit carries ilya.7 (section 3).
Reason: the stamp proves the app's version constant only, and a run on an unnamed commit cannot be repeated.

**2. Check the stamp on the rehearsal, before any set 4 song.** Replace step 2 (line 17) with:

> 2. **Rehearsal** on K and M, exactly as row 76 (its `drop.mjs`, `rehearse.py`, and `rehearsal-lines.txt` in `docs/sessions/measure-final-test-set3_2026-10-11/`, with `SITE` set to the alias): their lines must equal `rehearsal-lines.txt` (row 77 kept K and M's readings byte for byte, its report lines 264 to 290), and both readings must carry the reader stamp `homr-web@0.2.0-ilya.7/465`. If a line or the stamp differs, stop and report. No set 4 song is dropped before both checks pass.

Reason: the stamp exists only on a reading, and the first reading must be an opened song, not a sealed one.

**3. Bracket the alias.** Add after step 5 (line 22):

> 5a. After the total, repeat step 1's `get_deployment` check and record the deployment ID and commit beside the first. Report both. Dann pushes nothing to `Shane` between the rehearsal and this check; if the deployment ID changed, say so in the first line of the report.

Reason: row 76 could not establish the alias held still, and a push during the run is the one way it moves.

**4. A stall is not a refusal.** Replace step 4 (line 21) with:

> 4. **A refusal** (homr runs and declines, as row 55's step 4 and row 76's step 4 define it) scores 0. **A stall** (no `[omr]` line within the timeout, as row 77 saw on its dev server) is a load fault, not a reading: drop the song once more in a fresh context and say so in the report; a second stall scores 0.

The desk confirms the first sentence against row 55's step 4, which was not among this review's inputs.
Reason: a drop that never reaches the reader says nothing about the reader, and scoring it 0 spends the set on a network fault.

**5. Everything but scripts and labelled lines goes to the private folder.** Replace line 23 with:

> 6. Keep the harness in a new folder `docs/sessions/measure-final-test-set4_2026-10-12/`: scripts (row 76's, copied) and the printed lines files only. Every scan copy, raw reading, `conv.py` output, `keep`, and all stderr from Playwright, `conv.py`, and `tsx` goes under `~/Downloads/_desk-heldout4-private/run/`, so that no path or stem reaches the terminal, the harness folder, or the report. No dev server is started; every drop is on the alias.

Reason: the brief forbids readings and names in the tree but names no other home for them, and a stack trace prints the stem.

**6. State the three tree writes.** Replace, in line 3, "this row writes only its own new folder" with:

> this row writes only three things: its own new harness folder, its report file in `docs/sessions/`, and one State line for row 86 in `docs/memory/QUEUE.md`, nothing else in `docs/memory/`.

Reason: line 3 and line 38 disagree, and the desk is editing `QUEUE.md` in the same tree.

**7. Record the versions.** Add to the report section (line 38), after "the adapter":

> the Google Chrome, Playwright, node, and `tsx` versions used,

Reason: Chrome updates itself and neither row 76 nor row 77 recorded it, so the run cannot be repeated on the same browser without it.

**8. The displacement line.** Add after line 3:

> Displaces: `<nothing, or the row that moves>`.

Reason: the template asks for it in every brief (BRIEF-TEMPLATE.md:37).

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Which commit the alias serves now, and whether it carries ilya.7.** Row 76 saw `8e74f39` with ilya.6 (row 76 report:11, :13); row 77 shipped nothing (row 77 report:312). "b80b543" is the desk's statement in the task, not verified in any input.
- **Row 55's definition of a refusal** (row 86 brief:21 cites it; row 55's brief was not read).
- **Where row 76's harness put scan copies and raw readings** (row 76 report:18 says copied and deleted, not where).
- **Whether `.svelte-kit/generated` is ignored by git** (row 77 report:45 names it; the tree was not read). Moot if no dev server runs.
- **Whether a Vercel deployment URL serves without sign-in on this team** (row 76 checked only the alias, row 76 report:12).
- **The Chrome version on the Mac** at rows 76 and 77 (neither report records it).
- **That the shipped tarball is byte for byte row 77's** `cf4b95db538887512fef2fe575d6fc67` (row 77 report:165). The stamp does not prove it; a commit check with the file in the commit does.
- **The desk's pre-check numbers** (1456 of 1456, 10 UNSURE, the planted control, row 86 brief:11 to :12). Not re-run here; row 76's report confirmed the desk's equivalent numbers for set 3 (row 76 report:47), so the report for row 86 can confirm these the same way.
- **How the scorer treats pickup bars and a third verse on its own staves** (row 86 brief:27). The desk's round trips test truth against itself, not the reader against the page.
- **The path of `conv.py`** (row 77 report:42 names it; no input gives its location). Row 76's scripts know it.
