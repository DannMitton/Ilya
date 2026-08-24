# Code brief: ship 2 of 2. The correction minimum, Speedy Entry shaped (N.92 first slice)

You are Claude Code, working in `~/Desktop/ilya-rewrite`, branch `Shane`. This
brief is self-contained. Read `docs/memory/ENVIRONMENT.md` before running any
gate or touching any path. Do not run `git commit` or `git push`; Dann ships
with `sh ~/Downloads/ilya-ship.sh`. List every NEW file for Dann to `git add`
before shipping. NOT ESTABLISHED beats a complete invented answer.

Context: ship 1 (`docs/sessions/brief-n95-n96-ship1_r1_2026-08-24.md`) opened
the PDF door and repaired the reader. Scans still read imperfectly and always
will; this ship gives the singer the tool to correct the read by hand. Ruled
by Dann 2026-08-24: the template is Finale's Speedy Entry behaviour, not its
chrome, skinned to Calm Authority, seated in the Drawer.

## What it does

Scope, ruled: ALTER and DELETE existing notes of the score document's vocal
line. No note insertion in this ship; insertion is N.92 proper, later.

1. Selection. The singer clicks or taps a note on the rendered score
   document; it becomes the selected note, shown with a visible selection
   state. Reuse the existing note-click machinery
   (`apps/web/src/lib/shane/NotePicker.svelte`, `note-picker.ts`) rather
   than building a second click path; read it before deciding how to hook
   in. Selection state is display, not a control: nothing else lands on the
   paper.
2. Keyboard, active while a note is selected:
   - ArrowUp / ArrowDown: one diatonic staff step.
   - Shift+ArrowUp / Shift+ArrowDown: one octave.
   - `+` / `-`: one semitone (spelling follows the app's existing spelling
     logic; do not hand-roll a new speller).
   - `3` `4` `5` `6` `7`: sixteenth, eighth, quarter, half, whole. `.`
     toggles the dot. (Finale's own digit mapping, kept because Dann knows
     it in his fingers.)
   - ArrowLeft / ArrowRight: previous or next note in the line.
   - Delete or Backspace: remove the selected note (false positives are a
     measured 13 of 55 on the scan; deletion is load-bearing, not a
     luxury).
   - Escape: deselect.
3. Touch parity. While a note is selected, the Drawer's NOTATION anchor
   shows the same operations as buttons at the 44 px floor. No third
   touch-geometry exemption exists or gets created; the ruled exemption
   covers the cursor only.
4. Seat: the NOTATION anchor (pinned top, sage, retractable), per the
   ratified anchor architecture (S0 slate, 2026-08-19: anchors are the
   frame, stations fill the scroll). No new station, no takeover, no
   change to the station set. If the NOTATION anchor's current contents
   leave no honest room, STOP and report; do not invent a new drawer
   region.

## Persistence

- A hand correction is a placement made by hand and joins that protected
  class: a later re-read of the same source must not destroy it.
- Route persistence through the existing save path only
  (`apps/web/src/lib/library/`). NO new save site, silent or otherwise.
- If the scan read is not currently a persisted document and no compatible
  seam exists, build the in-session correction fully, report the storage
  seam as BLOCKED ON RULING, and say exactly what ruling is needed. Do not
  invent storage architecture.

## Strings

Every new user-facing string ships in English and French. You do not coin
French: put the complete strings table (English beside proposed French) in
your report and WAIT for Dann's approval of the French before he ships.
English-only text reaching French mode is a known standing defect class
(N.82); do not add to it.

## Hard constraints

- Do not change `VocalLineEvent`. Do not touch
  `apps/web/src/lib/shane/reconciliation/` or `underlay-donor.ts`.
- No controls on the paper. Drawer manipulates, page displays and prints.
- No marks that appear on everything; the selection state appears only on
  the selected note.
- Corrections must not alter the syllable-assignment machinery; a corrected
  pitch keeps its attached syllable.
- Reader files (`tools/e16-harness/reader/`, `apps/web/static/reader/`) are
  out of scope for this ship.
- The score capability sits behind the `INCLUDE_SHANE` wall; the correction
  surface rides inside it and must leave a wall-closed build untouched.
- Do not commit, push, or move gate baselines. If you add tests, tell Dann
  the new web-test number BEFORE he ships (baseline 725, a literal string at
  `ilya-ship.sh:79`; all five baselines are in `docs/memory/ENVIRONMENT.md`).

## Definition of done

1. Browser, on the deploy Dann walks: open a score document with a read in
   it; click a note; ArrowUp moves it a step and the render updates; `5`
   makes it a quarter; Delete removes a false positive; the attached
   syllable survives a pitch change.
2. On an iPhone-sized viewport: the same operations succeed through the
   NOTATION anchor's buttons at the 44 px floor.
3. Corrections survive a reload, or the storage seam is reported as BLOCKED
   ON RULING with the exact question.
4. Five gates at baseline (or the new number told to Dann first).
5. Report: what was built, the strings table awaiting French approval, new
   files needing `git add`, and a NOT ESTABLISHED section.
