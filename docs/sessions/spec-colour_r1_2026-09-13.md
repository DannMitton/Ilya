# Spec: the colour story, stage 2. The four rulings, in full

**Moved out of `docs/memory/STATE.md` on 2026-09-13, on Dann's word, VERBATIM.
Nothing below was reworded, reordered, or removed**, including the blockquote
prefixes it carried in that file. It left `STATE.md` because it is
specification rather than handover: all four questions are answered, and a
session opening tomorrow should not read it to learn what is next.

**This is what stage 4 builds from.** `STATE.md` keeps the twenty values and a
pointer here.

Ruling 1 the ramp, ruling 2 the neutrals, ruling 3 the strays, ruling 4 the
fourth value. All four ratified by Dann, 2026-09-13. The drawings each was
ruled from are named inside them and are committed in `docs/sessions/`.

---

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
