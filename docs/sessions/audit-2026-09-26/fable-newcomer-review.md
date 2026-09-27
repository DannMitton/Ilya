# Ilya: a newcomer's structural review

Read at `/home/claude/ilya`, branch `audit`, commit `cdd05b42cb2551e903940a18b2abe774d8cff243`, working tree clean before I started (`git status --short` printed nothing). Read-only: no file edited, no writing git command run. Commands run: `pnpm ratchets` (OK, 294 files, 0.17 s), `pnpm test` (2,733 tests pass across six vitest runs, 51 s), `pnpm check` in `apps/web` (0 errors, 12 warnings, 18 s), `pnpm build` in `apps/web` (22 s). Playwright not run.

Every factual claim below carries a path:line I read or a command I ran. Opinions are marked JUDGEMENT.

## Verdict

The engine half of Ilya is in genuinely good shape: `packages/phonology` is a readable, page-cited implementation of Grayson with a one-function home for each rule, the package boundary is real and machine-checked, the approval tests pin the determinism claim to actual output, and the test suite is large, fast, and green. The application half is where a newcomer struggles. One 6,225-line page component owns the song and 71 `$state` fields; the Fit feature is 90 flat files under a codename directory whose most important component is misnamed; and the source is saturated with session-numbered commentary (1,872 `N.nnn` references) that only makes sense with the maintainer's private notes open. The documents oversell bilingual parity: 209 of 210 explanation templates in the blurb data have `"fr": null`, so a French singer reads the inspector's explanations in English. ARCHITECTURE.md is a good draft with four claims that the code contradicts. JUDGEMENT: the product is close to a defensible public release for the Transcription half; before release I would fix the French blurbs, the committed feature flag, the README's dead commands, and the stored `shane` id, in that order, and leave the big refactors until after.

## Newcomer log

- README answered "what is this" in one screen and named the four packages. Good.
- README.md:46 and CONTRIBUTING.md:44 both say `pnpm test:e2e` from the root; the root `package.json` (lines 6-13) has no such script. It exists only in `apps/web/package.json:17`. First command I copied that failed to exist.
- CONTRIBUTING.md:30 says "three core packages"; README.md:54-58 and ARCHITECTURE.md list four. Small, but the first contradiction between the four documents, on page one.
- ARCHITECTURE.md's "Where to start" (lines 149-157) sent me to the right directory for each task. It is the most useful page in the repository.
- AGENTS.md introduced a "handover chain", a `Shane` branch, and a Gould rule extraction that ARCHITECTURE.md never mentions. I could not tell which document was primary until ARCHITECTURE.md:159-166 told me "the code beats docs/memory, docs/memory beats docs/sessions". That sentence should be nearer the top.
- Once inside the code, the engine comments cite Grayson page numbers (engine.ts:1150, :1176, :1215) and answered "why" instantly. The app comments cite session numbers (`N.108`, `N.145`) and rulings ("RULED BY DANN 2026-09-16", 354 such lines by `grep -rn "RULED BY DANN\|Dann's ruling\|ruled by Dann"`), which answer "when" and "who" but not "why" without `docs/sessions/` (482 files, 19 MB, `ls docs/sessions | wc -l`, `du -sh docs`). I consulted `docs/memory/` twice, noted below.

## Purpose and quality bar, inferred from the four documents

Purpose: turn a Russian song text into a printable, singable IPA study sheet per Grayson (README.md:5-9), and, behind a build flag, tell a singer whether a score suits their measured voice (AGENTS.md "The project", ARCHITECTURE.md:17-21). The bar I inferred and then checked:

1. Determinism and "not AI" (README.md:15). Checked: the engine is a frozen object of pure functions over an injected dictionary (engine.ts:185, :122-135); the approval corpus pins forty lines of real output with the dictionary entry count on line 1 (`apps/web/src/lib/approval/__approved__/ipa-corpus.txt:1`, "943106"). Holds.
2. Scholarly fidelity to one source. Checked: every vowel branch in `transcribeVowel` carries a page (engine.ts:1159-1245). Holds.
3. Closed IPA inventory. Checked by `invariants.test.ts:18-36` against the corpus. Mostly holds: `applyNotationPreferences` (engine.ts:163-165) emits `ə`, outside the inventory, when the singer's `reducedVowel` preference is on. It is a display preference, but the invariant as written (ARCHITECTURE.md:111) does not carve it out.
4. Bilingual parity (CONTRIBUTING.md:57). Does not hold for the inspector's explanations: `node` count over `data/blurb-composer.json` gives `{pairs: 210, frPresent: 1, frNull: 209}`, and `packages/blurb/src/composer.ts:331-332, :370` fall back to English silently apart from a `console.warn`. The UI chrome, by contrast, is disciplined: my grep for hard-coded English attribute literals outside `Reading/` found 0, and a cross-check of every literal `t('...')`/`T('...')` key against the table found none missing.
5. Offline and on-device. `apps/web/static/sw.js` is version-stamped at build (`apps/web/package.json:12`); songs live in IndexedDB via `src/lib/library/`. Holds.
6. Legibility of the printed page over density (AGENTS.md "Engraving constraints"). Not verifiable from source by rule; the project's own rule says measure the live render. NOT ESTABLISHED here.

## Three newcomer tasks

**(a) Stress and IPA for a word; fixing a wrong reduction. About 8 minutes.** Path: ARCHITECTURE.md:151 → `packages/phonology/src/index.ts` → `engine.ts`. Stress: `lookupStress` at engine.ts:697-788 (supplement first, then dictionary, then ё-restoration). Vowel quality: `getSyllablePosition` at :1145 classifies the syllable and `transcribeVowel` at :1159 picks the symbol per position; a wrong reduction is one `if` in the right `position` branch, plus a case in `packages/phonology/tests/stress-vowels.test.ts` and a re-approval of `ipa-corpus.txt` if the corpus is touched. Helped: page citations on every branch. Misled: ARCHITECTURE.md:47-48 says phonology "depends on `@ilya/dictionary` for stress", and engine.ts:127 says the dictionary is "called by @ilya/dictionary after load". Neither is true at runtime: `grep -rn "@ilya/dictionary" packages/phonology/src` finds only those two comment lines, and the injector is `apps/web/src/lib/loader.ts:655-656`. Also, `transcribe()` runs from :1509 to :1983, and the dictionary entry is `Record<string, any>` (:122), so the entry shape (`s`/`g`/`p`/`l`) is learned from loader.ts:39-46, not from a type.

**(b) A user-visible French string. About 10 minutes.** Path: ARCHITECTURE.md:153 → `apps/web/src/lib/i18n.ts`. Add a key to `strings` (i18n.ts:9), call `t(key, language)` (:1712). Helped: the `[MISSING: key]` sentinel (:1714) makes an absent French visible at runtime. Confusing: the table is 1,739 lines with session narratives between entries (:22-52); 41 entries carry identical English and French by my regex, some ruled identical, some "owed" (:29-31), and nothing distinguishes the two mechanically. `t` takes `key: string`, so a typo compiles and ships as `[MISSING`. The Learn and Guide texts are not in the table at all: `LearnContent.svelte:15` opens `{#if language === 'fr'}` over 4,099 lines of parallel HTML.

**(c) MusicXML upload to engraved page. About 15 minutes, the slowest.** Stages: `ScoreUploader.svelte:569` → `ingestion/ingest.ts:161 ingestScoreFile` (typed provenance and errors, :49-120; format sniff in `format-detection.ts`) → `MusicXmlScoreParser` in `packages/score-parser/src/musicxml-parser.ts` → `+page.svelte:3243 handleArrival` (fingerprint, library match, `applyArrival`) → `VoiceProfilePane.svelte:558 readingScore`, `:596 vowelResolver`, `:707 analyzeScore` → `:822 paginateScore` (`packages/score-parser/src/page-layout.ts:225`) → `renderSystemSlice`/`staff-renderer.ts` SVG strings → `PageFit.svelte` via `{@html page}` (VoiceProfilePane.svelte:144). Helped: ingest.ts's header comment is a model of what a module header should be. Confusing: the component that renders the Markup document is named `VoiceProfilePane.svelte` and its own header calls it "the interim Voice Profile envelope pane" (:3). Nothing in ARCHITECTURE.md's Fit list (:85-92) names it, `paginateScore`, or `PageFit.svelte`. The five stages at ARCHITECTURE.md:96-98 do not map onto file names.

## Structure

**Boundaries and direction.** Real and enforced. `scripts/ratchets.mjs:69-81` fails CI on a package importing `$lib`/`apps/` or the app importing a package by relative path. No package `src` imports another `@ilya/*` at runtime (grep above). The wiring is dependency injection from the app (`loader.ts:49-51, :655-656` into phonology, dictionary, and blurb). JUDGEMENT: correct design, wrongly described; the codemap arrow should say "injected by the app".

**Cohesion and size.** Sixteen files are frozen above 1,000 lines in `scripts/ratchets.json`, led by `+page.svelte` (6,225; 71 `$state`, 79 `$derived`, 10 `$effect`, 111 functions, 77 imports, 1,297 comment lines out of 4,370 script lines by grep), `LearnContent.svelte` (4,099), `staff-renderer.ts` (3,534), `Loupe.svelte` (3,054). `apps/web/src/lib/shane/` is 90 files flat, and `shane/engine/` mixes microphone DSP (`dsp.ts`, `live.ts`), page OCR workers (`page-reader.worker.ts`), and a MuseScore converter (`mscz-converter.ts`) under one name. The ratchet stops growth; nothing in the tree plans shrinkage.

**State.** Svelte 5 runes, used well where they are small: `document.svelte.ts` (379 lines) is a deliberate thin socket with a clear reason stated (:9-16, runes are inert under node vitest, so decisions live in plain `library.ts`). The page itself is the state store. JUDGEMENT: that is the single largest onboarding cost in the repository.

**Testability and the pyramid.** Unit: 2,733 tests, all pure TypeScript; there are no component tests (`apps/web/vite.config.ts` has no jsdom environment; no `*.svelte.test.ts`). Approval: 14 files in three `__approved__/` directories, with READMEs. E2E: 3 desktop specs in `e2e/`, 3 phone files in `e2e-phone/`. Ratchets: size, layering, surface. The gap is the middle: every component over 1,000 lines is tested only by three Playwright specs.

**CI.** `.github/workflows/ci.yml` runs type-check (baseline 0 errors, 12 warnings, :40-45), ratchets, tests, build, and the desktop Playwright project. It runs on pushes to `main` and `Shane` only (:5). The phone project is not run (`--project=chromium`, :139). Vitest is `^3.2.4` at root, `^3.0.0` in packages, `^4.1.6` in `apps/web` (`package.json` files), two majors in one workspace.

**Naming.** `shane` is the directory, the `StudioDocument` id (`destinations.ts:5`), the stored `ilya:activeTab` value, and a CSS class prefix (8 template occurrences). Invariant 10 (ARCHITECTURE.md:122-123) says stored ids never change, so the codename is now permanent in singers' storage unless renamed before release. `score-parser/package.json` still describes "Verovio renderer output" and lacks a `license` field (the other three have one). `binder.ts:75` contains raw control characters in a regex; `grep` reports the file as binary.

**Errors.** Good. Typed, discriminated unions for ingestion (`ingest.ts:98-120`) and the engine (`shane/engine/errors.ts`), zero empty `catch {}` blocks in app or package source (grep), 23 `console.error/warn` sites. The one weak spot is the blurb French fallback above, which warns and continues.

**Performance and payload.** The dictionary is four NDJSON shards totalling 166 MB on disk (`du -shL data/*.json`), committed without LFS (`.gitattributes`), symlinked into `apps/web/static/data`; the `.git` directory is 52 MB, so git's compression absorbs it (shard a gzips to 3.2 MB). At runtime the whole stress dictionary is held as one in-memory object (`engine.ts:122`, `loader.ts:655`) and cached in IndexedDB; the gloss tier loads lazily (`loader.ts:37-41`). The built app is 197 MB with 21 MB in `_app`; the largest client chunk is 765 kB (245 kB gzip). Heavy converters load on demand (`ScoreUploader.svelte:633-636`). JUDGEMENT: adequate for a desktop; the in-memory dictionary is the number to watch on phones, and NOT ESTABLISHED what it costs there.

**Committed feature flag.** `apps/web/.env` is tracked (`git ls-files`) and contains `PUBLIC_INCLUDE_SHANE=true`, while `.env.example` says to leave it unset for production. Whether Vercel overrides it: NOT ESTABLISHED.

## ARCHITECTURE.md claims the code contradicts

1. Line 47-48, "Depends on `@ilya/dictionary` for stress": declared in `package.json`, not imported at runtime; the app injects (`loader.ts:655`).
2. Line 76 and invariant 11 (line 124), "every word the singer reads comes from `i18n.ts`": Learn and Guide are parallel HTML trees in `LearnContent.svelte:15` and `GuideContent.svelte`; inspector explanations come from `data/blurb-composer.json`.
3. Line 138, "CI runs all four on every push": the phone e2e project is not run, and CI triggers only on `main` and `Shane` (ci.yml:5, :139).
4. Line 140-141, "Every string is keyed in `i18n.ts`. French is ratified by Dann before it ships": 209 of 210 blurb templates ship `"fr": null`.
5. Line 111, invariant 4: `applyNotationPreferences` emits `ə` (engine.ts:164). Either the invariant needs a carve-out or the preference needs a ruling.

Rules I would challenge (JUDGEMENT): invariant 12 freezes sixteen oversized files with no shrink path; a ratchet without a budget preserves the problem. Invariant 8 ("`VocalLineEvent` does not change shape") is a versioning problem stated as a prohibition; a `version` field on `ParsedScore` would give the same safety without forbidding growth. The rest of the invariants are good and unusually honest about what is tested.

## Recommendations

Ranked by value to purpose divided by cost and risk. "Invisible" means no change to what a singer sees.

| # | What | Why (purpose) | Size | Risk | Invisible |
|---|------|---------------|------|------|-----------|
| 1 | Write the 209 French blurb templates, and make the composer's fallback a test failure, not a warning | Bilingual parity is a stated promise (CONTRIBUTING.md:57); the inspector is the "why" a singer clicks for | 2-3 days of Dann's French, 1 hour of code | Low | No (French users see French) |
| 2 | Untrack `apps/web/.env`; set the flag in Vercel or CI only | A production build from a clean clone currently includes Fit | 30 min | Low | Yes |
| 3 | Fix README/CONTRIBUTING commands (`test:e2e`, "three packages"), add root `test:e2e` script | First-contact trust | 30 min | None | Yes |
| 4 | Rename the stored `shane` ids to `fit` with a one-line migration in `restoreSurface` (`destinations.ts`) before invariant 10 freezes them | The codename must never surface; storage is the last place it can still be renamed cheaply | 2 hours | Low with migration | Yes |
| 5 | Correct the five ARCHITECTURE.md claims above; state injection explicitly; add `paginateScore`, `VoiceProfilePane`, `PageFit` to the Fit map | The map is the newcomer's only reliable guide | 1 hour | None | Yes |
| 6 | Type the i18n keys (`keyof typeof strings`) and add one test that greps templates for `t('`/`T('` keys against the table; mark owed French with a field, not duplicated English | Turns `[MISSING` from a runtime surprise into a compile error; makes "owed" countable | 3 hours | Low | Yes |
| 7 | Run the phone Playwright project in CI; trigger CI on all branches or on `audit` too | The phone layout is a shipped surface with zero CI coverage | 1 hour | Low | Yes |
| 8 | Type the dictionary entry (`{s,g,p,l,...}`) once in `@ilya/dictionary` and drop `Record<string, any>` from engine.ts:122 | Fidelity: a typed entry lets the compiler catch a key-mapping drift between `build-dictionary.ts` and the engine | 4 hours | Low | Yes |
| 9 | Rename `VoiceProfilePane.svelte` to what it is (the Markup document), and split `shane/engine/` into `capture/`, `reader/`, `convert/` | Task (c) cost 15 minutes mostly because of names | 1 day | Medium (imports, ceilings) | Yes |
| 10 | Extract the song/state store from `+page.svelte` into `.svelte.ts` modules by concern (surface, engraving, arrival), following the `document.svelte.ts` pattern, and set shrink targets in `ratchets.json` | The page is the onboarding wall; the pattern for the fix already exists in the tree | 1-2 weeks | Medium | Yes |
| 11 | Add a component-test layer (vitest browser mode or jsdom) for the three largest Svelte files | The pyramid has no middle | 2 days to set up | Medium | Yes |
| 12 | Align vitest on one major across the workspace | Two majors is a maintenance trap | 2 hours | Low | Yes |
| 13 | Move session-numbered commentary out of source into `docs/sessions/` links, keeping only the "why" | 1,872 `N.nnn` references are unreadable without private notes | Ongoing | Low | Yes |

**Do before a public release:** 1, 2, 3, 4, 5, 6, 7. Together about one week, most of it French.

**Do after:** 8 through 13. None changes what a singer sees; 10 is the one that changes what a contributor sees.

## What is genuinely good

The GraysonEngine is the best-documented rule engine I have read in a while: one function per phonological decision, a page number on each branch, and an approval corpus that makes the "same input, same output" claim falsifiable rather than rhetorical. The ratchet script is 90 lines and does exactly three things. The error model in ingestion is exemplary. The `document.svelte.ts` header explains a real constraint (runes inert under node) and the design that follows from it; if the rest of the page were written that way, this review would be half as long.
