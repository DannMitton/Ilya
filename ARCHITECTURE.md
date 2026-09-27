# Architecture

**Draft r1, 2026-09-26, written on the `audit` branch. Not yet ratified.** It
follows matklad's advice for an `ARCHITECTURE.md`: short, about things that
rarely change, and a map rather than a manual. It says where things are and
what must stay true. It does not say how each module works; the code and its
comments do that.

## The problem Ilya solves

A classical singer has a Russian text, and often a score. Ilya answers two
questions about it.

1. **How do I pronounce this?** Ilya transcribes the text into a singable IPA,
   following Craig Grayson, *Russian Lyric Diction* (2012). This is the
   Transcription document.
2. **Does this piece suit my voice?** Fit reads the score, measures the voice
   the singer calibrates, and reports where the two meet. This follows Mitton
   (2020). The code calls it **Shane**; the singer sees **Markup**
   (« Annotation ») and **Insights** (« Aperçus »). The codename never reaches
   the screen.

Ilya is rule-based and deterministic: the same input gives the same output,
every time. It contains no machine learning. That claim is load-bearing for
the project's credibility, and the approval tests in `__approved__/`
directories pin it.

The app is bilingual (English and French), runs entirely in the browser as a
progressive web app, and stores the singer's songs on their own device.

## Codemap

A pnpm workspace. The application depends on four packages. The packages never
depend on the application, and at runtime none imports another: the
application loads the data and injects it into each.

```
packages/phonology    ◄──┐
packages/dictionary   ◄──┤
packages/blurb        ◄──┤  apps/web imports each, and injects
packages/score-parser ◄──┘  the dictionary data at load
```

### `packages/phonology` (`@ilya/phonology`)

The **GraysonEngine**: stress, vowel reduction, palatalization, voicing
assimilation, and clitic chains, turning Cyrillic into Grayson's IPA. The one
place a phonological rule may live. Entry: `src/index.ts`. It imports no other
package at runtime: the application loads the dictionary and injects it
(`apps/web/src/lib/loader.ts`).

### `packages/dictionary` (`@ilya/dictionary`)

Stress lookup and the English and French gloss pipeline, plus the normalizers
for poetic and pre-1918 spelling. Data comes from English and French
Wiktionary through kaikki.org (CC BY-SA 4.0); `scripts/build-dictionary.ts`
builds it. Depends on nothing else in the workspace.

### `packages/blurb` (`@ilya/blurb`)

The explanation a singer reads after tapping a word: why Ilya made this
choice. Depends on nothing else in the workspace.

### `packages/score-parser` (`@ilya/score-parser`)

Everything about a score that does not need a browser. MusicXML and MNX both
parse into one type, `ParsedScore`, whose sung line is a list of
`VocalLineEvent`s. Also here: phonation time, tessitura, tempo, transposition
search, page layout, and `staff-renderer.ts`, which engraves a staff as SVG.
Depends on nothing else in the workspace.

### `apps/web` (`@ilya/web`), the SvelteKit application (Svelte 5 runes)

- `src/routes/+page.svelte` is the single page. It owns the song being worked
  on and wires every surface together.
- `src/lib/pipeline.ts` turns text into a transcription by calling the
  packages. `src/lib/loader.ts` loads the dictionary into IndexedDB in chunks.
- `src/lib/i18n.ts` holds the interface's words, in both languages. The Learn
  and Guide texts are written in each language in `components/Reading/`, and
  the word explanations come from `data/blurb-composer.json`.
- `src/lib/destinations.ts` names where the singer is (Studio, Learn, Guide)
  and which document Studio shows (Transcription, Markup, Insights).
- `src/lib/components/Drawer/` is the drawer: every control that changes
  something. `Paper/` is the page: what displays and prints. `Reading/` holds
  the Learn and Guide texts.
- `src/lib/library/` stores songs on the device (IndexedDB) and reads and
  writes `.ilya` binder files. `document.svelte.ts` is the seam between the
  page and storage.
- `src/lib/shane/` is Fit. Inside it:
  - `ingestion/` detects a score's format and routes it to a parser.
  - `engine/` holds the microphone capture, signal processing, and the Web
    Workers that read a score from a PDF or a photograph.
  - `pairings.ts` joins the text's words to the score's notes, and
    `vowel-resolver.ts` asks the GraysonEngine which vowel is sung.
  - `Loupe.svelte` and `loupe.ts` are the magnified editor for one measure.
- `src/lib/markup/` is the Markup document, moved out of `shane/` by N.174
  D.2.1. `MarkupPane.svelte` analyzes the score, paginates it (`paginateScore`
  in `packages/score-parser`), and hands each page's SVG to
  `Paper/PageFit.svelte`. `legend.ts` builds its footer legend. What each
  module under `src/lib/` may import is checked by `scripts/ratchets.mjs`.
- `src/lib/insights/` is the Insights document, moved out of `shane/` by N.174
  D.2.2. `insights.ts` builds the page's figures, `Tessituragram.svelte` draws
  the tessituragram, `comments.ts`, `comment-text.ts`, and `comment-sources.ts`
  choose, word, and cite the per-note comments, and `InsightsPane.svelte`
  renders it all. `InsightsIntake.svelte` stays in `shane/` until D.2.4.
- `src/lib/wall.ts` is the one switch that includes or removes Markup and
  Insights at build time (`PUBLIC_INCLUDE_MARKUP_INSIGHTS`, or the older
  `PUBLIC_INCLUDE_SHANE`).

Fit's work runs in five stages: **calibrate** the voice, **ingest** a score,
**resolve** which vowel each note sings, **analyse** where the voice and the
music meet, and **engrave** the marked-up score.

## Invariants

Each is a default. Departing from one needs a deliberate ruling from Dann, and
the ruling goes into `docs/memory/`. The ones marked *tested* fail a check when
broken.

1. **Packages never import the application.** *Tested:* `scripts/ratchets.mjs`.
2. **The application reaches a package only through its `@ilya/` name.**
   Tests may load a package's fixtures directly. *Tested:* `scripts/ratchets.mjs`.
3. **IPA comes only from the GraysonEngine.** No renderer, component, or Fit
   module writes IPA or re-derives a phonological rule of its own.
4. **The IPA stays inside Grayson's inventory:**
   `ˈ ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ`.
   *Tested:* `apps/web/src/lib/approval/invariants.test.ts`. The one exception
   is a display preference the singer chooses: `applyNotationPreferences`
   (`packages/phonology`) can show the reduced vowel as `ə`.
5. **Same input, same output.** *Tested:* the approval suites.
6. **The drawer manipulates. The page displays and prints.** No control sits
   on the paper.
7. **The notes never move.** A correction to how text meets music is a side
   map keyed by event id (`pairings.ts`); it never writes into `ParsedScore`.
8. **`VocalLineEvent` does not change shape.** Much of Fit is built on it.
9. **Store what the singer said, never what Ilya derived.** Everything derived
   is recomputed on open. The one ruled exception is R8's vowel glyph.
10. **A stored id changes only with a migration.** The destination ids in
    `destinations.ts` and the library's record keys are written to the
    singer's device, so an id changes only with a migration that reads both
    the old and the new value: `restoreSurface` in `destinations.ts` is the
    example. Amended by N.174, 2026-09-27.
11. **Every word the singer reads exists in both languages.** Interface words
    live in `i18n.ts`. *Tested:* `apps/web/src/lib/approval/i18n-keys.test.ts`
    checks every literal key in both languages. **Not yet true** of the word
    explanations: 209 of 210 templates in `data/blurb-composer.json` have no
    French (counted 2026-09-26), and fall back to English.
12. **Large files do not grow.** A file with a ceiling in
    `scripts/ratchets.json` may shrink and never grow; a file without one stays
    under 1,000 lines. New work goes into a new module. *Tested:*
    `scripts/ratchets.mjs`.

## Cross-cutting concerns

- **Testing has four layers.** Unit tests sit beside the code
  (`*.test.ts`). Approval tests pin whole outputs as plain files in
  `__approved__/`; a diff there means the output changed, and `vitest -u`
  re-approves only a reviewed, intended change. The Playwright suite in
  `apps/web/e2e/` checks what a singer sees on the desktop layout, and
  `apps/web/e2e-phone/` checks the phone layout. `scripts/ratchets.mjs` guards
  structure. CI (`.github/workflows/ci.yml`) runs them on every push to any
  branch, with zero type errors allowed. The phone Playwright project is not in
  CI yet: one of its tests fails today.
- **Language.** Interface strings are keyed in `i18n.ts`. French is ratified by
  Dann before it ships.
- **Storage.** Songs live in IndexedDB on the singer's device, through
  `src/lib/library/`.
- **The dictionary** is large. `loader.ts` streams it into IndexedDB once, and
  the text field stays disabled until it has landed.
- **Offline.** `apps/web/scripts/stamp-sw.mjs` versions the service worker
  cache at every build.

## Where to start

- To change a pronunciation rule: `packages/phonology`, with its tests, and
  Grayson's text at hand.
- To change what a singer reads: `apps/web/src/lib/i18n.ts`.
- To change Fit's analysis: `packages/score-parser` for anything that needs no
  browser, `apps/web/src/lib/shane/` for the rest.
- Before any change: `pnpm test`, `pnpm ratchets`, and, in `apps/web`,
  `pnpm check` and `pnpm exec playwright test --project=chromium`.

## Where decisions are recorded

- `docs/memory/` is the project's working memory: `README.md` says what to
  read. `PRODUCT.md` holds settled product decisions, and `CONTRACT.md` §6
  holds the rules this file's invariants were drawn from.
- `docs/sessions/` holds the dated designs, briefs, and memos behind them.
  Nothing there is authoritative on its own: the code beats `docs/memory/`,
  and `docs/memory/` beats `docs/sessions/`.
