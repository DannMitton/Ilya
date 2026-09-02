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
