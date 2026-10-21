# Enumeration: every edit a word on Text allows today (N.194, QUEUE row 152), r1, 2026-10-21

Read by the desk 2026-10-21 00:5x. Nothing run. Every line below is a `path:line` the desk read. This is the first deliverable of N.194: what a click on a word could offer. The card design is Dann's to rule.

## The edits today (all in the Inspector, `apps/web/src/lib/components/Drawer/InspectorPanel.svelte`)

1. **Stress.** Each syllable has a circle; pressing one opens a choice of provenance (`handleCircleClick` `:393-402`, `handleProvenanceChoice` `:404-407`); the callbacks are `onstressassign` and `onstressrevert` (`:26-27`, `:405`, `:410`). Offered only when the word has syllables (`canAssignStress`, `:383`). A revert shows only on the syllable already stressed by the singer (`showRevertOption`, `:387-391`). The dictionary's other readings of the word are also pressable and assign stress with source `user-dictionary` (`handleDictEntryClick`, `:963-969`).
2. **ё.** An е in the word carries a sigil; pressing it opens a provenance choice, pressing a set one reverts it (`handleYoSigilClick` `:504-525`, `confirmYoToggle` `:527-531`; shown only on е or a singer-toggled letter, `shouldShowYoSigil` `:481-488`).
3. **Syllable boundaries.** A letter group is dragged left or right; boundaries must stay ascending and non-negative (`:790-818`); `onsyllableoverride` and `onsyllableoverrideclear` (`:31-33`).
4. **Gloss.** A text field of at most 20 characters; empty, or the dictionary's own gloss, reverts to the dictionary (`handleGlossInput` `:849-858`); `onglossoverride` (`:39`).
5. **Spot reconstitution or reduction.** A checkbox, offered only when the reduced and reconstituted forms differ (`canSpotToggle` `:65-67`, rendered `:1012-1019`); its label inverts the global setting (`:58-63`).
6. **Reset.** Clears every per-word override; offered only when one exists (`hasOverrides` `:377-379`, rendered `:999-1003`).
7. **Read only:** an explanation (blurb) per letter (`getBlurbText` `:444-456`).

The page's handlers for 1 to 6 act on the selected word (`+page.svelte:2243-2297`). Stress, ё, spot, and syllable marks are session state; the gloss is per song.

## What a click can land on today

A word on Text is ONE button (`apps/web/src/lib/components/Paper/WordStack.svelte:151-154`, role button, tabindex 0, Enter or Space). Inside it, four rows: an icon area (the provenance icon and the R sigla), the IPA row, the Cyrillic row, and the gloss row (`:176-205`). The IPA and Cyrillic rows are single strings (`displayIpa`, `displayCyrillic`), not one element per syllable. So a click cannot today tell a syllable from the gloss or the icon; every click opens the Inspector on that word (`+page.svelte:2191-2222`). Per-syllable and per-row targets do not exist yet.

## New, ruled 2026-10-21

8. **Break after this word** and **Remove break** (strings ratified, QUEUE row 152); a per-song map after the gloss map's pattern.

## Not yet enumerated

Text's other elements (title block, header fields, footer), Markup's elements, and the drawer's own fields. One surface at a time.
