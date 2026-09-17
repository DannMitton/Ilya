# Brief: N.143, the input field stays empty on a `.musx` score

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code.

**Item:** N.143. Spec: `docs/memory/OPEN.md`, section `N.143`. **Read it first and
in full**, especially "HALF A: CAUSE FOUND 2026-09-16". This brief covers HALF A.
Half B (naming the song from the file name) is NOT in this revision; do not build it.

---

## The goal, in the singer's words

Dann, 2026-09-15, on the deploy `76b24a3`: *"I just pulled T05 in and there is no
instantaneous transcription. Why doesn't an instantaneous transcription appear? We
based a whole evening of work on making that happen."*

A singer drops a Finale file that carries lyrics. The input field fills with the
score's Cyrillic words, the poem receipt shows `from score`, and Transcription
draws. Today that happens on MusicXML (N.134, walked 2026-09-14 on Sunless 01)
and not on `.musx`.

**The term is "the input field".** Dann, 2026-09-15. Not "the poem box".

---

## The cause, read at the desk 2026-09-16

- The fill is gated at `apps/web/src/routes/+page.svelte:3120-3123` and asks for
  VERSE 1: `collectScoreWords(ingested.result.score, 1)`.
- T05, converted by the project's denigma WASM, has
  `global.lyrics.lineOrder = ["v3","v1","v2"]`. `v3` is declared and carries no
  syllable. `v1` is Cyrillic, `v2` is IPA.
- `packages/score-parser/src/mnx-parser.ts:396` numbers verses by position in
  `lineOrder`: `order.forEach((id, i) => lineIdToVerse.set(id, i + 1))`. So `v3`
  becomes verse 1, verse 1 is empty, and the fill writes nothing.
- The Sonnet diagnosis found `origin === 'upload'` and `noLyrics === false` on
  this drop, and Sunless 01 (MusicXML) returning 39 words as a positive control.

The file: `~/Downloads/Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`

---

## The fix

In `mnx-parser.ts`, in the verse-detection block (step 3, the `lineOrder` branch),
**number only the `lineOrder` ids that occur on the vocal part's events**
(`seenLineIdsInOrder`), keep their `lineOrder` order, then append
observed-but-unlisted ids exactly as today, with the same warning.

Keep these as they are:

- the `maxLinesPerEvent > 1` gate and its single-line branch;
- the `lineorder-missing` fallback;
- the rule in the block's comment that lineIds are arbitrary and no number is ever
  parsed out of one (the Patterson sample's verses were `v2`, `v4`, `v6`, `v8`).

**State your expectation before you measure:** T05's verse 1 becomes `v1`, and
`collectScoreWords(score, 1)` returns the 73 Cyrillic words the diagnosis found
under verse 2. Name your likeliest failure mode before you run it.

---

## Check these before you call it done. Each one is NOT ESTABLISHED today

1. **Every other reader of verse numbers.** Score markup's underlay and
   Transcription's verse picker read `lineIdToVerse` through `mnx-parser.ts:975`
   and beyond. Find each reader, by search, and say whether the renumbering
   changes what it shows on T05. It should change it for the better; say so with
   evidence.
2. **Anything STORED that keys on a verse number.** A T05 song saved before this
   fix may hold verse 2 as its Cyrillic verse. If a saved song opens on the wrong
   verse after the fix, report it and stop. Do not write a migration without
   telling the desk.
3. **The existing MNX tests.** If any fixture lists an unused id in `lineOrder`,
   its asserted verse numbers move. Report each one; do not edit an assertion to
   make it pass without saying why the new number is right.
4. **Other `.musx` files.** If other Finale files are in the repository fixtures,
   say whether they carry an unused `lineOrder` slot. Whether `v3` comes from
   Finale or from denigma is not yours to settle; record what you see.

---

## Tests

Add to `packages/score-parser/src/mnx-parser.test.ts`, in the describe block that
fits (`diagnostics and degraded sources` is the likely home):

- a document whose `lineOrder` lists an unused id FIRST, where the first used id
  becomes verse 1;
- an unused id in the MIDDLE, where the used ids number 1 and 2 with no gap;
- the Patterson shape (`v2`, `v4`, `v6`, `v8`, all used), unchanged.

---

## What NOT to do

- **Do not change `VocalLineEvent`**, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/` (CONTRACT §6).
- **Do not touch the fill gate at `+page.svelte:3120-3123`.** It is working as
  designed; the verse under it was wrong.
- **Do not build the file-name fallback.** Half B waits on Dann.
- Do not parse a number out of a lineId.

---

## Definition of done

1. Dropping T05 fills the input field with its Cyrillic words, shows `from score`
   on the poem receipt, and Transcription draws.
2. Sunless 01 (MusicXML) still fills with its 39 words.
3. The three new tests pass.
4. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate baselines`.
5. Walked in a browser by Dann on the deploy. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n143-musx-verse-fill_r1_<date>.md`:

1. What you changed, by file and line.
2. Your expectation, stated before the measurement, and the measurement.
3. The four checks, each answered with evidence or marked NOT ESTABLISHED.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
6. Any decision this brief did not settle, marked as yours and reversible.

**Do not commit and do not stage.** No agent writes with git. If you create a new
file, name it in the memo so Dann can `git add` it before he ships; the ship
script refuses untracked files.
