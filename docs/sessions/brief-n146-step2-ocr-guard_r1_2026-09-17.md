# Brief: N.146 step 2, Ilya refuses a reading that is not Russian

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-17. Written at the desk. Build in Claude Code.

**Item:** N.146, still open. Read first, in full:
`docs/sessions/brief-n146-poem-or-score-detected_r1_2026-09-16.md` and your own
`docs/sessions/memo-n146-poem-or-score-detected_r1_2026-09-16.md`. N.146 shipped
as `fe4d2c7`.

---

## What Dann saw on the walk, 2026-09-17

A photo of a six-line printed poem, dropped on the input field, filled it with
garble: **82 lines, 302 words**, beginning `ОАК ИИ ае ОЕ` / `РР о РОО ЕетЬ ых`.
A new song named `ОАК ИИ ае ОЕ` appeared in Repertoire. Dann: *"lol garble!
what is this?"*

The routing was right. The fault is that any non-empty OCR text becomes the
poem (`ingestion/poem-or-score.ts:47-48`), and since N.146 every picture with no
staves reaches OCR with no press, so any such picture becomes a song.

**Ruled by Dann 2026-09-17** (he asked for the recommendation and said yes):
Ilya judges its own OCR reading, and refuses one that is mostly not Russian
words. Cleaning the picture before OCR is LATER, not this brief.

---

## STEP 0. Measure before you build. State your expectation first

Two walk files, both in `~/Downloads`, both made by the desk from the six lines
at `apps/web/src/lib/reading-aid.test.ts:89-96`:

1. `walk-n146-poem-scan.pdf`: an image-only PDF, a clean scan. On the walk,
   OCR read it well, with one wrong letter (line 6: `То` read as `Го`).
2. `walk-n146-poem-photo.jpg`: the same lines, tilted 2.5 degrees, uneven
   lighting, grain, and blur. On the walk, this produced the garble.

Run the same OCR the app runs (`tesseract.js`, `createWorker('rus')`, as at
`ScoreUploader.svelte:392-396`) on both, in Node if it runs there. For each
reading, report the share of word tokens Ilya **cannot find in its
dictionary**, and how you counted it.

**Establish the signal from the tree; do not take the desk's word for it.** The
desk read only this much: a word with no stress data gets
`stressSource = 'inferred'` and a VERIFY badge (`pipeline.ts:656-661`), and
`'inferred'` is also set at `pipeline.ts:644` on another path the desk did not
read. Find the cleanest honest test for "this token is a Russian word Ilya
knows", and say what you chose and why. **Watch the short tokens:** the garble
is full of one- and two-letter tokens (`о`, `с`, `ы`, `аа`), and some of those
are real Russian words, so decide how they count and say so.

Then choose a cutoff that passes the scan and refuses the photo, with a margin
you state. If no cutoff separates them cleanly, stop and say so before
building.

---

## STEP 1. The guard

Where `decidePoemOrScore` returns `poem` from `ocr`, the reading must pass the
guard first. If it fails, the result is `unreadable`, and Ilya shows the
existing message, "No text recognised in image." / « Aucun texte reconnu dans
l'image. » (`ScoreUploader.svelte`, the `unreadable` branch). **Coin nothing.**

- **A failed reading changes nothing:** the input field keeps what it had, and
  no song is created or renamed.
- **The text-layer path is not guarded.** A PDF's own text is what its author
  typed.
- **Keep the decision pure.** The guard's inputs are parameters of the pure
  function (or of a sibling pure function it calls), and every branch is tested:
  a clean Russian reading passes, the garble fails, an empty reading is
  `unreadable` as before, and a reading exactly at the cutoff behaves as you
  state.
- **Use the walk's garble as a test fixture.** Take the text from your step 0
  run of the photo, not from the desk.

---

## What NOT to do

- Do not preprocess the picture (deskew, threshold, contrast). That is LATER.
- Do not change the staff check, the score path, or the `asking` state.
- Do not add a mark, a label, or a notice to the page (CONTRACT §6).
- Do not add new strings.

---

## Definition of done

1. `walk-n146-poem-scan.pdf` still fills the input field.
2. `walk-n146-poem-photo.jpg` shows "No text recognised in image.", and neither
   the input field nor Repertoire changes.
3. The step 0 table and the cutoff, with its margin, are in the memo.
4. All five gates green. Baselines: web-check 0 errors, 8 warnings, 5 files;
   web-test **1227** (moved by N.146); score-parser 567 passed, 5 skipped, 572;
   phonology 216; dictionary 235. Report the new web-test count; the desk moves
   the ship script's baseline.
5. Walked by Dann. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n146-step2-ocr-guard_r1_<date>.md`: the step 0
measurements, the signal you chose and why, the cutoff and its margin; what
changed by file and line; your expectation before each check and the result;
the gate results with any baseline movement; **a section listing what you
could not establish** (NOT ESTABLISHED beats a complete invented answer); and
any decision this brief did not settle, marked as yours and reversible.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** If you
create a new file, name it in the memo so Dann can `git add` it before he ships.
