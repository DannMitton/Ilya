# BRIEF TO CLAUDE CODE — N.67 step 5, the remainder

**Item:** N.67 step 5. Export-all, multi-song import, and the collision rules.
**Serves:** closing N.67, which is FIRST by Dann's ruling of 2026-08-16. Step 6,
the sweep, comes after it.
**Written:** 2026-08-18, against HEAD `ed8318e`, tree clean.
**Design:** `docs/sessions/e52-fable-save-design_r1_2026-08-16.md`, §5 and §7
step 5. Read §5 in full before you start.

---

## 0. Read this first, because it makes the work smaller

**The binder READER is already plural.** `binder.ts:190-225` loops
`manifest.songs` and returns `BinderSong[]`. It reads a two-song binder today.
Nothing in `readBinder` needs to change.

**The single-song assumption is one line.** `+page.svelte:1017` takes
`read.songs[0]` and drops every other song on the floor, silently.

This is the same shape as N.67 step 4b, where the vault had been plural since
step 1 and every one-song assumption lived in the application layer. Verify both
claims by opening the files before you build on them. Where this brief and the
tree disagree, **the tree wins**, and say so in the memo.

---

## 1. Dann's ruling, 2026-08-18, which sets the shape

**An import ADDS songs to the library. It never touches the song you are in.**

The consequence is that the open-song warning is retired. `handleImportFile`
(`+page.svelte:1019-1027`) currently runs `songHasWork()` and, when the open
song has content, offers Replace, Export first, or Keep. That existed because
there was only ever one song to destroy. Songs are plural since `cb7a15a`.

**Delete that branch, and retire `import.title` and `import.body` from
`i18n.ts:620-621`.** The only prompt an import raises is the id collision of
§2.

Named consequence, accepted: a singer who re-imports a binder of the song they
are working in still gets asked, because that is an id collision. That is the
one moment the question is worth asking.

---

## 2. The collision rules. Design §5, and the gap they fill

`commitImport` (`+page.svelte:1035-1049`) calls `library.save` on the incoming
record and reloads. **It never checks whether that id is already in the vault.**
Design §5's three answers do not exist anywhere in the tree. That is the defect
this step closes, and it is the reason step 5 cannot ship without it: a silent
overwrite of a song that shares an id is exactly the class of loss N.67 exists
to end.

Per incoming song, in manifest order:

| condition | behaviour |
|---|---|
| id not in the library | imported whole, no prompt |
| id already in the library | ask, showing both `updatedAt` dates |
| `manifest.schema > BINDER_SCHEMA` | already refused whole-file at `binder.ts:186`. Unchanged |

The three answers, in DOM order, **safe answer last**, which is this project's
ruled dialog geometry:

1. **Take the one in this file.** Destructive. Overwrites the stored record and
   its source bytes.
2. **Keep both.** Re-ids the incoming copy and numbers its name.
3. **Keep mine.** Safe, last in the DOM, focused on open. Skips this song.

### Two traps in "keep both", both of which will pass a gate if you miss them

**The id lives in two places.** Re-iding the record is not enough:
`SourceBytes.songId` (`binder.ts:213`) also carries it, and a source whose
`songId` still names the old song will attach to the wrong record. Set both.

**The name numbering already exists. Do not write a second one.**
`uniqueName(base, taken)` at `songs.ts:65` is the design §2.3 collision rule,
already tested. `taken` is the set of names currently in the library. Use it.
`newId()` is exported from `library/index.ts:61`.

### The trap in detecting the collision at all

**`library.load(id)` cannot tell you whether a song exists.** A load of an
absent id yields an empty record rather than an error, on purpose
(`library/index.ts:164-166`). A collision check written on `load` would report
"no collision" for every song in the binder and overwrite them all.

Check against the ids returned by `listSongs(library.plural)`
(`songs.ts:155`). One read, and it carries the `updatedAt` the dialog needs.

---

## 3. Export all

Design §5: "One format, two uses. A binder of one song and a binder of the
whole library are the same object at different sizes. Export offers both."

`buildBinder` (`binder.ts:110-133`) takes one record and writes a one-entry
manifest. **Change `BuildBinderInput` to take an array** of
`{ record, source, name }`, and build one manifest entry and one
`songs/<id>/` group per element. The single-song call site passes an array of
one. `binder.test.ts` moves with it; that is a named cost, not a surprise.

**The open song comes from the document, every other song from the vault.**
`handleExport` already does this correctly at `+page.svelte:961-968`, because
the document holds edits the vault has not seen. Export-all must keep that rule
for whichever song is open.

**The binder's file name for an export-all is not a song's name.** Decide it,
state what you chose in the memo, and route it through `binderFileName`
(`binder.ts:71`) so the filesystem rules still apply.

**Weight, from design §6, so it is not a surprise:** a hundred songs is 9 to
18 MB and every byte is held in memory while the ZIP is built. That is an
estimate carried from the design, not a measurement. **Measure the real figure
for the binder you build in the walk and put it in the memo.**

**UI:** a third control in `shane-binder-row`. There are two such rows, twinned
by Dann's ruling of 2026-08-16, at `+page.svelte:1888-1893` and in the
Transcription drawer. Both change, or neither.

My recommendation, which is yours to overrule with a reason: **show Export all
songs only when the library holds more than one song.** With one song it says
the same thing as the button beside it.

---

## 4. What the reload rule becomes

`commitImport` currently ends in `location.reload()`. With N songs that is
wrong N times over.

**Reload only when a collision was resolved as "take the one in this file" for
the id that is currently open.** In that one case the live document has been
replaced underneath, and the existing comment at `+page.svelte:1030-1034` gives
the reason a reload is the honest answer.

**In every other case, do not reload and do not move the pointer.** Refresh the
song list. This follows from Dann's ruling: an import adds, so the singer stays
where they were.

---

## 5. The copy

**`import.title` and `import.body` are retired.** New strings. **The whole
table, English and French, was shown to Dann and APPROVED BY HIM 2026-08-18,
before any of it was written into the tree.** Ship it as written. A change to
any line is a change to approved copy and goes back to him first.

| key | en | fr |
|---|---|---|
| `binder.exportAll` | Export all songs | Exporter tous les chants |
| `collide.title` | You already have this song. | Vous avez déjà ce chant. |
| `collide.body` | The song in this file has the same identity as one you already have. Yours was last changed %s. The one in this file was last changed %s. Ilya cannot undo taking the one in this file. | Le chant de ce fichier a la même identité qu'un chant que vous avez déjà. Le vôtre a été modifié pour la dernière fois le %s. Celui de ce fichier a été modifié pour la dernière fois le %s. Ilya ne peut pas annuler le remplacement. |
| `collide.take` | Take the one in this file | Prendre celui de ce fichier |
| `collide.both` | Keep both | Conserver les deux |
| `collide.mine` | Keep mine | Conserver le mien |
| `binder.importedOne` | One song was added. | Un chant a été ajouté. |
| `binder.importedMany` | %s songs were added. | %s chants ont été ajoutés. |

**Nothing is coined.** `chant`, `partition`, `placement`, and `bibliothèque`
are all already ratified in `i18n.ts`; `bibliothèque` is at `songs.err.write`
(`i18n.ts:673`). Every other word is ordinary French.

**No new hard-space site.** No string here carries a colon, a question mark, or
an exclamation mark, so the count of U+00A0 sites stays at its current 37.

**Dates are ISO, `YYYY-MM-DD`.** `updatedAt.slice(0, 10)`, which is the
precedent `placeholderName` already sets at `songs.ts:55`. It reads the same in
both languages and cannot be misread as a different day.

**Two keys rather than a plural system.** `i18n.ts` has no plural mechanism and
this step must not invent one. Pick on `n === 1`. That is correct in French,
and correct in English except at zero, which cannot occur because a binder with
no songs is refused as `no-songs` at `binder.ts:187`.

**Named weakness, not yours to solve.** `binderError` and these notices render
in the FIT drawer only, so a singer working in Transcription never sees them.
`STATE.md` marks where the storage notices belong as STILL UNSETTLED and not
settleable alone. **Do not move them. Name it in the memo if the walk makes it
bite.**

---

## 6. Definition of done. Observable, in a real browser, or it is WRITTEN and not DONE

Gates green, deployed, and then this walk, with **your expectation stated in
the message before each measurement**:

1. Two songs in the library, both with placements. Export all songs. **One
   file, and you state its byte count.**
2. Clear site data. Import that one file. **Both songs return, with their
   scores, their names, and their placements.** Open each and count the
   placements against what you recorded in step 1.
3. With both songs present, import the same file again. **The collision dialog
   opens once per song, showing two ISO dates, with Keep mine last and
   focused.**
4. Answer **Keep mine**. Nothing changes. Answer **Take the one in this file**
   on a song you are not in. That song updates and **you are not moved**.
5. Answer **Keep both**. A third song appears, its name numbered, its score and
   placements intact and independent of the original.
6. Import a binder whose only song is the one you are in, and answer **Take the
   one in this file**. This is the only path that reloads.
7. **The retirement is observable too:** with a song full of work open, import a
   binder of a song you do not have. **No warning appears, and your open song is
   untouched.**

**Positive control, because a negative result proves nothing without one.**
Before you build the collision check, confirm on the current code that a
re-import of an existing song overwrites it silently. If it does not, this
brief's §2 is wrong and you say so.

**The dialog's geometry is a walk item, not an inference.** Read where it lands,
not only what it says. `app.css:88-94` resets `margin: 0` on every element and
overrides the user agent's `dialog { margin: auto }`, which is what centres a
modal. That defect shipped once already and was found only by measuring the
dialog's position.

---

## 7. Constraints

- **`+page.svelte` is 2,857 lines and 105,544 bytes, and `STATE.md` records it
  as a standing debt with the instruction that the next thing to touch it should
  shrink it.** This is that thing. **Import, export, and collision logic go in
  `lib/library/`, in plain TypeScript**, where they are gate-checked in node and
  where runes are inert. The page keeps the dialog, the anchor, and the file
  input, and nothing else. **Report the file's line and byte count before and
  after. A net growth needs a stated reason.**
- **Nothing in `lib/library/` throws to a caller and nothing swallows.** That is
  `library.ts`'s contract and N.27's prohibition kept by construction.
- **No new dependency.** The writer and reader are hand-built for a stated
  reason (`zip-writer.ts:1-18`).
- **No sharing affordance, and no `navigator.share`.** `binder.ts:14-19` states
  why in full. Read it. Adding one is a change to the legal character of the
  product, not a feature.
- **Do not change `VocalLineEvent`.** Do not touch
  `apps/web/src/lib/shane/reconciliation/`.
- **Do not run git and do not commit.** Ask Dann to `git add` any new file
  before you ask him to ship. The ship script refuses on untracked files.
- **Gate baselines move only with Dann's permission**, and you say the old and
  new numbers when you ask.
- **A stale comment at `+page.svelte:1612-1613` contradicts `:1646-1649` on the
  dialog's DOM order.** You are touching that file. Repair the comment.
- **Two known open defects live in the files you are touching, and NEITHER IS
  YOURS.** The Fable GUI session of 2026-08-18 logged them as non-blocking
  one-looks (`docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md`,
  findings F7 and F8): auto-naming produced the song name `Я` from the poem
  `Я вас любил:...`, and a song row in the list still reads as a text input.
  **Do not fix them and do not let them enlarge this step.** If either one
  makes a walk step ambiguous, say so in the memo and carry on.

---

## 8. The memo you return

`docs/sessions/n67-5-the-binder_r1_2026-08-18.md`. Short. Dann reads it.

1. **What ships**, with the commit sha, and the gate numbers before and after.
2. **The walk**, step by step, each with the expectation you stated before you
   measured and what actually happened. **A refuted expectation is worth more
   than a met one. Keep it on the record.**
3. **Measurements**, named: the export-all byte count, the import wall-clock,
   and `+page.svelte`'s line and byte count before and after.
4. **What you could not establish.** A section, not a sentence.
   **NOT ESTABLISHED beats a complete invented answer.**
5. **Every claim carries a `path:line`, a run, or "not established." There is no
   fourth form.** Open the file before you cite it. A memo's substance can be
   right while its citations are wrong: that happened on the 4b memo, which
   cited two lines that were a tab handler and a metadata function.
6. **Anything hard-won that belongs in `docs/memory/ENVIRONMENT.md`**, quoted
   ready to paste.

---

## 9. What this brief could not establish

- **Whether `binder.test.ts` covers a two-song binder read.** The file is 245
  lines and was not opened this session. `readBinder`'s plural loop was read in
  full; its test coverage was not.
- **Safari, on every measurement here.** Every number this project holds for
  the switch and the vault is Chromium. Design §9.3 is closed for Chromium only.
- **The real weight of a large binder.** 9 to 18 MB for a hundred songs is the
  design's estimate, carried forward and never measured.
- **Whether an import notice in the Fit drawer is seen at all** by a singer
  working in Transcription. Named, deliberately not solved.
