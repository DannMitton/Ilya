# Ship A: the older-Finale disclosure goes, and the voice anchor's rule goes lavender

**Serves N.65. Built by Code, 2026-08-20. `WRITTEN`, not `DONE`: Dann has not
walked it on a deploy.**

Brief: `docs/sessions/brief-to-code-retraction_r1_2026-08-20.md`, read in full
this session. **Ship B is not started and nothing here touches it.**

Read in full this session: `docs/memory/CONTRACT.md` including tethers 17 and
18, `docs/memory/STATE.md`'s entry THE DRAWER'S STATIONS,
`docs/sessions/brief-to-code-retraction_r1_2026-08-20.md`.
**Not read, and deliberately so:** `brief-to-code-drawer-stations_r1_2026-08-20.md`
§4, which the new brief supersedes.

**The memo is its own file per the brief's naming.**

---

## 1. What shipped

### The disclosure

`ScoreUploader.svelte:677-691` is now a comment where the block was. Deleted:
the `.mus-help` div, the `.mus-trigger` button, the `.mus-chevron` span, the
`.mus-body` div, its five paragraphs, the `musHelpOpen` rune, and six style
rules at `:975`.

### The six i18n keys, and what the check found

**Every one had exactly one consumer, and it was this block.** Checked by
grepping `upload.mus` across `apps/web/src/` before deleting: the only hits were
the six declarations in `i18n.ts` and the six call sites in the block itself.
No test, no end-to-end spec, and no other component referenced any of them.

Deleted: `upload.mus.trigger`, `upload.mus.intro`, `upload.mus.opt1`,
`upload.mus.opt2`, `upload.mus.opt3`, `upload.mus.trial`.

**`upload.err.mus` is NOT deleted** and sits at `i18n.ts:377`.

### The lavender rule

`Drawer.svelte:844`, inside `.drawer-anchor-bottom` at `:823`:
`border-top: 2px solid var(--deeper-lavender)`. It was `var(--sage)`.

---

## 2. The measurements the done-list asks for

### Done 1. No older-Finale disclosure anywhere in the drawer

Measured in the running drawer: `.mus-help` absent, `.mus-trigger` absent.
Grepped afterwards for `upload.mus`, `musHelpOpen`, `mus-help`, `mus-trigger`,
`mus-chevron`, `mus-body`, and `mus-trial` across `apps/web/src/`: **the only
match is the comment that records the deletion.**

### Done 2. The two gaps, and they do not match

| gap | before | after |
|---|---|---|
| textarea to `Clear text` / `Transcribe` | 6.00 px | **6.00 px** |
| score box to `Print` / `Export` / `Import` | 63.30 px | **20.00 px** |

**The deletion closed 43.3 px of the 57.3 px difference and could not close the
rest.** The residue is 20 px against 6 px, and I did not force it.

**Stated before the measurement, and it held:** the two are structurally
different quantities. The textarea's 6 px is `.station-body`'s flex gap between
two siblings inside one station. The score box's 20 px crosses a station
boundary, and it decomposes as **8 px** of `.dz-wrap`'s own `margin-bottom`
(`ScoreUploader.svelte:766`) plus **12 px** from the uploader's bottom to the
Output section's top.

**That 12 px is Dann's own ruled recipe and must not be tuned here.** He ruled
it on his walk of `f59f7d2`: "6px above the label, 12px below the body", and the
recipe's own comment in `RootPanel.svelte` says the asymmetry is the point.
Equalizing the two gaps by changing that number would move every station in the
drawer.

**THE BRIEF ITSELF NOW SETTLES THIS, AND IT IS SHIP B'S.** §B.6 was rewritten
after this build began and carries Dann's ruling: *"I do not think we need an
Output section articulated. What I want is the appearance that the
Print/Export/Import row shares the same relationship to the score field as the
Clear text/Transcribe row does to the text field above it."* The row moves
**into SOURCE** in ship B, at which point both gaps become the same
within-station flex gap and match by construction. **It cannot be made to match
in ship A without pre-building that move, so it was not.**

**The one lever inside ship A's scope, named and not pulled:** `.dz-wrap`'s
8 px `margin-bottom`, whose own comment says it exists to mirror "the room
beneath the Transcription textarea before the next control." It mirrors 6 px
with 8 px. Deleting it would give 12 px instead of 20 px. **Left alone, because
ship B dissolves the question and pulling it now would be a spacing decision
Dann rules by looking.**

### Done 3. The `.mus` path is intact end to end

Verified by reading the whole path rather than the last step:

- `format-detection.ts:169` returns `{ ok: false, failure: { kind: 'pre-2014-finale' } }` for `ext === 'mus'`.
- `ScoreUploader.svelte:419-420` renders `T('upload.err.mus')` for that kind.
- `i18n.ts:377` holds the string in both languages, unchanged.

**Its two tests still pass inside gate 4:** `format-detection.test.ts:70` and
`ingest.test.ts:346`. **NOT ESTABLISHED by a real file drop**, because that
needs a `.mus` fixture and the drawer's file input; the path is verified by
reading and by its tests.

### Done 4. Both rules measure identically

| rule | computed |
|---|---|
| above the voice anchor, `.drawer-anchor-bottom` | `2px solid rgb(142, 126, 155)` |
| above SHIFT LYRICS, `.shift-lyrics` | `2px solid rgb(142, 126, 155)` |

**A string comparison of the two computed values returns true.**

**The token is `--deeper-lavender` `#8E7E9B`**, the same one `ShiftLyricsControl`
took in the last pass. **No second lavender entered.** `--surround-marked` is
this hue at 60 percent toward white, a desk tint, and it is not this.

### Done 5. Every other station rule is still sage

Read off the running drawer. Sage is `rgb(139, 154, 125)`.

| element | label | rule |
|---|---|---|
| `.drawer-anchor-top` | Metadata | bottom 2px **sage** |
| `.section.cosmetic-section` | Notation | top 2px **sage** |
| `.section.song-section` | Repertoire | top 2px **sage** |
| `.section.console-section` | Analysis | top 2px **sage** |
| `.takeover-head` | (none) | bottom 2px **sage** |
| `.shift-lyrics` | Shift Lyrics | top 2px lavender, from the last pass |
| `.drawer-anchor-bottom` | (none) | top 2px **lavender, this ship** |

Three sections draw no rule of their own and did not change: `.section` for
Metadata, `.source-section`, and `.output-section`. The first two are first
under an anchor's own boundary; `.output-section`'s was deleted on Dann's
ruling in the previous pass.

**`CalibrationWizard.svelte:1713` also draws `2px solid var(--deeper-lavender)`
and predates this ship.** It is a calibration surface rather than a drawer
station rule, so it is named here rather than counted in the table.

### Done 6. The five gates

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | **216 passed (216)** |
| dictionary | 235 passed (235) | **235 passed (235)** |
| web-check | 0 errors and 7 warnings in 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 passed (682) | **682 passed (682)** |
| score-parser | 444 passed, 5 skipped (449) | **444 passed, 5 skipped (449)** |

**Nothing moved, so no permission was needed.**

---

## 3. Where the tree disagreed with the brief

**One place, and it is done 2.** The brief says the Output row "then sits
against the score box the way Clear and Transcribe sit against the textarea,
which is the point," as though the deletion alone produced it. **The tree says
otherwise and the tree wins:** the deletion accounts for 43.3 px of the
difference, and the remaining 14 px is a station boundary plus a stale 8 px
margin, neither of which the deletion touches. The brief's own §B.6, rewritten
since, is where it closes.

**Nothing else disagreed.** The `.mus-help` block, the `musHelpOpen` rune, the
six keys, and the sage rule above the voice anchor were all exactly where the
brief said, in the counts the brief implied.

---

## 4. Decisions this brief did not rule, stated as decisions

1. **`.dz-wrap`'s 8 px margin stays.** Named in done 2. Reversible in one line.
2. **The trial-version sentence went with the block rather than being
   rehoused.** The brief names it as the one line with no other home and does
   not say to keep it. Rehousing it would have meant choosing a new home and a
   new treatment, which is a copy decision and Dann writes copy.
3. **`.mus-help` carried the drop zone's only `border-top: 1px solid
   var(--stone-300)`.** That line is gone with it. It was a divider with no
   semantic function, which is the class Dann's ruling 3 of 2026-08-20 already
   sends away, so it went without a separate decision. Recorded because it is a
   visible line that disappeared and nobody asked for it by name.

**E.27 §3.3 names "older Finale files" as its example of the native disclosure
pattern.** Noted as the brief asks. It is a fifteen-day-old example inside a
document tether 17 calls a source rather than law, Dann has ruled, and it did
not block. **The `<details>` mechanism itself is untouched and still available
for asides.**

---

## 5. NOT ESTABLISHED

**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

- **A real `.mus` drop.** The path is verified by reading all three of its
  stages and by two passing tests, not by dropping a file. **Settled by:** a
  `.mus` fixture through the drawer's own file input.
- **The phone.** Every measurement here is the Chromium pane at 1400 x 900.
  Nothing in this ship is width-dependent, but that is reasoning rather than
  measurement. **Settled by:** Dann's walk.
- **Whether 20 px reads as "snug" to Dann.** Measured and reported, not judged.
  **Settled by:** his walk, or by ship B closing it to the textarea's own gap.
- **Whether a real window resize leaves `bind:clientHeight` stale**, carried
  forward from the silhouette pass and still open. Not seen while working this
  ship.
- **Safari.**

---

## 6. What Dann walks

1. No "Have an older Finale file" line anywhere in the drawer.
2. `Print`, `Export this song`, and `Import a song` sit closer under the score
   box than they did, and whether 20 px against the textarea row's 6 px is close
   enough or waits for ship B.
3. The rule immediately above the voice line is lavender, and it matches the one
   above SHIFT LYRICS.
4. Every other rule in the drawer is still sage.

---
*Written by Claude Code, 2026-08-20, against the working tree. Every gap and
every rule colour here was read out of a running browser.*
