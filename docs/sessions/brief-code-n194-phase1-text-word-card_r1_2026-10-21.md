# Brief for Code: N.194 phase 1, the word card on Text and the per-song break (QUEUE row 152), r1, 2026-10-21

For Code in a cloud session, Sonnet, on a new lane cut from `Shane` by Dann, AFTER batch C (`brief-code-batch-c_r2_2026-10-21.md`) has shipped. Fable reviews this brief before Code gets it (`CONTRACT.md` section 1, item 19). **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk read on 2026-10-21, or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no branch other than the lane.

References, read them first: `docs/sessions/design-click-to-card-text-words_r1_2026-10-21.md` (the design and the rulings), `docs/sessions/enumeration-text-word-edits_r1_2026-10-21.md` (every edit a Text word allows, with cites), `docs/memory/QUEUE.md` row 152.

## 0. Rules for the whole brief

- **Prerequisite.** Batch C's B3 defines the word field that carries a syntactic break and grafts the # after the word's last syllable in the IPA (`brief-code-batch-c_r2_2026-10-21.md`, B3, "Carry the mark as its own field", DESK DEFAULT name `syntacticBreak: true`). This brief SETS that field from a per-song map. If B3 is not on the lane, stop and report; do not build a second mechanism.
- **Phase 1 is Text only.** Markup is phase 2 and is not designed here (NOT READ: the Loupe's handling of words; whether a Markup tap resolves from `data-hit` alone). Do not touch `packages/score-parser`, `MarkupPane.svelte`, or the Loupe.
- **The Inspector is unchanged** except for what step 4 says about how a word's press reaches it. Every Inspector tool keeps working exactly as today.
- Work the steps in order, one commit each, and report after each.
- At the start, read the ship script's gate lines and report the eight baselines. Do not trust a number in this brief.
- The ratchet table is `scripts/ratchets.json`. `+page.svelte` stood at 5606 lines against a ceiling of 5607 on 2026-10-21 (Fable's reading for batch C; NOT ESTABLISHED now), so new logic goes in new modules and `+page.svelte` receives only wiring lines. Do not raise a ceiling.
- No IPA is written by hand. Every expected IPA is an output of Ilya's engine compared with another output of the same engine.
- **No string a singer reads is invented.** Ratified strings you may use: EN "Break after this word" and "Remove break"; FR « Frontière après ce mot » and « Retirer la frontière » (Dann 2026-10-21 00:32). Any other label the card needs: use an existing key from `apps/web/src/lib/i18n.ts` (the Inspector's own, such as `inspector.syllable`) or list the string in your report as owed to Dann with a desk draft. Do not add it.
- Return memo format at the end (section 6). Every step's report has a section "What I could not establish".

## 1. The need, in Dann's words (2026-10-21)

*"I want the entire WYSIWYG made live so that the user doesn't have to dig through controls to find anything if they dont want to: a click will just invoke the right control in the right state to address the element they clicked."* (00:52). *"Offering the user context-appropriate cards is already something Ilya does with its on-score Clef selector. Mobile can achieve this... The user can always go the long way and invoke Loupe, Corrections, and so on... Let's prioritize the user experience and give Calm Authority, simplicity, and ease."* The first edit is the # break, which a coach or a native speaker points out while the singer looks at the passage (`OPEN.md`, "THE # FOR A SYNTACTIC BREAK"). On the cue: *"Nothing. I'm happy letting this aspect be part of the user's progressive disclosure... We will fully document all finctioanlity in GUIDE"* (01:05). All transcribed as written.

## 2. Ruled design (all ratified by Dann 2026-10-21; see the design file)

- A click on a word on Text opens a card of that word's edits. The Inspector, Loupe, and Corrections remain the long way.
- The break is kept per song, and appears only as the # on the IPA line (never in the Cyrillic, never drawn on a staff).
- Nothing is shown on a phone to say a word can be pressed.
- Every card closes by an X in its top right corner (at least 44 px on a coarse pointer), by a press outside it, and by Escape.
- Three conditions: opening a card changes nothing; every change a card makes has its own way back (Remove break, revert, reset); a scroll or a drag that starts on a word opens no card.
- DESK DEFAULTS, his to wave off: the witness for a break is Lyrics (when Poem is the shown witness the break item is not offered, and the page's gloss override writes the poem's own map in that case, `+page.svelte:2279-2291`); one shared writer serves every surface; the card carries only the edits that apply, using the Inspector's own guards.

## 3. What the code is today (read 2026-10-21)

- A word on Text is one button, `role="button"`, `tabindex` 0, with `data-word-index="{lineIndex}-{wordIndex}"`, Enter and Space handled, and four rows inside: icon area, IPA, Cyrillic, gloss (`apps/web/src/lib/components/Paper/WordStack.svelte:131-154`, `:176-205`). The IPA and Cyrillic rows are single strings.
- A press calls `onwordclick` (`WordStack.svelte:131-139`), which `handleWordClick` receives: it sets `selectedWord` and `lastFocusedWord`, raises the drawer on a phone, and switches to Text (`apps/web/src/routes/+page.svelte:2191-2222`).
- The Inspector's per-word handlers act on `selectedWord` and write through `marks` and `doc` (`+page.svelte:2241-2297`): spot reconstitution, stress assign and revert, ё, syllable override, gloss override. The gloss is the one per-song word edit: it writes `doc.glossOverrides` and `doc.glossAnchors`, the anchor being `selectedWord.cleanWord`, or the `published*` maps when Poem is shown (`+page.svelte:2279-2291`).
- Edits to a word-keyed map ride a text edit through `carryOverridesAcross` (`+page.svelte:2047-2052`), which calls `rekeyByWord` (`apps/web/src/lib/text-diff.ts:238-246`): a mark on a matched word moves to its new key, a mark on a removed word is dropped, a key the diff never heard of is dropped.
- A per-song field is declared in `SongRecord` (`apps/web/src/lib/library/types.ts:90`; optional and additive fields `seatedText?` `:130`, `transposition?` `:146`), held in `SongDocument` (`apps/web/src/lib/library/document.svelte.ts:62-110`, `glossAnchors` at `:70`), listed in `SongFields` (`apps/web/src/lib/library/library.ts:47-`, `glossAnchors` `:51`), read in `fieldsFromRecord` (`library.ts:76-110`), written in `recordFromFields` (`library.ts:114-145`, with the stored-only-while-set pattern at `:121` and `:131-140`), validated in `validateRecord` (additive and `malformed()` on a bad shape, `library.ts:215-262`), and copied in `#snapshot` and `#apply` (`document.svelte.ts:287`, `:342`). `$state.snapshot` is required before any write (`document.svelte.ts`, the comment in `#write`).
- The hook for a singer-set boundary exists and is unused: `autoDetectBoundaries` returns early on `boundarySource === 'user'` (`apps/web/src/lib/boundaries.ts:47`); `pipeline.ts:745-748` says nothing sets `'user'`. It is called per line after stress overrides are applied (`apps/web/src/lib/pipeline.ts:326-328`); the stress overrides are read there by word key (`userStressOverrides?.get(wordKey)`, near `pipeline.ts:311`; verify).
- The model for the card: `apps/web/src/lib/score/ClefControls.svelte`. Fixed overlay buttons placed from each element's `getBoundingClientRect`, outside the page's scale (`:36-37`, `:51-62`), re-measured on scroll and resize (`:72-90`); a menu beside the element on a fine pointer and a sheet from the foot on a coarse one; the whole overlay hidden under `@media print`; closes on Escape and an outside press (`:99-117`); state in `clef-ui.svelte.ts`. It has no X.
- Text's page is scaled on a phone by `PageFit` (`apps/web/src/lib/components/Paper/PageFit.svelte:46-51`, used at `Paper.svelte:68`). By arithmetic only, about 0.42 on a 390 px viewport with a 24 px gutter each side (`app.css:130`). NOT ESTABLISHED on a device.
- NOT READ: `clef-ui.svelte.ts`; the `apps/web/e2e-phone/` and `apps/web/e2e/` harnesses (`loupe-*` files exist there); the exact signature of `processText` and how `userStressOverrides` reaches it; `selected` state's other readers.

## 4. Steps

### Step 1. The per-song break map (data only, no UI)

Goal: a break survives a save, a reload, and a text edit.

- Add `breaks`, a map from word key `"lineIndex-wordIndex"` to the word's `cleanWord` (the anchor), after the gloss pair's pattern. Optional and additive on `SongRecord` (stored as rows `[key, anchor]` only while non-empty), no schema bump, an older record loads with none, a malformed one is `malformed()`. Touch exactly the sites in section 3's per-song bullet.
- Put the pure operations in a new module, `apps/web/src/lib/text/breaks.ts` (DESK DEFAULT name): `setBreak(map, key, anchor)`, `clearBreak(map, key)`, `hasBreak(map, key)`, and the carry across a diff through `rekeyByWord`. Plain TypeScript, no runes (`ENVIRONMENT.md`, "Runes under vitest").
- Carry the map across an edit in `carryOverridesAcross` (`+page.svelte:2047-2052`), with its anchors, as the gloss maps are.
- A carried break whose word's `cleanWord` no longer equals its anchor is dropped (the anchor is the witness that the word is the same word). Say what `rekeyByWord` does when a word is split or joined, and test it.

Done when:
1. A song with two breaks saves, reloads, and has the same two; a song with none stores no field (`recordFromFields` output has no `breaks` key); an older record with no field loads whole; a record whose `breaks` is not an array of string pairs is called malformed.
2. A break on line 3 survives an edit on line 1; a break on a deleted word is gone; a break whose word was retyped to a different word is gone.
3. `rekeyByWord`'s behaviour on a split and on a join is stated in the report, with the test.

### Step 2. The engine reads the map

Goal: a word with a break takes a hard boundary, and the IPA shows the #.

- Pass the map into the pipeline the way stress overrides reach it (NOT READ: the signature; name it in your report). Before `autoDetectBoundaries` (`pipeline.ts:326-328`), for each word whose key is in the map, set `rightBoundary: 'hard'`, `boundarySource: 'user'`, and the batch C field `syntacticBreak: true`. The early return at `boundaries.ts:47` then leaves it alone.
- Do not change `punctuation`, `cyrillic`, or the clitic guards (`pipeline.ts:778-793`). Batch C's B3 owns how the field is drawn in the IPA.
- A break on a word that is the last of its line changes nothing audible (it is already hard, `boundaries.ts:14`) but the # still shows; say what you see.

Done when:
1. For three word pairs where the engine's own output voices a final consonant across the boundary (find them by running pairs with no break), the IPA with a map break after X equals the IPA of the same pair typed with a #, per batch C's B3, and differs from the pair with no break. The only extra symbol is the #, grafted after X's last syllable.
2. A word not in the map is unchanged: the approval corpus (`apps/web/src/lib/approval/ipa-corpus.approval.test.ts`) and every other gate stay at baseline.
3. A break on a clitic host and on a word next to an enclitic: report what Ilya does; do not design for it.

### Step 3. The word card, in place of a press that opens the Inspector

Goal: a press on a word on Text opens a card of that word's edits.

- New modules (DESK DEFAULT names): `apps/web/src/lib/components/Paper/WordCards.svelte` (the layer and the card), `apps/web/src/lib/components/Paper/word-card-state.svelte.ts` (the state, after `clef-ui.svelte.ts`; NOT READ), and a pure `apps/web/src/lib/text/word-card-items.ts` that decides which items a word's card holds.
- **The layer.** One transparent fixed layer outside the page's scale, one delegated pointer handler, geometry read from each `.word-stack` by `data-word-index` and `getBoundingClientRect`, re-measured on scroll and resize in a frame (the `ClefControls.svelte:51-90` pattern). The layer resolves a press to an owner word from the stored rectangles. Coarse pointer: the owner is the nearest word on its line within a limit, its hit area at least 44 px by 44 px on screen, grown toward its neighbours and split at the midpoint between them. Fine pointer: the owner is the word under the pointer. Nothing prints (`@media print` hides it). The word stays a focusable button (`WordStack.svelte:141-154`); Enter and Space open the same card.
- **A scroll or a drag opens no card.** The handler opens a card only on a press that moves less than a small threshold (DESK DEFAULT 8 px) and is released within a short time (DESK DEFAULT 400 ms). Measure on the phone harness; say what you chose.
- **The card's items**, shown only where they apply, each calling the SAME handler the Inspector calls (`+page.svelte:2243-2297`), not a copy: Break after this word or Remove break (Witness Lyrics only; step 1's writer); stress, which syllable and where it came from, the dictionary's other readings, and revert, when the word has syllables (`InspectorPanel.svelte:383`, `:387-391`, `:964-969`); ё only when the word has an е or a letter the singer toggled (`:481-488`); reconstitution or reduction only when the two forms differ (`:65-67`); gloss, edit and revert (`:849-858`); reset only when an override exists (`:377-379`); and "More in the Inspector", which opens the Inspector as a press does today (`handleWordClick`, `+page.svelte:2191-2222`). Syllable boundaries by drag stay in the Inspector.
- **The shape.** A menu beside the word on a fine pointer and a sheet from the foot on a coarse one, each target at least 44 px, after `ClefControls.svelte`. An X in the top right corner (at least 44 px on a coarse pointer), a press outside, and Escape each close it. Focus goes into the card on open and returns to the word on close.
- **What a press does now.** The word's press opens the card, not the Inspector. The Inspector opens from "More in the Inspector", and from a word selected by any path other than a press on Text (Markup's `onwordclick` path calls `handleWordClick`; leave it as it is).
- Only ratified or existing strings (section 0). The X's accessible name, the card's accessible name, and the labels for the items that have no Inspector key: list them as owed with a desk draft.

Done when:
1. **Opens, changes nothing.** A test presses a word and asserts the card opens and that `doc`, `marks`, and the song record are equal before and after (a snapshot compare).
2. **Guards.** Each item appears only under its Inspector guard; a word with no syllables offers no stress; a word with no е offers no ё; a word with identical reduced and reconstituted forms offers no spot toggle; a word with no override offers no reset.
3. **One handler.** Each edit a card makes calls the Inspector's handler (a spy on the shared function proves it); the break calls step 1's writer.
4. **A way back.** Break then Remove break returns the song record to byte equality with the start.
5. **Dismissal.** X, an outside press, and Escape each close the card, and focus returns to the word.
6. **Scroll and drag.** A press that moves beyond the threshold opens no card (an e2e run on the phone harness, `apps/web/e2e-phone/`; NOT READ, name the file you extend).
7. **Targets.** On a coarse pointer every hit area is at least 44 by 44 CSS px as measured by `getBoundingClientRect` on the phone harness, at the harness's page scale; report the scale.
8. **Print.** Text prints with no card, no layer, and no X.
9. **Keyboard and names.** Tab reaches every word, Enter opens its card, the card's items are reachable by arrows as the clef menu's are (`ClefControls.svelte`, `arrows`).
10. **Gates.** All eight at baseline; `+page.svelte` within its ceiling.

## 5. Where would this wall a singer in? (Fable's question for every brief)

Answer in your report: a card that hides an edit the Inspector shows; a break that vanishes after a poem edit without a sign; a press that opens a card while a singer is scrolling; a word whose hit area is covered by a neighbour's; a break set on a word and then a text edit that moves the word; a singer who sets a break and cannot find it again; a card the singer cannot dismiss.

## 6. Return memo

One file per step, `docs/sessions/report-code-n194-step<N>_r1_2026-10-21.md`, each with: what you changed (files and `path:line`); the tests added and which failed before; the eight gates before and after; a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, answered or still open); anything owed to Dann (strings, a ruling). Do not commit the brief, the reports, or any `docs/memory` file; the desk files them.

## 7. Cost and order

State your token use per step. If a step would cross a ceiling you cannot move code out of, stop and report rather than raise it. Order: 1, 2, 3. Step 3 is the largest; if it cannot be built whole, report where you stopped and what works.

## 8. Not in this brief

Markup's tap (phase 2); the Guide paragraph in both languages (the desk drafts it, French to Dann); the X on the Clef menu and sheet; per-syllable regions on a fine pointer (phase 2 of the design); the other editable elements on the Paper (title block, footer, header fields), each of which gets its enumeration first.
