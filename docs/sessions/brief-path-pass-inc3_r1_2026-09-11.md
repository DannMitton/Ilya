# Brief for Code: the path pass, increment 3

Desk, 2026-09-11 00:10, after Dann's walk of increment 2 (`8032489`) on the
branch alias at 390 px and 1400 px. Three rulings from that walk, all Dann's,
2026-09-10 late. Serves THE DRAWER AS A PATH, step 3. Returns
`docs/sessions/memo-path-pass-inc3_r1_2026-09-11.md`.

## 0. Ground rules

- No git. Dann ships with `ilya-ship.sh`. Ask him to `git add` any new file.
- The five gates hold at baseline: phonology 216, dictionary 235, web-check 0
  errors and 7 warnings in 4 files, web-test 1104, score-parser 547 passed and
  5 skipped. Report any movement with its cause.
- Edit by anchor: assert each anchor matches once before you write. Your own
  memo `docs/sessions/memo-path-pass-inc2_r1_2026-09-10.md` is the map;
  re-verify its lines against the tree before editing.
- Do not touch `VocalLineEvent`, `apps/web/src/lib/shane/reconciliation/`, or
  `underlay-donor.ts`.
- No new strings. If an item needs one, stop that item and list it under
  French owed.
- Do not build the phone landing, N.119, N.120, or N.122.
- Every claim carries a `path:line` you opened, or NOT ESTABLISHED. NOT
  ESTABLISHED beats a complete invented answer.

## 1. The goal, from the singer's seat

Under the poem box and its receipts the singer sees two plain rows,
`Notation` and `Analysis`, both closed; no `Text` row stands between them
and the singer. When a Notation toggle has moved, `n of 7 changed` sits
beside `Notation`. The top bar holds the Ilya sigil and the language toggle
and nothing else; Undo and Redo live at the right end of the SCORE MARKUP
band header, beside its chevron, and appear only when there is something to
undo or redo.

## 2. The changes, in order

### 2.1 Delete the Text fold (RULED 2026-09-10 late)

Dann: "as a child of Input it adds no value except to bottleneck access to
Notation and Analysis." Remove the fold you added in increment 2: its
station id and tier in `sections.svelte.ts`, its render site and
`StationHeader` in `IntakePanel.svelte`, the `textSection` wrapper in
`+page.svelte`, and whatever `textStateLine` still does in `bandState.ts`.
`Notation` and `Analysis` render directly where the fold's body rendered,
as the two stations they already are, both closed by default. The phone's
one-station-at-a-time rule applies to them as today; say what tier they
sit in after the change. Delete `group.text` from `i18n.ts` in both
languages if nothing else reads it, and say so; if something does, leave it
and name the reader.

### 2.2 The changed phrase beside Notation (RULED 2026-09-10 late)

Dann: "if we're going to offer this courtesy message it should be on the
Notation header, not the Text header." `text.state.changed` (`%s of %s
changed`, count from `notationDepartures()`) renders at the right end of the
`Notation` station header, in the state-line style, only when the count is
above zero, whether the station is open or closed. Nothing renders beside
`Analysis`. Rename the key if its name now lies (`notation.state.changed`),
both languages, same text.

### 2.3 Undo and Redo move to the SCORE MARKUP band header (RULED 2026-09-10 late)

Dann: "I hate where they are placed." The pair leaves the top bar; the bar
keeps the sigil and the language toggle. They render at the right end of
the SCORE MARKUP band header, before the chevron, as CLICKABLE TEXT in the
header's own label style (same size, tracking, and colour as the band
label; the glyph and the word, `↶ Undo`, `↷ Redo`), NOT as pills, so the
band header keeps its height (Dann, 00:12: "that will avoid conflicts about
inconsistent header height"). Same handlers as today. Their hit area is the
full header height. They render only when the undo stack or the redo stack
is non-empty. The band header's tap target for
open and close must not swallow them: verify a tap on Undo does not toggle
the band, and a tap on the band's empty length still does.

BEFORE moving anything, establish and put in the memo: what the undo stack
covers. If any undoable action originates outside Score markup (a poem
edit, a Notation toggle, a Piece field), say which, and STOP this item with
the list; Dann rules where the pair goes for those. If everything on the
stack is a placement or a correction, proceed. The loupe's own Undo and Redo
(`loupe.redo`, `loupe.undo.*`) are unchanged.

Also in the memo, one paragraph: how the pair behaves at 390 px, where the
drawer is a sheet and the action happened on the paper. The loupe covers
the moment of action; say whether that is true for every undoable action.

### 2.4 Establish, do not build: filled pills at rest

Seen 2026-09-11 00:02 at 1400 px with INPUT and SCORE MARKUP open,
Analysis open on a taken word: `Dictionary` (green, inside Analysis) and
`Calibrate` (lavender, in SCORE MARKUP) both filled; `Transcribe and fit`
unfilled. The path rule is one primary on the front side at rest. In the
memo: list every `btn-primary` (or equivalent) site on the drawer's front
side with the condition that fills it, and say which pairs can be filled at
once. Change nothing; the desk drafts the rule from your list.

## 3. Tests

Adjust `sections.test.ts` and `bandState.test.ts` for the fold's removal;
keep the test that the changed phrase is absent at default and present
after one toggle, now against the Notation header. Add one test that Undo
and Redo do not render with empty stacks. Report the web-test count and
the baseline it moves to.

## 4. The walk you run before you hand over, on a local production build

1. Fresh profile, 1400 px: INPUT open with the placeholder, the caption,
   and two closed rows `Notation` and `Analysis` under the box, no `Text`;
   top bar shows only the sigil and `Français`; SCORE MARKUP closed with no
   Undo or Redo visible, and its header the same height as PIECE's.
2. Flip one Notation toggle: `1 of 7 changed` beside `Notation`, open and
   closed. Flip back: nothing.
3. Paste a poem, drop `~/Downloads/Kabalevsky - Shakespeare - T05 Cupid laid
   by his brand, and fell.musx`, Continue, place one syllable on the Score
   markup page: Undo appears in the SCORE MARKUP header; press it; the
   placement reverts; Redo appears; a tap on Undo did not toggle the band.
4. 390 px: the same three, and the bands persist across reload.

Record what you saw for each, with screenshots named in the memo.

## 5. Strings

None new. `group.text` deleted if unread (2.1). A rename in 2.2 keeps the
text. French owed: nothing new.

## 6. The memo

`docs/sessions/memo-path-pass-inc3_r1_2026-09-11.md`: what shipped, per
item, with lines; the undo-stack inventory (2.3); the 390 px paragraph; the
filled-pill inventory (2.4); the walk record; gate numbers; then NOT
ESTABLISHED. Under 150 lines.
