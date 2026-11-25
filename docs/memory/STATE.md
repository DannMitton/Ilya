# STATE — where we are

r1 draft, 2026-10-12. Updated at the close of every session; this is the handover. It holds only what is open. Closed rows, superseded floors, and the colophons of 2026-09-19 to 2026-09-22 are in `STATE-archive.md`, verbatim; the older archive is `../sessions/LOG.md`. Tripwire: over 200 lines means something failed to move.

Repository: branch `Shane`. **This file never names HEAD, and cannot.** It names a **floor**: everything below was true at or before the floor, and a tree ahead of it tells you only that work has landed since. **The push range is the check, not the memo.**

**Floor: `234eff3f`** (2026-10-27 14:07, Dann's ship of N.194 r5: the merge `fec528d2` of `cloud-lane-15` at `9b348b3e`, then the notes and the lever 2 report; all eight gates at baseline on the Mac, gate 4 3231; pushed; Vercel `dpl_5ZDB8Hf5jA68nCL5qY2LSD2mqYzT` READY, read through the connector 14:4x). Before it, `0d42e658` (2026-10-26 23:23, the Fable close; its docs-only build CANCELED by the Ignored Build Step, as set), `54c01bc3` (2026-10-26 21:54, N.198), and **`7d3ac4c0`** (2026-10-26 20:38, Dann's merge of `cloud-lane-13` at `a76ced77`, batch C, rows 139, 151, and the «ну-те» entry; all eight gates at baseline on the Mac, gate 4 3012; pushed; Vercel `dpl_9Zyhi8ukpdKNfj9LuWABvPMAV69T`). Before it, `71410f18` (2026-10-26 20:27, the Opus close), `de5e96d0` (2026-10-26 15:00), and `b488bef9` (2026-10-20 15:2x, Dann's ship: the merge of `cloud-lane-12` at `5840aae3`, rows 129, 133, 141, 142, 143, 144, 148, 149, with the desk's notes; all eight gates at baseline, gate 4 2943, gate 5 775). Before it, `dbb97773` (2026-10-20 11:56, Dann's ship: the fast-forward to `6d2bdcfc`, row 128, with the batch briefs and reviews; all eight gates at baseline, gate 4 2865, gate 5 756). Before it, `c68f9a0f` (2026-10-20 02:58, Dann's ship: the merge `209aaeb1` of `cloud-lane-11` at `d3bc6e4`, row 127; gate 4 2862, gate 5 756). Before it, `4e56cea8` (2026-10-19 23:28, the desk close). Before it, `885986ff` (2026-10-19 23:14, Dann's ship: the merge `7b448f52` of `cloud-lane-11` at `61c4e68`, rows 123, 126, 125, with the desk's late notes; all eight gates at baseline, gate 4 2850, gate 5 753). Before it, `99b78c08` (2026-10-19 21:4x, Dann's ship: the fast-forward to `a6f9e3a`, N.188 and row 121, with the desk's evening notes; all eight gates at baseline, gate 4 2847, gate 5 744). Before it, `ba6f0647` (2026-10-19 19:0x, the desk close). Before it, `e58fdabc` (2026-10-19 15:24, Dann's ship: row 108 with its follow-up, the hyphen Guide line, truth kit r2; the ship script commits only after all eight gates at baseline, gate 4 2842). Before it, `4f3bb38d` (2026-10-19 11:2x, Dann's ship: the merge of `cloud-lane-11` at `c838a04`, then the desk's close; all eight gates at baseline, gate 4 2802). Before it, `d3adabe` (2026-10-18 23:49) and `28ee53e0` (2026-10-18 18:50). The earlier floors, `f80836e7` (2026-10-18 18:43), `78bfb39` (2026-10-16 12:19), `01b638a` (2026-10-15 22:5x), `263aa48` (2026-10-15 22:37), `1e76bae` (2026-10-15 16:04), `b21ce8a` (2026-10-15 11:11), `0b0c52a` (2026-10-14 22:58), `6c69161` (2026-10-14 01:24), `1ec2ef2` (2026-10-12 23:32), `72b564f` (2026-10-12), `9f9e896`, `9d1baa6` (2026-09-27, walked by Dann on the alias), `1987157` (2026-09-24), `f6d2184` (2026-09-22, walked in French: *"This looks as it should!"*), and the thirty-nine before them, are listed in `STATE-archive.md` and `../sessions/LOG.md`.

Read the state yourself from the bridge and report it in one line; ask Dann only if the bridge cannot reach it (Dann 2026-10-20 12:32; `CONTRACT.md` §2). From the bridge:

```
git -C "$HOME/mnt/ilya-rewrite" --no-optional-locks --no-pager log -1 --format="%H %cI"; git -C "$HOME/mnt/ilya-rewrite" --no-optional-locks --no-pager status --porcelain
```

---

## THE SHARE (from 2026-11-09; this section wins over everything below it)
**CLOSE OF THE 2026-11-24 EVENING OPUS DESK** (the same desk that opened at 00:58, through one compaction; Dann present from 15:3x to 21:5x). **THE NEXT DESK STARTS HERE.** Closed at his question of 21:54, *"is this thread long? Should we close it and resume in a new one?"*, with the ruling on N.204's plan deliberately left to a fresh desk rather than answered tired.

**THE ONE THING: rule N.204's plan r10, and rule the audit's own gate first.** `DANN.md` D7. **The desk's challenge, put to him at 21:54 and NOT yet answered:** r10's done-when is twelve items, not the ten D7 names, and several (7, 9, 10, 11) are each a programme. Phases 2 and 3 have not started, the freeze is 17 December, and tonight two lanes took five rounds and an evening between them. **Ratifying the twelve as written most likely moves the date or erodes the done-when under time pressure, and the second is worse because nobody decides it.** The desk's recommendation: rule a gate for the audit first, as he did for the after-release list on 2026-11-22 against *"Ilya is fully functional"*, then sort the twelve against it. Items 1 to 6 and 12 largely serve a colleague reading the code; 7 and 11 are what make it inheritable and are the expensive ones. **His choice, in his words: rule the gate first, or ratify all twelve and let the date take the strain.**

**BOTH TIER 4 LANES ARE BUILT AND READY. NEITHER IS MERGED.**

**Lane 89, `cloud-lane-89`, ready to merge, nothing owed.** Four rounds. Fable: MERGE at round 3 (`../sessions/review-fable-lane89-round3_r1_2026-11-24.md`), and round 4 was a move, not a change. **Gate 4 `6853 passed | 5 skipped (6858)` on the lane, `6857 passed | 1 skipped (6858)` on the Mac, and GATE 4'S BASELINE IS ALREADY MOVED TO THAT FIGURE** in `~/Downloads/ilya-ship.sh:185`, backup `ilya-ship.sh.bak-6810-2026-11-24-evening`. **Dann's working tree holds an unpushed merge of the round-3 tip `2d3e8f9e` and has `review-fable-lane89-round3_r1_2026-11-24.md` STAGED**; his 21:39 and 21:55 ship runs both refused on gate 8. **The paste the next desk gives him starts with `git reset`**, because a true merge refuses with files staged (`ENVIRONMENT.md`), then fetch, merge, add, ship.

**Lane 88, `cloud-lane-88`, FINISHED at `9c21c74e`, AND ITS AS-BUILT READ IS OWED BEFORE IT MERGES.** Four rounds. Dann's gate ruling is built and **it gave the vowels back**: the four `strophic-repeat` files keep 32 vowels and 30 IPA in every verse, against 30 at round 2. Fix A with its new fixture `second-ending-verse-2.xml`, fix B, and pinned notes off the count before the gate are all in. Dann's ratified sentence is seated as `upload.banner.slurEvidenceUnchecked` and pinned character for character in `ingestion/ratified-slur-line.test.ts`, both languages, with a check that the French carries no straight apostrophe. **A desk ruling at the close: `{m}` is every sung note in the verse, pinned ones included**, because the ratified sentence promises two numbers a singer can count on her own page and she counts noteheads; narrowing it would repeat the fault Dann struck at 21:42. **The lane's own last run: gate 4 `6890 passed, 5 skipped (6895)`, ratchets OK, `svelte-check` 0 errors.** **GATE 5 MOVES TOO and its figure is NOT ESTABLISHED here:** the lane touches `packages/score-parser`, and at round 2 Fable read `913 passed, 5 skipped` there against the shipped baseline `911 passed | 5 skipped (916)`. **Take both figures from the lane's own run on its tip, not from this file, and move BOTH baselines in `~/Downloads/ilya-ship.sh:185` and its gate 5 line before giving Dann a merge paste.**

**WHY LANE 88 DID NOT MERGE TONIGHT, a desk decision at 22:2x, reversing one the desk had just proposed to Dann.** Fable last read this lane at `92c03cca`. Since then it has changed what a failed gate does, added fix A, changed what the gate counts, and seated ratified strings. That is a tier 4 behaviour change nobody independent has read. **Merging it unread to leave a tidy tree was the wrong trade, and a built lane awaiting its read is a clean handover.** **THE NEXT DESK'S FIRST JOB: a Fable delta read of `92c03cca..9c21c74e`**, then the two baselines, then Dann's merge paste. Only after that, THE ONE THING.

**THE RATCHET BREACH THAT COST TWO SHIP RUNS, and it was the desk's.** The desk told lane 89's round 3 to assert `firstOutsideRange` in a test under `lib/score`, and `score/` may not import `insights/` (`node scripts/ratchets.mjs`). Round 4 moved that half to `apps/web/src/lib/insights/rest-memory.test.ts` and folded the record-shape assertions into the existing nudge test, so the total is unchanged. **EIGHT CEILINGS COULD COME DOWN** in `scripts/ratchets.json` (Drawer, InspectorPanel, LearnContent, pipeline, ScoreUploader, pairings, CalibrationWizard, musicxml-parser). **The desk told both lanes to leave every one alone until both land**, because lane 88 touches some of those files. **That is the first small job after the two merges.**

**THE TEXT BATCH IS DRAFTED, EN AND FR** (`../sessions/text-batch-walk-2026-11-18_r1_2026-11-24.md`, md5 `2cf536bd`). Three items are the desk's and are drafted: "simply" out of the characteristics lede, "should" out of the suggestions question reset to its sibling's form, and the gender agreement fix. **One item is HELD and it is a finding, not a wording question:** the VOICE pane counts `usable` and MELODY's status line counts `sampledCount`, which the file's own comment says takes in provisional and unstable readings, so the word that names her own act labels the narrower figure and the word that sounds verified labels the wider. **NOT ESTABLISHED: whether the two numbers ever differ on a real profile. One measurement settles it and the wording follows; the desk owes that measurement.** Not built; wants a small text lane after the two merges.

**A STANDING RULE, from his words at 21:48** (*"you don't need me for this. this is a legitimate grammer issue on gender agreement"*): **French that is grammatical agreement rather than word choice is the desk's to fix and is not put to him.** His 2026-09-19 French ruling covers choices a competent speaker could make differently; agreement is not one of those.

**TWO DESK FAULTS OF THIS EVENING, both already recorded where they bite:** the desk defaulted over both the ratified melisma rule and Dann's own gate ruling and had to withdraw it (above, and `OPEN.md`); and it sent both lanes to read a Fable review "on the Mac", which a cloud lane cannot reach (`ENVIRONMENT.md`). **A third, smaller: the desk brought him a grammar fix that was its own to make.**

**HELPERS THIS EVENING, five, never more than two at once, every one inside its cap:** two as-built reads (~150k each), two round-2 delta reads (115k and 140k), one targeted round-3 check (75k of a 120k cap).

**AFTERNOON OF 2026-11-24, THE SAME OPUS DESK, CONTINUED THROUGH A COMPACTION (Dann back at 15:3x).** **THE NEXT DESK STARTS HERE.**




**DANN RULED, 15:4x: THE NUDGE COMES BACK.** A rest the reader found, made a note, nudged, made a rest again, then a note again gives back her pitch, not the arrival guess. Losing her work silently is the worse failure, and Corrections exists to hold it. Lane 89 pruned the record (`dead` at `correction.ts:457`) and pinned the loss in its own test (`entry.test.ts`, "rest to note and back, on a rest the reader found"); round 2 rewrites that test.

**TWO ROUND-2 BRIEFS, EACH ON THE LANE'S OWN EXISTING BRANCH:** `../sessions/brief-code-arrival-seam-round-2_r1_2026-11-24.md` (md5 `da35b5f5`) and `../sessions/brief-code-corrections-keeps-round-2_r1_2026-11-24.md` (md5 `5e7b394c`). **DESK DEFAULT: a fix round continues on the lane's own branch**, so there stays one branch to merge per lane and Dann creates no branch and pushes nothing.

**A DESK FAULT, named because it reached Dann as a decision.** The desk told him "DESK DEFAULT: the slur is the wrong gate for a melisma, a melisma is encoded by the absence of a syllable on the following notes". Wrong twice. The ratified rule in `brief-code-arrival-seam-closes-up_r5` is that **Ilya invents no melisma from absence** and a surplus note is a melisma only where the print says so; and the count gate's all-or-nothing shape is **Dann's own option 1**, named in the comment at `score/slur-seat.ts:55-61` (desk read it 2026-11-24 15:5x). The desk had no standing to default over either. **What Fable actually flagged is the gate's REACH:** `observedTargets` takes the gate over the whole song (`slur-seat.ts:63-66`), so one phrasing slur fails it and every slurred melisma in the file becomes unexplained and loses its vowel; n188 loses 4 notes, two of them slur ends. **That is Dann's to rule.** Neither brief touches the gate's shape.


**THE TWO GUIDE RESONANCE PARAGRAPHS ARE LOOKED AT AND THEY ARE RIGHT, so the desk's look is no longer owed.** Read on the READY Vercel build of `39b2096b` (`ilya-lj82d4e3u-dannmittons-projects.vercel.app`, which reports 2026b), in both languages: `guide-markup-how-ilya-reads` is the last paragraph of Voice characteristics, `guide-licences-method` sits between Scholarly research and Dictionary data, each a bold run-in paragraph in its neighbours' grammar, no heading, no contents entry. **ROW 206 came out of the same look:** the Guide's body text scrolls over the tab bar rather than under an opaque one, so MELODY and INSIGHTS cannot be read at most scroll positions, in both languages. **The alias `ilya.dannmitton.com` still serves 2026a:** `5594904b` and `736b1281` were CANCELED by the Ignored Build Step, as set, so `39b2096b` is the newest READY build and nothing has been aliased since.

**N.204'S PLAN IS r10** (`../sessions/plan-code-audit-maintainability_r10_2026-11-24.md`, md5 `92e6caec`), r9 with done-when item 3 rewritten and nothing else. It adopts Fable's wording A whole and strikes "both Playwright projects pass". **D7 in `DANN.md` now points at r10, and the desk owes nothing further on the plan.**



**DANN RULED THE COUNT GATE, 21:23: keep the gate whole, change what failing means** (`OPEN.md`, the RULED section under OPEN FOR DANN). The gate keeps its shape and its whole-verse reach; a failed gate no longer blanks every slurred melisma in the verse. Instead the verse is seated as `5594904b` seats it, no per-note abstention is written for it, and one record names the verse and says the slur evidence could not be checked against the count. **He took the named cost knowingly:** the page then shows a seating Ilya cannot defend note by note. **The desk had changed its own recommendation from 3 to 2 on the measurements and he ruled 3 anyway.** **OWED TO HIM: the one English sentence that record shows in Corrections, then its French draft.** **Lane 88 round 3 is building it**, with Fable's fixes A and B and one desk default (a note pinned as a mark alone or as a token with no Cyrillic letter comes out of the note count before the gate, as extender-held notes now do).

**LANE 88 ROUND 3 BUILT DANN'S GATE RULING, AND IT GAVE THE VOWELS BACK.** A verse whose gate fails now takes no per-note abstention and exactly one `slur-evidence-unchecked` record; where the gate passes or the verse holds no slur, round 2 stands. **Proof the lane committed:** a snapshot of what `5594904b` seats, compared against the current seating for all ten strophic files, identical. **`strophic-repeat` and its three siblings now keep 32 vowels and 30 IPA in EVERY verse**, where round 2 kept 30 vowels. Fix A built with a new fixture (`second-ending-verse-2.xml`), fix B committed, and pinned notes now come off the count before the gate. Gate 4 whole before the ratified strings: `6886 passed, 5 skipped (6891)`. **TWO DESK DEFAULTS, both confirming the lane's own reading:** "seat as `5594904b` seats it" means no abstention and no slur claims and does NOT undo the text re-deal, which is Dann's ratified rule and which a failed gate says nothing about; and on `n188-markings` a sustained vowel across the two vacated tail notes is the right outcome, because a failed verse falls back and one record names it. **The two gates still differ and the lane set out how** (scope, notes taken off first, which syllable count, what a failure writes, and where each runs); the seating gate serves wordless scores with a typed poem, so a lyric-bearing song is decided by the seam alone.

**OPEN FOR DANN:** the grace-stop landing in lane 89's repair 3 (after deleting the note before a grace note, a second Delete now removes the grace note, not the principal); whether MONOCHROME joins the eight skins or displaces one.


**CLOSE OF THE 2026-11-24 OVERNIGHT OPUS DESK** (Opus 5; opened 00:58 on Dann's standard opener, he was present throughout to 03:2x; seven helpers, never more than two at once). **THE NEXT DESK STARTS HERE.**

**Floor: `5594904b`** (2026-11-24 12:0x, Dann's ship: the true merge of `origin/cloud-lane-86`, 313 files and +286,692, then the night's remaining records; all eight gates at baseline on the Mac, gate 4 `6810 passed | 1 skipped (6811)`, pushed `39b2096b..5594904b`. **THE BEHAVIOUR BASELINE IS IN `Shane`. Both tier 4 lanes are unblocked.**) **The merge refused once, on a paste of the desk's that staged the new files BEFORE the merge:** a fast-forward tolerates a staged index and a true merge does not (`ENVIRONMENT.md`, A TRUE MERGE REFUSES WHEN NEW FILES ARE STAGED BEFORE IT). The order is `git reset`, merge, `git add`, ship. Before it **`39b2096b`** (2026-11-24 03:52, Dann's ship: lane 87 merged as a fast-forward `50315f2e..a2642dde`, plus the night's records; 26 files, +2052 -63, pushed `50315f2e..39b2096b`. **All eight gates at baseline on the Mac**, gate 4 at its NEW figure `6810 passed | 1 skipped (6811)` and gate 5 `911 passed | 5 skipped (916)`. **This ship carries code, so Vercel builds it; the deployment is NOT YET READ.**) **GATE 4'S BASELINE MOVED TONIGHT, by the desk, in `~/Downloads/ilya-ship.sh:185`:** from `6804 passed | 1 skipped (6805)` to `6810 passed | 1 skipped (6811)`, six tests added by lane 87's item 2. Backup beside it, `ilya-ship.sh.bak-6804-2026-11-24`; the execute bit was checked after the edit. **The first run of the paste refused on the old baseline and staged nothing, which is the script working as built.** **A desk fault, named because it cost two pastes:** the desk gave Dann the merge paste at 02:25 without moving the baseline first, although it had predicted the new figure itself at 02:2x, and then wrote twice that lane 87 was merged before reading `git status`.











**N.204 STEP 4: UNITS e AND f ARE READ.** `../sessions/read-fable-n204-unit-e_r1_2026-11-24.md` (37 files, 11,696 lines; 8 tier 4, 2 tier 3, 13 tier 2, 14 tier 1; 449,647 tokens, 50 tool uses, 18.5 min) and `..._unit-f_r1_2026-11-24.md` (55 files, 10,644 lines; 5 tier 4, 2 tier 3, 14 tier 2, 21 tier 1; 419,827 tokens, 42 tool uses, 16.3 min). **Both actuals are in `ENVIRONMENT.md`.** Nine Fable units remain.

**THE DUPLICATION CENSUS IS A FLOOR, NOT A MEASURE.** Each unit counted inside its own unit. Tree-wide on `50315f2e`: `gcd` has ten homes by the desk's count and eleven by unit e's; the Cyrillic vowel letters have 14 sites in 12 files **in two different sets**. Phase 0's tree-wide count is still owed.


**THE RULE THE ARRIVAL LANE IS BUILT ON, derived with Dann 2026-11-24 03:15 to 03:19, and it replaces a stack of rulings.** A syllable is a vowel with the consonants attached to it; nothing else is a syllable. **So one test decides every note: count the vowel letters under it.** None is a fragment that fuses to its neighbour by direction («знь» backward onto «жи», «в» forward, `#` backward). One is a syllable. Two or more are that many adjacent syllables, dividing between the nuclei and cascading right. **It needs no exceptions because sung Russian has no true polyvowel diphthong, only vowel plus glide, and the glide is a consonant** (Dann 03:18); `score/vowel-resolver.ts:159` already excludes «й». Then syllables are counted against sung notes: equal, seat; a surplus note is a melisma only where the print marks it; anything left in either direction is damage, counted and handed to Corrections, **which exists to give the singer agency to repair what Ilya cannot** (Dann 03:05).




**QUEUE ROW 51 IS RULED FINISHED, NOT DELETED** (Dann 02:35, `OPEN.md`). Its three modules are not dead: slices 1, 2, and 3 are built and the storage is wired, and nothing asks the singer. **DESK DEFAULT on the sequence, his to overrule: slice 5 rides with the audit's tier 3 split of `CorrectionSurface.svelte`, and slice 6 follows.** Its strings are ratified since 2026-10-08 and are in no i18n key.

**N.204 STEP 3 IS FROZEN AT r2** (`../sessions/n204-step3-scenarios_r1_2026-11-24.md`), fourteen scenarios. Dann answered six at 01:26, corrected scenario 2's premise about the vowels, and added the fourteenth himself: a teacher with several singers in a studio.

**MONOCHROME HAS A BOARD** (`OPEN.md`, MONOCHROME: A NINTH SKIN): https://claude.ai/artifact/GHwEqn9eQT7QyaGrG3wkjz, five artboards. **Its purpose is his, 01:44: an option for colourblind users**, which makes the non-colour second signal compulsory, so each band carries a rule of its own weight. **He ruled on the typefaces at 01:42 and the desk answered with IBM Plex Mono for the chrome and no change to the page**, both OFL. His verdict at 02:00: *"I love it."* Not ruled: whether MONOCHROME joins the eight or displaces one.



---



## THE ONE THING

Whatever the first paragraph under THE SHARE says it is. The closes of 2026-11-05, 2026-11-08 (evening and night), and 2026-11-09 moved to `STATE-archive.md`, verbatim, on 2026-11-14 (the 200-line tripwire).

## THE TRACKER

> **2026-10-14 22:26, Dann:** every `[~]` row below (shipped, not walked) is ACCEPTED without a walk as a one-time clearing of the backlog; walks resume for new work a singer would see that Dann has not seen (`QUEUE.md`, the note under "Shipped, not walked"). DROPPED the same minute: N.152 (playback) and N.175 (video walkthroughs), and QUEUE rows 6, 26, 31, 32. The Chinese translation question (INBOX 2026-09-30) was abandoned at 22:20.
> **The keep-or-drop walk of 2026-10-14 and 2026-10-15 (36 items) moved to `STATE-archive.md` on 2026-11-21, verbatim**, under `README.md`'s closing step 1. Its two rulings with no other home were rehomed first: N.28 and N.29 to `OPEN.md`, row 97's Guide pictures to `OWED.md`. Open items it kept are in the tracker below; the ones it dropped are gone.

Marks: `[ ]` open · `[D]` Dann's to rule · `[~]` shipped, not walked, or parked. Specs live in `OPEN.md` (from 2026-09-13); build order in `SEQUENCE.md` (from 2026-09-15; six dependencies fix the order and everything else floats); the week plan in `SCHEDULE.md`; debts and unsettled questions in `OWED.md` (from 2026-09-20). Every row below was checked against `git log` on 2026-10-11 19:40, and rechecked by the audit of 2026-10-14 (`../sessions/audit-memory-staleness_r1_2026-10-14.md`), unless its date says otherwise.

### Numbered 2026-11-13 to 2026-11-15

- `[ ]` **N.202. Ilya's name and its version** (the sigil carries the name alone; the version, 2026b, in the footer, the GUIDE, exported files, and the citation; the letter advances each time `main` moves). Ruled by Dann 2026-11-15 13:31; in the release; `PRODUCT.md`, last section; `OPEN.md`, N.202; QUEUE row 193.
- `[ ]` **N.203. VOICE: the intake, its summary, and its place in the DRAWER.** Opened 2026-11-15 18:3x on Dann's messages of 18:13 and 18:14; nothing ruled; the desk is questioning him one question at a time; `OPEN.md`, N.203.
- `[ ]` **N.201. The DRAWER's order** (REPERTOIRE first and folding, ANALYSIS its own band with NOTATION as its first row, a word tap opens ANALYSIS). IN THE TASK LIST, displacing nothing (Dann 2026-11-14 20:36); design: the board as amended by Fable's review. QUEUE row 188. `OPEN.md`, last section.
- `[ ]` **N.200. Ilya encounters the voice as it is** (the extractor measures without priors). `PRODUCT.md`; QUEUE row 186; Steps 0, 1, 2, 3, and 7 SHIPPED `93bf8394` 2026-11-15 (lane 52); Step 4, Dann at the microphone, is next.
- `[ ]` **N.199. The Calibrate redesign.** Steps 0 to 7 SHIPPED `d32429c1`; lane 53 running (QUEUE row 187); Steps 8 and 9 wait on N.200. `OPEN.md`.

### Numbered 2026-10-21

- `[ ]` **N.193. Ilya notices the piano staff's supports to the voice (a doubling, a dynamic, an accent first; a motif, an onomatopoeic passage, dissonance, and harmonic support later) and comments on them in Insights by bar number, drawing none of the piano part.** Asked for by Dann 2026-10-20 23:57; NOT for the 2026-10-30 release (ruled 23:59); DESK DEFAULT number. First brick QUEUE row 136. Spec in `OPEN.md`.
- `[ ]` **N.197. Ilya loads nothing from outside services at run time.** Ruled in 22:08; DESK DEFAULT number. QUEUE row 155, NOT WRITTEN; waits on Dann's answer about `?reader=ilya`.

### Numbered 2026-10-19

- `[~]` **N.188. The reader keeps a note's markings (accents, staccati, and the rest), and Markup draws them.** SHIPPED in `99b78c08` (QUEUE row 120); Dann's look at song 1 found bar 10 (row 126). Asked for by Dann 2026-10-19 12:51; DESK DEFAULT number. Spec in `OPEN.md`.
- `[~]` SHIPPED `eba49310` 2026-11-15 (lane 50, QUEUE row 190); not walked. **N.192. Markup draws a key change where the score changes key** (today only the first key is drawn, `staff-renderer.ts:1680`). Found by the audit 2026-10-19; DESK DEFAULT number. Spec in `OPEN.md`.
- `[ ]` **N.191. An ossia in the voice line is kept whole; the singer chooses, and Markup and Insights follow the choice.** Asked for by Dann 2026-10-19 13:28; DESK DEFAULT number. Spec in `OPEN.md`.
- `[ ]` **N.190. Markup draws the accidentals as the print prints them, courtesies and redundancies included, and Corrections can change only what is drawn.** Asked for by Dann 2026-10-19 13:09; DESK DEFAULT number. Spec in `OPEN.md`.
- `[ ]` **N.189. A system with no voice staff is the voice's bars of rest**, in the truth and in the reader. Found by Dann 2026-10-19 12:49; DESK DEFAULT number. Spec in `OPEN.md`.

### Numbered 2026-10-18

- `[~]` SHIPPED `eba49310` 2026-11-15 (lane 50, QUEUE row 190); not walked; three engraving collisions owed a brief. **N.187. Grace notes are drawn on Markup and editable in Corrections, and never counted in the bar's sum.** Ruled by Dann 2026-10-18 21:32 to 21:34; DESK DEFAULT number. The sum already leaves them out (`metre-witness.ts:169`); the parser drops them (`musicxml-parser.ts:706-708`), so nothing draws them. Finale's handling polled before the Corrections slice; Gould's pages owed by Dann as photographs. Spec in `OPEN.md`, "THE AUDIT OF 2026-10-18".

### Numbered 2026-10-11

- `[ ]` **N.184. Ilya reads the pre-reform spelling (ѣ, ѳ, ѵ, і) in a score's underlay.** Ruled in by Dann 2026-10-11 23:32 (*"We need this capability"*); DESK DEFAULT number. Plan: rows 81 (baseline, measured) and 82 (a fine-tuned Russian model, READY). Spec in `OPEN.md`.

### Numbered 2026-10-01

- `[ ]` **N.177. Dynamics: a layer the singer can add and edit, and dynamics read from MusicXML.** Numbered by Dann 2026-10-01 02:39. After N.120. Spec in `OPEN.md`.
- `[ ]` **N.178. Reading tempo words and dynamics from scans and photographs.** Numbered by Dann 2026-10-01 02:39. Widened to the scan reader; first reading by homr shipped `0976735`; tempo words and dynamics from scans are unbuilt. A research item, measured on real pages before any accuracy is promised. After N.177. Spec in `OPEN.md`.
- `[ ]` **N.175. Video walkthroughs, English and French, on an Ilya YouTube channel.** Numbered by Dann 2026-10-01 01:15. Made from the finished build; the Guide links to them. Spec in `OPEN.md`.

### Numbered 2026-09-24, evening

- `[ ]` **N.173. How Insights chooses what to say: the curation rules.** Numbered by Dann 2026-09-24 23:45, a living draft, deliberately not ruled. 2026-09-25: seven sections on how Insights speaks ruled into `PRODUCT.md`; the rules themselves still a living draft, `../sessions/draft-curation-rules_r1_2026-09-24.md`; spec in `OPEN.md`.

### Numbered 2026-09-23

- `[ ]` **N.168. Insights intake: filling the three stores.** Numbered by Dann 2026-09-23 17:29, *"we should engage in it ASAP."* The plan is `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md` (seven steps: condition map, frequency run, coverage audit, targeted extraction, composing, Dann's vetting, encoding and tests), resting on the five Insights principles ratified the same afternoon (`PRODUCT.md`, "What Insights is for" to "How Insights stays trustworthy"). Steps 1 to 3 done, step 2 shipped `10e090c`, step 4 under way. Spec in `OPEN.md`.
- `[ ]` **N.170. Outside eyes: refine Ilya with singers and outside reviewers.** Numbered by Dann 2026-09-24 15:54; placed by Dann 2026-09-24 21:03 in weeks 5 and 6 (`SCHEDULE.md`). Seven steps, spec in `OPEN.md`; the review packet is step 2.

### Numbered 2026-09-22

- `[ ]` **N.163. Ilya shows a singer a word that is not on the page.** Ruled in by Dann 2026-09-22 from N.146's walk finding 4, on the desk's recommendation that it meets the freeze rule's false-statement test. The OCR read «То» as «Го», and Transcription drew it as `'go` with the gloss "go". Spec in `OPEN.md`. NOT ESTABLISHED: whether the fix belongs at the OCR layer, at the dictionary seam, or in how an unknown word is presented.
- `[ ]` **N.166. A stored scan may need the page reader to redisplay.** DESK DEFAULT number, found 2026-09-22. Established real and measured by Code 2026-09-22: `ScoreUploader.svelte:802` restores by calling `handleFile(file, restore.answers)`, which re-reads the page (one-page PDF: 3.8 s to 61.3 s). Reloads are fast after the first since `bbe524b` (first reload 44 s, later 0.4 s; QUEUE row 38); the first-reload cost remains, and row 13's measure is still owed. The string says "This will only happen once."

### Numbered 2026-09-21

- `[ ]` **N.162. A caret and a note compete for the same thumb.** DESK DEFAULT number, split off at N.153's close on Dann's ruling to close N.153 rather than hold it open for this. Measured by Code 2026-09-21: a caret's hit centre sits 15.6 to 21.4 px from the nearest note's hit centre, and `nearestTarget` pools notes and carets by nearest centre, so the catchment round a caret is about eight to ten pixels. A different mechanism from N.153's spacing (caret-to-caret now clears 44 px). Clause 13's literal words are met and its reasoning is not. NOT ESTABLISHED: whether a note must stay tappable inside Corrections. Clause 3's fallback condition may be live, and Dann hears about it before a chip row is built. Spec not yet written.
- `[ ]` **N.160. The work, and its two views.** DESK DEFAULT number; the model is Dann's (`PRODUCT.md`). Steps 1 to 3 closed 2026-09-21 (`1d18514`, `2fb7516`, `46ac52f`, each walked); the heal wrote 14 of his 96 seats and the dry run reads 91 address, 1 rejected, 4 unfound. Steps 4 and 5 wait until after 2026-10-30. Spec in `OPEN.md`, plan `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`. The deferred ruling is still not asked: five notes, all «одинокая», which Code reads as possibly blocked by a seat that already holds the word; settle that before putting it to Dann.

### Numbered 2026-09-16

- `[ ]` **N.92. Notation editing.** Numbered by Dann 2026-08-24. Slices 1 to 3 shipped, insertion included; the caret reach is drawn (N.153 owned the phone). Open: the four singer's marks, tie to the note before, and the page flag for a measure left over. Spec `../sessions/spec-n92-edit-surface_r1_2026-09-17.md`, audit `../sessions/memo-n92-edit-audit_r1_2026-09-17.md`.
- `[~]` **N.152. Playback of the Markup.** LATER, its own cardinal, asked for by Dann 2026-09-17. Spec in `OPEN.md`.

### Numbered 2026-09-14

- `[ ]` **N.141. The squircle has no grammar.** The height rule closed 2026-09-21, `6101e01`, walked (*"Yes this is ideal"*); Dann amended his own one-height ruling on 2026-09-20 to get it (`OPEN.md` §N.141). Open: the squircle across a tie (no longer waits on N.142; counted zero 2026-09-24; no week carries it), and the viewBox clamp binding on two notes. DESK DEFAULT number. Spec in `OPEN.md`, including the permission to re-engrave the measure for the loupe and its cost. **His ruling of 2026-09-14, "I don't want Ilya dropping hyphens", sits at `OPEN.md:1396` inside this spec and must be rehomed before N.141 closes (`OWED.md`).**
- `[ ]` **N.140. The loupe guarantees a stave space, and scrolls rather than shrinking below it.** Dann's own design, ruled 2026-09-14, over the desk's recommendation to do nothing. Mostly built (code audit 2026-09-24, recorded on his instruction: *"That's great news, please update our records"*); only the sideways scroll against a syllable tap remains (`OPEN.md` §N.140). He owes the floor in CSS pixels, and whether the scroll may take a gesture on a surface where the swipe dismisses and the tap places a syllable.
- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann 2026-09-14. **Ruled a priority by Dann 2026-10-14 02:44**; the text it builds to is `OPEN.md`, "THE TEXT UNDER THE NOTES: A MIXED DEFAULT". Cost measured in `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. N.180's notes sit under it in `OPEN.md`. N.184 and row 81's row reader lean on it.

### Older open residue

- **Nothing blocks the beta** (2026-08-21): N.67, N.72 closed; N.58 (MIDI import) deferred by Dann 2026-08-21; N.59 (the reader in the browser) parked at tier 2, answered no, 2026-08-18. Still open inside them: N.59 step 3, the brace rule, is `WRITTEN` and not `DONE`; a singer on Chrome for iPhone can never install Ilya to the home screen (Dann to rule). Full accounts in `../sessions/LOG.md` block 10; the closed and parked table in block 9.
- **The visible list, built only if a day finishes early:** N.45's remainder · N.51 · N.17 · N.19 · N.61 · N.6. (The watch band's header was listed here as English in French mode; struck 2026-10-14 00:47 as stale: « À considérer », ruled by Dann 2026-09-28 19:48, is in the tree since `8127e01` at `apps/web/src/lib/i18n.ts`, key `watch.header`, drawn through `T()` at `MarkupPane.svelte:1032` and `:1034`, pinned by `watchlist.test.ts:557`. Dann re-ruled 2026-10-14 00:44 that it must offer French in French mode, which the tree already does.) **N.27** has a home in the tree as a comment at the reporting seam (`library.ts`, `Library.save`), recorded by N.67 step 6 and deliberately not built: when N.27 is built, `profileStore.saveStore` (`profileStore.ts:281-289`) routes through that seam; it is the last catch-and-drop of its kind. **N.28** ships on N.67's step 5 binder.
- Open work the rulings audit found not truant (N.84, N.120, N.123, N.122, N.115, N.117, the poem-box warning) is listed in `QUEUE.md`, "Open work, not truant".

---

## THE SCHEMA

1. Only blocking work gets built.
2. A new cardinal displaces a named one or waits. Say which.
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

---
*r1 draft of 2026-10-12, from `STATE.md` as of that date. What moved, and where, is in `../sessions/tidy-r1_2026-10-12/CHANGELOG_r1.md`.*

> **The tidy, 2026-10-12 about 14:50.** `CONTRACT.md`, `STATE.md`, `QUEUE.md`, and `README.md` were restructured by Fable into these shapes (drafts and change log `../sessions/tidy-r1_2026-10-12/`); everything moved went verbatim to `CONTRACT-archive.md`, `STATE-archive.md`, and `QUEUE-archive.md` beside them. Dann deferred the administrative choices to the desk at 14:48 (*"it is a managerial and administrative issue that I am happy to defer to you. If you need my ratification, you have it."*, typing corrected). The pre-tidy originals are in git history; the folder `_pre-tidy-2026-10-12/` is not on disk (desk check, 2026-10-14).