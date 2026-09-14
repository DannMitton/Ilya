# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`490c12d`**, "N.137: the dictionary line never marks ё with an
acute", shipped 2026-09-14, Vercel `dpl_CfDTDQYQ2AZH79MNz2EWc5GU519t` READY on
the branch alias, walked by Dann (the previous floors, `92b7d5d`, `8278429` and
earlier, are in `../sessions/LOG.md`). A floor cannot go stale,
because further commits only move HEAD forward and never make the floor false.
If the tree is ahead of it, that is expected and tells you only that work has
landed since.

**The ten superseded floors that used to be listed here, `2b81f5a` through
`2d54185`, are in `../sessions/LOG.md`, block 5.** They are closed, and closed
things do not live in this file.

**The push range is the check, not the memo.**
A floor that predates
its own content is the stale number this paragraph exists to prevent. A floor cannot go stale, because further commits only
move HEAD forward and never make the floor false. If the tree is ahead of it,
that is expected and tells you only that work has landed since.

**Ask Dann for the state in one line. You do not WRITE with git, ever.**
Read-only git is allowed under the narrowed CONTRACT §5, ratified 2026-09-13:
`status`, `log`, `diff`, `show`, `ls-files`, `check-ignore`. Asking Dann is
still the courtesy and still the habit.

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> ### THE ONE THING: THE COLOUR STORY, STAGE 5. THE GHOSTS AND THE DUPLICATES.
>
> **Stage 4 CLOSED 2026-09-14, shipped as `aa2b419` and walked by Dann.** Its
> spec, the twenty values, and the two items he did not reach are in
> `../sessions/LOG.md` block 15. Stages 1, 2, 3a, 3b and 4 are done and walked.
>
> **Stage 5 is named by the ruled order, not by the desk**
> (`../sessions/plan-colour-story_r1_2026-09-13.md`, §STAGE 5 and §The order, in
> one line). Its scope, verbatim from that plan: `--stone-600` declared or its
> seven references rewritten; every other ghost the census found; inline literals
> that duplicate a token replaced by the token, or the reason they are literals
> written down beside them. **The plan says it is last on purpose: it is hygiene
> and it is the least visible.** No brief is written for it.
>
> **DANN MAY DISPLACE IT WITH A WORD, and two candidates are already standing.**
> Findings 2 and 3 of the 2026-09-13 walk below, the missing meter signature and
> the possibly halved rhythmic values, are both NOT ESTABLISHED and neither has
> been investigated. §THE SCHEMA rule 3 reserves half of every build day for what
> the previous walk found.
>
> ---
>
> **CLOSE OF 2026-09-14. TWO ITEMS SHIPPED, BOTH WALKED BY DANN.** `4d79f24`,
> all five gates green, `dpl_92MYtg58wc4G3No77UvfPZY8f5oD` READY on the branch
> alias, sha checked before he was sent to it.
>
> - **N.134 DONE.** A score arriving with its own words into an EMPTY poem box
>   fills the box, tags the receipt `from score`, and seats the syllables from
>   the file's own syllable-to-note mapping. Committed alone as `e973afc`.
>   Walked: 39 words, receipt `from score`, Transcription draws, `95 / 95
>   placed`, and the song named from the score header rather than from the poem.
>   **Increment 2, a singer's own different poem, is NOT built.**
> - **N.118 DONE.** Punctuation travels in the slot. Walked on the page:
>   fourteen marks where none drew the day before.
>
> Gate 4 moved 1123 to 1131 to **1144**; the desk moved `~/Downloads/ilya-ship.sh:79`
> both times, per §THE DESK MOVES THE GATE LINE.
>
> **WHAT THAT WALK FOUND, both numbered the same night.** N.136, open
> syllabification never reaches Score markup's drawn text. And the hyphen
> omission, folded into N.129 below on Dann's word.
>
> **THE 2026-09-13 WALK'S FOUR FINDINGS: ONE CLOSED, THREE STAND.**
>
> 1. **CLOSED 2026-09-14, and it was not the defect it looked like.** `Transcribe
>    and fit` was pressed and the counter did not move, because **the button does
>    not fit**: `handleTranscribe` never touches `doc.pairings`
>    (`+page.svelte:2373-2380`, and its own comment says so), and its second act
>    duplicates `Continue to analysis` (`ScoreUploader.svelte:550-560`). **That
>    settles N.121 (c), opposite to the guess recorded there. The pill's fate is
>    still Dann's to rule**, and its two acts are now both known to be duplicates.
> 2. **THE METER SIGNATURE IS MISSING** from the rendered score. Dann's
>    observation, 2026-09-13, on Kabalevsky T05. **NOT ESTABLISHED and still not
>    investigated.** Source:
>    `~/Downloads/Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`.
>    Open the source before reasoning about the render, per tether 10.
> 3. **THE RHYTHMIC VALUES MAY BE HALVED.** Dann: *"it feels like the measures
>    are half the rhythmic value they should be."* Per tether 15 this is evidence,
>    not a claim to argue with. Still open.
> 4. **N.133**, the renderer stops painting its own ground. Ruled, numbered, spec
>    in `OPEN.md`.
>
> **DANN'S OWN ENGRAVING IS DAMAGED, AND IT IS NOT ILYA'S DOING. Measured
> 2026-09-14** on `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`:
>
> - Verse 1 gives the vowelless `в` a note of its own at index 36; verse 2 folds
>   it into `ˈvʲbʲu` at 37. **The two underlays are one note out of phase**, which
>   Dorico's own render of the file shows.
> - **Words are broken across rests in both verses**, 8 in the Cyrillic and 11 in
>   the IPA, counted from the file's own `begin`…`end` marks.
> - The last word is `одинока`, one syllable short of `одинокая`, **which is why
>   the last note draws bare.** Code proved it by appending the `я`.
>
> **He engraved the IPA verse himself in Finale during his doctorate**, so this is
> a file to repair and not a defect in Ilya. **Consequence for the project: this
> score is not a usable ruler for judging seating accuracy.** A clean fixture is
> wanted before anyone judges whether words land on the right notes.
>
> **INSIGHTS, WHAT IS OPEN.** Code made five decisions of its own on N.127
> increment 1, all listed in `../sessions/memo-n127-insights-inc1_r1_2026-09-13.md`,
> all reversible, none reviewed by Dann. One row prints nothing on his Sunless
> score because measure 17 does not add up to its time signature. At 390 px the
> head does not fit three documents: 237.97 px for labels needing 265.19.
> Increment 2 is the compass.
>
> **BRIEFS WRITTEN AND NOT RUN, corrected 2026-09-14:**
> `brief-n117-dictionary-fill_r1_2026-09-12`,
> `brief-n125-slurs-as-objects_r1_2026-09-11`,
> `brief-n119-toggles-reach-score-markup_r1_2026-09-12`,
> `brief-colour-stage4_r1_2026-09-14`,
> `brief-n135-ocr-measurement_r1_2026-09-14` (its measurement RUN, memo landed).
> **N.118's brief ran on 2026-09-14 and the colour token rename is done.**
> **N.119's brief carries a false row and must be corrected before it is built:**
> its audit table says `Open syllables` reaches Score markup. It does not. See
> N.136.
>
> **THE COLOUR STORY, RULED AND PLANNED.** The principle, the five-hue map and
> the six-stage plan are in `../sessions/plan-colour-story_r1_2026-09-13.md`, with
> the full ruling in `INBOX.md`. Learn moves rose to umber; nothing else moves.
> **Stages 1, 2, 3a and 3b are done and walked. Stage 4 is the one thing above.**
>
> **N.129, THE UNDERLAY IS SPACED IN THE WRONG FONT'S METRICS. Numbered by
> Dann 2026-09-13. UNPLACED.** `underlay-widths.ts:690` declares its table as
> "Per-1000-em advance widths for **Source Serif 4** Cyrillic", and the
> renderer uses it for the syllable column advance
> (`staff-renderer.ts:754-762`) and for hyphen and extender endpoints
> (`:2742-2750`). The page has drawn those glyphs in **Source Sans 3** ever
> since the paginator began stripping the renderer's serif root
> (`page-layout.ts:376`). So every syllable's spacing and every hyphen and
> extender end on Score markup is computed from metrics the glyphs never had.
> Code measured about 5% on one word, « ночь » 27.72 serif against 26.34 sans.
> Candidate fixes, unruled: remeasure the table in Source Sans 3, or make the
> face a parameter so the two cannot diverge again. **Bears on N.118 and on
> the `columnAdvance` crowding item already in OWED.** Found by Code inside
> the loupe-typeface memo; the desk read all three sites itself.
>
> **FOLDED IN 2026-09-14 ON DANN'S WORD, found by him on the N.118 walk.**
> He read `не прог ляд – на я,` on the page and counted three hyphens missing
> from one word.
>
> 1. **Ilya omits a hyphen silently whenever two syllables' ink comes within
>    4 px.** `staff-renderer.ts:2761-2763`: `from = rightEdgeOf(a) + 2`,
>    `to = leftEdgeOf(b) - 2`, then `if (to <= from) continue`. The 4 is two
>    paddings, not a chosen engraving value.
> 2. **The file contradicts itself.** `clampHyphenX` handles a gap narrower
>    than the hyphen by centring it and letting it overhang, and says so in
>    its own comment: *"Omitting the hyphen instead is a Gould question (rules
>    26 to 40, unread), so it is not taken here."* The loop omits before
>    `clampHyphenX` is ever reached.
> 3. **Gould rules 26 to 40 are still unread**, recorded at
>    `../sessions/memo-n113-melisma_r1_2026-09-07.md:223`, and the book is not
>    on this machine.
> 4. **RULED BY DANN 2026-09-14:** *"I don't want Ilya dropping hyphens.
>    Instead, I want the note spacing to shift to permit the appearance of
>    hyphens properly."* So the omission goes, and the spacer widens instead.
> 5. **The fix's shape, DESK INFERENCE and his to wave off:** a gap between
>    two syllables of ONE WORD takes a larger floor than a gap between two
>    words, sized to the hyphen plus its clearance. Today there is one floor,
>    `INK_CLEAR_SP = 0.5` stave spaces (N.103), and it knows nothing about
>    hyphens.
> 6. **Named cost:** widening word-internal gaps means fewer measures per
>    system and different pagination on every page, not only on tight words.
> 7. **This work sits on top of the wrong-metrics fix, not beside it.** A
>    hyphen clearance tuned against a table that is 5% out is tuned against a
>    bad ruler.
>
> **SCOPE RULED 2026-09-14, and item 5 is unblocked.** The desk asked whether
> his ruling of 2026-08-13, "THE NOTES NEVER MOVE", barred widening a column to
> fit a hyphen. His answer, recorded in full in `PRODUCT.md`: *"Sometimes I want
> the notes to move to accommodate legibility in the text underlay. The
> engraving is not the composer's; it is a highly edited aspect of the
> musico-textual object that is subject to our scholarly intervention. We can
> freely rearrange the page layout and measure distribution to accommodate
> legibility and logic. We don't want to interfere with these elements without
> justification."* **So layout, measure distribution and horizontal spacing are
> editorial, and the standard is justification rather than prohibition.**
>
> **N.94 HAS A HOME AGAIN, 2026-09-13.** Numbered 2026-08-24 as "transposition
> interface, modelled on Newzik" and never built. It is now a **station inside
> the `Melody` band, sibling to Corrections**. Established: the ENGINE already
> exists and ships. `packages/score-parser/src/transposition.ts` exports
> `transposeScore`, `suggestTranspositions`, `spellPitch`,
> `keyNameAfterTransposition` and more, built so the watch list names computed
> keys rather than guesses (Dann's ruling 2026-07-20), wired at
> `watchlist.ts:476`. Only the control is missing. **Re-read
> `claude/e31-late-rulings-and-the-transposition-control_2026-08-07.md` first**
> (rulings 9 to 14, the detented-ruler spec); it is 37 days old and its
> amendments are unchecked, per tether 17.
>
> **THE NAMES, RATIFIED 2026-09-13, BOTH LANGUAGES.** Tabs: `Text` / « Texte »,
> `Markup` / « Annotation », `Insights` / « Aperçus ». Drawer band:
> `Melody` / « Mélodie ». The French mirrors the English throughout and
> nothing is coined. **Tab padding goes 0.7 rem to 0.5 rem** to fit the French
> row, returning 19.2 px; afterwards English has 55.07 px spare and French
> 15.64 at a 390 px viewport. **OWED: nobody has seen 0.5 rem on screen.**
> This supersedes the `MARKUP` band rename of 2026-09-12.
>
> **THE COLOUR STORY, RULED 2026-09-13.** A hue names ONE IDEA, and a band
> takes the hue of the idea it holds, wherever that band appears. **sage = the
> words** (Text, the Input band); **lavender = the melody** (the Markup tab,
> the Melody band, the turning layer); **cobalt = information** (Guide, the
> Piece band); **rose = your voice** (the new Voice band, the whole
> calibration interface INCLUDING THE PACIFIER, and Insights); **umber = the
> book** (Learn). `Voice` extracts from Score markup to become a band sibling
> of Piece, Input and Melody. Plan and stages:
> `docs/sessions/plan-colour-story_r1_2026-09-13.md`. The census memo landed;
> stage 2 is Dann's four rulings.


> **The history of this section moved to `../sessions/LOG.md` on 2026-09-01.**
> Every entry from 2026-08-23 to 2026-08-27 that used to sit here is in that
> file, verbatim and in order. Nothing was rewritten. This section now carries
> the current one thing and nothing else, which is what `README.md` sends you
> here for.

> **Closed and moved to `../sessions/LOG.md` block 8 at the close of the
> 2026-09-07 session:** N.108 (five increments, `2c1cecf` to `5f6a2f3`),
> N.111 (`7875892`, `c574cf8`, `d5a49ff`, `a186f20`), N.112 (`b191867`,
> `1b3054a`), and N.113 (`e1bcb67`, walked 2026-09-07). All walked by Dann.
>
> **THE TEXT-TO-SCORE SEQUENCE, RULED BY DANN 2026-09-06**, one path through
> the pairing layer: 1 N.108-5 cleanup DONE; 2 N.112 the text is
> authoritative DONE; 3 N.113 the melisma DONE; 4 N.114 the syllable line
> under the poem DONE 2026-09-09 (narrowed from Type Into Score), N.114a
> and N.114b 1 to 5 DONE 2026-09-10. **Then, inserted by Dann 2026-09-10:
> the drawer as a path (Design consulted), carrying N.119 to N.122 and
> N.118.** Then N.110 (set aside, briefed), N.115, N.116, the release
> order N.85 to N.88, N.84 (Guide and Learn), N.83.
>
> **N.127, INSIGHTS, numbered by Dann 2026-09-11 evening (first ruled as
> N.126 in-session; renumbered after the desk missed `STATE.md:497`, the
> collision is the desk's error, owned in-thread). UNPLACED. Ilya's third
> document, sibling to Transcription and Score markup, third member of the
> `DeskHead` pair.** Rulings, all Dann's 2026-09-11: read-only, never an
> input surface; every line computed from the singer's inputs or a sourced
> advice string a predicate fired; appears the instant voice information
> exists, thin to deep, broad-analysis pattern inherited; content in a
> squircle inheriting the watch band (`VoiceProfilePane.svelte:1532-1533`),
> which migrates off Score markup wholly, leaving it pure notation;
> governing colour dusty rose `--dusty-rose #A67B7B`, inks luminance-keyed;
> page one fixed at one page, a second page only when earned, fired advice
> printed there in full; citations as footnotes, attribution in Guide and
> footer; page one ordered for the choosing moment; identity head carries
> voice name, composer, title (DESK DEFAULT: calibration date joins it,
> which would close N.19); section headers take `TitleHeader.svelte`
> `.metadata-line` recipe in rose ink; the compass stave's clef follows the
> SINGER via `chooseClef` on the declared range's median (tenor
> treble-8vb-by-range refinement recorded here, not yet designed); the foot
> is one apparatus block, Insights' copy of `footer.attribution` drops the
> lieder.net clause, siblings untouched; the labelled teacher's blank is
> DEAD, unlabelled negative space stays. Six curation criteria ruled as a
> LIVING list (see the brief), headline: helpful not comprehensive; one
> entry per hazard anchored by its weightiest instance in the Loupe's
> measure-tag grammar; Score markup answers where, Insights answers what,
> how much, and what to do; silence is a finding. Record:
> `docs/sessions/n127-design-pack/` (commits `e0c34c1`, `52517e6`). Design
> returned R1 to R3 the same evening; R3 carries the three clef passes and
> the French-proved foot; a six-item refinement message is with Design
> (stave to 8 px line gap, no note-name captions, mini-squircle collision
> law, G clef curl on the G line, binding-squircle footprint with two
> treatments for Dann to rule, foot daylight and right-indented hairline).
> **Design's returned HTML lives only in Dann's Downloads; commit the
> latest into the pack at the next touch.**
>

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

### Numbered 2026-09-14

- `[ ]` **N.140. The loupe guarantees a stave space, and scrolls rather than
  shrinking below it.** Dann's own design, ruled 2026-09-14, over the desk's
  recommendation to do nothing; both cases are recorded in `OPEN.md`. **A
  phone-portrait item:** the desktop branch already derives its magnification to
  hit a 12 px target (`Loupe.svelte:152`, `:686-691`), and Dann reads the loupe
  well on his desk. **He owes two things: the floor in CSS pixels, and whether
  the scroll may take a gesture on a surface where the swipe dismisses and the
  tap places a syllable.**

- `[ ]` **N.138. The loupe supplies the meter for every measure it shows.** Ruled
  by Dann 2026-09-14. Spec in `OPEN.md`. The notation faces all carry the ten
  `timeSig` digits, every measure already carries the meter in effect
  (`mnx-parser.ts:579`, `musicxml-parser.ts:600`), and the shape is a third panel
  between the loupe's head and its body, so `headBound` and `clipToHead` are
  untouched.
- `[ ]` **N.139. Every meter assignment in a score draws on the page.** Ruled by
  Dann 2026-09-14; **the number is a DESK DEFAULT** and he can collapse it into
  N.138 with a word. Finding 2 of the 2026-09-13 walk. Ilya draws no meter
  signature anywhere: the system head lays out the clef and the key signature and
  nothing else (`staff-renderer.ts:1654-1664`). Spec in `OPEN.md`. **Finding 3 of
  that walk is CLOSED and was not a defect.**

- `[ ]` **N.136. Open syllabification never reaches Score markup's drawn text.**
  Found by Dann on the N.118 walk: the toggle moves, and neither the Cyrillic
  nor the IPA on the page changes. Spec in `OPEN.md`. **Not a regression from
  N.134 or N.118**; those made a partial gap total.
- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann
  2026-09-14. Cost measured the same night in
  `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. Spec in `OPEN.md`.

### Numbered 2026-09-13

- `[ ]` **N.130. Insights has no French.** About 58 entries at `i18n.ts:1417-1475`,
  all English in both languages, found while checking the loupe's undo clauses.
  **Belongs in the release cut's IN bucket:** the ruled release sentence names
  Insights, and a document in the wrong language is wrong rather than
  half-built. Spec in `OPEN.md`. **Dann owes the French; nothing is coined.**
- `[ ]` **N.133. The renderer stops painting its own ground.** Ruled by Dann
  2026-09-13 on the walk: the cream rect at `staff-renderer.ts:2828` and the white
  one at `page-layout.ts:365` both go, and `stripBackingRect` goes with them.
  **Found because the loupe showed a measure on cream instead of its own fill.**
  Closes the census's unobserved print question and §STILL UNSETTLED's half of it.
  **Gates 4 and 5 are exposed.** Spec in `OPEN.md`.
- `[ ]` **N.132. The ratified names are not built.** `Text`, `Markup`, `Melody`,
  ruled 2026-09-13 in both languages, and the tree still says "Transcription" and
  "Score markup" (`i18n.ts:106`, `:117`, `:59`). **Found because Dann walked the
  colour deploy and read the tabs.** Carries the ruled tab padding of 0.5 rem,
  which nobody has seen on screen. Spec in `OPEN.md`.
- `[ ]` **N.131. French parity everywhere else.** The 64 or so untranslated
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

## OWED, RULED BUT NOT YET DONE

- **N.128'S TWO OTHER CONSUMERS. Carried out of the narrative 2026-09-13 and
  SHARPENED; the question is now a single one.** Both `sustain.ts:61-84` and
  `watchlist.ts:229-244` hold **the same duplicated `activeTempoAt`**, which
  compares `ev.rhythmicPosition.fraction` against each tempo marking's position.
  That is the field N.128 found stale. **What is newly established, read
  2026-09-13:** N.128's fix at `correction.ts:358-435` is not a beam-key patch.
  It is a line-wide pass that recomputes the onset of every event whose
  predecessors' durations changed and returns a new event carrying the corrected
  `rhythmicPosition` (`:431`). **So the whole question is which side of that pass
  these two read from.** If they consume the corrected line they are already
  right; if they consume the reader's events they are still wrong. The desk did
  not find the call chain and stopped rather than guess: **NOT ESTABLISHED.**
  Whoever picks this up answers one question, not three. **The duplication is its
  own small finding:** the same function lives in `packages/score-parser` and in
  `apps/web`, so a fix to one does not reach the other.
- **`columnAdvance` reserves no room for the turning layer**, and N.106
  widens what a turning unit can occupy on the right. Nothing crowds on
  Without Sun song 1. Closing it means teaching the layout pass an
  analysis-layer measurement; it belongs with N.103's spacing work. Source:
  `docs/sessions/memo-n106-turning-right_r1_2026-09-02.md`, NOT ESTABLISHED.
- **THREE RESIDUES OF N.104's LOUPE FIX. None is a regression, all three predate
  it, and all three want numbers.** (1) `Loupe.svelte:276-277` still bounds
  `pageMetrics`' head on `[data-hit]`, which is a different question from the
  head's crop: bringing it onto `MUSIC_MARK` makes system 1's tacet measure a
  candidate measure and resizes the loupe's window on every system of the page.
  (2) `Loupe.svelte:218` skips a whole system from the page's ink survey when it
  carries no notes, so a system of nothing but a tacet run draws a numeral the
  survey never sees. **Cannot bite on this document**, where every system with a
  run also carries notes. (3) **`MUSIC_MARK` is pinned by no test.**
  `headBound`'s arithmetic is pinned eight ways; the selector is not, because
  `apps/web`'s vitest has no DOM environment. Source:
  `docs/sessions/memo-n104-loupe-head_r1_2026-08-29.md` §4 and §9.

- **TWO DOCUMENTS FROM 2026-08-17/18 LIVE IN PROJECT KNOWLEDGE, NOT HERE.**
  Nothing else in this folder names them and a session that does not read this
  line will never find them.
  - `claude/gould-beams-delta-pp16-25_2026-08-18.md` — Gould rules 245 to 284,
    Ground Rules pp. 16 to 25, closing v7's gaps item 1 beam pages. **Two
    independent readings, cross-checked.** One flat contradiction on p. 18's
    three-beam rule is recorded UNRESOLVED; do not implement three-beam outer
    placement from it. Four diagram numerals remain unverified.
  - `claude/ruling-semantic-stems-vs-gould-priors_2026-08-18.md` — **Dann's
    ruling: an engraving convention is a PRIOR, not a law.** His Appendices
    assign stem direction a semantic function, stems up for close timbre and
    stems down for open. A Gould prior may bound a DIMENSION; it may not decide
    a MEANING; where a score carries a legend, the legend outranks Gould.
    **This is a constraint on N.59 tier 3, not on tier 2.**
- **Trace `stem_dir`'s consumers in the reader.** `beams.py:264-265` computes
  it and `:310` carries it into the note record. **Whether any stage treats it
  as evidence is NOT ESTABLISHED.** If one does, it is a defect against Dann's
  own scores, which a photograph of Ilya's own output would expose.
  `beams.py:133` reads "S5: one rule, both directions, no directional term",
  read out of a grep and not in context; confirm it.
- **`staff-renderer.ts`'s `positionalUp` now has its citation.** v7 records that
  the helper's beamed-group stem direction is an inference derived from a chord
  rule. Gould p. 24 states it for beams directly, confirmed by both readers:
  the note furthest from the centre of the stave dictates the group's stem
  direction. **Apply the citation the next time that file is touched.**
- **The Gould re-shoot, four spots, would settle every open number.** p. 18's
  three-beam paragraph, and the small diagram numerals on pp. 16, 19, and 21.
- **Step 5's export, single-song half.** Established 2026-08-16: exporting one
  song and restoring a one-song binder into an emptied library both work without
  the list. It is the only thing that would give the chimera warning a detour
  instead of a stop sign. **Dann's ruling: deferred, recorded as owed against
  step 5, NOT folded into 4a.**
- **Remove `bits-ui` from `apps/web/package.json`.** Ruled 2026-08-16: native
  `<dialog>` + `showModal()` is the answer for the delete confirmation AND the
  fingerprint prompt, not bits-ui. **Dann's ruling on timing: not in step 4's
  commit.** It costs zero bytes while nothing imports it, so removing it is
  hygiene, not weight, and it is a lockfile operation. **Do it clean, on its own.**
  Measured before the ruling: one `AlertDialog` cost **+18.7 KB gzipped**
  (392,547 to 411,292), against Fable's ~8 KB budget for all of N.67.

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **THE UNDO SENTENCE FOR "START PLACEMENT OVER". Dann's to rule, English and
  French, then one line in Code.** Carried out of the 2026-09-10 walk narrative
  on 2026-09-13 before that narrative moved to `../sessions/LOG.md` block 12.
  **Confirmed live against the tree 2026-09-13:** the button exists
  (`i18n.ts:1328`, `station.startOver`, en "Start placement over", fr
  « Recommencer le placement »), it is drawn at `IntakePanel.svelte:554`, and
  **no `loupe.undo.*` clause fits it.** The clause list at `i18n.ts:377-392` and
  `:470-472` holds `deleted`, `dotOn`, `dotDouble`, `dotOff`, `lyrics`,
  `restored`, `placed`, `melisma`, `melismaOff`, `entered`, `rest` and `tie`,
  and none of them says that a whole placement was started over.
- **THREE FRENCH STRINGS ARE ENGLISH, found 2026-09-13 while checking the clause
  list above.** `i18n.ts:388` `loupe.undo.placed` reads fr 'syllable placed';
  `:391` `loupe.undo.melisma` reads fr 'melisma set'; `:392`
  `loupe.undo.melismaOff` reads fr 'melisma cleared'. **A singer in French mode
  is shown English in the loupe's undo line.** French is Dann's; nothing is
  coined here.
- **THE RELEASE CUT, and it is the biggest thing he owes. Raised 2026-09-13
  when he asked how close a fully working app is.** The answer is in
  `../sessions/memo-footprint-and-release-arithmetic_r1_2026-09-13.md` §4, and
  the arithmetic is this: about thirty-five units of ruled and unbuilt work
  stand open, throughput runs two to three units per session, so **twelve to
  eighteen sessions, three to six weeks, DESK INFERENCE and a range.** That
  range assumes nothing new is numbered. **In the seven days 2026-09-07 to
  2026-09-13, fifteen new numbers arrived, N.115 to N.129, and nine units
  closed, of which only N.128 was one of the fifteen.** The queue grew faster
  than it drained. **So the release date is set by when he stops numbering, not
  by how fast Code builds.** The ask, when the moment is right: name the items
  a first public Ilya contains, freeze that list, and move the rest to a
  post-release file the way `OPEN.md` now holds unstarted specs. **Do not put
  this to him mid-item, and do not raise it twice.**
- **THE RELEASE ORDER CONTRADICTS ITSELF, and both halves are his. Found
  2026-09-13.** His ruling of 2026-08-24 set the order **N.83, N.84, N.85,
  N.86, N.87, N.88**, with walkthrough prep first, and N.82 and N.89 riding
  between (`../sessions/LOG.md`, the 2026-08-24 numbers table). His
  text-to-score sequence of 2026-09-06 lists it as **the release order N.85 to
  N.88, then N.84, then N.83**, which reverses both ends. Per tether 17 the
  later ruling stands, but **N.83 is the item that produces the first honest
  end-to-end reader accuracy datum, and nothing else in the tree produces one**,
  so putting it last has a cost he may not have intended. **One question,
  whichever order he wants.**
- The binding squircle's footprint on Insights page one: Design proposes two
  treatments, Dann rules (2026-09-11).

### New from N.104, 2026-08-29. One left, not blocking the walk

The bar numbers were ruled on 2026-09-11 and are now N.126, below. The loupe's
typeface closed with `246c17c` on 2026-09-13 and moved to `../sessions/LOG.md`
block 11.9. The tacet question is the one that is still his.

- ~~THE BAR-NUMBERS DRAWING IS WAITING ON HIM.~~ **RULED 2026-09-11 00:40,
  numbered N.126, measure numbers on Score markup, UNPLACED.** Size: the
  lyric underlay's point size. Weight: regular, italic (Gould p484-d
  agrees). Clearance: "legible without emphasis", DESK DEFAULT 1.0
  stave-space (the drawing's middle of 0.6 / 1.0 / 1.4). Bare, never
  parenthesized ("to orient collaborating musicians quickly, not to trumpet
  our editorial decision"). Post-rest anchor: DESK DEFAULT the closing
  barline of the rest, explained to Dann and not waved off. System-start
  number above the clef per Gould p484 and his 2026-08-29 ruling. Drawing:
  `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`; source
  `gould-bar-numbers-p484_2026-08-29.md`. The original text it superseded moved
  to `../sessions/LOG.md` block 11.8 on 2026-09-13.
- **What the correction surface does over a tacet run.** Three proposals in
  `docs/sessions/memo-n104-tacet_r1_2026-08-27.md` §7, unruled since
  2026-08-27. The ship changed nothing there **on desk inference rather than on
  his word**, which is stated so he can wave it off.

### New from N.67 step 5, 2026-08-18. Three copy gaps, all named by Code, none invented

**Code refused to coin a string in all three, which was correct.** The approved
table has no word for these cases, and inventing one would have been writing
French Dann has not seen.

- **A run that only replaced or only skipped says NOTHING.** `importNoticeKey`
  returns null, so answering *Take* on a song you are not in produces no
  sentence. Code's reasoning: the song rises to the top of the list, which is
  visible. **If that reads as silence, it needs a "replaced" string in both
  languages.**
- **A PARTIAL WRITE FAILURE SAYS THE WRONG THING.** Two songs land, one refuses,
  and `binderError` shows `songs.err.write`, which ends "Nothing has changed."
  **Something did change.** The old code was worse, so this is an improvement on
  a defect rather than a new one, but it is not right and no approved string
  fits.
- **`(2) (2)`.** Re-importing a binder of a copy named `… (2)` produces
  `… (2) (2)`, because `uniqueName` numbers the base it is given and the base
  genuinely was `… (2)`. Correct per design §2.3, and it looks odd. Cosmetic.

### New from N.67 step 4b, 2026-08-18. Four, all small, none blocking

- **Boot does not transcribe; a switch does.** Switching songs runs the pipeline
  and draws the transcription; a reload leaves the poem sitting there until the
  singer presses Transcribe. Code named the asymmetry in its memo §6.4 and asked
  which way to close it. **Observed on the deploy 2026-08-18 and confirmed:** the
  reload after the delete showed the poem present, the dictionary loaded, and
  nothing drawn. **Recorded honestly: the coordinator claimed the opposite from a
  pair of screenshots twenty seconds apart, which could not distinguish Ilya
  transcribing from Dann pressing the button, and had to withdraw it.**
- **A song named from its poem never picks up a better name from the score.**
  Memo decision 6.1: the name is written the first time there is material to
  build one from, and is the singer's from then on. Observed: a song auto-named
  `Я тебя любил` from the poem kept that name after a score arrived carrying
  `Я вас любил` and a composer. The rule cannot tell "Ilya guessed" from "Dann
  chose." Rename fixes it in one gesture, so this is a preference, not a defect.
- **The door is on the Transcription tab only.** The Fit tab has the twinned
  binder row by Dann's ruling of 2026-08-16 but no song list, so switching songs
  while working on a score means changing tabs. Code says twinning it is six
  lines and did not do it because the brief named one place.
- **Pressing Delete on a song you are not in appears to switch you into it before
  it asks.** Observed on the deploy: the open song was `Pushkin, control fixture`
  and the dialog opened over an emptied drawer with `Untitled` marked open.
  **NOT ESTABLISHED whether the Delete press caused it or Dann clicked the row
  first; he was asked and the walk moved on.** If Delete does move the singer,
  choosing Keep leaves them somewhere they did not ask to be. Nothing is lost,
  because saving is continuous.

- **A singer on Chrome for iPhone can never install Ilya to the home screen.**
  Chrome on iOS offers no Add to Home Screen and `InstallPrompt.svelte:48`
  already excludes `CriOS` and `FxiOS`. Established by reading, carried over
  from N.72 where it was named and never ruled.
- ~~**N.63.** Where the honest residue goes~~ **RULED 2026-08-21: SAY NOTHING.**
  Still owed: deleting the gate itself, if it still ships. NOT ESTABLISHED
  whether it does; the last evidence is Fable's finding F5 of 2026-08-18.
- **N.45's remainder.**
- ~~**The French question mark.**~~ **RULED 2026-08-21: no space before `?` in
  Canadian French, a hard space before `:`.** It was 47 sites, not eleven. Shipped
  in `9f11490`. **The 63 `!` and `;` sites are NOT done.**
- *(Not yet: what a deliberately empty note draws.)*

---

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

## STILL UNSETTLED. Not yours to settle alone

- **Where the storage notices belong.** They render in the FIT drawer only, so a
  singer working in Transcription never sees a save failure or the two-tab
  notice. Inherited from when they were pairing notices; not moved in E.54
  because moving them is a placement decision, not a build step.
- **The three storage strings still say "syllable placements"** and the save is
  now the whole song. Design §7 puts that copy in step 6, with the French shown
  to Dann first, so it was left alone rather than rewritten twice.

- "The page carries no chrome." · "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened for
  twelve sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- ~~`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.~~ **SETTLED 2026-09-07 by Dann's print preview: the cream prints. Ruled: the page prints white. Paste written (INBOX), not yet run.**
- **The marks on the printed page.** E.51's prints carry a dashed `VERIFY` box
  and a `USER OVERRIDE` badge on paper. CONTRACT §6 forbids a mark that says Ilya
  is unsure. **Whether these are the ruled exception was not checked.**
- **`VoiceProfilePane.svelte:295-313` duplicates the old header arithmetic.**
  Fit's paper does not yet share the Transcribe paper's single `HEADER_GAP`.
- **Whether `.mscz` ingest actually succeeds in a browser.** The path is live in
  code (`ScoreUploader.svelte:106-137`) but `i18n.ts:272` still carries a
  "coming soon" string for it. Nobody has run it.

---

## Register corrections owed

`claude/ILYA-REGISTER_2026-08-11.md` is at revision 10 and needs revision 11.
Its N.55a row is FALSE (N.55a is CLOSED). It says "ten cardinals" over a list of
twelve; **five actually remain and none is in the tree: N.1, N.2, N.3, N.18,
N.21.** Its N.55b row is stale. **The blocking number is now THREE.**

**Or fold the register into this file and retire it.** It is the last piece of
canon still living in project knowledge.

---


---
*Split 2026-09-01. `STATE.md` was 3,089 lines and 207 KB. The session history,
the `## Log` table, and three stale colophons moved to `../sessions/LOG.md`.
What stays is what `README.md` asks a new session to read: the one thing, the
tracker, and the rulings Dann owes. Backup of the pre-split file:
`STATE.md.bak-2026-09-01`.*

*Close of 2026-09-10 late: 673 lines, over the 600 tripwire after N.123, N.124, and the Tempo station were added. Two blocks moved to LOG.md block 10 tonight (the 06:15 one-thing block; the blocking-set table). What remains is open. The next thing to move is whatever Dann rules in RULINGS DANN OWES; the 2026-08-18 copy-gap and step-4b lists are the oldest.*

*Close of 2026-09-13, on Dann's word: the four stage 2 ruling records left this file for `../sessions/spec-colour_r1_2026-09-13.md`, verbatim. They were not closed work, so `LOG.md` was the wrong destination; they are the specification stage 4 builds from, and this file keeps the twenty values and a pointer. Per `ENVIRONMENT.md` §PRUNING A MEMORY FILE, no line count is written here, because the number is stale the moment anything else is added. The remaining excess is still the 2026-09-10 and 2026-09-11 walk narrative named above, with its three live residues, untouched tonight.*

*Close of 2026-09-13, the colour session. Stages 3a and 3b and the close of stage 2 moved to `../sessions/LOG.md` block 13, verbatim, with three live items lifted out of them first and kept in §THE ONE THING. The four stage 2 ruling records left earlier the same day for `../sessions/spec-colour_r1_2026-09-13.md`. Four items were numbered: N.130, N.131, N.132, N.133. Per `ENVIRONMENT.md` §PRUNING A MEMORY FILE, no line count is written here.*

*Close of 2026-09-14. N.134 and N.118 both shipped in `4d79f24` and were walked
by Dann; their accounts and the one-thing block they replaced are in
`../sessions/LOG.md` block 14, verbatim. Four things were lifted out and
rewritten fresh rather than moved: the stage 4 spec, the twenty values, INSIGHTS
WHAT IS OPEN, and BRIEFS WRITTEN AND NOT RUN. Numbered tonight: N.135 and N.136.
Extended tonight: N.129 with the hyphen omission and its ruling, N.115 with both
arrow directions and the reflow standard. Amended tonight: `PRODUCT.md` twice
(layout is editorial; agency is the justification; a vowelless clitic never holds
a note alone) and `CONTRACT.md` twice (no aphorisms and no hype; do not write his
rulings as absolutes). Per `ENVIRONMENT.md` §PRUNING A MEMORY FILE, no line count
is written here.*


*Close of 2026-09-14 late. Stage 4 of the colour story shipped as `aa2b419` and
was walked; N.137 was numbered, shipped as `490c12d`, and walked the same night.
Both moved to `../sessions/LOG.md` block 15, verbatim, with the two items stage
4's walk did not reach recorded there as UNWALKED rather than passed. The floor
moves to `490c12d`. `CONTRACT.md` tether 18 was amended: describe a glyph, never
substitute the nearest letter you can type. `ENVIRONMENT.md` gains the ё plus
U+0301 render trap with its index row, and a second dated sighting of the
stranded `index.lock`. THE ONE THING moves to colour stage 5 on the ruled order
of `plan-colour-story_r1_2026-09-13.md`, and Dann may displace it with a word.*

***TRIPWIRE: this file is over 600 lines. Per `README.md` that means something
failed to move, and it is not stage 4, which moved tonight. The oldest
candidates are still the 2026-08-18 copy-gap and step-4b lists and the RULINGS
DANN OWES block. Raised for Dann, not acted on.***
