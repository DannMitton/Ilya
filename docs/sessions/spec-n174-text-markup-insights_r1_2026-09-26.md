# N.174. The code says Text, Markup, and Insights: spec r1, 2026-09-26

**A dated draft for the fresh thread that executes it.** Written by the audit desk
at the end of the thread of 2026-09-26. Numbered by Dann 2026-09-26 23:14 (*"execute
the line-by-line as its own cardinal task within our code refresh"*).

## Dann's words, 2026-09-26 23:09 to 23:14

- *"Can we eliminate the confusion in the code between labels marked Shane and
  labels marked Fit? … I just don't need future developers wondering why three
  names for one part of the code."*
- *"The three tabs are the three elements: Text, Markup, and Insights. Can we
  execute a line by line audit to ensure that we don't break anything while
  bringing our code up to a consistent standard?"*
- *"Shane doesn't have to be the whole extension, or even name in the
  architecture at all except as a historical process. … the three names Text
  Markup and Insights could feature in the code correction."*
- *"And we might want to consider breaking Shane into modules that can be
  distributed? Your choice."*
- *"It's wisest to prepare in this thread … and execute the line-by-line as its
  own cardinal task within our code refresh."*

## The target, stated as defaults (tether 19: each may bend with a reason)

1. **The three documents carry their on-screen names in the code.** Document ids
   `'transcription'` → `'text'`, `'shane'` → `'markup'`, `'insights'` unchanged
   (`apps/web/src/lib/destinations.ts:36`, `:46`). Components, CSS classes, and
   test selectors that name a document follow.
2. **"Shane" leaves the code as a name.** It survives only as history: the git
   branch `Shane`, the records in `docs/`, and one line in `ARCHITECTURE.md`
   ("developed under the codename Shane; shown on screen as Fit until
   2026-09"). **"Fit" leaves too**, except where it means fitting to the page
   (`PageFit.svelte`), which is a different word.
3. **`lib/shane/` (139 files) becomes modules by job.** DESK DEFAULT, Dann's
   "your choice"; the Fable pass in step B may redraw it:

   | module | what moves there (from the phase 0 codemap, a lead) |
   |---|---|
   | `lib/score/` | ingestion, the seating and pairing of words to notes, correction, the loupe, reconciliation |
   | `lib/voice/` | calibration, the voice profile, the microphone engine and its signal processing |
   | `lib/reader/` | reading a score from a PDF, a photograph, or MuseScore (the Web Workers and their helpers) |
   | `lib/markup/` | the Markup document: today's `VoiceProfilePane.svelte`, engraving and its legend |
   | `lib/insights/` | the Insights document: `insights.ts`, its pane, intake, comments, and advice |

   **The dependency rule, enforced by `scripts/ratchets.mjs`:** `markup/` and
   `insights/` may import `score/`, `voice/`, and `reader/`; those three never
   import `markup/` or `insights/`. The Text document's code stays where it is.
4. **"Distributable" is the second step, not the first.** Once the folders exist
   and the ratchet holds the boundary, `reader/` and the signal processing in
   `voice/` are the two candidates to become packages (`packages/reader`,
   `packages/voice`), the way `score-parser` already is. Each promotion is its
   own later item.
5. **Nothing a singer has saved breaks.** Every stored value that names a
   document (at least `ilya:activeTab`) is read under its old and new names and
   written under the new one. The build flag `PUBLIC_INCLUDE_SHANE` is read
   under both names until Vercel's setting is renamed; renaming that setting is
   Dann's step, or a Vercel-tool step he approves.
6. **What the singer sees does not change.** Every shown string stays as it is.
   Unused keys found on the way, such as `tab.fit`, are listed for deletion.

## The steps

- **A. Inventory, read-only (Sonnet).** Every occurrence of `transcription`,
  `shane`, and `fit` in code, tests, config, and the four top-level documents,
  each with file, line, and one verdict: RENAME-ID, RENAME-MODULE,
  REWORD-COMMENT, MIGRATE-STORED, KEEP-OTHER-MEANING (the act of transcribing,
  `transcribeWord`, `TranscriptionLogEntry`; fitting to the page), KEEP-USER-STRING,
  or UNSURE. Plus: every persisted value with its write and read sites; i18n
  keys named with these words and whether each is used; exported identifiers
  that need coordinated renames; and every place a rename breaks at run time but
  not at type-check (string ids in `switch`es, CSS classes built from strings,
  Playwright selectors). About 300,000 tokens at worst.
- **B. The module map (Fable).** Assign each of the 139 files to a module from its
  imports and job, test the dependency rule against the real import graph, and
  return the map with every file that breaks the rule and what it would take.
  Fable reviews step A's UNSURE rows in the same pass. About 300,000 tokens at
  worst, from Fable's own weekly limit.
- **C. The plan, one line per change.** The desk merges A and B into an ordered
  change list, and Dann sees only what is his: any shown string, and the Vercel
  setting.
- **D. Execute (Code), in slices,** each ending with every gate green:
  1. the document ids, with the stored-value migration and its tests;
  2. the module moves, one module per slice, with the import rewrites and the
     new ratchet rule;
  3. comments, `ARCHITECTURE.md`, `AGENTS.md`, `README.md`, and the three queued
     briefs, whose paths all name `lib/shane/`.
- **E. Check.** A fresh agent searches the tree for `shane`, `Shane`, and the old
  document ids and must find only the historical line and KEEP rows. Then Dann
  walks: open a song saved before the change, and confirm it opens on the same
  document.

## Order (revised 2026-09-26 23:35, after the desk's own critique)

- **Steps A and B run in parallel.** B reads the import graph, not A's verdicts;
  only B's review of A's UNSURE rows waits for A. Two agents, within the ceiling.
- **Only one queued brief has to wait for N.174:** the Correction Station, whose
  paths all name `lib/shane/`. The ⟨ц⟩ and ⟨ш⟩ brief touches only
  `packages/phonology` and `data/`, and the Latin-words brief only
  `components/Paper/`; neither names `lib/shane/`, so both can run before N.174.
- **Feature work pauses on `lib/shane/` during step D.2.** Moving a file under a
  feature branch that edits it produces a conflict nobody can explain. This is
  the one place N.174 displaces anything: N.168's next slices, which live in
  `lib/shane/`, wait until D.2 closes. Dann's ruling of 2026-09-26 00:31 ("juggle
  both") still holds everywhere else.
- **One writer on `Shane` at a time.** On 2026-09-26 two threads committed to
  `Shane` in one evening, and the `audit` branch had to be rebased. Every thread
  fetches `Shane` before it starts a slice and rebases before it delivers.

## Why Fable for B and Sonnet for A (the desk's answer to Dann, 23:14)

Step A is volume: about 700 lines to read and sort by rules written here. Sonnet
does that well and checkably. Step B is judgement: where each file belongs and
whether a boundary is real. Fable is kept for exactly that. Using Fable for the
whole of A would spend its budget on sorting.
