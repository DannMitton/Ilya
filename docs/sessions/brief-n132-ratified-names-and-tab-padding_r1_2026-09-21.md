# BRIEF N.132. The ratified names, and the tab padding

**Written 2026-09-21 by the desk. Shape from `BRIEF-TEMPLATE.md`.**
**There is no cause section. The template has no slot for one.**

---

## 1. What was observed

- **Dann ruled the change in, 2026-09-21 at 22:29**, on a drawing of three states.
  His words: *"Yes, I think Rwo 3 is our only viuable option."* Row 3 was the
  ratified names at 0.5 rem padding, in English and French, at a 390 px viewport.
- **A harness render, NOT a browser observation of Ilya.** The desk built a page
  copying `DeskHead.svelte`'s style block value for value and measured it in
  Chromium at a 390 px viewport. It agrees with `OPEN.md` §N.132's live-build
  figure within 0.9 px in both languages, which is the only control it carries.
  What it measured:
  - Today, English: the head needs 413.28 px against 342 px available, 71.28 px
    over, and `.pair`'s `overflow: hidden` cuts 69 px of text.
  - Today, French: needs 449.23 px, 107.23 px over, 105 px cut.
  - Ratified names at 0.7 rem, English: fits, 35.08 px spare.
  - Ratified names at 0.7 rem, French: 4.31 px over. Still does not fit.
  - Ratified names at 0.5 rem, English: 54.20 px spare. French: 14.81 px spare.
- **On the desk at an 816 px head, all three states fit** with 366 px or more spare.

## 2. What is established, each line carrying its `path:line`

Every line read in the tree on 2026-09-21.

- `i18n.ts:104` `tab.transcription` = `{ en: 'Transcription', fr: 'Transcription' }`
- `i18n.ts:115` `tab.markedScore` = `{ en: 'Score markup', fr: 'Partition annotée' }`
- `i18n.ts:119` `tab.insights` = `{ en: 'Insights', fr: 'Aperçus' }`. **Already correct.**
- `i18n.ts:57` `group.scoreMarkup` = `{ en: 'Voice', fr: 'Voix' }`. N.150, 2026-09-20.
- `i18n.ts:142` `a11y.paper` = `{ en: 'Transcription', fr: 'Transcription' }`, and
  `:135` records that `a11y.tabs` and `a11y.paper` are the same word in both languages.
- `DeskHead.svelte:197` `.pair-member { padding: 0.3rem 0.7rem; }`. **One match in the file.**
- `DeskHead.svelte` holds exactly two media queries: `:166`, `max-width: 767px`, which
  sets only `.desk-head { padding-bottom }`, and `:255`, print, which hides the head.
  **Neither touches `.pair-member`.**
- **Nothing outside `DeskHead.svelte` defines `.pair-member`.** `Loupe.svelte:2854`
  defines `.loupe-pair-member`, a separate copy made under N.149.
  `+page.svelte`'s `.sheet-print-btn` takes `padding: 0.45rem 0.5rem` from the
  drawer's quiet-button model, not from the pair.
- `DeskHead.svelte:48`, comment: *"DESKTOP ONLY in this increment: at 390 px the
  head does not hold three documents, and the direction there is Dann's to rule."*
- `DeskHead.svelte:58`, comment: the singer reads "Marked score" and
  « Partition annotée », ratified 2026-08-19. **This comment goes stale in this ship.**
- `.main-content` padding at `max-width: 1399px` is `1rem var(--portrait-gutter, 24px)`
  (`+page.svelte`, the `@media (max-width: 1399px)` block), and `--portrait-gutter: 24px`
  (`app.css:130`). So the head is 342 px at a 390 px viewport.
- **No test asserts `'Score markup'` or `'Partition annotée'` as a value.**
  `i18n.test.ts:28` asserts `a11y.paper` = `'Transcription'`, which is a different key
  and is not changed by this ship.

## 3. Measure before you change anything

Report these before writing code.

1. **Confirm the clipping on the live build**, at a 390 px viewport, in both
   languages, and give the number. The desk's numbers are a harness render. If the
   live build does not clip, say so and stop.
2. **Report what `a11y.paper` names on screen.** If it is the accessible name of the
   surface the `Text` tab selects, renaming the tab and not it leaves a screen reader
   saying "Transcription" where the tab says "Text". **Report it. Do not change it in
   this ship:** it is N.131 territory and unruled.
3. **Report whether any test or end-to-end selector matches a pair member by its text.**

## 4. The rulings this serves

- **Dann, 2026-09-13, ratified:** the tabs are `Text` / « Texte », `Markup` /
  « Annotation », `Insights` / « Aperçus ».
  **Amended since, and this part of the 2026-09-13 ruling is superseded:** the drawer
  band does NOT become Melody. `group.scoreMarkup` reads `Voice` / « Voix » by Dann's
  ruling of 2026-09-20 under N.150, ratified by him on screen. **The newer ruling stands.**
- **Dann, 2026-09-13:** the tab padding goes 0.7 rem to 0.5 rem. Nobody had seen it on
  screen until 2026-09-21. **Rendered and ruled in by him 2026-09-21 at 22:29.**
- **Dann, 2026-09-21 at 22:29, on consistency.** His words: *"We will have consistenct
  etween desktop and miobile, right?"* He was told: one value, every width, because the
  padding sits in the base rule and no media query touches it. He did not depart from that.
  **So one value across desktop and phone, and no width-conditional padding.**
- **`OPEN.md` §N.132 trap 1:** « Partition annotée » was ratified 2026-08-19 for the OLD
  name. **Do not carry it forward.** The short form « Annotation » is ruled for the tab.

## 5. Constraints

- **Do not touch `i18n.ts:57` `group.scoreMarkup`.** Renaming the band to Melody would
  undo N.150, which Dann ratified on screen 2026-09-20.
- **Do not touch `tab.insights`.** It is already correct.
- **Do not change `a11y.paper` in this ship.**
- **Do not add a media query for the pair's padding.** One value, per section 4.
- **Whether the KEYS rename alongside the values is a build decision, not a ruling**
  (`OPEN.md` §N.132). **DESK RECOMMENDATION, free to wave off:** keep the keys.
  `tab.markedScore` is cited by name in comments across the tree, and renaming it
  turns every one of those citations into a dangling reference.
- **What this displaces: nothing.** Everything `SCHEDULE.md` put in week 2 closed on the
  week's first day, 2026-09-21. This pulls a week 3 row forward. Say if that trade looks
  wrong from the code's side.

## 6. Done when

**WRITTEN:**

- `tab.transcription` reads `Text` / « Texte ».
- `tab.markedScore` reads `Markup` / « Annotation ».
- `.pair-member` padding is `0.3rem 0.5rem`, by anchor on the single match at
  `DeskHead.svelte:197`.
- Five gates at baseline.
- **The two stale comments are corrected in the same ship.** `:58` to the new names,
  recording the 2026-09-13 ratification and that 2026-08-19's « Partition annotée » is
  superseded. `:48`'s *"the direction there is Dann's to rule"* discharged by his ruling
  of 2026-09-21, recording that the three documents fit at a 390 px viewport at 0.5 rem
  with 54.20 px spare in English and 14.81 px in French.

**DONE is Dann's walk:** at 390 px and on the desk, in both languages, with Insights
reachable and no clipped text in the pair.

## 7. Report back

The commit, the results against section 6, the three readings from section 3, and
**what could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
