# Code brief — N.97 follow-on: carry the reader's id through the parser boundary

**r1, 2026-08-24. Serves N.97. Ruled by Dann 2026-08-24: option 1 of
`docs/sessions/memo-n97-clef-key_r1_2026-08-24.md`, its own ship, after N.97
ships as built.**

Paste this into Claude Code pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.

---

## Goal

The reader's `r{mi}-{x}` ids survive the MusicXML boundary, so a correction on
a page-read song is keyed to ink, not to a duration cursor, and future changes
to the event population stop orphaning corrections.

1. `apps/web/src/lib/shane/ingestion/recognized-to-musicxml.ts` writes each
   event's reader id as the `id` attribute on its `<note>`. MusicXML permits
   this attribute.
2. `packages/score-parser/src/musicxml-parser.ts` prefers a supplied `id` and
   falls back to its own `m{mi}-{num}-{den}` (built at `:701`) where none is
   present. Guard: supplied ids are honoured only if every supplied id on the
   vocal line is unique; on any duplicate, fall back to cursor ids for the
   whole line and push a warning, so a foreign file with sloppy ids cannot
   make two corrections collide.

## Scope fences

- `mnx-parser.ts` is untouched. The reader emits MusicXML only.
- No migration. x is not recoverable from a stored `m{...}` id, so existing
  page-read corrections orphan once, ruled and priced; the drawer already
  counts them through `notation.orphans`.
- `VocalLineEvent` is untouched; it already carries `id`.
- No new save site.
- Every existing fixture and every non-reader source parses to byte-identical
  events: they carry no `id` attributes, so the fallback path is the old path.
  Prove it, do not assert it.

## Definition of done

WRITTEN is not DONE. DONE requires Dann's walk on a deploy.

1. Five gates at baseline. If gate 4 moves, note that the literal at
   `ilya-ship.sh:79` occurs TWICE on the line: any edit needs the `g` flag,
   `sed -i '' '79s/OLD/NEW/g'`. The first-match form was caught producing an
   unmatchable expectation once already.
2. Unit evidence, vitest, node: a reader-emitted document parses with reader
   ids intact; a document without ids gets cursor ids unchanged; the duplicate
   guard falls back and warns; a correction keyed by a reader id survives the
   removal of an earlier event in its measure.
3. Fixture identity: the 23 render fixtures and the parser's own test corpus
   parse identically to before this ship.
4. Walk script for Dann, on a deploy: read the Lamm scan, correct one note,
   reload, the correction lands. The one-time orphan count for corrections
   made before this ship is expected and reported, not hidden.

## Return memo format

`docs/sessions/memo-n97b-id-carry_r1_<date>.md`: what shipped, gate lines,
the guard's behaviour on the wild-file case, and a section headed
**NOT ESTABLISHED** listing everything the work could not establish.
NOT ESTABLISHED beats a complete invented answer.

## Do not

- Do not run git. Ask Dann to `git add` new files before any ship.
- Do not touch `mnx-parser.ts`, `VocalLineEvent`, or anything in
  `apps/web/src/lib/shane/reconciliation/`.
- Do not write a migration that guesses x.
- Do not let two events share an id under any input; the guard exists so that
  cannot happen silently.
