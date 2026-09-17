# Brief: N.145, a dropped score arrives at once

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code.

**Item:** N.145. Spec: `docs/memory/OPEN.md`, section `N.145`. **Read it first and
in full.** Then read `apps/web/src/lib/shane/ScoreUploader.svelte` in full.

---

## The goal, in the singer's words

Dann, 2026-09-16: *"when we drop text in the input field, it is instantaneously
processed into a transcription. Should dropping a file also be instantaneous?"*
He ruled option 2: **instant for every file, with a photo's read report shown
after the score arrives.**

A singer drops a score, and the page draws it, with no **Continue to analysis**
press. If the score came from a photo or a PDF, its read report and caveats are
still in the drawer to read afterwards.

---

## The change

1. **When a parse succeeds (`ScoreUploader.svelte:409-411`), hand the score to
   the page at once**, with the same call `accept()` makes (`:556-560`),
   including its `pageFor` and `inkFile` handling. Origin stays `'upload'`.
2. **Keep what the pause showed, after arrival.** The format line, the
   conversion banner with its **Dismiss**, and the read report stay in the
   uploader's place until the singer dismisses them or drops another file.
   **DESK DEFAULT:** a new state (for example `arrived`) that carries what those
   three need and no longer carries a score waiting to be accepted. Add a
   **Dismiss** to the read report if it has none, reusing
   `upload.banner.dismiss`; coin no string.
3. **Remove Try another file and Continue to analysis** from that state. The
   receipt's **Clear** and **Replace** already do the first job.
4. **Leave `asking` and `askKind` alone.** They ask a picture's clef and key
   before a read; that is input, not a pause.
5. **`hasWaitingScore` and `acceptWaiting` (`:546-554`):** no score waits any
   more, so they will always answer false. **Leave them in place and leave the
   Transcribe and fit pill alone**; its fate is Dann's. Say in the memo what the
   pill now does and whether it is ever enabled.
6. **The replace dialog** for a second score on a song that already has one
   must still appear. Show in the memo that the new path reaches it.

---

## What NOT to do

- Do not change `oningested`, `applyArrival`, or the restore path
  (`:590-600`).
- Do not add a mark to the page (CONTRACT §6). The read report lives in the
  drawer (N.59, Ruling D, the comment at `:817`).
- Do not delete any string from `i18n.ts`; report which keys become unused.

---

## Definition of done

1. Dropping T05 (`.musx`) fills the input field and draws the score with no
   further press.
2. Dropping a photo or a PDF asks its clef and key questions as today, then
   draws the score, and the read report stays readable in the drawer until
   dismissed.
3. Dropping a second score on a song that has one still asks before replacing.
4. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate
   baselines` (web-test 1201, score-parser 567 passed, 5 skipped, 572).
5. Walked by Dann. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n145-instant-score-arrival_r1_<date>.md`: what
changed by file and line; your expectation before each check and the result;
the Transcribe and fit finding; the replace-dialog finding; the i18n keys that
became unused; the gate results with any baseline movement; **a section listing
what you could not establish** (NOT ESTABLISHED beats a complete invented
answer); and any decision this brief did not settle, marked as yours and
reversible.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** To
measure a before state, copy the file aside and copy it back. If you create a
new file, name it in the memo so Dann can `git add` it before he ships.
