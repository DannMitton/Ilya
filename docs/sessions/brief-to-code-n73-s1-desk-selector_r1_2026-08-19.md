# Brief to Code: N.73 S1, the desk selector and the drawer's pull

**REVISION 2, 2026-08-19, same day as revision 1.** Dann ruled the drawer's
motion after revision 1 was written: the drawer opens horizontally on every
display, and its pull is a bare chevron that flips to show the direction it will
open. Revision 1 left the phone's bottom handle in place as interim chrome.
Revision 2 folds the pull into S1 so the redesign builds one coherent model
rather than building the chrome twice. **The file name still says `r1`; this
document is revision 2, and there is only one file.**

**Item: N.73 S1. Serves N.42.** Written by the Cowork desk, which does not build.
You build. The step ends in a deploy and a walk by Dann.

**Read this whole brief before you touch a file.**

---

## 1. Instrument, and what was read to write this

Branch `Shane`, floor `cb2ecc0`, working tree clean, reported by Dann 2026-08-19
at 15:15 local.

Read in full for this brief: `docs/memory/CONTRACT.md`; the E.44 Studio ruling
(project knowledge, `claude/e44-fable-ruling-studio-architecture_2026-08-13.md`);
the N.42 assignment revision 3 (project knowledge,
`claude/e41-n42-assigned-desk-selector_2026-08-11.md`); the S0 closure
(project knowledge, `claude/fable-ruling-s0-slate-closed_2026-08-19.md`);
`docs/sessions/fable-gui-rulings-2_2026-08-18.md`;
`docs/sessions/fable-gui-session-record_2026-08-18.md`;
`docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md`;
`docs/sessions/fable-n73-french-strings_r1_2026-08-19.md`;
`docs/sessions/fable-gui-mockup_r2_2026-08-18.html` exhibit 1.

Read in part: `docs/memory/STATE.md`, `docs/memory/ENVIRONMENT.md` §Gate
baselines and §The ship script.

Read in the tree at `cb2ecc0`: `app.css:25-80`, `TabBar.svelte:1-60`,
`HeaderBar.svelte`, `Drawer/Drawer.svelte:1-30` and `:440-560` and `:640-670` and
`:925-1035`, `routes/+page.svelte` at the cited lines, `InstallPrompt.svelte:96-105`,
`lib/i18n.ts:30-33`.

Not read: `PRODUCT.md`, the control census, mockup r1, the E.36 session record
(its rulings reach this brief through the two project documents that quote it).

**Line numbers in this brief were read at `cb2ecc0` and rot on contact.** Open
each file and re-derive before you edit. Where a line and a name disagree, the
name wins.

---

## 2. What you build

### 2.1 Delete the tab bar from both mounts

`Drawer/TabBar.svelte` has two mounts: `Drawer/Drawer.svelte:437`, inside the
drawer on desktop, and `routes/+page.svelte:2162`, inside `<div
class="mobile-tabbar">`, a fixed footer on the phone. Delete both mounts, delete
the `.mobile-tabbar` CSS block, and delete `TabBar.svelte` once nothing imports
it. `HeaderBar.svelte:3` imports the `TabId` type from that file: move the type
to a module that survives, and say where you put it.

Reproduce the arrow-key roving focus (`TabBar.svelte:40-62`) in the new control.
A segmented pair is one tab stop with arrow keys inside it.

### 2.2 Build the desk head

One line across the top of the desk, above the sheet, on desktop and on portrait,
drawn in `docs/sessions/fable-gui-mockup_r2_2026-08-18.html` exhibit 1 as
`.p-deskhead`:

- The boxed pair, flush left with the sheet's left edge. This is placement B,
  ruled by Dann (N.42 §1.3).
- Learn and Guide, flush right, as set-apart text links keeping the underline
  they already carry (N.42 §1.1).

The pair switches the same two ids it switches today, `transcription` and
`shane`. **No storage migration in S1.** The stored-tab migration is S2.

Resting appearance is state 1c, the recessed pair, ruled by Dann (N.42 §1.4):
no thumb, both words at equal weight, the track still drawn. The active
destination takes treatment C, a card: fill `--paper-cream` `#F0EBE0`, a 1 px
`#1a1612` border, small radius. Track and divider at the card's weight, full
ink (E.36 §1.12, quoted in the E.44 ruling §A.2). No blotter under the sheet.
No edge on the sheet.

The wall: when `INCLUDE_SHANE` is false, render no pair at all and show one
document. A pair whose second member compiles out is not a pair (E.44
§CONTRADICTIONS 6). `lib/wall.ts:6-7` is the flag; its consumer sites are
`TabBar.svelte:38-40` (dying), `+page.svelte:758`, and `+page.svelte:888` at the
line numbers E.44 recorded, which have moved. Re-derive them.

### 2.3 Land the ratified strings

From `docs/sessions/fable-n73-french-strings_r1_2026-08-19.md`, ratified whole by
Dann 2026-08-19. Ship the words as written. Key names are yours.

| context | en | fr |
|---|---|---|
| the pair, document 1 | Transcription | Transcription |
| the pair, document 2 | Marked score | Partition annotée |

`i18n.ts:30` already carries `tab.transcription` with exactly these two words;
reuse or re-key as you prefer. `i18n.ts:33` carries `tab.fit`, which is the tool
name Fit and is invariant in French by Dann's ruling of 2026-07-13. **The pair's
second document is not called Fit.** Add a key for `Marked score` and
« Partition annotée » rather than editing `tab.fit`, and report what still reads
`tab.fit`.

Learn and Guide reuse `tab.learn` and `tab.guide` (`i18n.ts:31-32`).

**The table's mobile pull row changes, by Dann's ruling of 2026-08-19.** The pull
carries no visible label (§2.7), so "Drawer" and « Tiroir » become its
accessible name rather than its face. Keep the words, keep the key, and put them
in `aria-label`.

Apostrophes are typographic (’) per the ruling recorded in `i18n.ts`. No string
in this table carries a colon, a question mark, or an exclamation mark, so the
hard-space census does not move. Case in the strings is sentence case; any
uppercase rendering lives in CSS.

### 2.4 Set the desks to the ruled tints

Each desk carries its signature hue tinted 60 percent toward white, ruled by
Dann in his own words, "C, Desk lightness 60%, no blotter" (N.42 §1.5):

| token in `app.css:57-59` | value now | value ruled |
|---|---|---|
| `--surround-transcription` | `#6B6560` | `#D1D7CB`, sage at 60 percent |
| `--surround-learn` | `#A8A39B` | `#DBCACA`, dusty rose at 60 percent |
| `--surround-guide` | `#E5E1D6` | `#BEC7D8`, quiet cobalt at 60 percent |

Studio's desk is the sage-tinted desk (S0 ruling 3), and `shane` keeps sharing
the transcription surround, which `+page.svelte:2538-2544` already does with the
July ruling in its comment. The lavender desk `#D2CBD7` dies and is not
introduced. Leave `--surround-shane: #D8D0E0` alone: it is the pacifier band, a
different object, and `contrast.test.ts:428` asserts its literal.

Inks are luminance-keyed (S0 ruling 4): a light desk takes dark ink `#1a1612`, a
dark desk takes light ink. All three desks become light under this change, so the
desk head's links and the resting pair take dark ink.

**Compute the contrast at the hexes you ship, not at any hex in a document.**
N.42 §6 requires it. The ruled configuration was measured at card border 10.6 to
12.2:1 against desk, card label 15.1:1, desk labels 10.6 to 12.2:1. Report your
own numbers. The sheet sits at roughly 1.3:1 against its desk: that is Dann's
taste ruling, made twice, and it is **not** to be recorded as a compliance
exception or repaired.

### 2.5 Re-key the app bar to three destinations

Ruled by Dann 2026-08-18 (`fable-gui-rulings-2` item 6): the app bar keeps and
re-keys, colour keyed to the three destinations, Studio sage, Learn rose, Guide
cobalt. `HeaderBar.svelte:29-32` keys four classes and `:93` gives `shane`
`--deeper-lavender`. Make `shane` take sage with `transcription`. The drawer
lip's per-destination hover rules (`Drawer.svelte:645-667`) key on the same four
values: fold `shane` into transcription there too. Lavender's carriers under
Studio are the voice anchor and the calibration surfaces, neither of which is in
S1.

### 2.6 The drawer opens horizontally on every display

**Ruled by Dann, 2026-08-19.** The desktop's illusion is horizontal motion. The
phone's vertical motion was a form-factor concession, and it is withdrawn. One
motion model, every display.

The concession is one property deep. `Drawer.svelte:952-970` already makes the
phone drawer a full-screen overlay, `position: fixed; top: 0; left: 0; width:
100%`, and slides it with `transform: translateY(100%)` when collapsed. The
drawer sits to the left of the paper on desktop (`Drawer.svelte:485`, the double
`border-right`), so the phone's drawer arrives from the left as well.

- Collapse with a horizontal transform rather than a vertical one.
- Keep the transition duration and easing that are there
  (`Drawer.svelte:962`), and keep the `prefers-reduced-motion` rule.
- `width: 0 !important` on the collapsed mobile drawer (`Drawer.svelte:968`)
  exists to stop a translated full-width overlay from taking touches. Whatever
  replaces it, the collapsed drawer must not intercept a touch on the desk.
- Say in your memo what the collapsed drawer does to horizontal page scroll, and
  do not leave a horizontal scrollbar behind.

### 2.7 One pull, a bare flipping chevron, on every display

**Ruled by Dann, 2026-08-19.** The pull carries no visible word. Its chevron
points the way the drawer will move when pressed, and flips with the drawer's
state. His reasoning, kept in his words: "fewer text elements onscreen is good to
allow the user to focus on their own texts, not controls."

This supersedes the mobile half of the ruling of 2026-08-18, which gave the
phone a labelled `⌃ DRAWER` bar. The desktop half stands and now describes both
displays: option A of `docs/sessions/ilya-lip-options_r1_2026-08-18.html`, a flat
tab flush with the drawer's edge, `--drawer-bg` `#FAF8F5` fill, hairline border,
rounded on its outward corners only, roughly 76 px tall, chevron flipping with
drawer state.

- **Delete both phone handles.** `.paper-handle` in `+page.svelte` (the
  upward semicircle at the bottom, opens) and `.drawer-handle-top` in
  `Drawer.svelte:1005-1020` (the downward semicircle at the top, closes). One
  control replaces two.
- **The existing desktop lip becomes the tab.** `.drawer-lip`,
  `Drawer.svelte:443` and `:546-566`, is already a `<button>`. Restyle it; do
  not add a second interactive element.
- **Geometry answers to modality**, `@media (pointer: coarse)`, which is the
  ruled pattern. The tab meets the 44 by 44 px floor on coarse pointers. **Do
  not create a third touch-geometry exemption.**
- **The accessible name is the ratified string**, "Drawer" and « Tiroir »,
  carried in `aria-label` with `aria-expanded`. A bare chevron with no
  accessible name is a `svelte-check` failure and a screen-reader dead end.
- **The tab must not sit on the paper.** Drawer manipulates, page displays and
  prints. On the desk beside the sheet is correct; over the sheet is not.

### 2.8 Repair every rule written in terms of the 56 px bar

**The N.42 assignment named three sites. The tree at `cb2ecc0` holds six.** Grep
`56px` across `apps/web/src` and account for every hit in your memo.

| path:line at `cb2ecc0` | what it is | what it becomes |
|---|---|---|
| `Drawer/Drawer.svelte:958` | `.drawer { height: calc(100dvh - 56px) !important }` | `100dvh`. This is N.41's own repair |
| `Drawer/Drawer.svelte:21` | the header comment restating that rule and citing its line | rewrite the value and the line, or name the rule instead of numbering it |
| `+page.svelte:2845` | `.main-content { padding-bottom: calc(56px + 36px + 0.5rem) }` | both terms go: the bar is deleted and the 36 px handle is deleted with it. Rewrite the comment at `:2831-2844`, which explains the 92 px in terms of furniture that no longer exists |
| `+page.svelte:2860` | `.paper-handle { bottom: 56px }` | deleted with the handle |
| `+page.svelte:2905-2920` | the `.mobile-tabbar` block, `height: 56px`, `z-index: 50` | deleted |
| `+page.svelte:2978-2990` | `.update-toast { bottom: calc(56px + 0.75rem) }` with an N.53 comment explaining the clearance | `0.75rem`, comment rewritten |
| `InstallPrompt.svelte:100` | `.install-prompt { bottom: 56px }` | `bottom: 0`, or state why not |

---

## 3. What you do not build in S1

- No drawer surgery beyond the motion and the pull. The second `MetadataFields`,
  the second print control, the `ScoreUploader` move, and the stored-tab
  migration are S2.
- No anchors, no stations, no Underlay station, no calibration takeover.
- No portrait C, no reading aid, no chapter bands.
- No swipe gesture. The pull is pressed, not dragged. A swipe is a new gesture
  and it is not ruled.
- No new hue beyond the three desk tokens of §2.4.
- Do not put a control on the paper. Drawer manipulates, page displays and prints.
- Do not touch `VocalLineEvent` or anything in
  `apps/web/src/lib/shane/reconciliation/`.
- Do not rename a vowel, and do not write French that is not in the ratified
  table.
- Do not run `git`. Do not commit. Dann ships.

---

## 4. Defaults taken, each open to one word from Dann

Stated aloud under CONTRACT tether 13 rather than asked, because each has a
defensible answer already in the record.

1. **The desk hue moves in S1 to the ruled 60 percent tints.** The r2 mockup
   draws a dark desk `#6E6A60`, close to the tree's `#6B6560`, but its own
   session record says the mockup's hue stand-ins "must be re-verified against
   `app.css` before any build," and no ruling of 2026-08-18 covers desk hue. The
   only ruling on desk hue is Dann's of 2026-08-10. It governs.
2. **The pair reuses the id pair `transcription` and `shane`,** and nothing about
   storage changes. E.44 S2 owns the migration.
3. **The drawer arrives from the left**, matching the desktop's own arrangement.
   Dann ruled the motion, not the side.
4. **The ratified pull string survives as the accessible name.** Dann ruled the
   word off the screen, not out of the product, and a nameless button fails a
   gate.

---

## 5. What this brief could not establish

**NOT ESTABLISHED beats a complete invented answer.**

1. **Whether iOS's left-edge back-swipe region swallows a press on a
   left-flush tab.** iOS reserves an edge strip for its own navigation gesture.
   A press is not a swipe, so the risk is low and it is real. Inset the tab from
   the viewport edge if you must, say what you did, and put it in Dann's walk.
   Do not report it as fixed on the strength of a desktop browser.
2. **Whether closing the drawer discards drawer state on the phone today.** It is
   Design's standing condition and E.44 §NOT ESTABLISHED item 8. No document
   records a test. It is in the definition of done as a walk, not as a build.
3. **The desk head's behaviour in landscape at 844 by 390.** Neither the mockup
   nor any ruling draws it. Build the one line, report what it does when the
   width is short, and do not invent a collapse rule.
4. **What else reads `tab.fit`.** Reported by you, not guessed by this brief.
5. **Whether the sheet's own left edge is a stable anchor for "flush left"** at
   every width. Placement B is ruled; the implementation is yours, and say what
   you anchored to.
6. **Whether gate 4 moves.** `vitest` never compiles a `.svelte` file, so a new
   component's markup adds no tests. If you add a testable module and gate 4
   moves, ask Dann for the baseline `sed` before he ships, and follow it with
   `chmod +x ~/Downloads/ilya-ship.sh`.

---

## 6. Definition of done

**A browser observation by Dann on a real deploy. A passing build is not done,
and `WRITTEN` is not `DONE`.**

Your own local walk closes your part. Dann's walk closes the item.

1. On the phone, no bar at the bottom, and the page has the 56 px back.
2. The pair and the two links sit on one line above the sheet, on desktop at
   1427 by 840 and in portrait at 390 by 844, in both languages.
3. With the drawer closed on desktop, all four destinations are reachable. This
   is audit finding F4, and the walk is the cure's proof.
4. The pair rests as 1c while reading: no thumb, both words equal, track drawn.
5. Switching the pair still switches the document, and the app bar is sage on
   both Studio documents, rose on Learn, cobalt on Guide.
6. **The drawer opens sideways on the phone and on the desktop, from one tab in
   the same relative place, and the chevron points the way it will move both
   times.** One press opens, one press closes, and the tab is reachable with a
   thumb in portrait.
7. Closing the drawer on the phone discards no drawer state.
8. The three desks render at the ruled tints and the desk head's ink is legible
   on each, at the numbers you computed.
9. A wall-closed build shows one document and no pair.

Run all five gates yourself and tell Dann the numbers before he runs the ship
script. Baselines at `cb2ecc0`: phonology 216, dictionary 235, web-check 0 errors
and 7 warnings across 4 files, web-test 671, score-parser 444 passed and 5
skipped.

Ship with `sh ~/Downloads/ilya-ship.sh "N.73 S1: the desk selector and the
drawer's pull"`. It refuses on untracked files anywhere in the repository, so
account for every file you write, memo included, and ask Dann to `git add` any
new one first.

---

## 7. The memo you return

Write it to `docs/sessions/n73-s1-the-desk-selector_r1_2026-08-19.md`, in the
same commit as the work, in house style: Canadian spelling, no em dashes, second
person, present tense, ISO dates.

1. **What shipped**, by name, with the commit.
2. **Every `56px` hit and its disposition.** All six known sites, plus anything
   the grep found that this brief did not name.
3. **The drawer's motion**, what you changed, and what the collapsed drawer does
   to touches and to horizontal scroll.
4. **The contrast numbers you computed**, at the hexes you shipped.
5. **Where the tree beat the brief.** Every line number in §2 that had moved, and
   every claim you found to be wrong. This section is the point of the memo.
6. **What you refused to invent**, with `NOT ESTABLISHED` against each.
7. **The gate numbers**, all five, and whether any baseline needs Dann's
   permission to move.
8. **What Dann must walk**, as a numbered list matching §6, in the order he
   should walk it, naming the deploy.
