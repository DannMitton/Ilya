# BRIEF TO CLAUDE CODE — N.67 step 6, the sweep

**Item:** N.67 step 6, the last of N.67. The failure-handling surface: eviction
notice, corrupt-record salvage, the finalized storage copy in both languages,
and one recorded recommendation. **Serves:** closing N.67, after which the beta
line's remainder decides when N.73 builds.
**Written:** 2026-08-18 by Fable, against the tree at `d090819`.
**Design:** `docs/sessions/e52-fable-save-design_r1_2026-08-16.md` §4 (read it
in full before you start) and §7 step 6, which scopes this step in one
sentence. Steps 1 to 5 are DONE and walked; step 5's walk record is
`docs/sessions/n67-5-dann-walk_r1_2026-08-18.md`.

Where this brief and the tree disagree, **the tree wins**, and you say so in
the memo. **NOT ESTABLISHED beats a complete invented answer.**

---

## 0. Scope, exactly four things plus one rider

1. **The eviction notice.** When `navigator.storage.persisted()` reports
   false, show `storage.evictionRisk` once. Design §4 believed `persist()` and
   `estimate()` were to be added in step 1; whether step 1 actually added them
   is NOT ESTABLISHED by this brief. **Open `lib/library/` and check before
   building.** "Once" needs a flag; where it lives (a device preference in
   localStorage is the obvious home, per design §2.2's six-preferences
   precedent) is yours to decide and state in the memo.
2. **The corrupt-record salvage path.** Design §4: a record that fails schema
   validation is never overwritten and never deleted; it appears in the song
   list marked unreadable (`song.unreadable`), and its raw record and source
   bytes can still be exported into a binder. Export is the salvage path; make
   sure export-all includes the unreadable record's bytes rather than skipping
   or throwing.
3. **The storage copy, finalized.** The ratified table in §1 below lands in
   `i18n.ts`, and every failure path §4 names speaks through it: quota
   (`storage.quotaFull`, with `storage.quotaNumbers` appended where
   `estimate()` returns numbers), no-storage mode (`storage.none`), the
   newer-schema refusal (`song.newerIlya`), and the partial-loss oddity
   (`storage.partialLoss`, the live `activeSongId` pointing at an empty
   library).
4. **The N.27 recommendation, recorded, not built.** Add a comment at the
   library module's reporting seam stating the standing recommendation: when
   N.27 is built, `profileStore.saveStore` (`profileStore.ts:216-224`, the
   catch-and-drop) routes through this seam. **Do not build N.27.**

**Rider, approved by Dann 2026-08-18:** walk finding W1 from step 5's walk.
`collide.title` gains the song's name. The revised line is in the table; wire
`%s` to the colliding song's stored name. This amends step 5's approved copy
with Dann's explicit ratification.

## 1. THE COPY. Ratified by Dann 2026-08-18, whole table, French seen first

**Ship it as written. A change to any line goes back to Dann before it enters
the tree.**

| key | en | fr |
|---|---|---|
| `storage.quotaFull` | Ilya could not save: this browser's storage is full. Your work is still on screen. Export your songs now to keep them, or free space and try again. | Ilya n'a pas pu enregistrer : le stockage de ce navigateur est plein. Votre travail est toujours à l'écran. Exportez vos chants maintenant pour les conserver, ou libérez de l'espace et réessayez. |
| `storage.quotaNumbers` | Storage: %s of %s used. | Stockage : %s utilisés sur %s. |
| `storage.evictionRisk` | This browser may delete Ilya's storage after a period of disuse. Export your songs to keep them safe. | Ce navigateur peut supprimer le stockage d'Ilya après une période d'inactivité. Exportez vos chants pour les garder en sécurité. |
| `storage.partialLoss` | Ilya's storage looks incomplete: the last open song is not in the library. If you have an exported file, import it to bring your songs back. | Le stockage d'Ilya semble incomplet : le dernier chant ouvert n'est pas dans la bibliothèque. Si vous avez un fichier exporté, importez-le pour retrouver vos chants. |
| `song.unreadable` | This song could not be read. It has been left untouched. You can still export it. | Ce chant n'a pas pu être lu. Il a été laissé intact. Vous pouvez tout de même l'exporter. |
| `song.newerIlya` | This song was saved by a newer Ilya. Reload the app to update, then try again. | Ce chant a été enregistré par une version plus récente d'Ilya. Rechargez l'application pour la mettre à jour, puis réessayez. |
| `storage.none` | Nothing can be saved in this browsing mode. Your work will not survive closing the page. You can still export your songs. | Rien ne peut être enregistré dans ce mode de navigation. Votre travail ne survivra pas à la fermeture de la page. Vous pouvez tout de même exporter vos chants. |
| `collide.title` (revision) | You already have this song: %s. | Vous avez déjà ce chant : %s. |

Notes that bind: singer-facing copy says "your songs", never "binder"
(deviation from §4's draft prose, ratified). **Every French colon carries
U+00A0 before it.** The English `storage.quotaFull` colon and `collide.title`
colon follow the tree's existing English practice; open one existing English
string with a colon and match it. The hard-space site count moves; **state the
old and new counts in the memo** (step 5's brief recorded 37).
`chant`, `bibliothèque` are ratified vocabulary; nothing here is coined.

## 2. Where the singer sees it

The drawer notice position (`+page.svelte:1186-1194` at the design's reading;
re-cite from the tree at your HEAD). **Named weakness, standing, not yours to
solve:** these notices render in the Fit drawer only, invisible from
Transcription; step 5's walk observed it biting. Do not move them; name it in
the memo if it makes a walk step ambiguous. The unreadable mark renders in the
song list row.

## 3. Definition of done. Observable, with the instrument named per item

Gates green, deployed, then the walk. **State your expectation in the message
before each measurement.** Some of these states cannot be provoked honestly on
a deploy; for each item say which instrument you used, and mark it WALKED
(real deploy, real state) or PROVOKED (a stated stub or hand-edit). A provoked
pass with a named method beats an unwalked claim.

1. **Eviction notice:** on a fresh deploy origin where `persisted()` is false,
   the notice appears once, and never again after reload. If Chrome grants
   persistence automatically, provoke by stubbing `persisted()` and say so.
2. **Corrupt record:** hand-corrupt one song record in DevTools (IndexedDB,
   edit the stored value to fail validation), reload. The song appears marked
   unreadable, opening it does not crash, nothing overwrites it, and
   export-all still carries its bytes: verify by importing the binder into a
   clean origin and finding the record present.
3. **Newer schema:** hand-raise one record's `schema` in DevTools. The
   `song.newerIlya` message shows and the record is not written to.
4. **Quota:** provoke `QuotaExceededError` (stub the write or fill the
   origin), confirm `storage.quotaFull` appears and export still works from
   memory. Where `estimate()` returns numbers, `storage.quotaNumbers` renders
   with real figures.
5. **No storage:** the honest instrument is a browser profile that blocks
   IndexedDB; if none is at hand, stub `indexedDB.open` to throw, and confirm
   Ilya runs in memory, says `storage.none` once, and export works.
6. **Partial loss:** point `ilya:activeSongId` at an id not in the library,
   reload, confirm `storage.partialLoss` and no crash.
7. **W1:** raise the collision dialog (import a binder of an existing song)
   and confirm the title names the song, in English and French.
8. **The positive control:** before building, confirm on the current code that
   a corrupt record today either vanishes, crashes, or is silently
   overwritten; if the current code already handles it, §0.2 of this brief is
   partly wrong and you say so.

## 4. Constraints

- Logic in `lib/library/`, plain TypeScript, outcome-typed, nothing thrown to
  callers, nothing swallowed. The page keeps rendering and nothing else.
  **`+page.svelte` is a standing debt that grew in step 5; report its line and
  byte count before and after, and a net growth needs a stated reason.**
- No new dependency. No `navigator.share`. Do not change `VocalLineEvent`; do
  not touch `apps/web/src/lib/shane/reconciliation/`.
- Dialog geometry is ruled: safe answer last in the DOM, focused on open.
  Nothing in this step adds a dialog; do not add one.
- **Adjacent findings that are NOT yours:** W2 (post-reload paper arrives
  blank until Transcribe), N.74 (`pendingConfirm`/`pendingArrival` close-event
  cleanup), F7 re-verification, F8 (song row reads as an input). If one makes
  a walk step ambiguous, name it in the memo and carry on.
- Do not run git and do not commit. Ask Dann to `git add` any new file before
  the ship. Gate baselines move only with Dann's permission, old and new
  numbers stated when you ask.

## 5. The memo you return

`docs/sessions/n67-6-the-sweep_r1_<date>.md`. Short. Dann reads it.

1. What ships, the commit sha, gate numbers before and after.
2. The walk, item by item, each marked WALKED or PROVOKED with the instrument
   named, expectation stated before measurement, refutations kept on the
   record.
3. Measurements: `+page.svelte` line and byte counts before and after; the
   hard-space count old and new.
4. What you could not establish. A section, not a sentence.
5. Every claim carries a `path:line`, a run, or "not established." No fourth
   form. Open the file before you cite it.
6. Anything hard-won for `docs/memory/ENVIRONMENT.md`, quoted ready to paste.

## 6. What this brief could not establish

- Whether step 1 actually shipped `persist()` and `estimate()` calls; the
  design assigned them there, and no document read tonight confirms they
  exist. Check the tree first.
- Whether Chrome auto-grants persistence on this origin (decides WALKED versus
  PROVOKED for item 1).
- Whether export-all currently throws, skips, or carries a record that fails
  validation (the positive control, §3.8, settles it).
- The tree's current hard-space census (step 5's brief said 37; step 5 shipped
  since).
- Safari, on everything, as always.
