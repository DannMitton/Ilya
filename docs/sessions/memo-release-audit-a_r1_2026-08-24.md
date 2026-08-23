# MEMO. Release re-audit, half A: the ratified line's behaviour clauses

Run 2026-08-24 by an Opus subagent from the desk, on Dann's ruling. Read-only
against the tree at or after `e71e974`. Companion:
`memo-release-audit-b_r1_2026-08-24.md`. The agent's text follows verbatim.

---

Every path below is repository-relative, and every line number was opened in
this session against today's tree. Tooling note: `grep` on the owner's machine
is GNU grep 3.7 at `/usr/bin/grep`, not a ugrep shim, and it does not honour
`.gitignore`. Absence claims about `print-color-adjust` were confirmed a second
time through `find | xargs grep`. The directory `apps/web/src/lib 2` exists and
is empty, so nothing cites it.

## 1a. Custom glosses survive re-transcription

**Finding: the defect is repaired, and the repair is deliberate and documented.**

The transcribe handler is `handleTranscribe`, spanning
`apps/web/src/routes/+page.svelte:633-670`. Its body is: a `canTranscribe`
guard, `resetSessionState()`, `runPipeline()`, `keepSurvivingGlosses()`, then
the breath animation, the console group, and a focus call. It never touches
`doc.glossOverrides` or `doc.glossAnchors`.

- `resetSessionState()` at `+page.svelte:624-632` clears `transcribeError`,
  `selectedWord`, `lastFocusedWord`, `spotReconstitution`,
  `userStressOverrides`, `yoToggles`, and `syllableOverrides`. No gloss field
  appears in it.
- `keepSurvivingGlosses()` at `+page.svelte:821-836` rebuilds both maps,
  keeping a gloss only where
  `glossAnchorForm(word.cleanWord) === glossAnchorForm(anchor)` at `:829`. The
  fold is lowercase plus ё→е at `:815-817`.
- The only `new Map()` assignments to those two fields are in `handleClear` at
  `+page.svelte:676-677`, which is the Clear action, not a transcription.

Every other caller of `runPipeline` was checked for a bypass.
`handleStressAssign` (`:755`), `handleStressRevert` (`:764`),
`handleYoCharToggle` (`:778`), `handleReset` (`:881`), and
`handleLanguageChange` (`:1552`) all call `runPipeline()` without
`keepSurvivingGlosses()`, which is correct: they do not replace the poem, so no
anchor can move. `switchSong` at `+page.svelte:1349-1381` calls
`resetSessionState()` at `:1360` and then `runPipeline();
keepSurvivingGlosses();` at `:1375-1376`, the same pair. Boot deliberately does
not call the guard, and the reason is recorded at `+page.svelte:1828-1831`.

Per-word gloss removal at `+page.svelte:873-880` drops the anchor with the
gloss, so no orphan anchor survives.

## 1b. The Guide's claims about the interface

Twelve concrete factual claims sampled from
`apps/web/src/lib/components/Reading/GuideContent.svelte` (English strand; the
French strand at `:93`, `:176`, and `:33` carries the same two structural
errors word for word).

| # | Claim (path:line) | Verdict | Citation that decides it |
|---|---|---|---|
| 1 | "The four tabs at the bottom navigate between Ilya's four areas: Transcription, Fit, Learn, and Guide." (`GuideContent.svelte:368`) | **FALSE** | Navigation is `DeskHead`, mounted at `+page.svelte:2278` ("one line across the top of the desk, above the sheet", `:2274-2277`). `DeskHead.svelte:2-6` records that it replaced `Drawer/TabBar.svelte`, including its fixed footer on the phone. The second name is not Fit: `DeskHead.svelte:52` returns `T('tab.markedScore')`, and `:49-51` states "It is not called Fit here." |
| 2 | "The Transcription tab is organised into three sections: Metadata, Analysis, and Notation." (`GuideContent.svelte:368`) | **FALSE** | `Drawer/sections.svelte.ts:60-67` declares six station ids: `piece`, `notation`, `source`, `songs`, `analysis`, `shiftLyrics`. Labels: Metadata (`i18n.ts:86`), Notation (`:99`), Source (`:204`), Analysis (`:207`), Repertoire (`:861`), Shift Lyrics (`:695`). |
| 3 | "The Drawer Handle is the semicircle at the centre left of the screen." (`GuideContent.svelte:378`) | **FALSE** | The handle is a squircle bookmark tab, 20 px wide and 152 px tall: `Drawer.svelte:118` and `:127`, shape described at `:1042-1045`. |
| 4 | "The Handle's colour reflects the active tab." (`GuideContent.svelte:378`) | **FALSE** | Fill is the drawer's own paper, `Drawer.svelte:1003-1006`; outline a fixed grey, `:1008-1011` against `--lip-grey: #D2CFCC` at `:979`. `data-tab` is still written at `:299` but `:16-17` records that nothing reads it, confirmed by search. |
| 5 | "The LEARN module ... organised into eight sections. The table of contents appears in the Drawer." (`GuideContent.svelte:385`) | **TRUE** | TOC nav at `Drawer.svelte:343-344`. Units 1 to 7 at `:366` through `:474`, section 8 at `:492-499`, resolving to `LearnContent.svelte:4039`. |
| 6 | "Ilya processes the text against its 943,000-entry dictionary." (`GuideContent.svelte:407`) | **TRUE** | The two stress shards hold 471,552 NDJSON records each, 943,104 together. `pipeline.ts:554` names 943,096. |
| 7 | "The Notation section of the Drawer contains seven toggles." (`GuideContent.svelte:451`) | **TRUE** | Seven `role="switch"` buttons in `NotationFields.svelte` at lines 116 to 200. |
| 8 | "Click Dictionary to make the gloss field editable. The field accepts up to twenty characters." (`GuideContent.svelte:436`) | **TRUE** | `InspectorPanel.svelte:984-991`, `:845-847`, input at `:1033-1040` with `maxlength="20"`, re-clamped at `:851`. |
| 9 | "Custom glosses persist through re-transcriptions ... unless the specific word beneath a gloss changes" (`GuideContent.svelte:436`) | **TRUE** | Section 1a above. |
| 10 | "Ilya does not save transcriptions, retaining between sessions only current work that is underway" (`GuideContent.svelte:307`; restated `:446`) | **FALSE** | Ilya now keeps exactly such a catalogue: `library/songs.ts:1-16` (list, create, rename, delete, switch, recognize), the Repertoire station at `SongList.svelte:114-167`, songs switched by id at `+page.svelte:1349`. |
| 11 | "Click Reset to clear the metadata fields while retaining the Russian text ... Click Clear text to start fresh." (`GuideContent.svelte:461`) | **TRUE** | `MetadataFields.svelte:76-78`, `:155-159`; `RootPanel.svelte:333-335`; `handleClear` at `+page.svelte:671-681`. |
| 12 | "Ilya already offers an OCR component where users can photograph Cyrillic text" (`GuideContent.svelte:327`) | **TRUE** | `RootPanel.svelte:134-140` (tesseract.js, `'rus'` worker), dependency at `apps/web/package.json:25`. |

Beside the table:

- **The Spot reconstitution checkbox is real but misplaced in the Guide's
  account.** `GuideContent.svelte:431` places it in the Dictionary panel; it
  sits in the word-header block at `InspectorPanel.svelte:1010-1015`, outside
  the `{#if dictPanelOpen}` guard beginning at `:1023`.
- **The Guide's alt text describes a control that no longer exists.**
  `GuideContent.svelte:372` describes a two-option language toggle; there is
  one control naming the language you are not in (`HeaderBar.svelte:45`,
  reasoning at `:13-26`).

**Kind of defect.** Nine of twelve hold. The three failures are one kind: the
Guide describes a build that the desk head, the station set, and the library
have replaced. Claim 10 is the most serious: a privacy-adjacent promise about
what Ilya keeps, and the app now keeps more than the promise allows.

## 2. Calibration through a gate that measures

**Finding: the gate exists, it measures through the live microphone, and no
shipped capture path reaches a stub.**

There is no `lib/shane/calibration/` directory; the code is
`lib/shane/CalibrationWizard.svelte` plus `lib/shane/engine/`. The chain:

1. `+page.svelte:2011-2031` mounts `<CalibrationWizard>` with no `session`
   prop.
2. `CalibrationWizard.svelte:202` takes the default `new LiveCaptureSession()`;
   `:197-201` records that construction touches no browser API and
   `getUserMedia` is requested only inside `start()` and `startReadiness()`.
3. Readiness: `beginReadiness()` at `CalibrationWizard.svelte:671-684` calls
   `captureSession.startReadiness({...})`; implementation `engine/live.ts:246`
   on the class at `:193`, single `getUserMedia` owner at `:337`.
4. Vowel capture: the one `<Pacifier>` mount at
   `CalibrationWizard.svelte:1402-1412` passes `session={captureSession}`;
   `Pacifier.svelte:404` calls `session.start(...)`.

**The stub is latent, not live.** `Pacifier.svelte:88` defaults its `session`
to `new StubCaptureSession()`; the default is never taken in the shipped tree
(`<Pacifier` appears exactly once, always with the live session). A second
Pacifier mount added without a `session` prop would silently capture from the
stub.

**Two guards share the name "gate".** The readiness gate measures but never
blocks (`CalibrationWizard.svelte:540-542`, `:682-683`); its finding is
written failure-silent at `:662-668`. The plausibility guard runs on every
capture: `withPlausibility` at `:293-310`, called from `handleVowelCaptured` at
`:773-774`; an implausible reading is demoted to `provisional` at `:301-302`,
never discarded. `handleProfileChange` at `:821-853` was the path that used to
erase the verdict; the fix at `:842-847` keeps the guarded copy whenever
`sameExtraction` matches.

## 3. A Fit result that never guesses where calibration is absent

**Finding: absent calibration renders as an explicit withheld statement on its
own printed sheet, not as invented numbers.**

The branch is `VoiceProfilePane.svelte:573`:
`const showWithheld = $derived(!adapted.completeness.formants);` resolved
through `completenessOf` at `analyze-score-adapter.ts:74-81` (`formants` is
`Object.keys(s.fR1).length > 0` at `:76`). The comment at
`VoiceProfilePane.svelte:556-562` is explicit that the test is the profile and
not the events.

- The commentary sheet exists for it: `:621` makes `hasCommentaryPage` true
  when `showWithheld`, intent at `:616-620`.
- The statement prints: `:770-785`, strings at `i18n.ts:652-656` and `:897`,
  both languages.
- The provenance legend suppresses itself for an uncalibrated profile
  (`:284-287`).

Related change since August: **the Print button is no longer disabled
anywhere.** `+page.svelte:562-567` records `printDisabled` deleted on Dann's
ruling of 2026-08-21. An uncalibrated marked score prints, and the sheet says
what is withheld, which is consistent with the clause.

## 4. What governs colour on paper

**Finding: nothing in the source governs it. There is no rule that forces
greyscale, and no rule that preserves colour.**

- `print-color-adjust`, `-webkit-print-color-adjust`, `filter: grayscale`:
  zero matches in `apps/web/src`, `packages/*/src`, `apps/web/static`.
- `filter:` appears four times, all screen-only (`Drawer.svelte:725`, `:1505`,
  `+page.svelte:3266`, one comment).
- All 18 `@media print` blocks in `apps/web/src` were opened. **Not one sets
  `color`.** They whiten grounds and neutralize layout: the authoritative
  reset at `app.css:185-297` (`--paper-cream: #ffffff` at `:186-188`,
  `body { background: white }` at `:204-206`, `@page { margin: 0; size:
  letter }` at `:293-296`); chrome-hiders at `DeskHead.svelte:245-249`,
  `ReadingAid.svelte:176-180`, `InstallPrompt.svelte:171`,
  `PageFit.svelte:106-120`, `Paper.svelte:124-130`, `+layout.svelte:19-25`,
  and four blocks in `+page.svelte`; `background: white` repeats in
  `SubsequentPage.svelte:136-141`, `TitlePage.svelte:243-252`,
  `VoiceProfilePane.svelte:1198-1203`, `WordStack.svelte:376-387`.

**What this means.** With `print-color-adjust: exact` absent, every browser
applies its print default: background colours and background images are
dropped, foreground paint is kept. Ilya's screen colour is overwhelmingly
background colour, so it falls away on paper and nothing asks for it back.
Colour that survives is foreground: an `<img>`, or an SVG `fill`. The marked
score's turning-pitch noteheads are the second kind
(`packages/score-parser/src/staff-renderer.ts:293`, `TURNING_COLOUR =
'#8B9A7D'` as an SVG `fill`, asserted at `staff-renderer.test.ts:235`).

Preserving colour on paper is additive, not corrective: there is no greyscale
rule to remove. Guaranteeing the current behaviour would also be a new rule.

## What I could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- **The identity of the one flag image that prints in colour.** No flag asset
  and no flag emoji was found in `apps/web/src` or `apps/web/static`; the only
  `<img>` outside the Guide's screenshots is
  `/images/russian-alphabet-song.png` (`LearnContent.svelte:54`, `:2103`).
  (Resolved by half B: the flag is an inline SVG embedded in the footer's
  attribution strings, `i18n.ts:231-232`.)
- **Whether the transcription paper "prints exactly as it appears on screen"**
  (`GuideContent.svelte:459`). Needs a rendered print preview. The print reset
  flattens `--paper-cream` to white, so the ground deliberately differs; the
  geometry comments at `app.css:240-250` argue the metrics are preserved.
- **Whether Learn and Guide are printable at all.** `ReadingPaper.svelte:505`
  carries a print block; whether any control reaches `window.print()` from
  those destinations was not traced.
- **The exact shipped dictionary entry count as distinct from the record
  count.** 943,104 records counted; `pipeline.ts:554` says 943,096; homographs
  are array-valued (`loader.ts:415`, `:517-524`); the difference of eight was
  not reconciled.
- **Whether the plausibility guard's demotion reaches storage in a live
  session.** The fix is readable; its evidence line cites a measurement on
  `b6d2828`. Re-confirming needs a run, not a read.
