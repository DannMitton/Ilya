# Brief: N.147, the syllables move into the loupe, and a note tap only selects

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-17. Written at the desk. Build in Claude Code, on branch
`Shane`. Spec: `docs/memory/OPEN.md`, section `N.147`. Read that section in
full first; this brief does not repeat Dann's reasons.

## What is wrong today

A tap on a note inside the loupe both selects it and places the armed syllable
(`handleLoupePick`, `apps/web/src/routes/+page.svelte:710-713`: `setCursor`,
then `placeArmedSyllable`). A singer moving around the loupe reassigns
syllables by accident. Dann ruled it unacceptable on 2026-09-16.

## What Dann ruled, 2026-09-17 (defaults, each with its reason in `OPEN.md`)

1. **The syllable line leaves the drawer entirely** and lives in the loupe. The
   drawer's Input section keeps the source text only. The line N.114 put under
   the poem field (`+page.svelte`, the `syllableLine` snippet around `:4421-4447`,
   rendered by `IntakePanel.svelte`) is removed from the drawer, collapsed row
   and all.
2. **In the loupe, the syllables are an accordion row under the notes.** Dann
   picked the **Hairline** drawing: a 1 px rule at `rgba(74,69,64,.25)` under the
   notes, then a full-width disclosure row carrying the label **Syllables** in the
   loupe's own tag style (`.loupe-tag` in `Loupe.svelte`: sans, 0.6875rem, 600,
   0.06em tracking, `--ink-tertiary`, uppercase by CSS) with a chevron at the
   right, then the syllables on the loupe's own paper as plain text.
3. **No syllable is focused or armed by default.** Opening the row focuses
   nothing, and Return or Space can place nothing until the singer moves focus
   onto a syllable.
4. **The syllables scroll when height is short.**

## The behaviour to build

- **A note tap in the loupe only selects.** `handleLoupePick` keeps `setCursor`
  and loses the placement.
- **A syllable tap places that syllable on the selected note,** through the
  existing placement path (the `eventIds` guard at `+page.svelte:661`, the
  `loupe.undo.placed` undo push, the pairing write), then **the selection moves
  to the next note that can take a syllable.** Use whatever "next entry" step
  the tree already has; if none exists, stop and say so in the memo rather than
  inventing one. If no note is selected, a syllable tap does nothing.
- **Colours stay as N.114 ruling 4 has them** (`SyllableStation.svelte`):
  unplaced `#6A655F`, placed `#1a1612`. **The syllable on the selected note** is
  outlined: white fill, 1.4 px lavender (`--lavender`) inset outline, 4 px
  radius. There is no other highlight, and no cursor is drawn.
- **Phone (`isPhone`):** one row, 44 px tall, scrolling sideways, serif at
  17 px, no visible scroll bar, a soft fade at both ends. The row sets
  `touch-action: pan-x` so it scrolls inside the loupe, whose surface is
  `touch-action: none` (`Loupe.svelte:1513`) because a downward drag dismisses
  it (`+page.svelte:1864-1901`). **The desk's belief that a child with its own
  `pan-x` scrolls under a `none` ancestor is an inference. Test it on a real
  touch emulation first and report.** A sideways drag on the row must not
  dismiss the loupe, and a downward drag that starts on the row still should.
  Poem line breaks show as a wider gap with a short vertical hairline. After
  each placement the row glides so the syllable after the one placed sits about
  64 px from the left edge; with `prefers-reduced-motion`, it jumps.
- **Computer:** the syllables wrap at the poem's own line breaks, serif at
  16 px, line height 26 px, and the row scrolls downward past about four lines
  (`max-height` 104 px). No swipe exists on a desk (`+page.svelte:1882-1883`).
- **The row's open state** lives for the session only, with no `localStorage`
  write, the precedent at `IntakePanel.svelte:166`. It starts closed. (DESK
  DEFAULT; it replaces the desk's earlier "remembers" line.)
- **The loupe must stay inside the viewport** when the row opens, on both
  surfaces. It is hung off its own centre (`transform: translateY(-50%)`) and
  docks on a phone (`dockInset`, `dockHeight`); report what you did.

## Strings

One new key for the row's label. English `Syllables`, French `Syllabes`
(**ruled by Dann 2026-09-17**; sentence case in the string, capitals by CSS).
Write no other French. An aria label for the disclosure uses the same key.

## Step 0. Survey, before any edit, and put the answers in the memo

1. **Every reader of `pairingCursor` and `slotQueue`** in the tree, by
   `path:line`, and what each needs once the loupe no longer places "the
   syllable at the cursor". Shift Lyrics and the placed count on its header
   (`placedSlotCount`) are known readers; confirm or correct.
2. The "next entry" step the selection should use, by `path:line`.
3. Whether any test asserts that a loupe tap places. Those tests change
   meaning; name them before you change them.

## Constraints

- Do not change `VocalLineEvent`, and rebuild nothing in
  `apps/web/src/lib/shane/reconciliation/`.
- No second silent save site (N.27 is open).
- `SyllableStation.svelte` may be reused or replaced; say which and why.
- Touch floor: on a phone every syllable is a 44 px tall target by its row
  height. Do not add a touch-geometry exemption.

## Definition of done

1. A note tap in the loupe writes no pairing, proven by a test that fails on the
   current tree.
2. A syllable tap writes the pairing to the selected note and advances the
   selection, proven by a test. **The pairing carries the syllable's own IPA**
   (`syllableIpa`, `apps/web/src/lib/shane/pairings.ts:229`, written today at
   `+page.svelte:675-676`), and the note shows that IPA on the underlay's near line,
   above its Cyrillic (`packages/score-parser/src/staff-renderer.ts:95`, :235),
   on the page and in the loupe. Ruled by Dann 2026-09-17: the row itself stays
   Cyrillic only; the loupe's notation keeps its IPA; a placement brings the
   syllable's correct, in-context IPA to the note.
3. Nothing is focused when the row opens, proven by a test.
4. The drawer shows no syllable line anywhere.
5. All five gates green. The web-test baseline moves from **1253** by exactly the
   tests you add or change; give the new number so the desk can update
   `ilya-ship.sh:79`.
6. Walked by Dann on the branch alias, on his computer and on his phone.
   **WRITTEN is not DONE.**

## What to return

A memo at `docs/sessions/memo-n147-syllables-in-the-loupe_r1_<date>.md`: step
0's answers; your expectation before each check and the result; what changed,
by file and line; the gate table; **a section listing what you could not
establish** (NOT ESTABLISHED beats a complete invented answer); and any decision
this brief did not settle, marked as yours and reversible. List every new file
to `git add`.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.**
