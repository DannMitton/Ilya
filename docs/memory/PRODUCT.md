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
- **DRAWER MANIPULATES. PAGE DISPLAYS AND PRINTS.**

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
