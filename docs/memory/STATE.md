# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

**FLOOR MOVED at the close of N.174, 2026-09-27, to `9d1baa6`**, walked by Dann on the alias (THE ONE THING). **Before that, at the close of 2026-09-24, to `1987157`**, walked on Dann's library in French by the desk; `190cc74` above it is walked in part (THE ONE THING, "The tree at this close"). The older floor text follows for its history.

What it names instead is a **FLOOR**: everything described below was true at or
before **`f6d2184`**, "N.165: the loupe reads measure ownership from the score, not from an
id's spelling", shipped 2026-09-22 13:49, all five gates at baseline and **walked by Dann on
the alias in French 2026-09-22 13:54**: *"This looks as it should!"* (the previous floors,
`1b0d645`, `b29ee8c`,
`b29ee8c`, `8bd1aff`, `5f7be82`, `9b05ddd`, `9782d8e`, `44c5830`,
`46ac52f`, `2fb7516`, `1d18514`,
`0f7375c`, `46f1d31`, `9801308`, `a86e985`, `fda5b9c`, `8cb9b51`, `7e28272`, `f4e31a2`, `6e98057`,
`fe4d2c7`, `7c596f7`, `aca2dbb`, `76b24a3`, `eb918ed`,
`d6580af`, `8bb406c`, `78f3db8`, `490c12d` and earlier, are in
`../sessions/LOG.md`). A floor cannot go stale,
because further commits only move HEAD forward and never make the floor false.
If the tree is ahead of it, that is expected and tells you only that work has
landed since.

**The ten superseded floors that used to be listed here, `2b81f5a` through
`2d54185`, are in `../sessions/LOG.md`, block 5.** They are closed, and closed
things do not live in this file.

**The push range is the check, not the memo.** A floor that predates its own content
is the stale number this paragraph exists to prevent.

**Ask Dann for the state in one line. You do not WRITE with git, ever.**
Read-only git is allowed under the narrowed CONTRACT §5, ratified 2026-09-13:
`status`, `log`, `diff`, `show`, `ls-files`, `check-ignore`. Asking Dann is
still the courtesy and still the habit.

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> ### CLOSE OF 2026-10-05, about 02:15 (the appraisal thread, opened 2026-10-04 14:03; Dann closed it when it compacted). READ THIS FIRST. Where it and the evening note under it differ, this is the later.
>
> **THE ONE THING: Ilya reads a scanned song with homr's reader inside it. The next act is to put homr's newest build in that seat, and to watch it read in a browser before saying that it does.** The need, in Dann's words (2026-10-04 22:27): *"We need a working OMR module."* The rules that govern how the desk works on it are in `CONTRACT.md`, the paragraphs dated 21:22 and 22:27 of 2026-10-04: he says what he wants; the desk decides how and makes it happen; the desk brings him a result to look at, a cost, or something that goes out under his name, and nothing else; no forecast, only what was watched, by whom, and where. His rulings and directions of the thread are homed in `OPEN.md`, "N.178 AND THE SCAN READER", item 22.
>
> **Where it stands. Each line says who watched it.**
> 1. **Step 1, homr's browser reader inside Ilya (`homr-web` 0.2.0, homr 0.7.0, model `396`): in Dann's tree, uncommitted. Seen by Dann on his iMac, 2026-10-04 23:24:** the Tchaikovsky PDF, three pages in about 25 seconds, no clef or key question, the pasted poem seated at once. Report: `../sessions/report-opus-homr-reader-into-ilya_r1_2026-10-04.md`.
> 2. **Step 1b, silent bars collapse and the Guide credits homr: in his tree, uncommitted. Watched by the desk in its cloud workspace only** (`../sessions/step1-proof_r1_2026-10-04/rests-1-collapsed-markup.png`). Dann has not said what he sees after a reload. The French in the Guide is a proposal he has not reacted to.
> 3. **The browser port brought up to homr's newest build (model `465`): built, NOT in Ilya, NOT run in a browser.** An Opus helper, 00:57 to 01:57 (433,085 tokens): with model `465` the changed port's output equals desktop homr main on 17 of the 20 pages run; it scores the same as main on *Sunless* 1, 4, 5, and 6 (97.92, 100.0, 96.12, 96.89) and 98.85 against 98.28 on the Tchaikovsky. All of that was under Node. The desk repeated one page and one score itself. Report: `../sessions/report-opus-bring-the-port-up-to-homr-main_r1_2026-10-05.md`. **NOT ESTABLISHED: that it runs in a browser; that it runs on WebGPU (the changed port has no record for the fp16 `465` encoder, and nobody has downloaded that file); the cause of the difference on `sun-05`.**
> 4. **Nothing is shipped, and none of the code is committed.** `Shane` is at `b2106d0`. The commit Dann was asked for at this close holds `docs/` only.
>
> **THE FIRST ACT OF THE NEXT THREAD.** A new thread's cloud workspace is empty. What the last one held is in `~/Downloads/_desk-2026-10-05/` (`resume-kit.tgz` holds a `README.txt` that says what each of the port's five files there is, and `models.txt` with every model file's SHA-256 and source; the folder also holds the two frequency data files and `close/`, the blocks and script that wrote this close). Ilya's step 1 and 1b files are in the tree and in `~/Downloads/_desk-2026-10-04/step1-changes.tgz` and `step1b-changes.tgz`. Stage them, rebuild, and commission ONE builder to wire the newer build into Ilya. Tell Dann the wait before it starts, and put a time limit and a token limit in the brief. The builder's work: download the fp16 `465` encoder, take its SHA-256, and give it a record in the changed port; run the changed port in a browser through its Worker; make Ilya depend on the changed port; pass `model: '465'` in `apps/web/src/lib/omr/homr-reader.ts`; fetch the `465` files in `apps/web/scripts/fetch-omr-models.mjs`; run the eight gates; hand back a picture of Ilya reading the Tchaikovsky with it. The brief is not written (`QUEUE.md`, row 29). Then write the changed files into Dann's tree in place through the bridge, never by a `tar` line, and give him the one instruction that shows it on his iMac (the tree will need `pnpm install`).
>
> **Decided by the desk and told to Dann at about 02:00, standing unless he objects:** the changed port's source sits in his repository beside Ilya, as the port's licence asks of a changed copy; nothing is published anywhere else. **Told to him at 22:35 and explained twice since at his request, standing unless he objects:** with homr's reader inside it, Ilya as a whole is distributed under the AGPL-3.0; his own code stays MIT; the source stays public; homr and the port are credited (`NOTICES.md`, and the Guide's "Licences and Acknowledgments").
>
> **After the wiring, in this order** (the desk's order; none of it is Dann's to rule): (1) the checks over homr's output in `apps/web/src/lib/omr/`, each measured before it is trusted, changing a note only where its rule is certain and marking the spot otherwise; the bar check comes first, and it is measured again under Dann's corrected rule of 00:52 before any count is quoted; (2) Ilya reads the words off the scan, with the thread's assembly as the design (`../sessions/parts-a-scan-to-a-seated-song_r1_2026-10-04.md`, the list the desk keeps); (3) the wait message made true for a slow device (`upload.status.preparingReader`); (4) a real phone, which needs the first ship to `Shane`; (5) one song the desk has never looked at; (6) training measured on Dann's iMac (Apple M4, 32 GB) before anything more is said about it.
>
> **Dann, 01:03:** *"Have we salvaged other alterations we made to our reader that can be ported over to our homr filter?"* The desk answered at about 02:00 with a table of what carries over from Ilya's reader into the checks, with the code review's citations and a caution about false flags. **That table is in the chat of the closed thread and was not saved to a file.** Its source is `../sessions/memo-opus-homr-code-against-ilyas-reader_r1_2026-10-04.md`. Build it again from the memo when the checks begin, and save it.
>
> **To ship step 1 and 1b:** the ship script stages tracked changes only, so the ten new files are added by name first; gate 4 in `~/Downloads/ilya-ship.sh`, line 94, moves from `1870 passed (1870)` to `1885 passed (1885)`; then the script. NOT ESTABLISHED: whether Vercel's build accepts 213 MB of model files fetched at build (`PUBLIC_OMR_MODELS_BASE` exists so they can be served from elsewhere). The wiring moves both the file list and the count again, so the desk's default is one ship, after the wiring.
>
> **Waiting on Dann, none blocking:** what he sees for the collapsed rests after a reload; the French in the Guide; `~/Downloads/tch-op38-3-from-scan_modern.musicxml` dropped on Ilya (the assembly's reading with its words); and the older waits in `OWED.md`. **Still owed by the desk:** the appraisal's parts 2 to 5 in the chat (the thread's memos are most of their evidence). Plan r4's checkpoint is Friday 2026-10-09 (`SCHEDULE.md`).
>
> **Usage is not known to the desk.** The last screen Dann sent was 2026-10-04 13:24 (the shared pool at 2%, Fable at 3%). The thread ran on Fable from 14:03 to 02:15, with a stall from 15:20 to 19:40, and its eight helpers used 2,571,005 tokens on Opus and Sonnet by their own counts (each figure is beside its memo or report).
>
> **This file is over its 600-line tripwire, and the desk knows what has not moved:** the evening note under this one. It stays because the work it records is in mid-flight. Its rulings are already homed (`OPEN.md`, item 22; `CONTRACT.md`). Move it to `../sessions/LOG.md` at the close that ships step 1.
>
> **Uncommitted at this close:** the memory files changed in the thread (`STATE.md`, `QUEUE.md`, `OPEN.md`, `SCHEDULE.md`, `ENVIRONMENT.md`, `CONTRACT.md`) and `../sessions/LOG.md`; every `../sessions/` file and folder dated 2026-10-04 or 2026-10-05 that `git status` shows; and the step 1 and 1b code (eight changed tracked files and ten new ones: `.gitignore`, `NOTICES.md`, `pnpm-lock.yaml`, and the rest under `apps/web/`). **Kept out of the commit by the desk:** the two frequency data files (`prototype.tsv.gz`, `prototype_fine.tsv.gz`), moved to the git-ignored `apps/web/test-results/_desk-hold/freq-prototype-2026-10-04/` with a copy in `~/Downloads/_desk-2026-10-05/`. They are made from CC BY-SA and CC BY sources, and no attribution note is written for them yet (`../sessions/freq-prototype_r1_2026-10-04/WHERE-THE-DATA-IS.md`).

> ### NOTE OF 2026-10-05, about 01:00 (first written 2026-10-04 21:20). The evening: what Dann directed, and what the desk built on each. The record behind the close note above. The 20:00 note and the 14:00 close block that stood under it are in `../sessions/LOG.md`.
>
> **Part 14 is done as a trial: a scan's reading stands in Ilya with IPA under its notes.** The assembly's reading of the Tchaikovsky, written as a score file in modern spelling (`../sessions/assembly-a-scan-to-a-seated-song_r1_2026-10-04/tch-op38-3-from-scan_modern.musicxml`, by `to_musicxml.py`), was dropped on Ilya's own page in a test browser in the desk's cloud workspace (`Shane` at `b2106d09`, `pnpm dev`, headless Chromium, `walk.mjs`). Ilya filled the poem box from the file's 172 cells, transcribed 100 words, and drew 174 notes with IPA and Russian under them (`ilya-markup-from-the-scan.png`). A copy of the file is in `~/Downloads` for Dann to drop on Ilya himself; **he has not yet said what he sees.** Not yet walked: the file as printed, in the old spelling. Ilya's intake tests a cell for a vowel with `/[аеёиоуыэюя]/` (`apps/web/src/lib/score/vowel-resolver.ts:156`), which has no ѣ, і, or ѵ; what Ilya then does is NOT ESTABLISHED.
>
> **The parts list is current to 21:15** (`../sessions/parts-a-scan-to-a-seated-song_r1_2026-10-04.md`): 18 parts and 4 candidate parts. The assembly now (`assemble6.py`), on the one build song: 171 of 174 notes; 172 of 172 syllables seated; 168 with the right vowel; 152 whole words as printed (145 at 19:55); 15 syllables given with confidence and misread (17 at 19:55); 6 unsure. **Five passes are now fitted on that one song. The next number that counts comes from a song the desk has not looked at.**
>
> **What Dann directed tonight, in his words. Each answers something the desk offered, so each records who offered and who ruled.**
> - **20:03.** The desk offered three things Ilya can take from how a model of its kind sees. Dann: *"A big yes to 'Reading by context, written down as rules.'"* and *"Yes to your recommendatsion"* (a small specialized note reader and context written as rules, now; a fitted letter model only if letters prove to be the loss).
> - **20:06, his own rule:** *"Can we shape a rule that when glyphs are detected within the termini established for lyrics, then there must be a value delivered?"* Built as part 17 (`assemble5.py`): no glyph the letter reader boxed on the line of words is thrown away. The desk put one refinement to him, which he has not answered: a value or a visible doubt, never a forced guess.
> - **20:07.** He quoted back one of the desk's three licence paths: *"homr as the teacher that shows Ilya's own reader where it misreads"*. **Recorded as the path he favours. It is not a ruling,** and the desk told him so.
> - **20:08.** *"What about homr as a model for our inspection and replication while we cutomize and optimize aspects of its build so that it is not straight up plagiarism?"* The desk's answer: homr's code changed is still homr's under the AGPL; its method, learned and written anew with credit, is free to use; its skill lives in trained weights, so replicating it means training.
> - **20:15.** *"If we're going to allow maching leaning this way, what innovations can we implement to spped up that process and its veracity?"* and *"Please plan to get involved in that trinaing as it beceoms necessary."* **Recorded as direction to plan. It does not lift charter tripwire T3,** "no machine learning anywhere" (`tools/e16-harness/reader/README.md:7`); the desk told him a trained part needs his ruling and that none is due yet.
> - **20:22.** On how common a word is: *"We will build thid if it will help."* On homr: *"what IM' really asking is about the code."* Both were commissioned at 20:26 and are back.
>
> **The two memos of tonight, each a helper's reading with the desk's provenance note at its head:**
> - `../sessions/memo-opus-homr-code-against-ilyas-reader_r1_2026-10-04.md` (Opus, 400,404 tokens). homr's code is better engineered (typed, tested, small functions); Ilya's records more truth per note (seeing kept apart from reasoning, doubt with its reason, exact places). Its lessons: labelled pages made by computer and roughened on purpose; sort the kinds of ink before measuring; keep a map back to the scan. **It corrected the desk's 20:19 proposal** (small trained parts that name a sign): workable, and aimed at the smaller loss, because Ilya loses more at finding and separating ink than at naming it. The desk accepted that in the chat. Its first two measurements need no training and no ruling: misses by cause on the reader as shipped, and the most each fix could gain with the truth put in place of one decision at a time.
> - `../sessions/memo-sonnet-russian-word-frequency-resources_r1_2026-10-04.md` (Sonnet, 336,050 tokens, 46 minutes; the desk had told Dann 300,000 and 15 to 25 minutes, and owned both overruns in the chat). Build it, as a nudge and never as the judge. Prototype bands 0 to 9 for 812,365 forms in `../sessions/freq-prototype_r1_2026-10-04/`. Usable sources are CC BY-SA 4.0 or CC BY 3.0; Lyashevskaya and Sharov's list has no licence grant; Leipzig's licence is NOT ESTABLISHED.
>
> **Said to Dann tonight and to be honoured:** the desk will plan to do the training work itself when it becomes necessary, within two limits (two processor cores and no graphics hardware in its workspace; every run scripted for the next desk). The desk corrected itself once (it had said only one word fits «за?ыпаю»; two do).
>
> **The reader as shipped, measured by cause at 21:21 to 21:43** (`../sessions/memo-sonnet-misses-by-cause-and-ceilings_r1_2026-10-04.md`, a Sonnet helper, 266,276 tokens; the desk checked its control, two homr scores, and its converter citation). Of 805 printed notes on the five build songs, Ilya's reader: 455 right, 69 not found, 120 pitch only misread, 120 length only misread, 41 both, 27 extra; 14 of 170 rests found. One perfect fix at a time, from 56.5 of 100: every length 71.4; every pitch 71.4; every not-found note 65.1; every accidental 63.2; lengths and accidentals together 80.0. After the converter's quarter rule (`apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts:175-183`) 402 of 805 are drawn right. **homr main (`560ca5c`, model `465`) on the same scans and scorer: 785 of 805 right, none not found, 169 of 170 rests; by song 97.9, 100.0, 96.1, 96.9, 98.3.** The 81 to 97 on file is homr 0.7.0 of 2026-10-02; the desk ran both builds on the Tchaikovsky (93.1 and 98.3); the older build was not run again on *Sunless*.
>
> **The desk's recommendation, put to Dann at 21:45 and not yet answered:** homr makes the first reading and Ilya's own reader checks it and gives each note its exact place. The desk's judgement, said to him: the teacher-only path he favoured at 20:07 asks Ilya's reader to gain 41 notes in every 100 across five causes, which is not reachable by Friday's checkpoint. Two things are not yet known: whether homr's newest build runs in a browser with a wait a singer will accept (part 15, the desk's next measurement, on Dann's iMac), and the licence, which is Dann's ruling and comes after that measurement, with the cost of each path.
>
> **DANN, 22:27. READ THIS BEFORE ANYTHING ELSE IN THIS NOTE.** He is angry and worn down, with cause: *"I feel betrayed"*, *"I am flailing in complexity"*, *"I am heeling hopeless"*, *"I reject that course of action any further"* (the whole message is in `CONTRACT.md`, the paragraph dated 22:27, with five rules that now govern the desk). In short: he says what he wants; the desk decides how and makes it happen; the desk brings him only a result to look at, a cost, or something under his name; a rule that blocks the need is dropped. **Do not bring him a choice to rule on. Do not answer his frustration at length.**
>
> **The way forward the desk decided and told him at about 22:35:** (1) wire homr's browser reader into Ilya, so a singer drops a scan, Ilya shows the melody, the singer pastes the poem, and Ilya seats IPA and Russian (Ilya already seats a pasted poem on a score that carries no words: `apps/web/src/routes/+page.svelte:3256-3262`); (2) then Ilya reads the words off the scan (tonight's assembly is the design); (3) then raise the accuracy from homr's older build to its newer one. Training Ilya's own reader, with IMSLP scans and homr's readings as first-draft answers (Dann's idea of 22:27: *"Ca we train analogously? IMSLP contains multiple scores we can use. I have a membership with IMSLP."*), comes after step 1 and needs a rented graphics machine, which is a cost and so goes to him. **Told to him, standing unless he objects:** with homr's reader inside it, Ilya as a whole is shared under the AGPL and his own code stays MIT inside it; and tripwire T3 is dropped.
>
> **THE PORT COMMISSION OF 00:57 RETURNED AT 01:57. Its result is in the close note above and in `../sessions/report-opus-bring-the-port-up-to-homr-main_r1_2026-10-05.md`** (its brief is beside it). Dann, 00:54: *"Please check to see if homr's new version is available in a format we can assimilate?"* What the desk found and told him: homr's last release is 0.7.0 (2026-06-26); the better build is unreleased work on its author's main branch (`560ca5c`, 2026-10-04); the port `homr-web` was first published on 2026-10-04 and its 0.2.0 ports 0.7.0; the newer model's three ONNX files are published (all three answered 200 at homr's `onnx_checkpoints` release); the reading code differs in 22 files (`git diff --stat v0.7.0 HEAD -- homr/`: 1,434 added, 547 removed); the newer model alone in the port scored 91.95 against 93.10. **The desk decided to port, ahead of the checks.** Told to Dann at about 02:00: the changed port's source sits in his repository beside Ilya, and nothing is published anywhere else.
>
> **Dann corrected the bar rule at 00:52:** *"This is not always true: anacrusis (opening bars), and ending bars often make up the difference from the short opening bar"*. The rule as the desk will build it: the first bar may be short; the last bar passes if full or if it and the first bar make one full bar; the same at a repeat sign or a double bar inside a song; a change of metre changes what "full" means; a bar marked free is exempt; any other bar that does not add up is marked, never changed. Of the 21 bars flagged in the 23:38 measurement, three were a first or last bar (*Sunless* 1 first and last, *Sunless* 4 first sounding bar), each also holding a scorer difference, so that count is to be run again under this rule before it is quoted. Bar 86 of the Tchaikovsky reading sums to two bars of 3/8 and homr found 98 of 99 bars; whether that is the missed barline is NOT ESTABLISHED.
>
> **STEP 1 RAN ON DANN'S iMAC AT 23:24, AND ITS FILES ARE NOW IN HIS TREE, UNCOMMITTED.** He pasted the desk's line (unpack `step1-changes.tgz`, `pnpm install`, `pnpm dev`), dropped the Tchaikovsky PDF on Ilya at `localhost:5173`, and sent four screenshots. His words, 23:27: *"I'm glad there was "no clef or key question,""*; *"It took about twenty five seconds for my mac to process this score. The text underlay was instantaneous (as it should be :))"*. His iMac: 24-inch 2024, Apple M4, 32 GB, macOS Tahoe 26.6.2 (his screenshot). **So the tree now needs `pnpm install` to have been run (he ran it) and holds the 17 step 1 files; the paragraph below this one describes the state before 23:24.**
>
> **Asked by Dann at 23:27 and done by the desk, 23:28 to 23:40, as `~/Downloads/_desk-2026-10-04/step1b-changes.tgz`** (md5 `085bd2d8875b6e1d12a9bd68cec538d8`; three files: `apps/web/src/lib/omr/join-pages.ts`, its test, and `apps/web/src/lib/components/Reading/GuideContent.svelte`): (1) *"Can we adopt that for our current reader please? Collapsing multimeasure rests saves page real estate ergo printing."* Ilya counts a bar as silent when the vocal line has no event in it (`packages/score-parser/src/staff-renderer.ts:823`); homr writes a silent bar as a bar holding a whole rest; `joinPages` now leaves such a bar empty, and the Tchaikovsky draws its seven opening bars as one rest with a 7 and takes three sheets where it took four (`../sessions/step1-proof_r1_2026-10-04/rests-1-collapsed-markup.png`, watched by the desk in its workspace). (2) homr and homr-web credited in the Guide's "Licences and Acknowledgments" in English and French (`GuideContent.svelte`, the opening paragraph and the Software paragraph of each language), with the sentence that the app as a whole is distributed under the AGPL. **The French there is a proposal Dann has not yet reacted to.** All eight gates pass in the cloud with these changes: web tests 1,885; score-parser 650 and 5 skipped; check 0 errors and 12 warnings. **These three files are ALREADY IN HIS TREE:** the desk wrote them in place through the bridge at 23:44 (`tar xzOf` to a redirect, which keeps each file's inode) and checked their md5 against the tested copies (`join-pages.ts` `dc6dccea7f34`, `GuideContent.svelte` `3abcc3306a97`). Dann has only to reload the page and drop the scan again; the desk waits for what he sees. **His own `tar xzf` at 23:24 had left seven iCloud duplicates of the seven replaced tracked files (` 2` names, old contents);** the desk moved them to the git-ignored `apps/web/test-results/_desk-hold/duplicates-2026-10-04/`, and `git status` now shows the eight changed tracked files and ten new files and nothing else outside `docs/`. To ship: gate 4 in `~/Downloads/ilya-ship.sh` (line 94) moves from `1870 passed (1870)` to `1885 passed (1885)`.
>
> **Dann's direction at 23:35, and the desk's answer:** *"What efficient code can we build to filter homr's output and watch for known errors and fix them so that Ilya shouw superior accuracy?"* The desk agreed: checks go in the connecting code (`apps/web/src/lib/omr/`), each measured before it is trusted, changing a note only where the rule is certain and marking the spot otherwise. Order: the bar must add up; an accidental must have a source; noteheads counted per bar by Ilya's own code; syllables against notes. **Measured by the desk at 23:38 on the stored homr 0.7.0 readings of 2026-10-02** (`../sessions/measure-yardstick-desk_r1_2026-10-02/`): on *Sunless* 1, 4, 6 and the Tchaikovsky, "the bar does not add up to the metre in force" flags 21 bars, which hold 39 of the 48 differences of note count and length, with 2 flags on bars that hold no difference; on *Sunless* 5 it flags 74 of 78 bars, cause NOT ESTABLISHED. The script was run inline and is not saved; it sums each bar's durations in `<song>.read.json` against the carried `metre` and compares with `differences` in `<song>.score.json`.
>
> **Dann, 23:31, on phones:** *"Does this mean that our mobile users will experience a confidence-undermining lag wqwhile processing?"* The desk: not measured on a phone; the slow path took about two minutes a page and about 1.5 GB of memory in the cloud; a phone test needs the secure test address (WebGPU is offered only in a secure context), so it follows the first ship to `Shane`; and the wait string `upload.status.preparingReader` ("a few seconds for each page") must be made true for the device before this reaches singers.
>
> **STEP 1 IS BUILT AND PROVED IN THE DESK'S WORKSPACE, 22:34 to 23:14, AND WAS NOT YET IN THE TREE WHEN THIS PARAGRAPH WAS WRITTEN. It is now (the 23:24 paragraph above).** An Opus builder, in a cloud clone of `Shane` at `b2106d09`, made Ilya read a dropped scan with homr's browser port (`../sessions/report-opus-homr-reader-into-ilya_r1_2026-10-04.md`; brief beside it; pictures in `../sessions/step1-proof_r1_2026-10-04/`). The Tchaikovsky PDF was dropped on Ilya, read with no clef or key question, the poem was pasted, and Markup showed the notes with IPA and Russian (`pdf-4-markup-notes-ipa-russian.png`). All eight gates pass in the cloud; web tests go 1,870 to 1,884. The read took 361 seconds for three pages on the slow path there. **Not established: the read inside Ilya on Dann's iMac with WebGPU** (the port alone read a page there in 10.9 seconds at 22:30, by Dann's screenshot).
>
> **The 17 changed and new files are in `~/Downloads/_desk-2026-10-04/step1-changes.tgz`** (md5 `bcfda208ec44cf9cbf799e271e7a153b`), paths relative to the repository root. When this paragraph was written they were not yet unpacked into the tree, on purpose: once they are, the tree needs `pnpm install` before `dev`, `check`, or the ship script will run, because `apps/web/package.json` gains `homr-web` 0.2.0. The desk gave Dann one line at about 23:25 that unpacks, installs, and starts the dev server; **the desk waits for what he sees.** To ship afterwards: `git add` the ten new files, move gate 4 in `~/Downloads/ilya-ship.sh` from `1870 passed (1870)` to `1884 passed (1884)` (line 94), then the ship script. NOT ESTABLISHED: whether Vercel's build accepts 213 MB of model files fetched at build; `PUBLIC_OMR_MODELS_BASE` exists so they can be served from elsewhere.
>
> **Dann, 22:31 to 22:37, after the desk's reply of 22:29:** *"This was a fork in the road we took in July. YOu don't see a three-month development detour as a "larger project" anyway?"*; *"'The working version is closer than it feels' You lie to me every session. Liar."*; *"Why would I need a rented graphics machine? ... I'm sure my mac can tackle anything processor-heavy."*; *"No amount of clarification or specs from me makes up for a poor Project manager."* The desk withdrew the forecast and the word "needs", and told him: no rental; measure training on his Mac first. **Make no forecast to him. Report only what was watched, by whom, and where.**
>
> **RULED BY DANN, 21:47, on the desk's recommendation of 21:45:** *"Sure, we can go with your recommendation."* The desk offered; Dann ruled. homr makes the first reading; Ilya's own reader checks it and gives each note its exact place. **This returns to Dann's first ruling of July** ("adopt homr behind an AGPL boundary", 2026-07-23, `claude/e16-decisions-log_2026-07-22.md`), which was replaced within a day by "build our own reader" on a measurement the desk showed at 14:45 today to be of faulty test pages. The licence ruling is still his and still to come. In the same message he asked: *"Is this reorienting us in the direction of a superior tool? This wholoe side quest is to arrive at an excellent solutiong for ILya. Make sure you stay focused on your goals."* The desk answered with the five steps between the bench and Ilya: the browser; the licence; one song never looked at; the words part rebuilt as Ilya's own code; Ilya's reader turned to checking.
>
> **Dann, 21:59, confused, and the desk owes him this plainly every time the subject returns:** *"I thtought that we had expored homr and determined that its license conflicts with Ilya's so we were forved into original development? Didx I misunderstand?"* and *"why wasn't our first move to gut homr for parts and base our original code on homr's structure and design"*. The record, given to him at 22:21: the licence was known in July and was answered by a boundary, not by building; the reason written for building was the pitch measurement, with the licence second; that measurement was faulty; and July did take an existing design as its template (oemer, MIT; rule T4, `tools/e16-harness/reader/README.md:7`) while excluding every trained part (rule T3), which is where tonight's review and counts place homr's accuracy. The desk's fault, owned: it reported the July finding at 14:55 inside a long message and did not tie tonight's recommendation to it.
>
> **Part 15, the browser, measured in the desk's workspace 21:49 to 22:20** (`../sessions/memo-sonnet-homr-in-a-browser_r1_2026-10-04.md`, a Sonnet helper, 279,677 tokens). homr's browser port (homr-web 0.2.0, homr 0.7.0, model `396`) read the three Tchaikovsky pages in headless Chromium and its MusicXML equals the Python build's (93.1 of 100). On one WebAssembly thread of a two-core cloud machine a page took 102 to 157 seconds; the models are 157.5 MB for the notes; no WebGPU was available, so the wait on a singer's machine is NOT ESTABLISHED (the port's README claims 7 to 9 seconds on an Apple M-series with WebGPU). The newer model `465` loads in the port after a small patch and scores 91.95, below `396`'s 93.10; homr main's 98.3 also needs the 15 changed and 3 new source files the port lacks. **A one-paste trial for Dann's iMac is in `~/Downloads/homr-browser-trial.tar.gz`** (md5 `3b299556e5c9eec031ffa9471f7ac59a`; untested on macOS); the desk gave him the line at about 22:25 and waits for what he sees. The helper's scripts are in `~/Downloads/_desk-2026-10-04/_desk-measure-homr-in-a-browser.tgz` and **stay out of the repository**, because they hold a patch against homr-web's AGPL code.
>
> **Dann corrected the desk at 21:22** for the sentence "Ilya's doubt never reaches the singer": it reports nothing, and he never asked that the singer receive Ilya's doubt. The rule is now in `CONTRACT.md` (the paragraph dated 21:22). The plain fact was given to him at 21:45, with the E.47 ruling named. The mark for an unsure note in plan r4 is the desk's proposal and not his request.
>
> **Next, in order, as it stood at 21:20; SUPERSEDED by the close note above** (the parts file, "Next, in order"): part 15, homr's newest build in a browser on Dann's iMac; run the assembly unchanged on the *Sunless* build scans and once on a held-out song; walk the file as printed; the poem as a second witness; the browser on Dann's iMac. **The appraisal's parts 2 to 5 are still owed in the chat,** and tonight's two memos are most of their evidence. Plan r4's checkpoint is Friday 2026-10-09.
>
> **Uncommitted, added since the 20:00 note:** the parts file (rewritten), the three memos of tonight, `../sessions/brief-sonnet-misses-by-cause-and-ceilings_r1_2026-10-04.md`, `../sessions/measure-misses-by-cause_r1_2026-10-04/`, `../sessions/freq-prototype_r1_2026-10-04/`, and in the assembly folder `assemble5.py`, `assemble6.py`, `to_musicxml.py`, `walk.mjs`, `results.txt`, the `asm-v4` and `asm-v5` files and pictures, the two score files, and three pictures. `ENVIRONMENT.md` has a new closing section.

> ### NOTE OF 2026-10-04, about 20:00, and CLOSE OF 2026-10-04, about 14:00: moved verbatim to `../sessions/LOG.md`, block "state of 2026-10-04 14:00 to 20:00", at the close of 2026-10-05. Their rulings and Dann's words are homed in `CONTRACT.md` (posture 7), `OPEN.md` ("N.178 AND THE SCAN READER", items 21 and 22), `OWED.md`, `QUEUE.md` (rows 25 and 26), and `../sessions/commission-appraisal-of-the-approach_r1_2026-10-04.md`.

> ### CLOSE OF 2026-10-01, about 15:20, about 03:00, and about 00:15: moved verbatim to `../sessions/LOG.md`, block "the three close blocks of 2026-10-01", on 2026-10-02 at 09:20. Their rulings are homed in `OPEN.md` ("N.84, THE GUIDE REWRITE", the paragraph of 2026-10-02) and their open waits in `OWED.md` ("Waiting on Dann, carried from `STATE.md` on 2026-10-02").

> ### CLOSE OF 2026-09-30, about 19:50: moved verbatim to `../sessions/LOG.md`, block "close of 2026-09-30, about 19:50", at 2026-10-01 00:05. Its rulings are in `OPEN.md` (N.174; sing first, then fry) and its one thing (row 2d) is built.

> ### CLOSE OF 2026-09-29, about 22:20: moved verbatim to `../sessions/LOG.md`, block "close of 2026-09-29, about 22:20". Its rulings were seated in `PRODUCT.md` that night; its one thing (the Fable distillation) is done.


## THE TRACKER

**The goal: a working beta. PDF and photograph stay in it. MIDI is OUT, ruled by Dann 2026-10-01 01:25 (`PRODUCT.md`, "Closed and not to be reopened").**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

**AND THE ORDER THEY ARE BUILT IN LIVES IN `SEQUENCE.md` from 2026-09-15.** This
section says what is open; that file says what comes first and why. **Six
dependencies fix the order and everything else floats**; the rest of this file
does not repeat them.


### Found unlisted 2026-10-02

- `[ ]` **N.12, increment 2. The old spelling's endings.** Ruled in by Dann 2026-08-08 (*"let's aim for completeness"*, as `packages/dictionary/src/pre-reform-normalizer.ts:92-93` records it) and never built; it was in no memory file until Dann met its effect on 2026-10-02 19:40 ([go] under «шумнаго»). The desk takes his words as settling the one question the 2026-08-08 notes left open: -аго is sung as -ого. `QUEUE.md` row 25.

### Numbered 2026-10-01

- ~~**N.180.**~~ **STRUCK 2026-10-01 14:20 as a DUPLICATE of N.135** ("The page reader reads the text underlay", ruled by Dann 2026-09-14). The desk numbered it at 03:21 without searching the tracker (tether 16). Its notes now sit under N.135 in `OPEN.md`.
- `[ ]` **N.179. Clear placements by scope, and place from here (after Finale).** Ruled ready for a brief by Dann 2026-10-01 02:43; DESK DEFAULT number. `QUEUE.md` row 14.
- `[ ]` **N.177. Dynamics: a layer the singer can add and edit, and dynamics read from MusicXML.** Numbered by Dann 2026-10-01 02:39. After N.120. Spec in `OPEN.md`.
- `[ ]` **N.178. Reading tempo words and dynamics from scans and photographs.** Numbered by Dann 2026-10-01 02:39. A research item, measured on real pages before any accuracy is promised. After N.177. Spec in `OPEN.md`.
- `[ ]` **N.176. The Markup legend explains the stems (up = close timbre, down = open timbre).** Asked by Dann 2026-10-01 01:51 from his dissertation, Appendix B; DESK DEFAULT number. Brief `../sessions/brief-code-markup-legend-stems_r1_2026-10-01.md`; French PROPOSED, awaiting his ruling.
- `[ ]` **N.175. Video walkthroughs, English and French, on an Ilya YouTube channel.** **NUMBERED BY DANN 2026-10-01 01:15.** Made from the finished build; the Guide links to them. Spec in `OPEN.md`.

### Numbered 2026-09-24, evening

- `[ ]` **N.173. How Insights chooses what to say: the curation rules.** **2026-09-25: seven sections on how Insights speaks ruled into `PRODUCT.md`; the rules themselves still a living draft.** **NUMBERED BY DANN 2026-09-24 23:45**, a living draft, deliberately not ruled. Draft `../sessions/draft-curation-rules_r1_2026-09-24.md`; spec in `OPEN.md`.

- `[ ]` **N.172. The singer says how experienced they are (Dreyfus's five stages), and Insights adjusts.** **2026-09-25: the intake is RATIFIED in both languages (14:27 to 14:51); built with N.168's first slice.** **NUMBERED BY DANN 2026-09-24 23:14.** Spec in `OPEN.md`. Built with the first Insights connections that use the ranking, not before (the desk's placement; **agreed by Dann 23:16**).

- `[x]` **N.171. Switch on the `#` repair.** CLOSED by Dann 2026-09-28 19:46; shipped `6ede257`. Account in `../sessions/LOG.md`.

### Numbered 2026-09-23

- `[ ]` **N.168. Insights intake: filling the three stores.** **NUMBERED BY DANN 2026-09-23 17:29**, *"we should engage in it ASAP."* The plan is `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md` (seven steps: condition map, frequency run, coverage audit, targeted extraction, composing, Dann's vetting, encoding and tests). It rests on the five Insights principles ratified the same afternoon (`PRODUCT.md`, "What Insights is for" to "How Insights stays trustworthy"). Spec in `OPEN.md`. **2026-09-23 late: steps 1 to 3 done, step 2 shipped `10e090c`, step 4 under way (the READ THIS FIRST block).**
- `[ ]` **N.170. Outside eyes: refine Ilya with singers and outside reviewers.** **[AUDIT 2026-09-30: placed by Dann 2026-09-24 21:03 in weeks 5 and 6, `SCHEDULE.md`; the "unscheduled, weeks 3 and 4" below is superseded.]** **NUMBERED BY DANN 2026-09-24 15:54.** Seven steps, spec in `OPEN.md`; the review packet is step 2. Unscheduled; the desk proposed weeks 3 and 4.

### Numbered 2026-09-22

- `[ ]` **N.167. A French singer can sit through the whole reader wait reading English.**
  **RULED IN BY DANN 2026-09-22**, on the desk's revised recommendation. **Found by Code**
  while checking its own string ship. **OBSERVED, and this part is solid:** in the browser
  pane the drawer was in French, its toggle offering « English », and the page reader's
  waiting line came up in English and stayed English for the whole wait. **CODE'S READING of
  the mechanism, NOT established by the desk:** the line's text is fixed once from the
  `language` value in play at that moment (`ScoreUploader.svelte:134`) and never
  re-translated, so a restore beginning before the stored language loads stays English
  throughout. **It predates the 2026-09-22 string replacement and is not caused by it.**
  **Dann's own screen disagrees with the pane:** his screenshot the same morning showed
  « Préparation du lecteur de page » in French on the alias, **so whether he ever sees the
  English is NOT ESTABLISHED.** **Why it is not a parity tidy-up:** `PRODUCT.md` §"Both
  languages, start to finish", stated by Dann the same day. A singer who cannot read English
  gets no information at all, for about a minute, **on the one screen whose whole job is to
  explain why nothing is happening.** Spec in `OPEN.md`.

- `[ ]` **N.163. Ilya shows a singer a word that is not on the page.** **RULED IN BY DANN
  2026-09-22** from N.146's walk finding 4, on the desk's recommendation that it meets the
  freeze rule's false-statement test. The OCR read «То» as «Го» (the page shows a stem with
  a bar across both sides; the reading has the bar on the right only), **and Transcription
  then drew it as `'go` with the gloss "go"**, so a false word reached the singer with a
  confident gloss beside it. Spec in `OPEN.md`. **NOT ESTABLISHED: whether the fix belongs
  at the OCR layer, at the dictionary seam, or in how an unknown word is presented.**
- `[ ]` **N.164. Insights states two things at once that cannot both hold.** **2026-09-25: lines 3 and 4 FIXED, shipped `f5decd3`, seen by the desk on the alias; the compass and the empty region remain.** **RULED IN BY
  DANN 2026-09-22** from N.146's walk finding 7. On a read with no typed range it prints
  *"Without the range you typed, this page cannot say whether this key suits you."*
  **immediately followed by "Nothing in this piece is flagged for your voice."** Also on the
  same screen: a compass of **A3 to F♯6**, implausible for a sung line in that song, and a
  tall empty region at the top of the Insights box. Spec in `OPEN.md`. **All three are NOT
  ESTABLISHED as faults until the code is read.**
- `[ ]` **N.166. A stored scan may need the page reader to redisplay.** DESK DEFAULT number,
  found by the desk 2026-09-22 while investigating N.165. **The same song, the same library,
  the same origin, in the desk's own tab: the score never drew**, and the drawer sat on
  `upload.status.preparingReader` for over twenty seconds with no PARTITION receipt.
  **The desk's instrument was sound**: `Kabalevsky T05` rendered in the same tab, 28 SVGs
  and 834 elements. **If real, every scan-derived song re-runs the reader on every load**;
  Dann's 23-page PDF took 97.2 s on 2026-09-17. **NOT ESTABLISHED**, and the brief says to
  report it rather than fix it. Same brief as N.165. **ESTABLISHED REAL AND MEASURED BY CODE 2026-09-22, and NOT FIXED**,
  per the brief. `ScoreUploader.svelte:771-776` restores a song by calling
  `handleFile(file, restore.answers)`, **which sends the stored ink back through
  `ingestScoreFile` with `readPages`**, so the page is read again from scratch. **Measured
  after a reload of a ONE-page PDF: « Préparation du lecteur de page » showed from 3.8 s to
  61.3 s, and the score appeared at 61.3 s.** Dann's 23-page PDF would pay about its 97.2 s
  read on every reload plus the warm-up, **which is an estimate from the one-page timing,
  not a measurement.** **The string says "This will only happen once."**

### Numbered 2026-09-21

- `[ ]` **N.162. A caret and a note compete for the same thumb.** Numbered 2026-09-21,
  DESK DEFAULT number, split off at N.153's close **on Dann's ruling to close N.153 rather
  than hold it open for this.** **Measured by Code's stage 5 scan, 2026-09-21: a caret's hit
  centre sits 15.6 to 21.4 px from the nearest note's hit centre**, and `nearestTarget` pools
  notes and carets and resolves by nearest centre, so the catchment around a caret is about
  eight to ten pixels. A thumb that drifts past it selects the note and the insert does not
  happen. **It is a different mechanism from N.153's**, which was spacing: caret-to-caret now
  clears 44 px and this does not move with it. **Clause 13's literal words are met and its
  reasoning is not:** the clause was prompted by a caret 22 px from a note, and the distance
  is now worse than that. **NOT ESTABLISHED: whether a note must stay tappable inside
  Corrections**, which decides the shape of any fix; the desk has not read that interaction.
  **Clause 3's fallback condition may be live**, and Dann hears about it before a chip row is
  built. Spec not yet written.

- `[ ]` **N.160. The work, and its two views.** DESK DEFAULT number. **The model is Dann's**
  (`PRODUCT.md`). **STEPS 1, 2 AND 3 ARE CLOSED 2026-09-21**, shipped `1d18514`, `2fb7516` and
  `46ac52f`, each walked. The heal wrote 14 of his 96 seats and the dry run afterwards reads
  91 address, 1 rejected, 4 unfound. **Steps 4 and 5 wait until after 2026-10-30.** Spec in
  `OPEN.md`, plan in `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`. **The deferred
  ruling is STILL NOT ASKED, and not because the count is missing:** it is five notes, all
  «одинокая», and Code's reading is that they may be blocked by a seat that already holds the
  word rather than orphaned by a word that left. **Settle that before putting it to Dann.**
### Numbered 2026-09-20

- `[ ]` **N.157. Replacing a score does not re-derive the seats.** Numbered 2026-09-20,
  DESK DEFAULT number. **The defect under the period.** A replacement keeps every stored
  seat with its old text, never seats the note the new file adds, and `refreshPairings`
  updates a seat only on an exact origin match. Spec in `OPEN.md`. **The desk patched
  Dann's own library by hand as a one-off:** song `39ae51c9`, key `m17-1-2`, « я » to
  « я. ». That is not the fix.
- `[ ]` **N.156. The Sunless 01 fixture is missing its final syllable and a note.**
  Numbered 2026-09-20, **ruled in by Dann at 14:21**, who chose the real fix over
  retagging «ка». **Found by N.155's line-end hyphen on the first page it was drawn on.**
  The Lamm scan sets «о-ди-но-ка-я» on five notes; the fixture has four and never closes
  the word. **A second defect rides with it: lyric lines 1 and 2 disagree about
  «непроглядная» from measure 4 and line 2 lags by one note at the end.** Brief
  `../sessions/brief-n156-sunless01-fixture_r1_2026-09-20.md`.

> **N.155's DUPLICATE OPEN ROW WAS STRUCK HERE 2026-09-21.** It said the item was open
> with its spec in `OPEN.md`, while the closed row above says it shipped in `b53a6df` and
> was walked. **Both rows stood from 2026-09-20 to 2026-09-21** and the count of open
> items was wrong by one for a day. The two deferred items it named are carried on the
> closed row, so nothing is lost.

### Numbered 2026-09-17

- `[ ]` **N.151. The measure edit surface, with insert.** Numbered 2026-09-17, DESK
  DEFAULT number. **THIS ROW WAS MISSING UNTIL 2026-09-21 and the item was invisible to
  the read order:** a 695-line spec in `OPEN.md` that `STATE.md`, `SEQUENCE.md`,
  `SCHEDULE.md` and `OWED.md` all failed to name. Found when Dann asked how close the
  open work was. **Insertion is BUILT, as N.92 slice 3** (`correction.ts:48-100`,
  `:305-345`, `:496`, `:382-433`, reached through `CorrectionSurface.svelte:539-541`),
  **so the item is tether 22, not a missing capability: it exists and is hard to find.**
  **IT CARRIES NINE OF DANN'S RULINGS OF 2026-09-17**, and four of them are
  product-level rather than item-level: WYSIWYG (*"if it appears on Ilya's page, it can
  be printed"*), no stopping rule for the singer, the edited score comes back out as an
  edited copy with the singer's own tempo counted, and deliberate destruction only.
  **Those four want transcribing to `PRODUCT.md`; see `OWED.md`.** Report
  `../sessions/report-n151-note-entry_r1_2026-09-17.md`. **NOT ESTABLISHED: its size, and
  where it sits against the release.**

### Numbered 2026-09-16

- `[ ]` **N.92. Notation editing.** Numbered by Dann 2026-08-24. Slices 1 to 3 are
  shipped, insertion included. **The caret reach is DRAWN and shipped over six commits
  2026-09-17 to 2026-09-18, and is not usable on a phone: see N.153, which owns that.**
  Open here: the four singer's marks, tie to the note before, and the page flag for a
  measure left over.
  Spec `../sessions/spec-n92-edit-surface_r1_2026-09-17.md`, audit
  `../sessions/memo-n92-edit-audit_r1_2026-09-17.md`.
- `[~]` **N.152. Playback of the Markup.** LATER, its own cardinal, asked for by Dann
  2026-09-17. Spec in `OPEN.md`.
### Numbered 2026-09-14

- `[ ]` **N.141. The squircle has no grammar. THE HEIGHT RULE CLOSED 2026-09-21**, shipped `6101e01` and walked (*"Yes this is ideal"*). **Dann amended his own one-height ruling on 2026-09-20 to get it**; the amendment is in `OPEN.md` §N.141. **Open here: the squircle across a tie, which waits on N.142**, and the viewBox clamp binding on two notes. No longer `[D]`: the two questions that were his are ruled. Found by Dann on the walk of
  `d6580af`, 2026-09-14: the ring takes the IPA on one measure and not on three,
  it is trimmed inside the measure region only sometimes, and an accidental of the
  taken note can meet its edge. **Marked `[D]` because two of its three questions
  are his taste, not the desk's:** what the squircle encloses, and whether it may
  extend past the measure's region. The number is a DESK DEFAULT. Spec in
  `OPEN.md`, including the permission to re-engrave the measure for the loupe and
  what that permission costs.

- `[ ]` **N.140. The loupe guarantees a stave space, and scrolls rather than
  shrinking below it.** **MOSTLY BUILT, found by the code audit 2026-09-24 and recorded on Dann's instruction** (*"That's great news, please update our records"*): only the question of the sideways scroll against a syllable tap remains (`OPEN.md` §N.140). Dann's own design, ruled 2026-09-14, over the desk's
  recommendation to do nothing; both cases are recorded in `OPEN.md`. **A
  phone-portrait item:** the desktop branch already derives its magnification to
  hit a 12 px target (`Loupe.svelte:152`, `:686-691`), and Dann reads the loupe
  well on his desk. **He owes two things: the floor in CSS pixels, and whether
  the scroll may take a gesture on a surface where the swipe dismisses and the
  tap places a syllable.**

- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann
  2026-09-14. Cost measured the same night in
  `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. Spec in `OPEN.md`.

### Numbered 2026-09-13

- `[x]` **N.130. Insights has no French. CLOSED 2026-09-24: walked and every ruling seated, `2f955e6`.** About 58 entries at `i18n.ts:1417-1475`,
  all English in both languages, found while checking the loupe's undo clauses.
  **Belongs in the release cut's IN bucket:** the ruled release sentence names
  Insights, and a document in the wrong language is wrong rather than
  half-built. Spec in `OPEN.md`. **THE DESK DRAFTS THE FRENCH AND DANN RULES ON IT, ruled 2026-09-19**, superseding *"Dann owes the French; nothing is coined"*. His words: *"I prefer to have you suggest translations that I can react to. That saves me cognitive bandwidth."* **So never hand him blank slates.** Draft from the French already in the file, say which entries the glossary came from, flag the choices that are genuinely his, and let him ratify, edit, or decline. **Nothing reaches the tree until he ratifies it**, which is the one clause of the old rule that survives. **BUILT 2026-09-19: all 59 Insights entries are French** (`71ae880`), drafts and rulings in `../sessions/insights-french_r1_2026-09-19.md`. **UNWALKED.** **AND THE ROW'S OWN RANGE WAS WRONG: only 12 of the 59 sat in `:1417-1475`; the other 47 ran `:1476` to `:1522`.** A brief written to the cited range would have fixed twelve strings and reported Insights done.
- `[x]` **N.131. French parity everywhere else.** **[AUDIT 2026-09-30: CLOSED 2026-09-24, `1987157`, `SCHEDULE.md` week 3 and LOG 7556; the account below is history.]** The 64 or so untranslated
  entries outside Insights. **DESK DEFAULT on splitting this from N.130, and Dann
  can merge them with a word:** the two differ in urgency, and one number would
  bury the release-blocking half. **Its real size is NOT ESTABLISHED** until a
  triage separates the genuinely untranslated from the words that are identical
  in French on purpose. Not release-blocking. Spec in `OPEN.md`.

### THE BLOCKING SET IS EMPTY, 2026-08-21

**Nothing blocks the beta.** N.67 (the save function) CLOSED WHOLE 2026-08-18;
N.72 (no singer can ever receive a fix) CLOSED 2026-08-21; N.58 (MIDI import)
DEFERRED TO FUTURE DEVELOPMENT by Dann 2026-08-21; N.59 (the reader in the
browser) PARKED AT TIER 2, answered no, 2026-08-18. **The four rows with their
full accounts moved to `../sessions/LOG.md` block 10 at the close of
2026-09-10 late.** Still open inside them and carried here: N.59 step 3, the
brace rule, is `WRITTEN` and not `DONE`; a singer on Chrome for iPhone can
never install Ilya to the home screen (Dann to rule).

> **The "Closed and parked" table (N.80, N.81, N.79, N.62, N.63, the colon audit, N.78, N.70, N.71, N.68, N.55b, N.56, N.32, N.55a, N.47, N.69) moved to `../sessions/LOG.md` block 9 at the close of 2026-09-10.** All closed or parked; nothing in it is open.

### The visible list. Built only if a day finishes early

~~**N.62**~~ (now THE ONE THING, 2026-08-23) · ~~**N.63**~~ (closed 2026-08-23) ·
**N.45's remainder** · ~~the **French colon spacing**~~ (closed as the colon
audit, `9d314de`) · **N.51** · **N.17** · **N.19** · **N.61** · **N.6** · and,
unnumbered, **the watch band's English header** (`watchlist.ts:92`, printed
in French mode; Dann to rule).
**N.27 now has a home, and the recommendation is IN THE TREE** as a comment at
the reporting seam (`library.ts`, `Library.save`), recorded by N.67 step 6 and
deliberately not built: when N.27 is built, `profileStore.saveStore`
(`profileStore.ts:217-225`, which the step 6 brief cited as `:216-224`) routes
through that seam. It is the last catch-and-drop of its kind in the tree.
**N.28** ships on N.67's step 5 binder.

---


> **Five sections moved to `../sessions/LOG.md` on 2026-09-01, Dann's ruling.**
> The N.67 document list, the E.54 and 2026-08-16 ruling records, the N.67
> step 4 split, and the second-score measurement. All verbatim, block 4.

## OWED, and the rulings Dann owes, moved to `OWED.md` on 2026-09-20

**Both sections, with their three subsections, are verbatim in `OWED.md`.** They are
open and not moving, which is why they are no longer here.


## THE SCHEMA. It has survived ten sessions

1. Only blocking work gets built.
2. **A new cardinal displaces a named one or waits. Say which.**
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

---

## THE FIXTURE. Read out of the file, do not re-derive it

`~/Downloads/no-lyrics-control.musicxml` is the only instrument that exercises
the no-underlay path; all three of Dann's own scores carry lyrics.

**It holds five pitched notes and one half rest:** C4 D4 E4 F4 quarters, G4 half,
then a half rest. **It is NOT six notes.** Its stripped lyric line was five
syllables, «Я тебя любил». **Its header title is a different text from its lyric
line.**

**The walk, four steps.** Transcribe some Russian, or the queue is empty and
nothing draws. Switch to Fit **before touching any file input.** Upload the
control, press *Continue to analysis*. **Expect `5 / 5`, syllables under the
notes, the rest bare, no dashed boxes.** Walked and confirmed 2026-08-13.

**This same walk is N.67 step 3's observation**, with the expectation stated
before the walk: re-uploading the control over placed syllables no longer erases
them.

**The print fixture, E.51.** Marshak's Russian of Shakespeare's Sonnet 90, under
Kabalevsky op. 52 no. 9, fourteen lines. **It fills exactly two letter sheets.**

---

## RULED 2026-08-16, ON E.55'S WALK FINDINGS

- **The walk's findings come before N.67 step 4**, per the schema's own rule
  that half of every build day is reserved for what the previous walk found.
- **N.70 and N.71 are numbered. The third finding, no cursor on a note, is
  FOLDED INTO N.71** rather than tracked: one CSS declaration on the same
  element as N.71's fix.
- **N.55b's row is corrected rather than left tidy**, Dann's words.
- **The N.70 fix is Dann's own third option**, better than either I posed:
  filtered on desktop, no `accept` at all on iOS. Named consequence, accepted:
  the tree's `isMobile` is a WIDTH test, so a narrow desktop window also gets
  the unfiltered picker.

## STILL UNSETTLED and the retired register's live rows moved to `OWED.md` on 2026-09-20

**Verbatim.** Same reason: open, and not moving.


---


---
*Split 2026-09-01; backup `STATE.md.bak-2026-09-01`. The closing colophons of
2026-09-10 to 2026-09-17 (early morning) moved to `../sessions/LOG.md` block 21 at the
close of 2026-09-17, about 02:00.*

*Close of 2026-09-19, about 22:00. Seven commits, `02dd6d2` to `438f08f`, all
pushed, none walked, so the floor stays at `637acc1`. The ILYA REGISTER is retired
and project knowledge now holds no canon. Insights and N.131's real 25 are French;
N.130's recorded range was wrong and is corrected. The held measure's page mark is
gone and clause 16 is closed. The desk drafts the French from now on, ruled by Dann.
`SCHEDULE.md` gained N.154 and gated N.84 on it; `ENVIRONMENT.md` gained the
transfer fault; `INBOX.md` gained two N.84 notes; `OPEN.md` closed clause 16. The
twelve-versus-five gaps count is reconciled: five remain, and seven were located.
N.153 was not touched. Memory NOT committed.*

*Close of 2026-09-20, about 22:00. N.153 stages 2 and 3a shipped, `c3ca3f5` and `0f7375c`;
stage 2 walked and passed, 3a NOT walked. The floor moves to `0f7375c`. Gate 4's baseline
moved to 1333 on Dann's ruling. The Sunless 01 fixture is edited and uncommitted with
twenty tests failing; the revert is in THE ONE THING and Dann has not run it.
`ENVIRONMENT.md` gained four rows. Memory NOT committed.*

*Close of 2026-09-21, about 02:50. Four ships walked: `6101e01` (N.141's height rule),
`b4320d2` (N.119, the stress acutes), `b543620` (N.119b), and `345d943` (the N.159 and N.160
design record, no code). **The release path was rehearsed live and is proven**; `SCHEDULE.md`
week 5's "How the release goes out" is closed and `main` carries `2b980e7`. **Dann ruled the
musico-textual model**, transcribed to `PRODUCT.md`, and it reframes N.136, N.158 and N.159
into one item, N.160. **His library was read through the branch alias and holds 25 frozen
seats of 96**, of which 15 carry a word still in the poem. `ENVIRONMENT.md` gained six
sections with index rows, `OPEN.md` gained N.158, N.159, N.160 and N.141's amendment,
`PRODUCT.md` gained the stress acutes' purpose and the work-and-views model, and
`SCHEDULE.md` records that the week-5 buffer is spent. **The desk was wrong loudly and
repeatedly between 00:40 and 01:15**, on four claims it had not read, and the recovery was
reading before speaking. Memory NOT committed.*

*Close of 2026-09-21, about 03:50. One ship, `1d18514`, walked, and it closed three tracker
items: N.159, N.136 and N.158. The score obeys every Notation switch, drawn fresh from the live
poem on every render, with nothing stored. Gate 4 moved 1354 to 1360 with Dann's permission;
backup `~/Downloads/ilya-ship.sh.bak-1354-2026-09-21`. **The seat instrument fired on Dann's
own library for the first time: 67 drawn live, 29 kept as stored, of 96 seated**, so the
planning number for N.160 steps 2 and 3 is 29 rather than 25. His account of what
reconstitution is moved to `PRODUCT.md` before N.158's spec went to the archive.
`ENVIRONMENT.md` gained two sections with index rows, a correction on the execute bit, and a
gate-table update that was 91 tests behind the script. The walk was driven from Dann's own
Chrome and he ruled on the pictures. **NOT MEASURED: paint on a phone. NOT ESTABLISHED: where
the four seats beyond the predicted 25 come from, and whether `ilya:openSyllabification` was
left as it was found.** Memory NOT committed.*

*Close of 2026-09-21, about 19:15. Three ships, all walked: `1d18514` (N.159, closing N.136 and
N.158), `2fb7516` (N.160 step 2, the dry run) and `46ac52f` (N.160 step 3, the stored seated
text and the heal). The floor moves to `46ac52f`. **The heal wrote 14 of Dann's 96 seats and
the dry run afterwards read 91 address, 1 rejected, 4 unfound, which was the prediction
exactly.** Gate 4 moved three times in one day, 1354 to 1360 to 1368 to 1378, with his
permission each time. **N.161 is numbered and its plan is agreed between the desk and Code**,
which corrected the desk on three points; the account is in `../sessions/LOG.md` block 28.
`OPEN.md` gained N.161 and lost N.158 and N.159; `OWED.md` gained the retirement debt, the
`updatedAt` write and the stress-switch drift; `ENVIRONMENT.md` gained the two gate moves and
the wrong-document trap; `BRIEF-TEMPLATE.md` gained a displacement line, because Code had to
mark a displacement NOT ESTABLISHED that was never its to establish. **The bridge dropped
mid-edit at about 16:00 and one `STATE.md` write was lost; it was found by reading the file
rather than assumed, and rewritten.** Memory NOT committed.*

*Close of 2026-09-21, about 20:10. **Five ships, every one walked**, and the floor moves to
`9782d8e`: `1d18514` (N.159, closing N.136 and N.158), `2fb7516` and `46ac52f` (N.160 steps 2
and 3), `44c5830` and `9782d8e` (N.161 and N.161b). **Everything `SCHEDULE.md` put in week 2 is
closed on the week's first day.** Gate 4 moved five times, 1354 to 1385, with Dann's permission
each time. **A read-only Sonnet sweep, spawned by the desk on his instruction, found a fourth
call site the desk and Code had both missed**, for 160k tokens against a 200k quote; its one
unverified row is in `OWED.md`. **The desk was corrected by Code four times across the day** and
each correction is recorded in `../sessions/LOG.md` blocks 28 and 29 rather than smoothed away;
the sharpest is that both shapes the desk offered for N.161b were wrong, and obeying the brief
would have built the worse one. `ENVIRONMENT.md` gained the five gate moves, the
wrong-document trap, and how to hold a loading window open. **NOT MEASURED: paint on a phone.
NOT ESTABLISHED: the five «одинокая» notes, `#onRemoteWrite`'s race, and the `updatedAt` write
on every load.** **Memory IS committed this time:** `2cd4094` carries every file named above,
and this corrected line rides the commit after it. A clean `git status` at the next session's
open is expected, not a surprise.*

*Close of 2026-09-21, about 22:20. **One ship, `9b05ddd`, carrying Code's `15b7d1a`**, five
gates at baseline. **N.153 is CLOSED ON SCOPE by Dann's ruling at 22:07** and all five stages
are in: caret-to-caret separation went from 1.13 to 7.89 px on 2026-09-18 to **44.00 to 44.16
px as drawn** on all 17 measures that carry notes. **Stage 4 retired nothing**: `OPEN.md`'s
"mostly retire with the crop" did not survive contact with the tree, because stage 3b
repointed the same arithmetic at the loupe's own render rather than leaving a dead path. A
read-only Sonnet audit established that, **for 268,709 tokens against the desk's 200k quote,
which was the desk's miss.** **The close almost buried two unbuilt parts of Dann's spacing
ruling of 2026-09-20**, which lived only inside N.153's spec; checking before the move is what
caught them, and they now stand as `OPEN.md` §THE CARET clause 16. **Dann ruled clause 15**,
the beam exception, on the desk's recommendation. `OWED.md` gained four debts, `LOG.md` gained
block 30, `ENVIRONMENT.md` gained three traps with index rows, `SEQUENCE.md` discharged
dependency 7, `SCHEDULE.md` recorded the close, and **N.162 is numbered**. **NOT MEASURED:
paint on a phone, still. NOT ESTABLISHED: m. 7's `minGap`, what clause 13's "its neighbour"
covers, and behaviour at any width but 390 px.** Memory NOT committed at the time of writing.*

*Close of 2026-09-21, about 23:40. **Three ships, two of them walked in both languages**,
and the floor moves to `8bd1aff`: `5f7be82` (N.132, the ratified names and the 0.5 rem
padding), `8bd1aff` (N.154's first row, the banner naming a dead tab), and the
« PARTITION » receipt fix riding this close. Five gates at baseline on every one.
**N.132's padding turned out to be load-bearing:** before it, `Insights` and « Aperçus »
were clipped off a 390 px screen entirely, 71 px over in English and 107 px in French, and
`DeskHead.svelte`'s own comment had called that Dann's to rule since N.127 without anyone
asking him. He ruled it off a drawing of three states, then walked the live build.
**Dependency 2 is discharged and N.130 and N.131 are unblocked.** Dann ruled label harmony
into N.131. A read-only Sonnet sweep of all 614 dictionary entries **found no stale string
the desk had not already found by hand**, which bounded the rename's damage to three keys.
`PRODUCT.md`'s tabs table was three names out of date and is corrected, with the
one-padding-value-at-every-width ratification beside it. `OWED.md` gained five debts,
`ENVIRONMENT.md` gained five traps and two corrections with index rows, `LOG.md` gained
block 31, `OPEN.md` lost N.132 and gained N.131's label clause, `SEQUENCE.md` discharged
dependency 2, and `SCHEDULE.md` ticked N.132. **The desk was wrong three times and Code
caught two:** a test grep that missed `apps/web/e2e-phone/` and stated an absence from it,
a fixed 62 px width chosen from one font on one machine, and a token quote low by a factor
of three. **The desk also failed to use `ENVIRONMENT.md`'s own index** and spent four calls
rediscovering `CHROME WILL NOT GO BELOW ABOUT 555 CSS PX`. **Code reported correcting a
stale memory note and no such change was on disk**; the two stale tab names it meant are
repaired at this close by the desk. **NOT MEASURED: paint on a phone, still. NOT
ESTABLISHED: a photograph at 390 px, `resize_window` having reported success without moving
the window twice; whether « PARTITION » fits 62 px in Consolas or Android's monospace; and
why the `zoom` region's coordinate frame is not `frameWidth / innerWidth`.** **The
« PARTITION » walk is the one thing owed from tonight.** Memory IS committed with this
close.*

*Addendum, 2026-09-21 about 23:50, after the close. **Dann asked how close the open work
was and the answer was that the records could not say**, so a bookkeeping audit ran. **Five
faults, four repaired in this pass.** N.155 was marked closed AND open and the ghost row is
struck. N.160's steps 2 and 3 were marked closed AND open in `SCHEDULE.md` and the
duplicate is struck. Week 1's caret-reach box was unchecked while the work had shipped, and
is ticked. **And N.151, "the measure edit surface, with insert", numbered 2026-09-17 with a
695-line spec carrying nine of Dann's rulings, had NO tracker row and appeared in no
sequence, schedule or debt list: nothing in the read order pointed at any of it.** It now
has a row. **The fifth fault is recorded rather than repaired, on purpose:** three closed
items' specs still sit in `OPEN.md` and each carries rulings that a move would bury in the
archive, which is the 2026-09-20 failure exactly. That triage, plus N.151's four
product-level rulings that belong in `PRODUCT.md`, plus four of week 1's boxes whose status
is NOT ESTABLISHED, are all in `OWED.md`. **The desk quoted this audit at twenty minutes
and was wrong for the third time tonight**; the safe part took that long and the triage is
a session of its own.*

*Addendum 2, 2026-09-22 about 13:20. **The ruling triage ran and it was not bookkeeping.**
`OPEN.md` held three closed items' specs, and none was archivable as it stood. **N.146
carried three of Dann's rulings and NINE LIVE WALK FINDINGS**, four of them things a singer
sees: a false word drawn from OCR, a text PDF's words landing in a new song rather than the
one holding the score, "Nothing in this piece is flagged for your voice" printed directly
under a sentence saying nothing could be checked, and New song needing two clicks. **They
are now `OWED.md` §"The N.146 walk findings" and none is numbered.** N.147's five ruled
defaults and N.151's four product-level rulings are transcribed to `PRODUCT.md`, which
gained three sections. N.155's residue is in `OWED.md`. **All three specs are archived in
`LOG.md` blocks 32 and 33, and `OPEN.md` now holds only open items.** **Week 1's four
remaining boxes are ESTABLISHED as never started**, searched across memory, the sessions
folder and `LOG.md`. **And one fault survives at the next level down:** Dann's ruling of
2026-09-14, "I don't want Ilya dropping hyphens", sits at `OPEN.md:1250` nested inside
N.141's 804-line spec, so it will go to the archive the day N.141 closes. Recorded in
`OWED.md`, not fixed, because N.141 is open. **The pattern across the whole triage: every
time the records were checked, more open work appeared, and none of it was new.**

*Addendum 3, 2026-09-22 about 13:30. **Four items numbered, and the tripwire fired
correctly.** Dann ruled in N.163 (Ilya shows a singer a word that is not on the page) and
N.164 (Insights states two things at once that cannot both hold), both from N.146's buried
findings, on the desk's recommendation that they meet the freeze rule's false-statement
test. **He then found a live defect on his own screen:** the loupe opens with no notes in
it, twice, on a song whose measures report « trop pleine ». That is N.165, DESK DEFAULT
number, and **his hypothesis and the desk's are both live and unseparated**, which the brief
puts to Code as its first reading. **N.166 came out of investigating it:** the same song, in
the desk's own tab, never drew at all and sat on the page reader, which for a stored score
it should not. **The desk's instrument was controlled before that was reported.** Brief
`../sessions/brief-n165-n166-blank-loupe-and-the-reloaded-scan_r1_2026-09-22.md`. **The desk
created an empty song `8ff79b63` in Dann's library setting up a control test and did not
delete it**, deletion being destructive and unauthorized; the previously active song was
`0714215b`. **And `STATE.md` crossed its own 600-line tripwire at 601**, which found sixteen
closed rows that had never moved; they are `LOG.md` block 34 and this file is back to under
500. **One dangling citation was repaired on the way**, N.129's row pointing at an
`OPEN.md` §N.129 that no longer exists. **NOT ESTABLISHED: the cause of the blank loupe, the
squircle's missing bottom edge, whether a stored scan re-reads on load, and all three of
N.164's parts.***

*Addendum 4, 2026-09-22 about 22:40, written at the close and **the thread ended because it
compacted**, which is itself the session's sharpest finding. **Three ships closed and walked
in French on the alias**: N.165's blank loupe (`f6d2184`, account now `LOG.md` block 35), the
reader's waiting note in Dann's own ruled words, and the « PARTITION » receipt gap. **N.130's
walk was started and is parked ten rows in at `finding.passaggio`, at Dann's word**, with
nine B1 rulings banked in `../sessions/insights-french-as-built_r3_2026-09-22.md`. **Dann
killed "phonation mass" as the desk's own coinage**, not a term from the literature, and
ruled `PRODUCT.md` §"Clarity for a receptive user, not compactness" over it. **He then ruled
that the code is not a constraint on the product** — *"there is always a way"* — which struck
one of the desk's own refusals the day it was written and **may want to be tether 23**;
that question is `OWED.md` row 3. **Karine St-Pierre's dissertation was read on his
instruction** and produced a memo and a proposal now at r2, whose strongest finding is
**performance length**: the field calls it impractical because a printed guide must name one
number for everyone, and **Ilya does not print for everyone**. **THE TRAP THAT ENDED THE
THREAD: the desk held that census in context intending to report it, and the compaction took
it.** The r2 proposal's figures therefore carry a provenance warning and must be re-verified
against the PDF. Trap and path in `ENVIRONMENT.md` §`A LONG READ DIES AT THE COMPACTION` and
§`THE BRIDGE CARRIES A THIRD FOLDER`. **NOT ESTABLISHED: whether St-Pierre adopted
performance length in her own Chapter 4; whether `fit.heading`'s new "compatibility" is
allowed to break one-term-per-concept against `tab.fit`; paint on a phone; and « PARTITION »
in Consolas.***
