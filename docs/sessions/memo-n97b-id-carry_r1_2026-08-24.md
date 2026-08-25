# N.97b: the reader's id crosses the parser boundary

**r1, 2026-08-24. Answers `docs/sessions/brief-n97b-id-carry_r1_2026-08-24.md`,
which is option 1 of `docs/sessions/memo-n97-clef-key_r1_2026-08-24.md`.**

Read **What this does to what you have stored** before you ship. It names one
cost the brief did not price: stored placements orphan once as well as stored
corrections, and the fingerprint of every page-read song changes.

---

## What shipped

Nothing is committed. Five tracked files are modified and no file is new, so
there is nothing to `git add` except this memo and the brief, if the brief is
not tracked yet.

A page-read song's events are now keyed by the reader's own `r{measureIndex}-{x}`
rather than by the parser's duration cursor. Walked in a browser on
`localhost:5173`: a correction made after this change is stored as `r1-2344`,
and it survives a full reload and a re-read of the same ink.

### The converter writes the id

`apps/web/src/lib/shane/ingestion/recognized-to-musicxml.ts` writes each event's
reader id as the `id` attribute on its `<note>`, which MusicXML 4.0 permits.
`idAttribute` emits nothing where the event carries no id, so a `ro` from a
producer that has no ids engraves the document it engraved before, byte for
byte. That equality is asserted rather than described: one test converts the
hand-built fixture twice, once with its ids stripped from `ro` and once with
them stripped from the emitted XML, and compares the two strings.

### The parser prefers it, or refuses the lot

`packages/score-parser/src/musicxml-parser.ts` gains `resolveSuppliedIds`, which
runs once over the vocal part **before the first event is built** and returns one
boolean for the whole line. `readNote` then takes the supplied `id` where the
note carries one and falls back to the cursor id `m{measureIndex}-{num}-{den}`
where it does not.

The guard refuses on either of two conditions, and refusal costs the whole line
its supplied ids and pushes one warning:

- **A duplicate.** Two notes in the vocal part carrying one id.
- **An id in the fallback's own namespace.** A supplied id matching
  `/^m\d+-\d+-\d+$/`. Nothing about the supplied ids need be duplicated for this
  to bite: the collision would be with a cursor id generated for a neighbouring
  note that carries no id of its own, which no check over the supplied ids alone
  can see. Refusing the shape makes honoured ids and generated ids disjoint
  populations, so **no two events can share an id under any input.** That is the
  brief's last "Do not", kept by construction rather than by care.

Grace notes and chord tones are skipped in the scan, because `readNote` skips
them. They never become events, so their ids cannot collide with anything.

`packages/score-parser/src/types.ts` gains the warning code `duplicate-note-ids`
for that refusal. Nothing in the tree switches on `ParseWarningCode`, so the
addition reaches only the warning it names.

### What the scope fences say, and what happened to each

- `mnx-parser.ts`, `VocalLineEvent`, and `apps/web/src/lib/shane/reconciliation/`
  are untouched. `correction.ts` is untouched; the tests import it as evidence.
- No migration was written. `x` is not recoverable from a stored `m{...}` id.
- Two existing assertions in `recognized-to-musicxml.test.ts` changed, both
  mechanically: they counted events with `/<note>/g`, and a note that carries an
  id no longer matches that. They now count `/<note[ >]/g`. Those two lines are
  the only existing assertions in the repository that this ship edited.

---

## The gate lines

All five ran here, in this folder, on this working tree. Two moved, both because
this ship added tests, and both baselines are literal strings in
`~/Downloads/ilya-ship.sh`.

| gate | baseline | this ship |
|---|---|---|
| 1 phonology | 216 | 216 passed |
| 2 dictionary | 235 | 235 passed |
| 3 web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| 4 web-test | 784 | **790 passed, 45 files** |
| 5 score-parser | 444 passed, 5 skipped | **451 passed, 5 skipped (456)** |

`pnpm --filter @ilya/web build` is clean. `stamp-sw` wrote `CACHE_VERSION
ilya-1787625847810`.

The thirteen new tests are 6 in `recognized-to-musicxml.test.ts` and 7 in
`musicxml-parser.test.ts`.

### Moving the two baselines

Read `:79` and `:80` first and confirm the literals are the ones this memo
quotes. `784 passed (784)` occurs **twice** on line 79, so its edit needs the `g`
flag; `449` occurs once on line 80, and `444` occurs once, so that line is
replaced whole instead.

```bash
sed -i '' -e '79s/784/790/g' -e '80s/444 passed | 5 skipped (449)/451 passed | 5 skipped (456)/' ~/Downloads/ilya-ship.sh && chmod +x ~/Downloads/ilya-ship.sh
```

Re-read both lines after running it. They should read:

```
gate 4 web-test     "790 passed (790)"                          pnpm -C "$REPO" --filter @ilya/web test
gate 5 score-parser "451 passed | 5 skipped (456)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

**Both expectations are proven matchable, not assumed.** Each gate ran with
`NO_COLOR=1`, its output went through the script's own `strip_ansi | tr -s ' '`,
and `grep -qF` found the new literal in the result. The unmatchable-expectation
failure the brief warns about cannot be what happens here.

---

## The guard on the wild-file case

Two tests drive the refusal from opposite ends.

**From the reader's end**, in `recognized-to-musicxml.test.ts`: the captured
Musorgsky page is rewritten so its fourth event repeats its third event's id,
converted, and parsed. Every one of the 78 events comes back with a cursor id,
all 78 are unique, and exactly one `duplicate-note-ids` warning is raised. A
reader that lost its ordinal suffix would cost its songs the carry-through, and
nothing else.

**From the file's end**, in `musicxml-parser.test.ts`: a two-measure document
whose first measure carries four perfectly good ids and whose second repeats one
loses **all eight**. A line half-keyed to ink and half to a cursor is worse than
either, because which half a given correction is keyed to is then invisible.

The namespace refusal has its own test: one note supplied as `m0-1-2`, which is
exactly what the third note of that measure gets for free, with no duplicate
among the supplied ids at all. The whole line falls back and warns.

The reader cannot trigger either refusal today. Memo N.97 measured 1,118 ids
over 25 corpus pages, 47 of them carrying the ordinal suffix, and 0 duplicates.
The guard is for the day that changes and for the foreign file that arrives with
its own ids.

---

## Fixture identity, measured rather than asserted

**The parser's own test corpus.** Every existing assertion in
`musicxml-parser.test.ts` and `mnx-parser.test.ts` passes unedited, including
the cross-parser agreement test that pins the exact id sequence
`m0-0-1, m1-0-1, m1-3-16, ...`. The 7 new tests are appended, and nothing above
them moved.

**Every MusicXML file in the repository.** A harness in the scratchpad runs the
parser as it was before this ship and the parser as it is now, in one process,
over the same corpus, and compares the whole `ParseResult` as JSON with the
per-parse syllable UUIDs normalized away. The corpus is every `.musicxml` and
`.xml` file under the repository plus the six `.mxl` archives unzipped, and it
includes the homr, PDFtoMusic, repaired, preinjection, and MuseScore-exported
variants.

```
files compared        59
identical             59
differed              0
fatal-error parses    0
vocal-line events     8508  (identical on both sides)
<note> id attributes  0  (across the whole corpus)
```

The last line is the load-bearing one. No file Ilya reads today carries a
`<note id>` at all, so every one of them takes the fallback path, and the
fallback path is the old path.

**The 23 render fixtures.** `gate06_fixture_identity.py` digests the return of
`run_page2.run`, which is a pure function of the reader's Python modules. This
ship edits no Python and no file under `tools/`. The five files it edits are:

```
apps/web/src/lib/shane/ingestion/recognized-to-musicxml.ts
apps/web/src/lib/shane/ingestion/recognized-to-musicxml.test.ts
packages/score-parser/src/musicxml-parser.ts
packages/score-parser/src/musicxml-parser.test.ts
packages/score-parser/src/types.ts
```

That list is checkable against the diff you are about to review. The gate's
input did not change, so its output cannot. I did not re-run it, and that is a
claim about the gate's inputs rather than a measurement of its output.

---

## What this does to what you have stored

**Corrections on a page-read song orphan once.** This is the ruled and priced
cost. The drawer counts them through `notation.orphans` and says so.

**Placements on a page-read song orphan once too, and the brief did not price
this.** `PairingMap` is keyed by the same event id. The orphaning is not silent
and nothing is destroyed: `mergeOnUpload` keeps every orphaned placement and
returns the count, `applyArrival` runs on a restore as well as on an upload, and
the drawer reports it as `station.orphaned`, "%s placements have no note in this
score. They have been kept." You have no placements on the page-read song in the
localhost library, so I have not seen this line fire; I read the path rather than
observing it.

**The fingerprint of every page-read song changes.** `canonicalVocalLine`
includes the event id, so the same ink now fingerprints differently. Two
consequences, both one-time:

- A reload is unaffected. `handleArrival` returns early on `origin === 'restore'`
  and never fingerprints, which is why the walk below works.
- **Re-uploading a picture you have already read will ask you to replace or
  attach**, because the stored fingerprint differs and at least one placement or
  correction orphans. Answering **attach** keeps the song and re-stamps the
  fingerprint. From then on it matches again.

**`migrateCorrectionIds` stays inert, and stays safe.** It treats a
four-segment id as old-scheme. A reader id is `r{mi}-{x}` or `r{mi}-{x}-{n}`,
which is two or three segments, and a cursor id is three, so nothing this ship
writes can ever be mistaken for the old scheme.

---

## What was walked, in a browser

`pnpm --filter @ilya/web dev` on `localhost:5173`, in the in-app browser pane, on
the song the N.97 session left in your localhost library: the Lamm scan page 1
PNG, stored as `raster400-1.png`, carrying one correction made before this ship.

1. The song restored on load and re-read to the same four systems. The drawer
   read **"Vous avez corrigé une note"** and **"1 corrections ne retrouvent plus
   leur note"**. That is the one-time orphaning, on your own data, declared.
2. I picked a note in the middle of the first system, reading **B4**, and pressed
   **Un degré vers le haut**.
3. IndexedDB then held two corrections:
   `{"m0-3-4": {...}, "r1-2344": {"pitch": {"step":"C","alter":0,"octave":5}}}`.
   The new key is the reader's `r{measureIndex}-{x}`. Before this ship it would
   have been another `m{...}`.
4. A full page reload, which re-ingests the stored bytes and runs the reader
   again from the ink. The drawer read **"Vous avez corrigé 2 notes"** and the
   orphan line **stayed at 1**, so the new correction found its note. Clicking
   that note again read **"Sélectionnée : C5"**.

The one orphan across the reload is the pre-ship `m0-3-4` and nothing else.

**What I left on your machine.** The correction from step 2 is still in the
localhost library, alongside the N.97 session's `m0-3-4`. I did not delete either.
Clear them whenever you like; nothing depends on them.

---

## Walk script for Dann, on a deploy

Do these in order. Numbers 4 and 5 are what this ship exists for.

1. Open Studio and drop a picture or PDF of a page you have not read before.
   Confirm the clef and key prompt, and read the page.
2. Open **Score markup**, pick a note in the middle of a system, and nudge it up
   a step.
3. Reload the whole page. **The correction should still be there and the drawer
   should say you have corrected one note.**
4. Now do the same on a page-read song you already had before this ship. On the
   first load after it, **the drawer says some corrections no longer find their
   note. That is expected, it is once, and it is the cost you ruled.** If it also
   says placements have no note in this score, that is the same event reaching
   your placements, and they have been kept.
5. Correct a note on that older song, reload again, and check the orphan count
   does not grow. Corrections made after this ship land; only the ones made
   before it are orphaned.
6. If you re-upload a picture the library already knows, expect the replace or
   attach question once. Answer **attach**.

---

## Files

Modified, all tracked:

```
apps/web/src/lib/shane/ingestion/recognized-to-musicxml.ts
apps/web/src/lib/shane/ingestion/recognized-to-musicxml.test.ts
packages/score-parser/src/musicxml-parser.ts
packages/score-parser/src/musicxml-parser.test.ts
packages/score-parser/src/types.ts
```

New, needing `git add`: this memo, and
`docs/sessions/brief-n97b-id-carry_r1_2026-08-24.md` if it is not tracked yet.
`ilya-ship.sh:45-50` scans the whole repository, so an untracked file anywhere
stops the ship before a gate runs.

**One observation for `ENVIRONMENT.md`, not diagnosed.** After
`pnpm --filter @ilya/web build`, `apps/web/static/reader/` held a duplicate of
every module under a " 2" name, `run_page2 2.py` beside `run_page2.py`, all
stamped at the build's own minute. `copy-reader.mjs` wipes that directory and
copies eleven named modules, so it did not write them; the Desktop folder is
iCloud-synced and conflict copies are the likely cause. They are inert:
`manifest.json` names only the real eleven and the worker fetches by manifest.
The directory is gitignored, so they cannot reach a ship.

---

## NOT ESTABLISHED

- **Dann's walk on a deploy.** WRITTEN is not DONE, and the localhost walk in
  this memo is not the deploy walk the brief requires.
- **The reader's live ids through this seam.** The walk above proves it for the
  Lamm scan page 1. The only captured `ro` in the repository predates N.97 and
  carries four-segment `r{mi}-{num}-{den}-{x}` ids, so every fixture-based test
  here exercises the carry-through with ids of the older shape. The shape does
  not matter to the parser, and nothing tests the new shape against a captured
  page.
- **A page whose ids carry the ordinal suffix.** All 47 of those live on
  sunless-06, which is a render fixture and not a stored `ro`. The suffix has
  never travelled this seam. It cannot collide by construction, and that is an
  argument rather than a measurement.
- **The `station.orphaned` line firing on real data.** Read in the code, not
  seen on screen. No page-read song in the localhost library carries placements.
- **The replace-or-attach question on a re-upload after this ship.** Derived
  from `arrivalDecision` and `canonicalVocalLine`, not walked. It costs one
  answer if it fires and one confusing dialog if I have read it wrong.
- **The 23 render fixture digests.** Argued from the fact that no Python
  changed, not re-measured.
- **Whether any foreign source Ilya reads will ever supply `<note id>`.** Zero
  of the 59 MusicXML documents in this repository do. Verovio and some Dorico
  exports are known to write ids in general, and none of that is in the corpus,
  so the first real file to exercise the honoured path may well be one of yours
  rather than a page read.
