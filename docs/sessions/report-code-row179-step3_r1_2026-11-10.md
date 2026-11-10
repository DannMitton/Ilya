# Report, row 179, step 3: the offer, where her hand is (cloud-lane-44, 2026-11-10)

Brief: `brief-code-gloss-language-and-reuse_r3_2026-11-03.md`, step 3. Base: `62481e5` on `cloud-lane-44`.

## What changed

- **New `components/Drawer/GlossOffer.svelte`**, rendered under the gloss field in the dictionary panel's edit cell (`InspectorPanel.svelte`, one line, guarded by `{#if glossary}`). It shows one of four things:
  - the **offer** (**Use for this word in your other songs**, with a quiet **Not now**);
  - the **confirmation** (**Used in your other songs**), after a tap the device kept;
  - the **fill line** (**From your other songs**, with **Stop using**), where the field shows the glossary's text;
  - a **failure note** (**Could not be kept on this device**) after a tap the device refused, with the offer left standing.
- **The offer is a state of the field, not an event.** `glossLine` (`text/gloss-edit.ts`) decides it from inputs alone: she has a non-empty edit of her own in this language, the dictionary's gloss in this language is empty, the glossary has no entry, and she has not said Not now for this word in this song. Closing the panel, blurring the field, or moving to another word records nothing, and the offer is there on reopening while the gap remains.
- **Not now** is session state in the `GlossaryStore`, keyed `document id|line-word`, never written to storage (a test captures every write). **Stop using** removes the entry, leaves the song alone, and clears that word's Not now so a fresh edit can bring the offer back.
- **After the tap, further edits update the glossary entry** while the panel stays open on this word (an effect in `GlossOffer`). Blanking the field then removes the entry.
- **Strings.** The six ratified strings are in `i18n.ts` exactly as the brief tables them, with a test pinning both languages. None is a draft, so none is held. `i18n.ts` header: 1,192 keys, `inspector.` 42, `GlossOffer.svelte` named.
- **Touch.** On a coarse pointer each button is 44 px tall.
- **Ceilings.** `+page.svelte` stays at 5526 (ceiling 5534); `InspectorPanel.svelte` is at 2431 (ceiling 2432), because the new component carries all the logic. No ceiling raised, none lowered.

## Tests

- `text/gloss-offer.test.ts` (14 tests): the offer's conditions, its return on reopening, the fill line, Not now's scope and that it is never stored, Stop using reviving the offer, a refused write leaving the offer open, and the six strings.
- New `e2e/gloss-reuse.test.ts` (desk, real browser, 3 tests): in French on `мрежа мрежу`, typing `filet` shows the offer under the field and it stays through blur; the tap shows **Utilisée dans vos autres chants** and fills the sibling form `мрежу` with `filet`; the sibling shows **De vos autres chants** and no Reset; **Ne plus utiliser** clears the sibling and leaves `filet` on the first word. An unanswered offer is there again after closing and reopening the panel, and **Pas maintenant** hides it. A French edit shows `net` (the dictionary's) in English, not `filet`.
- New `e2e-phone/gloss-offer.test.ts`: below.

## The phone-width run (390 px wide)

The keyboard is emulated by a viewport 420 px tall, not a real keyboard, which Playwright does not have. With it, the field spans y 107.6 to 141.2, the offer y 165.6 to 209.6, and Not now y 212.8 to 256.8: all inside the 420 px, and the offer's tap works. The offer line wraps, so Not now stands on its own line under it at this width. Before the 44 px rule the targets were 27.6 px tall.

## Walk items

1 offer under the field, through blur: e2e. 2 tap, confirmation, refusal: e2e and unit. 3 the entry following the field: coded, not walked in a browser. 4 unanswered offer returns; Not now scoped to word and song: e2e and unit. 5 fill line, Stop using, blanking writes `''`, offer back after Stop using: e2e and unit. 6 languages apart: e2e. 7 a correction of a dictionary gloss gives no offer: unit (`dictionaryGloss` non-empty). 8 Reset: unit (step 1 and 2).

## Gates

All eight pass after this step. No ceiling raised.

## What I could not establish

- **Walk item 3 in a browser.** The glossary following typo fixes after the tap is an effect in `GlossOffer`; I wrote no browser test that types after the tap.
- **A real keyboard.** The viewport emulation does not move the page the way iOS or Android does when a field takes focus.
- **Blanking after the tap.** The Inspector writes her "no gloss here" (an explicit empty edit, because the glossary still has the entry when the keystroke lands) and the effect then removes the entry. The song keeps a stored empty edit and Reset shows. The brief names no rule; I left it.
- **Whether `Not now` and the offer should name the word.** The brief's strings do not, and I did not add one.
