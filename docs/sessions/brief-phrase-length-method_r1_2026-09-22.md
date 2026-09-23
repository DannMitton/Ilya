# BRIEF. A defensible method for Ilya to estimate phrase length, in seconds, for the singer

**Written 2026-09-22 by the desk on Dann's instruction:** *"Build a brief that will research, analyze, synthesize, and build a defensible method for Ilya to estimate phrase length, and translate this into seconds for the user."*

**This brief produces a METHOD, not code.** The desk does not build (`CONTRACT.md` §5). The output is a specification Dann can rule on and Claude Code can build from. Nothing here is numbered; `CONTRACT.md` §3.1 holds.

**NOT ESTABLISHED beats a complete invented answer.** That sentence governs every section below.

**Ruled by Dann 2026-09-22 at 23:34, the purpose of this work:** *"this current work is at the service of enhancing Insights by way of providing more nuanced evidence for the user."* And he wants **Claude Code to collaborate on building the subroutine**, so write the method so that Code can build from it without re-deriving anything.

## 0. How you reach the files

Dann's computer is reached through the `mcp__remote-devices__*` tools (load them with ToolSearch if they are deferred). Run shell commands with `mcp__remote-devices__device_bash`; the connected folders are mounted at `$HOME/mnt/ilya-rewrite`, `$HOME/mnt/Voice Pedagogy Library`, `$HOME/mnt/Voice Pedagogy Research`, and `$HOME/mnt/Downloads`. `pdftotext` is installed there. **You cannot delete files there, and you must not try.** Write your output into `$HOME/mnt/ilya-rewrite/docs/sessions/` with a short python or shell write. Scratch files go in `$HOME` outside `mnt/`.

**Leaps are out of scope.** A separate brief covers them. If your research turns up a leap source, note it in one line at the end and move on.

---

## 1. Why this exists

Ilya's findings are all about single notes. **Breath is not a property of a note.** Three sources read on 2026-09-22 name phrase length as a demand on the singer:

- St-Pierre 2016, grid element "long phrases and long sustained notes", measured in seconds, citing Vennard (printed p. 76; extraction in `docs/sessions/st-pierre-extraction-A-chapters-3-4_r1_2026-09-22.md`).
- Nix 2002, p. 218: a singer not yet managing breath needs "phrases of various lengths and frequent rests"; p. 219-220 on "Deh vieni": "many extended phrases throughout the middle range at a slow tempo" (harvest in `docs/sessions/harvest-nix-2002-and-christensen-2024_r1_2026-09-22.md`).
- Fable's evaluation ranked it second of three (`docs/sessions/st-pierre-evaluation-C-fable_r1_2026-09-22.md`), and proposed segmenting on rests, citing St-Pierre p. 138 (rests placed "for breathing").

The target sentence, Fable's draft, for testing and not yet ruled: *"The longest unbroken phrase runs 14 seconds at your tempo, bars 22 to 26."*

---

## 2. What the tree already has. Verified by the desk 2026-09-22; re-verify before relying on it

- **Phonation time per pitch and per vowel is built.** `aggregatePhonation`, `packages/score-parser/src/phonation.ts:298`, sums sounding time into maps (`byPitch`, `byVowel`, `byPitchByVowel`, `:238-252`) in quaver-equivalents. **It sums; it does not keep order.** So it cannot see a phrase.
- **Rests are events and are counted, not used** (`phonation.ts:211-212`, `:360-361`). `VocalLineEvent.type` is `'note' | 'rest'` (`packages/score-parser/src/types.ts:450`).
- **Breath marks and caesuras are parsed for exactly this purpose and nothing uses them.** `types.ts:487` and `:599-611`: "v1 analysis primarily uses `'breath-mark'` and `'caesura'` for phrase boundary detection."
- **Quavers to seconds is built, with its caveats.** `secondsFor`, `phonation.ts:444`, reads the tempo through `resolveTempo` (the seam that honours a singer's own tempo), handles compound beats, and returns a seconds RANGE when the tempo was inferred rather than encoded. **Returns undefined when no tempo is stated. It never invents one.** Its doc comment (`:420-443`) lists four caveats that belong beside any seconds figure.
- **Untrusted bars are named, not hidden** (`PhonationTrust`, `phonation.ts:221-236`).
- **Where the seconds already surface:** `scoreMetrics` (`apps/web/src/lib/shane/score-metrics.ts:123-124`) is imported by `VoiceProfilePane.svelte:94`; `insights.ts` names it only in a comment (`:20`) and calls `aggregatePhonation` directly. **Insights itself uses the phonation layer only for the Pacheco tessitura band (`insights.ts:198`) and to order findings by quaver weight (`insights.ts:270`). It prints no seconds and no share of time** (strings `i18n.ts:1454-1512`).

**Relation to the planned per-vowel phonation work, verified:** that is N.123, the aggregation layer, whose layer is built and whose FIGURES are owed (`OPEN.md`, N.123, "CORRECTED 2026-09-16, READ IN THE TREE: THE LAYER IS BUILT"). **Phrase length is adjacent, not the same.** It shares N.123's inputs (sounding duration per event, repeats resolved, trust per bar) and its seconds conversion (`secondsFor`), and it adds one thing N.123 does not need: **order, and a rule for where a phrase ends.** Say in the method whether it belongs inside N.123, beside it, or as its own item; Dann rules.

---

## 3. The work, in four stages. Write each stage to disk before starting the next

### Stage A. Research. What the field says a phrase is, and how long is long

1. **Search Dann's own library first** (tether 12 and 16). `~/Documents/Voice Pedagogy Library/` and `~/Documents/Voice Pedagogy Research/`. Look for: Vennard (the pages St-Pierre cites), Miller, Doscher, Titze, McKinney, Hixon on breathing, and anything on maximum phonation time. List what was found and what was not.
2. **Then the project:** `project_search` for "phrase", "breath", "phrase length", "maximum phonation time". Then `docs/sessions/`.
3. **Then the web**, for published work on: phrase segmentation in sung melody (music information retrieval); breath planning in singers; maximum phonation time (MPT) norms and their relevance to sung phrases; whether any source proposes a threshold in seconds for a "long" phrase.
4. For every source: what it says a phrase boundary is, any number it gives, and the page. **Mark each as read in full, snippet only, or not read** (tether 14).

### Stage B. Analysis. What Ilya's scores actually carry

1. **Measure before designing** (r2's pending check, `proposal-st-pierre-elements-for-ilya_r2`, "WHAT THE DESK WOULD DO NEXT"). Across Dann's library and the test fixtures in the tree, count per score: rests in the vocal line, breath marks, caesuras, and slurs if parsed. **If breath marks are rare, a method resting on them is wasted.** Report the counts per score and in total.
2. Find what the parse does with: a rest inside a tied figure; a very short rest at speed (a semiquaver rest in an allegro); a fermata; a tie across a barline; a repeat; a melisma; a rest that is only a notational pickup.
3. Identify where a singer would breathe but the score shows nothing: a long line with no rest. Say how the method treats it.

### Stage C. Synthesis. The method

Specify, with a source or a named DESK DEFAULT for every rule:

1. **What ends a phrase.** A rest of what minimum length, in time or in beats? A breath mark, a caesura, a fermata? And what does NOT end one (a rest too short to breathe in).
2. **What a phrase's length is.** Sounding time of its notes, or elapsed time from first onset to last release, including any internal rest too short to breathe in. These differ, and the singer feels the second. Choose and justify.
3. **The seconds, at whose tempo.** Through `secondsFor`, so the singer's own tempo counts (Dann's ruling in N.151, 2026-09-17, `OPEN.md`: a tempo the singer imposes "will affect their (the user's) phonation time computation"). When the tempo is inferred, the phrase length is a range and must print as one. **When no tempo is stated, say what the singer sees**, because the layer refuses to invent one.
4. **What is shown.** Draft the sentence or sentences for Insights, following Fable's pattern: a qualitative word stands only with its "as" clause beside it. **No threshold for "long" applies to everyone** (Dann's ruling 2026-09-16: voice type plays no part in choosing values). If the field offers no singer-relative threshold, say so, and propose showing the number and its place (bars, pitch zone) without calling it long.
5. **How it meets the singer's own measurements.** A phrase that sits across the passaggio or above the typed range is a different demand (r2, adoption 2). Say whether the method reports the phrase's zone, and how.
6. **Edge cases** from stage B, each with its rule.
7. **The caveats the singer reads**, in plain language, drawing on `secondsFor`'s four.

### Stage D. Defence and test

1. Work the method by hand on **three real scores** from Dann's library, one slow, one fast, one with few rests. Show each phrase found, its bars, and its seconds.
2. **Name the likeliest way the method misleads a singer** and show it on a real score.
3. A test list Claude Code can turn into unit tests: input, expected phrases, expected seconds.

---

## 4. Constraints

- **Do not write application code** and do not edit any file under `apps/` or `packages/`.
- **Do not write to git** (`CONTRACT.md` §5). Read-only git is allowed from the bridge as `git --no-optional-locks`.
- **A claim about what the code does carries a `path:line` read in this run** (tether 21). The citations in §2 are leads; re-read before relying on them.
- **No term goes on the singer's page that the field does not use** (`PRODUCT.md`, "Clarity for a receptive user", 2026-09-22).
- **Canadian spelling, no em dashes** (house style).

## 5. Output

Write to `docs/sessions/method-phrase-length_r1_<date>.md`, stage by stage, as you go.

Return a memo of at most 300 words: the method in five sentences; the breath-mark and rest counts from stage B; the sentence a singer would see; the single weakest rule and why; and **a section headed "NOT ESTABLISHED"**.
