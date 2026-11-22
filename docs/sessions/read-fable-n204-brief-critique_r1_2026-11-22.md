# Critique of the N.204 phase 1 unit brief (Fable, 2026-11-22)

Transcribed verbatim from Fable's return memo, 2026-11-22. Read-only review;
Fable wrote nothing to the tree. Filed by the desk in the turn the memo landed,
per ENVIRONMENT.md, "A FABLE REVIEW NEVER REACHES THE TREE BY ITSELF".

Terms Fable coined here: "singer's walk", "citation ledger", "evidence status",
"weight and wait". "Blockers" is adopted from the unit a and b reads.

## The finding that changes a decision, first

**Believed:** tier 4 findings "become release lanes immediately". **Known now:** of the 15 tier 4 findings in units d and g, none was seen on a screen. Unit d says so at its section 7 item 1 ("D1, D2, D3 are read, not ran"); unit g says "All established by reading unless marked; the reader had no browser" (section 2) and "The bridge VM has node and no browser (ran `which`)" (section 7). **What it changes:** a release lane cut from a tier 4 finding today rests on source reading alone, which `CONTRACT.md` section 8 (last bullet) rules out for finding a difference a singer sees, and which tether 5 ("Verify the rendered result, not the source") also rules out. Amendment 2 repairs this.

## Verdict on the six questions, one line each

1. **Purpose.** No. The brief's reading list is `code-conventions.md`, `ARCHITECTURE.md`, and plan sections 3 and 4. Nothing from `PRODUCT.md` and nothing of tether 22 reaches the reader, so both reads open from the file and reach the singer only in tier 4 and the glossary. The plan's own singer's chair (plan section 2: "says fewer wrong things ... never contradicts itself between two sentences on one page, and is no slower and no heavier") has no slot in the return.
2. **Veracity and citation.** Half. The reader's own claims are held well (`path:line`, "ran", grep for absence). The code's citation promises are not asked about at all (`PRODUCT.md:1044-1053`, `:322-328`, `:243-251`, `:773-786`).
3. **Tier 4.** The test is usable and is being read as intended in kind. It is unbounded in evidence and in stakes. Keep one tier, add a class and an evidence status.
4. **Not elicited.** Five things the plan or the contract owes: the token table (plan 4a), a check for each hidden relationship (plan section 3), the ONE VOWEL PER NOTE statement (`CONTRACT.md` 0.1), performance (plan section 3), and singer-visible contradictions (plan section 9 item 9).
5. **Calibration.** The size figures were not wrong by three to four times; the unit label was. The plan's column is tokens and the brief relayed it as characters. Details under amendment 10.
6. **Load.** The 200-line body is the record for the desk and the lanes. It is not a reading copy for Dann. Units a and b opened with a one-line count; d and g open with nothing. Amendment 12.

## Numbered amendments, ordered by what they change in the reading

### 1. Start the read from the singer (new section, placed before "The schema")

Evidence: tether 22, "Every design reply, plan, and brief starts from what the singer does, sees, and feels, and the technical work is derived from that" (`CONTRACT.md` section 3). Plan section 1, Dann 2026-11-19 14:57: "firmly retain the importance of the user". Unit g's glossary (its section 6) shows the reader can write in a singer's words; the brief asks for that last, as an appendix, so it frames nothing.

Add to "Read first": `PRODUCT.md` sections "What Ilya is for, and why a data dump defeats it", "What Insights is for", "How Insights speaks", "How Insights stays trustworthy", "A trail of breadcrumbs", "Both languages, start to finish", "Clarity for a receptive user"; `CONTRACT.md` 0.1 and tethers 15, 18, 22.

```
## Start from the singer

Before any finding, write the singer's walk for this unit: each thing a singer does, sees, or decides that this unit's code carries, in the words on the screen (TEXT, MELODY, INSIGHTS, the DRAWER, the Loupe). For each, say what Ilya tells the singer there. Then read the code against that list. A finding that touches a line of the walk says which line. The glossary lines at the end are this list with the module added, so write it once.
```

### 2. Tier 4: a class, an evidence status, and who meets it (replaces the tier 4 sentence in section 4)

Evidence: the finding at the head of this report. Also `CONTRACT.md` section 5: "An edge case reaches him only with a count that shows it is common". Unit g's 12 run from a screen reader hearing the opposite state (4.5) to a character count using the browser's locale (4.12), all at one rank. Count of g's 12 by kind, from its section 2: accessibility 4.3, 4.5, 4.6, 4.8, 4.11; French 4.2, 4.4, part of 4.12; layout not seen 4.1, 4.10; touch not seen 4.7; state carried over 4.9. The accessibility items belong: `PRODUCT.md:895-897` counts accessible names inside "start to finish", and 4.5 is Ilya saying a wrong thing to one singer. What does not hold is the immediate lane for an unseen item. The ordering precedent is `PRODUCT.md:1064-1070`: select by stakes, then show in the order met.

```
Tier 4: something a singer experiences as wrong today. Each tier 4 finding opens with what the singer does and what they then see or hear, in the screen's words, before any code name. Each carries three labels.

Class. A: Ilya tells the singer something untrue, or loses their work (a wrong sound, note, figure, or source; two sentences that disagree; English in a French session; a screen reader told the opposite state). B: the singer cannot do or reach something (a control that cannot be pressed, focused, or heard). C: it works, with friction.

Evidence. SEEN (on a rendered page), RAN (code run, input and output quoted), or READ (source only). A READ finding names the one act that would settle it.

Who meets it: every singer, or which singers (phone, French, keyboard, screen reader), and by what path.

Order: class A first, then B, then C; inside a class, by what a singer meets first. Only SEEN and RAN findings are release-lane candidates. A READ finding goes to the desk as a walk to make.
```

### 3. The citation ledger (new item in "Also return")

Evidence: `PRODUCT.md:324`, Dann: "We do not want one baseless claim in Ilya"; `:1048-1051`, every comment carries author, short title, year, page, and the tap shows the full reference; `:249`, the reasoning "stored as data in each connection record ... not only as code comments"; `:255`, "Each fact carries its date and edition"; `:239`, sung, derived, generic; `:783-785`, "every phonation-time figure resting on a singer's own tempo says so where the figure is read ... An uncited number is the thing Ilya exists to refuse"; `:955-957`, "A term Ilya cannot justify does not go on the page". The brief asks about none of it. Under the earlier brief unit a found it unasked: two page numbers for one Grayson rule (its C9) and eight open questions living in comments that "the GUIDE and LEARN cannot state ... as Grayson's or as Dann's until they are closed" (its C16). Unit g read the Inspector whole ("A word letter by letter, with why Ilya chose each sound") and says nothing about whether a source is shown there. A lead, not a finding: unit a's G8 lists `formatCitations` as used by no file outside the blurb package; whether the Inspector draws a blurb's citations is NOT ESTABLISHED by this review.

```
The citation ledger. For every place in this unit where Ilya prints a claim, a number, or a piece of advice to a singer: (1) what source the singer sees on its face, or "none shown"; (2) where that source lives (a data file, a string, a code literal, a comment); (3) whether the value's origin reaches the page (sung, derived, or generic; the singer's own tempo); (4) any second home of the same citation, and whether the two agree to the page number. For every comment that cites the literature: is the page given, and does any other comment cite the same rule differently. List every open question about sung Russian or about a source that lives only in a comment. A unit that prints nothing to a singer says so in one line.
```

### 4. ONE VOWEL PER NOTE is checked, not only protected (moves out of section 6)

Evidence: `CONTRACT.md` 0.1: "The rule is enforced in code, not counted: a check on every path that writes text to notes refuses a vowelless syllable, with a test." The brief lists the rule under "do not propose changing". Under the earlier brief unit a opened with a paragraph on the rule and unit b returned six blockers (its "Blockers: ONE VOWEL PER NOTE"). Unit d owns placements and the seat on arrival (its section 1 line ranges 499 to 790 and 2598 to 2894) and makes no statement on the rule. Unit g names it once, as a risk (its 3.2).

```
ONE VOWEL PER NOTE (CONTRACT.md 0.1). Before the findings, list every path in this unit that puts text under a note, or says there is none. For each path: where the check that refuses a vowelless syllable, a many-vowel syllable, and an empty sung note runs, and the test that proves it. A path with no check is a BLOCKER and is reported apart from the tiers.
```

### 5. Each hidden relationship arrives as a check (amends "the hidden relationships")

Evidence: plan section 3: "Relationships become checks before prose: a test or a ratchet line first". Units a and b: "Hidden relationships, each proposed as a check", with a "Check:" on each. Unit d lists 10 and unit g lists 16; none carries a check.

```
The hidden relationships, each with the check it becomes: a test or a ratchet line first, a comment second, a decision record last. Say "check exists" and name it where one does.
```

### 6. The token table is owed (add to "Also return"; add plan 4a to "Read first")

Evidence: plan 4a, "WHAT EACH READING UNIT NOW OWES, in its packet. One table, every literal in its files", and plan section 9 item 10. The brief's reading list stops at sections 3 and 4. Unit d read 4a unasked and returned the table (its sections 5 and 8). Unit g lists "sections 3, 4, 6" as read (its section 8) and returned no table; five literals appear in its 1.12 only. Fonts and the focus ring (plan 4a, "ALSO IN SCOPE") are absent from g and one line in d.

```
The token table (plan 4a). Run census-colour-tokens.mjs, which sits in docs/sessions/ today, and class every literal in this unit's files as MIGRATE (name the token), NEEDS A TOKEN (propose the name and its hue family), or LOCAL BY RIGHT (give the reason). The same three classes for every hard-coded font-family, and every place a focus ring takes its colour.
```

### 7. The unit reads the words its own files draw (amends the last sentence of section 6)

Evidence: plan section 9 item 9, "no singer-visible sentence contradicts another on the same page"; Dann's second purpose, "resolve contradutions" (plan section 1, as written). `i18n.ts` is "read for structure only", so no unit owns reading the interface strings against each other. Unit g went there anyway and found a French singer reading English (its 4.2, 4.4). DESK DEFAULT offered here, reversible: the exclusion stays for GUIDE and LEARN prose and lifts for the strings a unit's components draw.

```
LearnContent.svelte and GuideContent.svelte are read for structure only. In i18n.ts, read the English and French values of every key this unit's files draw. Report: two sentences on one surface that disagree; an English value reaching a French session, accessible names and error text included; a singer-facing "held" where the ruling is "sustained"; "fault", "flaw", "diagnose"; a term that is neither from the literature nor current in the field. Propose no key deletion. French arrives as a marked draft for Dann.
```

### 8. Glossary lines name decisions (amends the glossary sentence)

Evidence: plan section 5, the glossary's gap: "where Ilya decides which vowel a note takes, where it decides a note is held, where it decides a tempo". Units d and g returned one line per file or per control ("Ilya runs in your browser alone: `routes/+layout.ts`"), which the Names table already covers.

```
Glossary lines: one per decision Ilya makes in this unit ("where Ilya decides ..."), a singer's words first and the module second. Where the decision has more than one home, list every home; that line is also a duplication census entry. A file that decides nothing gets no line.
```

### 9. Weight and wait (new item in "Also return")

Evidence: plan section 3 adds ISO 25010 performance efficiency on Dann's fourth purpose. The brief names it in the schema and gives it no return. Unit d returned two unmeasured items (T1.13, T3.7); unit g one (1.8).

```
Weight and wait: what in this unit a singer downloads or waits for (a first-chunk import, work repeated on every keystroke or every placement, dead CSS and assets). For each, the measure that would size it. Mark every unmeasured cost NOT MEASURED.
```

### 10. A measured manifest replaces the approximate size (replaces section 1's size line and section 2's branch line)

Evidence, sizes: plan section 6's "source" column is tokens. Unit a is "71k" there, and unit a's brief gives "251,804 bytes, about 72k tokens". Unit d measured 265,173 bytes; at unit a's ratio that is about 76k tokens against the plan's 75k. The brief relayed the token figure as characters. Unit g measured 467,234 characters, about 133k tokens against the plan's 109k; its count includes nine test files, and whether that explains the gap is NOT ESTABLISHED. The ratio is unit a's alone (DESK INFERENCE beyond it). So cost was not affected: d spent 290,034 of 350k and g 374,795 of 480k. What it costs is trust and tool calls: tether 9, "Do not type a number you have not read out of something."

Evidence, branch: both reads found the working tree on `cloud-lane-82` at `13f34634`, not `Shane`. At 04:5x today this review found it on `cloud-lane-83` at `c470e03d` (ran `git log -1`). The working tree moves under a reader while lanes run.

Evidence, commits: the plan's 53 for `Drawer.svelte` is "churn since 2026-08-01" (plan section 5); unit g counted 101 over all history. The qualifier was dropped.

```
## Your unit

The file list below was made by script at <commit>: each path with its lines and bytes, and the unit's total in bytes. Token figures are estimates and say so. First, run `git --no-optional-locks log -1` and `git --no-optional-locks diff --stat Shane -- <unit paths>`. If the diff is not empty, read each file with `git --no-optional-locks show Shane:<path>` and say so. Folders a live lane is editing today: <named by the desk, or "none">.
```

Likely wrong on the units not yet read, each with what was read:
- Sizes for e, f, l, and n are "about 140k" in plan section 6, round figures. If g's 22 percent gap is typical, caps set from them fall short.
- Hotspot line counts and ceilings drift: plan section 5 gives `+page.svelte` 5,532; unit d found 5,533 at a ceiling of 5,533 (`scripts/ratchets.json:8`).
- The colour total: plan 4a says 299; unit d ran the script and got 296. `STATE.md:58` splits the 299 as 160 and 139; plan 4a splits it 177 and 122. Two figures for one fact.
- "The test or baseline that would prove behaviour unchanged": the behaviour baseline is still owed (plan section 5, "Still owed"; `STATE.md:88`). Readers can name tests only. Say so in the brief.
- Unit l waits on batch 3: `apps/web/src/lib/markup/` exists and `melody/` does not (ran, today).
- The fixed list's paths were checked today and exist: `score/reconciliation/`, `score/underlay-donor.ts`, `components/Reading/LearnContent.svelte`.

### 11. Three standing clauses to add (section 7)

Evidence: tether 11 (positive control; the plan's own 688-literal miscount, plan 4a, "the instrument was the fault"); tether 14 (every claim about a document carries its instrument; unit d section 7 item 11 and unit g's last section 7 bullet disclosed filters unasked); `CONTRACT.md` section 5, "Tell him which words you coined and which you adopted, every time" (unit d did, unit g did not).

```
A grep that returns nothing is reported with a positive control: the same pattern finding a thing known to be there.
Name every file read through a filter (cut, sed, a line cap), with the filter. "Read whole" means no filter.
Say which terms you coined and which you adopted.
```

### 12. The report opens with a summary Dann can read (amends section 8)

Evidence: `CONTRACT.md` section 1 item 9 (a decision-changing finding goes first and alone); tether 20 ("Anything he must read or judge arrives in the chat, rendered"); section 5 ("A finding reaches him as what it costs or gains a singer ... the mechanism goes in the report, never in the reply"). Units a and b opened "Files read: 23 of 23. Findings: 62 ... Blockers: 0." Units d and g open on tree state.

```
## Report

Open with the singer's summary, at most twelve lines, no file names and no code names:
1. One sentence: what a singer meets wrong today because of this unit, confirmed (SEEN or RAN), or "nothing confirmed".
2. Each tier 4 finding in one line: what the singer does, what happens, class, evidence.
3. What needs Dann, one line each: a fact about sung Russian, a French draft, a walk on his device.
4. One count line: files read of files, findings by tier, blockers, items NOT ESTABLISHED.
5. What this brief told you that the tree contradicted.
Then the record, in this order: the singer's walk; ONE VOWEL PER NOTE; tier 4; tiers 3, 2, 1; the hidden relationships with checks; the citation ledger; the strings; weight and wait; the comment verdicts; the duplication census; the token table; glossary lines; NOT ESTABLISHED with the instrument that failed; files read, with filters named.
```

## What I would cut

1. **The comment counts.** Both reads spent tokens on regex tallies and then marked their own verdicts as estimates (unit d section 4: "the instrument was a regex plus one read"; unit g section 4: "an estimate from the read and not a per-comment tally"). Counting is script work, by the plan's own logic for colour ("THE CENSUS IS A SCRIPT, NOT A TABLE", plan 4a). Keep from the reader only the judgement: which comments are false, stale, tombstones, or misattached, and which carry a ruling that needs a home. This trims no reading, so the ruling that the read is never trimmed (`CONTRACT.md` section 1 item 6a) is untouched.
2. **"The smell" and the Fowler name on tier 1.** A dead import needs its name and its proof. Keep both labels for tiers 2 and 3, where the name tells a lane what to do.
3. **Glossary lines for files that decide nothing** (amendment 8 does this).
4. **"Approximate size" and "do not read a folder a live lane is editing"** as written. The reader cannot know either; the desk supplies both as facts (amendment 10).
5. **The recitation of ISO/IEC 25010.** One line naming it is enough. Unit a's brief turned its five qualities into questions about that unit's files, which did more work than the standard's name.

## What I could not establish

- **The brief's exact wording.** No `brief-fable-n204-unit-d*` or `-g*` file is in `docs/sessions/` (ran `ls`). I judged the eight-section summary in my instructions. The replacement wording above is written against that summary, so each block is a replacement for a section's sentence or an addition, not a diff.
- **Whether any of the 15 tier 4 findings is real on a screen.** I had the same instrument the readers had.
- **Whether the Inspector shows a blurb's source to a singer** (amendment 3). `InspectorPanel.svelte` was not opened in this review.
- **Why unit g's measured size is 22 percent over the plan's.** The bytes-per-token ratio rests on unit a alone.
- **What the amendments add to a unit's cost.** They add six return sections and remove the counting. No actual exists; the first unit run on the amended brief is the measure.
- **Whether the per-unit Sonnet packets** (`STATE.md:88`, still owed) would carry the manifest, the comment counts, and the colour census. If they do, amendments 6 and 10 and cut 1 move there.
- **My own token count.** I cannot see a counter. My estimate is under the 200,000 cap.

## What I read

**In full:** `docs/house-style/code-conventions.md` (64 lines); `docs/sessions/plan-code-audit-maintainability_r4_2026-11-21.md` (186 lines, all sections); `read-fable-n204-unit-d_r1_2026-11-22.md` (226 lines); `read-fable-n204-unit-g_r1_2026-11-22.md` (205 lines); `CONTRACT.md` lines 1 to 70 (sections 0, 0.1, 0.2, 1, 2, tethers 1 to 9); `PRODUCT.md` lines 1 to 1000.

**Through a filter:** `CONTRACT.md` lines 71 to 172, cut at 3,500 characters a line (tethers 10 to 22 and sections 4 to 9; a few of the longest lines lost their tails). `PRODUCT.md` lines 1025 to 1070, 1131 to 1144, 1163 to 1187, and 1237 to 1278, cut at 2,600 characters. `read-fable-n204-unit-a_r1_2026-11-19.md`, cut at 1,100 characters. `read-fable-n204-unit-b_r1_2026-11-19.md`, lines 1 to 30 at 1,500 characters and 31 to 203 at 330.

**Not read:** `PRODUCT.md` lines 1001 to 1024, 1071 to 1130, 1145 to 1162, 1188 to 1236, and 1279 to 1292 (the call returned more than the tool would show, and I re-read only the sections bearing on citation, page organization, and purpose). So my instruction to read `PRODUCT.md` in full was not met for 187 of its 1,292 lines.

**In part, to settle a claim:** `brief-fable-n204-unit-a_r1_2026-11-19.md` (first 90 lines, cut at 420); `ENVIRONMENT.md` (the ESTIMATES BY KIND OF JOB table); `STATE.md` (grep for N.204, lines 19, 52, 58, 78, 88). Ran: `git log -1`, `git status --short`, path existence checks, two `git grep`s.

**From memory, not from the tree:** the house-style rules this report is written to (Canadian spelling, no em dashes, the banned-word list, fenced blocks only for paste material). Nothing else in this report rests on memory. Nothing new for memory beyond what the tree already records.
