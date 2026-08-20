# Brief to Code: N.73 S2, one Studio drawer

**Item: N.73 S2. Serves N.64.** Floor `81438d4`, clean, read this session by the
coordinating desk. Source: `claude/e44-fable-ruling-studio-architecture_2026-08-13.md`
§PLAN S2, narrowed 2026-08-20 for the reasons in §6.

**One job: the drawer stops swapping when the pair flips.** Everything here is
deletion, relocation, and gating. No new logic, no new strings, no new
components.

**Re-derive every line number before you edit.** The numbers below were read at
`81438d4` and are pointers, not anchors. Where the tree disagrees with this
brief, the tree wins and you say so in the memo.

---

## 1. What the tree holds now

Two drawer panels, mutually exclusive:

- `rootPanel` (`+page.svelte`, the snippet at `:1805-1864`) renders
  `RootPanel.svelte` on `activeTab === 'transcription'`.
- `shanePanel` (`+page.svelte`, the snippet at `:1865-2050`) renders on
  `activeTab === 'shane'`.

`Drawer.svelte:150` and `:409` are the two render sites.

`shanePanel` holds, in order: a second `MetadataFields` with the arranger
provenance line, `ScoreUploader`, the `noLyricsFile` notice, `SyllableStation`,
`ShiftLyricsControl`, the binder and salvage notices (`binderError`,
`binderNotice`, `orphanedCount`, `slotQueue`, `doc.remoteChange`), a twinned
song-row block, a second Print button, and `CalibrationWizard`.

`ENVIRONMENT.md` §TWO DRAWERS records the consequence as a real defect: a singer
who never opens the marked score never sees a storage notice. This step closes
that defect as a side effect, which is the strongest argument for the shape
below.

## 2. The shape: render both, gate inside

**Do not fold `shanePanel`'s markup into `RootPanel.svelte`.** That would push
roughly twenty new props through a component that already carries about twenty,
and a failed walk would not tell Dann which half broke.

Instead: render `rootPanel` and `shanePanel` **both, always, in that order**,
whenever the destination is Transcription or Marked score. `Drawer.svelte`'s
`{#if activeTab === 'transcription'}` / `{:else if activeTab === 'shane'}` pair
becomes one branch that renders both snippets. Learn and Guide are untouched.

The two panels then read as one continuous drawer. Their internal `{#if}`
guards already suppress most score-only content when no score is loaded; leave
those guards alone unless one is missing.

## 3. The four deletions

### 3.1 The second `MetadataFields`

`shanePanel`'s instance (`+page.svelte:1873-1879`) carries two props the
surviving one does not: `fromScore={doc.fromScoreFields}` and `onrevert=…`.

- Delete `shanePanel`'s instance.
- Carry both props into `RootPanel.svelte`'s instance (`:147`), threading them
  through `RootPanel`'s props from `+page.svelte`.
- Move the `{#if arrangerProvenance}` block with it, keeping it directly beneath
  the metadata block. It is never a drawer field (Q4 provenance, Kimi §A.28).

**Do not drop `onrevert`.** Losing revert-to-score-header is the one silent
regression this step can cause.

### 3.2 The second Print button

Both call the same bare `window.print()` (`handlePrint`, `+page.svelte:541-542`).
They differ only in their guard:

- `RootPanel.svelte:195-201`: `disabled={!hasResults}`.
- `shanePanel` (`+page.svelte:2002-2008`, `.shane-print-btn`):
  `disabled={!ingestedScore && Object.keys(shaneFormants).length === 0}`.

Delete `shanePanel`'s button and its `.shane-button-row` wrapper. The survivor's
guard becomes **keyed on the visible document**: the transcription's guard when
the pair shows the transcription, the score's guard when it shows the marked
score. Reuse both existing expressions verbatim. **This preserves both
behaviours exactly and invents none.**

`ENVIRONMENT.md` §The two Print buttons: a desktop cannot falsify a mobile print
bug, and `RootPanel`'s button is the better test because pressing it from inside
the drawer exercises `app.css:201`'s `.drawer { display: none }`. Keep that
property.

### 3.3 The twinned song rows

`RootPanel` holds the song list. `shanePanel` holds a twinned binder row, built
2026-08-16 so the controls did not move when a singer changed tabs. **One
drawer removes its whole reason to exist.** Delete `shanePanel`'s copy; keep
`RootPanel`'s.

### 3.4 `ScoreUploader` moves into Source

Move `ScoreUploader` (`+page.svelte:1898`) and the `{#if noLyricsFile}` notice
that follows it so they sit **directly under the textarea**, beside the wired
scanner, inside `RootPanel`. Text intake and score intake become one Source
region. Keep the `{#if INCLUDE_SHANE}` gate around the score half.

## 4. Order in the merged drawer

Provisional, not a station ruling. S3 rules the stations.

1. Dictionary status (`RootPanel`, unchanged)
2. Song Setup: the one `MetadataFields`, then arranger provenance
3. Source: textarea and OCR overlay, then `ScoreUploader`, then `noLyricsFile`
4. Transcribe and Clear (`RootPanel`, unchanged)
5. Score work: `SyllableStation`, then `ShiftLyricsControl`
6. Notices: `binderError`, `binderNotice`, `orphanedCount`, `slotQueue`,
   `doc.remoteChange`
7. Analysis: the Inspector region (`RootPanel`, unchanged)
8. Voice: `CalibrationWizard`
9. Output: the one Print button, export and import, the song rows

## 5. NOTATION

`Drawer.svelte:418` gates the NOTATION anchor on `transcription || shane`.
That condition is now always true inside Studio. Leave the anchor where it is.
`NotationFields.svelte:43` says its accent follows `activeTab`; under one drawer
that accent no longer has a tab to follow on a merged panel. **Leave the accent
alone and name it in the memo.** It is S3's to settle, not yours.

## 6. What is deliberately NOT in S2

**The `TabId` split into destination plus document, and the `ilya:activeTab`
migration.** `lib/destinations.ts:11` says the migration is S2's. The
coordinating desk moved it to S3 on 2026-08-20, and the reason is recorded here
so nothing is lost: the ids stay `transcription` and `shane`, a browser that
saved either still lands where it did, and the singer sees no difference. The
refactor touches `HeaderBar`, `DeskHead`, `Drawer`, and the wall, and folding it
into this ship would make a failed walk ambiguous.

**Update the comment in `lib/destinations.ts` to say S3, citing this brief.**

## 7. What you do not do

- **Do not run `git`.** Dann ships. No agent commits, ever.
- Do not build the anchors, the stations, or the calibration takeover. That is
  S3 and S4.
- Do not put a control on the paper. Drawer manipulates; page displays and prints.
- Do not change `VocalLineEvent`, and do not touch
  `apps/web/src/lib/shane/reconciliation/`.
- Do not add a second silent save site while N.27 is open.
- **Do not coin French.** Every string you need already exists. If one does not,
  stop and say so in the memo rather than invent one.
- Do not add a third touch-geometry exemption.
- **Read the tree before you edit.** `+page.svelte` carries rules of the form
  `.main-content.tab-X :global(...)` that outrank a component's own by two
  classes; that beat four briefs in one evening on 2026-08-19
  (`ENVIRONMENT.md` §CSS SPECIFICITY).
- **NOT ESTABLISHED beats a complete invented answer.**

## 8. Definition of done

Your own walk in a real browser first, then Dann's on the deploy.

1. Open the drawer on Transcription, flip the pair to Marked score. **Nothing in
   the drawer appears, disappears, or moves.** The page changes; the drawer does
   not.
2. Edit the title once. It shows on both documents.
3. There is exactly one Print button. On the transcription it is disabled until
   you transcribe; on the marked score it is disabled until a score is ingested
   or a formant exists.
4. There is exactly one song list and one binder row.
5. A storage notice is visible without leaving the transcription.
6. Revert-to-score-header still works after a score with a work header arrives.
7. A browser that had saved `shane` still lands on the marked score.

Item 1 is the step. If it does not hold, the step did not ship.

## 9. Gates

Run all five yourself and report the numbers. Baselines, from
`docs/memory/ENVIRONMENT.md` §Gate baselines:

| gate | baseline |
|---|---|
| phonology | 216 |
| dictionary | 235 |
| web-check | 0 errors, 7 warnings, 4 files |
| web-test | 682 |
| score-parser | 444 passed, 5 skipped |

If web-test moves, **tell Dann the new number and get his permission before the
ship script runs**, not after. Follow any baseline `sed` on
`~/Downloads/ilya-ship.sh` with `chmod +x ~/Downloads/ilya-ship.sh`; macOS
`sed -i ''` drops the execute bit.

`autofocus` raises `a11y_autofocus` and moves web-check to 8 warnings. Do not
introduce one.

Ship with:

`sh ~/Downloads/ilya-ship.sh "N.73 S2: one Studio drawer"`

The script refuses on untracked files anywhere in the repository. **Ask Dann to
`git add` this brief and your memo before he ships.**

## 10. The memo

`docs/sessions/n73-s2_r1_2026-08-20.md`, same commit. Short. Five things:

1. What shipped.
2. **Where the tree beat this brief.** Every stale pointer, named.
3. The five gate numbers.
4. What you could not establish.
5. What Dann must walk, as a numbered list he can follow on his phone.
