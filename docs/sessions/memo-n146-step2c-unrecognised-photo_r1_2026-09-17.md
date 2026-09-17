# Memo: N.146 step 2c, why the walk photo reads as "not recognised as a score"

Reply to `brief-n146-step2c-unrecognised-photo_r1_2026-09-17.md`, read in full.
Investigated in Claude Code, 2026-09-17.

**Could not reproduce. Nothing was built.** Per the brief's own instruction --
"If you cannot reproduce it, stop and say so, with what you tried. Do not
build" -- this memo is the stopping point.

---

## What was tried, and the expectation before each

**Method, stated up front**: a real OS-level Finder drag was not available to
this session's tools (no Finder automation), so every drop below is a
`DragEvent` dispatched on the textarea with a `DataTransfer` carrying a real
`File`, per the brief's own fallback ("otherwise through a `DragEvent` on the
textarea with the real file's bytes"). Two file payloads were used, both
built from the walk photo's own bytes, never retyped or invented:

- A 4096-byte head of the real file (`head -c 4096`), for a fast first check
  of the byte-sniff alone.
- A small but COMPLETE, genuinely decodable JPEG (`sips -Z 200`, 4552 bytes),
  derived from the same real photo, so the full pipeline (busy label,
  rasterizer, OCR, guard) has real image data to run against rather than a
  truncated stream that fails at decode. `detectScoreFormat`'s own `isImage`
  reads only the leading ~16 bytes (`format-detection.ts:106-117`), which are
  identical between this file and the original, so this substitution does
  not touch the thing under test; it only avoids embedding and transferring
  the full 207 KB payload into a browser tab repeatedly. Both payloads'
  leading 12 bytes were logged before every drop: `ff d8 ff e0 00 10 4a 46
  49 46 00 01` -- exactly `ff d8 ff e0 … JFIF`, matching the desk's own
  `xxd` reading and `isImage`'s JPEG signature (`format-detection.ts:106`).

### 1. Branch alias, fresh browser profile

**Expected**: since `detectScoreFormat` and `isImage` read only leading
bytes, and every sniff site in the tree agrees (see "The cause," below), a
real JPEG should route to the picture path and end at "No text recognised in
image." or a decode-specific error -- never `upload.err.unrecognised`.

**Result**: on `https://ilya-git-shane-dannmittons-projects.vercel.app`, a
genuinely fresh browser profile (this session's own isolated Browser pane,
never signed into Dann's account or profile), dropping the 4096-byte
truncated head produced **"This browser cannot open that picture. A JPEG or
a PNG will work."** -- a real, self-consistent decode failure (the stream is
deliberately incomplete), and proof detection itself succeeded: the app
reached the picture/rasterize path, not `classify()`. Dropping the complete
small JPEG produced **"No text recognised in image."**, `file.name`,
`file.type`, and `file.size` logged as `walk-n146-poem-photo.jpg`,
`image/jpeg`, `4552` throughout. Neither drop ever showed "This file was not
recognised as a score."

### 2. The same in dev

**Expected**: identical to the alias, since neither `detectScoreFormat` nor
`take()` branches on build mode.

**Result, first attempt**: **"OCR processing failed."** -- a different
message again, traced via `read_console_messages` to `[ScoreUploader] the
picture could not be recognised: TypeError: Failed to fetch dynamically
imported module: .../tesseract__js.js?v=c7ce92b9`, alongside a run of failed
dev-server WebSocket reconnects. This is a stale Vite dependency-cache
artifact of this session's own long-running dev server (restarted many
times across steps 2, 2b, and 2c), not a reachable app code path: clearing
`apps/web/node_modules/.vite` and restarting reproduced **"No text
recognised in image."** on the identical file, matching the alias exactly.
Named here because it is a real message this investigation produced, not
because it bears on the brief's own bug.

### 3. The field's file picker instead of a drop

**Expected**: identical outcome, since `IntakePanel.svelte`'s `onPick` and
`onDrop` both do nothing but forward the raw `File` (confirmed by reading
the file: no `detectScoreFormat`, no `file.type` check, no extension check
anywhere in it).

**Result**: assigning the same `File` to the hidden `<input type="file"
accept=".mnx,...,image/*">` via a real `DataTransfer`-backed `FileList` (the
one script-legal way to set `.files`) and firing `change` produced the same
**"No text recognised in image."**

### The "New song" race, the desk's own top candidate

**Expected**: per the static trace below, `handleNewSong` `await`s through
`createSong` / `refreshSongs` / `switchSong` before `doc = next` ever runs,
so `uploaderEl` should still point at a live, working instance for the
whole window, and the `{#key doc.id}` remount (when it does land) is a
single synchronous Svelte update with no perceptible gap a real drop could
land inside.

**Result**: pressing "New song" and dropping the same complete JPEG
IMMEDIATELY afterward, in the same script, still ended at "No text
recognised in image." -- with one genuine, separate observation: the FIRST
attempt at this specific sequence found no `textarea.text-input` in the DOM
at all (`querySelector` returned `null`). This was not `uploaderEl`
staleness: it was the Input accordion panel itself collapsing back to its
default (closed) state as part of whatever "New song" resets, which un-mounts
the textarea along with the rest of that panel's body. Re-expanding Input
and dropping again worked normally. This is a UI-state detail, not a
data-loss or stale-reference bug, and it does not produce any error message
at all (a collapsed panel is simply nothing to drop onto) -- so it cannot be
the mechanism behind a VISIBLE `unrecognised` message either.

---

## The cause: not found in the tree

Every sniff site this app has agrees on a real JPEG, and every route to
`classify()` (the only place `upload.err.unrecognised` is produced) is
closed off before a picture ever reaches it:

- `detectScoreFormat` (`apps/web/src/lib/shane/ingestion/format-detection.ts:106,186`):
  `isImage(bytes)` matches `ff d8 ff` unconditionally and returns `{ok:
  true, format: 'image'}` -- extension and MIME type are never consulted on
  this branch.
- `ScoreUploader.svelte`'s `readableKind` (`:491-498`, this session's own
  reading, consistent with steps 2/2b) calls exactly that function on
  exactly those bytes.
- `take()` (`:266-292`): `kind = await readableKind(file)`; when
  `kind !== null` (an image or a PDF), `ui = {kind: 'busy', ...}` is set
  (`:274`) BEFORE `rasterizeFirstPage` runs. When `kind === null`,
  `take()` instead calls `handleFile(file)`, which independently re-checks
  `isPicture(file)` (the SAME `detectScoreFormat` call) and, if true, ALSO
  sets `ui = {kind: 'busy', ...}` (`:526-531`) before ever considering
  `ingestScoreFile`/`classify()`.
- `classify()`'s only two `unrecognised` sites (`:838`, `:881`) are reached
  exclusively through `handleFile`'s `ingestScoreFile` call (`:587`), which
  itself only runs when `isPicture(file)` was **false** -- for a genuine
  image, that branch is never entered.
- `IntakePanel.svelte`'s own drop and pick handlers (`:249-254`, `:237-242`)
  do no classification of their own; they hand the raw `File` to `onfile`
  unmodified, so there is no divergent MIME/extension routing upstream of
  `take()` either.

No code path, as written, lets a `ff d8 ff`-prefixed file reach
`unrecognised`. Per the brief: the cause could not be named with a
`path:line`, and the candidates it listed (`{#key doc.id}` remount,
dev/production divergence, a different drop surface, a Finder-specific
`File`) were each tried and, so far as this session's tools could reach,
ruled out or found not to matter to the actual byte-sniff and routing logic.

**No code was changed. No test was added. No gate was run** -- there is
nothing in the tree this investigation altered, confirmed by `git status
--porcelain` showing no diff at the end of this session (all three staged
walk-fixture copies and a scratch artifact used for testing were removed
again; see below).

---

## NOT ESTABLISHED

- **A genuine OS-level Finder drag was never tested.** This session has no
  Finder automation, so every drop here is a scripted `DragEvent`. Chromium
  has its own history of drag-and-drop timing quirks specific to a REAL
  native drag session (a `dataTransfer` populated by the OS compositor
  rather than by script) that a synthetic event cannot reproduce. This
  remains untested and is the most likely place a real difference could
  still hide.
- **A stale service worker on Dann's own already-visited browser.** The
  walk's own account says he "clos[ed] every Ilya tab" first, which closes
  tabs, not necessarily an active service-worker registration or its cached
  bundle (`apps/web/static/sw.js` exists and this app is installable). A
  previously-cached OLDER bundle serving a genuinely different `take()`
  from before some relevant fix would explain a real production-only
  failure that a brand-new profile (this session's own test, with no prior
  cache to be stale) could never reproduce. This session could not inspect
  Dann's own browser's Application/Storage state, and was explicitly told
  not to clear it.
- **The exact 207 KB original file, byte-for-byte, was not re-dropped on the
  alias.** A small but complete real derivative was used instead (see
  "Method," above) to bound payload size; the substitution is argued, not
  independently proven, not to matter to detection specifically.
- **Whether a busy label appeared and simply went unnoticed on Dann's own
  screen** ("immediately, twice") is not something this investigation can
  settle either way; nothing in the tree suggests a code path that skips
  `ui = {kind: 'busy', ...}` for a real image, but a very fast successful
  read followed immediately by ANOTHER kind of failure was not modelled.

## Decisions this brief did not settle, marked as mine and reversible

- **Substituting a small complete JPEG for the original 207 KB file** on the
  alias tests (reasoned above). Reversible: re-run the same three checks
  with the exact original file if the desk wants that specific byte
  sequence tried; nothing about the method would need to change, only the
  payload.

## Cleanup

Two scratch artifacts this investigation created were both removed before
finishing: a temporary Claude-Artifact asset holder (published, used once to
test cross-origin asset fetch, then deleted -- abandoned in favour of the
`sips`-derived small JPEG once auth turned out to block it) and this
session's Vite dependency cache (`apps/web/node_modules/.vite`, not
tracked by git, regenerated automatically). `git status --porcelain` is
empty. No file to `git add`.
