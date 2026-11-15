# Report: closing polish lane, step 0 (Code, cloud-lane-48, r1, 2026-11-12)

Read on `cloud-lane-48`, cut from `origin/Shane` at `dc078b9` ("Scan reader's model for the build; ..."), working tree clean. The checkout I was handed had a stale local `Shane` (`4d73284`); I fetched and cut from the remote tip, as the lane names. Nothing changed in `apps/`, `packages/`, `scripts/`, or `docs/memory/`.

The model is on the commit: `apps/web/omr-underlay/rus_prereform_r2_29000.traineddata`, 7,827,478 bytes, md5 `2ff2af3e33461cd64e7d2015ef21d10d` (read with `md5sum`), tracked (`git ls-files`).

## 1. The eight gates, run by me on the first commit (fresh `pnpm install --frozen-lockfile`)

| # | gate | result |
|---|---|---|
| 1 | `pnpm test:phonology` | 456 passed |
| 2 | `pnpm test:dictionary` | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings (5 files) |
| 4 | `pnpm --filter @ilya/web test` | 5190 passed, 1 skipped (5191) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) |
| 6 | `pnpm test:blurb` | 168 passed |
| 7 | `pnpm test:integration` | 155 passed |
| 8 | `pnpm ratchets` | OK |

These equal the figures in ENVIRONMENT.md's 2026-11-11 line (gate 4 5190/1/5191, gate 7 155).

## 2. Cited lines: what holds and what moved

Held (read, and they say what the brief says): `package.json:9-10`; `copy-underlay-model.mjs:5-10, :16-23, :34`; `underlay-recognize.ts:21-23, :36-42, :103-117`; `omr/stamp.ts:50` (`UNDERLAY_READER = 'underlay@5'` is at `:52`, see below); `omr/scan.ts:98`; `omr/restore.ts:41`; `+page.svelte:1646, :1731, :3118, :3240, :3252, :4170`; `profileStore.ts:166-177`; `VoiceAnchor.svelte:40-45`; `bandState.ts:226-249`; `plausibility.ts:275`; `i18n.ts:510, :1489, :1729, :1818-1819, :1891, :2027, :2030, :2067`; `singer-blocks.ts:84, :113-114, :251, :292, :334`; `identity.ts:28, :52`; `subtitle.ts:12`; `voiceTypes.ts:82-96`; `InstallPrompt.svelte:40-41, :50-51, :147`; `install-prompt-gate.test.ts:22-28, :34-36`; `poem-metadata.ts:96-98`; `poem-library.ts:29-45, :123`; `build-poem-library.mjs:110, :119, :122, :249-258`; `latin.ts:40, :43, :44, :50, :67, :70-72, :75-78, :85-96, :99-101`; `pipeline.ts:487, :586, :671`; `VerseLine.svelte:26-28`; `provenance.ts:215`; `app.html:37, :46-51`; `vercel-headers.test.ts:38-41`; `GuideContent.svelte:289, :302, :585, :589`; `LearnContent.svelte:20`; `ScoreUploader.svelte:145-147, :373` and its 867 lines; `+page.svelte` 5515 lines; `InsightsPane.svelte` 744 lines; all the e2e and e2e-phone press lines (`poem-library.test.ts:38, :178, :225, :239`; `glue-typed-marks.test.ts:46`; `text-witness.test.ts:80`; `relining.test.ts:88, :118`; `singer-paths.test.ts:180`); `learn-opening.test.ts:18`; `poem-offer-metadata.test.ts:127-128`; `ratified-lines.test.ts:406-411`; `bandState.test.ts:207-209`; `i18n.test.ts:61`; `i18n.ts:508-509, :830-831, :1314`; `MarkupPane.svelte:449, :1106`; `tests/build-poem-library.test.ts:176, :384-387`; `.gitignore:12`; `NOTICES.md:17-28, :49`; `PageFooter.svelte:58`; the three `100vh` and four `safe-area-inset` sites (`app.html:37` is still `width=device-width, initial-scale=1`).

Wrong path or moved line (content as the brief says):
- `latin.ts` and `pipeline.ts` are `apps/web/src/lib/latin.ts` and `apps/web/src/lib/pipeline.ts`, not under `text/`. `page-fit.ts` is `src/lib/page-fit.ts`, and the Cyrillic filter the brief puts at `:71` is at `:75`, with `w.latin` also at `:130`. `provenance.ts:215` is `src/lib/provenance.ts`.
- `CalibrationWizard.svelte` is `src/lib/voice/CalibrationWizard.svelte`; the four `hasAnyReadings` uses are at `:335`, `:511`, `:527`, `:548` as the brief says.
- Step 0b, Amendment 1: `UNDERLAY_READER` is at `omr/stamp.ts:52` (the amendment says `:50`; `:50` is a comment line). Its value is `'underlay@5'`, as the amendment implies.
- Step 5's test pins read today `build-poem-library.test.ts:176` (`['a Latin letter', 'покаянiем строка']`) and `:384-387`; the line numbers hold.

Not read yet (cited, but only reached in the step that uses them): `pages-without-gaps.test.ts:227`, `heic-reader-path.test.ts:42-45` (read: `:41-45` is the comment on the jsDelivr route and holds), `static/sw.js:39`, the `OPEN.md` ruling lines, `scripts/ratchets.json` ceilings.

## 3. L17, step 1 (measure)

NOT YET TAKEN. It needs the built site and a seeded voice; I take it after step 0b has the site building, and report it in a step 0 addendum.

## What I could not establish

- Whether the Playwright suite passes on this commit (not run at step 0; the brief asks for the eight gates only). Step 12 runs it.
- The 2026-11-11 baseline for the Playwright suite in this sandbox: `pages-without-gaps.test.ts:227` is known to fail here (step 11).
