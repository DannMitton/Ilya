# Brief to Claude Code: N.67 step 4b, the library door

**Written 2026-08-18 at the ruling desk. Paste this into a fresh Claude Code
session pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**

**Tree state at the time of writing:** HEAD `2e6118d`, working tree clean, as
reported by Dann. You do not run git. Dann runs every git command himself.

**NOT ESTABLISHED beats a complete invented answer.** Where this brief is wrong
about the tree, the tree wins. Say so in your memo and carry on.

---

## 1. The goal

Build **N.67 step 4b, the library door**: the surface that makes songs plural.
It is the last blocking piece of the save function, and it is THE ONE THING.

Design authority: `docs/sessions/e52-fable-save-design_r1_2026-08-16.md`, §2.1
to §2.6 and §7 step 4. **Read §2.3, §2.6, and §7 before you write any code.**
Everything below either quotes that design or names where it goes beyond it.

Step 4a shipped the chimera warning and Dann walked it. Step 5's single-song
export and import shipped and Dann walked that. **Export-all, multi-song
import, and the binder collision rules are step 5's remainder and are NOT in
this brief.**

## 2. What exists, verified 2026-08-18

Read by a subagent this session. Every line reference was read in the file.
Re-check any you build on; a citation re-used is a citation re-checked.

**The vault is already plural.** `LIBRARY_STORES` (`driver.ts:290-301`) defines
`songs` keyed by `id`, with a `by-updated` index and a `by-fingerprint` index.
`driver.idb.test.ts:92-98` and `:100-114` already prove two songs coexist and
that `getAllByIndex(..., 'by-fingerprint', ...)` finds a song by fingerprint.
`getAllFrom` and `getAllByIndex` exist at `idb.ts:98` and `:105`.

**Nothing above the vault is plural.** `openLibrary()` resolves exactly one
`songId` (`index.ts:157-171`). `newId()` is private and unexported
(`index.ts:56-61`). `Library` exposes `load`, `save`, and `loadSource`, all
single-song (`library.ts:239`, `:259`, `:280`). `StorageDriver` has no delete
method (`driver.ts:53-65`).

**These six operations are ABSENT and are this build:** list all songs, create a
new song, rename a song, delete a song, switch the active song, and find a song
by fingerprint from a neutral state.

**The switch blocker.** `+page.svelte:98-103` declares `opened`, `library`, and
`doc` as `const`, read once through `untrack`, with a comment at `:94-97`
saying song switching is `close()` then `open()` at step 4, not a prop change.
`SongDocument.close()` exists (`document.svelte.ts:284-290`) and nothing calls
it. The only working switch today is a pointer rewrite plus `location.reload()`
inside `commitImport` (`+page.svelte:945-962`).

**The legacy driver cannot hold two songs.** `createLegacyDriver`
(`driver.ts:238-257`) says so in its own comment. It is the no-IndexedDB
fallback.

**`SongRecord.name` exists and nothing ever writes it** (`types.ts:74-75`).

**The one native dialog in the tree** is `.replace-dialog`,
`+page.svelte:1372-1395`, opened with `showModal()` at `:718`, styled at
`:1861-1898`. It sets `margin: auto` explicitly at `:1869` to override
`app.css:88-94`, which resets `margin: 0` on `*` and drops a modal at the
viewport's top-left corner. **Every dialog you add needs that same override.**

**`+page.svelte` is 2,578 lines, 94,571 bytes** (`wc -l -c`, run 2026-08-18).

## 3. Ruled before you start

**The door lives in the drawer, not on the paper.** `CONTRACT.md` §6: the
drawer manipulates, the page displays and prints. Render the song list in
`RootPanel.svelte`, adjacent to the existing binder row at
`RootPanel.svelte:218-221`, which is where song-level operations already sit.

**`+page.svelte` does not grow beyond its wiring.** Put the door in a new
component and its logic in `apps/web/src/lib/library/`. Report the file's line
count before and after in your memo. A net growth over roughly thirty lines
needs a stated reason.

**Delete is one transaction.** Design §2.1's one-transaction rule: removing a
song removes its `songs` record and its `sources` record together, or neither.

**Auto-naming follows design §2.3 layer 3**, unchanged: *composer, title*, else
the poem's first words, else `Untitled, <ISO date>`, with `(2)` appended on
collision, editable thereafter. **Backfill the name on the existing record**,
which has never had one.

**The neutral-state prompt is design §2.6's second branch, and it does not
replace the chimera warning.** An upload into an open song still attaches to
that song and still raises the 4a warning when `arrivalDecision` says `ask`
(`library.ts:413-423`). The fingerprint lookup happens only from a neutral
state, which is what New song creates. Do not touch `arrivalDecision`.

**On the legacy driver, New song and Delete do not render.** No new string, no
apology, no explanation. The door shows the one song it has.

## 4. The switch mechanism, and the measurement that decides it

**Measure before you choose. State your expectation in the message before the
measurement, then report against it.**

Design §9.3 records that derive-on-open time is NOT ESTABLISHED, including the
denigma `.musx` to MNX conversion. Step 4b is the first thing that makes a
singer pay that cost on purpose, so close it here.

1. Instrument song open and record wall-clock time from switch to a drawn
   stave, for a `.musicxml` and for a `.musx`, on Dann's Mac.
2. **If open is under about one second, use `close()` then `open()`**, which
   means introducing a reactive document slot in `+page.svelte` in place of the
   `const doc` at `:100`.
3. **If open is slower than that, use the pointer rewrite plus
   `location.reload()`** that `commitImport` already ships at
   `+page.svelte:945-962`. It is proven, Dann has walked it, and it costs no
   architecture.

Either way, report the numbers and say which branch you took and why. **Do not
report a timing you have not controlled for**, and name what could make your
instrument lie before you trust it.

## 5. Definition of done

Five gates green through `sh ~/Downloads/ilya-ship.sh "N.67 4b: <message>"`,
plus tests for every new library operation, plus **this walk, observed by you in
a real browser on a real deploy before you hand it to Dann**:

1. Ilya opens. The drawer lists one song under a real auto-generated name.
2. Press **New song**. The poem, the metadata, the score, and the placements are
   empty. The list shows two songs.
3. Upload a different score into the new song and place one syllable.
4. Switch to the first song. Its score and its placements are exactly as left,
   and the counter reads what it read before.
5. Rename the first song. Reload. The new name is still there.
6. Delete the second song through a native confirmation dialog that is centred,
   whose safe answer is visually rightmost and first in the DOM. The survivor
   opens. Reload. One song.
7. From a neutral state, upload a file whose fingerprint matches a stored song.
   Ilya offers to open that song or start a new one, and does what you pick.

**WRITTEN is not DONE.** The item is `WRITTEN` until Dann walks it on a real
deploy. Do not mark it done yourself.

## 6. Constraints

- **You do not run git, and no agent commits, ever.** Ask Dann to run every git
  command, and **ask him to `git add` any new file before you ask him to ship**,
  because `ilya-ship.sh` refuses on untracked files.
- **Do not write French Dann has not seen.** Every new string lands in
  `i18n.ts` in both languages, and **you stop and show him the whole French
  table before it ships**, saying which words you coined and which you adopted.
  Step 4b has no French for the list, New song, rename, delete, or the
  recognition prompt. `calib.switcher.*` (`i18n.ts:354-360`) is a rename and
  delete pattern already shipped for voice profiles, and is a precedent for
  shape, not text to copy.
- **Do not store anything derived.** R8's vowel glyph is the only exception.
- **Do not change `VocalLineEvent`**, and do not rebuild anything under
  `apps/web/src/lib/shane/reconciliation/`.
- **Do not add a silent save site.** Every failure reports, per design §4.
- Do not move the storage notices out of the Fit tab. Where they belong is
  unsettled and is not yours to settle.
- Edit by anchor. Assert every anchor before you write, and refuse on anything
  but exactly one match unless you can say in advance why two.
- Runes are inert under this vitest suite. Logic goes in plain TS, not in
  `.svelte.ts`. See `docs/memory/ENVIRONMENT.md`, "Runes under vitest."
- `$state` proxies cannot be structured-cloned. Apply `$state.snapshot()` before
  any IndexedDB write.
- **Drive a real browser yourself.** Playwright is installed. Two bugs in this
  feature's history passed all five gates and were caught only in a browser.

## 7. House style

Every word you write, in a reply or in a file, follows
`docs/house-style/SKILL.md`: Google's developer documentation style guide, with
Canadian spelling and **no em dashes, ever**. Second person, active voice,
present tense, one idea per sentence, ISO dates, sentence case headings, code
font for anything a machine names. **Style never outranks accuracy.**

## 8. Return memo

Return a short memo, and write it to `docs/sessions/` so it survives:

1. What shipped, with the commit Dann made.
2. The open-time measurement, your stated expectation, and which switch branch
   you took.
3. `+page.svelte` line count before and after.
4. What the walk found that the gates did not.
5. The French table, if it has not already been shown to Dann.
6. **A section headed `NOT ESTABLISHED`**, listing everything you could not
   establish and why. **NOT ESTABLISHED beats a complete invented answer.**
