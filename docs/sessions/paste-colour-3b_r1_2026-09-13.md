You are Claude Code, working in ~/Desktop/ilya-rewrite on branch Shane.

Read docs/memory/CONTRACT.md in full before you touch anything.
Then read docs/sessions/spec-colour_r1_2026-09-13.md, which carries Dann's four
rulings of 2026-09-13 in full. This message is the brief; the spec is the why.

Stage 3a is DONE and committed (6c53a9d). Do not redo it.

## The task: colour story stage 3b. Naming and deleting. NO VALUE CHANGES.

If any hex value moves, you have done something this brief did not ask for.
Stop and say so.

## Counts, measured by the desk 2026-09-13 over apps/web/src and
## packages/score-parser/src only. Confirm every one. Do not trust them.

Each token is counted in BOTH forms, because 3a was derailed by exactly this:
`--name` in stylesheets, and the bare `name` as a string key.

  token                     --form   bare
  --sage                        92      0
  --rose                        20      0
  --lavender                    44      2    <- contrast.ts:128, :283
  --cobalt                      13      0
  --surround-transcription       2      0
  --surround-learn               3      0
  --surround-guide               2      0
  --surround-marked              5      0
  --surround-insights            2      0
  --surround-shane               5     10    <- contrast.ts, nine obligations
  --lang-chip-transcription      3      0
  --lang-chip-guide              3      0
  --lang-chip-learn              3      0
  --lang-chip-marked             6      0
  --deeper-sage                  9      0
  --stone-700                    3      0
  --light-sage                   1      0
  --light-lavender               1      1
  --muted-lavender               2      1
  #3A352F                       42 (literal)

`contrast.ts:125-138` is a typed PALETTE whose keys are BARE token names, and
`type Token = keyof typeof PALETTE`. **That type is your safety net: rename a key
and the compiler finds every reader.** Use it. It is also why deleting a token
means deleting its PALETTE entry and any obligation that names it.

## Part 1. Family and role, for the three derived roles only

  --surround-transcription   ->  --sage-desk
  --surround-learn           ->  --rose-desk
  --surround-guide           ->  --cobalt-desk
  --surround-marked          ->  --lavender-desk
  --lang-chip-transcription  ->  --sage-chip
  --lang-chip-learn          ->  --rose-chip
  --lang-chip-guide          ->  --cobalt-chip
  --lang-chip-marked         ->  --lavender-chip

**THE BANDS DO NOT MOVE. DESK DEFAULT, and it departs from the plan.**
`plan-colour-story_r1_2026-09-13.md` says 3b renames "across desk, band, chip and
ink", which would make `--sage` into `--sage-band`. The desk decided against it
and Dann can reverse it with a word. The reason: that is 169 further call sites,
77 of which stage 3a rewrote this morning, bought for symmetry alone. The rule
"the bare family name IS the band" is one sentence in PRODUCT.md at stage 6, and
a stranger can learn it as easily as a suffix. Stage 4 still gets its four
declarations per family: `--sage`, `--sage-desk`, `--sage-chip`, `--sage-ink`.

**--sage, --rose, --lavender and --cobalt are therefore untouched in 3b.**

**THE INKS ARE NOT DECLARED HERE.** `--sage-ink` and its four siblings arrive at
stage 4 with their values, per ruling 4. Do not create empty tokens now.

## Part 2. Two tokens the desk is deliberately NOT renaming

- **`--surround-insights`.** Its value is `#DBCACA`, identical to
  `--surround-learn`. Ruling 4 deletes it at stage 4 with Insights taking rose's
  own tokens. **DESK DEFAULT: do it now instead, because this is the renaming
  stage and it is a pure duplicate.** Point its 2 sites at `--rose-desk` and
  delete the token. If that reads as a value change to you, stop and say so
  rather than proceeding.
- **`--surround-shane`.** The calibration wheel's broad band. **Leave it exactly
  as it is, both its 5 `--` sites and its 10 bare sites in contrast.ts.** Its
  role has no name in this grammar yet, and Dann's pacifier ruling of 2026-09-13
  recasts the whole pacifier to rose at a later stage. Renaming it now would name
  it for a family it is about to leave.

## Part 3. Ruling 2's naming and merging

**`#3A352F` gets a token, AND THERE IS A TRAP HERE. Read this whole section.**

The census established that `#3A352F` is the stave's furniture (lines, clefs,
key signatures, barlines, rests, ledger lines, multi-bar numerals) while
`--ink-primary` is what is sung (noteheads, stems, beams, accidentals, ties,
lyrics), and that the split holds across all 29 renderer sites.

**But the renderer cannot read a CSS token.** `staff-renderer.ts:615-616` records
that it is pure and DOM-free, which is why it bakes `#8E7E9B` as a hex with a
"keep in sync with the app token" comment. **So follow that existing, ruled
pattern rather than inventing a new one:**

- Declare `--ink-stave: #3A352F` in `app.css` beside the other inks. DESK DEFAULT
  on the name; it groups with `--ink-primary`, `--ink-secondary`, `--ink-tertiary`
  and says what it paints.
- **Point only the CSS consumers at it.** Any `#3A352F` inside
  `packages/score-parser` stays a literal and gains the same "keep in sync"
  comment the lavender literal carries.
- **Report the split: how many of the 42 became the token and how many stayed
  literals, and why each group did.**

**`--stone-700` merges into `--ink-secondary`.** Three sites: `Loupe.svelte:931`
(the loupe's frame, the hardest of the three), `WordStack.svelte:321-324` (the
hovered provenance icons), `InspectorPanel.svelte:1867` (the ё sigla). Delete the
token. `--ink-secondary` keeps its own value, so no gate should move for this.

## Part 4. Ruling 3's split and deletions

- **`--deeper-sage` SPLITS INTO TWO, both holding `#7A8A6C`, so nothing changes
  on any screen.** DESK DEFAULT on both names.
  - `--sage-gloss` takes the one page use: `WordStack.svelte:275`, the gloss line
    under every word.
  - `--sage-hover` takes the pointer states: `InspectorPanel.svelte:1522`,
    `:2185`, `IntakePanel.svelte:1060`, `HeaderBar.svelte:149`,
    `InstallPrompt.svelte:205`.
  - Confirm the count: the desk found 9 sites in 7 files. If a site is neither a
    page use nor a pointer state, STOP and name it rather than guessing.
- **`--light-sage` is DELETED.** One site, its own declaration. Nothing reads it.
- **`--light-lavender` is DELETED, and it has a companion edit.** Its
  declaration, its PALETTE entry at `contrast.ts:127`, and the R20 assertion at
  `contrast.test.ts:233` that holds the two equal. **All three in this commit or
  the gate fails.**
- **`--muted-lavender` is DELETED.** Its declaration, its PALETTE entry, and its
  one paint: the update toast's border at `+page.svelte:5795`. **DESK DEFAULT:
  the border takes `--stone-300`**, which is what 26 of that token's 29 uses
  already are. If any PALETTE obligation names `muted-lavender`, stop and report
  it rather than deleting the obligation.

## How to edit

Edit by anchor, per CONTRACT §5. Assert every anchor before you write it. Refuse
on anything but exactly one match unless you can say in advance why two. No blind
find-and-replace.

A `var()` fallback carries the old name: the name changes, the fallback hex does
not.

Comments name these tokens in prose. Update the names so each comment still tells
the truth, and change nothing else in it. Nothing in `docs/` is rewritten.

## The control rule

**Do NOT inherit the desk's prediction. 3a proved that wrong.** State your own
expectation before you run the gates, and name your likeliest failure mode.

The desk's view, offered as a claim to test rather than a fact: gate 3
(web-check) and gate 4 (web-test) are the ones at risk, because `contrast.ts` is
typed and `contrast.test.ts` asserts declarations. Deleting two PALETTE entries
is the most likely mover.

Run all five gates yourself. `~/Downloads/ilya-ship.sh` is the instrument for the
baselines; `ENVIRONMENT.md`'s table follows it and may lag. If a gate moves,
report it against your prediction and STOP before editing the ship script.

## Definition of done

1. Over `apps/web/src` and `packages/score-parser/src`, BOTH forms return
   nothing: `--surround-transcription`, `--surround-learn`, `--surround-guide`,
   `--surround-marked`, `--surround-insights`, every `--lang-chip-*`,
   `--deeper-sage`, `--stone-700`, `--light-sage`, `--light-lavender`,
   `--muted-lavender`. Grep the bare names too.
2. `--surround-shane` is UNCHANGED, both forms, and you say so with its counts.
3. `--sage`, `--rose`, `--lavender`, `--cobalt` are UNCHANGED, and you say so
   with their counts.
4. No hex value moved anywhere. Prove it with a word-level diff.
5. All five gates reported against your own stated prediction.
6. At 1400 px, open all five documents and confirm every desk, band, chip and
   ink is the colour it was. State the expectation before you look.
   **WRITTEN is not DONE: this step is what makes it done.**

## What you must not do

NO GIT COMMANDS THAT WRITE. No add, commit, push, checkout, reset, restore,
stash, rm, mv, merge, rebase, tag. No agent commits, ever, and no agent stages.
Read-only git is allowed: status, log, diff, show, ls-files, check-ignore.

Do not ship. Do not deploy. Ask Dann to commit when you are done.

## The return memo

`docs/sessions/memo-colour-token-roles_r1_<today's date>.md`: the confirmed counts
against the desk's, every file touched, the `#3A352F` token-versus-literal split
with its reasoning, the grep results from the definition of done, the five gate
numbers against your prediction, and a section headed WHAT I COULD NOT ESTABLISH.

NOT ESTABLISHED beats a complete invented answer.
