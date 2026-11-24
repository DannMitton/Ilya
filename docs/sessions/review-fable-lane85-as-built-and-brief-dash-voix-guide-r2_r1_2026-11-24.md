# Review: cloud-lane-85 as built, and the dash, VOIX, and GUIDE seating brief r2

r1, 2026-11-24, by Fable (subagent). Two jobs, one report.

| Job | Subject | Verdict | Blockers | Amendments |
|---|---|---|---|---|
| 1 | `cloud-lane-85` as built, against `brief-code-melody-wording_r4_2026-11-23.md` | **MERGE** | 0 | 3, none gating |
| 2 | `brief-code-dash-voix-and-guide-seating_r2_2026-11-23.md` | **DO NOT SEND** | 2 | 10 |

## What I read, and what a line citation means here

- Job 1: `lane85.diff` whole, `lane85-report.md` whole, the r4 brief whole (md5 `c7976f79751ceb0f969908977b06433a`, the md5 the lane's report names), `inbox-extract.txt` whole.
- Job 2: the r2 brief whole, `draft-french-guide-resonance_r2_2026-11-23.md` whole, the same extract.
- `CONTRACT.md` sections 0 to 0.3, 1, 4, 5, 6, and 8, in chunks.
- Beyond the named inputs, three staged files turned out to bear on the questions, so I read the parts that did: `INBOX.md` (my copy ends at 2026-11-23 21:29), `OPEN.md` lines 4513 to 4531, and `STATE.md` by search.
- **A source snapshot was staged** (`n204-step1-source.tgz`). `brief-sonnet-n204-step1-instruments_r1_2026-11-23.md:13` says it is the tree at `b2869772`. I unpacked it and used it. Every `file:line` below marked **(snapshot)** is a line I read in that unpacked tree this session. It is not the repository, and it is not `93edb360`, the commit the r2 brief says it read.
- **For lane 85's four code files the snapshot is exact.** The git blob hash of each snapshot file equals the pre-image hash in the diff's `index` line (`3149f7e3`, `787086ed`, `12cbd393`, `7f28f622`). I applied the diff to a copy, and each result hashes to the diff's post-image (`0f89fca2`, `71828802`, `71b502a7`, `b510b1a5`). So for those four files I read the true before and the true after.

Terms I coined in this report: "non-gating amendment" (a repair that does not hold the merge) and "comparison basis" (what exactly gets hashed). Everything else is adopted from the files.

---

## Job 1: cloud-lane-85 as built

**Verdict: MERGE.** The code delivers the brief exactly, changes nothing the brief did not name, and its comment and test edits are true of the code after the change.

### Blockers

None.

### The four questions

**Does it deliver exactly what the brief asked?** Yes.

- Section 2a, four legend strings: all four changed as the table gives them (post-image `legend.ts:73-80`).
- Section 2b, three sites: one word changed at each. A character comparison of the before and after lines in the diff shows `tractus` to `conduit` and nothing else in `GuideContent.svelte:53`, `:93`, and `ratified-lines.test.ts:472`.
- Section 3, pins and comments: `legend.test.ts:105` (title), `:113` (title), `:115`, `:116`; the doc comment above `MARKUP_TURN_COPY`; the shorthand in `buildMarkupLegend`'s comment. All six done. The sentence "each is drawn with its head, in lavender, before the words" is kept, as the brief required.
- Section 8: one commit, one report at the path the brief names, nothing under `docs/memory/`.
- The diff is five files, +151 and -16: 15 insertions and 16 deletions across the four code files, plus the 136-line report.

**Do the strings match Dann's words character for character?** Three of four do. The fourth differs in one character, by design.

| String in `legend.ts` after | Extract | Result |
|---|---|---|
| `= your pitch of turning for this vowel` | 12:45, his English | identical, less his trailing comma |
| `= the same, but using a placeholder value` | 12:45, his English | identical |
| `= votre hauteur de changement de timbre pour cette voyelle` | 14:52 | identical |
| `= la même, mais à partir d’une valeur par défaut` | 14:52 | identical except the apostrophe |

- **The apostrophe.** The extract writes « d'une » with U+0027, in both Dann's quoted words and the desk's "final" line. The code holds U+2019, written as the escape `’` at post-image `legend.ts:79`. That is what the brief instructs and what the file did before (pre-image `:76` and `:80` hold `d’après`). The pin at `legend.test.ts:116` holds the literal U+2019 and equals the resolved code string.
- **The trailing comma.** His first replacement reads `"your pitch of turning for this vowel,"` in the extract. The lane ships it without the comma, on the standing DESK FLAG in the 12:45 line. That flag is still marked his to restore.
- The accents (ê, à, é) are byte-identical to the extract.

**Did it change anything the brief did not name?** No. Two things it removed from the old doc comment are worth knowing, and the lane disclosed both in its report section 3: the pointer to `OPEN.md`, "PLACEHOLDER TURNING NOTES ARE HOLLOW", and the comparison to « n’est ». The brief called the old comment's ratification citation superseded, and the pointer sat inside that citation, so the removal is within the brief.

**Are the test and comment edits true of the code after the change?** Yes.

- New doc comment: "The apostrophe in « d’une » is written as a Unicode escape for U+2019; the accented letters are literal." True of post-image `legend.ts:79`.
- The lane's stated reason for dropping the « n’est » comparison is true: post-image `legend.ts:85` holds a literal U+2019 in « n’est », not an escape.
- `legend.test.ts:105` title now names the entry by its new words, and the test body still checks that the filled entry is absent. True.
- `legend.test.ts:113` title says "the apostrophes typographic". One apostrophe remains across the four strings, so the plural is loose. Not worth a change.
- `buildMarkupLegend`'s comment now reads `("your pitch of turning for this vowel")`. True.

**The lane's one judgement call was right.** The r4 brief states the rule (escape in `legend.ts`) and then prints its example with a literal character, because the brief's own `’` did not survive into the file (r4 line 34). The lane followed the stated rule and the file's existing practice.

**The sweep counts reproduce.** In the snapshot: `from your voice` 7 lines, « d'après » in any of its three spellings 16 lines, `tractus` 3 lines, each at the files and lines the lane's report lists. No file under `apps/web/e2e` or `apps/web/e2e-phone` pins either legend entry (snapshot, searched for `pitch where`, `turning for this vowel`, and `placeholder value'`).

### Amendments, none gating

1. **The lane's report lost its escapes in three lines.** `report-code-melody-wording_r1_2026-11-23.md` lines 21, 93, and 120 show a bare `’` inside code font where `’` was meant. Line 93 therefore reads "The tree today is `d’après`, an escape" and then shows its chosen line with a literal character, which is the opposite of what the code holds. The code is right and the record is wrong. Repair the three lines in a docs commit after the merge.
2. **The look is still owed before WRITTEN becomes DONE** (`CONTRACT.md` sections 0.3 and 4). The lane says in its section 7 that it did not render MELODY. The French hollow entry grew from 40 to 48 characters. Open the MELODY footer legend in English and French on the Shane alias after the merge.
3. **Two record repairs that are the desk's, not the lane's.** (a) r4 line 34 carries the same lost escape. (b) The 14:52 line calls « changement de timbre » "the desk's noun". The tree already carries it in live strings, `i18n.ts:2029-2031` among others, and « hauteur de changement de timbre » stands in `watchlist.test.ts:576` (snapshot). It is adopted, not coined.

---

## Job 2: the dash, VOIX, and GUIDE seating brief, r2

**Verdict: DO NOT SEND.** Items 2 and 4 clear with amendments. Item 1 clears once its done-when can fail. Item 3 cannot be built as written without touching files and strings the brief never names.

### Blockers

**B1. Item 3 seats paragraph 1 "as its own `h4`", and an `h4` in this section is wired to the drawer's table of contents.** The brief names none of that wiring.

- `Drawer.svelte:282` (snapshot) holds a hard-coded list of the twelve `h4` ids under `guide-how`, `guide-markup-characteristics` among them.
- `Drawer.svelte:759-760` (snapshot) holds one contents button per heading, each reading an i18n key.
- `i18n.ts:2517-2519` (snapshot) holds those keys, `toc.guide.markup-*`, in English and French. The labels are their own strings: `toc.guide.markup-characteristics` reads "Voice characteristics", shorter than its heading.
- So a new `h4` needs an id, an entry in the `:282` list, a button, and a new `toc.guide.*` string in two languages. A new French label is French, and the brief's premise is that nothing is owed to Dann. Sent as written, the lane either ships a heading missing from the contents list or writes strings nobody ruled.
- The `h4` also changes the form of ratified text. The draft gives the lead as a bold run-in with a full stop: `**How Ilya reads your vowel.**`. No `h4` in the file ends with a full stop, and no French `h4` italicizes Ilya (`:25`, `:47`, `:55`, snapshot), where the ratified French lead does.

**Ranked repairs, with a recommendation:**

1. **Recommended: seat paragraph 1 as a paragraph with a bold run-in lead**, `<p id="..."><strong>lead.</strong> body</p>`. That is the form the ratified text already has, and the form Licences already uses (`GuideContent.svelte:296` and `:602`, snapshot). Cost: no Drawer change, no new string, no contents entry, so a singer reaches it by scrolling and not from the contents list.
2. A new `h4` with full wiring. Cost: a new contents label in two languages put to Dann as a marked French draft, one line added to `Drawer.svelte`, which stands at 1,986 lines against a ratchet ceiling of 1,990 (`scripts/ratchets.json:15`, snapshot), and a ruling on the heading's full stop and italics.

Whether a bold run-in paragraph has a precedent inside the `guide-how` section, outside Licences, is NOT ESTABLISHED.

**B2. Item 1's done-when passes on the unchanged build.** The brief's test is: on «Средь шумного бала» with a placeholder fR1, the crossing squircle renders with no dash. `OPEN.md:4519` records the desk's own look at that song on 2026-11-23, with one of six core vowels sampled: "Two crossings on the page, both solid; zero elements carrying `stroke-dasharray` anywhere in `.markup-paper-container`." So the page already meets the done-when before any change, and a lane can report success having verified nothing.

- A crossing is dashed only when its note's vowel reads `'surrogate'` (`overlay-engine.ts:231`, snapshot) and the note also crosses (`MarkupPane.svelte:408`, snapshot).
- **Repair:** make the done-when a before and after measurement. Before the change, a named voice and song state shows at least one `[data-crossing-ring][data-placeholder="true"]` carrying `stroke-dasharray`. After it, the same count of `[data-crossing-ring][data-placeholder="true"]` and zero `stroke-dasharray` in `.markup-paper-container`. If no state can be found that draws a dashed crossing, the lane stops and reports that.
- The brief also does not say how a cloud lane looks at a page. Lane 85 did not run the app. Either name the Playwright path or assign the look to the desk after the merge and say so.

### The four questions

**Does every string trace to a ruling of Dann's, quoted exactly?**

| Item | String | Source | Result |
|---|---|---|---|
| 4, French | « Les constats qui en dépendent sont tracés évidés. » | extract, 14:52 | traces, and the brief's copy is byte-identical |
| 4, English | "...are drawn hollow." | not in the extract | see amendment 3 |
| 3, four passages | the draft's four block quotes | ratified draft | traces; the brief sends the lane to the file, which is right |
| 2 | no string changes | | |
| 1 | no string changes | | |

The brief's one direct quotation of Dann from the extract is wrong by one letter: it prints *"à partir d'une valeur par défault"* under "transcribed as written", and the extract reads « défaut ».

**Does it narrow or widen any ask of his?**

- **Item 1 widens.** His recorded ask was a wording cut. Item 1 turns it into a change to what MELODY draws, and to what MELODY prints, since the ring prints as it shows (`crossing-ring.ts:37-38`, snapshot). `OPEN.md:4515` and `:4523` record this as a DESK DEFAULT, "his to overrule", resting on his rule of 2026-11-18. The brief presents it as settled and carries neither label.
- **Item 3 settles two points the draft left open**: the placement (marked DESK DEFAULT, correctly) and the conversion of the lead into a heading (unmarked; see B1).
- **Item 4 neither narrows nor widens.**
- **One ratified ask on the same strings is left out, and the brief's prohibition could be read against it.** See amendment 9.

**Is the INSIGHTS and MELODY distinction in item 1 sound?** In the code, yes. As the brief words it, no.

- **Sound:** `drawCrossingRings` has one caller, `MarkupPane.svelte:409`. INSIGHTS' dashed ring is drawn by its own code, `SingerBlock.svelte:150` through `arcDash` at `:50-52`, and shares neither the function nor `PLACEHOLDER_DASH`. Removing the dash in `crossing-ring.ts` cannot reach INSIGHTS. The two string families are separate keys, and `placeholderLine` picks the family by page (`placeholder-line.ts:73`). All snapshot.
- **Unsound as stated:** the brief says three times that "hollow or dashed" stays true of INSIGHTS. INSIGHTS' four strings do not say that. They end "drawn dashed" and « tracés en pointillé » (`i18n.ts:2048`, `:2049`, `:2051`, `:2052`, snapshot; pinned at `lane68-strings.test.ts:16-17`). `OPEN.md:4523` has it right: INSIGHTS' wording "already ends 'drawn dashed'".

**Does it risk changing behaviour where it says it does not?**

- Item 1: MELODY's printed page changes along with the screen. No INSIGHTS behaviour changes. No Playwright test pins the dash (snapshot, `apps/web/e2e` and `e2e-phone` searched for `dasharray` and `crossing-ring`).
- Item 2: comment only, confirmed. The clause is at `i18n.ts:158` (snapshot), inside the comment at `:155-158`.
- Item 3: as written it forces Drawer and i18n changes (B1).
- Item 4: strings and pins only.

### Amendments

1. **Correct the INSIGHTS wording claim**, in the search section, in item 4, and in "must not do". INSIGHTS reads "drawn dashed". The instruction not to touch `:2048-2052` stands; its stated reason changes.
2. **Fix the misquotation.** « défault » to « défaut », or drop "transcribed as written".
3. **State the English's real source in item 4.** The brief derives "drawn hollow" from the 2026-11-18 standing rule and from `STATE.md`. Neither is a source for a string. `OPEN.md:4517` and `:4529` give the source: Dann's ruling of 2026-11-22 12:48, whose words were never transcribed, with only the desk's paraphrase on record. His 14:52 French, « tracés évidés. », corroborates it, because it is the French of that English. Say that, in those terms. My copy of `STATE.md` contains no wording for this sentence.
4. **Label item 1 as what the record says it is**: DESK DEFAULT under his 2026-11-18 rule, his to overrule, with the one line that rule requires going to him in the report. The opener "none is a design question" does not hold for item 1. The r4 wording brief said on the same day that this was "Dann's to settle, with the page in front of him"; one sentence saying what changed (the look at `OPEN.md:4519`) spares the next reader the contradiction.
5. **Name item 4's sites; "move any test pin" under-specifies.** From the snapshot:
   - `i18n.ts:2056-2057` write the French with literal accents. **`:2058-2059` write it in `é` escapes** (`tracés évidés ou en pointillé`). A search for the literal French finds two of the four.
   - Pins: `analysis/placeholder-line.test.ts:54`, `:59`, `:64`, `:69`, `:100`, `:101`, and `lane68-strings.test.ts:18-19` (escapes, built by `INS_EN` and `INS_FR`).
   - Test titles that become false: `placeholder-line.test.ts:52` and `:98`.
   - Comments that become false: `analysis/placeholder-line.ts:61` and `melody/MarkupPane.svelte:730`.
6. **Name item 1's remaining stale claims.**
   - `crossing-ring.test.ts:42`, the title "is solid on a sung vowel and dashed on a placeholder", and the variable `dashed` at `:46`.
   - `crossing-ring.test.ts:9` imports `PLACEHOLDER_DASH`, unused once `:47` changes.
   - `packages/score-parser/src/analysis-types.ts:214-216`: "The renderer draws the marks that rest on it dashed".
   - In `placeholder-mark.ts` the two quoted claims sit at `:10-11` and `:24-25` in the snapshot, where the brief says `:10-12` and `:26-27`. The quotations are exact; the numbers differ. Have the lane find them by their words.
   - For the brief's "report, do not change" question: after the change `PLACEHOLDER_DASH` is still read at `placeholder-mark.ts:79`, the `'stroke'` branch of `placeholderMark`, which no non-test caller selects (`staff-renderer.ts:3011-3029` pass `'tag'` or a hollow head; `stem-legend.ts:139` passes a hollow head).
7. **Define item 3's text and its comparison basis.**
   - The draft says "Every apostrophe is U+2019". Its English paragraph 2 holds U+0027 in "Ilya's". The English Guide uses U+2019 and italicizes Ilya (`GuideContent.svelte:399`, `:600`, `:602`, snapshot), and the draft's English does neither. Say which the lane seats.
   - "Checked by hash" needs a stated basis. The existing pin strips `<em>` before comparing (`ratified-lines.test.ts:474-475`). State: the seated text with tags stripped equals the draft's line with its markdown markers stripped, after the apostrophe decision above.
   - The existing pin finds its passage by `<p id="...">`. Name the ids the new passages take.
   - Paragraph 2: say after which paragraph in Licences it goes, and name the English site. The English heading is at `:596` (snapshot); the brief says only "its English counterpart".
   - "Beside the characteristics heading" does not say before or after. Name the neighbouring elements.
   - The dates line is wrong for paragraph 1. "English 2026-11-22 21:44" is true of paragraph 2 only. Paragraph 1 was rewritten by Dann and ratified in both languages on 2026-11-23 at 22:28, per the draft's own header.
8. **Item 2: confirm the 22:10 ratification is in `INBOX.md`.** My copy ends at 21:29, so I could not find *"Yes, I ratify « VOIX » as it stands."* anywhere but the brief. `CONTRACT.md` section 1 item 20 requires the capture.
9. **Say where the 2026-11-20 00:33 ratification lives.** `INBOX.md:931`: Dann ratified, in both languages, that `placeholder.line.belowCore` and `.belowCoreOne` lose "through the DRAWER on the left" for "in VOICE" and « dans VOIX », to ride "in the wording lane". At `b2869772` both still say DRAWER and « TIROIR de gauche » (`i18n.ts:2051-2052`, snapshot), and neither wording brief carries it. This brief's "change no string at `:2048-2052`" then reads as a ruling against a ratified change. Either carry it or name its lane. Whether MELODY's twins at `:2058-2059` follow is not stated in that ruling.
10. **Lane mechanics.**
    - Cut the branch after lane 85 merges. Both lanes edit `GuideContent.svelte` and `ratified-lines.test.ts`. Lane 85 changes no line count in either, so the brief's line numbers hold.
    - Item 3's pins add tests, so gate 4's total rises. The brief allows a named change; say the expected direction so the lane does not stop on it.
    - "One commit per item with its own report" yields four reports. If one report with four sections is meant, say so.

---

## What I could not establish

**Both jobs**

- Anything about the repository beyond the snapshot. The snapshot is `b2869772` on the word of `brief-sonnet-n204-step1-instruments_r1_2026-11-23.md:13`. Its relation to `ac06d520` (lane 85's base) and to `93edb360` (the r2 brief's tree) is NOT ESTABLISHED, apart from the four lane 85 files, which match by blob hash.
- No rendered page. I looked at no screen of Ilya.

**Job 1**

- Whether the gates pass on Dann's Mac. The lane ran the no-numpy variant from the repository's scripts, not `ilya-ship.sh`, and says so.
- Whether the legend's longer French entry fits its footer in both languages.
- Whether `dd67be0` is `ac06d520` plus the brief, as the lane's report says.
- The « conduit vocal » rulings of 2026-09-30, 2026-11-13, and 2026-11-22 22:47 that section 2b rests on. They are outside the extract. `OPEN.md:4513` applies them and I did not trace further.
- Whether Dann wants the trailing comma restored. The flag is open.

**Job 2**

- Dann's words of 2026-11-22 12:48. `OPEN.md:4529` says they were never transcribed.
- The VOIX ratification of 2026-11-23 22:10, and whether `STATE.md` carries the "drawn hollow" target. Neither is in my copies.
- Whether Dann has been given the one line about the squircle that his 2026-11-18 rule requires.
- How often a singer meets a dashed crossing. `OPEN.md:4527` marks this NOT ESTABLISHED too, and the one look on record found none.
- Whether every placeholder crossing has a hollow turning head beside it. If some do not, then after item 1 those crossings carry no visible sign of resting on a stand-in, and Dann's sentence quoted at `placeholder-mark.ts:2-4` ("We must not propose synthetic values as if they were actual readings") is no longer met for them. I read where the heads are drawn (`staff-renderer.ts:3011-3029`) and did not trace the condition.
- Whether the brief's cited lines hold at `93edb360`. They hold in the snapshot except the two `placeholder-mark.ts` ranges in amendment 6.
- Whether a cloud lane can render MELODY with a voice that draws a dashed crossing.
- Whether the 2026-11-20 00:33 change has been built in a commit later than the snapshot.
- The catalogue of shared properties (`catalogue-shared-properties_r1_2026-11-22.md`) was not staged, so I could not check whether the placeholder sentence is listed as a property MELODY and INSIGHTS hold in common. After item 4 the two pages end that sentence differently: "drawn hollow" and "drawn dashed".
