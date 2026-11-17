# Report: N.203 lane 61, Step 0 (read and report, nothing changed)

Branch `cloud-lane-61`, cut from `Shane` at `55b64d28` ("N.203 lane 61: Fable reviews of brief r1 and r2 ..."). `git fetch origin Shane` showed the remote `Shane` had been force-updated from the local `649fe49` to `55b64d2`; I cut from the remote tip. Working tree clean before the gates. Fresh `pnpm install --frozen-lockfile` in a Linux sandbox.

## The eight gates on the untouched tip

| Gate | Command | Baseline | Measured |
|---|---|---|---|
| `@ilya/phonology` | `vitest run` | 462 passed (462) | 462 passed (462) |
| `@ilya/dictionary` | `vitest run` | 248 passed (248) | 248 passed (248) |
| svelte-check | `svelte-check --output machine` | 0 errors, 12 warnings, 5 files | COMPLETED 1218 FILES 0 ERRORS 12 WARNINGS 5 FILES_WITH_PROBLEMS |
| `@ilya/web` | `vitest run` | 6481 passed, 1 skipped (6482) | 6481 passed, 1 skipped (6482) |
| `@ilya/score-parser` | `vitest run` | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) |
| `@ilya/blurb` | `vitest run` | 178 passed (178) | 178 passed (178) |
| root integration | `vitest run --config vitest.config.ts` | 159 passed (159) | 159 passed (159) |
| ratchets | `node scripts/ratchets.mjs` | OK | `ratchets: OK.` |

Every count equals the baseline. The ratchet script also prints that `routes/+page.svelte` (5523 against a ceiling of 5534) and `musicxml-parser.ts` (1166 against 1167) could be lowered; that is not this lane's to do except where the brief says.

Playwright baseline on this tip: `e2e/voice-pane.test.ts`, 19 passed (19), with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` and `--trace off`.

## Line counts against `scripts/ratchets.json` (`wc -l`)

| File | Lines | Ceiling | Free |
|---|---|---|---|
| `routes/+page.svelte` | 5,523 | 5,534 | 11 |
| `lib/insights/InsightsPane.svelte` | 743 | 744 | 1 |
| `lib/components/Drawer/Drawer.svelte` | 1,983 | 1,990 | 7 |
| `lib/voice/CalibrationWizard.svelte` | 1,293 | 1,727 | 434 (stale; lowered at the end of the lane) |
| `lib/components/Drawer/VoicePane.svelte` | 142 | none (1,000 limit) | |
| `lib/voice/InsightsIntake.svelte` | 216 | none | |
| `lib/voice/seam.ts` | 59 | none | |
| `lib/insights/SingerBlock.svelte` | 606 | none | |

All match section 4 of the brief.

## Cites re-read on this tip

I read each of these lines in this session. Every one matched section 9 of the brief and the text the brief quotes.

- `seam.ts:14` kinds `'record' | 'summary' | 'characteristics'`; `:28-39` the commands (`voices`, `activeId`, `nextDefaultName`, `select`, `create`, `duplicate`, `rename`, `remove`, `setOwn`; no note setter); `:41` `Landing`; `:57-59` `requestRefused`.
- `CalibrationWizard.svelte`: `:122` `Phase`; `:330-340` the request effect; `:379-385` `CharacteristicField`; `:405-417` `setCharacteristic` (calls `touchVoice` at `:415`); `:429-439` the inverted-pair derivations; `:780-781` `calibratedAt ?? updatedAt`; `:786-798` the seam's publication; `:1008` `setOwn({ intake })`; imports `:59`, `:64`, `:71`.
- `profileStore.ts:163-166` `touchVoice`: `calibratedAt ??= updatedAt`, then `updatedAt` moves.
- `sections.svelte.ts:62` `UNPERSISTED_STATIONS = ['notation']`; `:70` `STATION_IDS`.
- `routes/+page.svelte`: `:340` `unpersisted: UNPERSISTED_STATIONS`; `:362`, `:367`; `:1651-1656` the stale comment; `:1664-1672` `openVoice`; `:3187` `sections.reveal(BAND_IDS.input)`; `:3604` `sections.exclusive = isMobile`; `:3900-3910`; `:4179-4180` the `<VoicePane` lines; `:4358` `onaddrange={() => openVoice('characteristics')}`.
- `Drawer.svelte`: `:148-152` prop comment; `:373-387` the stow and the `requestAnimationFrame` restore (write at `:383-385`); `:389-393` effect comment; `:394-414` the reveal effect (looks only for `[data-band-head="analysis"]`; returns while the takeover is up, `:401`); `:448` `class:stowed={takeoverActive}`; `:550-556` the VOICE band; `:973-979` the "THE TWO SCROLLS ... Do not add a third scroll here" comment.
- `reveal-scroll.ts:8-11` the header; `:38` `if (input.phone) return 0;`; `:39-42` the desk rule.
- `InsightsIntake.svelte`: `:3` "one panel"; `:33` `BEFORE_TOPICS`; `:34` `TOPICS`; `:39-40` count and intro (the count today is `BEFORE_TOPICS.length + 2`, seven); `:43-51` `tidy`; `:53-59`, `:113`, `:123` the whole-object writes.
- `SingerBlock.svelte`: `:81-84` the `silence` block; `:88` "Add your range"; `:165-170` the notes block and `{block.method}`; `:562-568` `.offer-link`; `:593-606` the print rules.
- `InsightsPane.svelte`: `:288-293` `methodLine`; `:326-330` the no-score block list. `identity.ts:66-70` `methodLineKey`.
- `i18n.ts`: `:168` `group.input`; `:1285`, `:1287`, `:1415` already marked UNUSED (lane 60 Step 5); `:1429-1434` the door keys; `:1443` `.title`; `:1444` `.lede`; `:1458` `.doneButton`; `:1874` `insights.generic.lede`; `:1876-1877`, `:1884` the three generic method keys; `:1881` `insights.silence.noScore`; `:2165` `voiceIntake.intro`; `:2169` `voiceIntake.count.5` ("Five" / "Cinq").
- `GuideContent.svelte:85` (French) and `:389` (English): both say the characteristics are entered "from the profile summary" / « depuis le sommaire du profil ».

## How lane 60 built the pane, its doors, and the seam

- `VoicePane.svelte` (142 lines) renders the published seam only. With no voice saved it draws nothing but the first-launch form (`ProfileSwitcher`). With a voice it draws, in order: the switcher, the voice-type control (`.vp-type`, which opens `VoiceTypeIntake` in place), the sentence (`paneSentence`), and four doors in `.vp-doors`: record (named by `recordDoorKey(usable)`), "Your vowel space" (when `showVowelSpaceDoor`), and the two doors at `:69-70`, both calling `onopen('characteristics')`. That is the pair Step 1 removes.
- `voice-pane.ts` holds the sentence states, `recordDoorKey` (`:61-63`), and the vowel-space rule.
- `seam.ts` is the one object the wizard publishes (`CalibrationWizard.svelte:786-798`) and the one request the page sends (`calibrationRequest`, `openVoice`). `requestRefused(phase, req)` refuses only the capture screen when the request did not come from rest. The wizard answers each request `n` once (`answeredRequest`).
- The page's `openVoice` today always ends in `enterCalibration()` (`:1671`), which is why Step 2 needs `openStation` beside it.

## What I could not establish at Step 0

- Whether the `requestAnimationFrame` restore at `Drawer.svelte:383-385` overwrites a reveal asked for in the same turn as the exit. Read from the code; Step 2 tests it in a browser.
- Whether six staves fit a 390 px pane. Step 1's pictures answer it.
- Whether a link in the notes block changes the INSIGHTS page fill or the print. Step 3 answers it.
