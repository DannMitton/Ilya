# PRODUCT — what Ilya is

Open this before forming any opinion about what Ilya should do or look like.

---

## What Ilya produces. SETTLED. Do not reopen

**A study edition whose paper is a GUI.**

- **Transcribe owns every text operation. Fit owns every notation operation.**
- Verse 1 only.
- **Fit reads ONE line, never the harmony.**
- Desktop keeps WYSIWYG. Portrait mobile does not. **Rotating is the mode switch on
  both.**
- **The portrait scroll is never printed. Print renders the paper.**
- **Portrait treatment C, ruled 2026-08-18.** Portrait's arrival view is the
  fitted true page (whole, shadowed, owning its header block and colophon; the
  attribution lives in that colophon). One tap enters a **reading aid** that
  wears no paper dress and is labelled as an aid; one tap returns. The
  "designed for desktop" interstitial is retired. Rotation stays the mode
  switch. Record: `docs/sessions/fable-gui-session-record_2026-08-18.md`.
- **DRAWER MANIPULATES. PAGE DISPLAYS AND PRINTS.**
- **THE NOTES NEVER MOVE; THE SYLLABLES SLIDE ALONG THEM.** Ruled by Dann,
  2026-08-13, adopting Finale's grammar. The engraving is the composer's and
  is never a function of the text. This is why the pairing is a correction
  layer keyed by event id and never writes to `ParsedScore`, and it is why
  every Shift Lyrics operation is a permutation of a map: free to undo, and
  testable without a browser.

The portrait HTML scroll is an accommodation to a phone's form factor. In Dann's
words: *"Let's not confuse our GUIs with the actual musico-textual object."*

---

## The tabs

| tab | what it is |
|---|---|
| **Transcribe** | Russian text to Grayson-faithful IPA. Photographed Cyrillic text ships too, via tesseract.js. |
| **Fit** | Does this piece suit my voice? Forecasts, never declares. |
| **Learn** | Seven sections, Grayson throughout. Shipped. |
| **Guide** | How to use it, and why it chose that. |

---

## Closed and not to be reopened

- The mobile-versus-desktop asymmetry.
- The portrait attribution.
- Three desks.
- Full-ink.
- The 44 px handle.
- The boxed pair.
- **That print renders the paper.**
- **A mark on the page saying Ilya is unsure.** Struck in E.47. A mark that appears
  on everything says nothing, and a misplaced syllable is something Dann can see.

---

## The turning layer. Ruled by Dann 2026-09-02

A turning pitch marks where the voice turns, not how long it stays. It has a
pitch and nothing else, so it carries no stem, no flag, no beam, and no dot,
ever. Its whole extent is an accidental and a head, which Dann calls a
"biglyph" against the sung note's "triglyph" of accidental, head, and dots.
Each is a semantic unit; no mark from one may sit inside the other. A turning pitch is a property of the vowel that corresponds to the note it
follows (his words, 2026-09-02); that
relation is semantic, and the page shows it by proximity: a displaced
turning unit sits close after its parent and visibly further from what
follows (his ruling, 2026-09-02). At a
unison or a second the turning unit is always displaced to the right of the
sung unit, never left; at a third or more it aligns vertically. This departs
from Gould 103 on purpose; his words: "I realize this may be at odds with
Gould, but I find this acceptable for our purposes." Built under N.106.

## Naming, ruled

`Russian-o` / `o russe`. `cardinal-u` / `u cardinal`. **The French is LOWERCASE.**
Do not rename a vowel.

---

## Where the code lives

There is exactly **one route**, `apps/web/src/routes/+page.svelte`, and it is 1,948
lines.

| file | folder |
|---|---|
| `Paper.svelte`, `WordStack.svelte` | `apps/web/src/lib/components/Paper/` |
| `InspectorPanel.svelte`, `Drawer.svelte`, `TabBar.svelte` | `apps/web/src/lib/components/Drawer/` |
| `VoiceProfilePane.svelte`, `ScoreUploader.svelte`, `vowel-resolver.ts`, `pairings.ts`, `SyllableStation.svelte`, `profileStore.ts` | `apps/web/src/lib/shane/` |

`apps/web/static/data` is a symlink to the repository root's `data/`.

---
*SOURCED from `claude/e48-thread-opener_v1_2026-08-13.md`, read in full 2026-08-13.*


## The drawer grammar and the path. Ruled 2026-09-09 and 2026-09-10

### The grammar. Ratified from `docs/sessions/drawing-calibration-surface_r1_2026-09-10.html`, Plate 1

| measure | value | source, read 2026-09-10 |
|---|---|---|
| The left edge of everything | `--band-inset`, 18 px | `app.css` token (N.114b); `.group-band { padding: 0 18px }` `Drawer.svelte:980-994`; `.band-body { margin: 0 18px }` `:1064-1066` |
| Air under a band | 0.35rem, the fields' own gap | `MetadataFields.svelte:176-180`; the band's next sibling, N.114b item 2 |
| Air between rows | 8 px | `IntakePanel.svelte:779-783`, `:853-857` |
| A band | 40 px, full-strength hue, white 0.7rem 600 uppercase 0.12em | `Drawer.svelte:980-994`, Dann's option A of 2026-09-02 |
| A station row that opens | sentence-case name left, count and chevron right, hairline below | `StationHeader.svelte`; the syllable line's row, N.114 |
| A pill, ghost | outlined, pill ends, horizontal padding = band inset | `IntakePanel.svelte:753-768`; `.head-pill` N.114b item 5 |
| A pill, filled | one per surface, the primary, last | Transcribe and fit; Finish; Re-calibrate |
| Text verbs | receipt-scoped only: Clear, Replace, Revert, Reset | `.receipt-btn`, `.btn-reset` |
| Alignment | flush left on the inset; nothing centred | every band on the front side; desk inference as a rule, since no document states it |
| Radii | three: 0 paper, small controls (3 to 4 px), pills 999 | slate, 2026-08-18 |
| Accent | one per surface; lavender on Score markup and its takeover | slate; `--lang-chip-*` tokens |
| Alignment, ratified | flush left on the inset, nothing centred, drawer-wide | Dann, ruled 2026-09-10 |

The last row ratifies Plate 1's own alignment row, which the drawing itself had entered as desk inference and put to Dann as Plate 5's first question.

### The path

The drawer is a path read top to bottom: Piece, Input, Text, Score markup, Voice.

The state line a band shows closed is the collapsed form of that band; open, the content itself is the state. This corrects the desk's earlier rule and was accepted from Design's reply, ruled 2026-09-10.

At rest, nothing in the drawer is filled; exactly one thing is next, and only that one thing is filled, one primary pill per surface, last in its row.

Once a syllable is placed, the singer's content stays black; unplaced content sits in tertiary ink, and the count beside it, not a per-syllable word, carries its state on the page. Ruled 2026-09-10: no word on every unplaced syllable, because annotating everything says nothing; per-syllable state lives in the accessible label only.

An empty drawer opens Input alone; Piece and Score markup show their band and nothing else. Ruled 2026-09-10, accepted from Design's reply.

On a phone, a step's primary action lands the singer on the page itself, and Back brings them home. Ruled 2026-09-10, from Design's reply; marked to be read against the portrait C ruling of 2026-08-18 before it is built.

Whether "done" goes quiet once a step completes is NOT ESTABLISHED in the sources read for this transcription.

### The two sets of words. N.121, ruled in part 2026-09-10

The singer must never be surprised by which words end up under the notes.

A score that arrives carrying words, into an empty poem box, fills that box and tags the poem receipt "from score", the Piece fields' own pattern.

Ilya asks no question when this happens.

A singer's own words are never overwritten.

There is no difference reporting, ever, and no narration on a score's arrival.

Dann's earlier sketch of an in-place question asking which words to keep is withdrawn.

### Rulings on the drawer's surfaces, 2026-09-09 and 2026-09-10

- 2026-09-09: the Voice station in Score markup stays expanded always; its chevron is struck.
- 2026-09-09: the intake hint moves to sit directly under the textarea, above the receipts, as the field's caption, its wording unchanged.
- 2026-09-09 and 2026-09-10: Undo and Redo move to the top bar, right end, fixed, as two pills tangent to the card, horizontal padding equal to the band inset; the dock's own Undo row goes.
- 2026-09-10: Start placement over is a ghost pill in the open syllable line's row.
- 2026-09-10: Export and import order is Export all songs, Export this song, Import a song.
- 2026-09-10: the calibration surface's collapse row is removed.
- 2026-09-10: on the calibration summary, Start over is a ghost pill beside the filled Finish pill.
- 2026-09-10: lyric hands sit first in Corrections, always, in fixed order; Design's proposal to swap their position by state was rejected.
- 2026-09-10: the METADATA label on the Piece band is struck; the metadata body shows whenever Piece is open, and collapsing Piece is the collapse.
- 2026-09-10: no word is drawn on every unplaced syllable; the count plus black-or-grey ink carries it on the page.

### Named exemptions

The ⓘ on the Russian-o roster row is the one named exemption to slate rule 11, "siblings behave identically." It opens the sung-[o] Learn note, ruled 2026-07-11, and was kept against Design's proposed removal, ruled 2026-09-10.

The drawer also carries two existing 44 px touch-target exemptions, ruled in E.36: the table-of-contents rows and the stress circles. These are cited here as already settled, not restated or reopened.

### Strings ruled with their French, 2026-09-10

Shown to Dann as the FRENCH TABLE. He approved « saisir » explicitly ("that's what I was reaching for"); every other row stands unless he names it.

| English | French | source |
|---|---|---|
| Calibrate | Calibrer | adopted, from Recalibrer |
| 37 / 94 placed | 37 / 94 placées | coined |
| 2 of 7 changed | 2 sur 7 modifiés | NOT ESTABLISHED (adopted or coined) |
| 2 notes corrected | 2 notes corrigées | NOT ESTABLISHED (adopted or coined) |
| Type or paste the poem. | Saisissez ou collez le poème. | adopted, « saisir » and « coller » from the tree; « saisir » explicitly approved |
| Drop the score here. | Déposez la partition ici. | adopted, « déposer » from the tree |
| Voice: Dann · 10 of 10 | Voix : Dann · 10 sur 10 | NOT ESTABLISHED (adopted or coined) |

*Section appended 2026-09-10 from `docs/sessions/product-addition-drawer-grammar_r1_2026-09-10.md`, transcribed by Sonnet from STATE.md, INBOX.md, the desk critique, and the drawing r1 Plate 1; three gaps the agent flagged were filled by the desk from the session record.*
