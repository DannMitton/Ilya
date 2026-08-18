# N.67 step 4b, the library door

**Claude Code, 2026-08-18. Against `2e6118d`, branch `Shane`.**
**Brief:** `docs/sessions/brief-to-code-n67-4b_r1_2026-08-18.md`.
**Design authority:** `docs/sessions/e52-fable-save-design_r1_2026-08-16.md`, §2.1 to §2.6, §7 step 4.

**WRITTEN, not DONE.** Nothing here is done until you walk it on a real deploy.

---

## 1. What shipped

The six operations that were absent above the vault now exist: list, create,
rename, delete, switch, and recognize.

**New files:**

- `apps/web/src/lib/library/songs.ts`, 227 lines. Plain TypeScript, so every
  rule the door follows is gate-checked. Naming, ordering, row composition, and
  the six operations.
- `apps/web/src/lib/library/songs.test.ts`, 304 lines, 35 tests.
- `apps/web/src/lib/components/Drawer/SongList.svelte`, 265 lines. The door
  itself, in the drawer, adjacent to the binder row, per CONTRACT §6.

**Changed files:**

- `driver.ts`: a `PluralStore` interface (`list`, `remove`, `findByFingerprint`)
  hung off `StorageDriver` as an OPTIONAL `plural` property. The IndexedDB and
  memory drivers supply it; the legacy driver does not, because six localStorage
  keys have no room for a second song. Optional rather than required so the
  hand-rolled driver literals in `library.test.ts` and `migration.test.ts` still
  compile.
- `library.ts`: a `plural` getter, so the door reaches the store without any
  caller learning which driver it is on.
- `document.svelte.ts`: `name` is `$state` instead of `readonly`, read in the
  autosave effect and carried into `#write`. A rename now reaches the vault.
- `index.ts`: `newId` and `writeActiveSongId` exported; `backfillName` added.
  `SongRecord.name` has existed since step 0 and **nothing had ever written it**,
  so every record in every browser carries the empty string. That is repaired at
  boot, for your migrated song and for any song whose material arrived before the
  door did.
- `binder.ts`: `autoName` delegates its material half to `proposeName`, so the
  binder and the door cannot drift on what a song is called.
- `i18n.ts`: 17 new keys, both languages. The table is in §5.
- `+page.svelte`: the wiring.

**Deletes are one transaction.** `plural.remove` writes `songs` and `sources`
inside a single `writeAcross`, so a record without its bytes, or bytes nothing
can ever reach, cannot exist. Asserted in `driver.idb.test.ts` against real
IndexedDB under `fake-indexeddb`.

**The commit.** None. I do not run git. To ship:

```bash
git add apps/web/src/lib/library/songs.ts apps/web/src/lib/library/songs.test.ts apps/web/src/lib/components/Drawer/SongList.svelte
```

**Gate 4's baseline moves, and the ship script refuses until you move it.** The
web suite goes from 555 to 590 tests, because 35 new ones landed. Edit
`~/Downloads/ilya-ship.sh`:

```bash
sed -i '' 's/"555 passed (555)"/"590 passed (590)"/' ~/Downloads/ilya-ship.sh
```

All five gates are green on this tree with that one baseline changed: phonology
216, dictionary 235, web-check 0 errors and 7 warnings in 4 files, web-test 590,
score-parser 444 passed and 5 skipped.

---

## 2. The open-time measurement, and the branch

**My expectation, stated before I measured:** `.musicxml` would come in under a
second and `.musx` would not, because the denigma WASM is 4.4 MB and has to
convert to MNX before anything parses. I expected to take the
`location.reload()` branch.

**The measurement refuted it.** Both formats are far under a second, and on both
branches.

**What is bracketed:** from the score's bytes reaching the ingest path to a stave
SVG in the DOM. Format detection, the denigma conversion, the parse, the
analysis, and the notation render. App boot, JS parse, and the dictionary load
are outside it, because a `close()`/`open()` switch pays none of them. Measured
on a settled page, never at boot, so the dictionary load is not competing for the
main thread. Chromium, headed, on your Mac, 2026-08-18.

| | `.musicxml` | `.musx` |
|---|---|---|
| sources measured | 2,174 and 1,343 B | 142,732 and 145,513 B |
| cold, first of the session | 97 ms | 921 ms |
| warm, same page (what a switch pays) | **49 ms** (43 to 66, n=6) | **343 ms** (326 to 368, n=6) |
| of which ingest | 16 ms | 294 ms |
| of which render | 32 ms | 55 ms |
| fresh page, caches warm | 62 ms | 354 ms |
| vault read, record and bytes | 0.1 ms | 0.2 ms |
| `location.reload()`, navigationStart to a drawn stave | 97 ms | 448 ms |

**The branch I took: `close()` then `open()`, with a reactive document slot in
`+page.svelte`.** The reload branch costs more on the clock and additionally
throws away the tab, the drawer, the scroll position, and the loaded dictionary.
It buys nothing.

**End to end, in the finished build:** switching between two real `.musx` songs,
from pressing the song's name to a drawn stave, including changing to the Fit tab
and its 175 ms animation, measured **852 ms**. That is the honest whole-gesture
number and it is larger than the 343 ms component above, which is why both are
here.

**What could make the instrument lie, named before I trusted it:**

1. **WASM warm against cold.** The denigma module is fetched and compiled once
   per page. A boot measurement overstates what a switch costs, and a warm
   measurement understates what a reload costs. Both columns are above.
2. **`requestAnimationFrame` polling.** The render half can be up to one frame
   (about 16 ms) LATE and never early.
3. **DOM insertion is not paint.** The mark is the SVG entering the DOM, so the
   number is short by roughly a frame.
4. **The MusicXML fixtures are small**, 2,174 and 1,343 bytes, so 49 ms is a
   floor and not a realistic MusicXML. The `.musx` files are real repertoire at
   143 KB, so that column carries the weight of the decision.
5. **Chromium is not WebKit.** Safari on your Mac and on the iPhone is NOT
   ESTABLISHED (§6).
6. The machine ran nothing but the browser, and each figure is a median over
   five or six runs with its range printed.

---

## 3. `+page.svelte` line count

| | lines | bytes |
|---|---|---|
| before | 2,578 | 94,571 |
| after | **2,857** | **105,544** |
| net | **+279** | +10,973 |

**That is far over the brief's roughly thirty lines, and here is the reason.**

The brief's rule is right and I applied it as far as it goes: every rule with a
decision in it went to `songs.ts` and is tested, and the door's markup went to
`SongList.svelte`. What is left in the page is the part that cannot leave it,
because the page is the only thing that owns the document slot, the confirmation
dialog, and the arrival path. Concretely: `switchSong` and the four handlers
touch `doc`, `library`, and twelve pieces of page state at once, and moving them
behind a callback bag would buy a smaller number and no testability, because the
callbacks would still be untested.

Two things I did rather than accept the number:

- **`libraryRows` and `nameFor` moved to `songs.ts`** after I first wrote them
  inline. They are rules, so they now have tests.
- **`resetSessionState` deduplicates a list that already existed twice.**
  `handleTranscribe` and `handleClear` each held their own copy of the same seven
  assignments, and the switch would have made a third. That is a net reduction
  outside step 4b's own code.

Of the +279, 47 lines are comments inside the door block alone, and the file's
prevailing style is that dense. The measurement, the branch, and the two
orderings that cost previous builds are recorded where the code is.

**The file still grows, and it should not keep doing so.** It is now 105 KB
against the design's own warning at 74 KB.

---

## 4. What the walk found that the gates did not

I drove Chromium myself, three times, headed, on the real production build served
from `vite preview`. The seven steps of the definition of done all pass, plus the
placement half and three edge cases. **Four defects were found in the browser and
none of them by any gate.**

1. **The placeholder was English in the French drawer.** The list drew
   `Untitled, 2026-08-18` under a French UI, because `placeholderName` is built
   in plain TypeScript where the dictionary is not in hand and I had written the
   word as a literal. `songs.ts` now takes the word as an argument, the page
   passes `t('songs.untitled', language)`, and it reads `Sans titre, 2026-08-18`.
   `autoName`'s own fallback takes the same word, so an unnamed song no longer
   exports to a French singer under an English file name.
2. **The open song's row read as a text input.** The bordered box looked exactly
   like every other bordered box in that drawer, all of which are fields, and the
   rename box is literally that shape. It is now a sage rule down the left edge
   with a faint tint, plus weight, so it does not rest on colour alone.
3. **New song rendered as a bare browser button.** I gave it RootPanel's
   `.action-btn.btn-ghost` classes, and Svelte scopes styles per component, so
   none of them applied. It now carries its own rules, value for value with the
   Export and Import buttons it sits under.
4. **The dialog's focus line was firing before the buttons existed.** With
   `{#if pendingConfirm}` around the contents, `keepButtonEl` is undefined on the
   first open, so `showModal()`'s own algorithm settled on the dialog and, on
   later opens, would have reached the FIRST button, which is the destructive
   one. `askToReplace` now awaits a `tick()` before opening. Verified in the
   browser: `document.activeElement` is **Keep this song**.

**What the walk confirms:**

- One song listed under a real auto-generated name, not "Untitled".
- New song empties the poem, the metadata, the score, and the placements.
- Placements are per song. Song one at `3/4` and song two at `2/3`, switched
  between in both directions and across a reload, each counter reading exactly
  what it read before, and no drift reported.
- Rename survives a reload.
- The delete dialog is a real `:modal`, centred to within 4 px horizontally, with
  **Keep this song** last in the DOM, rightmost, and focused.
- The survivor opens, and one song remains after a reload.
- Recognition offers both answers and does what you pick, in both directions.
- On the legacy driver, with `indexedDB.open` made to throw, the door shows the
  one song it has, and New song and Delete do not render. No new string.

**One disagreement between the brief and the tree, and the tree won.** The brief's
gate 6 asks for the safe answer "visually rightmost and first in the DOM". The
tree ships the opposite and says why at `+page.svelte:1381-1384`: DOM order IS
the visual order, so a screen reader and a sighted singer are told the same
thing, and Keep is therefore LAST and rightmost, focused programmatically. That
is your ruling of 2026-08-16 after you met this dialog at half past four in the
morning. The brief quotes the superseded comment at `:1347`. I reused the shipped
dialog unchanged, so delete inherits the shipped ruling.

---

## 5. The French table

**Every word is adopted. Nothing is coined.** `chant`, `partition`, and
`placement` are ratified across `upload.*`, `binder.*`, and `replace.*`;
`Renommer`, `Supprimer`, `Enregistrer`, `Annuler`, and the
"Comment appellerons-nous" pattern are lifted verbatim from `calib.switcher.*`,
which shipped for voice profiles. A rename and delete pattern a singer has
already met should not be re-worded here.

| key | English | French |
|---|---|---|
| `songs.heading` | Songs | Chants |
| `songs.new` | New song | Nouveau chant |
| `songs.untitled` | Untitled | Sans titre |
| `songs.rename` | Rename | Renommer |
| `songs.delete` | Delete | Supprimer |
| `songs.nameLabel` | What shall we call this song? | Comment appellerons-nous ce chant ? |
| `songs.save` | Save | Enregistrer |
| `songs.cancel` | Cancel | Annuler |
| `songs.openAria` | Open %s | Ouvrir %s |
| `songs.deleteTitle` | Delete this song? | Supprimer ce chant ? |
| `songs.deleteBody` | This deletes %s from this device, with its score file and every placement it holds. Ilya cannot undo that. | Ceci supprime %s de cet appareil, avec son fichier de partition et tous les placements qu'il contient. Ilya ne peut pas annuler cette action. |
| `songs.deleteConfirm` | Delete this song | Supprimer ce chant |
| `songs.err.write` | Ilya could not change your library. Nothing has changed. | Ilya n'a pas pu modifier votre bibliothèque. Rien n'a été modifié. |
| `recognize.title` | Ilya has met this music before. | Ilya a déjà rencontré cette musique. |
| `recognize.body` | This score is the one %s was built on. You can open that song and keep the work already in it, or put this file in the song you are in. | Cette partition est celle sur laquelle %s a été construit. Vous pouvez ouvrir ce chant et conserver le travail qu'il contient déjà, ou placer ce fichier dans le chant où vous êtes. |
| `recognize.open` | Open that song | Ouvrir ce chant |
| `recognize.here` | Put it in this song | Le placer dans ce chant |

`songs.nameLabel` and `songs.deleteTitle` carry ` ` before their question
marks, matching the file's existing French spacing. The apostrophes are `’`,
matching their neighbours in `binder.*` and `replace.*`.

**Three answers reused rather than written:** `replace.keep`
("Conserver ce chant"), `binder.exportFirst` ("Exporter ce chant d'abord"), and
`replace.replace` are the delete dialog's and the import dialog's buttons. Delete
is the same act as replacing a song, so it wears the same clothes.

---

## 6. Decisions I made that the brief did not name

Say if any of these is wrong.

1. **The auto-name is generated when there is something to generate it FROM, not
   at creation.** A song made a moment ago has an empty `name`, and the list draws
   `Untitled, <its own creation date>` derived at display time and never stored.
   The design says "auto-generated at creation", but storing "Untitled" at
   creation means the record still says Untitled after you type a title, and
   CONTRACT §6 forbids storing derived data. The name is written the first time
   `proposeName` returns something, from the metadata or the poem, and is yours
   from then on.
2. **Unnamed songs created on the same day are numbered by CREATION order at
   display time**, so the numbering does not move when a song is edited and rises
   to the top of the list. Two songs YOU named the same are left alone: you said
   what you meant.
3. **Delete does not render when there is only one song left**, on the same rule
   as the legacy driver: there would be no survivor to open, and a control that
   cannot work is worse than no control. Clear text is still there for emptying
   your only song.
4. **A switch runs the pipeline** when the new song has a poem and the dictionary
   is ready. It has to: `slotQueue` comes from `lines`, so without it the
   placements come back looking like drift. This means a switch shows you more
   than a reload does, since boot still does not transcribe. Say if you want that
   asymmetry closed in either direction.
5. **Deleting the song you are in switches to the survivor FIRST.** Its document
   is still autosaving, and a delete underneath a live document would be undone
   by that document's next write.
6. **Export was generalized to any song**, so the delete dialog's
   "Export this song first" exports the row you are about to delete rather than
   whichever song happens to be open. Export now also prefers the stored name
   over a recomputed auto-name, which it had to, or a rename would be ignored by
   the file name.
7. **The door is on the Transcription tab only**, which is where the brief put
   it. The Fit tab has its own twinned binder row by your ruling of 2026-08-16
   but no song list, so switching songs while working on a score means changing
   tabs. Twinning the door would be six lines. I did not do it because you named
   one place.

---

## 7. NOT ESTABLISHED

1. **Safari, on your Mac and on the iPhone.** Every timing and every walk in this
   memo is Chromium. WebKit compiles WASM differently and Playwright's WebKit is
   not Safari, so I did not pretend otherwise by running it. Design §9.3 is closed
   for Chromium and open for WebKit.
2. **Whether 343 ms holds for a realistic plain MusicXML.** The MusicXML fixtures
   available are 2,174 and 1,343 bytes, well under the design's 65 to 150 KB
   realistic range, so the 49 ms figure is a floor. The `.musx` column is real
   repertoire and is what the branch was decided on.
3. **What a hundred songs do to the list.** Tested at three. `plural.list()` reads
   every record, which is kilobytes each by design, but `toRows` sorts the whole
   list on every render and I have not measured it at scale.
4. **Whether two of your real scores could share a fingerprint.** Carried
   unchanged from design §9.6. The recognition prompt shows only the first match;
   if two songs ever matched, the second would be invisible.
5. **The bundle cost of step 4b.** I did not measure the shipped bundle before and
   after. The build is clean and no dependency was added.
6. **Quota behaviour when the library is large.** `songs.err.write` reports every
   create, rename, and delete failure with one sentence, but I could not make a
   real quota failure happen to see it drawn.
7. **The two-tab case for the door.** `channel.ts` announces writes for the OPEN
   song. Creating or deleting a song in one tab does not refresh another tab's
   list, so a second tab shows a stale library until it reloads. Nothing is lost;
   the list is just out of date. That is new surface area step 4b introduces and
   it is not in the design.
8. **Whether `close()` leaves anything behind on the last document.** The page
   never closes the document that is open when the tab closes, which was already
   true before step 4b. `pagehide` flushes the save, so no work is lost, but the
   effect root is not stopped.
