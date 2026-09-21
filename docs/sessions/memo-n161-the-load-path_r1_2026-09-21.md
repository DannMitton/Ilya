# Memo: N.161 r1. The load path no longer writes

**Written 2026-09-21 by Claude Code, answering `brief-n161-the-load-path-should-not-write_r2_2026-09-21.md`.**
**Tree: HEAD `abfbbc3` plus three modified files, uncommitted. Status: WRITTEN. Dann walks it on his own library.**

---

## What was built

The plan in `OPEN.md` §N.161, as agreed. Nothing else.

- **The gate.** `shouldFoldOnArrival(before)` in `apps/web/src/lib/shane/first-seat.ts`, a pure
  predicate. It asks the map, before the merge, whether it holds no syllable seat, which is the
  test `shouldSeatFirstTranscription` already makes, and it delegates to that function.
- **`applyArrival` reads it before `mergeOnUpload`** and runs `seatCliticFolds` only when it
  said yes. The call that stood at `+page.svelte:3404` at `abfbbc3` now reads
  `if (foldOnArrival) doc.pairings = seatCliticFolds(...)`, and its comment says why.
- **`reseatAcross` no longer calls the fold.** It writes `reseatByDiff(...).map` and stops. Its
  doc comment now records why the call was removed.
- **Kept untouched:** the fold at Start over, at the first seat of a transcription, and at the
  score's own seat of a poem it filled. `clitic-seat.ts`, `clitic-seat.test.ts`, and
  `score-seat.test.ts` are unchanged. `blankUnderlay` and `seatedCliticFolds` still read
  `isCliticSeated`. No stored field, no schema change, nothing on the page or in the drawer.

Line numbers in `+page.svelte` after `reseatAcross` moved up by 1, and after the arrival gate by 2.
The citations in `docs/memory` into that range were already dated snapshots (for example
`ocr-guard.ts:83` pointed at unrelated code before this edit), so I did not sweep them.

---

## Results against section 6

Every walk ran on the dev server in the browser pane, on a fresh `*.localhost` origin, with the
Sunless fixture (`sunless-01-engraved.musicxml`). Each prediction was stated in the session
before its measurement. "Diff" means a field-by-field diff of the stored song record in
IndexedDB, before against after.

**The positive control for walks 1 and 2** ran the same steps with `abfbbc3`'s `+page.svelte`
copied into place, then copied back. `cmp` confirms the tree now holds the build's version.

### 1. A hand change on note 37 survives a reload. PASSED

- First ingest on `n161.localhost`: note 37 (`m7-0-1`) held «в бью» at `0-15.0`.
- I selected note 37 in the loupe and tapped «щем» in the syllable pool. The record then held
  «щем» on note 37.
- **Build, after a reload:** note 37 still held «щем». The diff was one line:
  `updatedAt`. Nothing else moved.
- **Control, `abfbbc3`, the same stored song, after a reload:** note 37 went back to «в бью»,
  with its IPA, vowel, and slot index. The hand change was lost.
- **My prediction for the control was wrong on the count.** I predicted up to 60 notes; it
  rewrote one, because the rest of this run already matched the fold. The mechanism is the one
  the brief describes; the size depends on how far the stored run has drifted.

### 2. Deleting the host word does not bring it back, and nothing freezes. PASSED

- On the same origin I removed «бьющемся» from the poem field, leaving «в сердце».
- **Build:** 61 notes changed. 3 were vacated (37, 39, and 40, the three syllables of
  «бьющемся»). 57 kept their text and moved back one word in their address. 1 («серд», note 41)
  moved back one word and now reads «в серд», because the poem now places «в» on «сердце».
  «бью» and «щем» appear nowhere in the record or on the page.
- **Build, after a reload:** the diff was `updatedAt` only. The N.160 dry run read
  `94 seated = 94 address + 0 anchor + 0 joined + 0 rejected + 0 unfound`, and the seat count
  read `94 drawn live, 0 kept as stored`. No seat froze.
- **Control, `abfbbc3`, a fresh origin, the same deletion:** notes 37, 40, and 39 held «в бью»,
  «щем», and «ся» again, the score drew «в бью» and «щем», and «серд» stayed at `0-16.0`, one
  word late for the edited poem.

### 3. A first ingest and a whole-song replace still seat the fold. PASSED

- **First ingest:** walk 1's opening state, note 37 «в бью» at `0-15.0`.
- **Whole-song replace**, on `n161t.localhost`: I ingested a scratch variant of the fixture with
  one extra measure, so its stored notes include ids the real fixture lacks, then dropped the
  real fixture. The dialog read "This is not the same music", 3 of 100 placements orphaned. I
  chose **Replace this song**. Afterwards the extra measure's 3 placements were gone, note 1
  was empty, and note 37 held «в бью» at `0-15.0`: 60 syllable seats, which is the fold's run
  alone.
- The variant was a DESK DEFAULT; the tree holds only one MusicXML score. It lived in the
  gitignored `static/reader/` and is deleted.

### 4. A re-upload onto placed work no longer folds. PASSED

On `n161.localhost`, after walk 2, I dropped the same fixture again. Notes 37, 39, and 40 stayed
empty. The diff was `updatedAt` and `source.importedAt`, the upload's own stamp. No pairing moved.

### 5. The gate's predicate has its own tests. PASSED

Three tests in `first-seat.test.ts`, under `N.161 shouldFoldOnArrival`:

- it refuses a map that holds a syllable placement;
- it accepts an empty map;
- control: a map of melisma and empty marks alone is accepted, and the same map plus one
  syllable is refused.

### 6. The five gates. PASSED

Stated before the run: gates 1, 2, 3, and 5 at baseline, gate 4 from 1378 to 1381.

| Gate | Result |
|---|---|
| 1 phonology | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` |
| 3 web-check | `svelte-check found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `1381 passed (1381)` |
| 5 score-parser | `575 passed \| 5 skipped (580)` |

**The ship script's gate 4 literal must move from `1378` to `1381`** before it will pass. That
is the desk's to move with Dann's permission; I did not touch it.

---

## Section 3: is there a song the gate would leave unseated?

**My expectation, stated before anyone runs it:** Dann's Sunless song reads `seated`, held by
`m7-0-1`. The 2026-09-21 reload that rewrote notes 37 to 96 wrote the fold's own «в бью» onto
note 37, and nothing since writes that note. Any other song of his: NOT ESTABLISHED.

**What it would decide.** No `CANDIDATE` row means the per-song marker is not called for and the
gate stands as built. A `CANDIDATE` row goes to Dann with one question: did he change that run
by hand? If he did not, that is the song `OPEN.md` names as the reason for the marker.

**It does not decide whether the arrival fold can be dropped entirely.** Walk 3 shows the
whole-song replace is seated only by that call, and by reading, so is a first ingest of a
lyric-bearing score onto a box that already holds a different poem (`mergeOnUpload` returns an
empty map for it, and the box is not filled). So the call stays, gated.

**Run this in Dann's Chrome, on the page of the deployment that holds his library.** It reads
IndexedDB and writes nothing. It prints one row per song, or per lone clitic.

```js
(async () => {
  const open = () => new Promise((res, rej) => { const r = indexedDB.open('ilya-library'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const all = (db, store) => new Promise((res) => { const r = db.transaction(store).objectStore(store).getAll(); r.onsuccess = () => res(r.result); });
  const norm = (s) => (s || '').replace(/ /g, ' ').toLowerCase().replace(/ё/g, 'е').replace(/[^а-я ]/g, '').replace(/\s+/g, ' ').trim();
  const vowelless = (s) => /^[бвгджзйклмнпрстфхцчшщъь]+$/.test(s);
  const db = await open();
  const songs = await all(db, 'songs');
  const sources = await all(db, 'sources');
  db.close();
  const rows = [];
  for (const song of songs) {
    const src = sources.find((s) => s.songId === song.id);
    const seats = Object.entries(song.pairings || {}).filter(([, p]) => p.kind === 'syllable');
    const base = { song: song.name || song.id, file: src ? src.fileName : '(no score)', syllableSeats: seats.length };
    if (!src) { rows.push({ ...base, verdict: 'no score' }); continue; }
    const text = new TextDecoder().decode(src.bytes);
    if (!text.trimStart().startsWith('<')) { rows.push({ ...base, verdict: 'NOT READABLE HERE (not plain MusicXML)' }); continue; }
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    const cells = [...xml.querySelectorAll('note')].map((n) => { const l = [...n.querySelectorAll('lyric')].find((x) => (x.getAttribute('number') || '1') === '1'); return l ? norm([...l.querySelectorAll('text')].map((t) => t.textContent).join('')) : null; }).filter((c) => c);
    const folds = [];
    for (let i = 0; i + 1 < cells.length; i++) if (vowelless(cells[i])) folds.push({ clitic: cells[i], fused: cells[i] + ' ' + cells[i + 1] });
    if (folds.length === 0) { rows.push({ ...base, verdict: 'no lone clitic in the file' }); continue; }
    for (const f of folds) {
      const holders = seats.filter(([, p]) => norm(p.cyrillic) === f.fused).map(([id]) => id);
      rows.push({ ...base, fold: f.fused, heldBy: holders.join(' ') || '-', verdict: seats.length === 0 ? 'no placements yet' : holders.length ? 'seated' : 'CANDIDATE: ask Dann whether he changed this run by hand' });
    }
  }
  console.table(rows);
  return rows;
})();
```

**Its controls, run this session in the browser pane:** on `n161t.localhost` (fold seated) it
read `в бью`, held by `m7-0-1`, `seated`. On `n161.localhost` (note 37 vacated by walk 2) it read
`в бью`, held by `-`, `CANDIDATE`. Arrival looks like a `console.table` with one row per song.

**What could make it lie**, so the desk reads it with these in hand:

- It approximates `findCliticFolds`, which runs the transcription pipeline and a console paste
  cannot. It treats any verse-1 lyric cell made only of consonants as a lone clitic and the next
  lyric cell as its host. It can report a fold the pipeline would refuse (a walk that loses
  sync), and it can miss one the pipeline would find.
- It checks whether ANY syllable seat holds the fused text, not whether the clitic's own note
  does, because a console paste cannot map a cell to an event id. A fused seat that has moved
  to another note reads `seated`.
- It reads plain MusicXML only. An `.mxl`, a `.musx`, or a photographed page reads
  `NOT READABLE HERE`.

---

## The displacement

**N.141's last step moving to week 3 does not look wrong from the code's side.** The build was two
call sites, one predicate, and three tests, and it touched nothing N.141's tie squircle reads.

---

## NOT ESTABLISHED

- **The answer to section 3.** It needs the paste run on Dann's library.
- **Whether any other load step writes placements.** I diffed the record across four reloads on
  the fixture and saw only `updatedAt`. That covers this fixture's paths, not every song shape.
- **Why `updatedAt` moves on every load.** Owed and untraced (`OWED.md`), and out of scope here.
  The diff tells it apart from a real write, as the brief asked.
- **The first ingest onto a box holding a different poem** is covered by reading only, not by
  a walk.

**Owed, and not done because the brief freezes the fold's file:** the doc comment on
`seatCliticFolds` (`clitic-seat.ts`, the paragraph beginning "IDEMPOTENT") still says the fold
is safe to run on a re-upload and a restore and is not gated on how the score arrived. Both are
now untrue of its callers. One line for `OWED.md`.

---

## What Dann commits

The ship script refuses on untracked files, and two are untracked: the desk's brief and this memo.
From `~/Desktop/ilya-rewrite`, Dann stages them himself:

```bash
cd ~/Desktop/ilya-rewrite
```

```bash
git add docs/sessions/brief-n161-the-load-path-should-not-write_r2_2026-09-21.md docs/sessions/memo-n161-the-load-path_r1_2026-09-21.md
```

Then, once the desk has moved gate 4's literal to `1381`:

```bash
sh ~/Downloads/ilya-ship.sh "N.161: the clitic fold runs only where placements are built from nothing; a reload and a poem edit no longer rewrite seats"
```

NOT ESTABLISHED beats a complete invented answer.
