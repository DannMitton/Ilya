# Brief: the tree anchors for the drawer path pass

**From:** the desk (Fable), for Dann. **To:** a fresh Sonnet session in Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`. **Date:** 2026-09-10. **Revision 1.**

**This is a read-only job.** You edit nothing, build nothing, and run no git command. You return one memo. Worst case about 60k tokens.

**NOT ESTABLISHED beats a complete invented answer.** Every line in your memo carries a `path:line` you opened this session, or the words NOT ESTABLISHED. No third form.

## Goal

The desk is about to brief Code on "the path pass": the drawer's front side (Piece, Input, Text, Score markup) becomes a path read top to bottom, per `docs/memory/PRODUCT.md` §The drawer grammar and the path. Before that brief can name a change, it needs the anchors in the tree for each change. Find them. Do not propose the changes, and do not judge them.

## Read first

1. `docs/memory/PRODUCT.md`, the section "The drawer grammar and the path", in full.
2. `docs/sessions/drawing-drawer-front-side_r2_2026-09-10.html`, Plates A to E, in full. Render it or read its text; the captions carry the rulings.

## The changes whose anchors you find, and what to return for each

For each numbered change, return: the file and line range that produces the current behaviour; the component that owns it; the i18n keys involved (`apps/web/src/lib/i18n.ts`, both languages, quoted verbatim); and any test that pins the current behaviour (`*.test.ts`, with the test name).

1. **Empty drawer opens Input alone; Piece and Score markup show their band and nothing under it.** Find: what decides which band is open on first load and on an empty song; where Piece's open state lives; whether Score markup has an open state at all or is always expanded.
2. **A closed band shows one state line under it** (Piece: title · composer, with "from score" when the fields came from the score; Input: "8 lines · 37 words · 37 / 94 placed"; Text: "Grayson defaults", or "2 of 7 changed" when a Notation toggle is on; Score markup: "2 notes corrected · Voice: Dann · 10 of 10"). Find: whether any band today renders anything while closed; where each of those five numbers already exists in state (line count, word count, placed count, corrected-note count, sampled-vowel count, Notation departures from default); the "from score" tag's existing component or class.
3. **One filled pill per surface, the primary, last; everything else ghost.** Find: every filled button on the front side today (Transcribe and fit, Re-calibrate, any other), its class, and where it is rendered; whether Transcribe and fit still changes anything after N.112 (what its handler does, in one sentence, from the code).
4. **"Calibrate" as the first-time verb, "Re-calibrate" only when a voice exists.** Find: where Re-calibrate is rendered and its i18n key; how the component knows whether a voice profile exists.
5. **The METADATA word on the Piece band is struck; the fields show whenever Piece is open.** Find: the button that carries METADATA (`Drawer.svelte`, around lines 444-456 per an earlier reading; confirm), what it toggles, and whether Piece has a separate open state from the metadata body's.
6. **The empty field's placeholder and the caption under it.** Find: the current placeholder string and its key ("Paste or type the poem here. A score or a photograph dropped here is read as what it is." or similar); the Choose a file pill and its key; the intake hint under the field and its key; the drop handler, so the caption's "choose a file" link can open the same picker.
7. **"37 / 94 placed" on the syllable line's row.** Find: where the count is rendered today (`IntakePanel.svelte`) and whether it has an i18n key or is bare.

## What not to do

- Do not edit any file. Do not run `git`. Do not run the gates or a build.
- Do not read `docs/memory/INBOX.md` or `docs/sessions/LOG.md`.
- Do not propose designs, renames, or fixes. Anchors only.

## Return memo

Write `docs/sessions/memo-anchors-path-pass_r1_2026-09-10.md`, under 120 lines:

1. One table per change above, columns: what · path:line · owner component · i18n keys (verbatim, both languages) · test.
2. A section **NOT ESTABLISHED** listing everything you could not find or could not decide from reading, one line each, and why.
3. A section **What I noticed but was not asked**, at most five lines, facts only.

Then stop. Do not summarise the memo back in chat beyond the file path and its line count.
