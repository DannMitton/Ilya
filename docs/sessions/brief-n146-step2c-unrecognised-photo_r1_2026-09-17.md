# Brief: N.146 step 2c, why the walk photo reads as "not recognised as a score"

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-17. Written at the desk. Investigate in Claude Code. **Find
the cause first; build only if the cause is in the tree.**

## What Dann saw, walking `6e98057` on the branch alias

`https://ilya-git-shane-dannmittons-projects.vercel.app`, Chrome on his Mac,
after closing every Ilya tab. He selected **New song**, then dragged
`~/Downloads/walk-n146-poem-photo.jpg` from Finder onto the drawer's input
field (the textarea). **Immediately on release**, twice, the drawer showed:

> This file was not recognised as a score.  [Try another file]

That is `upload.err.unrecognised` (`i18n.ts:957`), reached only through
`classify()` (`ScoreUploader.svelte:838`, `:881`). Your step 2b live check, in
the dev app with the same file, showed "No text recognised in image." instead.

## What the desk read, and could not explain

- The file begins `ff d8 ff e0 … JFIF` (read with `xxd` on Dann's Mac), so
  `detectScoreFormat` should return `image` (`format-detection.ts`, `isImage`).
- `IntakePanel.svelte:249-254` hands `dataTransfer.files[0]` to `onfile`, which
  `+page.svelte:4365` sends to `uploaderEl?.take(file)`.
- In `take()`, an `image` never reaches `classify()` without first showing the
  busy label and rasterizing, and "immediately" suggests it did neither. So the
  desk's reading is that `readableKind` returned `null`, and it cannot say why.
  **That is a desk inference; test it, do not trust it.**

Candidates the desk has not ruled out: the `{#key doc.id}` re-mount after **New
song** (`+page.svelte`, around `:4396`) and what `uploaderEl` points at; a
difference between the production build and dev; the drop landing on a
different surface than your dev check used; Chrome delivering a different
`File` for a Finder drag than a script-built one.

## Step 0. Reproduce, with your expectation stated first

1. On the **branch alias** (not dev), in a fresh browser profile: New song, then
   drop the photo onto the textarea as a real drag if your tools can, otherwise
   through a `DragEvent` on the textarea with the real file's bytes. Record the
   message and whether a busy label appeared.
2. The same in dev.
3. The same through the field's file picker instead of a drop.

Instrument before you judge: log `file.name`, `file.type`, `file.size`, the first
12 bytes `readableKind` sees, and its result. **Take the logging out
afterwards, and say so.**

## Then

- **If the cause is in the tree,** fix it, add a test that fails without the
  fix, and repeat the three checks. Walk 5 should then show "No text
  recognised in image." on the alias.
- **If you cannot reproduce it,** stop and say so, with what you tried. Do not
  build.

No new strings. No change to the guard or the staff check unless the cause is
there.

## Definition of done

1. The cause is named with a `path:line`, or "could not reproduce" with the
   evidence.
2. If built: all five gates green (web-test baseline **1253**), and the
   three checks repeated.
3. Walked by Dann. **WRITTEN is not DONE.**

## What to return

A memo at `docs/sessions/memo-n146-step2c-unrecognised-photo_r1_<date>.md`:
your expectation before each check and the result; the cause, or why it could
not be found; what changed by file and line, if anything; the gate table if
built; **a section listing what you could not establish** (NOT ESTABLISHED
beats a complete invented answer); and any decision this brief did not settle,
marked as yours and reversible. List any new file to `git add`.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.**
**Do not clear website data in Dann's own browser.**
