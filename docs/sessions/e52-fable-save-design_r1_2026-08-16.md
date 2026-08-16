# THE SAVE FUNCTION — a design for Ilya's library
**Fable, commissioned by Dann Mitton, 16 August 2026.**
**Against:** `brief-to-fable-save-function_r1_2026-08-16.md`, repository at `~/Desktop/ilya-rewrite`, branch `Shane`, read only, no git.
**Every claim about the code below carries a `path:line`, a command I ran, or the words "not established." Legal claims carry case names and section numbers instead, and say where they come from.**

---

## 0. Terms, coined and adopted

- **The library**: the in-browser collection of saved songs. Adopted, ordinary usage.
- **Song record**: one saved song's data, minus its score file's bytes. Coined here.
- **The source**: the score file the singer dropped in, byte for byte. Adopted from Dann's ruling 2 in the brief's §4.
- **Song id**: the invisible, permanent, random identifier of a song record. Adopted, ordinary usage.
- **Fingerprint**: a hash of the music itself, used for recognition, never for identity. Adopted from common practice, with a specific meaning defined in §2.4.
- **The binder**: the exportable `.ilya` archive file. Coined here, from the physical binder of scores a singer carries. Dann may rename it freely; nothing keys on the word.
- **Reconcile, drift, refresh**: adopted unchanged from `pairings.ts` (`apps/web/src/lib/shane/pairings.ts:288-292`).

---

## 1. THE DECISION

**A saved song is everything the singer supplied for one piece of music, kept together under one permanent name tag: the poem, the six metadata fields, the glosses, the syllable placements, and the score file itself, byte for byte.** Everything else, the IPA, the syllabification, the drawn notation, and the forecasts, is recomputed from those materials every time the song opens, which is Dann's ruling 1 and 3 (brief §4) applied without exception beyond the one already ruled (R8's vowel glyph, `pairings.ts:22-27`).

**Songs live in the browser's IndexedDB, in a new database called `ilya-library`, beside the existing `ilya-data` dictionary cache, not inside it.** The dictionary cache is disposable and re-downloadable; the library is the singer's work. Separate databases mean clearing one can never touch the other, and the existing loader, which opens its database pinned at version 1 (`apps/web/src/lib/loader.ts:105`), is never disturbed.

**What the singer sees:** Ilya saves continuously, as it already does for placements (`apps/web/src/routes/+page.svelte:177-181`), with no Save button. New affordances are a song list to open, rename, and delete songs, an automatic name built from composer and title that the singer can edit, and an Export button that writes a `.ilya` binder file to their own Files app or Downloads folder. **Re-uploading a score never again erases placements.** A score, once uploaded, stays with its song, so after a reload the song simply comes back whole, score and all. That closes the ordinary path of N.68 (`+page.svelte:1147-1152`) as a side effect of the architecture rather than as a patch.

**No new dependency is added.** The database layer is plain IndexedDB behind a small in-tree module, and the binder is a ZIP written by promoting machinery the tree already owns (`apps/web/src/lib/shane/ingestion/zip-fixture.ts:1-13`, `zip-reader.ts:1-11`). The lightness number: roughly 8 KB added to the shipped bundle, zero bytes added to `static/`, and about 90 to 175 KB of storage per realistic song, so a hundred songs cost under 20 MB against origin quotas that run to hundreds of megabytes at minimum. §6 gives the arithmetic.

---

## 2. THE ARCHITECTURE (answers §6 questions 1, 2, 3, and 8)

### 2.1 Where a song lives (question 1)

**A new IndexedDB database, `ilya-library`, version 1, three object stores.** Not a version bump of `ilya-data`, for two reasons, one mechanical and one principled:

- Mechanical: `loader.ts:105` opens `ilya-data` with an explicit version, `indexedDB.open(DB_NAME, 1)`. If any other code upgraded that database to version 2, the loader's open call would thereafter fail with `VersionError` until the loader itself was edited. Sharing the database forces an edit to working dictionary code on day one; a separate database forces nothing.
- Principled: the `cache` store holds data Ilya can re-download (`loader.ts:119-126`). The library holds data nothing can recreate. Different lifecycles deserve different databases, so that "clear the cache" and "delete a song" can never be one operation by accident. Eviction does not distinguish (it is all-or-origin, brief §3.4), but every deliberate operation should.

**The stores:**

| store | keyPath | value | indices |
|---|---|---|---|
| `songs` | `id` | the song record (§2.2), **without** source bytes | `by-updated` on `updatedAt`; `by-fingerprint` on `source.fingerprint` |
| `sources` | `songId` | `{ songId, fileName, bytes: ArrayBuffer, byteLength, contentHash, importedAt }` | none |
| `meta` | literal key | one record, `'library'`: `{ migratedFromLocalStorage: boolean }` | none |

Sources are a separate store so that listing the library reads a few kilobytes of records, never megabytes of blobs. Bytes are stored as `ArrayBuffer`, not `Blob`; both structured-clone into IndexedDB, but historic WebKit defects around Blob storage are avoided entirely by the plainer type (that history is my general knowledge, not verified this session; the choice costs nothing either way).

One small pointer stays in localStorage: **`ilya:activeSongId`**, the id of the song currently open. It is a pointer, not data; losing it loses nothing but which song opens first. It keeps the boot path synchronous where it is synchronous today (`+page.svelte:899-977`).

A one-transaction rule: **a song save writes `songs` and `sources` in a single readwrite transaction.** IndexedDB transactions are atomic across the stores they name, so a half-written song cannot exist (this is the whole answer to the brief's §6.5 "half-written transaction" case; see §4).

### 2.2 What exactly a saved song is (question 2)

The song record, schema 1. Each field marked **human** (supplied by the singer, Dann's ruling 1), **fact** (a record of an event, editable by no one), or **derived** (with its justification).

```
{
  schema: 1,                     // fact: record format version
  id: string,                    // fact: crypto.randomUUID() at creation, never changes
  name: string,                  // human: display name; auto-generated once, thereafter the singer's
  createdAt: string,             // fact: ISO timestamp
  updatedAt: string,             // fact: ISO timestamp, maintained on save
  poem: string,                  // human: today's `ilya:inputText` (+page.svelte:677, :911)
  metadata: SongMetadata,        // human: six fields (apps/web/src/lib/types.ts:169-176)
  fromScore: string[],           // fact: which metadata fields arrived from the score header
                                 //       (today's `ilya:metadataFromScore`, +page.svelte:722)
  glosses: [string,string,string][], // human: today's `ilya:glossOverrides` rows,
                                 //       [key, gloss, anchorWord] (+page.svelte:947-961)
  openSyllabification: boolean,  // human: the division the singer chose for THIS song,
                                 //       snapshotted from the global preference at creation
  pairings: PairingMap,          // human: the placement map (pairings.ts:125). Its `vowel`
                                 //       field is R8's ruled exception and stays exactly as ruled
  source: null | {               // null = a song with no score yet (Transcribe-only, or pre-migration)
    fileName: string,            // fact: the name the file arrived under
    byteLength: number,          // fact
    importedAt: string,          // fact: ISO timestamp
    contentHash: string,         // derived: SHA-256 of the bytes. Justified: it is a NAME for
                                 //   immutable stored bytes, recomputable and verifiable at any
                                 //   moment; it can never go stale because the thing it names
                                 //   cannot change. Kept so "is this the same file" costs one
                                 //   hash of the incoming file, not a read of every stored blob.
    fingerprint: string,         // derived: SHA-256 of the canonical vocal line (§2.4).
                                 //   Justified: it is an index for recognition, never printed,
                                 //   never analysed. Its only failure mode when stale is a
                                 //   missed recognition, which the singer resolves by name.
                                 //   Recomputed on every import as a matter of course.
  }
}
```

**Not stored, ever:** the `ParsedScore`, the denigma-converted MNX, the slot queue, the reconciled map, any `AnalyzedEvent` (every field of which is derived from the profile, `packages/score-parser/src/analysis-types.ts:122-124`), and the rendered notation. All of it re-derives on open, per ruling 3 and CONTRACT §6's "do not store anything derived." The derive-on-open cost for `.musx` includes the denigma WASM conversion, whose duration is NOT ESTABLISHED (§9.3); if it proves slow, the ruled path is a progress affordance, and a parse cache would require a new ruling from Dann as a second exception, which this design does not request.

**What is per-song and what stays global.** The six keys above move into the song. Six others are device or UI preferences about the singer's environment, not about any song, and they stay in localStorage exactly where they are: `ilya:language`, `ilya:notationPrefs`, `ilya:showStressDiacritics`, `ilya:activeTab`, `ilya:drawerCollapsed`, and `ilya:openSyllabification` (which remains as the default for newly created songs even as each song snapshots its own). `shane.profiles.v2` is the singer's voice, not a song, and stays put (§3). `ilya-ios-hint-shown` is sessionStorage and session-scoped by design (`apps/web/src/lib/components/InstallPrompt.svelte:52`); it is not storage in the relevant sense and migrates nowhere.

### 2.3 Identity: three layers doing three jobs (question 3)

**Layer 1, identity: the song id.** Random, opaque, permanent, derived from nothing. Every placement, gloss, and byte hangs off it. Correcting a typo in the composer's name changes nothing, because nothing keys on text the singer can edit. This is the answer to the trap named in the brief's §6.3.

**Layer 2, recognition: the fingerprint.** Defined in §2.4. It answers one question only, "have I seen this music before?", and its answer is always a prompt, never a silent action: "This file matches *Kabalevsky, Сонет 90*. Open that song, or start a new one?" A hash may guide; only the singer decides.

**Layer 3, the name.** Auto-generated at creation from metadata, on the pattern *composer, title* ("Kabalevsky, Сонет 90"), falling back to the poem's first words, falling back to "Untitled, 16 August 2026". Editable. On collision, a numeral is appended ("(2)"). Purely for human eyes; nothing keys on it.

**Dann's three first thoughts (brief §5.1) are all adopted in substance.** The auto-generated editable name with collision numbering is layer 3, as he proposed. His "separate invisible identifier running in parallel" is adopted but split in two, because it was doing two jobs: the song id answers "which record is this," and the fingerprint answers "have I met this music," and one identifier cannot do both, since the first must never change and the second must change exactly when the music does. His "header with pointers, not repeated per note" is the record structure itself: the song record is the header, the `songId` key into `sources` is the pointer, and per-note data carries nothing about the song, which is already true of the placement map (`pairings.ts:125`, keys are bare event ids).

### 2.4 The fingerprint, precisely

SHA-256 over the ordered concatenation of `id|pitch|duration` for every event of the parsed score's `vocalLine`, rests included, using the event ids the parsers already construct positionally and deterministically: `` `m${measureIndex}-${position.numerator}-${position.denominator}` `` (`packages/score-parser/src/musicxml-parser.ts:701`, identically `packages/score-parser/src/mnx-parser.ts:899`).

Why this survives the brief's three tests:

- **A re-export of the same music from Finale** produces different bytes (so `contentHash` differs) but the same notes at the same positions, hence the same parse, hence the same fingerprint. The two parsers construct ids the same way, so even a re-export through a different format (`.musx` re-exported as MusicXML) fingerprints identically when the music is identical.
- **When the music genuinely changes**, the sequence changes, and the fingerprint stops matching, which is what the brief requires. A singer correcting one wrong note in Finale therefore produces a non-matching file, and that is fine, because recognition is not how placements survive: uploads into an open song attach to that song regardless (§2.6), and the positional event ids carry the placements across (all unchanged positions keep their keys).
- **Collision across a hundred songs**: SHA-256 over dozens of events makes accidental collision effectively impossible. Two deliberately identical excerpts would collide honestly, and the confirm-with-the-singer rule makes even that case safe.

Web Crypto's `crypto.subtle.digest('SHA-256', …)` computes both hashes; it is a platform API and weighs nothing.

### 2.5 When a save happens (question 8, unruled, my view as asked)

**Continuous, debounced, with visible failure. No Save button.** Three reasons. First, the app is already autosave-shaped: placements save on every change (`+page.svelte:177-181`), text and metadata on every edit (`:677`, `:710`), and adding a Save ritual on top of that would be a second model fighting the first. Second, a Save button reintroduces the exact failure this commission exists to kill, work lost because a ritual was skipped, and Dann's own framing was "stable and robust," not "obedient." Third, the honest cost of autosave, that a failure can pass unnoticed, is already ruled against by N.27's standing prohibition, so every save in this design reports (§4), which removes the one argument a Save button had.

Mechanics: writes debounce at roughly 800 ms and flush on `pagehide` and `visibilitychange`, so backgrounding a phone never loses the tail. The explicit acts that do exist are the deliberate ones: New song, Rename, Delete (with confirmation), Start placement over (§2.6), Export binder, and Import binder.

### 2.6 Upload semantics, and N.68's merge question answered

The rule, one sentence: **an upload never destroys placements; only the singer does, on purpose.**

- **Upload into the open song.** The file attaches to this song, replacing the stored source (the old source is gone only once the new one is durably written, in the same transaction). Then the stored `pairings` map is kept, not rebuilt: event ids present in the new score keep their pairings automatically because the keys are positional; ids no longer present are reported as a count in the drawer, joining the existing drift surface (`+page.svelte:1180`, `pairings.ts:269-273`). `firstPass` runs only when the stored map is empty and the score carries no lyrics, which preserves today's N.55a behaviour on the genuinely fresh path (`+page.svelte:1142-1152`) while ending the unconditional replacement those lines perform now. A **Start placement over** control performs the destructive rebuild explicitly, for the singer who wants exactly that.
- **Upload from a neutral state** (no open song, or the singer pressed New song). After parsing, the fingerprint is checked against `by-fingerprint`. On a match, the prompt of §2.3 layer 2. On no match, a new song is created, named per layer 3.

This is the design answer N.68 has been owed since 2026-08-14 (`docs/memory/STATE.md`, N.68 section): the merge rule is "keep by key, report the remainder, rebuild only on demand."

---

## 3. THE MIGRATION (question 4)

Runs once, at boot, when the library code is present and `meta.'library'.migratedFromLocalStorage` is unset. It follows the write-then-verify-then-remove precedent of `profileStore.ts:173-205`, hardened one step: the old keys are deleted only after the new record has been **read back** from IndexedDB and validated, because IndexedDB can fail in ways localStorage does not, and "nothing may be lost" is the brief's own words.

1. Read the six per-song keys: `ilya:inputText`, `ilya:metadata`, `ilya:metadataFromScore`, `ilya:glossOverrides`, `ilya:openSyllabification`, and `ilya:pairings` (sites: `+page.svelte:911`, `:915`, `:922`, `:947`, `:930`, and `pairings.ts:62`).
2. If all are empty or absent, set the meta flag and stop. A fresh install migrates nothing.
3. Otherwise build one song record from them. `source` is `null`: today's app never persisted the score (brief §2), so there are no bytes to migrate, and the record honestly says so. The song opens with the upload surface ready, which is exactly today's re-upload path, minus the erasure, because §2.6's merge rule is already in force.
4. Name it per §2.3 layer 3, write it in one transaction, read it back, validate, set `ilya:activeSongId`, set the meta flag.
5. Only then remove the five keys that moved (`ilya:inputText`, `ilya:metadata`, `ilya:metadataFromScore`, `ilya:glossOverrides`, `ilya:pairings`). `ilya:openSyllabification` stays as the global default for new songs (§2.2).
6. If any step fails, remove nothing, run exactly as today, and show the storage notice (§4). A failed migration is a no-op, not a loss.

**Keys that deliberately do not migrate:** the six device preferences (§2.2), which are correct where they are; `shane.profiles.v2`, the singer's voice, which is not a song and whose own move is a separate decision (its silent save at `profileStore.ts:216-224` is N.27, open, and §7 step 6 records the recommendation that it route through the new storage module's reporting seam when N.27 is built); and `ilya-ios-hint-shown`, sessionStorage by design (`InstallPrompt.svelte:52`). That accounts for all thirteen keys in the brief's §3.2: six move, six stay on purpose, one is session-scoped by design.

---

## 4. FAILURE HANDLING (question 5)

One module owns every read and write (§7 step 1). Its whole API returns outcomes, never throws to callers, and never swallows: the model is `savePairings` and `loadPairings` (`pairings.ts:372`, `:390-403`, `:408-422`), surfaced the way the drawer already surfaces them (`+page.svelte:1186-1194`). N.27's prohibition, "do not add a second silent save site while N.27 is open" (CONTRACT §6), is satisfied by construction: there is no catch in this design without a reported reason. All strings land in `apps/web/src/lib/i18n.ts` in both languages, and per CONTRACT §6 the French is shown to Dann before it ships.

Item by item, and what the singer sees:

- **Quota exceeded.** The write reports `quota-exceeded` (the detection pattern exists at `pairings.ts:397-401`). The singer sees, in the drawer notice position: *"Ilya could not save: this browser's storage is full. Your work is still on screen. Export a binder now to keep it, or free space and try again."* The Export path works from memory and does not require the database, which is what makes it a true escape hatch. Where `navigator.storage.estimate()` returns numbers, the notice shows them.
- **Eviction.** Prevention first: `navigator.storage.persist()` is requested at the first real save (never called anywhere today; searched `apps` and `packages`, zero occurrences, confirming the brief's §3.4). If `navigator.storage.persisted()` reports false, a one-time notice: *"This browser may delete Ilya's storage after a period of disuse. Export a binder to keep your songs safe."* Honesty about detection: a full eviction takes localStorage, IndexedDB, and the Cache API together, so nothing survives to detect it with, and a wiped origin is indistinguishable from a first visit. The defence is `persist()` plus the binder, not detection, and the design says so rather than pretending otherwise. Partial oddities (a live `ilya:activeSongId` pointing at an empty library) do get a plain notice naming what happened.
- **A corrupt record.** A record that fails schema validation is never overwritten and never deleted. It appears in the library list marked unreadable, and its raw record and source bytes can still be exported into a binder for salvage. *"This song could not be read. It has been left untouched. You can export it for safekeeping."*
- **A version from the future.** A record whose `schema` exceeds what the code knows, or a database whose version exceeds the code's, is opened read-never: *"This song was saved by a newer Ilya. Reload the app to update, then try again."* The service worker's version probe already gives the app an update path (`apps/web/static/sw.js`, network-first on `/_app/version.json`).
- **A half-written transaction.** Cannot exist: §2.1's one-transaction rule makes every song save atomic across `songs` and `sources`. On any abort, the previous state stands whole and the abort is reported like any failed save.
- **No storage at all** (private browsing modes that block IndexedDB). Ilya runs in memory and says so once: *"Nothing can be saved in this browsing mode. Your work will not survive closing the page. You can still export a binder."*

---

## 5. THE BINDER, the archive file (question 6)

**Format: a ZIP with the extension `.ilya`.** The precedent is `.mxl`, which the tree already reads, and the machinery is already in the tree: the reader runs on the platform's `DecompressionStream('deflate-raw')` with no dependency (`zip-reader.ts:1-11`), and a byte-honest ZIP writer, real CRC-32, real local headers, real central directory, real EOCD, already exists as the test fixture builder (`zip-fixture.ts:1-13`, currently imported only by test suites). The build promotes that builder to app code as `zip-writer.ts`. Zero dependencies, and the writer and reader are exact mirrors, which means Ilya can always read what Ilya writes.

**Layout:**

```
manifest.json                      deflated. { format: 'ilya-binder', schema: 1,
                                   appVersion, exportedAt, songs: [{ id, name, path }] }
songs/<id>/song.json               deflated. The song record, verbatim (§2.2).
songs/<id>/source/<fileName>       STORED, method 0, byte for byte.
```

Sources are stored uncompressed because the realistic formats are already ZIP containers that do not compress: gzip -9 on the measured Kabalevsky returned 145,526 bytes against 145,513 original (brief §3.5, measured 16 August). Deflating them would spend CPU to grow the file. Plain-XML MusicXML sources would compress, and the writer may deflate exactly the members whose names do not end in `.musx`, `.mxl`, or `.mscz`; that is an implementation nicety, not a format requirement, and the reader handles both methods already (`zip-reader.ts:53`).

**One format, two uses.** A binder of one song and a binder of the whole library are the same object at different sizes. Export offers both.

**Producing it.** A `Blob` and an anchor download. On a desktop this is a Downloads file; on iOS it lands in the Files app through the download sheet. No File System Access API, which Safari does not offer, and no share integration, which §8 rules out deliberately.

**Reading it back, including on a different machine and in a future version.** A file input accepting `.ilya`, routed through the existing zip reader. Import validates the manifest, then each song. Nothing in a song record is machine-specific: placements key on positional event ids derived from the file itself (§2.4), and preferences of the device stayed out of the record (§2.2). Rules on arrival:

- **Unknown song id**: imported whole.
- **Id already in the library**: the singer chooses, shown both `updatedAt` dates: keep mine, take the binder's, or keep both, where "keep both" re-ids the incoming copy and numbers its name.
- **Older schema**: migrated forward on import, the same code path future in-place migrations use.
- **Newer schema**: refused with the "newer Ilya" message of §4, and the binder is untouched, so nothing is lost by trying.

N.28 remains the door; this section is the object and the door's behaviour, as the brief's §4.5 assigns.

---

## 6. THE WEIGHT (question 7)

**Dependencies added: none.** Considered and declined, with registry numbers read this session (`https://registry.npmjs.org/idb/latest`, `.../dexie/latest`, and the bundlephobia size API):

| candidate | version | licence | min | min+gzip | verdict |
|---|---|---|---|---|---|
| `idb` | 8.0.3 | ISC | 3,695 B | 1,508 B | declined |
| `dexie` | 4.4.4 | Apache-2.0 | 95,388 B | 31,144 B | declined |

`idb` is small and honest, but the API this design needs, three stores, get, put, delete, getAll, two indices, and one multi-store transaction, is roughly 150 lines of typed promise wrapper written once in-tree. And a dependency here is not only bytes: the tree records that the lockfile cannot be regenerated from the coding sandbox and CI installs frozen (`zip-reader.ts:6-11` states this as the reason ZIP support was hand-built), so every dependency is a hand operation of Dann's. Vendoring is the house style (brief §3.6), and this is a textbook case for it. `dexie` buys schema sugar this design does not use at twenty times the price.

**Bundle growth**: the storage module, zip writer, and library-list UI, an estimated 15 to 25 KB of source, on the order of 8 KB min+gzip in the shipped bundle. That is an estimate and is marked as one; the shipped bundle's current size is NOT ESTABLISHED (no build output in the tree, and this commission was read-only, so no build was run). **Bytes added to `static/`: zero**, against the current 8.0 MB (`du -sh apps/web/static`, run this session on the tree: 8.0M, of which `denigma_wasm_mnx.wasm` is 4.4M).

**Storage, per song and per hundred, against measured file sizes** (brief §3.5, measured):

| component | bytes |
|---|---|
| source, realistic range | 65,000 to 150,000 |
| source, floor (test fixture) | 1,757 |
| pairings, ~100 notes at ~150 B serialized | ~15,000 |
| poem, metadata, glosses, record overhead | ~5,000 |
| **per song, realistic** | **~90,000 to 175,000** |
| **one hundred songs** | **~9 to 18 MB** |

A hundred-song binder is therefore a 10 to 18 MB file, comfortable for Files, AirDrop, or email. Against quota: the real quota on Dann's devices is NOT ESTABLISHED because `navigator.storage.estimate()` has never run (zero occurrences, searched this session), which is why §7 step 1 reads it and surfaces the number. Order of magnitude from general knowledge, stated as such: current browsers grant origins from hundreds of megabytes to many gigabytes, so 20 MB is small in every realistic case, and the design still treats quota failure as a first-class path (§4) rather than an impossibility.

---

## 7. THE BUILD ORDER (question 9)

Six steps, each shippable and observable alone, each ending in the project's ordinary gates, deploy, and walk. Storage logic lands in `apps/web/src/lib/library/` (new), not in `+page.svelte`, which at 74,413 bytes (`wc -c`, run this session) must shrink or hold, never grow, per the brief's §3.2 warning.

1. **The vault.** `library.ts`: open `ilya-library`, the three stores, the outcome-typed API, the migration of §3, `persist()` requested, `estimate()` read and surfaced. The app remains single-song. Observable: reload restores the working song from IndexedDB; DevTools shows `ilya-library`; the five moved keys are gone from localStorage; the quota number is visible; a fresh profile migrates nothing.
2. **The source survives.** On accepted upload, the file's bytes are written with the song (the `File` is in hand at `ScoreUploader.svelte:102` and its bytes at `ingest.ts:112`); on boot, a song with a source re-ingests it automatically. Observable: reload, and the score is simply there, no re-upload. This alone removes N.68's ordinary trigger.
3. **The merge rule.** Replace the unconditional replacement at `+page.svelte:1147-1152` with §2.6: keep by key, report the remainder, `firstPass` only into an empty map, Start placement over as the explicit rebuild. Observable with STATE.md's four-step fixture walk, expectation stated before the walk: re-uploading `no-lyrics-control.musicxml` over placed syllables no longer erases them. N.68 closes here.
4. **The library door.** The song list: open, New song, rename, delete with confirmation; auto-naming; fingerprint recognition prompt on neutral uploads. Observable: two songs, switched between, both intact across reload.
5. **The binder.** `zip-writer.ts` promoted from the fixture builder; export one and all; import with the §5 collision rules. Observable: export on the Mac, clear site data, import, everything returns; AirDrop the same binder to the iPhone and import there. This is N.28's door shipping on this object.
6. **The sweep.** Eviction notice when `persisted()` is false, corrupt-record salvage path, quota copy finalized in both languages with the French shown to Dann first, and the recorded recommendation that N.27's fix route `profileStore.saveStore` (`profileStore.ts:216-224`) through the library module's reporting seam.

Steps 1 through 3 are the emergency fixed by architecture; 4 and 5 are the filing system and the fire escape; 6 is the housekeeping. Dann's two beta blockers, N.58 and N.59, deliver scores with no lyrics into exactly the branch step 3 repairs (STATE.md, N.68 section: "N.68's merge question arrives attached to whichever of N.58 or N.59 gets built"), so this order leaves the ground ready for both.

---

## 8. THE PRESERVATION AND COPYRIGHT ANSWER (question 10)

This section is a design rationale under Canadian law, drawing on case law and statute from my general knowledge, with names and section numbers given so every claim can be checked. It is not legal advice, and if Ilya commercializes or the studio practice becomes live, a real opinion letter is the right instrument. The existence of ss. 29.22 and 29.24 in the Copyright Act, RSC 1985, c C-42, was confirmed against the Justice Canada statute site this session; the case holdings are as I know them.

**First, the non-legal answer, because Dann's question, "how do you defend reasonably the idea of preserving song and poem," is older than copyright.** A singer's marked score is the working document of the art. The pencilled breath marks, the underlay decisions, the coach's corrections: these are how performance practice is actually transmitted, and the marked scores of serious artists are archived and studied precisely because the markings are the knowledge. A tool that destroys the singer's markings on every page reload is the artistically indefensible object; a tool that preserves them is ordinary professional practice moved onto a screen. That is the affirmative case. The law then draws the boundary around it.

**The singer's local copy.** Squarely inside fair dealing for research and private study under s. 29, read with the large and liberal interpretation the Supreme Court gave those words in *CCH Canadian Ltd v Law Society of Upper Canada*, 2004 SCC 13, and *SOCAN v Bell Canada*, 2012 SCC 36. Ilya's position is exactly the photocopier's in *CCH*: a tool with substantial lawful uses, operated by the user, on materials the user lawfully holds. Ilya transmits nothing (brief §1, and the architecture keeps it so), sources nothing, offers nothing it was not handed, and makes one copy per import for the importer alone. Belt beside braces, s. 29.22, reproduction for private purposes, covers the mechanics directly: an individual reproducing a lawfully obtained copy onto a medium they own, for private purposes, no technological protection circumvented, the reproduction given to no one. A browser database on the singer's own device fits each condition.

**Holding hundreds.** The count of works does not convert the dealing. *CCH* itself protected a research library serving a whole profession, and *SOCAN v Bell* held that aggregate volume does not turn many individual fair dealings into an unfair one; the amount factor is assessed per work, per dealing. A working singer's repertoire library is a research library in the most literal sense. It also bears saying that much of this repertoire's text is public domain in Canada: Pushkin trivially, and Marshak (died 1964) entered the Canadian public domain on 1 January 2015 under the then life-plus-fifty term, which the 2022 extension to life-plus-seventy did not revive. But the design does not lean on that, because it must also be defensible for Kabalevsky (died 1987, in copyright in Canada until the end of 2057), and it is, on the fair-dealing and private-purposes grounds above.

**The export file.** A copy leaving the device changes the character of the dealing, which is why the binder's character is designed, not accidental. Two grounds. First, s. 29.24, backup copies: a person who owns a copy may reproduce it solely for backup against loss. Safari's seven-day eviction (brief §3.4) is a documented, real, indiscriminate destruction mechanism; the binder exists because the browser genuinely destroys data. It is difficult to imagine a purer backup purpose, and the design's own failure copy (§4) states that purpose in so many words. Second, moving one's own materials between one's own devices sits within the private-purposes frame of s. 29.22. The binder is produced into the user's own Files app, addressed to no one. **The moment a binder is handed to another person, that act is the person's distribution, not the tool's**, exactly as the photocopy handed over the desk was in *CCH*, and the design neither invites nor automates it: there is no share-to-a-person affordance, no recipient field, no send. The UI copy says "backup." That is the deliberate answer to the brief's observation that an export "moves the character and effect factors": the factors move, and the design moves with them, onto the backup ground the statute provides.

**The teacher with a studio, Dann's question, open since 13 August.** *Alberta (Education) v Access Copyright*, 2012 SCC 37, answers more of it than the project has assumed. A teacher who copies for learners can be inside fair dealing, because the relevant purpose is the learner's private study, the teacher acting as facilitator without ulterior motive, and "private study" does not mean solitary study. So a teacher is not a different legal object merely by being a teacher, and a teacher's own Ilya library, kept for their own preparation, study, and teaching, stands on the same ground as the singer's. What *Alberta (Education)* protected, though, was short excerpts where the alternative was not a realistic purchase. **The line the studio must not cross is stockpile-and-distribute: complete scores and complete texts, in copyright, exported and handed to students in place of the students acquiring their own.** That fails the amount, alternatives, and effect factors together, no tool design can launder it, and this design does not try. What the design does instead is make the compliant path the natural one: each student runs their own Ilya, drops in their own lawfully obtained copy, and owns their own library and binder, so the teacher never needs to distribute anything. The teacher shows a study sheet in a lesson; the student builds their own. Ilya's local-only architecture is not just a privacy stance here; it is the legal design, because the tool physically has no distribution surface to misuse.

**Two smaller points that complete the picture.** The transient parsed copies Ilya makes on open sit comfortably under s. 30.71, temporary reproductions for technological processes. And the study sheet itself, the thing Ilya actually exists to produce, is thick with the singer's own authorship, their placements, their glosses, their choices, layered through Ilya's transcription onto the text: on top of everything above, it is the least mechanical copy imaginable, which is where every factor in a fair-dealing analysis wants to land.

**Design consequences, in one place:** provenance is kept honestly (original file name, import date, byte-identical source: preservation practice and the opposite of laundering); the binder has no sharing affordance and its copy says backup; Ilya never fetches or offers content; everything stays on the device; and the compliant studio path, one library per person, is the path of least resistance. That is the reasonable defence, stated so it can be acted on.

---

## 9. NOT ESTABLISHED

NOT ESTABLISHED beats a complete invented answer.

1. **The shipped JS bundle size.** No build output in the tree, and this commission was read-only, so no build was run. The 8 KB growth figure in §6 is an estimate and says so.
2. **The real quota on Dann's Mac and iPhone.** `navigator.storage.estimate()` has never run (searched `apps` and `packages` this session, zero occurrences). §7 step 1 closes this.
3. **How long derive-on-open takes, including the denigma `.musx` to MNX conversion.** The transcription half is measured and, correcting the brief's §7.3, is already read and displayed: `transcribeMs` is passed at `+page.svelte:1052` and rendered at `apps/web/src/lib/components/Drawer/RootPanel.svelte:177`, so Dann can read it off the drawer today. The score-conversion half has no timing anywhere I found. This decides whether song-open needs a progress affordance (§2.2).
4. **Whether Safari's seven-day eviction applies to a home-screen-installed PWA.** Ilya ships a manifest and service worker (`apps/web/static/sw.js`, `manifest.webmanifest`). My general knowledge says home-screen web apps are exempt from the seven-day rule; not verified this session, and `persist()` plus the binder are the defence either way.
5. **Blob-in-IndexedDB reliability on current WebKit.** The record of historic defects is my general knowledge; the design sidesteps it with `ArrayBuffer` at no cost, so nothing hangs on it.
6. **Whether any two of Dann's real scores could share a fingerprint.** Effectively impossible by construction (§2.4), untested against his actual library.
7. **Who the beta is for.** Carried from the brief's §7.7; it bears on how early the binder (step 5) must land relative to step 4, and I sequenced the vault and the merge rule first precisely so the answer can arrive late without cost.
8. **The exact `estimate()` behaviour inside an iOS home-screen app.** Unknown to me; step 1 will simply print what it returns.

One item from the brief's NOT ESTABLISHED list is now settled in outline: **the iOS WebKit question (brief §3.4 and §7.4).** Web search this session found the EU (Digital Markets Act), Japan (order effective December 2025), and the UK (CMA ruling) forcing or having forced Apple to permit alternative browser engines, and no such mandate for Canada. On a Canadian iPhone, every browser still runs WebKit underneath, so Safari's storage behaviour reaches Dann through Chrome, as the brief asserted. Sources: [MacRumors on Japan's mandate](https://www.macrumors.com/2025/08/07/japan-non-webkit-browsers-on-iphone/), [the CMA ruling coverage](https://www.mymobiles.com/news/cma-apple-mobile-browser-investigation-ruling), [Chrome on Blink for iOS coverage](https://www.osnews.com/story/140481/chrome-ios-browser-on-blink/), and the [Justice Canada Copyright Act text](https://laws-lois.justice.gc.ca/eng/acts/c-42/section-29.22.html?wbdisable=true) for §8's section numbers.

---

## 10. WHERE I OVERRULED, AND WHY

**Against the prior N.67 document** (`claude/e45-n67-storage-architecture_2026-08-13.md`, treated per the brief's §5 as hypothesis, not doctrine; its content taken as transcribed in the brief, not re-read this session):

1. **Its IndexedDB-as-new premise**: already corrected by the brief and confirmed in the tree (`loader.ts:58-59`, `:105`). This design's contribution is the further step: do not share that database, because the loader's pinned-version open would break on any upgrade, and cache and library deserve separate lifecycles (§2.1).
2. **Its size and compression figures**: superseded by the brief's measurements, which this design builds on throughout (§5, §6), including the specific consequence N.67 could not have drawn: binder sources are STORED, not deflated, because `.musx` does not compress.
3. **Its wrapper shortlist** ("plain IndexedDB or `idb` over Dexie", read from search-result titles by its own admission): resolved with registry numbers this session, and resolved to **neither**: plain IndexedDB behind an in-tree module, because the lockfile constraint (`zip-reader.ts:6-11`) makes even a 1.5 KB dependency a hand operation, and the needed surface is 150 lines (§6).
4. **Its zip-based `.ilya` on the `.mxl` precedent, and its `persist()` recommendation**: both adopted, not overruled, and grounded: the zip on the tree's own reader and fixture-builder rather than a library, and `persist()` scheduled into step 1.

**Against the brief:**

5. **§3.2's implied migration of all thirteen keys**: partially overruled. Six keys move; six stay in localStorage on purpose as device preferences, one is sessionStorage by design; and "nothing may be lost" is honoured by write-verify-then-remove (§3). Fewer moving parts, nothing lost.
6. **§7.3, "`transcribeMs` … nobody has read it"**: the tree wins. It is read and displayed (`RootPanel.svelte:177`, wired at `+page.svelte:1052`). The substantive gap the brief pointed at, the unmeasured score-conversion time, is real and stands in §9.3.

**Against Dann's first thoughts (§5.1, offered unbound):** none overruled in substance. All three are adopted; the one refinement is splitting his single invisible identifier into two (song id and fingerprint), because permanence and music-tracking are opposite requirements and one identifier cannot satisfy both (§2.3). His header-with-pointers proposal is, structurally, exactly what shipped in §2.2.

---

*Prepared 16 August 2026 by Fable against HEAD `fd1f628` as stated by the brief (not verified by git, which this commission does not run). Tree facts were read via the mounted repository and staged copies this session; measurements quoted from the brief's §3 are marked as such; web facts carry their sources in §9; legal holdings in §8 are general knowledge, marked as such, with statute existence confirmed against the Justice Canada site this session.*
