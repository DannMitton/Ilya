# THE SOCKET — addendum r1 to the SAVE design
**Fable, 16 August 2026. Addendum to `fable-save-design_r1_2026-08-16.md`, commissioned by Dann: "Confer with Fable about establishing a socket if that will help. Explore all options with reasonable research. Make sure we are building something stable and robust."**
**Read only, no git, no em-dashes, Canadian spelling. Every code claim carries a `path:line`, a command I ran, or "not established."**

---

## 0. What the socket is, in one paragraph for Dann

The SAVE design describes a filing cabinet. This addendum describes the plug on the wall it connects to, because today Ilya has no plug: the page keeps everything in its own working memory and writes to browser storage at about thirteen separate places scattered through one very large file (`apps/web/src/routes/+page.svelte`, 74,413 bytes, 2,095 lines, both measured this session with `wc`). The socket is a single, named object called the **song document** (coined here): the page hands ownership of the six per-song pieces of state to that object, reads and writes them through it, and the object alone talks to storage. Once that object exists, the filing cabinet, the two-tab problem, the archive, and every future storage change plug into it without the page changing again.

---

## 1. THE SEAM, NAMED PRECISELY (question 1)

Three layers, two of them plain TypeScript, one of them Svelte:

```
+page.svelte                          the page: renders, wires callbacks, owns nothing per-song
   │  reads and writes doc.<field>
   ▼
lib/library/document.svelte.ts        SongDocument: a rune-bearing class. OWNS the per-song
   │                                  state as $state fields. One autosave effect inside.
   │  calls save(record) / load(id), receives Outcome
   ▼
lib/library/library.ts                the facade: plain TS, no reactivity, no Svelte import.
   │                                  Assembles, validates, migrates. Returns outcomes,
   │                                  never throws to callers, never swallows (N.27 rule).
   ▼
lib/library/driver.ts                 StorageDriver interface + implementations:
                                      legacy localStorage (step 0), IndexedDB (step 1),
                                      in-memory (tests).
```

**What the module exposes.** `SongDocument` with:

- `$state` fields, exactly the six per-song pieces from the main design §2.2: `poem`, `metadata`, `fromScore`, `glosses`, `pairings`, `openSyllabification`, plus `name`, `id`, and `source` (read-only to the page).
- `saveState: 'saved' | 'saving' | { failed: reason }`, a `$state` the drawer notice renders, replacing today's `pairingsSaveError` and `pairingsLoadFailed` pair (`+page.svelte:100-101`).
- A static async factory, `SongDocument.open(id, driver)`, which **loads first and constructs second**. There is no other way to obtain an instance. §4.4 explains why this is the whole race fix.
- `flush(): Promise<Outcome>` (force the pending write now) and `close(): Promise<Outcome>` (flush, then tear down the autosave root). Song switching is `close()` then `open()`.

**What the page calls.** Property reads and writes on `doc`, nothing else. `pairings = result.map` at `+page.svelte:170` becomes `doc.pairings = result.map`; the save effect at `:177-181`, the restore block at `:966-977`, and the guard flag at `:94-99` are deleted, not moved, because the document does those jobs internally.

**Who owns what after the change.** The document owns the six per-song fields and the save lifecycle. The page keeps everything else it owns today: UI state, tab state, the ingest wiring, `ingestedScore` itself (`+page.svelte:86`), and all device preferences, which stay on their existing localStorage sites (main design §2.2). The facade owns record assembly and validation. The driver owns bytes. Nobody else may touch storage for song data; the thirteen scattered sites reduce to zero.

Constraints honoured by construction: `VocalLineEvent` untouched, `lib/shane/reconciliation/` untouched, nothing derived stored beyond R8's ruled exception (the record shape is unchanged from the main design §2.2), and `+page.svelte` shrinks (§3's numbers).

---

## 2. THE OPTIONS, COMPARED (question 2)

Research base, beyond the tree: the rune-bearing class in a `.svelte.ts` module is the documented Svelte 5 pattern for shared reactive state (the official [universal reactivity tutorial](https://svelte.dev/tutorial/svelte/universal-reactivity) and [$effect docs](https://svelte.dev/docs/svelte/$effect); community consensus in [Joy of Code's shared-state survey](https://joyofcode.xyz/how-to-share-state-in-svelte-5) and [Loopwerk's stores-to-runes refactor](https://www.loopwerk.io/articles/2025/svelte-5-stores/)); persistence wrappers built exactly this way exist as libraries ([svelte-persisted-state](https://github.com/oMaN-Rod/svelte-persisted-state), localStorage, sessionStorage, and IndexedDB backends), which I cite as evidence of practice, not as a recommendation to depend on one; the house style is to vendor (main design §6). The app is on `svelte@^5.50.1` (`apps/web/package.json`) with runes throughout (`+page.svelte:60-127`). No `.svelte.ts` file exists in the tree yet (`find src -name "*.svelte.ts"`, count 0, run this session), so whichever option wins sets the precedent.

**Option A: the `$effect` mirror**, generalizing today's `:177-181`. The page keeps all state; six effects watch six fields and write through.
- *Load*: an `onMount` restore block per field, as today (`:899-977`). *Change*: effect fires, write happens. *Song switch*: every field reassigned in place; every guard flag reset by hand. *Failure*: each effect must route its own outcome to its own notice.
- Verdict: smallest diff, worst structure. It multiplies the exact pattern that needed a written apology for its race (`:94-99`), needs one guard flag per field or one shared flag with reset discipline, and leaves `+page.svelte` owning everything. Six copies of a bug class we have one of.

**Option B: the imperative facade alone.** No reactivity anywhere in the module; the page calls `library.saveSong(assemble())` at named moments inside each mutation handler.
- *Load*: explicit call in `onMount`. *Change*: only saved if the handler remembered to call. *Song switch*: explicit, clean. *Failure*: outcome returned at the call site, must be threaded to UI from each of ~13 sites.
- Verdict: honest and dumb, and its failure mode is silence: a forgotten call site is a lost edit with no error, which is N.27's shape (`profileStore.ts:216-224`) arriving through the front door. Svelte 5 exists so that "remember to call save" is not a discipline humans must hold.

**Option C: the rune-bearing song document, over the facade. RECOMMENDED.** The class owns the per-song `$state`; one `$effect` inside an `$effect.root` (created in the factory, destroyed by `close()`) watches the instance's own fields and debounces into the facade.
- *Load*: `SongDocument.open()` reads the record, then constructs the instance from it; autosave attaches after construction. The unrestored default that today's flag guards against (`:94-99`) never exists.
- *Change*: the page mutates `doc.field`; Svelte's effect batching coalesces a burst of synchronous mutations into one run; the debounce coalesces runs into one write (§4.3).
- *Song switch*: `close()` flushes and destroys the old root; `open()` builds the new document. Two instances never share an effect, so a switch cannot cross-write.
- *Failure*: one `saveState` field, one notice site, the `savePairings` outcome pattern (`pairings.ts:390-403`) generalized to the whole song.
- Cost: it is the largest rename (§3), it puts runes in a `.svelte.ts` for the first time in this tree, and the class itself needs the Svelte compiler in tests (§5 keeps that surface thin).

**Option D: full extraction of the session document**, moving the score, ingest, and analysis state out of `+page.svelte` too.
- Verdict: the right eventual shape and the wrong first move. It restructures the upload path (`:1131-1168`) and the analysis wiring in the same change as the storage seam, which is exactly the blast radius the project cannot walk in a day. Option C is D's first slice, cut where the per-song data ends; nothing in C has to be undone to reach D later.

**The decision: C, with B inside it.** The facade of option B is not rejected; it becomes the layer under the class, where plain TS keeps the logic testable (§5). A is rejected as a bug-class multiplier, D as a blast-radius violation.

---

## 3. BLAST RADIUS, IN NUMBERS (question 3)

Counted this session with `grep -c` against `+page.svelte`:

| what | count | change |
|---|---|---|
| references to the six per-song identifiers (`inputText` 11, `metadata` 20, `pairings` 27, `glossOverrides` 16, `glossAnchors` 10, `fromScoreFields` 7) | 91 | mechanical rename to `doc.*` |
| guard and notice flags retired (`pairingsRestored` 5, `pairingsSaveError` 5, `pairingsLoadFailed` 5) | 15 | deleted, replaced by `doc.saveState` at one notice site |
| `localStorage` occurrences in the file | 40 | the ~13 per-song sites (writes `:451`, `:452`, `:604`, `:677`, `:710`, `:731`; reads `:911`, `:915`, `:922`, `:947`; pairings `:177-181`, `:966-977`) go to zero; the device-preference sites stay |
| net lines | about 60 to 80 removed from `+page.svelte`; about 200 to 250 added under `lib/library/` | the file shrinks, honouring the standing constraint |

**The upload path, answered explicitly.** Step 0 ships without restructuring `:1131-1168`. The path is textually touched, because `:1147` assigns `pairings = …` and `:1162` feeds `commitMetadataState`, and those identifiers rename like every other reference. It is not behaviourally touched: same logic, same order, same walk, and the fixture walk in `STATE.md` (five slots, `5 / 5`, rest bare) is the observable proof, expectation stated before the walk. The behavioural change to that path is step 3 of the main design and stays there.

The 91-identifier rename is high-volume, mechanical, and verifiable by `svelte-check` plus the existing gates, which makes it a textbook farm-out to a cheaper session once Dann approves the design.

---

## 4. ROBUSTNESS (question 4)

### 4.1 Two tabs on the same song

Today is silent last-write-wins: localStorage is shared, and nothing in the app listens for anything (`grep -rn "BroadcastChannel\|'storage'\|navigator.locks" src`: zero hits, run this session). The new failure surface is real but different: whole-record writes mean two tabs interleaving saves lose entire click sessions, not single keys, and they lose them silently, which is the one thing this project has a standing rule against.

**Recommendation: a `BroadcastChannel('ilya-library')`, platform API, zero bytes.** After every committed write the document posts `{ songId, updatedAt }`. A tab holding the same song reacts: if its own document has no unsaved changes, it reloads the record and the two tabs simply stay current; if it is mid-debounce with unsaved changes, it keeps the singer's work and shows one notice, *"This song was changed in another Ilya tab."* No merge machinery, no locks, no silence. Plain last-write-wins without the channel is rejected only for its silence; last-write-wins **with** the notice is exactly what I am recommending, because a singer racing themselves across two tabs is rare and the honest failure is a sentence, not a subsystem. The Web Locks API (`navigator.locks`, also zero bytes) is the named escalation if real conflicts ever show up in practice: hold a lock per song id, second tab opens read-only. Not built now; a problem smaller than the work is not a finding.

This layer lands with the IndexedDB driver in step 1, since it announces committed records.

### 4.2 A reload in the middle of a write

With the IndexedDB driver, a song save is one readwrite transaction across `songs` and `sources` (main design §2.1). A reload mid-transaction aborts it and the previous complete record stands; **a half-written song cannot exist on disk, so the next boot loads either the old song or the new one, both whole.** What can be lost is the debounce tail: edits younger than the debounce window on a hard kill. The window is bounded (§4.3), and `flush()` runs on `pagehide` and `visibilitychange`, which covers backgrounding on iOS, the realistic case. During step 0 only, the legacy driver writes the six localStorage keys sequentially and a reload can land between keys; that is precisely today's exposure (`:677` through `:731` are separate writes), transitional, and retired by step 1.

### 4.3 Cadence and coalescing

**The whole record, debounced, never a delta.** Cadence: trailing debounce of 800 ms, a maximum wait of 5 seconds so continuous activity still checkpoints, flush on `pagehide`, `visibilitychange`, and `close()`. Svelte batches synchronous mutations before effects run, so one click that touches `pairings` and `pairingCursor` produces one effect run, and the debounce folds a click burst into one write. What is written is the assembled song record, roughly 20 to 25 KB (main design §6); one IndexedDB `put` of that size is far below any human-perceptible cost, and source bytes are written only on upload, never on the autosave path, which is what the separate `sources` store exists for. A delta or oplog would buy nothing at this record size and would add a merge dimension to every failure case; rejected as complexity without a measured need.

### 4.4 The `$effect` race, made structurally impossible

Today's guard: `pairings` is born `{}`, the restore arrives later in `onMount`, and a flag (`pairingsRestored`, `+page.svelte:94-99`) stops the save effect from persisting the default over the real map in between. The comment on those lines is an accurate description of a bug class being held at bay by discipline.

The document removes the class of bug, not the instance: **an autosave effect cannot observe unrestored state because no document instance exists before its data is loaded.** `SongDocument.open()` awaits the read, constructs the instance from the record, and only then creates the `$effect.root` that autosaves. The page holds `let doc = $state<SongDocument | null>(null)` and renders the storage-backed surfaces inside `{#if doc}`. There is no flag because there is no interval in which a flag would need to be consulted; the factory's ordering is the guarantee, enforced by the type (`SongDocument | null`), not by discipline. Song switch inherits the same guarantee: `close()` destroys the old root before `open()` runs, so no effect ever reads across two songs.

---

## 5. TESTABILITY (question 5)

The house pattern is to test pure logic and keep browser APIs out of the suite: 25 test files under `src` (`find src -name "*.test.ts" | wc -l`, run this session), and `loader.test.ts` tests dictionary plumbing as pure functions without ever opening IndexedDB. The seam is cut to match:

- **The facade and drivers are plain TS.** Record assembly, validation, migration, the merge rule, and outcome mapping all run under `vitest` in node with the **in-memory driver**, no browser, no DOM. This is where every behaviour that can lose data lives, and it is all gate-checkable.
- **The IndexedDB driver** is thin (open, three stores, one transaction shape). Two honest ways to cover it, Dann's call per the dependency rule: `fake-indexeddb` (6.2.5, Apache-2.0, registry read this session), a dev-only dependency, zero bundle bytes, letting the driver run under vitest; or no new dependency, covering the driver in the existing Playwright lane (`apps/web/package.json` scripts, `test:e2e`), where a real browser provides real IndexedDB. I recommend the first, because a driver bug is a data-loss bug and deserves the fast lane, and a dev-only dependency never ships a byte; but it is a lockfile operation and therefore his.
- **The `SongDocument` class** compiles under vitest because vitest here runs through the Vite pipeline with the SvelteKit plugin (`apps/web/vite.config.ts:1-16`), which compiles `.svelte.ts` runes; `flushSync` from `svelte` forces effects synchronously in a test. The class is kept thin enough (about 100 lines: fields, factory, debounce, teardown) that the only things testable nowhere else are the factory ordering and the teardown, and those two get the rune-aware tests.

---

## 6. STEP 0 OR INSIDE STEP 1 (question 6)

**The socket is step 0, and it is a new step, not step 1's first half.** The reason is the driver seam: step 0 ships the document and facade **over a legacy localStorage driver** that reads and writes today's six keys unchanged, byte-compatible, no migration, no IndexedDB. That makes step 0 a pure refactor with an exact observable: the app behaves identically, the walk is identical, reload restores identically, and the five gates hold, while `+page.svelte` sheds its storage code. Step 1 then swaps the driver underneath a socket that is already load-bearing, which is the smallest possible surface for the riskiest change.

Revised build order (steps 2 through 6 unchanged from the main design §7):

- **Step 0, the socket.** `SongDocument`, facade, driver interface, legacy driver. Observable: behaviour identical on the fixture walk, per-song `localStorage` sites in `+page.svelte` at zero, gates at baseline.
- **Step 1, the vault.** IndexedDB driver, migration (main design §3), `persist()`, `estimate()`, and the `BroadcastChannel` layer (§4.1). Observable: as before, plus the tab-notice demonstrable with two tabs.
- Steps 2 to 6: the source survives, the merge rule, the library door, the binder, the sweep, exactly as written.

---

## 7. NOT ESTABLISHED

1. **Whether `svelte-check` and the vitest pipeline accept a `.svelte.ts` rune module in this exact toolchain without configuration work.** The versions make it expected (`svelte@^5.50.1`, SvelteKit plugin in `vite.config.ts:1-16`), and the tree has no existing `.svelte.ts` to prove it (count 0, this session). Step 0's first hour settles it; if it fails, option C degrades gracefully to the same class holding plain fields with the single autosave effect living in a tiny mounted component, and nothing else in this addendum changes.
2. **Real two-tab usage.** Whether Dann or any beta singer ever edits one song in two tabs is unknown; §4.1's design assumes rare, and Web Locks is the named escalation if that assumption fails.
3. **The debounce constants.** 800 ms and 5 s are engineering defaults, not measurements; step 1's `estimate()` work is the natural moment to log write durations and tune them.
4. **`BroadcastChannel` behaviour between a Safari tab and the installed home-screen app** on iOS (whether they share a browsing context set). My general knowledge says they share the origin's storage but may not share a channel; not verified, and nothing depends on it beyond the notice arriving.
5. **The exact final blast radius.** The 91-identifier count is measured; the net line movement (about 60 to 80 out, 200 to 250 in) is an estimate and says so.

---

*Prepared 16 August 2026 against the mounted tree and staged copies. Counts marked "run this session" were produced with `grep`, `find`, and `wc` on the tree. Web sources: the Svelte [universal reactivity tutorial](https://svelte.dev/tutorial/svelte/universal-reactivity), [$effect documentation](https://svelte.dev/docs/svelte/$effect), [Joy of Code on shared state in Svelte 5](https://joyofcode.xyz/how-to-share-state-in-svelte-5), [Loopwerk on refactoring stores to runes](https://www.loopwerk.io/articles/2025/svelte-5-stores/), and [svelte-persisted-state](https://github.com/oMaN-Rod/svelte-persisted-state) as evidence of practice; the [fake-indexeddb registry entry](https://registry.npmjs.org/fake-indexeddb/latest) for its licence.*
