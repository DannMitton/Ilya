# Report, lane 74, step 6: renders and measurements at 390 px

Everything below is measured in a browser on the changed tree, not read from CSS (`AGENTS.md`: "Measure the live render"). Chromium (the sandbox's `/opt/pw-browsers`), viewport 390 by 844 unless a row says otherwise, `isMobile` and `hasTouch` on, `deviceScaleFactor` 2 for the pictures, the development server in stub-capture mode (`/?capture=stub`). Heights are `getBoundingClientRect().height` in CSS pixels. The voice was seeded in `localStorage` (`shane.profiles.v2`). The harness scripts are in the session scratchpad and are not committed. Pictures are in `docs/sessions/lane74-step6-shots/`.

## 1. The VOICE pane's sentence block (item 1)

The block is `.vp-sentence`, 322 px wide at this viewport. One line is 20.3 px.

| Voice | Language | Characters | Height | Lines | Picture of the block | Picture of the screen |
| --- | --- | --- | --- | --- | --- | --- |
| contralto, nothing sampled | EN | 150 | **60.89 px** | 3 | `pane-sentence-nothing-en.png` | `pane-screen-nothing-en.png` |
| contralto, nothing sampled | FR | 192 | **81.19 px** | 4 | `pane-sentence-nothing-fr.png` | `pane-screen-nothing-fr.png` |
| contralto, three stable core vowels ([i], [e], [ɛ]) | EN | 375 | **142.08 px** | 7 | `pane-sentence-core3-en.png` | `pane-screen-core3-en.png` |
| contralto, three stable core vowels | FR | 499 | **202.97 px** | 10 | `pane-sentence-core3-fr.png` | `pane-screen-core3-fr.png` |

For comparison, the unchanged sentence of a published type (a bass, nothing sampled, the same pane) measures 40.59 px in both languages (2 lines; 72 characters in English, 103 in French).

What the screens show (I looked at all four pictures): in all four, the sentence block reads in full, wraps at the pane's edge, and the two doors (in English "Record your vowels" or "Carry on recording", and "Your vowel space"; in French « Capter vos voyelles » or « Continuer la captation », and « Votre espace vocalique ») sit below it, both inside the 844 px screen. In the French three-vowel screen the lower door ends about 21 px above the bottom bar (read off the picture). **What does not fit:** the browser-storage reminder that follows the doors. In the English three-vowel screen its last line runs under the bottom bar ("them safe." is cut), and in the French three-vowel screen it is below the screen edge, so a singer scrolls to read it. In the two nothing-sampled screens it fits. I did not redesign the pane.

## 2. The picker's note (item 4)

### In the VOICE pane (`VoiceTypeIntake`)

Contralto selected. The group is `fieldset.vt-question`, 314 px wide.

| Language | Note | Group | Picture |
| --- | --- | --- | --- |
| EN | 72.75 px (4 lines) | 367.61 px | `picker-intake-en.png` |
| FR | 72.75 px (4 lines) | 367.61 px | `picker-intake-fr.png` |

The note sits directly under "Not sure" and above "Clear answer", inside the fieldset.

### In the wizard's first question (`VoiceTypeFirst`)

A voice with no type, the wizard's first screen, Contralto selected. The note is outside the two-column grid, under it.

| Language | Note | Fieldset | Picture |
| --- | --- | --- | --- |
| EN | 72.75 px (4 lines), 322 px wide | 273.03 px | `picker-first-en.png` |
| FR | 72.75 px (4 lines), 322 px wide | 291.22 px | `picker-first-fr.png` |

**Does the note push Begin off a phone screen?** At 390 by 844, no. Begin's bottom edge moves from 629 px to 708 px (English) and from 692 px to 771 px (French) when Contralto is chosen, 79 px lower in both, and stays inside 844 px: 136 px clear in English, 73 px clear in French. The same holds for countertenor and bass-baritone, whose notes also measure 72.75 px.

At 390 by 667 (a shorter phone) the bottom edge after choosing Contralto is 672 px (English) and 671 px (French), 4 to 5 px past the 667 px edge. Playwright scrolls a radio into view when it checks it, so those two numbers are positions after that scroll. **NOT ESTABLISHED: whether a singer on a 667 px phone sees Begin without scrolling.** I did not measure heights between 667 and 844.

**The cost to the six choices that carry no note.** The empty live region stays in the page, and the fieldset is a flex column with `gap: 0.3rem` (read in `VoiceTypeFirst.svelte`), so it adds one gap, 4.8 px. Measured against a pristine copy of the tree for the same choice (Tenor) at 844: Begin's bottom edge is 627 px before and 631 px after (English), 690 px before and 695 px after (French). The same tree read 624 to 631 px across loads, so the scatter between loads is about 3 px; the shift is consistent with one 4.8 px gap and I did not separate the two.

### How it announces

Both pickers carry `aria-live="polite"` on the region (read from the DOM: `polite` in both). The accessibility tree of the region holds one paragraph with the note's text, in English and in French, for contralto, countertenor, and bass-baritone (`ariaSnapshot`, for example `- paragraph: La recherche n’a pas encore publié de valeurs de résonance pour un baryton-basse. Ilya peut partir de la portée de basse, ...`). For Tenor the region is empty. Focus stays on the radio.

**NOT ESTABLISHED: what a screen reader says or when.** No screen reader ran. The tree shows a polite live region present before its text arrives, which is the pattern that announces; the speech itself is not observed.

## 3. The note and the pane's sentence together, for a contralto

The pane with the type row open and Contralto chosen, nothing sampled. This is the only view that shows both readings of the concession. The picture is the whole pane in a 390 by 1500 viewport (a taller screen than a phone, so both appear in one picture): `combined-note-and-sentence-en.png`, `combined-note-and-sentence-fr.png`.

| | Note | Sentence | Distance from the note's bottom to the sentence's top |
| --- | --- | --- | --- |
| EN | 72.75 px, top 624, bottom 697 | 60.89 px, top 965 | 268 px |
| FR | 72.75 px, top 624, bottom 697 | 81.19 px, top 965 | 268 px |

Between them sit the rest of the type group ("Clear answer", the "More specific" group, and Other's field) and the two collapsed stations "Describe your voice" and "What INSIGHTS shares, and how". At 390 by 844 the two do not fit on one screen: the note's bottom is at 697 px and the sentence's top at 965 px, so a singer scrolls between them.

What the picture shows, without a ruling on it: both begin with the same clause, "The field has not yet published resonance values for a contralto" in English and « La recherche n’a pas encore publié de valeurs de résonance pour un contralto » in French, 268 px apart. The brief expects this (section 1: the two are not redundant, one is read at the moment of choosing and the other on return). Whether a singer who reads one right after the other finds it a repetition is a judgement I did not make.

## 4. One render each, for the bass who chose octavist (English)

The voice: Tier 1 `bass`, Tier 2 `octavist`, nothing sampled, the fixture `src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` loaded. Text read from the DOM:

- **MELODY's subtitle:** "Resonance profile: placeholder values for a generic bass, not yet your own resonances." (the page prints it in capitals by CSS). `melody-bass-octavist-en.png`.
- **INSIGHTS' lede:** "These findings use placeholder values for a generic bass, not your specific voice." `insights-lede-and-chart-caption-bass-octavist-en.png`, which also shows the chart caption.
- **The vowel chart's caption:** "against where each vowel turns in a generic bass". The page holds two copies of this text, one hidden and one visible; the picture shows the visible one. NOT ESTABLISHED: what the hidden copy is for (print, I suspect, but I did not read it).

**Seen and not acted on.** INSIGHTS' heading line, two lines above the lede, still reads "INSIGHTS FOR DANN · OCTAVIST · NOT CALIBRATED". That is the identity line, which prints the label the singer chose (`voiceTypePrint` on the whole choice), and it is not one of the sentences the brief's item 3 names. It now sits next to a lede that says "generic bass". Whether that is wanted is Dann's.

## 5. What this step changed

Nothing under `apps/`. It added the pictures in `docs/sessions/lane74-step6-shots/` (16 PNG files, 2.3 MB on disk) and this report.
