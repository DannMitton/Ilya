# WCAG 2.2 automated pass over Ilya, with a keyboard walk

Brief: `docs/sessions/brief-sonnet-wcag-automated-pass_r1_2026-11-22.md` (QUEUE row 140, step 1). Target: `DannMitton/ilya`, branch `Shane`, commit `c233daa`. Read-only: no code changed, nothing committed. Run in my own container. Dev server (`pnpm dev`) started on the first attempt, so no fallback route was needed.

## 1. Headline

- Seven rule types fired. They come to 28 distinct problems (one rule on one kind of element), spread over 1,315 flagged elements. Most of the 1,315 are the same few patterns repeated once per word on the page.
- I audited 35 distinct views, each in English and French, at 1,440 px and at 390 by 667 (120 audits in all). 30 of the 35 views carry at least one violation. The five clean views are the printed forms of the three blank documents, and the printed MELODY and INSIGHTS pages with a score loaded.
- **Yes, something stops a colleague completing the singer's path.** A person using only a keyboard cannot open the Loupe on a note. The notes of the score cannot be reached by Tab, arrow keys, Enter, or Space, and the code confirms why: the notes answer to a mouse click only. Every later step of the path works from the keyboard once the Loupe is open, but the Loupe cannot be opened. Section 2, barrier 1.
- Measured against the views I reached: Ilya does not currently meet WCAG 2.2 A, and does not meet AA.

## 2. The barriers, worst first (those that stop or seriously hinder a person)

**Barrier 1. The notes in MELODY cannot be opened from the keyboard.** This stops the path.
- View: MELODY with a score loaded. English, 1,440 px (the walk; the mechanism is the same in French and on the phone, which I did not walk).
- Criterion: 2.1.1 Keyboard (A). axe cannot test this one. I found it in the keyboard walk, and read the cause.
- Selector: `.score-page [data-hit]` (238 note targets drawn as SVG rectangles, none with `tabindex`, role, or name).
- What a person hits: a keyboard user arrives at the score and Tab skips straight over every note to the page footer links and the Print button. A screen reader announces no notes at all. There is no other route to the Loupe that I could find.
- Evidence: Tab, ArrowRight, ArrowDown, Enter, Space, and the digit 5 with focus on the page opened nothing (6 of 6 attempts). `apps/web/src/lib/markup/MarkupPane.svelte` lines 305 to 320: the note pick is a delegated `click` listener on `document`, and the comment there says the wrapper deliberately has no role and no tabindex. The correction keys (`+page.svelte` line 959, `createCorrectionKeys`) act only once a note is already selected, so they cannot start the path either.

**Barrier 2. The Loupe takes no focus when it opens, and sits last in the Tab order.** Hinders the path badly.
- View: the Loupe, English, 1,440 px. Opened by mouse, since the keyboard cannot open it.
- Criteria: 2.4.3 Focus Order (A), 2.4.11 related. Found in the walk, not by axe.
- What a person hits: after the Loupe opens, focus stays on the page body area. Reaching the Loupe's own controls took 15 Tab presses from the MELODY tab, through every footer link and the Print button of each page. Closing the Loupe with Escape drops focus to nowhere (the document body), so the person restarts from the top of the app.

**Barrier 3. Nothing announces a correction.** Hinders a screen-reader user; does not stop a keyboard user who can see.
- View: Loupe, Corrections mode. Criterion: 4.1.3 Status Messages (AA). Not an axe finding; found in the walk.
- What a person hits: pressing ArrowUp twice changed the note from B4 to D5 and the written readout changed, but the readout (`.readout`) is a plain element with no live-region marking. A screen reader says nothing. NOT ESTABLISHED: whether a real screen reader would announce it some other way. I ran no screen reader.

**Barrier 4. A 1-pixel unnamed text field is a Tab stop on every page.**
- View: every view with the drawer, all languages and viewports. Selector `.binder-input` (57 elements flagged, the second Tab stop after the language button).
- Criteria: 4.1.2 Name, Role, Value (A); impact critical.
- What a person hits: the second press of Tab lands on a field one pixel square at the top of the screen with no name. A screen reader says "edit text, blank". A sighted keyboard user sees a focus ring on nothing.

**Barrier 5. Each word in TEXT is announced by its Russian and its IPA only, not by what is printed.**
- View: TEXT, upload receipt, word selected. Selector `div[data-word-index]` / `.word-stack` (550 elements). Criterion 2.5.3 Label in Name (A, WCAG 2.1); impact serious.
- What a person hits: a voice-control user who says what they see (the English gloss or a syllable) finds nothing happens, because the spoken name is the Cyrillic word and its IPA. Screen-reader users hear the word, but not the gloss and syllables drawn with it.

**Barrier 6. The focus ring is pale sage on a cream page.**
- Criterion 1.4.11 Non-text Contrast (AA). This is my calculation, not an axe finding: sage `#7d9d76` against the page cream `#faf8f5` is 2.85 to 1, short of the 3 to 1 the criterion asks. Most Tab stops use this ring (`app.css` lines 213 to 216). The dark rings on the tabs and the white ring on the language button are fine. A person with low vision may lose track of where focus is on the drawer bands' inputs, links, and buttons. Calculated against cream only; the true figure depends on the surface behind each element.

## 3. The rest, grouped by rule id

| Rule | WCAG criterion | axe impact | Elements flagged | Distinct selectors | Example |
|---|---|---|---|---|---|
| `color-contrast` | 1.4.3 (AA) | serious | 354 | about 15 | `.sigil-name` white on sage `#7d9d76`, 3.01 to 1 (needs 4.5), text-empty app, English desk |
| `label` | 4.1.2 (A) | critical | 92 | 2 | `.binder-input` (barrier 4) and an unnamed `input` on LEARN |
| `label-content-name-mismatch` | 2.5.3 (A) | serious | 736 | many, one per word | `.word-stack[data-word-index]` (barrier 5) |
| `target-size` | 2.5.8 (AA, new in 2.2) | serious | 89 | 20 | per-word buttons on the 390 px phone layout, below 24 by 24 px |
| `scrollable-region-focusable` | 2.1.1, 2.1.3 (A) | serious | 40 | 2 | the LEARN glyph table (`table`, `.gt-table`) on the phone: it scrolls, and a keyboard user cannot scroll it |
| `aria-required-children` | 1.3.1 (A) | critical | 2 | 1 | `.ribbon-body`, with the Inspector open on a selected word: a button where the list role forbids it |
| `nested-interactive` | 4.1.2 (A) | serious | 2 | 1 | `button[data-cell-id]` inside another control, Inspector open: some assistive technology can still focus it |

(Counts add across English and French; the two languages gave near-identical results. Contrast detail: small text in the lavender and grey tones on the Loupe header (`.tab-mark`, `.metadata-line`, `.header-note`, `.ipa`, 4.2 to 1), the receipt buttons (`.receipt-btn`, 4.25 to 1), the welcome sheet's small captions (`li[data-f]`, 1.94 to 1), the VOICE "back" link (`.takeover-back`, 4.1 to 1), and the legend labels under the score on MELODY. Each falls short of 4.5 to 1. The welcome sheet's 1.94 to 1 is the worst.)

Rules that ran and found nothing on the views reached: button and link names, image alternatives, language of the page, duplicate ids, bypass blocks, and document title. Per axe, the welcome sheet's dialog is correctly marked and (confirmed by the repo's own test file, not re-checked here) holds focus.

## 4. The keyboard walk (English, 1,440 px, Chromium; score: Tchaikovsky op. 38 no. 3)

1. **Open the app.** The first Tab goes to the language button (visible white ring), the second to the unnamed 1-pixel field (barrier 4), then the five drawer bands, POEM, the poem box, "choose a file", then back out to the page: the TEXT tab (a `main` region also takes a stop before it), LEARN, GUIDE, links, Print, then the browser. Order matches the visual order. Every stop showed a ring, in sage, dark ink, or blue depending on the area.
2. **Load a score.** Enter on "choose a file" opened the file picker in about 3 of 9 walks and not in the others. In separate focused tests (6 of 6) Enter on the same button opened it every time, so I cannot tell a real intermittent fault from my test harness. NOT ESTABLISHED. After the score loaded, focus fell to the document body (focus lost), though the receipt appeared.
3. **Switch to MELODY.** ArrowRight on the TEXT tab moves to MELODY and selects it in one step. Works.
4. **Open the Loupe on a note.** Not possible from the keyboard (barrier 1). I opened it with the mouse so the walk could go on.
5. **Loupe opens.** Focus stays on the page area, not in the Loupe (barrier 2). 15 Tab presses to reach the Loupe's mode tab.
6. **Make one correction.** On the SYLLABLES mode tab, ArrowRight moved focus and selected CORRECTIONS. With focus released to the page, ArrowUp twice changed B4 to D5 and ArrowRight moved the cursor to the gap after the word. The keys work. Nothing is announced (barrier 3).
7. **Close the Loupe.** Escape closes it and focus drops to the document body.
8. **Switch to INSIGHTS.** ArrowRight from MELODY moves to INSIGHTS and selects it. Works.

Also seen: pressing Tab through a score page repeats the footer links (kaikki.org, CC BY-SA 4.0, dannmitton.com) once per printed page, so a three-page score has nine link stops before Print. Not a failure, a cost.

Mid-walk, one Enter press landed on the receipt's "Clear" button and cleared my test score. This was my test script's mistake, in my own container. It is worth knowing that "Clear" has no confirmation I could see, but I did not test that.

## 5. The measured level

- **WCAG 2.2 A:** not met on the views reached. Standing in the way: 4.1.2 (`label`, `nested-interactive`), 1.3.1 (`aria-required-children`), 2.5.3 (word names), 2.1.1 (the notes, and the scrolling glyph table on the phone).
- **WCAG 2.2 AA:** not met. A is not met, so AA cannot be. In addition: 1.4.3 (contrast, 354 elements), 2.5.8 (target size on the phone), and by my calculation 1.4.11 (focus ring) and 4.1.3 (corrections not announced).
- **The next level up (AAA):** I did not run AAA rules. Not measured. To reach A and AA, the criteria above are the whole list that I could find. It is not a proven complete list (section 6).

## 6. What I could not establish

- **No screen reader was run.** Everything about what is "announced" comes from axe and from reading the page's markup. Whether VoiceOver, NVDA, or JAWS makes sense of the score, the Loupe, or the IPA is NOT ESTABLISHED. The IPA and Cyrillic in aria-labels may be read in an English voice and mangled.
- **Checks axe cannot automate** and I did not do by hand: reading order against meaning, correctness of the alt/label wording, 1.4.10 reflow at 320 px, 1.4.12 text spacing, 2.4.7 beyond the computed outline check, 3.3.x error handling, 2.5.7 drag alternatives (does anything need a drag?), 2.2.x timing (the capture screen counts down 8 seconds), 1.4.1 colour as the only cue (the lavender "marked score" and the rose and lavender legends are colour-coded; I did not test them), 1.2 media.
- **The vowel capture screen ran on the development stub** (`?capture=stub`, available only on a dev server), not a real microphone. I audited its markup, not its microphone permission prompt or error states.
- **The Loupe was opened by mouse.** Its audit is of the open Loupe. The keyboard walk covered English at 1,440 px only. I did not walk French, nor the phone layout by keyboard.
- **Print was emulated** with Chromium's print media setting, not a printed page. It shows the printed layout's markup, not the pages.
- **Only one score** (Tchaikovsky) drove the walk and audits, and the Sunless score was not audited. Other scores may draw other elements (grace notes, key and time cards, clef controls, ornament cells) that I did not reach. The loupe's other bands (clef, key signature, time signature controls) were not opened.
- **The contrast figures** are axe's, which cannot see text over images or inside the score's SVG notation. Contrast of the notation itself is NOT ESTABLISHED.
- **Dev build, not production.** I ran the `Shane` dev server, not a build. Nothing was served from the live site, so the fallback route of the brief was not used. Behaviour of the service worker and the installed app (PWA) is NOT ESTABLISHED.
- **Outbound requests.** During all 120 audits, the browser contacted no origin other than the local server: none. The `pnpm dev` script itself, before the server starts, downloaded five OMR model files (about 213 MB) from `github.com/liebharc/homr` releases (`apps/web/scripts/fetch-omr-models.mjs` line 39). That is the build tooling, not the app at run time, but it is an outside host. Note for the separate sweep the brief mentions. The walk script did not record outbound requests, so the walk itself is not covered by this statement.
- **The Enter-on-"choose a file" inconsistency** (section 4, step 2) is unexplained.
- **My count of "distinct violations" (28)** collapses per-word repeats by pattern. A different collapse gives a different number. The element count (1,315) is exact for what axe returned.

## 7. Actuals

- Route: the dev server, section 2's primary route. Dev server started on first attempt. Playwright with the sandbox Chromium revision 1243 (`/opt/pw-browsers/chromium-1243`, not the 1194 the brief names; 1194 was not present). Viewports 1,440 by 900 and 390 by 667. axe-core with tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa.
- Tokens: I do not have an exact count. My estimate is about 150,000 to 200,000, well under the 350,000 cap. This is an estimate and not a measurement.
- Tool uses: about 55.
- Wall-clock: about 60 minutes. Estimate; I did not keep a timer.
- Files outside this report: scripts in `/home/claude/audit/` (`audit.mjs`, `kb.mjs`, raw `out.json`) in my container. Not delivered.
