# Skins for Ilya: research report, r1, 2026-11-21

Tree read at `ac4bc6d8`. Every claim carries a source tag: `[R#]` is a file in the repository (path and line), `[W#]` is a web page or dataset I read this session. The full list is under SOURCES. Where I could not establish something, it says NOT ESTABLISHED. Web pages were read through a fetch tool that returns an extraction, so every web source is marked read-in-part. The same text is at `/mnt/user-data/outputs/research-skins_r1_2026-11-21.md`.

## Summary

Ilya already has suitable bones for skins (a six-step token ramp per hue, 66 named custom properties, five font slots), but it has no switching mechanism, no focus-ring token, a hard-coded IPA face in at least ten places, and several hundred hex literals outside the token file, so the work is a token migration before it is a design exercise. The defensible product is three independent layers (a Dress, a Reading layer, and the device's own contrast and motion signals), six dressed directions that keep the hue-names-one-idea map intact, and a control beside the language pill; the evidence does not support any claim that a dyslexia-specific typeface helps, and the report says so plainly.

## What the tree holds (confirmed and corrected)

- **Token count, corrected.** `app.css` has 67 custom-property definitions, 66 unique names; the 67th is a print override of `--paper-cream` at `apps/web/src/app.css:236` [R1]. The desk's figure of 74 did not reproduce.
- **Five hue families, not four.** sage, lavender, rose, cobalt, and slate, each with six steps: base, desk, head, wash, jewel, ink (`app.css:42-71`) [R1]. Slate is the book (LEARN) per the comment at `app.css:33-41` [R1].
- **A documentation conflict.** `docs/memory/PRODUCT.md` (the 2026-09-13 ruling transcription, around line 1231) still says "umber the book" [R5]. The tree's palette, ratified 2026-10-30, uses slate. The tests read slate. I treat the tree as current and flag the PRODUCT.md wording as stale.
- **Neutrals and surfaces:** `--ink-primary #1a1612`, `--ink-secondary #4a4540`, `--ink-tertiary #6A655F`, `--ink-stave #3A352F` (`app.css:28-31`); `--paper-cream #F0EBE0`, `--paper-light #F5F1E8`, `--drawer-bg #FAF8F5`, `--desk-surface #D8D4C8` (`app.css:78-82`) [R1].
- **Five font slots:** `--font-serif` Source Serif 4, `--font-sans` Source Sans 3, `--font-mono` Menlo, plus the aliases `--font-body` and `--font-ui` (`app.css:23-25, 183-184`) [R1]. All text faces are self-hosted: `google-families.css` describes Ilya's own copies of Source Sans 3, Source Serif 4, Noto Sans, and Noto Serif, with an OFL licence file per family [R14].
- **`Lato IPA`** is a self-hosted subset declared at `app.css:13-19`, made because the Google-served Lato omits five IPA Extensions vowels the pacifier needs [R1]. It is named as a literal font-family in at least ten places: `Tessituragram.svelte:112`, `WelcomePlate.svelte:123`, `MarkupPane.svelte:1231`, `VowelSpaceSheet.svelte:397`, `ChartLayers.svelte:192`, `CalibrationWizard.svelte:929`, and `VowelCapture.svelte:486, 596, 761` [R16]. Worse for skinning, `selection-ring.ts:199` tests the string `'Lato IPA'` in an SVG `font-family` attribute to measure IPA height [R16]. The IPA face is therefore load-bearing identity, not a token.
- **No theme switching.** A search of `apps/web/src` and `apps/web/static` for `prefers-color-scheme`, `prefers-contrast`, `forced-colors`, `data-theme`, and `data-skin` found nothing. The only media feature in use is `prefers-reduced-motion`, in about twenty files, for example `Drawer.svelte:1596` and `Loupe.svelte:2648` [R16].
- **`theme-color`** is `#7D9D76` in `app.html:41` [R3], the manifest's `theme_color` and `background_color` are the same value [R4], and `colour-story.test.ts:127-130` asserts all three equal `--sage` [R2].
- **No settings surface exists.** The header bar has two children, the sigil and the language pill (`HeaderBar.svelte:51-58`) [R9]. Language persists in `localStorage` under `ilya:language`, written at `+page.svelte:3400` and read at `+page.svelte:3640` inside `onMount` (the block opening at 3589) [R10].
- **Focus ring:** one global rule, `:focus-visible { outline: 2px solid var(--sage); outline-offset: 2px }` (`app.css:213-216`) [R1]; the VOICE group overrides it to lavender (`Drawer.svelte`, rule beginning near line 1138) [R7].
- **Print:** `app.css:218-237` states "WYSIWYG: the screen IS the document" and resets only `--paper-cream` to white for print [R1].

### The hard constraint, and the layer a skin may vary

PRODUCT.md records Dann's 2026-09-13 ruling: a hue names one idea, and a band takes the hue of the idea it holds, wherever that band appears; a hue travelling into another room is "the system working" [R5, section "A hue names one idea"]. The tree states the map at `app.css:33-41`: sage the words (TEXT, INPUT), lavender the melody (MELODY, VOICE, the Loupe, the turning noteheads), rose your voice (INSIGHTS), cobalt information (GUIDE, and the PIECE drawer header), slate the book (LEARN) [R1]. `colour-story.test.ts` pins retired colours out of every source file (`lines 20-40`) and asserts contrast for five token pairs per family (`lines 100-125`) [R2]. The 2026-09-13 colour spec adds why hue sits on the paper: "a printed page carries no desk," so a singer with three sheets on a piano tells them apart by label ink [R6, ruling 4 of 4].

**A skin may vary (the Dress layer):**
1. Neutrals: the four surfaces, the three inks, `--ink-stave`, `--stone-300`, `--stone-500`.
2. The value, lightness, and saturation of each family's six steps, while the hue stays recognisably the same idea-hue (my proposed guard: ink hue within 12 degrees of the default, DESK DEFAULT).
3. Type slots for body, UI, and mono.
4. Density, motion duration, corner treatment, shadow, and ornament in the gutters.

**A skin must not change (the semantic layer):**
1. Which family paints which band and which destination's desk (`Drawer.svelte:1100-1122`; `+page.svelte:5025-5052`, where each tab sets `--desk-fill` to its family's desk) [R7, R10].
2. The vowel-space zone coding, where each of the six charted vowels has its own fill and a symbol, and the personal vowels take lavender (`app.css:159-172`) [R1].
3. The split between stave furniture (`--ink-stave`: lines, clefs, barlines, rests) and what is sung (`--ink-primary`: noteheads, stems, lyrics), ruled 2026-09-13 [R6, ruling 2 of 4].
4. Marks Dann has given a colour meaning, such as the red squircles for the first resonance met in a bass (PRODUCT.md, Bass ruling of 2026-10-12) [R5], and the prep-countdown amber (`app.css:157`) [R1].
5. The IPA face (`Lato IPA`), the music fonts (Bravura, Leland, Finale Maestro, in `static/fonts`) [R14], and the Paper's printed output.

**An open question for Dann, which is taste and his ruling to make:** app.css states the screen is the document. A dark or high-contrast Paper on screen breaks that for colour. Two readings: (a) the Paper never changes colour, and skins dress only the desk and chrome; (b) the Paper may change on screen and always prints in the default. I recommend (b) for the reading-comfort and high-contrast directions, because a singer with low vision needs the page itself to change, and print then resets everything. It costs a `@media print` that restores every neutral token, not only `--paper-cream`, otherwise a dark skin prints pale ink on white.

## 1. Who is excellent at this, and why

Video games are the wrong centre of gravity. In games, "skin" is mostly cosmetic dress, and I found no source on the commerce of skins in this session (NOT ESTABLISHED). The useful game material is accessibility guidance. The stronger models are ecosystems that separate what a theme may change from what it may not. "Skin" itself is defined in Wikipedia as "a custom graphical appearance preset package" [W21]; I adopt the word, and I coin "Dress" (see the layers in the tree section) for Ilya's version.

| Who | Mechanism, specifically | What Ilya takes |
|---|---|---|
| **CSS Zen Garden** [W20] | One fixed HTML file; designers change only the external stylesheet; the only hard requirement is that the CSS validates. | A skin is a stylesheet and never edits markup. Its weakness is also instructive: valid CSS is not legible CSS, so Ilya needs a contrast test per skin. |
| **Winamp** [W22] | Classic skins were static bitmap sets built to a published specification (documentation released 1998); modern skins added alpha transparency and scripting; about 3,000 skins existed by 2000. | A published skin specification invites authors. Bitmap skins own the whole window, which works for a player with no long text and is the opposite of a Paper. |
| **Windows contrast themes and `forced-colors`** [W23, W16] | The operating system forces a palette. The browser overrides `color`, `background-color`, borders, outlines, and SVG `fill` and `stroke`; `box-shadow` and `text-shadow` become `none`; non-URL background images become `none`. MDN warns authors not to build a separate design for it, only small tweaks. | Ilya's bands carry hue by background fill, which forced colours will erase, so each band must keep its label and a border that survive. URL-based images survive forced colours, so ornament images must be withdrawn deliberately. |
| **`prefers-contrast`** [W17] | Values `more`, `less`, `custom`, reflecting an operating-system setting. | The default for the High Contrast direction when a singer's device asks for more contrast. |
| **Material You** [W14] | HCT colour space (hue, chroma, tone); tonal palettes that vary only in tone; "dynamic color" that adjusts to dark theme, preferences, and "contrast requirements". | Tone is the lever for contrast. Ilya's six-step ramps are already tonal; generate them by tone, not by eye. The page I could read does not describe selectable contrast levels, so that claim is NOT ESTABLISHED (m3.material.io needs JavaScript and was not read). |
| **Radix Colors** [W12] | A 12-step scale where each step has one job (backgrounds, interactive states, borders, solid fills, low- and high-contrast text); text steps 11 and 12 are guaranteed Lc 60 and Lc 90 APCA on a step 2 background; a mutable alias maps `AppBg` per mode. | Ilya's desk, head, wash, base, jewel, and ink are the same idea in six steps. Adopt the guarantee by construction, so contrast is a property of the ramp rather than a test run afterward. |
| **Catppuccin** [W11] | 4 flavours, each with the same 26 named colours; ports to editors, terminals, browsers, and games kept in per-port repositories, with a port-creation guide and a style guide. The README makes no accessibility or WCAG claim. | Name roles identically in every skin, and publish a style guide so contributors can add skins. Do not borrow it as evidence of accessibility. |
| **Solarized** [W10] | 16 colours chosen by CIELAB lightness relationships; the light and dark modes share symmetric lightness differences. The eye-strain and "tested extensively" claims are the author's own and cite no research. | Adopt lightness-symmetric pairs for a light and dark pair; do not repeat the eye-strain claim. |
| **VS Code** [W19] | A theme file holds a `colors` object (workbench), `tokenColors`, and optional semantic highlighting; themes ship through a marketplace category. | A theme carries colour only. This is why the ecosystem is large and safe, and it is the model for Ilya's Dress layer. |
| **Obsidian** [W13] | Variables grouped as Foundations, Components, Editor, Plugins, Window. The page I read does not explain themes versus snippets (NOT ESTABLISHED). | Group Ilya's skin variables the same way, so a skin author can find them. |
| **GitHub Primer** [W15] | Foundational tokens (foreground, background, border, shadow) plus pattern tokens (button, control, focus, overlay). The page shows light and dark only; whether Primer ships high-contrast and colour-blind themes is NOT ESTABLISHED from what I read. | A named focus token (`--focus-outlineColor`) as a first-class skin value. Ilya has none. |
| **Apple Books** [W28] | Named page themes (the page names Quiet and Bold) and, separately, sliders for line spacing, character spacing, word spacing, and margins, plus Bold Text and Justify. | The best single precedent for splitting a theme from typographic settings. Adopt this split. |
| **Game Accessibility Guidelines** [W24] | Basic: "Provide high contrast between text/UI and background"; "Ensure no essential information is conveyed by a fixed colour alone". Intermediate: "Provide an option to adjust contrast"; "Provide an option to turn off / hide background movement"; "Allow interfaces to be resized". | A checklist the skin picker can be reviewed against. |
| **Google Doodles** [W37] | Seasonal dress confined to one element, the logo; by 2024 the Doodlers team had made over 5,000; the page records Google saying it does not make Doodles for religious holidays. | Seasonal dress works when it is confined to a small, owned surface; religious-holiday dress is a policy decision, not a decoration. |
| **Discord** [W32] | The Terms of Service say users may not "modify, create derivative works based upon" the software or use "unauthorized software designed to modify the services". Client theming exists, but outside the vendor's permission. I did not read any BetterDiscord documentation (NOT ESTABLISHED). | A failure mode to avoid: Ilya is open source, so it can ship its skins officially, as stylesheets. |

**Where this leaves the question about games.** E-reader page textures, operating-system window-decoration themes, and in-game interface skinning each came up in Dann's brief. I read nothing primary on e-reader textures or game interface skinning (NOT ESTABLISHED). Wikipedia notes that GNOME and KDE keep separate theme sets for interface elements and window appearance and that themes are "much less granular" than individual settings [W21]; that is the only operating-system decoration evidence I have.

### Ornament: the mechanism each uses to keep it off the reading surface

- **Frame outside the content box.** `border-image` slices one image into four corners, four edges, and an optional centre; `border-image-outset` paints outside the border box and, by the property's definition, does not reflow neighbours; if the image fails, the `border-style` shows [W29]. The page does not itself say outset leaves layout alone (the extraction flagged that as drawn from the specification), so test it. This is the mechanism for wood or interlace frames with no layout change.
- **Flat fill under glyphs.** Nielsen Norman Group's guidance for text over images is a darkening overlay, a more opaque box behind the text, blur, or placement at an edge, designed for "the worst-case background" [W30]. Ilya's rule in section 7 goes further: no image behind text at all.
- **Distraction is measurable, in children.** Carnegie Mellon researchers (npj Science of Learning, 2020; 60 first- and second-graders) found that removing extraneous illustrations from a practice book reduced gaze shifts away from the text and raised comprehension [W31]. These are beginning readers and picture books; the transfer to adult singers is NOT ESTABLISHED, but the direction supports keeping ornament away from the page.
- **Withdraw on demand.** Under `forced-colors: active`, URL-based background images are not forced away [W16], so a wood border would stay on screen; the skin must hide ornament itself under `forced-colors` and `prefers-contrast: more`.

## 2. Six aesthetic directions

All values are arithmetic outputs of my script `/tmp/gf/contrast.py`, using the same WCAG relative-luminance formula as `colour-story.test.ts:90-99` [R2]. The surfaces are my choices; each family's tiers are generated from the existing hue and saturation by lightness search to reach the stated ratio. They are starting points for hand tuning, not finished designs, and none has been tested in the tree.

**Baseline, Daylight Paper (current tokens, computed from `app.css`).** ink-primary on Paper 15.13:1; ink-secondary 7.97:1; ink-tertiary 4.85:1 on Paper and 5.44:1 on `--drawer-bg`. Worst family ink across the five families and five backgrounds the test uses: 4.81:1. White on jewel at worst 6.29:1; jewel on desk at worst 4.72:1; white on the band at worst 3.02:1, which the test restricts to large text. Conformance: AA for text pairs, AAA for ink-primary and ink-secondary. Two findings follow. The sage focus ring measures 2.54:1 against Paper and 2.85:1 against `--drawer-bg`, under the 3:1 that WCAG 1.4.11 sets for required graphical objects [W1]; whether 1.4.11 governs focus indicators is stated in the Understanding document, which I did not read (NOT ESTABLISHED). The Paper's edge against the desk is 1.25:1, faint by design.

| # | Direction | Who it is for | Source |
|---|---|---|---|
| 1 | Reading Room | Hours of reading; low glare; softer than white | Coined by the desk; the paper-warm idea parallels Apple Books page themes [W28] |
| 2 | Ink | Low vision, bright rooms, anyone who needs maximum contrast | Coined; criteria from WCAG 1.4.6 and 2.4.13 [W1]; device behaviour from [W16, W17, W23] |
| 3 | Night Study | Evening practice, dark studios | Coined; lightness-symmetry idea from Solarized [W10]; named-flavour structure from Catppuccin [W11] |
| 4 | Studio Modern | Singers who like a quiet, current, minimal tool | Coined; scale method from Radix [W12] |
| 5 | Scriptorium | Scholars; singers who love the object of a book | Coined |
| 6 | Phosphor | Playfulness; the 8-bit terminal Dann named | Coined from Dann's example (INBOX, 2026-11-21 skins scope message) |

### 1. Reading Room (reading comfort)

- **Why a singer chooses it.** A warmer, slightly darker page with softer edges for long sessions at the piano. It is chosen for comfort and preference. Coloured overlays and lenses are not a therapy: a 2016 systematic review of 51 items (54 data sets) found most studies at high or uncertain risk of bias, small effects often similar to placebo, and concluded their use "cannot be endorsed" [W8]. The skin must never be described as treating anything.
- **Tokens.** `--paper-cream #F3ECD8`, `--drawer-bg #F8F4E9`, `--desk-surface #D2CAB4`, `--ink-primary #231F1A`, `--ink-secondary #403B34`, `--ink-tertiary #575049`. Cobalt as generated: desk `#CED2D9`, head `#BBC2CE`, wash `#E9EAED`, base `#697DA0`, jewel `#495974`, ink `#2A3443`.
- **Ratios.** Ink-primary 13.88:1, ink-secondary 9.40:1, ink-tertiary 6.72:1 (7.21:1 on drawer-bg). Worst family ink 7.02:1 (AAA). White on jewel at worst 7.07:1. Jewel on desk at worst 4.58:1. White on band at worst 3.26:1 (large text only). Level: AAA for the inks, AA for tertiary, which sits at 6.72:1.
- **Type.** Charis SIL for body (OFL; Cyrillic 66 of 66 glyphs checked; IPA Extensions 96 of 96; SIL describes it as designed for the readability of long texts [W27]). Offer Literata or Source Serif 4 as alternatives.
- **Cost.** One token file plus one self-hosted face. Lowest cost of the six.

### 2. Ink (high contrast)

- **Why.** The first direction a low-vision singer needs. Meets WCAG 1.4.6 Enhanced (7:1) [W1] on every pair computed.
- **Tokens.** Paper, drawer, and desk `#FFFFFF`; the page edge carried by a 2 px black rule rather than a tint. `--ink-primary #000000`, `--ink-secondary #1A1A1A`, `--ink-tertiary #3D3D3D`. Focus ring `#0033A0` at 3 px with a 2 px offset. Cobalt: desk `#EBEDF0`, head `#DBDFE6`, wash `#F4F5F6`, base `#3A485F`, jewel `#485875`, ink `#39465D`.
- **Ratios.** 21.00:1, 17.40:1, and 10.86:1 for the three inks. Worst family ink 7.03:1. White on jewel 7.04:1 at worst. Jewel on desk 5.95:1 at worst. White on band 7.71:1 at worst. Focus ring on Paper 10.60:1. Level: AAA on every computed pair; WCAG 2.4.13 Focus Appearance (AAA) asks for a perimeter at least as large as a 2 CSS pixel outline and 3:1 between focused and unfocused states [W1].
- **A cost the numbers hide.** At 7:1 the five ink hues converge toward charcoal (cobalt becomes `#39465D`, close to slate). The idea-hue stops carrying the idea, so this skin must carry the idea by the band label, a heavier band rule, and position. The hue map survives in the band fills (head tiers stay distinguishable), but I did not test whether five people can tell them apart (NOT ESTABLISHED).
- **Also served by device signals.** Apply automatically when `prefers-contrast: more` matches [W17]; under `forced-colors: active` do not paint, and use system colours only for small repairs [W16].
- **Type.** Source Sans 3 and Source Serif 4 at one weight step heavier. Cost: moderate, because every translucent fill and every `box-shadow` that carries meaning must gain a border.

### 3. Night Study (dark)

- **Why.** Evening practice without a white slab. The evidence for dark mode is mixed and I will not oversell it: a 2022 paper summarising the literature reports a positive-polarity (dark text on light) advantage, notes that Dobres et al. (2017) found the legibility gap not significant across most ambient light conditions and clear in low light where dark text on light read better, and calls the eye-strain literature "sparse and mostly inconclusive" [W9]. I did not read Dobres directly. Offer it as preference.
- **Tokens.** `--paper-cream #26231F`, `--drawer-bg #2D2A25`, `--desk-surface #171512`, `--ink-primary #EDE6D6`, `--ink-secondary #CFC7B5`, `--ink-tertiary #A9A190`. Cobalt: desk `#22252A`, head `#2F343D`, wash `#1A1B1E`, base `#5D6D88`, jewel `#7787A2`, ink `#BDC3CE`. Jewel fills carry dark text (`#14120F`), not white.
- **Ratios.** 12.58:1, 9.30:1, 6.10:1 (5.57:1 on drawer-bg) for the inks. Worst family ink 7.04:1. Dark text on jewel 4.61:1 at worst; jewel on desk 3.85:1 at worst. Level: AAA for primary, secondary, and family inks; AA for tertiary.
- **Cost, the highest of the six.** The Paper, the engraved score's `--ink-stave`, and every SVG fill must invert; the scanned source image a singer drops in stays light; `@media print` must restore every neutral; and the several hundred hex literals outside the token file (363 in `LearnContent.svelte` alone, 34 in `+page.svelte`, 22 in `InspectorPanel.svelte`; the counts include `var(--x, #fallback)` fallbacks, which I did not separate) do not follow [R16]. Declare this skin inside `@media screen`.

### 4. Studio Modern (minimal, current)

- **Why.** A restrained, near-white, thin-hairline look for singers who want the tool to disappear. It is an original direction in the minimal-retail genre; see the intellectual-property section for what that permits.
- **Tokens.** `--paper-cream #FBFBFA`, `--desk-surface #ECECEA`, `--ink-primary #1B1C1E`, `--ink-secondary #4F5256`, `--ink-tertiary #6B6E73`. Cobalt: desk `#E7E9EB`, head `#D7DADF`, wash `#F3F3F4`, base `#7A879F`, jewel `#606E85`, ink `#556075`. Desaturated families.
- **Ratios.** 16.47:1, 7.59:1, 4.94:1. Worst family ink 4.52:1, jewel text 4.54:1, jewel on desk 3.79:1, white on band 3.09:1. Level: AA with thin margins; this is the direction most likely to drift under AA when hand-tuned, so lock it with a test.
- **Type.** Inter (OFL; Cyrillic 66 of 66; IPA Extensions 90 of 96; combining acute present).
- **Cost.** Low in tokens; real in discipline, because "minimal" removes the cues a low-contrast ramp needs.

### 5. Scriptorium (scholarly, with ornament)

- **Why.** A singer or scholar who loves the book as an object: ivory vellum, ink-brown text, a wood-grain desk, marginal ornament. This is where an original high-fantasy or manuscript sensibility lives (see section 7).
- **Tokens.** `--paper-cream #F1E8D2`, `--ink-primary #2A1F17`, `--ink-secondary #4A3B2E`, `--ink-tertiary #5E4E40`; desk a wood tone `#6B4A2F`. Cobalt: desk `#CCD0D7`, head `#B6BDC9`, wash `#E6E7EA`, base `#5C6F8E`, jewel `#4A5973`, ink `#28303E`.
- **Ratios.** 13.17:1, 8.80:1, 6.52:1. Worst family ink 7.00:1. Jewel text 7.02:1; jewel on desk 4.43:1; white on band 4.06:1. The Paper against the wood desk measures 6.51:1, so the page edge is distinct, unlike the default's 1.25:1.
- **Type.** EB Garamond for body (OFL; Cyrillic 66 of 66; IPA Extensions 96 of 96). Display faces and ornament per section 7.
- **Cost.** Ornament assets, a wood-grain image under the desk only, and `border-image` frames; the largest asset cost.

### 6. Phosphor (8-bit terminal)

- **Why.** Dann's retro example. Playful, high-contrast on dark, a monospaced chrome.
- **Tokens.** `--paper-cream #0E1A14`, ink-primary `#B8F5C8`, ink-secondary `#8FD6A4`, ink-tertiary `#6FB585`. Cobalt: desk `#17191C`, head `#21252B`, wash `#131416`, base `#536179`, jewel `#7787A2`, ink `#A9B1BF`.
- **Ratios.** 14.39:1, 10.47:1, 7.33:1. Worst family ink 7.02:1. Dark text on jewel 4.76:1. **Failure found:** text on the generated band tier is 2.77:1, under 3:1 even for large text, so Phosphor's bands need a lighter fill or label in the head tier's ink.
- **Cost.** As Night Study, plus a decision about monospaced Cyrillic (section 7).

### What every direction shares, and what stays out of the Dress

Type size, line spacing, letter spacing, and word spacing belong to the Reading layer (the card's second section, in section 6), so a singer can combine Night Study with wide spacing without a "Night Study Wide" skin.

## 3. Accessibility, with the evidence graded

### Contrast

Normative figures from WCAG 2.2 [W1]: 1.4.3 Contrast (Minimum), Level AA, 4.5:1 for text and 3:1 for large text; 1.4.6 Contrast (Enhanced), Level AAA, 7:1 and 4.5:1; 1.4.11 Non-text Contrast, Level AA, 3:1 against adjacent colours for required visual information and graphical objects. The ratios per direction are in section 2. These are conformance thresholds, not evidence that a ratio improves reading.

### Dyslexia and typefaces: the state of the evidence

| Claim | Grade | What I read |
|---|---|---|
| A dyslexia-specific typeface (Dyslexie, OpenDyslexic) improves reading speed or accuracy | **Not supported** | A 2026 meta-analysis of 15 studies, 91 effect sizes, N = 688, mostly children (mean age 11.38): overall g = -0.04, 95% CI [-0.15, 0.07]; reading speed g = 0.00; accuracy g = -0.08. Subgroups all nonsignificant (Dyslexie -0.10, OpenDyslexic 0.07). The authors conclude the fonts "have no consistent or reliable effect on reading performance" and that benefits "appear to lie more in perceived comfort and preference" [W3]. |
| Caveats on that meta-analysis | Read before citing | Heterogeneity I-squared 73.3%; funnel-plot asymmetry, with trim-and-fill shifting the pooled effect to g = -0.20; many short, small, paper-based studies; the paper is internally inconsistent (accuracy confidence interval differs between text and Table 2; effect-size counts of 91, 90, and 81 appear) [W3]. Azzarello, Paek, Hodge, Jameson, and Lewis, *Annals of Dyslexia*, 2026, doi 10.1007/s11881-026-00389-8. |
| OpenDyslexic specifically | **No benefit found** | Wery and Diliberto, *Annals of Dyslexia* 67(2), 114-127 (PMID 26993270): a single-subject alternating-treatments design in elementary students with dyslexia, OpenDyslexic against Arial and Times New Roman, on letter naming, word reading, and nonsense-word reading; no improvement in rate or accuracy; no student said they preferred it [W4]. I read the Europe PMC record, not the full paper; the sample size is NOT ESTABLISHED. |
| Dyslexic readers prefer these fonts | **Contested** | The meta-analysis authors suggest comfort and preference [W3]. A teacher-facing summary by Shanahan, which is a secondary source, lists Wery and Diliberto, Kuster et al. (2018), and Harley et al. as finding that dyslexic readers preferred standard fonts [W7]. I did not read Kuster or Harley directly. |
| Larger letter spacing helps dyslexic readers | **Contested** | Zorzi et al., *PNAS* 109(28), 11455-11459, 2012: in a large unselected sample of Italian and French dyslexic children, increased letter spacing improved text reading immediately without training; the authors attribute it to crowding [W5, from the Europe PMC record and a paraphrase of the abstract, not the full paper]. Against that, Galliussi et al., *Annals of Dyslexia* 70(1), 141-152, 2020 (128 children, 64 with dyslexia): letterform had no detectable effect, and increased inter-letter spacing slowed reading when not paired with adequate inter-word spacing [W6, abstract summary]. The meta-analysis notes spacing benefits "are not necessarily specific to readers with dyslexia" [W3]; Shanahan's summary attributes Marinus et al. (2016), the one study reporting a font benefit, to spacing rather than letterforms [W7]. I did not read Marinus or Masulli directly. |
| Typeface choice matters more than spacing, weight, or line length | **Not supported** | No study I read tested weight or line length in dyslexia. NOT ESTABLISHED. |
| Sans serif or monospaced faces read better for dyslexia | **NOT ESTABLISHED** | The meta-analysis cites Rello (2016) only as background [W3]; I did not read it. |
| Coloured paper, overlays, or lenses help | **Weak** | [W8]. |
| Atkinson Hyperlegible improves legibility | **No study cited by its maker** | The Braille Institute page cites no study, only awards, adoption figures, and testimonials [W25]. It is also unusable here as-is: in the Google Fonts build I examined, Atkinson Hyperlegible Next has no Cyrillic (0 of 66 glyphs) and no IPA Extensions [W41]. Lexend, also frequently named, likewise has no Cyrillic (0 of 66) [W41]. |
| Andika is a literacy typeface | **Maker's claim** | SIL describes Andika as "designed and optimized especially for use as a literacy font" and cites no research [W26]. It does carry Cyrillic (66 of 66), IPA Extensions (96 of 96), and the combining acute [W41]. Offer it as a comfort choice, labelled as one. |

**What is actually supported, stated carefully.** Nothing I read shows an effect on adult singers, scholars, Cyrillic, IPA, or music notation (NOT ESTABLISHED for all five). The defensible design claim is narrower: letting a reader change spacing, size, and typeface is an accessibility good in itself. Apple Books ships exactly those sliders [W28]. WCAG 1.4.12 requires that content survive line height 1.5, paragraph spacing 2, letter spacing 0.12, and word spacing 0.16 times the font size [W1]; that is a tolerance requirement for layouts, not a prescription for readers. WCAG 1.4.8 (AAA) lists width of no more than 80 characters, line spacing of at least 1.5, and paragraph spacing 1.5 times larger than line spacing [W1].

**Recommendation.** Do not call any face a "dyslexia font". Call the choices "comfort faces", offer spacing as sliders with no default claim, and say on the card that research has not shown a typeface to improve reading speed or accuracy for dyslexic readers.

### Beyond colour and type

- **Motion.** Ilya already honours `prefers-reduced-motion` in about twenty files [R16] and has one drawer motion token, `--motion: 180ms ease-out`, spent on opacity and transform only (`app.css:117-129`) [R1]. A skin must not add animated ornament. WCAG 2.3.3 (AAA) asks that interaction-triggered motion be disableable [W1]; the Game Accessibility Guidelines list "Provide an option to turn off / hide background movement" at Intermediate [W24].
- **Target size.** WCAG 2.5.8 (AA): targets at least 24 by 24 CSS pixels, with exceptions for spacing, equivalent controls, inline links, user-agent controls, and essential presentation [W2]. The tree already sets 24, 32, and 44 pixel minimums in places (`IntakeViews.svelte:309, 315, 433, 438`; `PoemLibraryCard.svelte:172, 196`; `IntakePanel.svelte:610`) [R16]. A "Large targets" density token would raise these together; the tree lacks one today.
- **Focus.** 2.4.11 Focus Not Obscured (AA) and 2.4.13 Focus Appearance (AAA) [W1]. Add `--focus-ring-color` and `--focus-ring-width` as skin tokens. Whether the floating Loupe can obscure a focused control is NOT ESTABLISHED.
- **Density.** Row height, padding, and the 18 px band inset (`--band-inset`, `app.css:115`) are already tokens [R1]; the 20 px band radius is a literal in `Drawer.svelte:1085-1095` with a comment recording a clipping fragility whose cause is NOT ESTABLISHED [R7], so a skin must leave band radii alone.
- **Colour alone.** Never carry meaning by colour alone [W24]. The vowel chart already gives each zone a symbol (`app.css:159-165`) [R1].

## 4. Is Pinterest useful?

**No, as a source; marginally, as a conversation.** Four reasons, from what I read:
1. Pinterest's terms bar scraping: users agree "not to scrape, collect, search, copy or otherwise access data or content from Pinterest in unauthorized ways, such as by using automated means" [W38], so a systematic scan is out.
2. Posters keep their rights in what they pin (Section 3(a)) [W38]; a pinned image is not licensed for reuse in Ilya.
3. A pin has no values. A skin needs hex, ratio, and provenance; a photograph of a room gives mood and none of the three.
4. Pins carry no accessibility data, and the whole point of this work is contrast.

Dann browsing it by hand for taste is harmless. For a source, use:
- **Open-access collections for ornament, texture, and colour with provenance.** The Met's Open Access initiative releases images of public-domain works and data on all accessioned works under CC0, with more than 492,000 Open Access works and a documented API [W39]. A Scriptorium border drawn from a CC0 object has a clean chain of title.
- **Documented palettes with values.** Catppuccin [W11], Solarized [W10], and Radix [W12] publish their colours; use them to study how a ramp is built, not to copy.
- **A preference walk with real skins.** Dann is a researcher; ten singers shown the same Paper in six skins is evidence a moodboard cannot be.

## 5. How a skin is applied to this interface (mechanism)

**The switch.** `<html data-skin="reading-room">` plus a separate `data-reading` attribute for the Reading layer. Each skin is a stylesheet `:root[data-skin="…"] { … }` in its own file under `apps/web/src`. Because `:root[data-skin]` outweighs `:root`, load order does not matter. Do not place skin declarations before the defaults inside `app.css`: `colour-story.test.ts` reads each token with a regex that takes the first match in the file (`lines 80-90`), so a skin value placed first would be read as the default [R2]. Skin files under `apps/web/src` are also scanned by the retired-colour guard, so no skin may use a retired hex (`lines 20-40, 50-75`) [R2].

**Which custom properties a skin overrides (the Dress):**
- Neutrals: `--paper-cream`, `--paper-light`, `--drawer-bg`, `--desk-surface`, `--ink-primary`, `--ink-secondary`, `--ink-tertiary`, `--ink-stave`, `--stone-300`, `--stone-500`.
- Family steps: 30 values (six steps by five families), each by value and lightness only.
- Type: `--font-serif`, `--font-sans`, `--font-mono`; the aliases `--font-body` and `--font-ui` and the `--color-*` aliases follow, because they are `var()` references (`app.css:177-184`) [R1].
- Shape: `--float-radius`, `--float-shadow`, `--motion` duration.
- About 43 declarations in all (30 family steps, 10 neutrals, 3 type slots); a seasonal skin that only recolours touches about 40.
- **New tokens to create, which do not exist today:** `--focus-ring-color`, `--focus-ring-width`, `--target-min`, `--line-height-body`, `--letter-spacing-body`, `--word-spacing-body`, `--ornament-*`.

**Which must not move.** The selectors that map families to bands and desks, the zone tokens, the stave-versus-sung split, the Paper's print output, and `Lato IPA` (section "The hard constraint").

**What happens to `theme-color` and its test.** `app.html:41` stays `#7D9D76` and the manifest stays as it is, so first paint and the installed-app splash keep the default. The skin script updates the meta tag's `content` at runtime. The `media` attribute on `theme-color` supports `prefers-color-scheme` (Chromium 93, Safari 15), and the manifest cannot yet vary the colour [W18], so an installed app's splash stays sage under every skin. The test at `colour-story.test.ts:127-130` keeps asserting the default; add a table-driven row that each skin declares a `themeColor` equal to that skin's own base-tier sage, so the pin extends instead of loosening [R2, R3, R4]. Proposed, not built.

**Persistence.** `localStorage`, keys `ilya:skin` and `ilya:reading`, following `ilya:language` [R10] and the `ilya:` prefix convention in `welcome-seen.ts:15` [R13]. That file's header sets the failure rule to copy: reach `localStorage` inside the `try`, and a throwing store means "use the default", never a crash [R13]. Ilya has no accounts, so a skin does not travel between devices; given Dann's principle that the singer initiates contact and Ilya does not solicit data (PRODUCT.md, "What Ilya is") [R5], keep it that way.

**What breaks if a skin loads after first paint (inference, not measurement).** The language is read inside `onMount` (`+page.svelte:3589-3640`) [R10]; a skin read there would paint the default cream page first and then switch. For a dark skin that is a white flash; for a high-contrast singer it is the exact thing they came to avoid. Fonts use `font-display: swap` (`google-families.css`, and `app.css:17`) [R14, R1], so a late face change reflows text. The Paper measures text to fit (`PageFit.svelte` and `TextFitProbe.svelte` exist in `components/Paper/`; I did not read them, so their behaviour on a late metric change is NOT ESTABLISHED). The remedy is a synchronous inline script in `<head>` that sets both attributes before the stylesheet paints. `app.html:4-30` already carries an inline head script, so there is precedent [R3]. web.dev's approach to the same flash problem is to hold content until the matching stylesheet loads [W18]. Whether the page is prerendered or served by server rendering is NOT ESTABLISHED, and that decides whether the script runs before first paint.

**Print.** Wrap light-on-dark skins in `@media screen`, and extend the print block to restore every neutral, not only `--paper-cream` (`app.css:234-237`) [R1].

**Forced colours.** Ornament images (URL-based) persist in forced-colors mode [W16]; add `@media (forced-colors: active), (prefers-contrast: more) { .ornament { display: none } }`.

## 6. Where the control sits

Facts that bear on it: the drawer is a path read in order through five bands (REPERTOIRE, PIECE, INPUT, ANALYSIS, VOICE), each closed band showing one state line (`sections.svelte.ts:113-120`; `Drawer.svelte:455-560`; `bandState.ts` header) [R7, R8]. When the singer is in Learn or Guide, the drawer is replaced by a table of contents (`Drawer.svelte:566, 736`) [R7]. The header bar is 48 px, holds the sigil and the language pill, and changes tint by destination (`HeaderBar.svelte:42-70`) [R9]. Dann's ruling of 2026-11-14: the page is the focus surface and the drawer holds the necessary controls (PRODUCT.md) [R5]. Each of the five hues names one idea, so there is no hue available for "appearance" (`app.css:33-41`) [R1].

**First choice: an Appearance button in the header bar, beside the language pill, opening a floating card.**
- Singer's side: it is one place, reachable from every destination including Learn and Guide, where the drawer's bands do not exist. It sits next to the one other global control, the language pill, which is the same kind of choice (how Ilya shows itself to me, not what I am working on). A low-vision singer can reach it before reading anything.
- The card reuses `--float-radius` and `--float-shadow` (`app.css:144-153`), which exist so floating cards are visibly one family [R1]. It would hold: Skin (a few swatches that change the page live behind it), Reading (face, size, line spacing, letter spacing, word spacing, weight), Motion (calm), and "Follow my device" for contrast and colour scheme.
- It leaves the drawer's path untouched and needs no hue.
- Costs: the pill needs a recipe for each of the five header tints; the target ought to reach 44 px to match the tree's own mobile practice; the card needs French (a marked draft follows once Dann rules on names).

**Alternative: an Appearance station at the end of the drawer, after VOICE, in neutral stone.**
- Singer's side: it sits where a singer already adjusts how the work is shown (the NOTATION station in ANALYSIS holds display preferences, `NotationFields.svelte:1-60`) [R12].
- Weaknesses: absent in Learn and Guide; on a phone the drawer is raised on demand, so it costs a gesture; and it breaks the path-through-the-work grammar by adding a band-like thing that is not a step of the work.

**Companion, in either case.** Honour `prefers-contrast`, `prefers-reduced-motion`, and `prefers-color-scheme` as defaults [W16, W17, W18], and let the singer's explicit choice override them (web.dev's pattern: follow the signal, then allow an override) [W18]. Offering a skin once on the Welcome sheet is possible; whether to do so is Dann's call and I did not read the sheet's content.

**French.** Skin names and card labels need French. I drafted none (the glossary source for these terms is NOT ESTABLISHED); they arrive as a marked draft once he rules on names.

## 7. Added scope: ornamental theming, themed typefaces, seasonal dress, and the intellectual-property line

### The rule that keeps an ornamental skin usable (the Quiet-zone rule, coined by the desk)

Ilya's singer reads Cyrillic, IPA, and a score. Divide the screen into two kinds of region.

**Reading zones, which stay quiet at all costs:** the Paper (Cyrillic, IPA, gloss, staff, noteheads, lyrics, title); the Loupe; the Inspector and analysis bodies; the vowel chart and its zones; every input field and text box; every band body.

**Ornament zones, which may carry decoration:** the desk (the space behind the Paper, including the 24 px `--portrait-gutter`); the margins and corners outside any box that holds text; the header bar around the sigil; the drawer's outer gutter (`--drawer-gutter 16px`); empty states; the Welcome plate; and a band head's surface, but not its label.

**The rule, in seven lines a designer can apply:**
1. Ornament lives only in the gutters, outside every box that carries text, and adds no layout space: frames use `border-image` with outset or a pseudo-element that does not take part in layout.
2. Under every glyph lies a flat fill token that meets contrast. No pattern, texture, gradient, or image sits behind or inside a text box.
3. Ornament never carries meaning. Anything it shows must also be said by a label, a symbol, or position.
4. Ornament can be withdrawn three ways: `prefers-contrast: more`, `forced-colors: active`, and the singer's own switch. Print always withdraws it.
5. Ornament does not move. No animated border, no looping backdrop; reduced motion is honoured everywhere it already is.
6. Display faces set only the sigil, the Welcome plate, empty-state headings, and Latin-only decoration. They never set band labels (0.7 rem, uppercase, spaced, `Drawer.svelte:1054-1064`), the Paper, any control, or any Cyrillic or IPA [R7].
7. A skin never changes the IPA face, the music faces, or any band's radius.

Rules 1 and 2 follow [W29, W30, W31] and the WCAG contrast criteria [W1]; rules 3 to 5 follow [W16, W24]; rules 6 and 7 follow the tree (`selection-ring.ts:199`; the band radius comment) [R16, R7]. The rule as a whole is my coinage.

### Themed typefaces that stay legible

Every family in the table was checked three ways this session: its licence from its `METADATA.pb` in the `google/fonts` repository, its subset list from Google Fonts' own metadata, and its glyph coverage by reading the font file's character map (Cyrillic out of 66, which is 64 letters plus Ё and ё; IPA Extensions out of 96; the combining acute U+0301, which carries Russian stress) [W40, W41]. All are SIL Open Font License except where noted, so all may be redistributed and self-hosted as Ilya already does [R14]. "Body" means safe for body text; "display only" means never body text.

Two checks are mine, not a standard: the sample of 14 IPA symbols I tested (ɪ ɨ ɑ ʌ ə ɐ ɔ ɛ ʊ ɯ ʲ ɕ ʂ ʑ) and the glyph-count method. Coverage says nothing about how good the glyphs look.

| Direction | Family | Licence | Cyrillic | IPA Ext. | U+0301 | Use |
|---|---|---|---|---|---|---|
| Reading layer (any skin) | Source Serif 4 (current) | OFL | 66/66 | 3/96 | yes | Body; IPA stays in Source Sans and Lato IPA |
| Reading layer | Charis SIL | OFL | 66/66 | 96/96 | yes | Body |
| Reading layer | Gentium Book Plus | OFL | 66/66 | 96/96 | yes | Body |
| Reading layer | Andika | OFL | 66/66 | 96/96 | yes | Body (comfort choice) |
| Reading layer | Literata | OFL | 66/66 | 3/96 | yes | Body |
| Studio Modern | Inter | OFL | 66/66 | 90/96 | yes | Body and UI |
| Scriptorium | EB Garamond | OFL | 66/66 | 96/96 | yes | Body |
| Scriptorium | Cormorant Garamond | OFL | 66/66 | 5/96 | yes | Large sizes only; thin IPA |
| Scriptorium | Forum | OFL | 66/66 | 0/96 | yes | Display only |
| Scriptorium | Philosopher | OFL | 66/66 | 0/96 | yes | Display only |
| Scriptorium | Cinzel, Cinzel Decorative, Uncial Antiqua, MedievalSharp, Almendra, IM Fell English | OFL | 0/66 | none | mostly no | Display only, Latin text only; a Cyrillic heading would fall back to another face |
| Goth | UnifrakturMaguntia, Pirata One, Grenze Gotisch | OFL | 0/66 | none | varies | Display only, Latin only |
| Phosphor | PT Mono | OFL | 66/66 | 0/96 | yes | UI chrome only; IPA must fall back to Lato IPA |
| Phosphor | IBM Plex Mono | OFL | 66/66 | 1/96 | yes | UI chrome only |
| Phosphor | Press Start 2P | OFL | 66/66 | 0/96 | yes | Display only, the sigil and headings |
| Phosphor | VT323 | OFL | 0/66 | 1/96 | yes | Latin-only display |
| Phosphor | Pixelify Sans | OFL | **64/66, missing U+041E and U+041F (О, П)** | 0/96 | yes | Excluded |
| Sci-fi | Exo 2 | OFL | 66/66 | 1/96 | yes | UI chrome; no IPA |
| Sci-fi | Jura | OFL | 66/66 | 1/96 | yes | Display and UI |
| Sci-fi | Tektur | OFL | 66/66 | 14/96 | yes | Display only |
| Sci-fi | Orbitron, Oxanium, Michroma, Rajdhani | OFL | 0/66 | none | varies | Display only, Latin only |
| Nature, family, puppies | Nunito | OFL | 66/66 | 4/96 | yes | UI chrome (rounded) |
| Nature, family, puppies | Comfortaa | OFL | 66/66 | 1/96 | yes | Display only |
| Nature | Amatic SC; Caveat | OFL | 66/66 | 2/96 each | yes | Display only (hand-lettered) |
| Valentine's Day | Great Vibes; Pacifico | OFL | 66/66 | 33/96; 1/96 | yes | Display only (script) |
| Winter and Christmas | Mountains of Christmas | **Apache 2.0** | 0/66 | none | no | Display only, Latin only |
| Hanukkah, Hebrew words | Frank Ruhl Libre; Heebo | OFL | 0/66 (Hebrew subset present) | none | n/a | Hebrew text only, never Cyrillic |

Failures worth knowing: Marck Script, Ruslan Display, Russo One, Kelly Slab, and Underdog have Cyrillic but lack the combining acute, and Manrope lacks it too, so none can mark Russian stress [W41].

**Two consequences.** First, a themed face in a Cyrillic app is nearly always display-only, because the fantasy, goth, and sci-fi faces mostly have no Cyrillic; they would set the Latin sigil and Latin empty-state headings and nothing a singer reads in Russian. Second, every themed face must be paired with a fallback stack so that a missing glyph shows a legible neighbour, not a box.

**Dann's directions, mapped.** VIC-20 BASIC becomes Phosphor with PT Mono chrome and Press Start 2P for the sigil; fantasy becomes Scriptorium with EB Garamond; sci-fi uses Exo 2 or Jura; goth would be Latin-only blackletter for the sigil and nothing else; the Apple-store-minimal direction is Studio Modern with Inter; seasonal and family skins use Nunito or Caveat as accents.

### Seasonal and novelty skins as a category

What I can say from sources: Google confines seasonal dress to its logo, a small owned surface [W37]; Google states it makes no Doodles for religious holidays and critics point to inconsistency [W37]; and a skin that can distract hurts reading in the one study I found, in children [W31]. What the tree says about cost, stated plainly:
- Each seasonal skin is a full token set (about 40 declarations), checked against the same five pair types for each of five families, with a tested hue-drift guard.
- Before any skin ships, the tokens must reach the surfaces that bypass them: the hex counts in section 2 include fallbacks, but `LearnContent.svelte` alone has 363 hex occurrences, and `ReadingPaper.svelte:129, 202` set `color: #fdfbf6` as a literal [R16]. That migration is the real cost and it is paid once.
- Each also needs ornament assets, font files with an OFL.txt each (the precedent is in `static/fonts`) [R14], English and French names, a print check, and a re-check of the vowel chart and the Loupe's SVG.
- I cannot give hours; NOT ESTABLISHED.

DESK DEFAULT recommendations, reversible: ship seasonal skins as opt-in only, never applied by date, because a singer may be printing or presenting a recital programme; name them for the season or the mood, not the religion ("Winter evening", "Candlelight", not "Christmas" or "Hanukkah"), because the choice of which religious holidays to dress is a policy decision Google itself declined to make [W37]; and ship two or three, not twelve, since each is a standing maintenance commitment.

### The intellectual-property line

I am not a lawyer and this is not legal advice; it is the line a designer can apply from sources I read. Jurisdiction matters: the copyright source is United States only, and Canadian or other law is NOT ESTABLISHED.

**Three questions a designer can ask.**
1. **Is it a property or a genre?** A genre (high fantasy, 8-bit terminal, minimal retail, wood and vines) is open to everyone. A property (a named story, character, place, logo, packaging, typeface, or site layout) belongs to someone.
2. **Does it evoke or does it name?** Evoking a mood with original drawing is fine. Using the name, a mark, or a short phrase of a property is not.
3. **Could a reasonable singer think the owner made or endorsed it?** If yes, it is a trademark problem, whatever the drawing looks like.

**What the sources say.**
- United States copyright: "Copyright law does not protect typeface or mere variations of typographical ornamentation or lettering," with very limited exceptions; "Familiar symbols and designs, or a simple combination of a few familiar symbols or designs, are uncopyrightable"; and names, titles, and short phrases are not registrable [W33]. Font software is not addressed by that circular, which is why font licences matter [W33]. So interlace, vines, and wood grain as genre are free; a specific drawing someone made is theirs.
- Trademark, Apple: no logo or graphic symbol without a licence; no use that implies affiliation or endorsement; no imitation of "the distinctive Apple packaging, web site design, logos, or typefaces"; no Apple marks in product names [W34]. The guidelines give nothing on Apple Store design specifically [W34].
- The Lord of the Rings: Middle-earth Enterprises, owned by Embracer Group since 2022, "owns the worldwide exclusive rights to certain elements of" The Hobbit and The Lord of the Rings, including character, place, object, and event names and certain short phrases; the Tolkien Estate holds the copyrights to Tolkien's works; the two disputed the scope of the original licence from 2012 until a 2017 settlement [W36]. That page is Wikipedia, a secondary source. The Tolkien Estate's own home page says nothing on licensing or fan work [W35]. Whether the invented scripts are protected is NOT ESTABLISHED.

**Applied.**
- **Fine:** an original high-fantasy direction ("Scriptorium", "Greenwood") with wood grain, vine scrollwork, and interlace drawn by us or taken from public-domain or CC0 sources such as the Met's collection [W39]; an original minimal direction with a quiet palette and an OFL face like Inter; an 8-bit terminal look with a green monospaced palette.
- **Not fine:** the words "Lord of the Rings", "Middle-earth", or any character, place, or object name in a skin name, label, or sample text; film stills, maps, or the Estate's artwork; any Tolkien-script lettering until its status is established; the Apple name, logo, or product images; the San Francisco typeface or any imitation of Apple's typefaces; a recreation of a specific store page's layout; and the names or logos of Commodore or VIC-20 (the holder of those marks is NOT ESTABLISHED, so avoid them). Name directions generically, and do not write "inspired by [brand]" on the picker.

## SOURCES

### Repository (all on the Mac at `$HOME/mnt/ilya-rewrite`, read with read-only commands)
- [R1] `apps/web/src/app.css`, lines 1-260 in full, remainder by search. Read-in-part.
- [R2] `apps/web/src/lib/colour-story.test.ts`, lines 1-140 and the remainder. Read-in-full.
- [R3] `apps/web/src/app.html`. Read-in-full.
- [R4] `apps/web/static/manifest.webmanifest`. Read-in-full.
- [R5] `docs/memory/PRODUCT.md`, lines 1220-1292 (colour story, Bass ruling, WYSIWYG focus-surface ruling, what Ilya is). Read-in-part.
- [R6] `docs/sessions/spec-colour_r1_2026-09-13.md`, lines 100-200. Read-in-part.
- [R7] `apps/web/src/lib/components/Drawer/Drawer.svelte`, lines 1-140, 455-568, 1054-1130, and searched lines. Read-in-part.
- [R8] `apps/web/src/lib/components/Drawer/sections.svelte.ts`, lines 74-135. Read-in-part.
- [R9] `apps/web/src/lib/components/HeaderBar.svelte`, lines 1-75. Read-in-part.
- [R10] `apps/web/src/routes/+page.svelte`, lines 3385-3410, 3583-3660, and searched lines at 4868-4875 and 5025-5052. Read-in-part.
- [R11] `docs/memory/INBOX.md`, lines 966-972 (Dann's skins request). Read-in-part.
- [R12] `apps/web/src/lib/components/Drawer/NotationFields.svelte`, lines 1-80. Read-in-part.
- [R13] `apps/web/src/lib/welcome-seen.ts`, lines 1-25. Read-in-part.
- [R14] `apps/web/static/fonts/google-families.css` (head) and the `static/fonts` listing. Read-in-part.
- [R15] `apps/web/src/lib/destinations.ts` (searched lines). Read-in-part.
- [R16] Repository-wide searches in `apps/web/src` and `apps/web/static`: `Lato IPA` uses (including `selection-ring.ts:199`), `prefers-*`, `forced-colors`, `data-theme`, `data-skin`, `theme-color`, hex literal counts per file, `min-height` target sizes, `font-family` frequency. Read-in-part.

### Web (all read-in-part, through a fetch extraction)
- [W1] https://www.w3.org/TR/WCAG22/ (characters 0 to 100,000 of 266,094): 1.4.3, 1.4.6, 1.4.11, 1.4.12, 1.4.10, 1.4.4, 1.4.8, 2.3.3, 2.4.11, 2.4.13.
- [W2] https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (2.5.8).
- [W3] https://strathprints.strath.ac.uk/97732/1/Azzarello-etal-AD-2026-Does-font-improve-reading-in-dyslexic-children-meta-analysis.pdf
- [W4] Europe PMC record for Wery and Diliberto 2017: https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%22OpenDyslexic%22%20AND%20Wery&resultType=core&format=json&pageSize=3 (abstract only; the PMC article page was blocked by a bot check).
- [W5] Europe PMC record for Zorzi et al. 2012: https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:22665803%20AND%20SRC:MED&resultType=core&format=json (bibliographic data and a paraphrase of the abstract; the tool declined to reproduce it verbatim).
- [W6] Europe PMC record for Galliussi et al. 2020: https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=Galliussi%20inter-letter%20spacing%20inter-word%20spacing%20dyslexia&resultType=core&format=json&pageSize=3 (abstract summary).
- [W7] https://www.readingrockets.org/blogs/shanahan-on-literacy/what-about-special-fonts-kids-dyslexia-or-other-reading-problems (secondary source).
- [W8] https://eprints.whiterose.ac.uk/104441 (Griffiths, Taylor, Henderson, and Barrett 2016, *Ophthalmic and Physiological Optics*).
- [W9] https://arxiv.org/pdf/2203.16546 (Corcoran and Corcoran 2022; secondary on Dobres et al. 2017).
- [W10] https://ethanschoonover.com/solarized/
- [W11] https://github.com/catppuccin/catppuccin
- [W12] https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- [W13] https://docs.obsidian.md/Reference/CSS+variables/CSS+variables
- [W14] https://github.com/material-foundation/material-color-utilities
- [W15] https://primer.style/product/primitives/color/
- [W16] https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors (characters 0 to 100,000 of 170,937).
- [W17] https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast (characters 0 to 100,000 of 164,615).
- [W18] https://web.dev/articles/prefers-color-scheme
- [W19] https://code.visualstudio.com/api/extension-guides/color-theme
- [W20] https://csszengarden.com/
- [W21] https://en.wikipedia.org/wiki/Skin_(computing)
- [W22] https://en.wikipedia.org/wiki/Winamp
- [W23] https://support.microsoft.com/en-us/windows/change-color-contrast-in-windows-fedc744c-90ac-69df-aed5-c8a90125e696
- [W24] https://gameaccessibilityguidelines.com/ and https://gameaccessibilityguidelines.com/full-list/
- [W25] https://www.brailleinstitute.org/freefont/
- [W26] https://software.sil.org/andika/
- [W27] https://software.sil.org/charis/
- [W28] https://support.apple.com/guide/iphone/read-books-iphc1af7c57/ios (characters 100,000 onward; the first extraction held only navigation).
- [W29] https://developer.mozilla.org/en-US/docs/Web/CSS/border-image (characters 0 to 100,000 of 196,015).
- [W30] https://www.nngroup.com/articles/text-over-images/
- [W31] https://www.cmu.edu/news/stories/archives/2020/september/busy-pictures-hinder-reading.html
- [W32] https://discord.com/terms
- [W33] https://www.copyright.gov/circs/circ33.pdf
- [W34] https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html
- [W35] https://www.tolkienestate.com/ (nothing relevant on licensing).
- [W36] https://en.wikipedia.org/wiki/Middle-earth_Enterprises (secondary).
- [W37] https://en.wikipedia.org/wiki/Google_Doodle (characters 0 to 100,000 of 122,898; secondary).
- [W38] https://policy.pinterest.com/en/terms-of-service
- [W39] https://www.metmuseum.org/about-the-met/policies-and-documents/open-access
- [W40] https://fonts.google.com/metadata/fonts (the 2.7 MB metadata file, parsed whole; subsets and open-source flag for 1,961 families).
- [W41] https://raw.githubusercontent.com/google/fonts/main/ (each family's `METADATA.pb` for the licence field and its regular-weight font file, whose character map I read with fontTools 4.67.0; 47 families checked).

## WHAT YOU COULD NOT ESTABLISH

- Whether any dyslexia-specific typeface, or any spacing value, helps adult singers, scholars, or readers of Cyrillic, IPA, or music notation. No study I read tested them.
- Any effect of font weight or line length on dyslexic reading; any evidence that sans serif or monospaced faces read better (cited only as background in [W3]).
- The full texts of Wery and Diliberto (sample size), Zorzi, Galliussi, Marinus, Kuster, Harley, Masulli, Rello, and Dobres. The PMC and Mannheim pages were blocked by bot checks, and Europe PMC rate-limited my later requests. Marinus and Kuster are cited only through a secondary summary [W7].
- Material You's selectable contrast levels, Primer's high-contrast and colour-blind themes, how Obsidian separates themes from snippets, Apple Books' full theme list, and the Windows contrast theme names. The pages I read did not say.
- Anything on game cosmetic-skin commerce, in-game interface skinning, e-reader page textures, or BetterDiscord's mechanics.
- Whether WCAG 1.4.11 governs focus indicators (the Understanding document was not read), and therefore whether the sage ring at 2.54:1 on Paper is a conformance failure.
- Whether the Loupe can obscure a focused control (WCAG 2.4.11).
- Whether the Paper's fitting code (`PageFit`, `TextFitProbe`) and the word stacks seated under the notes tolerate a body face with different metrics. Not read.
- Whether the app is prerendered, and so whether an inline head script runs before first paint.
- Whether five singers can tell the five hues apart in the Ink skin, where the ink tiers converge. Not tested.
- The holder of the VIC-20 and Commodore marks; the legal status of Tolkien's invented scripts; any Canadian or non-US law on typefaces, trade dress, or fan-style works.
- Hours or money for a seasonal set.
- Hand-tuned values: every hex in section 2 is generated arithmetic from my script, not a designed palette, and nothing was run against the repository's tests.
- The desk's token count of 74: I found 67 definitions (66 unique names).

## Notes for the main session (memory candidates; each learned from the tree this session, none from memory)

- `app.css` has 67 definitions, 66 unique names, and five hue families including slate; PRODUCT.md's colour-story section still says "umber the book" (R1, R5).
- `Lato IPA` is hard-coded in at least ten files and tested by string at `selection-ring.ts:199`; the IPA face cannot be skinned without code change (R16).
- The sage focus ring measures 2.54:1 on Paper and 2.85:1 on `--drawer-bg` by the WCAG formula; unreported until now.
- Atkinson Hyperlegible Next and Lexend have no Cyrillic in the Google Fonts builds read; EB Garamond, Charis SIL, Gentium Book Plus, and Andika carry full IPA Extensions and Cyrillic.
- Open question for Dann: may a skin change the Paper's colour on screen, given app.css's "the screen IS the document" (taste and his ruling).
