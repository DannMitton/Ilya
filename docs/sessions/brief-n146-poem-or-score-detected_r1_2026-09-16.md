# Brief: N.146, Ilya tells a poem from a score itself

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code.

**Item:** N.146. Spec: `docs/memory/OPEN.md`, section `N.146`. **Read it first and
in full**, including the struck step 3. Then read
`apps/web/src/lib/shane/ScoreUploader.svelte` in full (as it stands after
N.145, `7c596f7`).

---

## The goal, in the singer's words

Dann, 2026-09-16: *"I want to remove this cognitive burden from the user and lay
it on Ilya instead."* And: *"Why doesn't Ilya just process whatever it can
without advertising that it is changing tactics mid-process?"*

A singer drops a PDF or a picture. If it is a page of music, the score draws. If
it is a page of words, the poem fills the input field. Nothing asks, and nothing
announces which way Ilya went.

---

## STEP 0. Measure before you build. State your expectation first

Ilya needs one fast answer: **does this page show staves?** Two candidates:

1. **The photo reader's own staff detection**, in Python in
   `apps/web/src/lib/shane/engine/page-reader.worker.ts`. Accurate, and it
   loads a heavy runtime.
2. **A light check in TypeScript** on the page as rendered for reading (the
   existing `page-pdf.ts` and `page-image.ts` paths): rows of dark pixels that
   run most of the page width, in groups of five with even spacing.

Measure, on at least these pages: a PDF exported from Finale (T05's own PDF if
one exists in `~/Downloads`, otherwise any engraved score PDF there), a scanned
score, a photo of a score, a text PDF, and a photo of a printed poem. Report,
for each candidate: the answer it gives on each page and the time it takes.
**Choose the light check if it answers every page correctly; otherwise the
reader's. Say which and why.** If you cannot find enough test pages, say which
are missing and stop before building.

---

## STEP 1. The order Ilya tries, with no question and no label

In `take()`, a PDF or a picture no longer goes to `askKind`:

1. **Staves found:** read it as a score, exactly as the score answer does today.
   If that read yields no sung line, fall through to 2.
2. **No staves, or no sung line:** read it as a poem. A PDF: take its text layer
   (`extractPdfText`). If the text layer is empty, read the page as a picture
   (the existing Russian OCR path, `readPictureAsPoem`). A picture: that OCR path
   directly.
3. **If both fail**, show the existing unreadable-file error for that kind. Coin
   nothing.

It all arrives at once, as N.145 made every drop do.

**Remove** the `askKind` state and its markup. Leave the strings in `i18n.ts`
and report which keys became unused. Do not add any switch, label, or notice.

---

## What NOT to do

- Do not change how a MusicXML, `.mxl`, `.musx`, `.mnx`, or `.mscz` file is
  sorted.
- Do not remove the `asking` state (a picture score's clef and key questions).
- Do not add a mark to the page (CONTRACT §6).

---

## Tests

Put the decision (staves, sung line, text layer, OCR) in a pure function in
`apps/web/src/lib/shane/` with the measurement inputs as parameters, and test
every branch, including "both fail".

---

## Definition of done

1. A score PDF and a score photo draw with no question.
2. A text PDF fills the input field; a scanned poem and a poem photo do too.
3. The step 0 table is in the memo.
4. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate
   baselines` (web-check 0 errors, 8 warnings, 5 files; web-test 1206;
   score-parser 567 passed, 5 skipped, 572).
5. Walked by Dann. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n146-poem-or-score-detected_r1_<date>.md`: the step
0 measurements and the choice; what changed by file and line; your expectation
before each check and the result; the unused i18n keys; the gate results with any
baseline movement; **a section listing what you could not establish** (NOT
ESTABLISHED beats a complete invented answer); and any decision this brief did
not settle, marked as yours and reversible.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** To
measure a before state, copy the file aside and copy it back. If you create a new
file, name it in the memo so Dann can `git add` it before he ships.
