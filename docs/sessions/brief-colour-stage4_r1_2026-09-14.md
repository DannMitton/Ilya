# Brief to Code: the colour story, stage 4, the values

**HOLD. Do not issue this while N.134 is unshipped.** `ENVIRONMENT.md` records
the rule from 2026-08-20: never hand Code a second brief while the first is
unshipped, because two builds then share one working tree.

**Serves:** the colour story, stage 4, which `STATE.md` carried as THE ONE THING
until N.134 displaced it on 2026-09-14.
**Authority:** Dann's four rulings of 2026-09-13, recorded in full with their
reasoning in `docs/sessions/spec-colour_r1_2026-09-13.md`. **Read that file in
full before you start.** Stage 4 needs no further ruling.
**Shape:** ONE commit. Stages 3a and 3b are done, committed, and walked.

---

## 1. What the tree holds now, read 2026-09-14

| declaration | line in `apps/web/src/app.css` | value now |
|---|---|---|
| `--sage` | 34 | `#8B9A7D` |
| `--rose` | 39 | `#A67B7B` |
| `--cobalt` | 43 | `#5C739E` |
| `--lavender` | 165 | `#8E7E9B` |
| `--sage-desk` | 129 | `#D1D7CB` |
| `--lavender-desk` | 130 | `#D2CBD7` |
| `--rose-desk` | 131 | `#DBCACA` |
| `--cobalt-desk` | 132 | `#BEC7D8` |
| `--sage-chip` | 154 | `#6C7A5F` |
| `--rose-chip` | 155 | `#9A6A6A` |
| `--cobalt-chip` | 156 | `var(--cobalt)` |
| `--lavender-chip` | 157 | `#806E8E` |

**No `--umber` of any kind exists.** Zero occurrences in `apps/web/src` and
`packages`, checked 2026-09-14. **No ink tokens exist** for any family.

**`--lavender` sits at line 165, apart from the other three at 34 to 43**, and
carries the comment `/* captured outline */`. Say in your memo whether it should
join them, and do not move it without saying so.

## 2. The twenty ruled values

Band L 0.640, chip L 0.530, ink L 0.420, each family holding its own hue and
chroma. Every chip clears 5.21 on white and every ink 7.02 on cream.

| family | band | chip | ink |
|---|---|---|---|
| sage | `#839275` | `#637156` | `#455238` |
| rose | `#AB7F7F` | `#885F60` | `#674141` |
| lavender | `#9585A2` | `#746580` | `#554660` |
| cobalt | `#748CB9` | `#556C96` | `#374D75` |
| umber | `#A38669` | `#82664A` | `#61472C` |

## 3. The desk is NOT on the ramp, and its five values are computed here

The desk stays 40% of the family hue over 60% white. **The formula was verified
against the tree before these were computed**: it reproduces all four existing
desk values exactly from their current band values.

| token | stage 4 value |
|---|---|
| `--sage-desk` | `#CDD3C8` |
| `--rose-desk` | `#DDCCCC` |
| `--lavender-desk` | `#D5CEDA` |
| `--cobalt-desk` | `#C7D1E3` |
| `--umber-desk` | `#DACFC3` |

**Recompute these yourself and refuse the commit if any disagrees.** A desk value
carried over from the old band hue is the defect this section exists to prevent.

## 4. The change

1. **Move the four band values** at `app.css:34`, `:39`, `:43`, `:165`.
2. **Move the four chip values** at `:154`, `:155`, `:157`, and give
   `--cobalt-chip` (`:156`) its own value `#556C96` instead of `var(--cobalt)`.
3. **Move the four desk values** at `:129` to `:132` to §3's numbers.
4. **Declare the umber family**: band, chip, desk, ink. Run the collision check
   first, as stage 3b did, and report that it returned zero.
5. **Declare the five ink tokens** and wire each document's label ink to its own
   family, per ruling 4 of 4 in the spec.
6. **Move Learn from rose to umber. Exactly two anchors**, both read 2026-09-14:
   - `HeaderBar.svelte:215`, `.tab-learn .lang-pill { background: var(--rose-chip, #9A6A6A); }`
   - `+page.svelte:5466`, `.app-content.tab-learn { --desk-fill: var(--rose-desk, #DBCACA); }`

   **Insights keeps rose** and its two sites do not move:
   `HeaderBar.svelte:228` and `+page.svelte:5476`. A comment at `+page.svelte:5473`
   says Insights reads rose's desk token "as Learn does"; that sentence stops
   being true in this commit, so correct it.

## 5. The fallbacks are a trap, and this is the commit where they bite

Most family uses are written `var(--rose-chip, #9A6A6A)`, with the old hex
inline. **Every one of those fallbacks must move to the new value.** A stale
fallback paints correctly only while the token resolves, so it hides a broken
token name rather than guarding against one.

Code's own caveat at the close of stage 3b, carried in `STATE.md`: every rose
and lavender use it saw also carried its hex, **so those two families would
paint correctly even with a broken token name.** Cobalt is the only family
proven by paint alone, because the drawer's Piece band has no fallback.

## 6. The walk, which is Dann's and which this commit must earn

**1400 px, all five destinations.** Three things have never been seen by anyone
and must be checked, all three named by Code at the close of stage 3b:

1. **The `--stone-700` merge**: the loupe's frame, the `ё` badge in the word
   inspector, and the hovered provenance icons over a word. All three moved
   `#44403C` to `#4A4540`, one just-noticeable difference.
2. **The note picker**, which now reads `--ink-stave`. Reaching it means pressing
   Start, which creates a voice profile.
3. **The update toast's border**, now `--stone-300` instead of lavender. It
   appears only when a new version is waiting.

## 7. Return

One memo to `docs/sessions/memo-colour-stage4_r1_<date>.md`: the anchors you
asserted, your own recomputation of §3, the collision check for umber, the gate
numbers, and a section listing what you could not establish.

All five gates at baseline before and after.

**NOT ESTABLISHED beats a complete invented answer.**

House style: Canadian spelling, no em dashes, one idea per sentence, ISO dates,
no aphorisms, no pre-announcing.
