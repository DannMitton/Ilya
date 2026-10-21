# Fable review: brief for Code, N.194 phase 1 (the word card on Text and the per-song break), r1, 2026-10-21

Reviewed by Fable 2026-10-21 against the tree on `Shane` at `efaa84a7` (batch C not yet landed; `syntacticBreak` has zero hits in the tree). Read only; nothing run. Every `path:line` below was read this session. Anything not read is marked NOT ESTABLISHED. Written incrementally on the last of the week's Fable limit.

## Verdict

**SEND WITH AMENDMENTS.** Steps 1 and 2 can go to Code once amendments 2, 5, 6, 7, and 11 are pasted. Step 3 waits on two things: amendment 1 (the layer design does not work under the desk's scroller and is not the Clef model) and amendment 3 (which items the phase 1 card carries is Dann's, one question). No ruling forbids the card; amendment 9 says which older decisions it departs from and why that is allowed.

## Amendments, ranked

### 1. The "one transparent fixed layer" stops the desk from scrolling, and it is not what ClefControls does

Evidence. Text scrolls inside `.main-content`, `overflow-y: auto` (`apps/web/src/routes/+page.svelte:4951-4953`). `ClefControls` has no layer: its wrapper is `display: contents` (`apps/web/src/lib/score/ClefControls.svelte:234-236`), it renders one `position: fixed` button per visible clef at `z-index: 45` (`:190-200`, `:238-246`, `visible()` at `:157`), and it portals those buttons to `<body>` (`:149-153`). A single fixed layer over the page, portalled out of `.main-content`, takes every wheel and touch event that lands on it; the scroll goes to the layer's own ancestors, which are `<body>`, not the desk's scroller. On a phone that is the whole of Text. It also takes the press meant for the page's own `.word-stack` buttons (`WordStack.svelte:143-157`), so the keyboard path and the pointer path would diverge.

Cost if not amended. Step 3 ships a Text that cannot be scrolled by touch or wheel, or Code discovers it and designs its own fix unreviewed.

Replacement text for step 3, "The layer" (paste over the paragraph):

> **No layer.** One delegated `click` handler on `.paper-container` (`Paper.svelte:70`), inside the scroller, so scrolling is untouched and nothing is portalled. On a coarse pointer the owner is the nearest non-Latin `.word-stack` (`WordStack.svelte:148`, `:151`: a Latin word opens nothing) on the nearest line, read from `getBoundingClientRect` at the moment of the click, within a limit of 22 px on screen beyond the word's own rect and split at the midpoint between neighbours; on a fine pointer the owner is `closest('.word-stack')`. The browser already suppresses `click` after a touch scroll; for a mouse drag, a `pointerdown`/`pointerup` pair on the same container cancels the click when the pointer moved more than the threshold (DESK DEFAULT 8 px). Paper's `onwordclick` (`+page.svelte:4372`) becomes the card opener for Enter and Space (`WordStack.svelte:135-140`), and the WordStack's own `onclick` is kept for the fine pointer only, so there is exactly one path into the card per pointer type and no double firing. No geometry is stored and nothing is re-measured on scroll. The card itself (menu or sheet) is portalled and fixed, after `ClefControls.svelte:149-153`, `:255-262`, at `z-index: 80`: above the drawer's pull bar (70, `Drawer.svelte:1566`) and the drawer (60, `:1894`), under the toast (200) and the loupe (9100), as the clef sheet is.

Done-when 7 then changes: "On the phone harness, a tap 20 px outside a word's rect, on its line, opens that word's card, and a tap at the midpoint between two words opens the nearer; report the page scale" (there is no 44 px element to measure).

### 2. A break is applied at a stale key before the anchor is checked, so one run prints a wrong boundary

Evidence. The gloss anchors are checked AFTER the pipeline runs: `keepSurvivingGlosses` (`+page.svelte:2301-2304`, called at `:2031`) calls `survivingGlosses` (`apps/web/src/lib/text/gloss-survival.ts:20-37`), which compares `glossAnchorForm(word.cleanWord)` to the anchor (`:11-13`, lowercased and ё-folded). For a gloss that order is harmless: the gloss is display only. For a break it is not: step 2 sets `rightBoundary: 'hard'` before `autoDetectBoundaries` (`pipeline.ts:328`) and the engine honours it at `packages/phonology/src/engine.ts:2171` and `:2249`, so a stale key hardens the wrong word's boundary on that run, and nothing re-runs after the guard drops it. The brief's step 1 asks that a break whose word no longer equals its anchor be dropped but names no site; `rekeyByWord` (`text-diff.ts:238-246`) carries keys and never reads anchors. On a reload `transcribedGrid` is empty, so the diff is `emptyDiff()` (`+page.svelte:1946-1950`) and the anchor is the only guard there is.

Cost if not amended. A singer who retypes a word prints, for one run, a hard boundary on a word they never marked. WYSIWYG and "the text is authoritative" (`text-diff.ts:1-26`) both break silently.

Replacement text, step 2 first bullet (add):

> The map passed to `processText` is key to anchor. The pipeline applies a break only where `glossAnchorForm(word.cleanWord) === glossAnchorForm(anchor)` (`text/gloss-survival.ts:11-13`; import it, do not copy it). Apply it in its own pass before `:328`, not inside step 1.5, which is skipped when there are no stress or ё marks (`pipeline.ts:269`). After `runPipeline`, a `keepSurvivingBreaks` beside `keepSurvivingGlosses` (`+page.svelte:2301-2304`) drops the stale rows from the song, so the record is as clean as the glosses are. Done-when (add): a record whose break key points at a different word transcribes with no hard boundary there on the first run, and the row is gone from the saved record after it.

### 3. The card's item list is not ratified, and as written it makes phase 1 a second Inspector: Dann's call, one question

Evidence. Design §4 is headed "DESK DRAFT". QUEUE row 152 records Dann's "yes" of 01:07 for the three-way dismissal and the three conditions, not for the item list. The stress item needs a syllable choice and then a provenance choice (`InspectorPanel.svelte:393-407`); ё needs a character choice (`:504-531`); gloss needs a 20-character field (`:849-858`); the dictionary's other readings need the entry list (`:963-969`). None of those has a card string in `i18n.ts`, and the brief forbids inventing one. Each is a second drawing of an Inspector control, and the guards they need are component-local (amendment 4).

Cost if not amended. Step 3 is three builds in one, every label is owed, and the first thing a singer meets is a crowded sheet for a feature whose ruled purpose is one item.

Replacement text, step 3 "The card's items" (paste over), pending Dann's answer:

> Phase 1 carries: **Break after this word** or **Remove break** (Witness Lyrics only; step 1's writer); **Reset**, only when `hasOverrides` (`InspectorPanel.svelte:377-379`), calling `handleReset` (`+page.svelte:2306-2323`); **More in the Inspector**, calling `handleWordClick` (`:2191-2215`). Stress, ё, gloss, syllable boundaries, and the spot toggle stay in the Inspector in phase 1; the card's header shows the word's Cyrillic, so a singer sees which word they opened before any edit.

The question for Dann, one line: "Phase 1 card: break, Reset, and More in the Inspector only (desk recommends), or every Inspector edit now?" Also his: whether per-word Reset clears a break. DESK DEFAULT, his to wave off: yes, since Reset already clears the gloss, the other per-song mark (`+page.svelte:2317-2320`).

### 4. "The Inspector's own guards" cannot be imported from a `.svelte` file

Evidence. `canSpotToggle` (`InspectorPanel.svelte:65-67`), `hasOverrides` (`:377-379`), `canAssignStress` (`:383`), and `showRevertOption` (`:387-391`) are `$derived` values inside the component, over component-local inputs (`isUserStress`, `yoCharToggles`, `syllableCount`). A pure `word-card-items.ts` can only copy them, and a copy drifts. `InspectorPanel.svelte` stands at 2432 lines against a ceiling of 2432 (`scripts/ratchets.json`), so it cannot grow by one line.

Replacement text (add to step 3's module list): "Lift the guard predicates the card needs into a pure `apps/web/src/lib/text/word-guards.ts` taking `word`, the marks, and the gloss override, and make `InspectorPanel.svelte` import them so it shrinks; lower its ceiling in the same commit. A guard that the card and the Inspector compute differently is a failing test."

### 5. Two ceilings are already at their line: `pipeline.ts` and `+page.svelte`

Evidence. `scripts/ratchets.json`: `pipeline.ts` 1022, `+page.svelte` 5607. `wc -l` this session: `pipeline.ts` 1022, `+page.svelte` 5606. Step 2 adds at least an import and a call to `pipeline.ts`. Step 1 adds to `+page.svelte`: the carry line (`:2047-2052`), the Clear line (`:2134-2135`), the map on both Lyrics `processText` calls (`:439-443` and `:1847-1852`), `keepSurvivingBreaks`; step 3 adds the component at `:4372` and its handlers. "Only wiring lines" still crosses.

Replacement text (new step 0): "Before step 1, make room: move the console record out of `handleWordClick` (`+page.svelte:2209-2214`) and fold the two Lyrics `processText` option objects (`:439-443`, `:1847-1852`) into one helper in a new `lib/text/lyrics-options.ts`; in `pipeline.ts`, the break pass is one import and one call, and the module it calls is `lib/text/breaks.ts`. Run `scripts/ratchets.mjs` and report both numbers before step 1. If the room is not enough, stop and report which lines you would move; do not raise a ceiling."

### 6. Per-song sites the brief misses, and sites it names that need no change

Missed (read this session):
- The Clear path resets the gloss maps (`+page.svelte:2134-2135`); `doc.breaks = new Map()` goes beside them.
- `keepSurvivingGlosses` (`:2301-2304`) and its caller (`:2031`): amendment 2.
- `handleReset` through `resetWord` (`:2306-2323`): amendment 3's question.
- A third `processText` site: `derivedLines` (`:436-448`), the score's own text when Lyrics is empty, which reads `lyricsMarks` and so is a Lyrics witness. The break map goes there too, or a song that arrived from a score shows no break until the singer types.
- `document.svelte.ts:455`, a second `recordFromFields` caller: NOT READ beyond the line; Code says what it serves and whether the map passes through it.
- The binder: `exchange.ts` imports `buildBinder` from `binder.ts` (`exchange.ts:21`); `binder.ts` NOT READ (grep reports it as binary-matching). Code says whether a record crosses the binder through `validateRecord` (`library.ts:166`), where the additive rule holds, or through a copy of its own.

Needing no change, say so in the brief: `undo-history.svelte.ts:44-71` carries corrections, pairings, the selection, and `seatedText`, not the glosses; a break follows the gloss and is not undone by the stack. `witness-lines.ts:29` is the Poem witness and takes no map (Poem gets no break, section 2). `switchSong` (`+page.svelte:3146-3175`) replaces `doc`, so the map switches with it.

### 7. A wrong claim about Markup

Evidence. "Markup's `onwordclick` path calls `handleWordClick`; leave it as it is" (step 3, "What a press does now"). `handleWordClick` has one caller, Paper at `+page.svelte:4372`; `MarkupPane.svelte` has no `onwordclick` (grep this session). After step 3, `handleWordClick` is reached only from "More in the Inspector".

Replacement: "`handleWordClick` (`+page.svelte:2191-2215`) keeps its body and is called only from More in the Inspector; Markup has no word press today (`MarkupPane.svelte`, `onnotepick` only; QUEUE row 152 item 8)."

### 8. The card's lifecycle: when it must close

Evidence. `selectedWord` is cleared when the shown witness changes (`+page.svelte:467-470`); `switchSong` clears session state (`:3146-3160`); `runPipeline` replaces `lines` and re-reads the selection by key (`:1856-1862`), so the word a card was opened for can change under it on a typing pause. The brief names none of these.

Replacement (add to step 3): "The card closes, with no edit, when the shown witness changes, when the song switches, and when `lines` is replaced by a transcription; it is opened only for a non-Latin word (`WordStack.svelte:129-133`). A muted poem word (`VerseLine.svelte:79`) opens the Inspector today with no guard (`handleWordClick`); the card does the same and Code reports what the singer sees."

### 9. Which rulings the card departs from, and why that is allowed (tether 19)

Evidence. `Loupe.svelte:3-7`: Dann 2026-08-25, "nothing floats over the paper, except the loupe", the named singular exception to the Calm Authority shape rule. `CONTRACT.md:124`: "Do not put a control on the paper: drawer manipulates, page displays and prints"; passing layers, the loupe, and the Transposition ruler float above it and never print (2026-09-28). The Clef chip (OPEN.md:3248, 2026-10-20 03:15) and Dann's 00:52 ruling (`PRODUCT.md:1257`, "context-appropriate cards... the on-score Clef selector... lean into it") are later and explicit. Tether 19 (`CONTRACT.md:63`): an older decision is a default with a reason; depart from it, say which in one line, keep the reason. The reason of 2026-08-25 was a quiet paper; the card keeps it: it appears only on a press, recedes on X, outside press, or Escape, and never prints.

Not a HOLD. Replacement (add to section 2): "This departs from the 2026-08-25 shape rule (`Loupe.svelte:3-7`) and from `CONTRACT.md:124`'s 'no control on the paper', on Dann's ruling of 2026-10-21 00:52 (`PRODUCT.md:1257`); the reason of both is kept: the card never prints and is gone when not pressed. The Clef chip of 2026-10-20 is the precedent."

### 10. Done-when items that cannot run or cannot fail as written

- 3.6 (scroll opens no card): Playwright's `page.touchscreen` offers `tap` only (`e2e-phone/clef-controls.test.ts:63`, `:77` use it); a swipe needs CDP `Input.dispatchTouchEvent` or a `page.mouse` drag, which is a mouse pointer, not touch. NOT ESTABLISHED which the harness permits; Code names the method and what it proves.
- 3.7: replaced by amendment 1.
- 3.1: assert the card is open before the equality compare, or the test passes on a tree where the press does nothing.
- 1.1 "an older record with no field loads whole" cannot fail on the unchanged tree; keep it as a guard and say so.
- The phone project is `playwright.config.ts:36-43` (390 by 844, `hasTouch`, `isMobile`, `deviceScaleFactor` 3), `testDir` `./e2e-phone`; the brief can name it.

### 11. Step 2: the pipeline's step 1.5 gate, and the name of B3's field

Evidence. `pipeline.ts:269`: `if (userStressOverrides?.size || yoToggles?.size)`; a break-only song never enters that block. `syntacticBreak` has zero hits on the tree at `efaa84a7`; its name is B3's DESK DEFAULT, not yet built. The brief's stop rule covers absence; add: "If B3 landed the field under another name, use that name and report it; do not add a second."

### 12. Cites to correct (each a small drift)

- `WordStack.svelte` four rows: `:158-204`, not `:176-205`.
- `handleWordClick`: `+page.svelte:2191-2215`, not `:2191-2222` (`:2216` begins `handleNotationChange`).
- Poem-shown gloss write: `:2286-2297`, not `:2279-2291`.
- `#snapshot` `document.svelte.ts:281-299`; `#apply` `:332-356` (the brief's `:287` and `:342` are the `glossAnchors` lines inside them, acceptable if said so).
- `validateRecord` `library.ts:166-280`; the glosses filter `:206-215`; the newest additive field's pattern `:267-273` (`publishedGlosses`).
- The phone scale: the brief says about 0.42 by arithmetic; `ClefControls.svelte:19-20` and `e2e-phone/clef-controls.test.ts:3-4` say about 0.48. Neither is a measurement; the harness test reports it.

### 13. Strings owed now, not after the build

`i18n.ts` has no close key for a card: `update.dismiss` (Dismiss / Ignorer, `:928`) and `calib.capture.toastDismissAria` (Dismiss / Fermer, `:1288`) are the nearest. "More in the Inspector" has no key. Desk drafts for Dann before step 3 starts: the X's name EN "Close", FR « Fermer » (the `:1288` French); the long way EN "More in the Inspector", FR owed (the Inspector's own name in `i18n.ts` is the glossary source; NOT ESTABLISHED this session which key names the Inspector). French is his.

## Checks that passed

- (a) Cites that hold as stated: `WordStack.svelte:131-139`, `:141-154` (the button, `data-word-index`, Enter and Space); `+page.svelte:2047-2052` (`carryOverridesAcross`), `:2241-2297` (the per-word handlers), `:4372` (Paper, `onwordclick={handleWordClick}`, `spotReconstitution={marks.spot}`, `glossOverrides={shownGlosses}`); `text-diff.ts:238-246`; `types.ts:90`, `:130`, `:146`; `document.svelte.ts:62-110` (`glossAnchors` at `:70`); `library.ts:47-74` (`glossAnchors` `:51`), `:78-108`, `:115-146` (the stored-only-while-set pattern `:121`, `:136-144`); `boundaries.ts:47`, `:14` (rule 3, the last word is hard, `:62-64` in code); `pipeline.ts:326-328`, `:313` (`userStressOverrides?.get(wordKey)`), `:745-748`; `ClefControls.svelte:36-37` (the `Anchor` shape), `:51-62`, `:72-90`, `:99-117`; `PageFit.svelte:46-51`, `Paper.svelte:68`; `InspectorPanel.svelte:65-67`, `:377-379`, `:383`, `:387-391`, `:481-488`, `:849-858`, `:963-969`, `:999-1003`, `:1012-1019`.
- (d) A `'user'` boundary survives: `autoDetectBoundaries` returns first on it (`boundaries.ts:47`); `joinAfterNe` (`ne-join.ts:39-52`) changes stress only, never indices or boundaries; nothing in `pipeline.ts` or `engine.ts` writes `rightBoundary` after step 2 except the engine's own unused `autoDetectBoundaries` (`engine.ts:1998-2035`, no caller); the engine reads `rightBoundary` alone at `:2171` and `:2249`, never the source. The hard boundary does not change which words are clitics: `isEnclitic` reads `punctuation` (`pipeline.ts:785-793`), so «X же» with a break after X keeps «же» attached and the # lands where B3 puts it; the brief rightly asks for a report, not a design.
- (c) `rekeyByWord` on a split or a join: the diff is a longest-common-subsequence over words (`text-diff.ts:56-70`, `:161-200`), so a retyped, split, or joined word is removed and added, never moved, and its key is dropped (`:242-245`). The brief's done-when 1.3 will find exactly that.
- (g) WYSIWYG: the break shows only as the # in the IPA, which prints because it is in the IPA; the card prints nothing (`@media print`, the `ClefControls.svelte:334` pattern). "Text prints what it shows" (OPEN.md:2819) holds.
- Strings: the four ratified strings are the only new singer-facing words the break needs; the brief forbids inventing others.
- The drawer on a phone: `handleWordClick` raises the drawer (`+page.svelte:2198`); the card path must not, and the brief's "the word's press opens the card, not the Inspector" already implies it. Say it.
- The z-order the brief asks about: drawer 60 (`Drawer.svelte:1894`), its pull bar 70 (`:1566`), clef hit 45 and chip, menu, sheet 80 (`ClefControls.svelte:231-233`, `:246`, `:258`), toast 200, loupe 9100 (`:232-233`). A card at 80 matches the clef sheet; under amendment 1 there is no hit layer to rank.

## Where it walls a singer in (cases the brief's section 5 misses)

1. **Poem shown on Text.** The break item is not offered (section 2), with no sign why. A singer who prefers the Poem transcription (N.186, OPEN.md:2819) presses a word, finds no break, and has no path but switching witness. The Guide sentence must say the break lives on Lyrics; the card could carry nothing else without a new string.
2. **A reload or a binder import.** No diff runs (`+page.svelte:1946-1950`), so the anchor is the only guard; without amendment 2 a moved word prints a wrong boundary once.
3. **A word before an enclitic.** The enclitic still attaches (`pipeline.ts:785-793`), and the # is grafted after the host's last syllable inside a fused IPA; what the singer sees is B3's to report, and the card gives no hint that the sound did not change.
4. **The last word of a line.** Nothing audible changes and the # appears; the singer may think the break did nothing. Ruled acceptable by the brief; the Guide should say a line end is already a break.
5. **An older Ilya opening a newer binder** drops the field silently (`validateRecord` copies only what it knows, `types.ts:126-128`); the same as every additive field, worth one Guide line with the others.
6. **A screen reader** hears the word as "cyrillic: ipa" (`WordStack.svelte:156`), so the # is announced inside the IPA after a break; the card's name and the X's name are owed (amendment 13) or the card is unnamed to that singer.
7. **A wrong pick on a dense line** is free only if the card names its word before any item (amendment 3's header).

## Could not establish

- `binder.ts` (binary-matching to grep; NOT READ): whether export and import pass through `validateRecord`.
- `document.svelte.ts:455`: what the second `recordFromFields` caller serves.
- `clef-ui.svelte.ts` beyond its length (114 lines): NOT READ.
- The Loupe's handling of words (phase 2; the brief says so).
- Whether `page.touchscreen` on the phone project can swipe (amendment 10).
- The real page scale on a device; 0.42 and 0.48 are both unmeasured.
- Whether `diffWordGrid` compares `cleanWord` or the typed form, so whether a punctuation-only retype moves or drops a key (`wordGrid` yields `cleanWord`, `pipeline.ts:217-222`, which suggests `cleanWord`; NOT READ in `diffWordGrid`'s body).
- `+page.svelte`'s line count after batch C lands.

## Answers to the four design questions

1. **One transparent layer under `PageFit`'s transform, with pinch zoom, and with the drawer open.** Not sound as a layer (amendment 1). Pinch zoom: `getBoundingClientRect` and `position: fixed` both live in the layout viewport, so the Clef pattern holds under visual-viewport zoom, and the delegated-click pattern needs nothing. The drawer: the card at 80 sits above the drawer (60) and its pull bar (70), as the clef sheet does; a sheet from the foot covers the drawer's pull on a phone, which the clef sheet already does and Dann accepted (row 144).
2. **Whole-word tap on a dense line.** The gap between stacks is 0.4rem in page space (`VerseLine.svelte:90`), under 3 px on screen at 0.42; the row gap is 20 px, about 8 px on screen. Resolve the line first (nearest by vertical centre), then the word by midpoint; the card's header names the word; opening changes nothing, so a wrong pick costs one X. That is enough for phase 1. Per-syllable regions stay phase 2.
3. **Walls.** The section above.
4. **"More in the Inspector" or a long press.** The item. A long press on iOS raises the selection callout unless `-webkit-touch-callout` is suppressed on the page, it is undiscoverable under the ruled "nothing" cue, and it is the gesture the browser uses for its own menu. A visible item is the long way a singer can find without the Guide.
