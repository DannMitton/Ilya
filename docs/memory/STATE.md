# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`92b7d5d`**, "N.114b: items 6 to 9, air, binder order, collapse row
gone, Start over as a ghost pill", shipped 2026-09-10 04:24, Vercel
`dpl_E42mxc3bGuhkZAUNTMk6RmhrTRhE` READY on the branch alias, walked by Dann
(the previous floors, `8278429` and earlier, are in `../sessions/LOG.md`). A floor cannot go stale,
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

> ### THE ONE THING: THE COLOUR STORY, STAGE 3a. THE RENAME.
>
> **STAGE 3a IS BUILT, WALKED BY CODE, AND COMMITTED `6c53a9d` 2026-09-13**,
> "Colour story stage 3a: the families take one-word names", 24 files, 435
> insertions. **NOT SHIPPED and not walked by Dann.** `--dusty-rose` to `--rose`, `--deeper-lavender` to `--lavender`,
> `--quiet-cobalt` to `--cobalt`. **No hex value moved.** Memo:
> `docs/sessions/memo-colour-token-rename_r1_2026-09-13.md`. Prompt Code was
> given: `docs/sessions/paste-colour-3a_r1_2026-09-13.md`.
>
> **THE DESK'S PREDICTION WAS WRONG AND THE ERROR IS ON THE RECORD.** The desk
> said no gate would move. Gate 4 failed 3 of 1123, all reading "token
> --deeper-lavender is not declared", because `contrast.ts:128` and `:283` key
> the pacifier palette as the bare string `'deeper-lavender'` with no leading
> dashes, which the desk's `--deeper-lavender` grep could not match. Code
> renamed both keys plus six dash-less comments and gate 4 returned to 1123.
> **The trap is in `ENVIRONMENT.md` §A TOKEN IS ALSO A STRING KEY, with its
> index row.**
>
> **Counts confirmed against the desk's:** 19, 43 and 12 uses across 6, 13 and 6
> files. **20 files changed in all**, the extra one being the comments.
> **Old names remaining in `apps/web/src` and `packages/*/src`: none.** `docs/`
> went 205 to 221 hits, the 16 new ones all inside the memo.
> **All five gates at baseline**, run directly rather than through the ship
> script, which refuses while untracked files exist.
>
> **CODE'S OWN CAVEAT, kept because it is honest and not yet closed:** every rose
> and lavender use it saw on screen also carries its hex as a fallback, so those
> two would paint correctly even with a broken name; the proof for them is that
> the page resolves `--rose` and `--lavender` to their values. **Cobalt is the one
> proven by paint alone**, because the drawer's Piece band has no fallback.
>
> **DANN HAS NOT WALKED IT.** Code walked all five documents at 1400 px and found
> every desk, band and chip unchanged.
>
> **STAGE 2 CLOSED 2026-09-13. All four rulings are Dann's and all four are
> recorded below, which is the specification stage 4 builds from.** Ruling 1 the
> ramp, ruling 2 the neutrals, ruling 3 the strays, ruling 4 the fourth value.
> Nothing in stage 2 is open.
>
> **THE NEXT THING IS STAGE 3a AND IT IS ALREADY BRIEFED:**
> `docs/sessions/brief-colour-token-rename_r1_2026-09-13.md`. `--dusty-rose` to
> `--rose`, `--deeper-lavender` to `--lavender`, `--quiet-cobalt` to `--cobalt`.
> About 95 call sites, **no value changes**, and the tests assert hex literals
> rather than token names, so no gate can move. It has not been run.
>
> **THE RULINGS' EVIDENCE IS COMMITTED, `45f7cd4`, 2026-09-13**, "Colour story
> stage 2: the four rulings, the drawings they were ruled from, and the release
> inventory", 7 files, 851 insertions. Documentation only; no code changed and
> nothing shipped. The four drawings Dann walked and ruled from are
> `drawing-the-ramp_r1`, `drawing-the-neutrals_r1`, `drawing-the-strays_r1` and
> `drawing-the-fourth-value_r1`, with `inventory-release_r1`, all 2026-09-13 in
> `docs/sessions/`.
>
> ---
>
> **THE RECORD OF STAGE 2 FOLLOWS. Its four questions are ANSWERED; the text below
> is kept because the rulings' reasoning and values live in it.**
>
> **Set 2026-09-13.** Asked whether stage 2 was the one thing, Dann: *"I think
> so, but I'd feel most comfortable starting that work in a fresh thread."* So
> this session closed rather than open the rulings, and **the next session opens
> on ruling 1 and asks it alone.**
>
> **Stage 1, the census, is CLOSED.** Stage 2 is four rulings and nothing else.
> Stages 3 and 4 both wait on them, which is why no build work is queued behind
> this.
>
> **The plan:** `docs/sessions/plan-colour-story_r1_2026-09-13.md`, read in full
> 2026-09-13, six stages. **The census memo:** `docs/sessions/memo-neutral-audit_r1_2026-09-13.md`,
> 1786 lines, §1 and §2 read in full 2026-09-13 and its tables NOT read. **Its
> filename does not say colour, which already cost one search; it is the census,
> and it answers `brief-colour-census_r1_2026-09-13.md`.**
>
> **THE PLAN'S MAP IS STALE IN TWO CELLS. QUOTE THE RULING IN THIS FILE, NEVER
> THE PLAN'S TABLE.** The plan calls lavender "notation and voice", puts the
> pacifier nowhere, and gives rose "your voice, explained" with Insights only.
> The colour story ruling of 2026-09-13, later the same day and recorded in this
> section, names lavender "the melody", moves the pacifier into rose with the
> whole calibration interface, and adds a `Voice` band as a sibling of Piece,
> Input and Melody.
>
> **Ask one at a time, in this order, each with its census section open. The
> numbers in rulings 1, 3 and 4 are the plan's own words, not the desk's.**
>
> 1. **The ramp.** Do the three marks space evenly, L 0.64 / 0.53 / 0.42 in
>    steps of 0.11, against today's 0.23 / 0.05 / 0.05? Cost: four of five
>    bands move by under 0.03 and are invisible, and cobalt moves 0.084, which
>    he will see. Gain: band and chip stop being mistakable, every chip clears
>    5.16 on white against today's 4.5, and every ink clears 6.9 on cream
>    against rose's 4.69. Method:
>    `docs/sessions/drawing-warm-brown_r1_2026-09-13.html`.
> 2. **The neutrals.** Which of them consolidate. **The plan says eleven and the
>    census says twelve values against ten tokens plus two literals**, with two
>    pairs inside 0.02 lightness of each other: `--stone-300` with
>    `--desk-surface`, and `--stone-700` with `--ink-secondary`. Census §6.1,
>    §6.2, and the table at §7.1.
> 3. **The strays.** `--light-sage`, `--light-lavender`, `--deeper-sage`,
>    `--muted-lavender`: each becomes a role in the grammar, or goes. Census
>    §5.1 and §5.2, which found eight lavender values with seven painting
>    something, and twelve sage-family values with ten painting.
> 4. **The fourth value's name.** Rose's label ink is the inline `#8A5C5C`
>    today. Every family gets a fourth name, or none does. Census §5.4.
>
> #### RULED 1 OF 4, RATIFIED BY DANN 2026-09-13. THE RAMP IS EVEN.
>
> His words: *"Yes, as you recommend... I really appreciate the range between
> lightest and darkest values of each colour. Ratified."*
>
> **The rule.** Three marks, spaced in OKLCH lightness: **band L 0.640, chip
> L 0.530, label ink L 0.420**, steps of 0.11. Each family holds its OWN hue and
> chroma, taken from today's band. **The desk is NOT on the ramp** and keeps the
> 40 % hue plus 60 % white recipe.
>
> **The generative spec, computed by the desk 2026-09-13 and rendered before he
> ruled.** Hue and chroma per family, then the three values they produce:
>
> | family | H | C | band L 0.640 | chip L 0.530 | ink L 0.420 |
> |---|---|---|---|---|---|
> | sage | 129.9 | 0.045 | `#839275` | `#637156` | `#455238` |
> | rose | 18.7 | 0.054 | `#AB7F7F` | `#885F60` | `#674141` |
> | lavender | 309.8 | 0.047 | `#9585A2` | `#746580` | `#554660` |
> | cobalt | 262.5 | 0.073 | `#748CB9` | `#556C96` | `#374D75` |
> | umber | 66.5 | 0.055 | `#A38669` | `#82664A` | `#61472C` |
>
> **Every chip clears 5.21 on white** (today's floor is 4.52) **and every ink
> clears 7.02 on cream** (today's only ink, rose's `#8A5C5C`, is 4.69). **The one
> visible cost, accepted:** cobalt's band lightens by 0.085 everywhere cobalt
> appears. The other four bands move by under 0.03.
>
> **The desk corrected the plan's own numbers before he ruled, both in the plan's
> favour:** the chip floor is 5.21 on white, not 5.16, and cobalt moves 0.085,
> not 0.084. Also: sage's band and chip are already 0.106 apart today, so the
> plan's "today's 0.23 / 0.05 / 0.05" describes rose, not every family.
>
> **Drawing, today against the proposal, five families:**
> `docs/sessions/drawing-the-ramp_r1_2026-09-13.html`. **UNTRACKED. It needs a
> `git add` before the next ship.** Dann walked it in his browser and ratified
> from it.
>
> **Applies at STAGE 4, not before.** Nothing reaches the screen until then.

> #### RULED 2 OF 4, RATIFIED BY DANN 2026-09-13. THE NEUTRALS. TWELVE VALUES BECOME TEN.
>
> His words: *"Yes I accept all of your suggestions."* All four moves, as put to him
> from `docs/sessions/drawing-the-neutrals_r1_2026-09-13.html` (UNTRACKED, needs a
> `git add`), which he walked in his browser.
>
> 1. **`--stone-700` merges into `--ink-secondary`.** 0.020 apart in L, same hue to
>    the degree. Three sites: the loupe's frame (`Loupe.svelte:931`, the hardest),
>    the hovered provenance icons (`WordStack.svelte:321-324`), and the ё sigla
>    (`InspectorPanel.svelte:1867`). **No gate moves:** `--ink-secondary` keeps its
>    own value, so `contrast.ts:130-133` is untouched.
> 2. **`#3A352F` GETS A TOKEN AND DOES NOT MERGE.** 37 uses, no name. The census
>    found the split holds across all 29 renderer sites: `#3A352F` is the stave's
>    furniture (lines, clefs, key signatures, barlines, rests, ledger lines,
>    multi-bar numerals) and `--ink-primary` is what is sung (noteheads, stems,
>    beams, accidentals, ties, lyrics). Naming pass only, no value change.
> 3. **`#57534E` GOES; its seven sites take `--stone-500`.** All seven are fallbacks
>    to `--stone-600`, which is declared nowhere. Today the drawer's ghost buttons
>    carry an outline 0.109 darker than their own label. This is the only
>    singer-visible change in the whole ruling and it makes the button quieter.
> 4. **`--stone-300` and `--desk-surface` STAY AS TWO**, though 0.001 apart in L.
>    One is control chrome, the other is the ground. Merged, warming the desk would
>    warm every hairline and every off switch.
>
> **FLAGGED, NOT RULED, and deliberately not folded into this ruling:**
> `--paper-light` is meant to be the one visual difference between the reading aid
> and the page, and the census measured that difference at 0.018, under one
> just-noticeable difference. It does not do its job. That is a question about what
> the reading aid should look like; it belongs with the drawer work.
>
> **DANN'S QUESTION, ANSWERED 2026-09-13 AND WORTH KEEPING.** He asked whether
> `--desk-surface` is too dark and whether it serves Learn or Guide. Answer, all
> read this session: it serves NEITHER. `app.css:53` declares it "Desk — global
> background beneath Paper"; `app.css:54` feeds it to `--app-bg`; `app.css:207`
> paints `body` with it; `+page.svelte:5193` makes it the DEFAULT of `--desk-fill`.
> **But all five tabs override that default** with their own hue
> (`+page.svelte:5343-5371`): transcription sage, learn rose, guide cobalt,
> insights rose, shane lavender. So `--desk-surface` paints only whatever of `body`
> shows past `.app-content`, **and whether any of it is visible is NOT
> ESTABLISHED.** It is therefore a stage 5 candidate, not a stage 4 one.

> #### RULED 3 OF 4, RATIFIED BY DANN 2026-09-13. THE STRAYS. THREE GO, ONE SPLITS.
>
> His words: *"Yes to all four of your excellent recommendations."* Put to him from
> `docs/sessions/drawing-the-strays_r1_2026-09-13.html` (UNTRACKED, needs a
> `git add`). Sources: census §5.1, §5.2, §5.3, read in full 2026-09-13.
>
> 1. **`--light-sage` GOES.** `#A8B5A0`, declared `app.css:34`, **no use anywhere**:
>    no stylesheet, no component, no test. Deleting it changes no screen.
> 2. **`--light-lavender` GOES, with one companion edit.** `#C4BACF`, declared
>    `app.css:170`, paints nothing. `contrast.ts:127` holds a copy and R20
>    (`contrast.test.ts:233`) asserts the two match, **so the copy and the
>    assertion move in the same commit or the gate fails.**
> 3. **`--deeper-sage` STAYS AND SPLITS INTO TWO, both holding `#7A8A6C` on the day
>    they land, so nothing changes on screen.** It is not a stray. It paints the
>    gloss line under every word on the page (`WordStack.svelte:275`) AND five
>    pointer states: `InspectorPanel.svelte:1522`, `:2185`, `IntakePanel.svelte:1060`,
>    `HeaderBar.svelte:149`, `InstallPrompt.svelte:205`. One value doing a printed
>    page element and a hover is how the gloss gets darkened by a hover change.
> 4. **`--muted-lavender` GOES.** `#A89BB5`, one use in the whole tree: the update
>    toast's border, `+page.svelte:5795`. `app.css:163` files it under the
>    pacifier's heading and it is not in the pacifier. The toast takes a neutral.

> #### RULED 4 OF 4, RATIFIED BY DANN 2026-09-13. THE FOURTH VALUE IS A RULE, NOT AN EXCEPTION.
>
> His words: *"The rule. That's what we're doing today: achieving articulated
> consistency."* Put to him from
> `docs/sessions/drawing-the-fourth-value_r1_2026-09-13.html` (UNTRACKED).
>
> **The desk reframed the plan's question before asking it, on two reads.**
> `TitleHeader.svelte:161-168` gives EVERY page's metadata line
> `color: var(--ink-secondary)`, a neutral. `InsightsPane.svelte:505` copies that
> recipe and overrides the colour to the bare literal `#8A5C5C`, per Dann's ruling
> of 2026-09-11. So one document tinted its label ink and the shared recipe was
> deliberately neutral. The question was therefore not "does every family get a
> fourth name" but **"is a tinted label ink the rule or Insights' exception".**
>
> **RULED: the rule.** Every document's label ink is its own family at the ramp's
> **L 0.420**. Five ink tokens, every one of them painting: sage `#455238` on Text,
> lavender `#554660` on Markup, rose `#674141` on Insights, umber `#61472C` on
> Learn, cobalt `#374D75` on Guide. Every one clears 7.02 on cream.
>
> **THE TRADE, ACCEPTED, and it amends a desk statement made the same day.** The
> desk had told Dann the page is deliberately neutral, the hue sitting around the
> paper while the paper takes no side. This puts the hue onto the paper in one
> small place. **The reason it wins: the neutrality argument holds on screen, where
> the desk is always visible, and fails on paper, because a printed page carries no
> desk.** A singer with three sheets on a piano can tell them apart at arm's length.
>
> **THE ONE VISIBLE CHANGE:** Insights' label ink goes from `#8A5C5C` at L 0.524 to
> `#674141` at L 0.420. Darker, and Dann was told so before he ruled.

> **Done when: MET 2026-09-13.** All four are ruled and written into this block. That hands
> stage 3a its go-ahead, and 3a is already briefed as
> `brief-colour-token-rename_r1_2026-09-13.md`, about 95 call sites, no value
> changes, no gate movement.
>
> **Do not start stage 3 or 4 before all four are ruled.** The plan's own
> reason: every later stage touches the same declarations, and out of order
> means touching them twice.

> **CLOSE OF 2026-09-13, THE PRUNE SESSION. NO CODE RAN AND NOTHING SHIPPED.**
>
> The whole session was the prune this section asked for, plus the split it
> turned out to need. **Nothing was farmed out; Fable stood at 89 % and the desk
> stayed off it.** What changed, all of it documentation:
>
> 1. **`../sessions/LOG.md` block 11**, ten entries. 11.1 to 11.6 are the six
>    blocks the prune instruction named. 11.7 to 11.10 came out of the row-by-row
>    assessment it asked for: the `InstallPrompt` row struck DONE in August, the
>    bar-numbers original text the 2026-09-11 ruling superseded, the loupe
>    typeface row that `246c17c` closed, and five rulings Dann had already made
>    sitting in `RULINGS DANN OWES`.
> 2. **`OPEN.md` is new**, carrying 188 lines of item specs verbatim out of this
>    section. `README.md` holds it at rank 5, outside the opening read.
> 3. **`ENVIRONMENT.md` gained two sections:** `A STAVE STEP IS HALF A SPACE`,
>    moved out of §OWED because it is a permanent trap and not an owed item, and
>    `PRUNING A MEMORY FILE`, which is the recipe and the one way it broke.
> 4. **`README.md`'s one-thing block was lying and is fixed.** It still named
>    the syllable station and the note click as `WRITTEN`, and sent the reader
>    to a `STATE.md` §The walk that does not exist. Neither phrase appeared
>    anywhere in this file any more. The block warns against exactly that fault
>    in its own second line.
> 5. **Two section headings that counted their rows were corrected** after
>    removals: `FOUR SHIPS` and `New from N.104 ... Three`.
>
> **Nothing was reworded anywhere. Every moved block is verbatim.** The backup of
> `STATE.md` as it stood before the prune is at `$HOME/STATE.md.pre-prune-20260913`
> in the bridge shell's own home, which is outside the repository and will not
> survive the session.
>
> **AFTER THE COMMIT, he asked two questions: how big Ilya is, and how close a
> fully working app is.** Both are answered with measurements in
> `../sessions/memo-footprint-and-release-arithmetic_r1_2026-09-13.md`. The size
> lookup is in `ENVIRONMENT.md` §ILYA'S SIZE. **The two rulings the second
> question produced are at the top of §RULINGS DANN OWES: the release cut, and
> the release order contradicting itself.** Nothing was built and nothing shipped.
>
> **NOT DONE, and named so it is not lost:** the 105 lines of 2026-09-10 and
> 2026-09-11 walk narrative still in this section. The tripwire note says what
> has to come out of it first.
>
> **CLOSE OF 2026-09-12 INTO 2026-09-13. FOUR SHIPS, ALL WALKED OR VERIFIED.**
>
> **`085bb9e` N.128 was the fourth. Its account moved to `../sessions/LOG.md`
> block 11.2 on 2026-09-13, shipped and walked, nothing open on it.**
>
> 1. `9026a56` path pass increment 3, **walked whole by Dann, DONE**.
> 2. `246c17c` the loupe draws sans like the page, the renderer root follows,
>    and the undo and redo marks are restored to `↰ ↱`. Dann confirmed the
>    Cyrillic match; he then said the marks are still not the sigla he recalls,
>    and the search found what he was remembering: the pacifier's `provisional`
>    badge, a circled `↻` (`Pacifier.svelte:836-848`). **DESK DEFAULT, unruled:
>    the band takes `↶ ↷`, since the badge stays where it is.**
> 3. `7841fe7` **N.127 increment 1: INSIGHTS IS LIVE**, the third document,
>    without the compass. Gate 4 is at **1123**.
>
> **INSIGHTS, WHAT IS OPEN.** Code made five decisions of its own, all listed in
> `memo-n127-insights-inc1_r1_2026-09-13.md` and all reversible, none reviewed
> by Dann. One row prints nothing on his Sunless score because measure 17 does
> not add up to its time signature. At 390 px the head does not fit three
> documents: 237.97 px for labels needing 265.19. Increment 2 is the compass.
>
> **BRIEFS WRITTEN AND NOT RUN:** `brief-n117-dictionary-fill_r1_2026-09-12`,
> `brief-n125-slurs-as-objects_r1_2026-09-11`,
> `brief-n118-punctuation-travels_r1_2026-09-12`,
> `brief-n119-toggles-reach-score-markup_r1_2026-09-12`,
> `brief-colour-token-rename_r1_2026-09-13`. N.119's audit corrected `STATE.md`:
> five of the seven Notation toggles already reach Score markup.
>
> **THE COLOUR STORY, RULED AND PLANNED.** The principle, the five-hue map, and
> the six-stage plan are in `docs/sessions/plan-colour-story_r1_2026-09-13.md`,
> with the full ruling in `INBOX.md`. Learn moves rose to umber; nothing else
> moves. Stage 1, the census, is running.
>
> **N.121's unbuilt half, established 2026-09-12:** no path anywhere fills the
> poem box from an ingested score's lyrics, which is why Dann's Score markup is
> full while Transcription is empty. His ruling of 2026-09-10 covers it.
>
> **THE TRIPWIRE IS CLEAR AGAIN, 2026-09-13, and here is what it took, because
> the next session will hit the same wall if it only moves closed things.** This
> file was 937 lines. Ninety-five lines were closed and went to
> `../sessions/LOG.md` block 11, which is all the prune instruction asked for and
> was never going to be enough. The rest of the excess was never closed: it was
> the catalogue of open items sitting inside this section, 188 lines of specs for
> N.115 to N.124 and the open lists, which no close could move because every line
> of it is live. **It now lives in `OPEN.md`, verbatim**, and `README.md` carries
> it at rank 5 of the read order, outside the opening read. That took this file
> to 583 lines, and the new one thing block, with this note, put it back over the
> line. **So when the tripwire
> fires, ask first whether the excess is closed work or misfiled work. Twice now
> it has been the second.**
>
> **WHAT IS LEFT TO FIND, named so nobody has to find it twice.** The remaining
> excess is the walk narrative of 2026-09-10 and 2026-09-11 inside this section,
> about 105 lines: the 23:55 one thing, the rulings of 2026-09-10 late, the walk
> findings, the rulings of 2026-09-11 00:00 to 00:12, and N.128's account, which
> is DONE. **It was not moved on 2026-09-13 because three live residues are
> buried in it** and pulling them out is judgement, not filing: the `n of 7
> changed` line owed to Code, N.121 (d)'s Undo clause for Start placement over,
> and the NOT ESTABLISHED about N.128's two other consumers. **Extract those
> three into their own blocks first, then the narrative moves in one piece.**
> Do not farm this out: a subagent cannot tell a residue from a record.
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
> **THE ONE THING, at the close of 2026-09-10 23:55: THE DRAWER AS A PATH,
> step 3 of 4. THE PATH PASS IS WALKED WHOLE AND INCREMENT 2 IS SHIPPED AND
> WALKED.** Walk of `a584ad8` by Dann in a fresh incognito profile at 1400 px
> and 390 px, all six steps of `brief-path-pass_r1` §5: passes, with
> findings. Increment 2 shipped `8032489` (Vercel
> `dpl_7TxVs9XHJksHW9nWBVfgLYBHbsPs`, READY 23:41, alias attached), from
> `docs/sessions/brief-path-pass-inc2_r1_2026-09-10.md` on Sonnet's anchor
> memo `memo-anchors-path-pass-inc2_r1_2026-09-10.md`; Code's memo
> `memo-path-pass-inc2_r1_2026-09-10.md`. Dann walked it on the alias at
> 390 px and 1400 px: three bands (PIECE, INPUT, SCORE MARKUP); the Text
> fold under the poem box, closed by default; `1 of 7 changed` after one
> toggle; band corners rounded on close at desktop width ("whatever was
> causing the problems seems to have been resolved"). Gate 4 moved
> 1103 → 1104; `ilya-ship.sh:79` moved with it before the ship.
>
> **RULED BY DANN 2026-09-10 late, all in this session:** (a) nothing under
> TEXT at default, ratified 21:55, then made moot by (b); (b) TEXT is not a
> band: it folds into INPUT as a section under the poem box, on trial
> ("if I don't like it we can revert"), shipped in `8032489`; (c) the
> `n of 7 changed` phrase belongs beside the `Notation` header, NOT the
> `Text` row where Code put it. **ONE LINE FOR CODE, OWED**, into the next
> brief. (d) The running header on page 2 and after should read
> Composer - Title (INBOX, unruled beyond the ask).
>
> **From the walk, settled:** the `.musx` drop works in the browser (denigma
> to MNX); a `.musx` can never carry `from score` because MNX has no work
> metadata (`mnx-parser.ts:743-755`, Sonnet, read); Dann had clicked PIECE
> and TEXT open himself (F4 withdrawn); the short INPUT line after reload is
> a timing race that resolves itself in about 4.6 s (Code, measured), no
> code changed; where the five PIECE fields came from on the `.musx` arrival
> is NOT ESTABLISHED (Code: the file fills none on a fresh profile; Dann's
> typing or a stored song are the two seams). Boot does not transcribe was
> seen again at 390 px, then on the next reload the page DID draw; not
> explained. Code's own NOT ESTABLISHED list is in its memo.
>
> **RULED 2026-09-11 00:00 to 00:12, after the close above, all Dann's:**
> (e) the Text fold is DELETED; `Notation` and `Analysis` are two plain
> rows under the receipts, both closed; (f) Undo and Redo leave the top bar
> (which keeps the sigil and the language toggle) and sit at the right end
> of the SCORE MARKUP band header as clickable text in the label style, not
> pills, shown only when a stack is non-empty; the loupe's own undo is
> unchanged; Code inventories the undo stack first and stops if anything on
> it originates outside Score markup. Brief WRITTEN, not run, UNTRACKED:
> `docs/sessions/brief-path-pass-inc3_r1_2026-09-11.md` (126 lines), which
> also carries (c) and a read-only inventory of filled pills at rest
> (`Dictionary` and `Calibrate` were both filled at 00:02).
>
> **THE ONE THING after this walk: the four ready briefs, in order.**
> `brief-loupe-typeface_r1_2026-09-12.md` (loupe typeface plus the `↰ ↱`
> marks restored), `brief-n128-stale-beat_r1_2026-09-12.md`,
> `brief-n117-dictionary-fill_r1_2026-09-12.md`,
> `brief-n125-slurs-as-objects_r1_2026-09-11.md`. One Code thread at a time,
> never two: this desk and Code share one working tree.
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
> **N.128, THE BEAT A NOTE THINKS IT IS ON, numbered by Dann 2026-09-12,
> UNPLACED. A corrected duration does not move the following notes' stored
> rhythmic position, so beam grouping reads a stale beat.** Found on Dann's
> own Sunless 01 page: « на–я » is flagged and « ла–я » is beamed although
> both are drawn as two eighths in the last beat of their measure.
> **Dann's words, and they are the item, not the beaming:** *"I really don't
> care whether this kind of figure is beamed or flagged, but whatever it is,
> it has to follow a rule. This doesn't seem to, and I want to scrutinize
> what looks like arbitrary typesetting."*
> Measured from the live SVG in his browser: spacing identical for both
> pairs (тес→на 54.78 px = ми→ла 54.78 px; на→я 20.14 vs ла→я 19.67;
> я→rest 15.68 vs 15.69); all four stems down, so timbre did not break the
> group; the only eighth rests (SMuFL `e4e6`) sit at x 353.2, 490.85, 602.5,
> each AFTER the second « я », so no rest and no barline falls between
> either pair; the system's one beam runs x 563.89 to 583.56.
> Cause: the beam key is
> `measure | beatIndexOf(ev.rhythmicPosition.fraction, ts) | timbre`
> (`staff-renderer.ts:1611`), and the duration-correction path never moved
> the following notes' onsets. **CORRECTED 2026-09-12 by Code, and the
> desk's error is on the record:** the desk cited `modification-engine.ts`
> having zero references to `rhythmicPosition`, but that file is the
> **vowel**-modification engine (`modification-engine.ts:1-2`) and was never
> in the duration path. The zero hits were true and irrelevant. Durations
> change in `apps/web/src/lib/shane/correction.ts`. The x layout advances by
> duration, so the page redraws; nothing recomputed the following events'
> positions. On the page на is `m1-1-1` (4.0 quarters, beat 3 of 12/8) and
> я is `m1-5-4` (5.0, beat 4); ла is `m2-9-8` (4.5, beat 4) and я is
> `m2-5-4` (5.0, beat 4). Corroborating: the source file has тес as a PLAIN
> quarter at 3.0q (`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls
> (engraved).musicxml`, md5 `265f7cb5fa359942b54826795cf10c4f`,
> byte-identical to `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`),
> while the page draws it 1.5 quarters wide.
> **NOT ESTABLISHED, named so it is not lost:** two other consumers compare
> the same field against tempo and marking positions, `sustain.ts:67-79` and
> `watchlist.ts:232-240`, so a corrected duration may also mis-assign a
> sustain marking or a watch-list entry.
> Brief WRITTEN, NOT RUN, UNTRACKED:
> `docs/sessions/brief-n128-stale-beat_r1_2026-09-12.md`.
>
> **The superseded 06:15 block moved to `../sessions/LOG.md` block 10.**

> **N.114b, items 1 to 5 DONE on Dann's alias walk 2026-09-10 (`ec4fbe9`,
> `7665afa`, `8278429`); items 6 to 9 BRIEFED, NOT RUN**, all in
> `docs/sessions/brief-n114b-pills-over-the-drawer_r1_2026-09-10.md`: 6 air
> above the open syllable box; 7 Export and import order (all, this, import);
> 8 the calibration surface's collapse row goes; 9 Start over as a ghost
> pill. Done and seen: the pills tangent to the card with "Redo" on
> METADATA's line (`--band-inset`, `app.css`); air under every band; Start
> placement over as a ghost pill in the open syllable line's row. **Undo for
> Start placement over is NOT wired: no existing clause fits; the sentence
> is Dann's to rule (English and French), then one line in Code.**
>

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

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
