# Report from Code: the French semicolon, the watch box's heading, and four small items

Written by Code (Claude Opus) 2026-09-29, about 01:00, against the brief
`brief-code-fr-semicolon-space_r1_2026-09-28.md`. Read on branch `Shane` at
HEAD `3ab034b`. At the start the working tree was dirty only in
`docs/memory/SCHEDULE.md`, which is not mine. During the session the desk also
changed `docs/memory/STATE.md` and `docs/sessions/LOG.md`; I did not touch
them. Nothing is committed, staged, stashed, or pushed. Dann ships.

## What the singer gets now

Every French semicolon a singer can read has a narrow no-break space before
it: « passaggio ; attendez-vous ». The watch box is headed "For your
consideration", in French « À considérer ». Learn's English sets *f*R1 and
*f*R2 as Learn's French already did, and the Guide sets *f*R1/*f*o the same
way in both languages. The intake's acoustics question reads as ruled.

Test it on `http://localhost:5173`, the dev server that is already running.
The Vercel preview does not show this until you commit and push.

## 1. The French semicolon (ruling of 2026-09-28 19:42)

### How I counted

I enumerated before counting, as `ENVIRONMENT.md` asks. For `i18n.ts`, I
loaded the string table itself, not its source text, and classed the
character before each French semicolon: nothing, a plain space, U+00A0,
U+202F, or other. That catches every spelling of the space, escaped or
literal. For Svelte, I scanned every `.svelte` file under `apps/web/src`,
with script, style, comments, tags, and `{…}` expressions blanked out, and
skipped any semicolon that ends an entity (`&#160;`). I classed each hit by
the characters before it (`&#8239;`, U+202F, `&nbsp;`, `&#160;`, U+00A0, a
space, or nothing), and by whether it sits in the `{#if language === 'fr'}`
branch. A third scan read every string literal in `apps/web/src` and
`packages/*/src` outside `i18n.ts` for French text with a semicolon, and found
none.

### `apps/web/src/lib/i18n.ts`

The desk's count holds: 19 French semicolons at the start.

| | Before | After |
|---|---|---|
| No space | 14, of which 5 are CSS | 5, all CSS |
| U+00A0 | 3 | 0 |
| U+202F | 2 | 14 |

- **The 5 CSS semicolons are left alone.** They sit inside
  `footer.attribution`'s inline `style` attribute
  (`display:inline-block;width:14px;…`), which is code.
- **Set to ` `, from none (9):** `upload.banner.reader`,
  `watch.line.rangeBelowTranspose`, `watch.line.rangeAboveTranspose`,
  `watch.line.passaggioWord`, `watch.line.passaggio`,
  `watch.advice.openOCrossing`, `watch.advice.oCover`,
  `watch.advice.openTracking`, and `watch.advice.maleTurnover`.
- **Set to ` `, from U+00A0 (3):** `insights.phonation.noTempo`,
  `insights.phonation.untrustedOne`, and `insights.phonation.untrustedMany`.
  All three were literal U+00A0 characters, not escapes.
- **Already U+202F, unchanged (2):** `insights.finding.passaggio` and
  `comment.working.frame.sustainedTop`.
- Every English value on those twelve lines is byte-identical; I checked
  each line's English side.

### Svelte prose

| File | French semicolons | Before | After |
|---|---|---|---|
| `LearnContent.svelte` (French branch, lines 15 to 2064) | 85 | 85 with no space | 84 `&#8239;`, 1 left alone |
| `GuideContent.svelte` (French branch, lines 15 to 291) | 26 | 26 with no space | 26 `&#8239;` |

- **The one left alone is English.** `LearnContent.svelte:1075` is
  an English quotation ("…-allophone is actually fricative; the
  laterally…"), inside the French branch, followed by its French
  translation. It keeps its English spacing.
- The English branches carry 81 semicolons in Learn and 21 in the Guide;
  none changed. The other hits are code in `+page.svelte` (5) and English in
  `notation-font-lab/+page.svelte` (1).
- `Drawer.svelte`'s table of contents takes its words from `i18n.ts`, and
  holds no French prose of its own.
- Measured live in the pane: Learn's French shows 84 semicolons after U+202F
  and the one English one. The Guide's French shows 26, all after U+202F.

### The test

`apps/web/src/lib/i18n.test.ts:91`. It sweeps every key's French value and
fails on any semicolon without U+202F before it, skipping markup (inside a
tag, or ending an entity). It carries positive controls for no space, a plain
space, and U+00A0, and a negative control for the footer's CSS. It also
asserts that it checked at least 14 semicolons, so it cannot pass on an empty
sweep. To reach every key I added `stringKeys()` (`i18n.ts:1819`), a
read-only list of the table's keys.

Two existing tests asserted the old spacing and were updated to the ruling:
`watchlist.test.ts:568` and `:584`.

## 2. The watch box's heading

- `i18n.ts:1721`: `watch.header` is `{ en: 'For your consideration', fr: 'À considérer' }`,
  with a comment giving who offered each and when it was ruled.
- `watchlist.test.ts:265` and `:557` assert the new text.
- The comments now say "For your consideration": `watchlist.ts:2`,
  `notes-pages.ts:4`, `MarkupPane.svelte:699` (the brief's `:715`; the line
  moved), `NotesColumn.svelte:4` and `:121`, and the comment above the watch
  band in `i18n.ts`. `grep` finds no "Places to watch" or « Points à
  surveiller » left in `apps` or `packages`.

## 3. The `watch.lead.*` comment

`i18n.ts`, above `watch.lead.one` (`:1740`): "Drafted by Code, ratified by
Dann 2026-09-28 20:44 ("ratify both"; `PRODUCT.md`, "The folded watch line's
lead")." The strings are unchanged.

## 4. *f*R*n* and *f*o in Learn and the Guide

Set as `<em>f</em><sub>R1</sub>` and `<em>f</em><sub>o</sub>`:

- `LearnContent.svelte:3385` and `:3386`, English: fR2 and fR1.
- `GuideContent.svelte:73` (French) and `:350` (English): "fR1/fo".
- `GuideContent.svelte:276` (French) and `:553` (English): "fR1/fo".

Learn's French at `:1348-1349` already used this form. No plain fR*n* or fo
remains in either file.

**Occurrences in `i18n.ts`, listed and not changed** (plain strings cannot
carry markup): one key, `voiceIntake.acoustics.stem`, in both languages. It
is also item 5, and the ruled wording is plain text by design.

## 5. The intake's acoustics question

`i18n.ts:1695`, verbatim from the brief:

- English: "How comfortable are you with voice acoustics terms such as
  fundamental (fo), harmonic (nfo), resonance (fR1), and formant (F1)?"
- French: « Dans quelle mesure êtes-vous à l'aise avec des termes comme
  fondamentale (fo), harmonique (nfo), résonance (fR1) et formant (F1) ? »,
  with U+202F before the question mark, as the brief gives it.

A comment gives who wrote each and when it was ratified, and the plain-text
fallback from `notation-reference_Titze-2015.md`.

## Gates

| Gate | Baseline (`ilya-ship.sh`) | Now |
|---|---|---|
| 1 phonology | 251 passed | 251 passed |
| 2 dictionary | 235 passed | 235 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1682 passed | **1684 passed** (+2, `i18n.test.ts`) |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed | 145 passed |
| 7 integration | 55 passed | 55 passed |
| 8 ratchets | OK | OK, no ceiling raised |

`ilya-ship.sh` needs its gate 4 string moved to `1684 passed (1684)`, or it
refuses. I did not edit it.

## Screenshots

Sunless 1 on `http://keyruler.localhost:5173`, at 880 by 640 so the capture
is legible. To show the box, I gave the test voice measured vowels and typed
passaggi (D3 and A3) for the walk, with its range widened to G2 to E4, then
set it back.

- `docs/sessions/fr-semicolon-fr-1-watch-box_2026-09-29.jpg`: « À
  considérer », with two lines reading « passaggio ; attendez-vous ». I
  confirmed in the page that the character before the semicolon is U+202F.
- `docs/sessions/fr-semicolon-en-1-watch-box_2026-09-29.jpg`: "For your
  consideration".

The test origin is back as I found it: as printed, in English, the test voice
with no formants, its range A♭2 to B3, and no passaggi.

## What I could not establish

1. **Semicolons outside the app's own text.** Dictionary glosses (from
   kaikki.org) and any French a singer types reach the screen without passing
   through these strings. I did not survey them, and the ruling may not be
   meant to reach them. NOT ESTABLISHED.
2. **French in `packages/blurb`.** My string-literal scan read
   `packages/*/src` and found no French semicolon. I did not render every
   blurb in French to confirm it.
3. **The narrow space at small sizes on paper.** The screen capture shows the
   space. I did not print a page.
4. **The English quotation at `LearnContent.svelte:1075`.** I left it in
   English spacing because it is English. If the French branch should not
   carry English prose at all, that is taste, and yours.
