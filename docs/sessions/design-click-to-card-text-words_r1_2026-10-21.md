# Design: a click on a Paper element offers that element's card (N.194), r1, 2026-10-21

DESK DRAFT for Fable's review. Written by the desk (Sonnet) 2026-10-21 about 01:15 on Dann's instruction to read the code first, put the singer's need first, and let Fable adjust. Nothing is built. Every `path:line` was read this session. "NOT ESTABLISHED beats a complete invented answer."

## 1. What Dann has ruled (QUEUE row 152, INBOX 2026-10-21)

- A click on an editable element invokes the right control in the right state: the whole Paper made live, so a singer never has to dig (00:52).
- The model is the on-score Clef selector. The Inspector, the Loupe, and Corrections stay as the long way.
- Calm Authority, simplicity, ease; the singer's view first.
- The # break is the first edit, on Text and on Markup, kept per song, shown only as the # on the IPA line. Menu strings ratified: "Break after this word" and "Remove break", « Frontière après ce mot » and « Retirer la frontière ».
- In the release checklist (`SCHEDULE.md` Meta 3, N.194), 00:57.

## 2. What the code is today

- A word on Text is one button with four rows: icon area, IPA, Cyrillic, gloss (`apps/web/src/lib/components/Paper/WordStack.svelte:151-205`). The IPA and Cyrillic rows are single strings. Every click opens the Inspector on that word and raises the drawer on a phone (`apps/web/src/routes/+page.svelte:2191-2222`).
- The Inspector's edits for a word: stress per syllable with a source choice, the dictionary's other readings, ё on an е, syllable boundaries by drag, gloss (20 characters), spot reconstitution, reset (`apps/web/src/lib/components/Drawer/InspectorPanel.svelte`; full list with cites in `enumeration-text-word-edits_r1_2026-10-21.md`).
- Text and Markup are both scaled by `PageFit` on a phone in portrait (`apps/web/src/lib/components/Paper/PageFit.svelte:46-51`, used at `Paper.svelte:68` and `MarkupPane.svelte:972`): the 816 px page is scaled to the desk's width. Arithmetic, not measured: on a 390 px viewport with the 24 px gutter each side (`app.css:130`), the scale is about 342/816 = 0.42, so a 16 px row is about 7 px high. NOT ESTABLISHED: the real figure on a device.
- The model to copy: `apps/web/src/lib/score/ClefControls.svelte` places fixed overlay buttons from each element's `getBoundingClientRect`, outside the page's scale, at least 44 px on a coarse pointer (`:36-37`, `:51-62`), re-measured on scroll and resize (`:72-90`); a menu beside the element on a fine pointer and a sheet from the foot on a coarse one; nothing prints.
- Markup: tappable regions are `data-hit` rectangles per note (`packages/score-parser/src/staff-renderer.ts:2670`, `:2944`), picked by one delegated listener (`apps/web/src/lib/markup/MarkupPane.svelte:313-321`); a note resolves to its word through `PairingMap` (`apps/web/src/lib/score/pairings.ts:77-98`, `:119-132`).

## 3. The hotspot layer (DESK DEFAULTS, for Fable to adjust)

1. **One transparent layer and one pointer handler**, outside the page's scale, not one node per word. The handler resolves a tap to an owner from stored geometry. Nothing prints.
2. **Coarse pointer (phone):** the owner is the word. Its hotspot is at least 44 px on screen, grown toward its neighbours and split at the midpoint between them, so every tap near a word resolves to the nearest word on its line within a limit. Row regions do not exist at about 0.42 scale, so the card carries every edit that applies and the tap's position chooses nothing.
3. **Fine pointer (desk):** regions inside the word: the IPA and Cyrillic rows, the gloss row, the provenance icon, and a syllable. The region chooses which card opens first. NOT ESTABLISHED: how to get per-syllable geometry from a single string (render one span per syllable, or measure with `Range.getClientRects`); an implementation choice for Code.
4. **The cue. RULED by Dann 2026-10-21 01:05: nothing on a phone** (*"Nothing. I'm happy letting this aspect be part of the user's progressive disclosure... the user will quickly acquire sensitivity and a sense of exploration to discover which click triggers which control... We will fully document all functionality in GUIDE"*, transcribed as written). Fine pointer: the hover tint and pointer cursor the stack already has (`WordStack.svelte`, `.word-stack:hover`). The condition under which discovery is safe, offered by the desk and not yet ruled: opening a card changes nothing, every change a card makes has its own way back (Remove break, revert, reset), and a scroll or a drag that starts on a word does not open a card (a movement threshold on the pointer handler). The Guide documents every card, EN and FR. **RATIFIED by Dann 01:07 ("yes"): this dismissal and the three conditions above. Dismissal (Dann 01:06, as a proposal: an x-out in the top right corner, or a tap outside; the desk makes it a DESK DEFAULT, his to wave off):** every card closes three ways: an X in its top right corner (at least 44 px on a coarse pointer), a tap or press outside it, and Escape. The Clef selector today closes by Escape and an outside press only and has no X (`apps/web/src/lib/score/ClefControls.svelte:99-117`), so an X on the clef menu and sheet is a small follow-up for consistency.
5. **Keyboard.** The word stays a button (`WordStack.svelte:151-154`); Enter opens the same card.

## 4. The card (DESK DRAFT)

Only the edits that apply to this word appear, with the guards the Inspector already uses:
- Break after this word, or Remove break (new).
- Stress: which syllable, and where the stress came from, when the word has syllables (`InspectorPanel.svelte:383`); the dictionary's other readings; revert when the singer set it (`:387-391`).
- ё, only when the word has an е or a letter the singer toggled (`:481-488`).
- Reconstitution or reduction, only when the two forms differ (`:65-67`).
- Gloss: edit, revert to the dictionary (`:849-858`).
- Reset, only when an override exists (`:377-379`).
- "More in the Inspector": opens the Inspector as a click does today, for syllable boundaries by drag and anything the card omits.
On a fine pointer the card is a menu beside the word; on a coarse pointer a sheet from the foot, each target at least 44 px (the `ClefControls` model). A choice acts in place and the card closes.

This changes what a click does today (it opens the Inspector). Dann ruled it (00:52).

## 5. The break (DESK DEFAULTS)

- A per-song map keyed `"lineIndex-wordIndex"` with the word's `cleanWord` as its anchor, after the gloss map (`apps/web/src/lib/library/document.svelte.ts:70`, `library/library.ts:51`, `:80-90`, `:125`), carried across a text edit by `rekeyByWord` (`apps/web/src/lib/text-diff.ts:238-246`) through `carryOverridesAcross` (`+page.svelte:2047-2052`). An optional, additive field on `SongRecord`, no schema bump (`library/types.ts:90`, `:130`, `:146`). Store the choice, never the derived boundary (`CONTRACT.md` section 6).
- The witness is Lyrics (NOT RULED): Lyrics is what is sung, and the gloss override writes `publishedGlosses` instead when Poem is shown (`+page.svelte:2279-2291`).
- The engine reads the map and sets that word's `rightBoundary` to `'hard'` with source `'user'`; the hook exists and is unused (`apps/web/src/lib/boundaries.ts:47`, `pipeline.ts:745-748`). Batch C's work on row 139 (brief r2) is the foundation.
- Text and Markup call one writer. On Markup a tap resolves note to word to word key, and the break goes after that word; a mid-word syllable offers the break after its word.

## 6. NOT ESTABLISHED

- The phone scale on a device, and the real size of a word's hotspot.
- Per-syllable geometry on the IPA row.
- Whether a tap on a Markup syllable can be resolved from the `data-hit` rectangles alone, or needs new overlay hotspots over the injected SVG (as `ClefControls` does for `data-clef`).
- How the Loupe handles words, and whether a break belongs there too.
- How a break carried by `rekeyByWord` behaves when a poem edit splits or joins the word (the map drops a key the diff never heard of, `text-diff.ts:233-237`).

## 7. Questions for Fable

1. Is one transparent layer with a single handler sound under `PageFit`'s transform, with pinch zoom, and with the drawer open?
2. Does the coarse pointer's whole-word tap leave a singer able to pick the right word on a dense line?
3. Where would this wall a singer in: a tap that cannot be undone, a card that hides an edit the Inspector shows, a break that vanishes after a poem edit.
4. Whether "More in the Inspector" is the right long way, or the card should open the Inspector on a long press.
