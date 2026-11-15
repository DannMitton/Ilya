# Critique: Ilya welcome sheet, draft 15

Reviewer: Fable (subagent), 2026-11-15. Rendered and looked at: draft 15 at 1100 x 1000 (first frame, station 3, station 5, final) and 390 x 1300; draft 16 at 1280 x 800, 1024 x 600, 390 x 844, and 390 x 1150. Tokens read from `apps/web/src/app.css`; app chrome read from `report-code-n199-step8-pictures/05-summary-sheet-desk-en.png` and `07-room-notice-phone-en.png`.

## Verdict

Draft 15 has a good idea inside a layout that works against the singer. The idea: one small page that turns from a Cyrillic letter into a vowel, a note, a vowel zone, the vowel space, and then the icon. The layout problems: the motion hides the one paragraph that must be read, Begin is off screen on a laptop and on a phone, and the card looks like a page of the app, not a notice from the app. Keep the page and its diagonal turn. Stop the travel, stop the text mask, and rebuild the sheet in the grammar the app's own drawers already use.

## What works

- The diagonal wipe. A 30-degree edge sweeping down reads as a page turning. It is quiet and it is Ilya's own.
- The sequence from я to [ɑ] to the [ɑ] zone. The same vowel returns as a place on the chart. That is the app's argument in three images.
- The icon as the last image. The sheet ends by showing the thing the singer will look for on a home screen.
- Every glyph and zone is real: Source Serif 4, Lato IPA, Bravura, the bass zones from `computeZones`.
- The fallibility paragraph's wording. It is direct, and it names the teacher or coach.

## What fails, ranked

1. **The text mask hides the fallibility paragraph for six seconds.** At station 3 (render `a15-s3.png`) every line is cut in half down a vertical edge. People read along lines, not down columns, so nothing is readable until the sweep finishes. The one text that must be read before Begin is the text the animation withholds. This harms the singer, so I argue against it as a ruling.
2. **Begin is not available from the first frame.** Three separate faults: (a) the Begin button sits inside the masked block, so at station 3 half of it is invisible; (b) the sheet is about 1,010 px tall, so on a 13-inch laptop Begin is below the fold; (c) on a 390 px phone Begin sits near y = 1,300, more than a screen of scrolling away.
3. **The sheet does not read as chrome.** It is paper-coloured (`#F5F1E8`), with a soft tinted shadow, on the bare desk. In Ilya, cream with a soft shadow on the desk means "the page". Nothing says "this is the app speaking".
4. **Motion and reading compete.** The page travels 76% of the card width while changing image once a second, directly above text the reader is trying to begin. The eye is pulled sideways and away for six seconds, then pulled once more as the page glides back and squares itself.
5. **Seven images at about one second each is too many to read.** The lone eighth note and the note on a staff say the same thing; the lone note is also the weakest image (off-centre, no context).
6. **The vowel space is illegible in a tall page.** A landscape chart in a 3:4 portrait tile fills under half the tile (render `a15-s5.png`). The image the whole sequence builds toward is the smallest thing in it.
7. **The rim colours make claims that are not true.** The code comment assigns slate (LEARN) to [ɑ] and cobalt (GUIDE) to the eighth note. Those families do not own those images. A colour that changes six times with no legend is noise; a colour that names the wrong family is a small untruth.
8. **The text has one voice.** Three paragraphs at one size, one weight, one measure. The fallibility paragraph is an 80-word block in a pale box; its first sentence (the claim) and its last clause (the instruction) look like everything between them.
9. **The title's fade from 6% grey** means the first frame has no readable headline. It buys nothing.
10. **The phone gets no animation at all**, because the animation depends on travel. A phone is where many singers will first open Ilya.
11. **No language control on a bilingual sheet.** The app's Français pill is in the app header; a sheet in front of the app covers it. A francophone singer must press Begin on English text before reaching French.
12. **The 28 px corner radius** is rounder than anything in the app (drawers about 16 px, `--float-radius` 10 px). It reads as a different product.

## Dann's four concerns

### 1. A device that cues "chrome, not content"

Recommendation: use the grammar Ilya's drawers already speak, plus a scrim. Ranked:

1. **Scrim, head band, UI surface, float shadow (recommended, built in draft 16).** The app dims behind the sheet. The sheet body is `--drawer-bg` (`#FAF8F5`), the colour Ilya uses for panels, and paper cream is left to mean paper. A 40 px `--sage-head` band across the top carries a tracked small-caps label, exactly as the VOICE drawer does. The shadow is the app's own `--float-shadow` plus a 1 px ink ring. Cost: one new label word (see "Open items").
2. **Outline alone.** A 1 px ink ring on the existing card. Cheap, but paper with an outline still reads as paper.
3. **Drop shadow alone.** The draft has one already and it is not enough; the page in the app has a shadow too.
4. **Chamfered edge.** Foreign to Ilya. Nothing else in the app is bevelled, so it would read as decoration, and decoration is the opposite of a chrome cue.

The small plate inside the sheet stays paper cream. That keeps the meanings clean: the sheet is the app, the plate is a page.

### 2. The text arrangement

Recommendation: set it as a title page with a colophon. No words change. Built in draft 16:

- The title, solid from the first frame, at 34 px, set flush with the text column.
- The fallibility paragraph in the sage wash, with its first sentence lifted to a 20 px semibold lead line and its final instruction ("confirm anything *Ilya* tells you with your teacher or coach before you rely on it.") in semibold. One claim, one instruction, visible at a glance; the reasoning between them at reading weight.
- The two credits as a colophon row in smaller, secondary ink: Grayson's under the plate, Dann's under the text column. The method and the maker sit side by side as peers, and the bottom of the sheet is balanced.
- The two fine lines move into a footer bar with Begin at its right. The footer never scrolls.

### 3. Everything is open: font, outline, speed, animation, concept, narrative

- **Font.** Keep Source Serif 4, Source Sans 3, Lato IPA, Bravura. The problem was hierarchy, not typeface.
- **Concept.** Keep "one small page that turns". Drop "a page that travels". The plate stays in place beside the text and turns five times.
- **Shape.** Make the plate square from the first frame. It is the icon's shape, so the squaring move at the end is no longer needed, and the chart gets a landscape box close to the app's own proportion.
- **Narrative.** Six images, five turns: я, [ɑ], the note on a staff, the [ɑ] zone, the vowel space, the icon. Under the plate, three of the app's own labels (TEXT, MELODY, VOICE) light in turn, in their family ink. The labels tell the singer what the pictures mean and how far along the sequence is. When the icon arrives all three rest in grey.
- **Speed.** 720 ms per turn with a 380 ms rest, 5.5 s in all, eased (`cubic-bezier(.45,0,.25,1)`), run once. Because nothing is hidden and nothing travels, the length costs the reader nothing.
- **Outline.** The coloured rim is replaced by a 1 px hairline. Colour moves to the labels, where it is true.
- **Phone.** The plate shrinks to 76 px beside the title and still turns. The fallibility paragraph starts on the first screen. Begin is full width in a fixed footer.
- **Leaving.** Begin fades the sheet and scrim out in 180 ms ease-out (the app's `--motion`), opacity and transform only.

### 4. Whether to involve Design

**Yes, for one thing; no for the rest.** I checked the account: a "Design" type exists (live artboards on a canvas), and so does a "Design System" type.

- **Yes: one Design canvas of still artboards for the taste rulings.** Desktop and phone, English and (once drafted) French, and two or three chrome variants side by side (head band with label; head band without label; outline only). Those are choices where two competent people would differ, and Dann rules them faster by looking at them together than by opening HTML files in turn.
- **No: not for the motion.** Timing, easing, and the wipe live in code and are judged in a browser at real speed. Whether a Design artboard plays this animation faithfully is NOT ESTABLISHED; I did not test it. The HTML draft stays the instrument for motion.
- **No: not a Design System artifact.** Ilya's tokens live in `app.css`. A second copy on a canvas would drift from the tree.

## What draft 16 does not settle (open items for Dann)

1. **The label WELCOME is my word, not Dann's.** The band needs a label to match the drawers. DESK DEFAULT: "WELCOME". Its French is Dann's to rule; none is drafted.
2. **The Français pill on the sheet is a stub.** It is there to show the need (failure 11). No French text is drafted in this file.
3. **The backdrop behind the scrim is a schematic** of the app (band, drawer, paper), drawn only so the draft has something to sit over. In the app the real screen is behind the scrim.
4. **MELODY and VOICE both light in lavender ink.** That follows the icon's stripe order as briefed and the VOICE drawer's head colour in the screenshots. If MELODY's family is different in the tree, the label colour changes in one line.
5. **The semibold on the final instruction** is an emphasis Dann did not write. It is a setting, not a wording change, but it is taste.
6. **Focus.** The draft does not move focus to Begin on open, so Enter does not skip the reading. Focus trapping inside the dialog is for the build, not the draft.
7. **Phone, scrolled to the end**, was checked by rendering a taller phone (390 x 1150) where everything fits. A scrolled 844 px capture did not behave in headless Chrome, so that exact state is not confirmed by a picture.

## Terms

Coined here: "plate" (the small square page that turns), "colophon row" (the two credits side by side), "stations" (the three labels under the plate; the word is from draft 15's code comments). Adopted from Ilya: desk, drawer, head, band, wash, jewel, ink, float shadow, scrim.

## Files

- Draft 16: `/mnt/user-data/outputs/ilya-welcome-draft-16-fable.html`
- Generator: `/home/claude/welcome/gen16.py`
- Renders: `/mnt/user-data/outputs/fable-welcome-1-desktop-first-frame.png`, `fable-welcome-2-desktop-mid-wipe.png`, `fable-welcome-3-desktop-final.png`, `fable-welcome-4-phone.png`
- Working renders of draft 15 and 16: `/home/claude/welcome/fable/`
